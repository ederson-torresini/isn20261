// detail.jsx — recommendation result / movie detail screen

const ServiceBadge = ({ svc }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '8px 12px', borderRadius: 10,
    background: 'var(--color-surface)', border: '1px solid var(--color-border)',
  }}>
    <div style={{
      width: 32, height: 32, borderRadius: 8,
      background: 'var(--color-surface-2)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 12,
      color: 'var(--color-text-primary)',
    }}>{svc.name[0]}</div>
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span style={{ fontSize: 13, fontWeight: 600 }}>{svc.name}</span>
      <span style={{
        fontSize: 10, letterSpacing: '.06em', textTransform: 'uppercase',
        color: svc.kind === 'included' ? 'var(--color-success)' : 'var(--color-text-muted)',
      }}>{svc.kind === 'included' ? 'Included' : svc.kind === 'rent' ? 'Rent' : 'Buy'}</span>
    </div>
  </div>
);

const DetailScreen = ({ movie, onNav, onAnother, onSave, saved, onWatched, isMobile = false }) => {
  if (!movie) return null;
  const similar = MOVIES.filter(m => m.id !== movie.id).slice(0, 6);

  const Backdrop = (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: isMobile ? 360 : 560,
      overflow: 'hidden',
    }}>
      <img src={backdropUrl(movie, 1800, 1000)} alt=""
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(to bottom, rgba(10,10,11,.3) 0%, rgba(10,10,11,.1) 30%, rgba(10,10,11,.7) 70%, var(--color-bg) 100%),
                     linear-gradient(to right, rgba(10,10,11,.85) 0%, rgba(10,10,11,.2) 60%)`,
      }}/>
    </div>
  );

  const Header = (
    <div className="fade-up" style={{
      paddingTop: isMobile ? 220 : 280,
      paddingLeft: isMobile ? 24 : 56,
      paddingRight: isMobile ? 24 : 56,
      maxWidth: 880,
    }}>
      <div className="eyebrow" style={{ color: 'var(--color-accent)', marginBottom: 14 }}>
        ✦  We think you'll like this one
      </div>
      <h1 className="display" style={{
        margin: 0,
        fontSize: isMobile ? 40 : 64,
        fontWeight: 900,
        letterSpacing: '-.03em',
        lineHeight: .98,
      }}>{movie.title}</h1>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
        marginTop: 16, fontSize: 13, color: 'var(--color-text-secondary)',
      }}>
        <span className="match" style={{ fontSize: 14 }}>{movie.match}% match</span>
        <span>{movie.year}</span>
        <span style={{
          padding: '2px 6px', border: '1px solid var(--color-border-strong)',
          borderRadius: 4, fontSize: 11, fontWeight: 600,
        }}>{movie.rating}</span>
        <span>{movie.runtime}</span>
        <span style={{ color: 'var(--color-text-muted)' }}>{movie.genres.join(' · ')}</span>
      </div>

      <p style={{
        margin: '24px 0 28px',
        fontSize: isMobile ? 15 : 17,
        lineHeight: 1.55,
        color: 'var(--color-text-primary)',
        maxWidth: 640,
        textWrap: 'pretty',
      }}>{movie.synopsis}</p>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 32 }}>
        <button className="btn btn-primary btn-lg">
          <I.Play size={16}/>Watch on {movie.services[0].name}
        </button>
        <button className={`btn ${saved ? 'btn-secondary' : 'btn-secondary'} btn-lg`} onClick={onSave}>
          {saved ? <I.BookmarkOn size={16}/> : <I.Bookmark size={16}/>}
          {saved ? 'Saved' : 'Save to watch later'}
        </button>
        <button className="btn btn-ghost btn-lg" onClick={onAnother}>
          <I.Refresh size={16}/>Recommend another
        </button>
      </div>

      {/* Where to watch */}
      <div style={{ marginBottom: 32 }}>
        <div className="eyebrow" style={{ marginBottom: 10 }}>Where to watch</div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {movie.services.map(s => <ServiceBadge key={s.name} svc={s}/>)}
        </div>
      </div>
    </div>
  );

  const CastDirector = (
    <div style={{
      padding: isMobile ? '0 24px' : '0 56px',
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '160px 1fr',
      gap: 24, maxWidth: 880, marginBottom: 36,
    }}>
      <div>
        <div className="eyebrow" style={{ marginBottom: 6 }}>Director</div>
        <div style={{ fontSize: 14, fontWeight: 600 }}>{movie.director}</div>
      </div>
      <div>
        <div className="eyebrow" style={{ marginBottom: 6 }}>Cast</div>
        <div style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
          {movie.cast.join(' · ')}
        </div>
      </div>
    </div>
  );

  const Similar = (
    <div style={{ padding: isMobile ? '0 24px 32px' : '0 56px 56px' }}>
      <h3 style={{ margin: '0 0 14px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20 }}>
        Similar films
      </h3>
      <div className="rail no-scrollbar">
        {similar.map(m => <MovieCard key={m.id} movie={m} w={isMobile?130:160} h={isMobile?195:240}/>)}
      </div>
    </div>
  );

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {!isMobile && <DesktopRail active="home" onNav={onNav}/>}
      <div style={{
        position: 'absolute', inset: 0,
        paddingLeft: isMobile ? 0 : 'var(--rail-w)',
        paddingBottom: isMobile ? 'var(--tab-h)' : 0,
        overflowY: 'auto',
      }} className="no-scrollbar">
        <div style={{ position: 'relative' }}>
          {Backdrop}
          <div style={{ position: 'relative' }}>
            {Header}
            {CastDirector}
            {Similar}
          </div>
        </div>
      </div>
      {isMobile && <MobileTabBar active="home" onNav={onNav}/>}
    </div>
  );
};

Object.assign(window, { DetailScreen });
