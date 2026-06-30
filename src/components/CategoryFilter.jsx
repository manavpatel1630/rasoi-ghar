import { useLanguage } from '../context/LanguageContext';
import '../styles/recipe-card.css';

const CATEGORIES = ['All', 'North Indian', 'South Indian', 'Hyderabadi', 'Desserts', 'Drinks'];

export default function CategoryFilter({ active, onChange, typeFilter, onTypeChange }) {
  const { t } = useLanguage();

  return (
    <div>
      <div className="category-filter">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`filter-btn${active === cat ? ' active' : ''}`}
            onClick={() => onChange(cat)}
          >
            {cat === 'All' ? t('filterAll') : cat}
          </button>
        ))}
      </div>
      <div className="category-filter" style={{ marginTop: -24 }}>
        {[['all', t('filterAll')], ['veg', t('filterVeg')], ['non-veg', t('filterNonVeg')]].map(([val, label]) => (
          <button
            key={val}
            className={`filter-btn${typeFilter === val ? ' active' : ''}`}
            onClick={() => onTypeChange(val)}
          >
            {val === 'veg' ? '🌿 ' : val === 'non-veg' ? '🍖 ' : ''}{label}
          </button>
        ))}
      </div>
    </div>
  );
}
