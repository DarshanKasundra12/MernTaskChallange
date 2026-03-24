import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import Week1Page from './pages/Week1Page';
import CustomCursor from './components/CustomCursor';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import './App.css';

const blobs = [
  { top: '-120px', left: '-90px', size: 320, duration: 14, delay: 0 },
  { top: '18%', left: '72%', size: 260, duration: 17, delay: 1.5 },
  { top: '64%', left: '10%', size: 280, duration: 19, delay: 2.5 },
  { top: '76%', left: '78%', size: 240, duration: 16, delay: 0.8 },
];

const beams = [
  { left: '12%', duration: 18, delay: 0.4 },
  { left: '44%', duration: 21, delay: 1.3 },
  { left: '76%', duration: 19, delay: 2.1 },
];

function getViewFromHash(hash) {
  return hash === '#week1-page' ? 'week1' : 'dashboard';
}

function App() {
  const [view, setView] = useState(() =>
    typeof window === 'undefined' ? 'dashboard' : getViewFromHash(window.location.hash)
  );

  useEffect(() => {
    const onHashChange = () => setView(getViewFromHash(window.location.hash));
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    if (view === 'week1') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const id = window.location.hash.replace('#', '');
    if (!id || id === 'dashboard') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const timer = window.setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);

    return () => window.clearTimeout(timer);
  }, [view]);

  return (
    <div className="site">
      <CustomCursor />
      <motion.div
        className="site__layer site__layer--glow"
        animate={{ opacity: [0.65, 1, 0.7, 0.9, 0.65] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="site__layer site__layer--grid"
        animate={{ backgroundPosition: ['0px 0px', '60px 35px', '0px 0px'] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
      />

      <div className="site__bg-content">
        {blobs.map((blob) => (
          <motion.div
            key={`${blob.top}-${blob.left}`}
            className="site__blob"
            style={{
              top: blob.top,
              left: blob.left,
              width: blob.size,
              height: blob.size,
            }}
            animate={{
              x: [0, 18, -16, 0],
              y: [0, -22, 14, 0],
              scale: [1, 1.12, 0.96, 1],
              opacity: [0.16, 0.28, 0.12, 0.16],
            }}
            transition={{
              duration: blob.duration,
              delay: blob.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}

        {beams.map((beam) => (
          <motion.div
            key={beam.left}
            className="site__beam"
            style={{ left: beam.left }}
            animate={{ y: ['-30%', '120%'], opacity: [0, 0.35, 0] }}
            transition={{
              duration: beam.duration,
              delay: beam.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      <motion.div
        className="site__ring site__ring--left"
        animate={{ rotate: 360, scale: [1, 1.06, 1] }}
        transition={{ rotate: { duration: 24, repeat: Infinity, ease: 'linear' }, scale: { duration: 8, repeat: Infinity } }}
      />
      <motion.div
        className="site__ring site__ring--right"
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      />
      <div className="site__content">
        <Navbar />
        {view === 'week1' ? (
          <Week1Page />
        ) : (
          <div id="dashboard">
            <Dashboard />
          </div>
        )}
        <Footer />
      </div>
    </div>
  );
}

export default App;
