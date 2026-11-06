// Web Audio API Retro Sound Synthesizer
// Genera suoni a 8-bit / vintage direttamente nel browser senza dipendenze esterne

let audioCtx = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Suono "DING!" brillante e soddisfacente quando si spunta un'attività
 */
export function playDingSound(enabled = true) {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Oscillatore principale (fondamentale: nota brillante C6 ~1046.5 Hz)
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(1046.5, now);
  // Piccolo pitch slide verso l'alto all'inizio per effetto "chime" vintage
  osc1.frequency.exponentialRampToValueAtTime(1174.66, now + 0.03); // D6
  osc1.frequency.setValueAtTime(1046.5, now + 0.06);

  gain1.gain.setValueAtTime(0.0001, now);
  gain1.gain.linearRampToValueAtTime(0.35, now + 0.006); // attacco rapidissimo
  gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.65); // decadimento naturale campanella

  // Armonica superiore per dare brillantezza metallica alla campanella (C7 ~2093 Hz)
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'triangle';
  osc2.frequency.setValueAtTime(2093, now);

  gain2.gain.setValueAtTime(0.0001, now);
  gain2.gain.linearRampToValueAtTime(0.18, now + 0.004);
  gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

  // Terza armonica sottile (E7 ~2637 Hz) per riverbero magico vintage
  const osc3 = ctx.createOscillator();
  const gain3 = ctx.createGain();
  osc3.type = 'sine';
  osc3.frequency.setValueAtTime(2637, now);

  gain3.gain.setValueAtTime(0.0001, now);
  gain3.gain.linearRampToValueAtTime(0.1, now + 0.005);
  gain3.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

  // Connessione audio
  osc1.connect(gain1);
  gain1.connect(ctx.destination);

  osc2.connect(gain2);
  gain2.connect(ctx.destination);

  osc3.connect(gain3);
  gain3.connect(ctx.destination);

  osc1.start(now);
  osc2.start(now);
  osc3.start(now);

  osc1.stop(now + 0.7);
  osc2.stop(now + 0.5);
  osc3.stop(now + 0.4);
}

/**
 * Suono quando si deseleziona (uncheck): un "pop/bloop" retrò discendente
 */
export function playUndingSound(enabled = true) {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(520, now);
  osc.frequency.exponentialRampToValueAtTime(260, now + 0.12);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.linearRampToValueAtTime(0.25, now + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.16);
}

/**
 * Suono quando si aggiunge una nuova attività: arpeggio retrò 8-bit
 */
export function playAddSound(enabled = true) {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [440, 554.37, 659.25]; // A4, C#5, E5 (accordo maggiore rapido)

  notes.forEach((freq, idx) => {
    const startTime = now + idx * 0.04;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(0.12, startTime + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.09);
  });
}

/**
 * Suono quando si salva una modifica a un'attività (doppio bip retrò)
 */
export function playEditSound(enabled = true) {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [659.25, 880]; // E5 -> A5

  notes.forEach((freq, idx) => {
    const startTime = now + idx * 0.05;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(0.15, startTime + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.07);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.08);
  });
}

/**
 * Suono quando si elimina un'attività: zap basso retrò
 */
export function playDeleteSound(enabled = true) {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(280, now);
  osc.frequency.exponentialRampToValueAtTime(80, now + 0.14);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.linearRampToValueAtTime(0.18, now + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.16);
}

/**
 * Click meccanico vintage per i bottoni
 */
export function playMechanicalClick(enabled = true) {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, now);
  osc.frequency.exponentialRampToValueAtTime(120, now + 0.02);

  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.03);
}
