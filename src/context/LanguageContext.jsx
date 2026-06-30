import { createContext, useContext, useState, useCallback } from 'react';

const LanguageContext = createContext();

// Only these static UI strings are manually defined per language
// Recipe content (name, ingredients, steps) uses the API
const UI_STRINGS = {
  en: {
    home: 'Home', recipes: 'Recipes', categories: 'Categories',
    about: 'About', contact: 'Contact',
    heroTitle1: 'Authentic Flavors', heroSub1: 'of India',
    heroTitle2: 'Traditional Recipes', heroSub2: 'Passed Down Generations',
    heroTitle3: 'Street Food', heroSub3: 'From Every Corner',
    heroCta: 'Explore Recipe →',
    featuredTitle: 'Featured Recipes',
    featuredSub: 'Handpicked classics from our kitchen',
    filterAll: 'All', filterVeg: 'Veg', filterNonVeg: 'Non-Veg',
    searchPlaceholder: 'Search recipes…',
    readRecipe: 'Read Recipe Aloud',
    stopReading: 'Stop Reading',
    nextStep: 'Next Step', prevStep: 'Prev Step',
    ingredients: 'Ingredients', steps: 'Steps',
    difficulty: 'Difficulty', serves: 'Serves', time: 'Time',
    backToRecipes: '← Back to Recipes',
    footerTagline: 'Bringing the warmth of Indian kitchens to your home.',
    allRightsReserved: 'All rights reserved.',
    translating: 'Translating…',
    viewRecipe: 'View Recipe',
    minRead: 'min',
    reviews: 'reviews',
    aboutTitle: 'About Rasoi Ghar',
    aboutText: 'Rasoi Ghar celebrates the rich culinary heritage of India — from the royal kitchens of Awadh to the streets of Mumbai.',
    contactTitle: 'Contact Us',
    contactText: 'We love hearing from food lovers. Drop us a message!',
    contactName: 'Your Name', contactEmail: 'Your Email', contactMsg: 'Your Message',
    contactSend: 'Send Message',
    noResults: 'No recipes found. Try a different search.',
  },
  hi: {
    home: 'होम', recipes: 'व्यंजन', categories: 'श्रेणियाँ',
    about: 'हमारे बारे में', contact: 'संपर्क करें',
    heroTitle1: 'असली स्वाद', heroSub1: 'भारत के',
    heroTitle2: 'परंपरागत व्यंजन', heroSub2: 'पीढ़ियों से चले आ रहे',
    heroTitle3: 'स्ट्रीट फूड', heroSub3: 'हर कोने से',
    heroCta: 'रेसिपी देखें →',
    featuredTitle: 'विशेष व्यंजन',
    featuredSub: 'हमारी रसोई के खास चुनाव',
    filterAll: 'सभी', filterVeg: 'शाकाहारी', filterNonVeg: 'मांसाहारी',
    searchPlaceholder: 'व्यंजन खोजें…',
    readRecipe: 'रेसिपी पढ़ें',
    stopReading: 'रोकें',
    nextStep: 'अगला चरण', prevStep: 'पिछला चरण',
    ingredients: 'सामग्री', steps: 'विधि',
    difficulty: 'कठिनाई', serves: 'लोग', time: 'समय',
    backToRecipes: '← व्यंजनों पर वापस',
    footerTagline: 'भारतीय रसोई की गर्माहट आपके घर तक।',
    allRightsReserved: 'सर्वाधिकार सुरक्षित।',
    translating: 'अनुवाद हो रहा है…',
    viewRecipe: 'रेसिपी देखें',
    minRead: 'मिनट',
    reviews: 'समीक्षाएं',
    aboutTitle: 'रसोई घर के बारे में',
    aboutText: 'रसोई घर भारत की समृद्ध पाक विरासत का उत्सव मनाता है।',
    contactTitle: 'संपर्क करें',
    contactText: 'हम खाने के शौकीनों से सुनना पसंद करते हैं।',
    contactName: 'आपका नाम', contactEmail: 'आपका ईमेल', contactMsg: 'आपका संदेश',
    contactSend: 'संदेश भेजें',
    noResults: 'कोई व्यंजन नहीं मिला। कुछ और खोजें।',
  },
  gu: {
    home: 'હોમ', recipes: 'વ્યંજન', categories: 'શ્રેણીઓ',
    about: 'અમારા વિશે', contact: 'સંપર્ક',
    heroTitle1: 'અસલ સ્વાદ', heroSub1: 'ભારતના',
    heroTitle2: 'પરંપરાગત વ્યંજન', heroSub2: 'પેઢીઓ થી',
    heroTitle3: 'સ્ટ્રીટ ફૂડ', heroSub3: 'દરેક ખૂણેથી',
    heroCta: 'રેસિપી જુઓ →',
    featuredTitle: 'વિશેષ વ્યંજન',
    featuredSub: 'અમારી રસોઈમાંથી ખાસ પસંદ',
    filterAll: 'બધા', filterVeg: 'શાકાહારી', filterNonVeg: 'માંસાહારી',
    searchPlaceholder: 'વ્યંજન શોધો…',
    readRecipe: 'રેસિપી વાંચો',
    stopReading: 'રોકો',
    nextStep: 'આગળ', prevStep: 'પાછળ',
    ingredients: 'સામગ્રી', steps: 'રીત',
    difficulty: 'કઠિનાઈ', serves: 'વ્યક્તિ', time: 'સમય',
    backToRecipes: '← વ્યંજનો પર પાછા',
    footerTagline: 'ભારતીય રસોઈની ઉષ્મા તમારા ઘર સુધી.',
    allRightsReserved: 'સર્વ હક્કો સુરક્ષિત.',
    translating: 'ભાષાંતર થઈ રહ્યું છે…',
    viewRecipe: 'રેસિપી જુઓ',
    minRead: 'મિનિટ',
    reviews: 'સમીક્ષાઓ',
    aboutTitle: 'રસોઈ ઘર વિશે',
    aboutText: 'રસોઈ ઘર ભારતના સમૃદ્ધ રાંધણ વારસાની ઉજવણી કરે છે.',
    contactTitle: 'સંપર્ક કરો',
    contactText: 'ખોરાક પ્રેમીઓ પાસેથી સાંભળવું ગમે છે.',
    contactName: 'તમારું નામ', contactEmail: 'તમારો ઈ-મેઈલ', contactMsg: 'તમારો સંદેશ',
    contactSend: 'સંદેશ મોકલો',
    noResults: 'કોઈ વ્યંજન મળ્યું નહીં. બીજું શોધો.',
  }
};

// Translation cache to avoid repeated API calls
const translationCache = {};

async function translateText(text, targetLang) {
  if (targetLang === 'en') return text;
  const cacheKey = `${targetLang}:${text}`;
  if (translationCache[cacheKey]) return translationCache[cacheKey];

  // Check localStorage
  const stored = localStorage.getItem(`rg_t_${cacheKey}`);
  if (stored) { translationCache[cacheKey] = stored; return stored; }

  try {
    const langMap = { hi: 'hi', gu: 'gu' };
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${langMap[targetLang]}`
    );
    const data = await res.json();
    const translated = data?.responseData?.translatedText || text;
    translationCache[cacheKey] = translated;
    localStorage.setItem(`rg_t_${cacheKey}`, translated);
    return translated;
  } catch {
    return text;
  }
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');

  const t = useCallback((key) => {
    return UI_STRINGS[lang]?.[key] || UI_STRINGS.en[key] || key;
  }, [lang]);

  const translate = useCallback((text) => {
    return translateText(text, lang);
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, translate }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
