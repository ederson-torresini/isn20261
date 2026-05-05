// history-queue.jsx — History timeline + Watch Later queue

const HistoryScreen = ({ onNav, onPick }) => {
  const groups = [
    { label: 'Today', items: MOVIES.slice(0, 2).map((m,i) => ({m, when: i===0 ? '2h ago' : '8h ago', mood: 'Thoughtful'})) },
    { label: 'Yesterday', items: MOVIES.slice(2, 4).map((m,i) => ({m, when: 'Sat 9:14 PM', mood: i===0?'Chill':'Funny'})) },
    { label: 'Last week', items: MOVIES.slice(4, 7).map((m,i) => ({m, when: ['Tue','Wed','Fri'][i], mood: ['Intense','Romantic','Adventurous'][i]})) },
    { label: 'Earlier', items: MOVIES.slice(7, 10).map((m,i) => ({m, when: ['Apr 2','Mar 28','Mar 17'][i], mood: ['Nostalgic','Thoughtful','Scary'][i]})) },
  ];

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <DesktopRail active="history" onNav={onNav}/>
      <div style={{
        position: 'absolute', inset: 0, paddingLeft: 'var(--rail-w)', overflowY: 'auto',
      }} className="no-scrollbar">
        <div style={{ maxWidth: 920, margin: '0 auto', padding: '40px 40px 60px' }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Library</div>
          <h1 className="display" style={{ margin: 0, fontSize: 36, fontWeight: 800 }}>History</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 14, marginTop: 8, marginBottom: 32 }}>
            Every recommendation we've served you, with the mood and filters you had on.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {groups.map(g => (
              <div key={g.label}>
                <h3 style={{
                  margin: '0 0 14px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14,
                  color: 'var(--color-text-secondary)', letterSpacing: '0.02em',
                }}>{g.label}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {g.items.map(({m, when, mood}) => (
                    <div key={m.id} className="card" style={{
                      padding: 14, display: 'flex', alignItems: 'center', gap: 16,
                      transition: 'border-color .15s, background .15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-border-strong)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}>
                      <img src={posterUrl(m, 120, 180)} alt=""
                        onClick={() => onPick?.(m)}
                        style={{ width: 60, height: 90, objectFit: 'cover', borderRadius: 6, cursor: 'pointer', flexShrink: 0 }}/>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{m.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--color-text-muted)', display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            <I.Clock size={11}/>{when}
                          </span>
                          <span style={{ width: 2, height: 2, borderRadius: 1, background: 'currentColor' }}/>
                          <span>Mood: {mood}</span>
                          <span style={{ width: 2, height: 2, borderRadius: 1, background: 'currentColor' }}/>
                          <span className="match" style={{ fontSize: 12 }}>{m.match}% match</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => onPick?.(m)}>View</button>
                        <button className="btn btn-secondary btn-sm" style={{ width: 32, padding: 0 }}>
                          <I.Bookmark size={14}/>
                        </button>
                        <button className="btn btn-ghost btn-sm" style={{ width: 32, padding: 0, color: 'var(--color-text-muted)' }}>
                          <I.Trash size={14}/>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const QueueScreen = ({ onNav, onPick }) => {
  const [items, setItems] = React.useState(MOVIES.slice(0, 10).map(m => m.id));
  const [dragIdx, setDragIdx] = React.useState(null);
  const [overIdx, setOverIdx] = React.useState(null);
  const [toast, setToast] = React.useState(null);

  const movies = items.map(id => MOVIES.find(m => m.id === id)).filter(Boolean);

  const remove = (id) => {
    setItems(arr => arr.filter(x => x !== id));
    setToast('Removed from watch later');
    setTimeout(() => setToast(null), 1800);
  };

  const surprise = () => {
    if (movies.length === 0) return;
    const m = movies[Math.floor(Math.random() * movies.length)];
    onPick?.(m);
  };

  const onDragStart = (i) => setDragIdx(i);
  const onDragOver = (e, i) => {
    e.preventDefault();
    setOverIdx(i);
  };
  const onDrop = () => {
    if (dragIdx === null || overIdx === null || dragIdx === overIdx) {
      setDragIdx(null); setOverIdx(null); return;
    }
    setItems(arr => {
      const next = [...arr];
      const [moved] = next.splice(dragIdx, 1);
      next.splice(overIdx, 0, moved);
      return next;
    });
    setDragIdx(null); setOverIdx(null);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <DesktopRail active="queue" onNav={onNav}/>
      <div style={{
        position: 'absolute', inset: 0, paddingLeft: 'var(--rail-w)', overflowY: 'auto',
      }} className="no-scrollbar">
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 40px 60px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28, gap: 20, flexWrap: 'wrap' }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 8 }}>Library</div>
              <h1 className="display" style={{ margin: 0, fontSize: 36, fontWeight: 800 }}>Watch later</h1>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 14, marginTop: 8, marginBottom: 0 }}>
                <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>{movies.length} movies</span> saved · drag posters to reorder
              </p>
            </div>
            <button className="btn btn-primary btn-lg" onClick={surprise} disabled={!movies.length}>
              <I.Sparkle size={16}/>Surprise me from this list
            </button>
          </div>

          {movies.length === 0 ? (
            <EmptyState
              title="Your queue is empty."
              body="Get a recommendation and save what catches your eye. Everything you save lives here."
              ctaLabel="Pick a movie for me"
              onCta={() => onNav?.('home')}/>
          ) : (
            <div style={{
              display: 'grid', gap: 18,
              gridTemplateColumns: 'repeat(auto-fill, minmax(168px, 1fr))',
            }}>
              {movies.map((m, i) => (
                <div key={m.id}
                  draggable
                  onDragStart={() => onDragStart(i)}
                  onDragOver={(e) => onDragOver(e, i)}
                  onDrop={onDrop}
                  onDragEnd={() => { setDragIdx(null); setOverIdx(null); }}
                  style={{
                    opacity: dragIdx === i ? .4 : 1,
                    transform: overIdx === i && dragIdx !== i ? 'translateX(8px)' : 'none',
                    transition: 'transform .15s, opacity .15s',
                    cursor: 'grab',
                    position: 'relative',
                  }}>
                  <button onClick={(e) => { e.stopPropagation(); remove(m.id); }}
                    style={{
                      position: 'absolute', top: 8, right: 8, zIndex: 2,
                      width: 26, height: 26, borderRadius: '50%',
                      background: 'rgba(0,0,0,.6)', color: 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      opacity: 0, transition: 'opacity .15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = 1}
                    className="queue-x">
                    <I.X size={12}/>
                  </button>
                  <MovieCard movie={m} w={168} h={252} onClick={() => onPick?.(m)}/>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Toast message={toast}/>
      <style>{`
        .queue-x { opacity: 0 !important; }
        [draggable]:hover .queue-x { opacity: 1 !important; }
      `}</style>
    </div>
  );
};

Object.assign(window, { HistoryScreen, QueueScreen });
