import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  FaLeaf, FaHandshake, FaMobileAlt, FaAward,
  FaMapMarkerAlt, FaInstagram, FaYoutube, FaHeart,
  FaUtensils, FaStar, FaUsers, FaBook
} from 'react-icons/fa';
import { GiCookingPot, GiHotSpices, GiIndiaGate } from 'react-icons/gi';
import { useLanguage } from '../context/LanguageContext';
import '../styles/about.css';

const VALUES = [
  {
    icon: <FaAward />,
    title: 'Authentic',
    titleHi: 'प्रामाणिक',
    text: 'Every recipe is tested against original regional versions, staying true to traditional flavors passed down for centuries.',
    color: '#FF6B2C',
    bg: '#fff3ee',
  },
  {
    icon: <FaLeaf />,
    title: 'Fresh',
    titleHi: 'ताज़ा',
    text: 'We celebrate seasonal, locally-sourced ingredients the way Indian kitchens always have — simple, pure, and full of life.',
    color: '#3D7A3A',
    bg: '#f0f7f0',
  },
  {
    icon: <FaHandshake />,
    title: 'Community',
    titleHi: 'समुदाय',
    text: 'Recipes shared by home cooks and grandmothers across India — real food, real people, real stories.',
    color: '#8B5CF6',
    bg: '#f5f0ff',
  },
  {
    icon: <FaMobileAlt />,
    title: 'Accessible',
    titleHi: 'सुलभ',
    text: 'In English and Hindi so the love of Indian food crosses every language barrier and reaches every home.',
    color: '#0891B2',
    bg: '#f0f9ff',
  },
];

const TEAM = [
  {
    name: 'Manav Patel',
    role: ' Founder',
    roleHi: 'संस्थापक',
    location: 'Ahemdabad, Gujrat',
    icon: <FaUtensils />,
    color: '#FF6B2C',
    // bio: '20+ years cooking authentic North Indian cuisine',
    social: '@_manav_1610',
  },
  {
    name: 'Hiteshree Parmar',
    role: 'Co-Founder',
    roleHi: 'सह-संस्थापक',
    location: 'Ahmedabad, Gujrat',
    icon: <FaBook />,
    color: '#3D7A3A',
    bio: 'Travels India documenting forgotten regional recipes',
    // social: '@ravi.recipes',
  },
  {
    name: 'Malvi Padshala',
    role: 'Food Photographer',
    roleHi: 'फूड फोटोग्राफर',
    location: 'Ahemdabad, Gujrat',
    icon: <FaStar />,
    color: '#8B5CF6',
    bio: 'Making Indian food look as beautiful as it tastes',
    // social: '@sunita.lens',
  },
];

const STATS = [
  { icon: <FaBook />,     value: '100+', label: 'Recipes' },
  { icon: <FaUsers />,    value: '50K+', label: 'Food Lovers' },
  { icon: <GiHotSpices />,   value: '8',    label: 'Cuisines' },
  { icon: <FaStar />,     value: '4.8★', label: 'Rating' },
];

function useScrollReveal(className = 'reveal') {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('revealed'); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function RevealBox({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transitionDelay = `${delay}ms`;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('revealed'); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal-box ${className}`}>
      {children}
    </div>
  );
}

export default function About() {
  const { t, lang } = useLanguage();
  const heroRef    = useScrollReveal();
  const statsRef   = useScrollReveal();

  return (
    <div className="about-page page-wrapper page-enter">

      {/* ══ HERO ══ */}
      <section className="about-hero-section">
        <div className="about-hero-bg">
          <div className="hero-spice-ring hero-spice-1" />
          <div className="hero-spice-ring hero-spice-2" />
          <div className="hero-spice-ring hero-spice-3" />
        </div>
        <div className="container about-hero-content" ref={heroRef}>
          <div className="about-hero-icon-wrap">
            <GiCookingPot className="about-hero-pot" />
          </div>
          <span className="about-eyebrow">✦ Our Story ✦</span>
          <h1 className="about-hero-title">{t('aboutTitle')}</h1>
          <p className="about-hero-text">{t('aboutText')}</p>
          <div className="about-hero-tags">
            <span><GiIndiaGate /> Born in India</span>
            <span><FaHeart /> Made with Love</span>
            <span><GiHotSpices /> Pure Spices</span>
          </div>
        </div>
      </section>

      {/* ══ STATS BAND ══ */}
      <div className="about-stats-band" ref={statsRef}>
        <div className="container about-stats-grid">
          {STATS.map((s, i) => (
            <RevealBox key={s.label} delay={i * 80} className="about-stat-item">
              <span className="about-stat-icon">{s.icon}</span>
              <span className="about-stat-value">{s.value}</span>
              <span className="about-stat-label">{s.label}</span>
            </RevealBox>
          ))}
        </div>
      </div>

      {/* ══ VALUES ══ */}
      <section className="about-section">
        <div className="container">
          <RevealBox className="about-section-header">
            <span className="section-eyebrow">What We Believe</span>
            <h2>Our Philosophy</h2>
            <p>Four pillars that shape every recipe we share</p>
          </RevealBox>

          <div className="values-grid">
            {VALUES.map((v, i) => (
              <RevealBox key={v.title} delay={i * 100} className="value-card">
                <div className="value-icon-wrap" style={{ background: v.bg, color: v.color }}>
                  {v.icon}
                </div>
                <h3 className="value-title">
                  {v.title}
                  {lang === 'hi' && <span className="value-title-hi devanagari"> · {v.titleHi}</span>}
                </h3>
                <p className="value-text">{v.text}</p>
                <div className="value-accent" style={{ background: v.color }} />
              </RevealBox>
            ))}
          </div>
        </div>
      </section>

      {/* ══ STORY TIMELINE ══ */}
      <section className="about-section about-section-mist">
        <div className="container">
          <RevealBox className="about-section-header">
            <span className="section-eyebrow">Our Journey</span>
            <h2>How It Started</h2>
          </RevealBox>
          <div className="timeline">
            {[
              { year: '2018', title: 'The Spark', text: 'Meera started documenting her grandmother\'s recipes on a small blog in Delhi.', icon: <FaHeart /> },
              { year: '2020', title: 'Growing Family', text: 'Ravi and Sunita joined. We began traveling across India collecting regional recipes.', icon: <FaUsers /> },
              { year: '2022', title: 'Rasoi Ghar Born', text: 'Launched as a full platform with voice-assisted recipes in Hindi and English.', icon: <GiCookingPot /> },
              { year: '2024', title: '50K+ Community', text: 'Grew to a community of food lovers across India and the world.', icon: <FaStar /> },
            ].map((item, i) => (
              <RevealBox key={item.year} delay={i * 120} className="timeline-item">
                <div className="timeline-year">{item.year}</div>
                <div className="timeline-dot">{item.icon}</div>
                <div className="timeline-body">
                  <h4>{item.title}</h4>
                  <p>{item.text}</p>
                </div>
              </RevealBox>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TEAM ══ */}
      <section className="about-section">
        <div className="container">
          <RevealBox className="about-section-header">
            <span className="section-eyebrow">The People</span>
            <h2>Meet Our Team</h2>
            <p>The hearts behind every recipe</p>
          </RevealBox>

          <div className="team-grid">
            {TEAM.map((m, i) => (
              <RevealBox key={m.name} delay={i * 120} className="team-card">
                <div className="team-card-top" style={{ '--team-color': m.color }}>
                  <div className="team-avatar" style={{ background: m.color + '18', color: m.color }}>
                    {m.icon}
                  </div>
                  <div className="team-glow" style={{ background: m.color }} />
                </div>
                <div className="team-card-body">
                  <h3 className="team-name">{m.name}</h3>
                  <p className="team-role" style={{ color: m.color }}>{m.role}</p>
                  {lang === 'hi' && <p className="team-role-hi devanagari">{m.roleHi}</p>}
                  <p className="team-bio">{m.bio}</p>
                  <div className="team-footer">
                    <span className="team-location"><FaMapMarkerAlt /> {m.location}</span>
                    <span className="team-social"><FaInstagram /> {m.social}</span>
                  </div>
                </div>
              </RevealBox>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA BANNER ══ */}
      <section className="about-cta">
        <div className="container about-cta-inner">
          <RevealBox className="about-cta-content">
            <GiHotSpices className="cta-spice-icon" />
            <h2>Start Your Culinary Journey</h2>
            <p>Explore 100+ authentic recipes from across India — with voice guidance in Hindi</p>
            <div className="cta-buttons">
              <Link to="/recipes" className="btn-primary">Explore Recipes →</Link>
              <Link to="/contact" className="cta-btn-ghost">Get in Touch</Link>
            </div>
          </RevealBox>
        </div>
      </section>

    </div>
  );
}