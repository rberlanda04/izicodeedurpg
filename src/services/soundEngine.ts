// Synthesizer using Web Audio API for 8-bit sound effects without external audio files

class RetroSoundEngine {
  private audioCtx: AudioContext | null = null;
  public soundEnabled: boolean = true;

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
}

export const soundEngine = new RetroSoundEngine();
