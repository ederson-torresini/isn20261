// home.jsx — Homepage variants (logged-in & logged-out)

const HomeBackdrop = ({ variant = 'collage' }) => {
  // Pick 6 movies for collage tiles
  const tiles = MOVIES.slice(0, 6);
  if (variant === 'gradient') {
    return (
      <div style={{
        position: 'absolute', inset: 0, overflow: 'hidden',
        background: 'radial-gradient(ellipse 120% 80% at 50% 30%, rgba(245,181,68,.18) 0%, transparent 55%), radial-gradient(circle at 80% 70%, rgba(120,80,180,.15) 0%, transparent 50%), var(--color-bg)',
      }}>
        <div className="grain" style={{ position: 'absolute', inset: 0 }}/>
      </div>
    );
  }
  if (variant === 'drift') {
    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: 'var(--color-bg)' }}>
        <div style={{
          position: 'absolute', top: '15%', left: '-5%', right: '-5%',
          display: 'flex', gap: 18, transform: 'rotate(-4deg)',
          opacity: .35, filter: 'blur(1px)',
        }}>
          {tiles.concat(tiles).map((m, i) => (
            <img key={i} src={posterUrl(m, 220, 320)} alt=""
              style={{ width: 140, height: 210, objectFit: 'cover', borderRadius: 8, flexShrink: 0,
                animation: `ra-fade ${1+i*.1}s ease both` }}/>
          ))}
        </div>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(10,10,11,.4) 0%, rgba(10,10,11,.85) 60%, var(--color-bg) 100%)',
        }}/>
      </div>
    );
  }
  // default: blurred collage
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: 'var(--color-bg)' }}>
      <div style={{
        position: 'absolute', inset: '-8%',
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8,
        filter: 'blur(40px) saturate(1.1)',
        opacity: .55,
      }}>
        {tiles.concat(tiles).slice(0, 8).map((m, i) => (
          <img key={i} src={posterUrl(m, 320, 460)} alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
        ))}
      </div>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 90% 80% at 50% 40%, rgba(10,10,11,.55) 0%, rgba(10,10,11,.92) 70%, var(--color-bg) 100%)',
      }}/>
      <div className="grain" style={{ position: 'absolute', inset: 0 }}/>
    </div>
  );
};

const HeroCTA = ({ onPick, picking, label = 'Pick a movie for me' }) => (
  <button onClick={onPick} disabled={picking}
    className="btn btn-primary btn-xl"
    style={{
      minWidth: 320,
      height: 76,
      fontSize: 17,
      letterSpacing: '-0.01em',
      boxShadow: '0 0 0 1px rgba(255,255,255,.05) inset, 0 18px 48px rgba(245,181,68,.35), 0 4px 14px rgba(245,181,68,.4)',
    }}>
    {picking ? <span className="spinner"/> : <I.Sparkle size={20}/>}
    {picking ? 'Searching the reels…' : label}
  </button>
);

const FilterBar = ({ filters, setFilters }) => {
  const toggle = (key, val) => {
    setFilters(f => {
      const cur = f[key] || [];
      const next = cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val];
      return { ...f, [key]: next };
    });
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
      <div className="eyebrow">Optional filters</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', maxWidth: 720 }}>
        {MOODS.map(m => (
          <MoodChip key={m.id} mood={m}
            active={filters.moods?.includes(m.id)}
            onClick={() => toggle('moods', m.id)}/>
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
        {STREAMING_SERVICES.slice(0, 6).map(s => {
          const active = filters.services?.includes(s.id);
          return (
            <button key={s.id} className={`chip ${active ? 'active' : ''}`}
              onClick={() => toggle('services', s.id)}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 11 }}>{s.glyph}</span>
              {s.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const MovieRail = ({ title, movies, onPick }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
      <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, letterSpacing: '-.01em' }}>
        {title}
      </h3>
      <button className="btn btn-ghost btn-sm">See all <I.Chevron size={12}/></button>
    </div>
    <div className="rail no-scrollbar">
      {movies.map(m => (
        <MovieCard key={m.id} movie={m} w={150} h={224} onClick={() => onPick?.(m)}/>
      ))}
    </div>
  </div>
);

// === Desktop home, default variant ===
const HomeDesktop = ({ loggedIn, onPick, onNav, picking, heroVariant = 'collage' }) => {
  const [filters, setFilters] = React.useState({ moods: [], services: [] });
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <HomeBackdrop variant={heroVariant}/>
      <DesktopRail active="home" onNav={onNav} loggedIn={loggedIn}/>
      <div style={{
        position: 'absolute', inset: 0, paddingLeft: 'var(--rail-w)',
        overflowY: 'auto',
      }} className="no-scrollbar">
        {/* Top bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '24px 40px',
        }}>
          <BrandMark/>
          {!loggedIn ? (
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-ghost" onClick={() => onNav?.('login')}>Sign in</button>
              <button className="btn btn-secondary" onClick={() => onNav?.('register')}>Create account</button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--color-text-secondary)', fontSize: 13 }}>
              <button style={{ color: 'inherit' }}><I.Bell size={18}/></button>
              <span>Hi, June</span>
            </div>
          )}
        </div>

        {/* Hero */}
        <div style={{
          minHeight: 520,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', padding: '40px 40px 60px', gap: 28,
          position: 'relative', zIndex: 1,
        }}>
          <div className="eyebrow">Tonight, on the couch</div>
          <h1 className="display-lg" style={{ margin: 0, maxWidth: 880 }}>
            One button. <span style={{ color: 'var(--color-accent)' }}>One movie</span>.<br/>
            Decided.
          </h1>
          <p style={{
            margin: 0, color: 'var(--color-text-secondary)',
            fontSize: 17, maxWidth: 560, lineHeight: 1.5,
          }}>
            Stop scrolling for forty minutes. We'll pick something good for you in three seconds.
          </p>
          <HeroCTA onPick={onPick} picking={picking}/>
          <FilterBar filters={filters} setFilters={setFilters}/>
        </div>

        {/* Logged-in rails or signup nudge */}
        <div style={{ padding: '0 40px 60px', display: 'flex', flexDirection: 'column', gap: 38 }}>
          {loggedIn ? (
            <>
              <MovieRail title="Continue from your watch later" movies={MOVIES.slice(2, 8)} onPick={onPick}/>
              <MovieRail title="Recently recommended" movies={MOVIES.slice(6, 12)} onPick={onPick}/>
            </>
          ) : (
            <div style={{
              border: '1px solid var(--color-border)',
              background: 'linear-gradient(135deg, rgba(245,181,68,.06), rgba(255,255,255,.02))',
              borderRadius: 16, padding: '28px 32px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24,
            }}>
              <div>
                <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20 }}>
                  Save what catches your eye.
                </h3>
                <p style={{ margin: '6px 0 0', color: 'var(--color-text-secondary)', fontSize: 14 }}>
                  Sign up and we'll remember every recommendation, build a watch later queue, and learn what you actually love.
                </p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-secondary" onClick={() => onNav?.('login')}>Sign in</button>
                <button className="btn btn-primary" onClick={() => onNav?.('register')}>Create account</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// === Mobile home ===
const HomeMobile = ({ loggedIn, onPick, onNav, picking }) => {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <HomeBackdrop variant="collage"/>
      <div style={{
        position: 'absolute', inset: 0, paddingBottom: 'var(--tab-h)', overflowY: 'auto',
      }} className="no-scrollbar">
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 20px',
        }}>
          <BrandMark size={24}/>
          <button style={{ color: 'var(--color-text-secondary)' }}><I.Bell size={18}/></button>
        </div>
        <div style={{
          padding: '40px 24px 32px', display: 'flex', flexDirection: 'column',
          alignItems: 'center', textAlign: 'center', gap: 20,
        }}>
          <div className="eyebrow">Tonight</div>
          <h1 className="display" style={{
            margin: 0, fontSize: 40, fontWeight: 900, letterSpacing: '-.03em', lineHeight: 1.05,
          }}>
            One button.<br/>
            <span style={{ color: 'var(--color-accent)' }}>One movie</span>.
          </h1>
          <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: 14 }}>
            Three seconds. Don't scroll for forty minutes.
          </p>
          <button onClick={onPick} disabled={picking}
            className="btn btn-primary"
            style={{
              width: '100%', height: 60, fontSize: 16,
              boxShadow: '0 12px 32px rgba(245,181,68,.4)',
            }}>
            {picking ? <span className="spinner"/> : <I.Sparkle size={18}/>}
            {picking ? 'Searching…' : 'Pick a movie for me'}
          </button>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
            {MOODS.slice(0, 5).map(m => (
              <MoodChip key={m.id} mood={m}/>
            ))}
          </div>
        </div>
        {loggedIn && (
          <div style={{ padding: '8px 20px 24px', display: 'flex', flexDirection: 'column', gap: 24 }}>
            <MovieRail title="Watch later" movies={MOVIES.slice(2, 8)} onPick={onPick}/>
          </div>
        )}
      </div>
      <MobileTabBar active="home" onNav={onNav}/>
    </div>
  );
};

Object.assign(window, { HomeDesktop, HomeMobile, HomeBackdrop, HeroCTA });
