import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import '../styles/footer.css';

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">🍛 Rasoi Ghar</div>
            <p className="devanagari">{t('footerTagline')}</p>
          </div>
          <div className="footer-col">
            <h4>Explore</h4>
            <ul>
              <li><Link to="/">{t('home')}</Link></li>
              <li><Link to="/recipes">{t('recipes')}</Link></li>
              <li><Link to="/about">{t('about')}</Link></li>
              <li><Link to="/contact">{t('contact')}</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Categories</h4>
            <ul>
              <li><Link to="/recipes?cat=North Indian">North Indian</Link></li>
              <li><Link to="/recipes?cat=South Indian">South Indian</Link></li>
              <li><Link to="/recipes?cat=Desserts">Desserts</Link></li>
              <li><Link to="/recipes?cat=Drinks">Drinks</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Rasoi Ghar. {t('allRightsReserved')}</p>
          <div className="footer-socials">
            <a href="#" aria-label="Instagram">📷</a>
            <a href="#" aria-label="YouTube">▶️</a>
            <a href="#" aria-label="Twitter">🐦</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
