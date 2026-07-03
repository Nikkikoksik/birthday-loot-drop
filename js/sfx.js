// All sound is synthesized live with the Web Audio API — zero audio files.
const SFX = (() => {
  let ctx = null;
  let master = null;
  let muted = false;

  function ensure() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain();
      master.gain.value = muted ? 0 : 0.8;
      master.connect(ctx.destination);
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function noiseBuffer(seconds) {
    const buf = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    return buf;
  }

  // cardboard box rattling — short filtered noise ticks
  function rattle(duration = 1.2) {
    ensure();
    const t0 = ctx.currentTime;
    const ticks = Math.floor(duration / 0.09);
    for (let i = 0; i < ticks; i++) {
      const src = ctx.createBufferSource();
      src.buffer = noiseBuffer(0.05);
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = 500 + Math.random() * 900;
      const g = ctx.createGain();
      const t = t0 + i * 0.09 + Math.random() * 0.03;
      g.gain.setValueAtTime(0.5, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
      src.connect(bp).connect(g).connect(master);
      src.start(t);
    }
  }

  // vine-boom style hit for the finger
  function boom() {
    ensure();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(160, t);
    osc.frequency.exponentialRampToValueAtTime(38, t + 0.45);
    const g = ctx.createGain();
    g.gain.setValueAtTime(1.0, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
    osc.connect(g).connect(master);
    osc.start(t); osc.stop(t + 0.65);

    const thump = ctx.createBufferSource();
    thump.buffer = noiseBuffer(0.12);
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass"; lp.frequency.value = 220;
    const tg = ctx.createGain();
    tg.gain.setValueAtTime(0.7, t);
    tg.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    thump.connect(lp).connect(tg).connect(master);
    thump.start(t);
  }

  // cartoon boing — quick pitch-up blip for legs popping out
  function boing() {
    ensure();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(200, t);
    osc.frequency.exponentialRampToValueAtTime(720, t + 0.14);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.4, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    osc.connect(g).connect(master);
    osc.start(t);
    osc.stop(t + 0.22);
  }

  // cartoon dash — noise swept through a bandpass
  function whoosh() {
    ensure();
    const t = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(0.9);
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.value = 1.4;
    bp.frequency.setValueAtTime(220, t);
    bp.frequency.exponentialRampToValueAtTime(2400, t + 0.45);
    bp.frequency.exponentialRampToValueAtTime(320, t + 0.9);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.55, t + 0.22);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.9);
    src.connect(bp).connect(g).connect(master);
    src.start(t);
  }

  // tension riser before the legendary drop
  function riser(duration = 1.1) {
    ensure();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(70, t);
    osc.frequency.exponentialRampToValueAtTime(650, t + duration);
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(300, t);
    lp.frequency.exponentialRampToValueAtTime(3200, t + duration);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.22, t + duration);
    g.gain.exponentialRampToValueAtTime(0.001, t + duration + 0.1);
    osc.connect(lp).connect(g).connect(master);
    osc.start(t); osc.stop(t + duration + 0.15);
  }

  // triumphant little arpeggio + shimmer for the reveal
  function fanfare() {
    ensure();
    const t = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
    notes.forEach((f, i) => {
      const osc = ctx.createOscillator();
      osc.type = "triangle";
      osc.frequency.value = f;
      const g = ctx.createGain();
      const nt = t + i * 0.09;
      g.gain.setValueAtTime(0.0001, nt);
      g.gain.exponentialRampToValueAtTime(0.35, nt + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, nt + 0.9);
      osc.connect(g).connect(master);
      osc.start(nt); osc.stop(nt + 1);
    });
    // sparkle shimmer
    const sh = ctx.createBufferSource();
    sh.buffer = noiseBuffer(1.2);
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass"; hp.frequency.value = 6000;
    const sg = ctx.createGain();
    sg.gain.setValueAtTime(0.12, t);
    sg.gain.exponentialRampToValueAtTime(0.001, t + 1.2);
    sh.connect(hp).connect(sg).connect(master);
    sh.start(t);
  }

  function toggleMute() {
    muted = !muted;
    if (master) master.gain.value = muted ? 0 : 0.8;
    return muted;
  }

  return { ensure, rattle, boom, boing, whoosh, riser, fanfare, toggleMute };
})();
