import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaLeaf, FaDrumstickBite, FaClock, FaUsers, FaArrowRight } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import '../styles/recipe-card.css';

export default function RecipeCard({ recipe, delay = 0 }) {
  const { lang, translate, t } = useLanguage();
  const [translatedName, setTranslatedName] = useState('');
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (lang === 'en') { setTranslatedName(''); return; }
    setTranslatedName('…');
    translate(recipe.name).then(setTranslatedName);
  }, [lang, recipe.name]);

  const diffClass = { Easy: 'diff-easy', Medium: 'diff-medium', Hard: 'diff-hard' }[recipe.difficulty] || 'diff-medium';

  return (
    <div
      ref={ref}
      className={`recipe-card fade-in-up${visible ? ' visible' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
      onClick={() => navigate(`/recipes/${recipe.slug}`)}
    >
      <div className="recipe-card-img">
        <img src={recipe.image} alt={recipe.name} loading="lazy" />
        <div className="card-badge">
          <span className={recipe.type === 'veg' ? 'badge-veg' : 'badge-nonveg'}>
            {recipe.type === 'veg' ? <><FaLeaf /> Veg</> : <><FaDrumstickBite /> Non-Veg</>}
          </span>
        </div>
        <span className="card-time"><FaClock style={{marginRight:4}}/>{recipe.time}</span>
      </div>

      <div className="recipe-card-body">
        <div className="card-category">{recipe.category}</div>
        <h3>{recipe.name}</h3>
        {lang !== 'en' && (
          <div className="card-name-translated devanagari">{translatedName}</div>
        )}
        <p className="card-desc">{recipe.description}</p>
        <div className="card-meta">
          <div className="card-rating">
            <FaStar style={{ color: 'var(--gold)', fontSize: '0.85rem' }} />
            <strong>{recipe.rating}</strong>
            <span className="card-reviews">({recipe.reviews})</span>
          </div>
          <span className={`card-difficulty ${diffClass}`}>{recipe.difficulty}</span>
        </div>
      </div>

      <div className="card-footer">
        <span className="card-serves"><FaUsers style={{marginRight:4}}/>{recipe.servings} {t('serves')}</span>
        <span className="card-view-btn">{t('viewRecipe')} <FaArrowRight /></span>
      </div>
    </div>
  );
}
