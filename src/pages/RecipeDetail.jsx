import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FaArrowLeft, FaPlay, FaStop, FaStepForward, FaStepBackward,
  FaRedo, FaLeaf, FaDrumstickBite, FaClock, FaUsers,
  FaChartBar, FaStar, FaVolumeUp, FaYoutube, FaFire
} from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import VoiceAssistant, { speakText, stopAllSpeech, preloadVoices, LANG_CODES } from '../components/VoiceAssistant';
import recipes from '../data/recipes.json';
import '../styles/recipe-detail.css';

export default function RecipeDetail() {
  const { slug } = useParams();
  const { lang, translate, t } = useLanguage();
  const recipe = recipes.find(r => r.slug === slug);

  const [translatedName, setTranslatedName]               = useState('');
  const [translatedDesc, setTranslatedDesc]               = useState('');
  const [translatedIngredients, setTranslatedIngredients] = useState([]);
  const [translatedSteps, setTranslatedSteps]             = useState([]);
  const [loading, setLoading]       = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isReading, setIsReading]     = useState(false);
  const [isSpeaking, setIsSpeaking]   = useState(false);
  const [activeTab, setActiveTab]     = useState('ingredients');
  const [showVideo, setShowVideo]     = useState(false);

  // Ref always holds latest translated steps — avoids stale closure
  const stepsRef    = useRef([]);
  const readingRef  = useRef(false);  // true while auto-read chain is active
  const cancelChain = useRef(false);  // set true to break auto-advance

  /* ── Stop everything on page leave ── */
  useEffect(() => {
    return () => {
      cancelChain.current = true;
      readingRef.current  = false;
      stopAllSpeech();
    };
  }, []);

  /* ── Stop TTS when language switches ── */
  useEffect(() => {
    cancelChain.current = true;
    readingRef.current  = false;
    stopAllSpeech();
    setIsReading(false);
    setIsSpeaking(false);
  }, [lang]);

  /* ── Translate whenever lang or recipe changes ── */
  useEffect(() => {
    if (!recipe) return;
    if (lang === 'en') {
      setTranslatedName(''); setTranslatedDesc('');
      setTranslatedIngredients([]); setTranslatedSteps([]);
      stepsRef.current = [];
      return;
    }
    setLoading(true);
    setTranslatedIngredients([]); setTranslatedSteps([]);
    stepsRef.current = [];

    const run = async () => {
      const [name, desc] = await Promise.all([
        translate(recipe.name),
        translate(recipe.description),
      ]);
      setTranslatedName(name);
      setTranslatedDesc(desc);

      const ingreds = [];
      for (const ing of recipe.ingredients) {
        ingreds.push(await translate(ing));
        setTranslatedIngredients([...ingreds]);
      }
      const stps = [];
      for (const step of recipe.steps) {
        stps.push(await translate(step));
        stepsRef.current = [...stps];
        setTranslatedSteps([...stps]);
      }
      setLoading(false);
    };
    run();
  }, [lang, recipe?.slug]);

  /* ── TTS: voice lang — Gujarati uses hi-IN voice ── */
  const getVoiceLang = useCallback(() => LANG_CODES[lang] || 'en-US', [lang]);

  const getStepText = useCallback((index, trSteps) => {
    if (lang !== 'en' && trSteps?.[index]) return trSteps[index];
    return recipe?.steps[index] || '';
  }, [lang, recipe]);

  /* Recursive step speaker using refs so it never goes stale */
  const speakStep = useCallback((stepIndex, trSteps) => {
    if (cancelChain.current) return;
    const text = getStepText(stepIndex, trSteps);
    if (!text) return;

    setIsSpeaking(true);
    speakText(
      text,
      getVoiceLang(),
      () => { if (!cancelChain.current) setIsSpeaking(true); },
      () => {
        setIsSpeaking(false);
        if (!cancelChain.current && readingRef.current &&
            stepIndex < (recipe?.steps.length ?? 0) - 1) {
          const next = stepIndex + 1;
          setCurrentStep(next);
          speakStep(next, trSteps);
        } else {
          readingRef.current = false;
          setIsReading(false);
        }
      }
    );
  }, [lang, recipe, getStepText, getVoiceLang]);

  const getCurrentSteps = () =>
    stepsRef.current.length > 0 ? stepsRef.current : translatedSteps;

  const readRecipe = () => {
    // preloadVoices() is critical for Chrome on deployed/HTTPS sites
    preloadVoices().then(() => {
      cancelChain.current = false;
      readingRef.current  = true;
      setIsReading(true);
      setCurrentStep(0);
      setActiveTab('steps');
      speakStep(0, getCurrentSteps());
    });
  };

  const stopReading = () => {
    cancelChain.current = true;
    readingRef.current  = false;
    stopAllSpeech();
    setIsReading(false);
    setIsSpeaking(false);
  };

  const handleNextStep = () => {
    const next = Math.min(currentStep + 1, (recipe?.steps.length ?? 1) - 1);
    setCurrentStep(next);
    if (isReading) {
      cancelChain.current = false;
      stopAllSpeech();
      setTimeout(() => speakStep(next, getCurrentSteps()), 120);
    }
  };
  const handlePrevStep = () => {
    const prev = Math.max(currentStep - 1, 0);
    setCurrentStep(prev);
    if (isReading) {
      cancelChain.current = false;
      stopAllSpeech();
      setTimeout(() => speakStep(prev, getCurrentSteps()), 120);
    }
  };
  const handleRepeat = () => {
    cancelChain.current = false;
    stopAllSpeech();
    setTimeout(() => speakStep(currentStep, getCurrentSteps()), 120);
  };

  if (!recipe) return (
    <div className="page-wrapper" style={{ textAlign:'center', padding:'80px 24px' }}>
      <div style={{ fontSize:'3rem', marginBottom:16 }}>🍽</div>
      <h2>Recipe not found</h2>
      <Link to="/recipes" className="btn-primary" style={{ marginTop:24, display:'inline-flex' }}>← Back</Link>
    </div>
  );

  const diffClass = { Easy:'diff-easy', Medium:'diff-medium', Hard:'diff-hard' }[recipe.difficulty] || 'diff-medium';
  const isHindi    = lang === 'hi';
  const isGujarati = lang === 'gu';
  const isIndian   = isHindi || isGujarati;

  const related = recipes.filter(r => r.category === recipe.category && r.slug !== recipe.slug).slice(0, 3);

  return (
    <div className="page-wrapper page-enter">
      <div className="recipe-detail">
        <Link to="/recipes" className="recipe-detail-back">
          <FaArrowLeft /> {t('backToRecipes')}
        </Link>

        <div className="rd-layout">
          {/* ── MAIN ── */}
          <div className="rd-main">
            <div className="recipe-detail-hero">
              <div className="recipe-detail-img">
                <img src={recipe.image} alt={recipe.name} />
              </div>
              <div className="recipe-detail-info">
                <div className="recipe-detail-badges">
                  <span className={recipe.type === 'veg' ? 'badge-veg' : 'badge-nonveg'}>
                    {recipe.type === 'veg' ? <><FaLeaf /> Veg</> : <><FaDrumstickBite /> Non-Veg</>}
                  </span>
                  <span className="badge-cat">{recipe.category}</span>
                </div>

                <h1 className="recipe-en-title">{recipe.name}</h1>
                {isIndian && (
                  <div className="recipe-translated-title devanagari">
                    {translatedName || <span className="skeleton" style={{display:'inline-block',width:200,height:'1.1em',borderRadius:6}}/>}
                  </div>
                )}

                <div className="recipe-detail-rating">
                  <FaStar style={{ color:'var(--gold)' }} />
                  <strong>{recipe.rating}</strong>
                  <span style={{ color:'#9a7155', fontSize:'0.82rem' }}>({recipe.reviews} {t('reviews')})</span>
                </div>

                <p className="recipe-detail-desc">{recipe.description}</p>
                {isIndian && translatedDesc && (
                  <p className="recipe-detail-desc-translated devanagari">{translatedDesc}</p>
                )}

                <div className="recipe-stats">
                  <div className="recipe-stat">
                    <FaClock className="stat-icon-ri"/>
                    <span className="stat-value">{recipe.time}</span>
                    <span className="stat-label">{t('time')}</span>
                  </div>
                  <div className="recipe-stat">
                    <FaUsers className="stat-icon-ri"/>
                    <span className="stat-value">{recipe.servings}</span>
                    <span className="stat-label">{t('serves')}</span>
                  </div>
                  <div className="recipe-stat">
                    <FaChartBar className="stat-icon-ri"/>
                    <span className={`stat-value card-difficulty ${diffClass}`}
                      style={{display:'inline-block',fontSize:'0.72rem',padding:'2px 8px'}}>
                      {recipe.difficulty}
                    </span>
                    <span className="stat-label">{t('difficulty')}</span>
                  </div>
                </div>

                {/* Gujarati note */}
                {isGujarati && (
                  <div style={{fontSize:'0.75rem',color:'#9a7155',background:'var(--mist)',padding:'8px 12px',borderRadius:8,marginBottom:12}}>
                    🔤 ગુજરાતી અનુવાદ · 🔊 હિંદી અવાજ (voice in Hindi)
                  </div>
                )}

                <div className="voice-controls">
                  {!isReading ? (
                    <button className="voice-btn voice-btn-primary" onClick={readRecipe}>
                      <FaVolumeUp /> {t('readRecipe')}
                    </button>
                  ) : (
                    <>
                      <button className="voice-btn voice-btn-danger" onClick={stopReading}>
                        <FaStop /> {t('stopReading')}
                      </button>
                      <button className="voice-btn voice-btn-secondary" onClick={handlePrevStep}>
                        <FaStepBackward /> {t('prevStep')}
                      </button>
                      <button className="voice-btn voice-btn-secondary" onClick={handleNextStep}>
                        {t('nextStep')} <FaStepForward />
                      </button>
                      <button className="voice-btn voice-btn-secondary" onClick={handleRepeat}>
                        <FaRedo />
                      </button>
                    </>
                  )}
                </div>

                <div className="recipe-tags" style={{marginTop:16}}>
                  {recipe.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
                </div>
              </div>
            </div>

            {/* TAB BAR */}
            <div className="recipe-tab-bar">
              {['ingredients','steps'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`recipe-tab-btn${activeTab===tab?' active':''}`}>
                  {tab==='ingredients'?'🌿':'📋'}{' '}
                  <span className="tab-en">{tab==='ingredients'?t('ingredients'):t('steps')}</span>
                  {isIndian && (
                    <span className="tab-translated devanagari">
                      {tab==='ingredients'
                        ?(isHindi?'सामग्री':'સામગ્રી')
                        :(isHindi?'विधि':'રીત')}
                    </span>
                  )}
                </button>
              ))}
              {loading && lang!=='en' && (
                <span className="translating-badge">⟳ {t('translating')}</span>
              )}
            </div>

            {/* INGREDIENTS + STEPS */}
            <div className="recipe-sections">
              <div className={`recipe-col ingredients-col${activeTab==='steps'?' tab-hidden':''}`}>
                <h2 className="recipe-section-title">🌿 {t('ingredients')}</h2>
                <ul className="ingredients-list">
                  {recipe.ingredients.map((ing, i) => (
                    <li key={i}>
                      <div className="ingredient-content">
                        <span className="ingredient-original">{ing}</span>
                        {isIndian && (
                          <span className="ingredient-translated devanagari">
                            {translatedIngredients[i] || (
                              <span className="skeleton" style={{display:'inline-block',width:'80%',height:'0.9em',borderRadius:4}}/>
                            )}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={`recipe-col steps-col${activeTab==='ingredients'?' tab-hidden':''}`}>
                <h2 className="recipe-section-title">📋 {t('steps')}</h2>
                <div className="steps-list">
                  {recipe.steps.map((step, i) => (
                    <div key={i}
                      className={`step-item${i===currentStep&&isReading?' active-step':''}`}
                      onClick={() => {
                        setCurrentStep(i);
                        if (isReading) {
                          cancelChain.current = false;
                          stopAllSpeech();
                          setTimeout(() => speakStep(i, getCurrentSteps()), 120);
                        }
                      }}>
                      <div className="step-number">{i+1}</div>
                      <div className="step-body">
                        <p className="step-text">{step}</p>
                        {isIndian && (
                          <span className="step-translated devanagari">
                            {translatedSteps[i] || (
                              <span className="skeleton" style={{display:'inline-block',width:'70%',height:'0.85em',borderRadius:4,marginTop:6}}/>
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <style>{`@media (min-width:901px){.ingredients-col,.steps-col{display:block!important}.tab-hidden{display:block!important}}`}</style>
          </div>

          {/* ── SIDEBAR ── */}
          <aside className="rd-sidebar">
            {recipe.videoId && (
              <div className="sidebar-video-card">
                <div className="sidebar-video-header">
                  <FaYoutube className="yt-icon"/>
                  <div>
                    <div className="sidebar-video-label">Watch & Cook</div>
                    {isIndian && translatedName && (
                      <div className="sidebar-video-name devanagari">{translatedName}</div>
                    )}
                  </div>
                </div>
                {!showVideo ? (
                  <div className="sidebar-thumb" onClick={() => setShowVideo(true)}>
                    <img
                      src={`https://img.youtube.com/vi/${recipe.videoId}/mqdefault.jpg`}
                      alt={recipe.name}
                      onError={e=>{e.target.src=`https://img.youtube.com/vi/${recipe.videoId}/hqdefault.jpg`;}}
                    />
                    <div className="sidebar-play-overlay">
                      <div className="sidebar-play-btn"><FaPlay/></div>
                    </div>
                  </div>
                ) : (
                  <div className="sidebar-iframe-wrap">
                    <iframe
                      src={`https://www.youtube.com/embed/${recipe.videoId}?autoplay=1&rel=0`}
                      title={recipe.name}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}
                <div className="sidebar-video-footer">
                  <span>Full step-by-step video</span>
                  <a href={`https://www.youtube.com/watch?v=${recipe.videoId}`}
                    target="_blank" rel="noopener noreferrer" className="yt-link">
                    Open on YouTube →
                  </a>
                </div>
              </div>
            )}

            <div className="sidebar-tips-card">
              <h3 className="sidebar-card-title">
                <FaFire style={{color:'var(--saffron)'}}/> Pro Tips
              </h3>
              <ul className="tips-list">
                <li>Always prep all ingredients before you start cooking.</li>
                <li>Taste as you go and adjust spice levels to preference.</li>
                <li>Fresh spices make a noticeable difference in flavor.</li>
                {recipe.type==='non-veg'&&<li>Marinate overnight for deepest flavor.</li>}
                {recipe.type==='veg'&&<li>Add a pinch of hing (asafoetida) for aroma.</li>}
              </ul>
            </div>

            {related.length>0 && (
              <div className="sidebar-related-card">
                <h3 className="sidebar-card-title">You May Also Like</h3>
                <div className="related-list">
                  {related.map(r => (
                    <Link key={r.slug} to={`/recipes/${r.slug}`} className="related-item">
                      <img src={r.image} alt={r.name}/>
                      <div className="related-info">
                        <span className="related-name">{r.name}</span>
                        <span className="related-meta">
                          <FaClock style={{fontSize:'0.7rem'}}/> {r.time} &nbsp;·&nbsp;
                          <FaStar style={{color:'var(--gold)',fontSize:'0.7rem'}}/> {r.rating}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>

      <VoiceAssistant
        steps={recipe.steps}
        currentStep={currentStep}
        onNextStep={handleNextStep}
        onPrevStep={handlePrevStep}
        onRepeat={handleRepeat}
      />
    </div>
  );
}