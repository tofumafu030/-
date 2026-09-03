// Web Audio API ambient sound generator for focus reading

class AmbientSoundManager {
  private ctx: AudioContext | null = null;
  private currentType: string | null = null;
  private activeNodes: { source?: AudioNode; gain?: GainNode; filter?: BiquadFilterNode }[] = [];

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public play(type: 'rain' | 'library' | 'waves' | 'brown-noise') {
    this.stop();
    this.initCtx();
    if (!this.ctx) return;

    this.currentType = type;

    if (type === 'brown-noise' || type === 'rain') {
      this.playBrownNoise(type === 'rain');
    } else if (type === 'waves') {
      this.playOceanWaves();
    } else if (type === 'library') {
      this.playLibraryAmbient();
    }
  }

  private playBrownNoise(isRain: boolean) {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5; // Boost
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = isRain ? 'lowpass' : 'bandpass';
    filter.frequency.setValueAtTime(isRain ? 800 : 400, this.ctx.currentTime);

    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(0.12, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    whiteNoise.start();
    this.activeNodes.push({ source: whiteNoise, gain: gainNode, filter });
  }

  private playOceanWaves() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, this.ctx.currentTime);

    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(0.05, this.ctx.currentTime);

    // LFO for wave swelling
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.1, this.ctx.currentTime); // Wave period ~10s
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(gainNode.gain);

    whiteNoise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    whiteNoise.start();
    lfo.start();

    this.activeNodes.push({ source: whiteNoise, gain: gainNode, filter });
    this.activeNodes.push({ source: lfo, gain: lfoGain });
  }

  private playLibraryAmbient() {
    if (!this.ctx) return;
    // Gentle pink/warm ambient background
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      output[i] = b0 + b1 + b2;
      output[i] *= 0.05;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(500, this.ctx.currentTime);

    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(0.1, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    noise.start();
    this.activeNodes.push({ source: noise, gain: gainNode, filter });
  }

  public stop() {
    this.activeNodes.forEach(({ source, gain }) => {
      try {
        if (gain && this.ctx) {
          gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.3);
        }
        setTimeout(() => {
          if (source && (source as any).stop) {
            (source as any).stop();
            (source as any).disconnect();
          }
        }, 300);
      } catch (e) {
        // ignore
      }
    });
    this.activeNodes = [];
    this.currentType = null;
  }

  public getCurrentType() {
    return this.currentType;
  }
}

export const ambientSound = new AmbientSoundManager();
