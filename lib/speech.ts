// Cache for voices
let voicesLoaded = false;
let cachedVoices: SpeechSynthesisVoice[] = [];

// Load voices (they load asynchronously in some browsers)
function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      resolve([]);
      return;
    }

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      cachedVoices = voices;
      voicesLoaded = true;
      resolve(voices);
      return;
    }

    // Wait for voices to load
    window.speechSynthesis.onvoiceschanged = () => {
      cachedVoices = window.speechSynthesis.getVoices();
      voicesLoaded = true;
      resolve(cachedVoices);
    };

    // Timeout fallback
    setTimeout(() => {
      if (!voicesLoaded) {
        cachedVoices = window.speechSynthesis.getVoices();
        voicesLoaded = true;
        resolve(cachedVoices);
      }
    }, 1000);
  });
}

// Initialize voices on module load
if (typeof window !== 'undefined') {
  loadVoices();
}

export async function speak(text: string, rate: number = 0.9): Promise<void> {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    console.warn('Speech synthesis not supported');
    return;
  }

  // Ensure voices are loaded
  if (!voicesLoaded) {
    await loadVoices();
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  return new Promise((resolve, reject) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Try to use a good English voice
    const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();

    // Prefer natural/premium voices, then any English voice
    const englishVoice =
      voices.find((v) => v.lang.startsWith('en') && v.name.toLowerCase().includes('natural')) ||
      voices.find((v) => v.lang.startsWith('en') && v.name.toLowerCase().includes('samantha')) ||
      voices.find((v) => v.lang.startsWith('en-US')) ||
      voices.find((v) => v.lang.startsWith('en'));

    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onend = () => resolve();
    utterance.onerror = (e) => {
      console.warn('Speech error:', e);
      resolve(); // Don't reject, just continue
    };

    // Chrome bug workaround: speech can stop after ~15 seconds
    // Resume it periodically
    const resumeInterval = setInterval(() => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      } else {
        clearInterval(resumeInterval);
      }
    }, 10000);

    utterance.onend = () => {
      clearInterval(resumeInterval);
      resolve();
    };

    window.speechSynthesis.speak(utterance);
  });
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

// Pre-warm the speech engine (call after user interaction)
export async function warmUpSpeech(): Promise<void> {
  if (!isSpeechSupported()) return;

  await loadVoices();

  // Speak empty string to initialize
  const utterance = new SpeechSynthesisUtterance('');
  utterance.volume = 0;
  window.speechSynthesis.speak(utterance);

  // Also warm up audio context
  initAudioContext();
}

// ============ Keystroke Sound Effects ============

let audioContext: AudioContext | null = null;

function initAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;

  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API not supported:', e);
      return null;
    }
  }

  // Resume if suspended (browsers require user interaction)
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  return audioContext;
}

// Play a short tone for correct keystroke
export function playCorrectSound(): void {
  const ctx = initAudioContext();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  // Pleasant click sound - short, soft
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(800, ctx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.05);

  gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.05);
}

// Play a short tone for error keystroke
export function playErrorSound(): void {
  const ctx = initAudioContext();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  // Error sound - lower pitch, slightly longer
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(200, ctx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.1);

  gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.1);
}

// Check if Web Audio is supported
export function isAudioSupported(): boolean {
  return typeof window !== 'undefined' &&
    !!(window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext);
}
