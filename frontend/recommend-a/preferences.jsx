// preferences.jsx — settings/preferences screen

const SectionCard = ({ title, helper, children }) => (
  <div className="card" style={{ padding: 24 }}>
    <h3 style={{
      margin: 0, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17,
    }}>{title}</h3>
    {helper && (
      <p style={{ margin: '6px 0 18px', fontSize: 13, color: 'var(--color-text-secondary)' }}>{helper}</p>
    )}
    <div style={{ marginTop: helper ? 0 : 14 }}>{children}</div>
  </div>
);

const PreferencesScreen = ({ onNav }) => {
  const [services, setServices] = React.useState(['netflix', 'prime', 'mubi']);
  const [moods, setMoods] = React.useState(['thoughtful', 'chill']);
  const [rating, setRating] = React.useState('R');

  const toggle = (arr, set, val) => {
    set(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <DesktopRail active="settings" onNav={onNav}/>
      <div style={{
        position: 'absolute', inset: 0, paddingLeft: 'var(--rail-w)', overflowY: 'auto',
      }} className="no-scrollbar">
        <div style={{ maxWidth: 880, margin: '0 auto', padding: '40px 40px 60px' }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Account</div>
          <h1 className="display" style={{ margin: 0, fontSize: 36, fontWeight: 800 }}>Preferences</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 14, marginTop: 8, marginBottom: 32 }}>
            Tune the recommendations. Changes save automatically.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <SectionCard title="Streaming services"
              helper="Only suggest things on services you actually have.">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {STREAMING_SERVICES.map(s => (
                  <ServiceChip key={s.id} svc={s}
                    active={services.includes(s.id)}
                    onClick={() => toggle(services, setServices, s.id)}/>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Default mood"
              helper="What you usually want. You can override per recommendation.">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {MOODS.map(m => (
                  <MoodChip key={m.id} mood={m}
                    active={moods.includes(m.id)}
                    onClick={() => toggle(moods, setMoods, m.id)}/>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Maximum age rating"
              helper="We won't go beyond this.">
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {RATINGS.map(r => (
                  <button key={r}
                    onClick={() => setRating(r)}
                    className={`chip ${rating === r ? 'active' : ''}`}
                    style={{ minWidth: 64, justifyContent: 'center' }}>
                    {r}
                  </button>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Account">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  paddingBottom: 14, borderBottom: '1px solid var(--color-border)' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>Email</div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2 }}>
                      june@example.com
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 4 }}>
                      Email changes require confirmation from both old and new addresses.
                    </div>
                  </div>
                  <button className="btn btn-secondary btn-sm">Change</button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  paddingBottom: 14, borderBottom: '1px solid var(--color-border)' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>Password</div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2 }}>
                      Last changed 4 months ago
                    </div>
                  </div>
                  <button className="btn btn-secondary btn-sm">Change</button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>Sign out</div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2 }}>
                      You'll need to sign back in to see your queue.
                    </div>
                  </div>
                  <button className="btn btn-danger btn-sm">
                    <I.Logout size={14}/>Sign out
                  </button>
                </div>
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { PreferencesScreen });
