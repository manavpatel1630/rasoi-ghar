import { useState, useMemo } from 'react';
import RecipeCard from '../components/RecipeCard';
import CategoryFilter from '../components/CategoryFilter';
import { useLanguage } from '../context/LanguageContext';
import recipes from '../data/recipes.json';

export default function Recipes() {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('All');
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = useMemo(() => {
    return recipes.filter(r => {
      const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.description.toLowerCase().includes(search.toLowerCase()) ||
        r.tags.some(tag => tag.includes(search.toLowerCase()));
      const matchCat = cat === 'All' || r.category === cat;
      const matchType = typeFilter === 'all' || r.type === typeFilter;
      return matchSearch && matchCat && matchType;
    });
  }, [search, cat, typeFilter]);

  return (
    <div className="page-enter page-wrapper">
      <div style={{ background: 'linear-gradient(135deg, var(--cardamom) 0%, #5c3d22 100%)', padding: '48px 0 64px', textAlign: 'center', color: 'white' }}>
        <div className="container">
          <span className="section-eyebrow" style={{ color: 'var(--gold)' }}>✦ Our Collection ✦</span>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2rem,5vw,3.5rem)', color: 'white', marginBottom: 12 }}>
            {t('recipes')}
          </h1>
          <p style={{ opacity: 0.75, fontSize: '1rem' }}>Discover {recipes.length} authentic Indian recipes</p>
        </div>
      </div>

      <div className="container section">
        {/* Search */}
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('searchPlaceholder')}
          />
          {search && <button onClick={() => setSearch('')} style={{ color: '#9a7155', fontSize: '1.1rem' }}>✕</button>}
        </div>

        <CategoryFilter active={cat} onChange={setCat} typeFilter={typeFilter} onTypeChange={setTypeFilter} />

        {filtered.length === 0 ? (
          <div className="no-results">
            <div className="nr-icon">🍽</div>
            <p>{t('noResults')}</p>
          </div>
        ) : (
          <>
            <p style={{ color: '#9a7155', fontSize: '0.85rem', marginBottom: 24 }}>
              Showing {filtered.length} recipe{filtered.length !== 1 ? 's' : ''}
            </p>
            <div className="recipes-grid">
              {filtered.map((r, i) => <RecipeCard key={r.id} recipe={r} delay={i * 60} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
