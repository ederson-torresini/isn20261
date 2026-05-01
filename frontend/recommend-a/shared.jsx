// shared.jsx — small reusable bits used across screens

// Brand mark for "Recommend-a"
const BrandMark = ({ size = 28, withWord = true }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
      <defs>
        <linearGradient id="rabg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="var(--color-accent)"/>
          <stop offset="1" stopColor="var(--color-accent-hover)"/>
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="30" height="30" rx="8" fill="url(#rabg)"/>
      <path d="M11 22V10h6.2c2.4 0 4 1.5 4 3.7 0 1.7-.9 2.9-2.4 3.4l3 4.9h-3l-2.7-4.5h-2.4V22zm2.7-6.7h3c1.2 0 2-.6 2-1.6s-.8-1.6-2-1.6h-3z"
        fill="var(--color-on-accent)"/>
    </svg>
    {withWord && (
      <span style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        letterSpacing: '-0.02em',
        fontSize: 18,
        color: 'var(--color-text-primary)',
      }}>
        Recommend<span style={{ color: 'var(--color-accent)' }}>·</span>a
      </span>
    )}
  </div>
);

// ── Desktop nav rail ──
const DesktopRail = ({ active = 'home', onNav, loggedIn = true }) => {
  const items = [
    { id: 'search', icon: I.Search, label: 'Search' },
    { id: 'home', icon: I.Home, label: 'Home' },
    { id: 'upcoming', icon: I.Calendar, label: 'Upcoming' },
    { id: 'shows', icon: I.Tv, label: 'Series' },
    { id: 'films', icon: I.Film, label: 'Films' },
    { id: 'add', icon: I.Plus, label: 'Add' },
  ];
  return (
    <aside style={{
      position: 'absolute', left: 0, top: 0, bottom: 0, width: 'var(--rail-w)',
      background: 'rgba(8,8,9,.7)', borderRight: '1px solid var(--color-border)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '18px 0', gap: 4, zIndex: 5, backdropFilter: 'blur(12px)',
    }}>
      <div style={{ height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <BrandMark size={28} withWord={false}/>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, marginTop: 18 }}>
        {items.map(it => {
          const isActive = active === it.id;
          return (
            <button key={it.id}
              onClick={() => onNav?.(it.id)}
              title={it.label}
              style={{
                position: 'relative',
                width: 44, height: 44, borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                background: isActive ? 'rgba(255,255,255,.05)' : 'transparent',
                transition: 'color .15s, background .15s',
              }}
              onMouseEnter={(e) => { if(!isActive) e.currentTarget.style.color = 'var(--color-text-primary)'; }}
              onMouseLeave={(e) => { if(!isActive) e.currentTarget.style.color = 'var(--color-text-muted)'; }}
            >
              {isActive && <span style={{
                position: 'absolute', left: -10, top: 8, bottom: 8, width: 3,
                background: 'var(--color-accent)', borderRadius: 4,
              }}/>}
              <it.icon size={20}/>
            </button>
          );
        })}
      </div>
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        background: 'linear-gradient(135deg,#3a2a18,#5a4222)',
        border: '1px solid var(--color-border-strong)',
        color: 'var(--color-accent)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 700, fontSize: 13, fontFamily: 'var(--font-display)',
      }}>
        {loggedIn ? 'JR' : <I.User size={16}/>}
      </div>
    </aside>
  );
};

// ── Mobile bottom tab ──
const MobileTabBar = ({ active = 'home', onNav }) => {
  const items = [
    { id: 'home', icon: I.Home, label: 'Home' },
    { id: 'search', icon: I.Search, label: 'Search' },
    { id: 'pick', icon: I.Sparkle, label: 'Pick', primary: true },
    { id: 'queue', icon: I.Bookmark, label: 'Queue' },
    { id: 'profile', icon: I.User, label: 'Me' },
  ];
  return (
    <nav style={{
      position: 'absolute', left: 0, right: 0, bottom: 0,
      height: 'var(--tab-h)', background: 'rgba(10,10,11,.92)',
      borderTop: '1px solid var(--color-border)',
      display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', alignItems: 'center',
      padding: '0 6px', backdropFilter: 'blur(14px)', zIndex: 5,
    }}>
      {items.map(it => {
        const isActive = active === it.id;
        if (it.primary) {
          return (
            <button key={it.id} onClick={() => onNav?.(it.id)}
              style={{
                justifySelf: 'center', width: 52, height: 52, borderRadius: 26,
                background: 'var(--color-accent)', color: 'var(--color-on-accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 6px 18px rgba(245,181,68,.35)',
              }}>
              <it.icon size={22}/>
            </button>
          );
        }
        return (
          <button key={it.id} onClick={() => onNav?.(it.id)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 3, color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
              padding: 6,
            }}>
            <it.icon size={20}/>
            <span style={{ fontSize: 10, fontWeight: 500 }}>{it.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

// ── Mood chip ──
const MoodChip = ({ mood, active, onClick }) => (
  <button className={`chip ${active ? 'active' : ''}`} onClick={onClick}>
    <span style={{ fontSize: 11, opacity: .8 }}>{mood.icon}</span>
    {mood.label}
  </button>
);

// ── Service chip (logo block) ──
const ServiceChip = ({ svc, active, onClick }) => (
  <button onClick={onClick}
    style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: 6,
      width: 88, height: 84, borderRadius: 14,
      background: active ? 'var(--color-accent-soft)' : 'var(--color-surface)',
      border: `1px solid ${active ? 'var(--color-accent)' : 'var(--color-border)'}`,
      color: active ? 'var(--color-accent)' : 'var(--color-text-secondary)',
      transition: 'all .15s',
    }}>
    <div style={{
      width: 36, height: 36, borderRadius: 10,
      background: active ? 'rgba(245,181,68,.15)' : 'var(--color-surface-2)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14,
    }}>{svc.glyph}</div>
    <span style={{ fontSize: 11, fontWeight: 500 }}>{svc.name}</span>
  </button>
);

// ── Movie poster card ──
const MovieCard = ({ movie, w = 168, h = 252, showMeta = true, onClick, hoverActions = true }) => {
  const [hover, setHover] = React.useState(false);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onClick={onClick}
      style={{ width: w, cursor: onClick ? 'pointer' : 'default' }}>
      <div style={{
        position: 'relative', width: w, height: h, borderRadius: 10, overflow: 'hidden',
        background: 'var(--color-surface-2)',
        boxShadow: hover ? '0 12px 28px rgba(0,0,0,.5)' : '0 2px 8px rgba(0,0,0,.3)',
        transition: 'transform .2s, box-shadow .2s',
        transform: hover ? 'translateY(-3px)' : 'none',
      }}>
        <img src={posterUrl(movie, w*2, h*2)} alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}/>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,.85) 0%, rgba(0,0,0,0) 50%)',
        }}/>
        {hoverActions && hover && (
          <div className="fade-in" style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,.92) 0%, rgba(0,0,0,.4) 100%)',
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
            padding: 12, gap: 8,
          }}>
            <div style={{ fontSize: 11, color: 'var(--color-accent)', fontWeight: 700 }}>
              {movie.match}% match
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="btn btn-primary btn-sm" style={{ flex: 1, height: 28 }}>
                <I.Play size={12}/>Watch
              </button>
              <button className="btn btn-secondary btn-sm" style={{ width: 28, padding: 0 }}>
                <I.Bookmark size={14}/>
              </button>
            </div>
          </div>
        )}
        <div style={{
          position: 'absolute', top: 8, left: 8,
          fontSize: 10, fontWeight: 700, color: 'var(--color-accent)',
          background: 'rgba(0,0,0,.55)', padding: '3px 6px', borderRadius: 4,
          letterSpacing: '.04em',
        }}>
          {movie.match}%
        </div>
      </div>
      {showMeta && (
        <div style={{ paddingTop: 10 }}>
          <div style={{
            fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{movie.title}</div>
          <div style={{
            fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span>{movie.year}</span>
            <span style={{ width: 2, height: 2, borderRadius: 1, background: 'currentColor' }}/>
            <span>{movie.genres[0]}</span>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Toast ──
const Toast = ({ message, kind = 'success' }) => {
  if (!message) return null;
  const colors = {
    success: { bg: 'var(--color-success)', icon: <I.Check size={14}/> },
    info:    { bg: 'var(--color-accent)',  icon: <I.Sparkle size={14}/> },
    error:   { bg: 'var(--color-danger)',  icon: <I.X size={14}/> },
  }[kind];
  return (
    <div className="fade-up" style={{
      position: 'absolute', right: 18, bottom: 18, zIndex: 50,
      background: 'var(--color-surface-elevated)',
      border: '1px solid var(--color-border-strong)',
      borderRadius: 10, padding: '10px 14px',
      display: 'flex', alignItems: 'center', gap: 10,
      boxShadow: 'var(--shadow-lg)',
      fontSize: 13, fontWeight: 500,
    }}>
      <span style={{
        width: 20, height: 20, borderRadius: '50%', background: colors.bg,
        color: 'var(--color-on-accent)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{colors.icon}</span>
      {message}
    </div>
  );
};

// ── Empty state ──
const EmptyState = ({ title, body, ctaLabel, onCta }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    textAlign: 'center', padding: '40px 20px', gap: 12,
  }}>
    <div style={{
      width: 78, height: 78, borderRadius: 20,
      border: '1.5px dashed var(--color-border-strong)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'var(--color-text-muted)',
    }}>
      <I.Film size={34} stroke={1.4}/>
    </div>
    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, marginTop: 6 }}>
      {title}
    </div>
    <div style={{ color: 'var(--color-text-secondary)', fontSize: 13, maxWidth: 340 }}>
      {body}
    </div>
    {ctaLabel && (
      <button className="btn btn-primary" style={{ marginTop: 8 }} onClick={onCta}>
        <I.Sparkle size={14}/>{ctaLabel}
      </button>
    )}
  </div>
);

Object.assign(window, {
  BrandMark, DesktopRail, MobileTabBar,
  MoodChip, ServiceChip, MovieCard, Toast, EmptyState,
});
