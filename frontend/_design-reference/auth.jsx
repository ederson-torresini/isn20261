// auth.jsx — Login, Register, Forgot password (3 states)

const AuthShell = ({ children, footer }) => (
  <div style={{
    position: 'relative', width: '100%', height: '100%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden', background: 'var(--color-bg)',
  }}>
    {/* Subtle backdrop */}
    <div style={{
      position: 'absolute', inset: 0,
      background: 'radial-gradient(ellipse 70% 50% at 50% 30%, rgba(245,181,68,.08), transparent 60%)',
    }}/>
    <div className="grain" style={{ position: 'absolute', inset: 0, opacity: .4 }}/>
    <div style={{
      position: 'relative', width: 'min(420px, calc(100% - 40px))',
      padding: '40px 32px',
      background: 'rgba(20,20,22,.75)',
      border: '1px solid var(--color-border)',
      borderRadius: 18,
      backdropFilter: 'blur(14px)',
      boxShadow: 'var(--shadow-lg)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
        <BrandMark size={36}/>
      </div>
      {children}
    </div>
    {footer && (
      <div style={{
        position: 'absolute', bottom: 24, left: 0, right: 0, textAlign: 'center',
        color: 'var(--color-text-muted)', fontSize: 12,
      }}>{footer}</div>
    )}
  </div>
);

const Field = ({ label, type = 'text', value, onChange, error, hint, rightSlot }) => {
  const [show, setShow] = React.useState(false);
  const isPw = type === 'password';
  const actualType = isPw && show ? 'text' : type;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div className="input-wrap">
        <input className={`input ${error ? 'error' : ''}`}
          type={actualType}
          placeholder=" "
          value={value}
          onChange={e => onChange(e.target.value)}/>
        <label className="input-label">{label}</label>
        {isPw && (
          <button type="button" onClick={() => setShow(s => !s)}
            style={{
              position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
              color: 'var(--color-text-muted)', padding: 4,
            }}>
            {show ? <I.EyeOff size={16}/> : <I.Eye size={16}/>}
          </button>
        )}
        {rightSlot}
      </div>
      {error ? (
        <div style={{ fontSize: 11, color: 'var(--color-danger)' }}>{error}</div>
      ) : hint ? (
        <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{hint}</div>
      ) : null}
    </div>
  );
};

const LoginScreen = ({ onLogin, onNav }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errors, setErrors] = React.useState({});

  const submit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!email.includes('@')) errs.email = 'Enter a valid email';
    if (password.length < 6) errs.password = 'Min 6 characters';
    setErrors(errs);
    if (!Object.keys(errs).length) onLogin?.();
  };

  return (
    <AuthShell footer="Recommend·a is a fictional concept design.">
      <h1 className="display" style={{ margin: 0, fontSize: 26, textAlign: 'center' }}>Welcome back.</h1>
      <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: 13, margin: '6px 0 26px' }}>
        Pick up your queue and history.
      </p>
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Field label="Email" type="email" value={email} onChange={setEmail} error={errors.email}/>
        <Field label="Password" type="password" value={password} onChange={setPassword} error={errors.password}/>
        <div style={{ textAlign: 'right', marginTop: -4 }}>
          <button type="button" onClick={() => onNav?.('forgot')}
            style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
            Forgot password?
          </button>
        </div>
        <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: 6 }}>
          Sign in <I.Arrow size={16}/>
        </button>
      </form>
      <div style={{ textAlign: 'center', marginTop: 18, fontSize: 13, color: 'var(--color-text-secondary)' }}>
        New here?{' '}
        <button onClick={() => onNav?.('register')} style={{ color: 'var(--color-accent)', fontWeight: 600 }}>
          Create an account
        </button>
      </div>
    </AuthShell>
  );
};

const RegisterScreen = ({ onLogin, onNav }) => {
  const [email, setEmail] = React.useState('');
  const [pw1, setPw1] = React.useState('');
  const [pw2, setPw2] = React.useState('');
  const [agree, setAgree] = React.useState(false);
  const [errors, setErrors] = React.useState({});

  const submit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!email.includes('@')) errs.email = 'Enter a valid email';
    if (pw1.length < 8) errs.pw1 = 'Use at least 8 characters';
    if (pw1 !== pw2) errs.pw2 = "Passwords don't match";
    if (!agree) errs.agree = 'Required';
    setErrors(errs);
    if (!Object.keys(errs).length) onLogin?.();
  };

  return (
    <AuthShell>
      <h1 className="display" style={{ margin: 0, fontSize: 26, textAlign: 'center' }}>Make it yours.</h1>
      <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: 13, margin: '6px 0 26px' }}>
        Save recommendations, build a queue, learn what you love.
      </p>
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Field label="Email" type="email" value={email} onChange={setEmail} error={errors.email}/>
        <Field label="Password" type="password" value={pw1} onChange={setPw1} error={errors.pw1} hint="At least 8 characters"/>
        <Field label="Confirm password" type="password" value={pw2} onChange={setPw2} error={errors.pw2}/>
        <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 4 }}>
          <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)}
            style={{ accentColor: 'var(--color-accent)', marginTop: 2 }}/>
          <span>I agree to the Terms and Privacy Policy.</span>
        </label>
        {errors.agree && <div style={{ fontSize: 11, color: 'var(--color-danger)', marginTop: -8 }}>{errors.agree}</div>}
        <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: 4 }}>
          Create account <I.Arrow size={16}/>
        </button>
      </form>
      <div style={{ textAlign: 'center', marginTop: 18, fontSize: 13, color: 'var(--color-text-secondary)' }}>
        Already have one?{' '}
        <button onClick={() => onNav?.('login')} style={{ color: 'var(--color-accent)', fontWeight: 600 }}>
          Sign in
        </button>
      </div>
    </AuthShell>
  );
};

const ForgotScreen = ({ onNav }) => {
  const [step, setStep] = React.useState(0); // 0 = email, 1 = sent, 2 = new password
  const [email, setEmail] = React.useState('');
  const [pw1, setPw1] = React.useState('');
  const [pw2, setPw2] = React.useState('');
  const [resendIn, setResendIn] = React.useState(30);

  React.useEffect(() => {
    if (step !== 1) return;
    setResendIn(30);
    const t = setInterval(() => setResendIn(r => Math.max(0, r-1)), 1000);
    return () => clearInterval(t);
  }, [step]);

  const strength = (() => {
    let s = 0;
    if (pw1.length >= 8) s++;
    if (/[A-Z]/.test(pw1)) s++;
    if (/[0-9]/.test(pw1)) s++;
    if (/[^A-Za-z0-9]/.test(pw1)) s++;
    return s;
  })();
  const strengthLabel = ['Too short', 'Weak', 'Okay', 'Strong', 'Excellent'][strength];

  return (
    <AuthShell>
      {step === 0 && (
        <>
          <h1 className="display" style={{ margin: 0, fontSize: 24, textAlign: 'center' }}>Reset password</h1>
          <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: 13, margin: '6px 0 26px' }}>
            We'll send a one-time link to your inbox.
          </p>
          <form onSubmit={e => { e.preventDefault(); setStep(1); }}
            style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Field label="Email" type="email" value={email} onChange={setEmail}/>
            <button type="submit" className="btn btn-primary btn-lg">Send reset link</button>
          </form>
        </>
      )}
      {step === 1 && (
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'var(--color-accent-soft)', color: 'var(--color-accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
          }}>
            <I.Check size={28}/>
          </div>
          <h1 className="display" style={{ margin: 0, fontSize: 24 }}>Check your email</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 13, margin: '6px 0 22px', textWrap: 'pretty' }}>
            We sent a reset link to <span style={{ color: 'var(--color-text-primary)' }}>{email || 'you@example.com'}</span>.
            It expires in 15 minutes.
          </p>
          <button className="btn btn-primary btn-lg" style={{ width: '100%' }}
            onClick={() => setStep(2)}>I've reset it — set new password</button>
          <div style={{ marginTop: 14, fontSize: 12, color: 'var(--color-text-muted)' }}>
            {resendIn > 0 ? `Resend in ${resendIn}s` : (
              <button onClick={() => setStep(1)}
                style={{ color: 'var(--color-accent)', fontWeight: 600 }}>Resend email</button>
            )}
          </div>
        </div>
      )}
      {step === 2 && (
        <>
          <h1 className="display" style={{ margin: 0, fontSize: 24, textAlign: 'center' }}>New password</h1>
          <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: 13, margin: '6px 0 26px' }}>
            Choose something memorable but tough to guess.
          </p>
          <form onSubmit={e => { e.preventDefault(); onNav?.('login'); }}
            style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Field label="New password" type="password" value={pw1} onChange={setPw1}/>
            <div style={{ display: 'flex', gap: 4, marginTop: -4 }}>
              {[0,1,2,3].map(i => (
                <div key={i} style={{
                  flex: 1, height: 3, borderRadius: 2,
                  background: i < strength ?
                    (strength <= 1 ? 'var(--color-danger)' : strength <= 2 ? 'var(--color-warning)' : 'var(--color-success)')
                    : 'var(--color-border)',
                  transition: 'background .2s',
                }}/>
              ))}
            </div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: -8 }}>
              {pw1 ? `Strength: ${strengthLabel}` : 'At least 8 characters'}
            </div>
            <Field label="Confirm new password" type="password" value={pw2} onChange={setPw2}
              error={pw2 && pw1 !== pw2 ? 'Passwords do not match' : null}/>
            <button type="submit" className="btn btn-primary btn-lg">Save & sign in</button>
          </form>
        </>
      )}
      <div style={{ textAlign: 'center', marginTop: 18, fontSize: 13, color: 'var(--color-text-secondary)' }}>
        <button onClick={() => onNav?.('login')} style={{ color: 'var(--color-text-secondary)' }}>
          ← Back to sign in
        </button>
      </div>
    </AuthShell>
  );
};

Object.assign(window, { LoginScreen, RegisterScreen, ForgotScreen });
