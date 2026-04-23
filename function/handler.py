from datetime import datetime
import json
import os
import boto3
from botocore.exceptions import ClientError


def handler(event, context):
    host = os.environ.get("DYNAMODB_HOST", "dynamodb-local")
    port = os.environ.get("DYNAMODB_PORT", "8000")
    key_id = os.environ.get("AWS_ACCESS_KEY_ID", "fake")
    secret_key = os.environ.get("AWS_SECRET_ACCESS_KEY", "fake")
    region = os.environ.get("AWS_REGION", "local")
    table_name = os.environ.get("DYNAMODB_TABLE", "isn20261")
    dynamodb = boto3.resource(
        "dynamodb",
        endpoint_url=f"http://{host}:{port}",
        aws_access_key_id=key_id,
        aws_secret_access_key=secret_key,
        region_name=region,
    )
    table = dynamodb.Table(table_name)

    tables = [
        {
            "TableName": table_name,
            "AttributeDefinitions": [{"AttributeName": "sub", "AttributeType": "S"}],
            "KeySchema": [{"AttributeName": "sub", "KeyType": "HASH"}],
            "BillingMode": "PAY_PER_REQUEST",
        }
    ]

    for definition in tables:
        try:
            dynamodb.create_table(**definition)
        except ClientError as e:
            if e.response["Error"]["Code"] == "ResourceInUseException":
                print(f"⚠️  Tabela '{definition['TableName']}' já existe")
            else:
                raise

    item = {
        "sub": event.get("sub"),
        "email": event.get("email", "")
    }

    table.put_item(Item=item)
    result = table.get_item(Key={"sub": event.get("sub")})
    saved_item = result.get("Item", {})

    return {
        "statusCode": 200,
        "body": json.dumps(saved_item),
        "headers": {"Content-Type": "application/json"},
    }
