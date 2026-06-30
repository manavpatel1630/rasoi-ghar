import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaHome, FaBook, FaInfoCircle, FaEnvelope, FaBars, FaTimes, FaFire, FaChevronRight } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import recipes from '../data/recipes.json';
import '../styles/navbar.css';

const NEW_RECIPES = [
  { ...recipes[2], label: '🔥 New' },
  { ...recipes[0], label: '⭐ Popular' },
  { ...recipes[5], label: '🍯 Sweet' },
  { ...recipes[4], label: '🌿 Healthy' },
];

// 3 languages: EN + Hindi + Gujarati (Gujarati = translation only, voice = Hindi)
const LANGS = [
  { code: 'en', label: 'EN',    full: 'English'  },
  { code: 'hi', label: 'हिंदी', full: 'Hindi'    },
  { code: 'gu', label: 'ગુજ',  full: 'Gujarati' },
];

export default function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const [scrolled,    setScrolled]    = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [tickerIdx,   setTickerIdx]   = useState(0);
  const [tickerAnim,  setTickerAnim]  = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Auto-rotate ticker
  useEffect(() => {
    const id = setInterval(() => {
      setTickerAnim(false);
      setTimeout(() => {
        setTickerIdx(i => (i + 1) % NEW_RECIPES.length);
        setTickerAnim(true);
      }, 250);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  const navItems = [
    { to: '/',        label: t('home'),    icon: <FaHome /> },
    { to: '/recipes', label: t('recipes'), icon: <FaBook /> },
    { to: '/about',   label: t('about'),   icon: <FaInfoCircle /> },
    { to: '/contact', label: t('contact'), icon: <FaEnvelope /> },
  ];

  const current = NEW_RECIPES[tickerIdx];

  // Toggle between the 2 langs (used by mobile quick-toggle)
  const toggleLang = () => {
    setLang(l => l === 'en' ? 'hi' : l === 'hi' ? 'gu' : 'en');
  };

  return (
    <>
      {/* ── TICKER BAR ── */}
      <div className="nav-ticker-bar">
        <div className="ticker-inner">
          <span className="ticker-badge"><FaFire /> Today's Pick</span>
          <div
            className={`ticker-content${tickerAnim ? ' ticker-in' : ' ticker-out'}`}
            onClick={() => navigate(`/recipes/${current.slug}`)}
          >
            <span className="ticker-label">{current.label}</span>
            <span className="ticker-name">{current.name}</span>
            <span className="ticker-cat">{current.category}</span>
            <FaChevronRight className="ticker-arrow" />
          </div>
          <div className="ticker-dots">
            {NEW_RECIPES.map((_, i) => (
              <button
                key={i}
                className={`ticker-dot${i === tickerIdx ? ' active' : ''}`}
                onClick={() => { setTickerIdx(i); setTickerAnim(true); }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN NAVBAR ── */}
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-inner">

          {/* Logo */}
          <Link to="/" className="nav-logo" onClick={() => setMenuOpen(false)}>
            <span className="logo-icon">🍛</span>
            <span>
              Rasoi Ghar
              <span className="logo-hindi">रसोई घर</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <ul className={`nav-links${menuOpen ? ' mobile-open' : ''}`}>
            {navItems.map(({ to, label, icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) => isActive ? 'active' : ''}
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="nav-icon">{icon}</span>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* RIGHT SIDE: lang switcher (desktop) + mobile controls */}
          <div className="nav-right-group">

            {/* Desktop lang switcher — always visible on desktop */}
            <div className="lang-switcher desktop-only">
              {LANGS.map(l => (
                <button
                  key={l.code}
                  className={`lang-btn${lang === l.code ? ' active' : ''}`}
                  onClick={() => setLang(l.code)}
                  title={l.full}
                >
                  {l.label}
                </button>
              ))}
            </div>
              {/* MANAV PATEL KM CHO */}
            {/* Mobile: lang toggle pill — always visible, no menu needed */}
            <button
              className="mobile-lang-toggle mobile-only"
              onClick={toggleLang}
              aria-label="Switch language"
            >
              <span className={`mlt-option${lang === 'en' ? ' mlt-active' : ''}`}>EN</span>
              <span className="mlt-divider">|</span>
              <span className={`mlt-option${lang === 'hi' ? ' mlt-active' : ''}`}>हि</span>
              <span className="mlt-divider">|</span>
              <span className={`mlt-option${lang === 'gu' ? ' mlt-active' : ''}`}>ગુ</span>
            </button>

            {/* Hamburger — mobile only */}
            <button
              className={`hamburger mobile-only${menuOpen ? ' open' : ''}`}
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Menu"
            >
              {menuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu (nav links only — NO lang switcher here) */}
        {menuOpen && (
          <div className="mobile-menu">
            <ul>
              {navItems.map(({ to, label, icon }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={to === '/'}
                    className={({ isActive }) => isActive ? 'active' : ''}
                    onClick={() => setMenuOpen(false)}
                  >
                    <span className="nav-icon">{icon}</span>
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </>
  );
}