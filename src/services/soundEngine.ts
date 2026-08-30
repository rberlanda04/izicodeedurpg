// Synthesizer using Web Audio API for 8-bit sound effects without external audio files

const SOUND_PREF_KEY = 'izicode:soundEnabled';

function loadSoundPreference(): boolean {
  try {
    const stored = localStorage.getItem(SOUND_PREF_KEY);
    return stored === null ? true : stored === '1';
  } catch {
    return true;
  }
}

class RetroSoundEngine {
  private audioCtx: AudioContext | null = null;
  public soundEnabled: boolean = loadSoundPreference();

  public toggleSound(): boolean {
    this.soundEnabled = !this.soundEnabled;
    try {
      localStorage.setItem(SOUND_PREF_KEY, this.soundEnabled ? '1' : '0');
    } catch {
      // localStorage indisponível (modo privado, etc.) — não é crítico
    }
    return this.soundEnabled;
  }

  private initCtx() {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public playBeep(freq = 440, type: OscillatorType = 'square', duration = 0.1, volume = 0.1) {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(volume, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch {
      // Audio context might be restricted before user interaction
    }
  }

  public playLevelUp() {
    if (!this.soundEnabled) return;
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99]; // C4, E4, G4, C5, E5, G5
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playBeep(freq, 'square', 0.12, 0.15);
      }, idx * 70);
    });
  }

  public playQuestComplete() {
    if (!this.soundEnabled) return;
    const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playBeep(freq, 'triangle', 0.15, 0.2);
      }, idx * 90);
    });
  }

  public playItemCollect() {
    if (!this.soundEnabled) return;
    this.playBeep(987.77, 'square', 0.08, 0.12);
    setTimeout(() => {
      this.playBeep(1318.51, 'square', 0.12, 0.12);
    }, 60);
  }

  public playTerminalBeep() {
    if (!this.soundEnabled) return;
    this.playBeep(750, 'sawtooth', 0.03, 0.05);
  }

  public playErrorBeep() {
    if (!this.soundEnabled) return;
    this.playBeep(150, 'sawtooth', 0.2, 0.2);
  }

  public playBossHit() {
    if (!this.soundEnabled) return;
    this.playBeep(120, 'square', 0.15, 0.25);
    setTimeout(() => {
      this.playBeep(90, 'sawtooth', 0.25, 0.3);
    }, 80);
  }

  /** Curto "whoosh" de deslocamento — usado quando o avatar viaja pela Trilha. */
  public playWhoosh() {
    if (!this.soundEnabled) return;
    if (!this.audioCtx) this.initCtx();
    if (!this.audioCtx) return;
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      const now = this.audioCtx.currentTime;
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(660, now + 0.18);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(now + 0.2);
    } catch {
      // ignore
    }
  }

  /** Tap curto e neutro — seleção de nó/opção, sem carga de sucesso/erro. */
  public playClick() {
    if (!this.soundEnabled) return;
    this.playBeep(600, 'square', 0.04, 0.06);
  }

  /** Resposta certa num minigame — mais alegre que playItemCollect, mais curto que playQuestComplete. */
  public playCorrect() {
    if (!this.soundEnabled) return;
    this.playBeep(880, 'triangle', 0.09, 0.15);
    setTimeout(() => this.playBeep(1174.66, 'triangle', 0.14, 0.15), 70);
  }

  /** Resposta errada num minigame — mais suave que playErrorBeep (não deve soar punitivo). */
  public playWrong() {
    if (!this.soundEnabled) return;
    this.playBeep(220, 'sine', 0.12, 0.12);
  }
}

export const soundEngine = new RetroSoundEngine();
