import React from 'react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const links = [
  { id: 'dashboard', href: '#dashboard', label: 'Dashboard' },
  { id: 'week1-page', href: '#week1-page', label: 'Week 1' },
  { id: 'week-2', href: '#week-2', label: 'Week 2' },
  { id: 'week-3', href: '#week-3', label: 'Week 3' },
  { id: 'week-4', href: '#week-4', label: 'Week 4' },
];

function Navbar() {
  const [active, setActive] = useState('dashboard');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateHash = () => {
      const hash = window.location.hash.replace('#', '');
      setActive(hash || 'dashboard');
    };

    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    updateHash();
    onScroll();
    window.addEventListener('hashchange', updateHash);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('hashchange', updateHash);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7 }}
      className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}
    >
      <div className="container navbar__inner">
        <motion.div
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          className="navbar__brand"
          data-clickable="true"
        >
          MERN TRACKER
        </motion.div>
        <ul className="navbar__links">
          {links.map((link) => (
            <li key={link.id}>
              <motion.a
                href={link.href}
                whileHover={{ y: -3, scale: 1.03 }}
                whileTap={{ y: 0, scale: 0.94 }}
                onClick={() => setActive(link.id)}
                className={`navbar__link ${active === link.id ? 'navbar__link--active' : ''}`}
              >
                {link.label}
              </motion.a>
            </li>
          ))}
        </ul>
      </div>
    </motion.nav>
  );
}

export default Navbar;
