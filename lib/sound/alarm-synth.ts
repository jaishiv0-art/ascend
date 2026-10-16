// ==============================================================================
// ASCEND - WEB AUDIO ALARM SYNTHESIZER
// High-Fidelity Digital Alarm Beep & Chime (Zero External Asset Dependency)
// ==============================================================================

class AlarmSynth {
  private audioCtx: AudioContext | null = null;
  private isRinging: boolean = false;
  private intervalId: NodeJS.Timeout | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return null;
      this.audioCtx = new AudioContextClass();
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  // Play a single pleasant digital alarm double-beep pattern (880Hz & 1174Hz)
  public playAlarmBeep() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Beep 1
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, now); // A5 note
      osc1.frequency.exponentialRampToValueAtTime(1174.66, now + 0.1); // D6 note

      gain1.gain.setValueAtTime(0, now);
      gain1.gain.linearRampToValueAtTime(0.25, now + 0.02);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.16);

      // Beep 2 (quick echo)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1174.66, now + 0.18);
      osc2.frequency.exponentialRampToValueAtTime(1760, now + 0.28); // A6 note

      gain2.gain.setValueAtTime(0, now + 0.18);
      gain2.gain.linearRampToValueAtTime(0.3, now + 0.2);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.18);
      osc2.stop(now + 0.36);
    } catch {
      // Audio not supported or blocked
    }
  }

  // Start continuous alarm ringing until stopped
  public startRinging() {
    if (this.isRinging) return;
    this.isRinging = true;

    this.playAlarmBeep();
    this.intervalId = setInterval(() => {
      if (!this.isRinging) return;
      this.playAlarmBeep();
    }, 1200);
  }

  // Stop alarm ringing
  public stopRinging() {
    this.isRinging = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

export const alarmSynth = new AlarmSynth();
