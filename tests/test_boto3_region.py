"""
Garante que nenhuma instanciação de boto3.resource/client ocorre sem region_name,
prevenindo botocore.exceptions.NoRegionError em ambientes sem AWS_REGION configurado.
"""
import importlib
import os
import sys
from unittest.mock import MagicMock, call, patch

import pytest

# Adiciona o projeto e functions/ ao path para imports diretos
PROJECT_ROOT = os.path.dirname(os.path.dirname(__file__))
FUNCTIONS_DIR = os.path.join(PROJECT_ROOT, "functions")
for p in (PROJECT_ROOT, FUNCTIONS_DIR):
    if p not in sys.path:
        sys.path.insert(0, p)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _make_dynamodb_mock():
    """Mock mínimo de boto3.resource para o handler não quebrar na execução."""
    mock_resource = MagicMock()
    mock_table = MagicMock()
    mock_resource.return_value.Table.return_value = mock_table
    mock_table.get_item.return_value = {"Item": {"sub": "u1", "email": "u@test.com"}}
    # create_table retorna objeto com wait_until_exists
    mock_created_table = MagicMock()
    mock_resource.return_value.create_table.return_value = mock_created_table
    return mock_resource


def _import_fresh(module_name: str):
    """Remove o módulo do cache e reimporta, forçando re-execução do nível de módulo."""
    sys.modules.pop(module_name, None)
    return importlib.import_module(module_name)


# ---------------------------------------------------------------------------
# handler.py  (boto3.resource chamado dentro de uma função)
# ---------------------------------------------------------------------------

class TestHandlerRegion:
    BASE_EVENT = {"sub": "u1", "email": "u@test.com"}

    def _run(self, env: dict) -> MagicMock:
        mock_resource = _make_dynamodb_mock()
        clean_env = {k: v for k, v in os.environ.items()
                     if k not in ("AWS_REGION", "AWS_DEFAULT_REGION",
                                  "DYNAMODB_ENDPOINT_URL", "DYNAMODB_HOST")}
        clean_env.update(env)
        with patch.dict(os.environ, clean_env, clear=True):
            with patch("boto3.resource", mock_resource):
                import handler as h
                h.handler(self.BASE_EVENT, {})
        return mock_resource

    def test_sem_env_vars_usa_fallback_sa_east_1(self):
        mock = self._run({})
        _, kwargs = mock.call_args
        assert kwargs.get("region_name") == "sa-east-1"

    def test_aws_region_definido_e_usado(self):
        mock = self._run({"AWS_REGION": "us-east-1"})
        _, kwargs = mock.call_args
        assert kwargs.get("region_name") == "us-east-1"

    def test_com_endpoint_url_ainda_tem_region(self):
        mock = self._run({"DYNAMODB_ENDPOINT_URL": "http://localhost:8000"})
        _, kwargs = mock.call_args
        assert kwargs.get("region_name") is not None, "region_name ausente com endpoint_url"

    def test_com_host_porta_ainda_tem_region(self):
        mock = self._run({"DYNAMODB_HOST": "localhost", "DYNAMODB_PORT": "8000"})
        _, kwargs = mock.call_args
        assert kwargs.get("region_name") is not None, "region_name ausente com DYNAMODB_HOST"

    def test_region_name_nunca_ausente(self):
        """Propriedade geral: independente do cenário, region_name é sempre fornecido."""
        cenarios = [
            {},
            {"AWS_REGION": "eu-west-1"},
            {"DYNAMODB_ENDPOINT_URL": "http://localhost:8000"},
            {"DYNAMODB_HOST": "db", "AWS_REGION": "ap-southeast-1"},
        ]
        for env in cenarios:
            mock = self._run(env)
            _, kwargs = mock.call_args
            assert "region_name" in kwargs, f"region_name ausente para env={env}"


# ---------------------------------------------------------------------------
# shared/db.py  (boto3.resource chamado em nível de módulo)
# ---------------------------------------------------------------------------

class TestDbRegion:
    def _import_db(self, env: dict):
        """Importa shared.db com env vars controladas, capturando a chamada ao boto3."""
        mock_resource = MagicMock()
        clean_env = {k: v for k, v in os.environ.items()
                     if k not in ("AWS_REGION",)}
        clean_env.update(env)
        with patch.dict(os.environ, clean_env, clear=True):
            with patch("boto3.resource", mock_resource):
                _import_fresh("shared.db")
        return mock_resource

    def test_sem_env_vars_usa_fallback_sa_east_1(self):
        mock = self._import_db({})
        _, kwargs = mock.call_args
        assert kwargs.get("region_name") == "sa-east-1"

    def test_aws_region_definido_e_usado(self):
        mock = self._import_db({"AWS_REGION": "us-west-2"})
        _, kwargs = mock.call_args
        assert kwargs.get("region_name") == "us-west-2"

    def test_region_name_nunca_ausente(self):
        for env in [{}, {"AWS_REGION": "eu-central-1"}]:
            mock = self._import_db(env)
            _, kwargs = mock.call_args
            assert "region_name" in kwargs, f"region_name ausente para env={env}"
