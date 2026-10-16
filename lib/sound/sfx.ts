// ==============================================================================
// ASCEND - SYNTHESIZED WEB AUDIO SFX ENGINE
// Real-time procedural sound effects without external audio files
// ==============================================================================

class SoundEngine {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    // Lazy initialized on first user gesture to comply with browser autoplay policies
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Tactile Cyber Click
   */
  public playClick() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // Audio context error fallback
    }
  }

  /**
   * Quest Completion Chime (Ascending triad chime)
   */
  public playQuestComplete() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const frequencies = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      const startTime = this.ctx.currentTime;

      frequencies.forEach((freq, index) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime + index * 0.08);

        const noteStart = startTime + index * 0.08;
        gain.gain.setValueAtTime(0.15, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + 0.35);
      });
    } catch {
      // Audio fallback
    }
  }

  /**
   * Level Up Epic Fanfare (Rich layered heroic sweep)
   */
  public playLevelUp() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const chords = [
        [523.25, 659.25, 783.99], // C Major
        [587.33, 739.99, 880.0],  // D Major
        [659.25, 830.61, 987.77], // E Major
        [1046.5, 1318.5, 1567.98], // High C Octave Burst
      ];

      const now = this.ctx.currentTime;
      chords.forEach((chord, step) => {
        const stepTime = now + step * 0.14;
        chord.forEach((freq) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = step === 3 ? 'sawtooth' : 'triangle';
          osc.frequency.setValueAtTime(freq, stepTime);

          const duration = step === 3 ? 0.8 : 0.22;
          const volume = step === 3 ? 0.12 : 0.08;

          gain.gain.setValueAtTime(volume, stepTime);
          gain.gain.exponentialRampToValueAtTime(0.001, stepTime + duration);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(stepTime);
          osc.stop(stepTime + duration);
        });
      });
    } catch {
      // Audio fallback
    }
  }

  /**
   * Gold Coin Clink
   */
  public playGoldClink() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      [1567.98, 2093.0].forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.05);

        gain.gain.setValueAtTime(0.18, now + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 0.25);
      });
    } catch {
      // Fallback
    }
  }

  /**
   * Achievement Unlocked Celestial Chime
   */
  public playAchievementUnlocked() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
      const now = this.ctx.currentTime;

      notes.forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.06);

        gain.gain.setValueAtTime(0.1, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0005, now + i * 0.06 + 0.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.5);
      });
    } catch {
      // Fallback
    }
  }

  /**
   * Item Equip / Theme switch sound
   */
  public playEquip() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.15);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.18);
    } catch {
      // Fallback
    }
  }
}

export const soundManager = new SoundEngine();
