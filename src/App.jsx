import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Recipes from './pages/Recipes';
import RecipeDetail from './pages/RecipeDetail';
import About from './pages/About';
import Contact from './pages/Contact';

// Import your downloaded animation asset
import panAnimation from './assets/watermarked_preview.mp4'; 
import './styles/global.css';
import './styles/animations.css';

/* ── Scroll to top on every route change ── */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

/* ── Slide transition wrapper with integrated Pan Loader ── */
function PageTransition() {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [stage, setStage] = useState('idle');
  const [pageLoading, setPageLoading] = useState(false);
  const [pageFadeOut, setPageFadeOut] = useState(false);
  const prevKey = useRef(location.key);

  useEffect(() => {
    // Skip if it's the initial render or same page click
    if (location.key === prevKey.current) return;
    prevKey.current = location.key;

    // 1. Show the frying pan loader overlay instantly on route change
    setPageLoading(true);
    setPageFadeOut(false);
    setStage('exit');

    // 2. Midway through: swap out the background page content
    const tContentSwap = setTimeout(() => {
      setDisplayLocation(location);
      setStage('enter');
    }, 300);

    // 3. Start fading out the loader overlay smoothly
    const tFadeLoader = setTimeout(() => {
      setPageFadeOut(true);
    }, 750);

    // 4. Completely drop the loader from the DOM and return page to idle
    const tComplete = setTimeout(() => {
      setPageLoading(false);
      setStage('idle');
    }, 1000); // Total transition time: 1 second per page switch

    return () => { 
      clearTimeout(tContentSwap); 
      clearTimeout(tFadeLoader); 
      clearTimeout(tComplete); 
    };
  }, [location]);

  return (
    <>
      {/* Page-to-Page Frying Pan Loader Overlay */}
      {pageLoading && (
        <div className={`app-preloader page-switch-loader ${pageFadeOut ? 'fade-out' : ''}`}>
          <div className="pan-loader-container">
            <video 
              src={panAnimation} 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="pan-loader-video"
            />
            <h2 className="loader-title">Preparing...</h2>
            <p className="loader-subtitle">Serving up fresh flavors</p>
          </div>
        </div>
      )}

      <div className={`page-transition-wrap stage-${stage}`}>
        <Routes location={displayLocation}>
          <Route path="/"              element={<Home />} />
          <Route path="/recipes"       element={<Recipes />} />
          <Route path="/recipes/:slug" element={<RecipeDetail />} />
          <Route path="/about"         element={<About />} />
          <Route path="/contact"       element={<Contact />} />
        </Routes>
      </div>
    </>
  );
}

export default function App() {
  const [initialLoading, setInitialLoading] = useState(true);
  const [initialFadeOut, setInitialFadeOut] = useState(false);

  // App startup loader (runs only once for 2 seconds when app first opens)
  useEffect(() => {
    const fadeTimeout = setTimeout(() => setInitialFadeOut(true), 1750);
    const removeTimeout = setTimeout(() => setInitialLoading(false), 2000);
    return () => { clearTimeout(fadeTimeout); clearTimeout(removeTimeout); };
  }, []);

  return (
    <LanguageProvider>
      <BrowserRouter>
        {/* App First Open Loader */}
        {initialLoading && (
          <div className={`app-preloader ${initialFadeOut ? 'fade-out' : ''}`}>
            <div className="pan-loader-container">
              <video src={panAnimation} autoPlay loop muted playsInline className="pan-loader-video" />
              <h2 className="loader-title">Rasoi Ghar</h2>
              <p className="loader-subtitle">Spicing up your screen...</p>
            </div>
          </div>
        )}

        <ScrollToTop />
        <Navbar />
        <PageTransition />
        <Footer />
      </BrowserRouter>
    </LanguageProvider>
  );
}