import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import HeroSlider from '../components/HeroSlider';
import RecipeCard from '../components/RecipeCard';
import { useLanguage } from '../context/LanguageContext';
import recipes from '../data/recipes.json';

const FEATURED = recipes.slice(0, 6);

const SPICES = [
  { icon: '🌶', name: 'Spicy', count: 24 },
  { icon: '🧄', name: 'Aromatic', count: 18 },
  { icon: '🍃', name: 'Healthy', count: 31 },
  { icon: '🍯', name: 'Sweet', count: 15 },
];

export default function Home() {
  const { t } = useLanguage();
  const statsRef = useRef(null);

  // Animate stat numbers
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.stat-num').forEach(el => {
          const target = parseInt(el.dataset.target);
          let count = 0;
          const step = Math.ceil(target / 40);
          const timer = setInterval(() => {
            count = Math.min(count + step, target);
            el.textContent = count + (el.dataset.suffix || '');
            if (count >= target) clearInterval(timer);
          }, 40);
        });
        obs.disconnect();
      }
    }, { threshold: 0.4 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="page-enter">
      <HeroSlider />

      {/* Stats bar */}
      <div ref={statsRef} style={{ background: 'var(--cardamom)', padding: '32px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24, textAlign: 'center' }}>
            {[['100', '+', 'Recipes'], ['8', '+', 'Cuisines'], ['50', 'K+', 'Food Lovers'], ['4.8', '★', 'Rating']].map(([n, s, l]) => (
              <div key={l}>
                <div style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 800, color: 'var(--saffron)', fontFamily: "'Playfair Display',serif" }}>
                  <span className="stat-num" data-target={parseInt(n)} data-suffix={s}>{n}{s}</span>
                </div>
                <div style={{ color: 'rgba(255,248,240,0.65)', fontSize: '0.82rem', marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Flavor tags */}
      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="container">
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            {SPICES.map(s => (
              <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'white', padding: '12px 24px', borderRadius: 50, boxShadow: 'var(--shadow-sm)', fontSize: '0.9rem' }}>
                <span style={{ fontSize: '1.3rem' }}>{s.icon}</span>
                <span style={{ fontWeight: 600, color: 'var(--cardamom)' }}>{s.name}</span>
                <span style={{ color: 'var(--saffron)', fontWeight: 700 }}>{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured recipes */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">✦ Hand Picked ✦</span>
            <h2>{t('featuredTitle')}</h2>
            <p>{t('featuredSub')}</p>
          </div>
          <div className="spice-divider">• • •</div>
          <div className="recipes-grid">
            {FEATURED.map((r, i) => <RecipeCard key={r.id} recipe={r} delay={i * 80} />)}
          </div>
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link to="/recipes" className="btn-primary">View All Recipes →</Link>
          </div>
        </div>
      </section>

      {/* Banner */}
      <section style={{ background: 'linear-gradient(135deg, var(--saffron) 0%, var(--deep-turmeric) 100%)', padding: '80px 0', textAlign: 'center', color: 'white' }}>
        <div className="container">
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.8rem,4vw,3rem)', marginBottom: 16 }}>
            Cook with Love 💛
          </h2>
          <p style={{ opacity: 0.9, fontSize: '1.05rem', maxWidth: 480, margin: '0 auto 32px' }}>
            Every recipe is a story — of grandmothers, family dinners, and the smell of spices in the morning.
          </p>
          <Link to="/recipes" style={{ background: 'white', color: 'var(--saffron)', padding: '14px 32px', borderRadius: 50, fontWeight: 700, fontSize: '0.95rem', display: 'inline-block', transition: 'var(--transition)' }}>
            Start Cooking →
          </Link>
        </div>
      </section>
    </div>
  );
}
