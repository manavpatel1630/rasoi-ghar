import { useState, useRef, useEffect } from 'react';
import {
  FaEnvelope, FaPhone, FaMapMarkerAlt,
  FaInstagram, FaYoutube, FaTwitter,
  FaUser, FaComment, FaPaperPlane,
  FaCheckCircle, FaClock, FaHeart,
  FaUtensils, FaArrowRight
} from 'react-icons/fa';
import { GiCookingPot, GiHotSpices } from 'react-icons/gi';
import { useLanguage } from '../context/LanguageContext';
import '../styles/contact.css';

/* ── Scroll reveal helper ── */
function RevealBox({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transitionDelay = `${delay}ms`;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('c-revealed'); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return <div ref={ref} className={`c-reveal ${className}`}>{children}</div>;
}

const INFO_CARDS = [
  {
    icon: <FaEnvelope />,
    label: 'Email Us',
    labelHi: 'ईमेल करें',
    value: 'manavvirja16@gmail.com',
    href: 'manavvirja16@gmail.com',
    color: '#FF6B2C',
    bg: '#fff3ee',
    note: 'Reply within 48h',
    noteHi: '48 घंटे में जवाब',
  },
  {
    icon: <FaPhone />,
    label: 'Call Us',
    labelHi: 'कॉल करें',
    value: '+91 81406 40958',
    href: 'tel:+918140640958',
    color: '#3D7A3A',
    bg: '#f0f7f0',
    note: 'Mon–Sat, 10am–6pm',
    noteHi: 'सोम–शनि, 10am–6pm',
  },
  {
    icon: <FaMapMarkerAlt />,
    label: 'Find Us',
    labelHi: 'पता',
    value: 'Ahemdabad, Gujrat',
    href: 'https://maps.app.goo.gl/YLyieAyEMwHMhTXs9',
    color: '#8B5CF6',
    bg: '#f5f0ff',
    note: 'India 🇮🇳',
    noteHi: 'भारत 🇮🇳',
  },
];

const SOCIALS = [
  { icon: <FaInstagram />, label: 'Instagram', handle: '@rasoi.ghar', href: '#', color: '#E1306C' },
  { icon: <FaYoutube />,   label: 'YouTube',   handle: 'Rasoi Ghar',  href: '#', color: '#FF0000' },
  { icon: <FaTwitter />,   label: 'Twitter',   handle: '@rasoighar',  href: '#', color: '#1DA1F2' },
];

const FAQS = [
  { q: 'Can I submit my own recipe?',        qHi: 'क्या मैं अपनी रेसिपी भेज सकता हूँ?',       a: 'Absolutely! Send us your recipe via this form or email directly.' },
  { q: 'Do you offer cooking classes?',      qHi: 'क्या आप कुकिंग क्लासेस देते हैं?',          a: 'We\'re working on it! Stay tuned on Instagram for announcements.' },
  { q: 'How do I report an issue?',          qHi: 'समस्या कैसे बताएं?',                         a: 'Use the contact form below with "Bug Report" as subject.' },
];

export default function Contact() {
  const { t, lang } = useLanguage();
  const isHindi = lang === 'hi';

  const [form,   setForm]   = useState({ name: '', email: '', subject: '', message: '' });
  const [sent,   setSent]   = useState(false);
  const [active, setActive] = useState(null); // FAQ accordion

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="contact-page page-wrapper page-enter">

      {/* ══ HERO ══ */}
      <section className="ct-hero">
        <div className="ct-hero-bg">
          <div className="ct-ring ct-ring-1" />
          <div className="ct-ring ct-ring-2" />
          <div className="ct-ring ct-ring-3" />
        </div>
        <div className="container ct-hero-inner">
          <div className="ct-hero-icon-wrap">
            <GiCookingPot className="ct-hero-pot" />
          </div>
          <span className="ct-eyebrow">✦ {isHindi ? 'हमसे जुड़ें' : 'Get In Touch'} ✦</span>
          <h1 className="ct-hero-title">{t('contactTitle')}</h1>
          <p className="ct-hero-sub">{t('contactText')}</p>
          <div className="ct-hero-chips">
            <span><FaClock /> {isHindi ? '24 घंटे में जवाब' : '24h Response'}</span>
            <span><FaHeart /> {isHindi ? 'प्यार से बनाया' : 'Made with Love'}</span>
            <span><GiHotSpices /> {isHindi ? 'भारत से' : 'From India'}</span>
          </div>
        </div>
      </section>

      {/* ══ INFO CARDS ══ */}
      <section className="ct-info-section">
        <div className="container ct-info-grid">
          {INFO_CARDS.map((card, i) => (
            <RevealBox key={card.label} delay={i * 100}>
              <a href={card.href} className="ct-info-card" target="_blank" rel="noopener noreferrer">
                <div className="ct-card-icon" style={{ background: card.bg, color: card.color }}>
                  {card.icon}
                </div>
                <div className="ct-card-body">
                  <div className="ct-card-label">
                    {isHindi ? card.labelHi : card.label}
                  </div>
                  <div className="ct-card-value">{card.value}</div>
                  <div className="ct-card-note">
                    {isHindi ? card.noteHi : card.note}
                  </div>
                </div>
                <FaArrowRight className="ct-card-arrow" style={{ color: card.color }} />
              </a>
            </RevealBox>
          ))}
        </div>
      </section>

      {/* ══ MAIN: FORM + SIDEBAR ══ */}
      <section className="ct-main-section">
        <div className="container ct-main-grid">

          {/* ── FORM ── */}
          <RevealBox className="ct-form-wrap">
            <div className="ct-form-card">
              <div className="ct-form-header">
                <FaPaperPlane className="ct-form-header-icon" />
                <div>
                  <h2>{isHindi ? 'संदेश भेजें' : 'Send a Message'}</h2>
                  <p>{isHindi ? 'आपका संदेश हम तक पहुँचाएं' : 'We read every message personally'}</p>
                </div>
              </div>

              {sent ? (
                /* SUCCESS */
                <div className="ct-success">
                  <div className="ct-success-circle">
                    <FaCheckCircle />
                  </div>
                  <h3>{isHindi ? 'संदेश भेजा गया! 🎉' : 'Message Received! 🎉'}</h3>
                  <p>
                    {isHindi
                      ? 'धन्यवाद! हम जल्द ही एक प्याली चाय के साथ जवाब देंगे ☕'
                      : "Thank you! We'll reply within 24 hours over a hot cup of chai ☕"}
                  </p>
                  <button className="ct-send-btn" onClick={() => { setSent(false); setForm({ name:'', email:'', subject:'', message:'' }); }} style={{ marginTop: 24 }}>
                    {isHindi ? 'नया संदेश भेजें' : 'Send Another Message'}
                  </button>
                </div>
              ) : (
                /* FORM */
                <form className="ct-form" onSubmit={handleSubmit} noValidate>
                  <div className="ct-form-row">
                    <div className="ct-form-group">
                      <label htmlFor="name">
                        <FaUser /> {t('contactName')} <span className="req">*</span>
                      </label>
                      <input
                        id="name" name="name" type="text" required
                        value={form.name} onChange={handleChange}
                        placeholder={isHindi ? 'प्रिया शर्मा' : 'Priya Sharma'}
                      />
                    </div>
                    <div className="ct-form-group">
                      <label htmlFor="email">
                        <FaEnvelope /> {t('contactEmail')} <span className="req">*</span>
                      </label>
                      <input
                        id="email" name="email" type="email" required
                        value={form.email} onChange={handleChange}
                        placeholder="priya@example.com"
                      />
                    </div>
                  </div>

                  <div className="ct-form-group">
                    <label htmlFor="subject">
                      <FaUtensils /> {isHindi ? 'विषय' : 'Subject'}
                    </label>
                    <input
                      id="subject" name="subject" type="text"
                      value={form.subject} onChange={handleChange}
                      placeholder={isHindi ? 'बिरयानी रेसिपी के बारे में...' : 'About your Biryani recipe…'}
                    />
                  </div>

                  <div className="ct-form-group">
                    <label htmlFor="message">
                      <FaComment /> {t('contactMsg')} <span className="req">*</span>
                    </label>
                    <textarea
                      id="message" name="message" required rows={5}
                      value={form.message} onChange={handleChange}
                      placeholder={isHindi ? 'आपका संदेश यहाँ लिखें...' : 'I love your recipes! I wanted to ask…'}
                    />
                    <span className="ct-char-count">{form.message.length} / 1000</span>
                  </div>

                  <button type="submit" className="ct-send-btn">
                    <FaPaperPlane /> {t('contactSend')}
                  </button>

                  <p className="ct-privacy">
                    🔒 {isHindi ? 'आपकी जानकारी सुरक्षित है।' : 'Your info is private. We never spam.'}
                  </p>
                </form>
              )}
            </div>
          </RevealBox>

          {/* ── SIDEBAR ── */}
          <div className="ct-sidebar">

            {/* Social links */}
            <RevealBox delay={100}>
              <div className="ct-sidebar-card">
                <h3 className="ct-sidebar-title">
                  <FaHeart style={{ color: 'var(--saffron)' }} />
                  {isHindi ? 'हमें फॉलो करें' : 'Follow Us'}
                </h3>
                <div className="ct-socials">
                  {SOCIALS.map(s => (
                    <a key={s.label} href={s.href} className="ct-social-row" style={{ '--sc': s.color }}>
                      <span className="ct-social-icon" style={{ background: s.color + '18', color: s.color }}>
                        {s.icon}
                      </span>
                      <div>
                        <div className="ct-social-label">{s.label}</div>
                        <div className="ct-social-handle">{s.handle}</div>
                      </div>
                      <FaArrowRight className="ct-social-arrow" />
                    </a>
                  ))}
                </div>
              </div>
            </RevealBox>

            {/* Response time visual */}
            <RevealBox delay={180}>
              <div className="ct-response-card">
                <div className="ct-response-top">
                  <FaClock className="ct-response-clock" />
                  <div>
                    <div className="ct-response-title">{isHindi ? 'जवाब का समय' : 'Response Time'}</div>
                    <div className="ct-response-val">{isHindi ? 'आमतौर पर 4 घंटे' : 'Usually 4 hours'}</div>
                  </div>
                </div>
                <div className="ct-response-bar">
                  <div className="ct-response-fill" />
                </div>
                <div className="ct-response-times">
                  <span>0h</span><span>12h</span><span>24h</span>
                </div>
              </div>
            </RevealBox>

            {/* FAQ accordion */}
            <RevealBox delay={260}>
              <div className="ct-sidebar-card">
                <h3 className="ct-sidebar-title">
                  <GiHotSpices style={{ color: 'var(--saffron)' }} />
                  {isHindi ? 'अक्सर पूछे जाने वाले सवाल' : 'Quick FAQs'}
                </h3>
                <div className="ct-faq-list">
                  {FAQS.map((faq, i) => (
                    <div key={i} className={`ct-faq-item${active === i ? ' ct-faq-open' : ''}`}>
                      <button className="ct-faq-q" onClick={() => setActive(active === i ? null : i)}>
                        <span>{isHindi ? faq.qHi : faq.q}</span>
                        <span className="ct-faq-chevron">{active === i ? '−' : '+'}</span>
                      </button>
                      {active === i && (
                        <div className="ct-faq-a">{faq.a}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </RevealBox>
          </div>
        </div>
      </section>

      {/* ══ CTA BANNER ══ */}
      <section className="ct-cta">
        <div className="container ct-cta-inner">
          <GiCookingPot className="ct-cta-icon" />
          <h2>{isHindi ? 'रसोई घर में आपका स्वागत है' : 'Join Our Food Community'}</h2>
          <p>{isHindi ? '100+ रेसिपी, हिंदी में आवाज़ सहायता के साथ' : 'Explore 100+ authentic recipes with Hindi voice guidance'}</p>
          <a href="/recipes" className="btn-primary">
            {isHindi ? 'रेसिपी देखें' : 'Explore Recipes'} <FaArrowRight />
          </a>
        </div>
      </section>

    </div>
  );
}