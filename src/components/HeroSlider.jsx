import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import '../styles/hero.css';

const SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=1400&q=80',
    eyebrow: '100+ Recipes',
    titleKey: 'heroTitle1',
    subKey: 'heroSub1',
  },
  {
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=1400&q=80',
    eyebrow: 'Since Generations',
    titleKey: 'heroTitle2',
    subKey: 'heroSub2',
  },
  {
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=1400&q=80',
    eyebrow: 'Across India',
    titleKey: 'heroTitle3',
    subKey: 'heroSub3',
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const { t } = useLanguage();
  const timerRef = useRef(null);

  const goTo = (i) => setCurrent((i + SLIDES.length) % SLIDES.length);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => goTo(current + 1), 5000);
    return () => clearInterval(timerRef.current);
  }, [current, paused]);

  return (
    <section className="hero" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="hero-slides" style={{ transform: `translateX(-${current * 100}%)` }}>
        {SLIDES.map((slide, i) => (
          <div key={i} className={`hero-slide${i === current ? ' active' : ''}`}>
            <img src={slide.image} alt="" loading={i === 0 ? 'eager' : 'lazy'} />
            <div className="hero-overlay" />
            <div className="hero-content">
              <div className="hero-text">
                <span className="hero-eyebrow">{slide.eyebrow}</span>
                <h1 className="hero-title">
                  {t(slide.titleKey)} <span>{t(slide.subKey)}</span>
                </h1>
                <p className="hero-subtitle">🌶 दाल • बिरयानी • मसाला चाय</p>
                <div className="hero-cta">
                  <Link to="/recipes" className="btn-primary">{t('heroCta')}</Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="hero-arrow left" onClick={() => goTo(current - 1)}>‹</button>
      <button className="hero-arrow right" onClick={() => goTo(current + 1)}>›</button>

      <div className="hero-dots">
        {SLIDES.map((_, i) => (
          <button key={i} className={`hero-dot${i === current ? ' active' : ''}`} onClick={() => goTo(i)} aria-label={`Slide ${i + 1}`} />
        ))}
      </div>
    </section>
  );
}
