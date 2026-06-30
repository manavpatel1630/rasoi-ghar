import { useState, useRef, useEffect, useCallback } from 'react';
import { FaMicrophone, FaStop } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

// ─────────────────────────────────────────────
// KEY RULE:
//   Gujarati (gu) → text translation via API
//                 → voice ALWAYS uses hi-IN
//   Hindi (hi)   → text translation via API
//                 → voice uses hi-IN
//   English (en) → no translation
//                 → voice uses en-US
// ─────────────────────────────────────────────
const VOICE_LANG = {
  en: 'en-US',
  hi: 'hi-IN',
  gu: 'hi-IN',   // ← Gujarati UI but Hindi voice
};

// Global cancel flag — survives component unmount
let globalCancel = false;
// Global keepAlive timer
let keepAliveTimer = null;

function clearKeepAlive() {
  if (keepAliveTimer) { clearInterval(keepAliveTimer); keepAliveTimer = null; }
}

// ─────────────────────────────────────────────
// Pick best matching voice from available list
// ─────────────────────────────────────────────
function getBestVoice(langCode) {
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  // Exact match
  let v = voices.find(x => x.lang === langCode);
  if (v) return v;
  // Prefix match (hi-IN → hi)
  const prefix = langCode.split('-')[0];
  v = voices.find(x => x.lang.startsWith(prefix));
  return v || null;
}

// ─────────────────────────────────────────────
// SPEAK — exported so RecipeDetail can call it
// ─────────────────────────────────────────────
export function speakText(text, langCode, onStart, onEnd) {
  if (!window.speechSynthesis || !text?.trim()) { onEnd?.(); return; }

  // Always stop anything currently playing
  clearKeepAlive();
  window.speechSynthesis.cancel();

  // Small delay so cancel() flushes before new utterance
  setTimeout(() => {
    // If globally cancelled between the timeout and now, bail out
    if (globalCancel) { onEnd?.(); return; }

    const utt = new SpeechSynthesisUtterance(text);
    utt.lang    = langCode;
    utt.rate    = 0.85;
    utt.pitch   = 1.0;
    utt.volume  = 1.0;

    const voice = getBestVoice(langCode);
    if (voice) utt.voice = voice;

    utt.onstart = () => { if (!globalCancel) onStart?.(); };

    utt.onend = () => {
      clearKeepAlive();
      onEnd?.();
    };

    utt.onerror = (e) => {
      clearKeepAlive();
      // 'interrupted' fires when we cancel intentionally — don't treat as error
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        console.warn('TTS error:', e.error);
      }
      onEnd?.();
    };

    // Chrome bug: long text pauses after ~15s. Keep it alive.
    keepAliveTimer = setInterval(() => {
      if (!window.speechSynthesis.speaking) { clearKeepAlive(); return; }
      window.speechSynthesis.pause();
      window.speechSynthesis.resume();
    }, 12000);

    window.speechSynthesis.speak(utt);
  }, 80);
}

// ─────────────────────────────────────────────
// STOP ALL — exported so RecipeDetail can call
// ─────────────────────────────────────────────
export function stopAllSpeech() {
  globalCancel = true;
  clearKeepAlive();
  window.speechSynthesis.cancel();
  // Reset cancel flag after a short flush period
  setTimeout(() => { globalCancel = false; }, 200);
}

// ─────────────────────────────────────────────
// Preload voices (needed on Chrome/deployed sites)
// Must be called after a user gesture
// ─────────────────────────────────────────────
export function preloadVoices() {
  return new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) { resolve(voices); return; }
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.onvoiceschanged = null;
      resolve(window.speechSynthesis.getVoices());
    };
    // Fallback if event never fires (Safari)
    setTimeout(() => resolve(window.speechSynthesis.getVoices()), 1000);
  });
}

// Export LANG_CODES for RecipeDetail
export const LANG_CODES = VOICE_LANG;

// ─────────────────────────────────────────────
// VOICE ASSISTANT COMPONENT
// ─────────────────────────────────────────────
export default function VoiceAssistant({ onNextStep, onPrevStep, onRepeat }) {
  const { lang } = useLanguage();
  const [listening, setListening] = useState(false);
  const [showTip,   setShowTip]   = useState(false);
  const recogRef  = useRef(null);
  const tipTimerRef = useRef(null);

  // Stop everything when component unmounts (page change)
  useEffect(() => {
    return () => {
      stopAllSpeech();
      recogRef.current?.stop();
    };
  }, []);

  // Also stop TTS when language changes
  useEffect(() => {
    stopAllSpeech();
  }, [lang]);

  const stopSpeaking = useCallback(() => {
    stopAllSpeech();
  }, []);

  const startListening = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert('Voice recognition not supported. Please use Chrome.');
      return;
    }

    // Voice commands use hi-IN for both Hindi and Gujarati
    const recogLang = VOICE_LANG[lang] || 'en-US';

    const recog = new SR();
    recog.lang              = recogLang;
    recog.continuous        = false;
    recog.interimResults    = false;
    recog.maxAlternatives   = 5;

    recog.onresult = (e) => {
      const transcripts = Array.from(e.results[0])
        .map(r => r.transcript.toLowerCase().trim());
      const cmd = transcripts.join(' ');

      const COMMANDS = {
        next:   ['next', 'next step', 'अगला', 'आगे', 'आगे जाओ', 'આગળ'],
        prev:   ['previous', 'back', 'prev', 'go back', 'पिछला', 'पहले', 'वापस', 'પાછળ'],
        repeat: ['repeat', 'again', 'replay', 'दोबारा', 'फिर', 'फिर से', 'ફરી'],
        stop:   ['stop', 'pause', 'cancel', 'रुको', 'बंद करो', 'बंद', 'રોકો'],
      };

      if (COMMANDS.next.some(w   => cmd.includes(w))) onNextStep?.();
      else if (COMMANDS.prev.some(w   => cmd.includes(w))) onPrevStep?.();
      else if (COMMANDS.repeat.some(w => cmd.includes(w))) onRepeat?.();
      else if (COMMANDS.stop.some(w   => cmd.includes(w))) stopSpeaking();
    };

    recog.onerror = (e) => {
      if (e.error !== 'no-speech') console.warn('Recognition error:', e.error);
      setListening(false);
    };
    recog.onend = () => setListening(false);

    try {
      recog.start();
      recogRef.current = recog;
      setListening(true);

      clearTimeout(tipTimerRef.current);
      setShowTip(true);
      tipTimerRef.current = setTimeout(() => setShowTip(false), 5000);
    } catch (err) {
      console.warn('Cannot start recognition:', err);
    }
  }, [lang, onNextStep, onPrevStep, onRepeat, stopSpeaking]);

  const toggleListen = () => {
    if (listening) {
      recogRef.current?.stop();
      setListening(false);
    } else {
      // Preload voices on first user gesture (fixes Chrome deployed)
      preloadVoices().then(() => startListening());
    }
  };

  // Tip text — Gujarati shows Hindi commands since voice is hi-IN
  const TIP = {
    en: { cmd: '"Next" / "Previous" / "Repeat" / "Stop"',  lang: 'English' },
    hi: { cmd: '"अगला" / "पिछला" / "दोबारा" / "रुको"',    lang: 'हिंदी'  },
    gu: { cmd: '"अगला" / "पिछला" / "दोबारा" / "रुको"',    lang: 'Hindi (voice for Gujarati)' },
  };
  const tip = TIP[lang] || TIP.en;

  return (
    <>
      {showTip && (
        <div className="voice-tooltip">
          <div style={{ fontWeight: 700, marginBottom: 4, fontSize: '0.82rem' }}>
            🎙 Voice Commands ({tip.lang}):
          </div>
          <div style={{
            fontFamily: "'Noto Sans Devanagari','Poppins',sans-serif",
            fontSize: '0.82rem', lineHeight: 1.5
          }}>
            {tip.cmd}
          </div>
          {lang === 'gu' && (
            <div style={{ marginTop: 6, fontSize: '0.7rem', opacity: 0.7, borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: 6 }}>
              🔤 Gujarati text · 🔊 Hindi voice
            </div>
          )}
        </div>
      )}

      <button
        className={`voice-fab${listening ? ' listening' : ''}`}
        onClick={toggleListen}
        title={listening ? 'Stop listening' : 'Voice Commands'}
        aria-label="Voice assistant"
      >
        {listening
          ? <FaStop size={18} />
          : <FaMicrophone size={18} />
        }
      </button>
    </>
  );
}