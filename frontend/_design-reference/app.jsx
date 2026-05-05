// app.jsx — full prototype: state, navigation, reveal animation
// Each artboard is a "device" — desktop or mobile — with its own internal route.

const PrototypeApp = ({
  initialScreen = 'home',
  initialLoggedIn = true,
  isMobile = false,
  heroVariant = 'collage',
}) => {
  const [screen, setScreen] = React.useState(initialScreen);
  const [loggedIn, setLoggedIn] = React.useState(initialLoggedIn);
  const [picking, setPicking] = React.useState(false);
  const [currentMovie, setCurrentMovie] = React.useState(MOVIES[0]);
  const [savedIds, setSavedIds] = React.useState(new Set(['m2','m4','m9']));
  const [toast, setToast] = React.useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  };

  const handlePick = () => {
    setPicking(true);
    setTimeout(() => {
      const candidate = MOVIES[Math.floor(Math.random() * MOVIES.length)];
      setCurrentMovie(candidate);
      setPicking(false);
      setScreen('detail');
    }, 1200);
  };

  const handleNav = (id) => {
    if (id === 'login') return setScreen('login');
    if (id === 'register') return setScreen('register');
    if (id === 'forgot') return setScreen('forgot');
    if (id === 'home') return setScreen('home');
    if (id === 'history') return setScreen('history');
    if (id === 'queue') return setScreen('queue');
    if (id === 'settings') return setScreen('preferences');
    if (id === 'profile') return setScreen('preferences');
    if (id === 'pick') return handlePick();
    // search/upcoming/shows/films/add — keep on home
    setScreen('home');
  };

  const handleLogin = () => { setLoggedIn(true); setScreen('home'); };

  const handleSave = () => {
    if (!currentMovie) return;
    setSavedIds(prev => {
      const next = new Set(prev);
      if (next.has(currentMovie.id)) {
        next.delete(currentMovie.id);
        showToast('Removed from watch later');
      } else {
        next.add(currentMovie.id);
        showToast('Added to watch later');
      }
      return next;
    });
  };

  const handlePickMovie = (m) => {
    setCurrentMovie(m);
    setScreen('detail');
  };

  const isSaved = currentMovie && savedIds.has(currentMovie.id);

  const renderScreen = () => {
    if (screen === 'login')    return <LoginScreen onLogin={handleLogin} onNav={setScreen}/>;
    if (screen === 'register') return <RegisterScreen onLogin={handleLogin} onNav={setScreen}/>;
    if (screen === 'forgot')   return <ForgotScreen onNav={setScreen}/>;
    if (screen === 'detail')   return <DetailScreen movie={currentMovie} onNav={handleNav}
      onAnother={handlePick} onSave={handleSave} saved={isSaved} isMobile={isMobile}/>;
    if (screen === 'preferences') return <PreferencesScreen onNav={handleNav}/>;
    if (screen === 'history')  return <HistoryScreen onNav={handleNav} onPick={handlePickMovie}/>;
    if (screen === 'queue')    return <QueueScreen onNav={handleNav} onPick={handlePickMovie}/>;
    // home
    if (isMobile) return <HomeMobile loggedIn={loggedIn} onPick={handlePick} onNav={handleNav} picking={picking}/>;
    return <HomeDesktop loggedIn={loggedIn} onPick={handlePick} onNav={handleNav} picking={picking} heroVariant={heroVariant}/>;
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Pick-overlay reveal effect */}
      {picking && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 100,
          background: 'rgba(10,10,11,.85)', backdropFilter: 'blur(8px)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 18, animation: 'ra-fade .25s ease both',
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            border: '3px solid var(--color-border)', borderTopColor: 'var(--color-accent)',
            animation: 'ra-spin 1s linear infinite',
          }}/>
          <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', letterSpacing: '.02em' }}>
            Searching the reels…
          </div>
        </div>
      )}
      {renderScreen()}
      <Toast message={toast}/>
    </div>
  );
};

Object.assign(window, { PrototypeApp });
