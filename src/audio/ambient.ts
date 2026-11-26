/**
 * Generative "late-night deploy" soundtrack, synthesised live with the Web Audio API.
 * No audio files, no licensing: warm pad chords, a soft bass, a plucked arpeggio with echo,
 * and a very light lo-fi beat. A custom track can replace it via VITE_MUSIC_URL.
 */

const BPM = 78
const STEP = 60 / BPM / 2 // one eighth note, in seconds
const STEPS_PER_CHORD = 16 // two bars

const midi = (n: number) => 440 * 2 ** ((n - 69) / 12)

// A minor 9 → F major 9 → C major 9 → G 6/9 (root, then chord tones)
const CHORDS = [
  { root: 33, tones: [57, 60, 64, 67, 71] },
  { root: 29, tones: [53, 57, 60, 64, 67] },
  { root: 36, tones: [55, 59, 62, 64, 67] },
  { root: 31, tones: [55, 59, 62, 64, 69] },
]

export interface Graph {
  ctx: BaseAudioContext
  master: GainNode
  pad: GainNode
  bass: GainNode
  pluck: GainNode
  drums: GainNode
  noise: AudioBuffer
}

function impulse(ctx: BaseAudioContext, seconds: number) {
  const len = Math.floor(ctx.sampleRate * seconds)
  const buf = ctx.createBuffer(2, len, ctx.sampleRate)
  for (let c = 0; c < 2; c++) {
    const d = buf.getChannelData(c)
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 2.6
  }
  return buf
}

export function buildGraph(ctx: BaseAudioContext, volume: number): Graph {
  const master = ctx.createGain()
  master.gain.value = volume
  const comp = ctx.createDynamicsCompressor()
  comp.threshold.value = -18
  comp.ratio.value = 3
  master.connect(comp).connect(ctx.destination)

  const tone = ctx.createBiquadFilter()
  tone.type = 'lowpass'
  tone.frequency.value = 5200
  tone.connect(master)

  const reverb = ctx.createConvolver()
  reverb.buffer = impulse(ctx, 2.6)
  const wet = ctx.createGain()
  wet.gain.value = 0.38
  reverb.connect(wet).connect(tone)

  const mk = (gain: number, sendToReverb: number) => {
    const g = ctx.createGain()
    g.gain.value = gain
    g.connect(tone)
    const s = ctx.createGain()
    s.gain.value = sendToReverb
    g.connect(s).connect(reverb)
    return g
  }

  const echoIn = ctx.createGain()
  const echo = ctx.createDelay(2)
  echo.delayTime.value = STEP * 3
  const fb = ctx.createGain()
  fb.gain.value = 0.36
  echoIn.connect(echo)
  echo.connect(fb).connect(echo)
  const echoOut = ctx.createGain()
  echoOut.gain.value = 0.42
  echo.connect(echoOut).connect(tone)
  echoOut.connect(reverb)

  const pluck = mk(0.9, 0.5)
  pluck.connect(echoIn)

  const len = ctx.sampleRate
  const noise = ctx.createBuffer(1, len, ctx.sampleRate)
  const nd = noise.getChannelData(0)
  for (let i = 0; i < len; i++) nd[i] = Math.random() * 2 - 1

  return { ctx, master, pad: mk(0.9, 0.7), bass: mk(1, 0.05), pluck, drums: mk(0.9, 0.12), noise }
}

function padChord(g: Graph, t: number, dur: number, tones: number[]) {
  const { ctx } = g
  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.Q.value = 0.6
  filter.frequency.setValueAtTime(500, t)
  filter.frequency.linearRampToValueAtTime(1500, t + dur * 0.5)
  filter.frequency.linearRampToValueAtTime(600, t + dur)
  const env = ctx.createGain()
  env.gain.setValueAtTime(0.0001, t)
  env.gain.linearRampToValueAtTime(0.11, t + 1.6)
  env.gain.setValueAtTime(0.11, t + dur - 0.4)
  env.gain.linearRampToValueAtTime(0.0001, t + dur + 1.8)
  filter.connect(env).connect(g.pad)
  for (const n of tones) {
    for (const detune of [-8, 8]) {
      const o = ctx.createOscillator()
      o.type = 'sawtooth'
      o.frequency.value = midi(n)
      o.detune.value = detune
      const v = ctx.createGain()
      v.gain.value = 0.22
      o.connect(v).connect(filter)
      o.start(t)
      o.stop(t + dur + 2)
    }
  }
}

function bassNote(g: Graph, t: number, note: number, dur: number) {
  const { ctx } = g
  const o = ctx.createOscillator()
  o.type = 'triangle'
  o.frequency.value = midi(note)
  const env = ctx.createGain()
  env.gain.setValueAtTime(0.0001, t)
  env.gain.linearRampToValueAtTime(0.34, t + 0.03)
  env.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  o.connect(env).connect(g.bass)
  o.start(t)
  o.stop(t + dur + 0.05)
}

function pluckNote(g: Graph, t: number, note: number, vel: number) {
  const { ctx } = g
  const o = ctx.createOscillator()
  o.type = 'triangle'
  o.frequency.value = midi(note)
  const f = ctx.createBiquadFilter()
  f.type = 'lowpass'
  f.frequency.setValueAtTime(3200, t)
  f.frequency.exponentialRampToValueAtTime(600, t + 0.45)
  const env = ctx.createGain()
  env.gain.setValueAtTime(0.0001, t)
  env.gain.linearRampToValueAtTime(0.14 * vel, t + 0.008)
  env.gain.exponentialRampToValueAtTime(0.0001, t + 0.55)
  o.connect(f).connect(env).connect(g.pluck)
  o.start(t)
  o.stop(t + 0.6)
}

function kick(g: Graph, t: number) {
  const { ctx } = g
  const o = ctx.createOscillator()
  o.type = 'sine'
  o.frequency.setValueAtTime(125, t)
  o.frequency.exponentialRampToValueAtTime(42, t + 0.14)
  const env = ctx.createGain()
  env.gain.setValueAtTime(0.5, t)
  env.gain.exponentialRampToValueAtTime(0.0001, t + 0.34)
  o.connect(env).connect(g.drums)
  o.start(t)
  o.stop(t + 0.4)
}

function hat(g: Graph, t: number, vel: number) {
  const { ctx } = g
  const s = ctx.createBufferSource()
  s.buffer = g.noise
  const hp = ctx.createBiquadFilter()
  hp.type = 'highpass'
  hp.frequency.value = 7500
  const env = ctx.createGain()
  env.gain.setValueAtTime(0.0001, t)
  env.gain.linearRampToValueAtTime(0.06 * vel, t + 0.004)
  env.gain.exponentialRampToValueAtTime(0.0001, t + 0.06)
  s.connect(hp).connect(env).connect(g.drums)
  s.start(t, Math.random() * 0.5)
  s.stop(t + 0.08)
}

/** Schedules everything that happens on one eighth-note step. */
export function scheduleStep(g: Graph, step: number, t: number) {
  const chord = CHORDS[Math.floor(step / STEPS_PER_CHORD) % CHORDS.length]
  const s = step % STEPS_PER_CHORD

  if (s === 0) padChord(g, t, STEPS_PER_CHORD * STEP, chord.tones)
  if (s === 0 || s === 6 || s === 10) bassNote(g, t, chord.root + (s === 10 ? 12 : 0), STEP * 3.2)

  const played = step >= STEPS_PER_CHORD // two bars of just pads + bass first
  if (played && (s === 0 || s === 6 || s === 8)) kick(g, t)
  if (played && s % 2 === 1) hat(g, t, s % 4 === 3 ? 1 : 0.6)

  if (step >= 8 && Math.random() < (s % 2 === 0 ? 0.78 : 0.34)) {
    const tone = chord.tones[Math.floor(Math.random() * chord.tones.length)] + 12
    pluckNote(g, t, tone, 0.6 + Math.random() * 0.4)
  }
}

export interface Music {
  start(): Promise<void>
  stop(): Promise<void>
  setVolume(v: number): void
  readonly playing: boolean
}

const gainFor = (v: number) => Math.max(0, Math.min(1, v)) * 1.0

class Generative implements Music {
  playing = false
  private ctx: AudioContext | null = null
  private g: Graph | null = null
  private timer: number | undefined
  private next = 0
  private step = 0
  private vol = 0.5
  private closing: number | undefined

  async start() {
    if (this.playing) return
    window.clearTimeout(this.closing)
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    this.ctx = new Ctor()
    await this.ctx.resume()
    const g = buildGraph(this.ctx, 0)
    this.g = g
    g.master.gain.setValueAtTime(0, this.ctx.currentTime)
    g.master.gain.linearRampToValueAtTime(gainFor(this.vol), this.ctx.currentTime + 1.6)
    this.next = this.ctx.currentTime + 0.12
    this.step = 0
    this.playing = true
    this.timer = window.setInterval(() => this.tick(), 40)
  }

  private tick() {
    const { ctx, g } = this
    if (!ctx || !g) return
    while (this.next < ctx.currentTime + 0.3) {
      scheduleStep(g, this.step, this.next)
      this.next += STEP
      this.step++
    }
  }

  async stop() {
    if (!this.playing || !this.ctx || !this.g) return
    this.playing = false
    window.clearInterval(this.timer)
    const { ctx, g } = this
    g.master.gain.cancelScheduledValues(ctx.currentTime)
    g.master.gain.setValueAtTime(g.master.gain.value, ctx.currentTime)
    g.master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6)
    // Close the context so notes queued ahead of time can never leak into a later start.
    this.closing = window.setTimeout(() => { void ctx.close() }, 700)
    this.ctx = null
    this.g = null
  }

  setVolume(v: number) {
    this.vol = v
    if (this.ctx && this.g && this.playing) this.g.master.gain.setTargetAtTime(gainFor(v), this.ctx.currentTime, 0.05)
  }
}

class FileTrack implements Music {
  playing = false
  private audio: HTMLAudioElement
  private vol = 0.5
  private fade: number | undefined

  constructor(url: string) {
    this.audio = new Audio(url)
    this.audio.loop = true
    this.audio.preload = 'none'
  }

  private ramp(to: number, done?: () => void) {
    window.clearInterval(this.fade)
    this.fade = window.setInterval(() => {
      const d = to - this.audio.volume
      if (Math.abs(d) < 0.03) { this.audio.volume = to; window.clearInterval(this.fade); done?.() } else this.audio.volume += Math.sign(d) * 0.03
    }, 40)
  }

  async start() {
    this.audio.volume = 0
    await this.audio.play()
    this.playing = true
    this.ramp(this.vol)
  }

  async stop() {
    this.playing = false
    this.ramp(0, () => this.audio.pause())
  }

  setVolume(v: number) {
    this.vol = v
    if (this.playing) this.audio.volume = v
  }
}

export const musicSupported = () =>
  typeof window !== 'undefined' && !!(window.AudioContext ?? (window as unknown as { webkitAudioContext?: unknown }).webkitAudioContext)

export function createMusic(customUrl?: string): Music {
  return customUrl ? new FileTrack(customUrl) : new Generative()
}

/** Renders `seconds` of the soundtrack offline (used by tests to check it is audible and not clipping). */
export async function renderPreview(seconds = 24) {
  const rate = 44100
  const ctx = new OfflineAudioContext(2, rate * seconds, rate)
  const g = buildGraph(ctx, gainFor(0.5))
  const steps = Math.floor(seconds / STEP)
  for (let i = 0; i < steps; i++) scheduleStep(g, i, 0.05 + i * STEP)
  const out = await ctx.startRendering()
  let peak = 0
  let sum = 0
  let n = 0
  for (let c = 0; c < out.numberOfChannels; c++) {
    const d = out.getChannelData(c)
    for (let i = 0; i < d.length; i++) { const a = Math.abs(d[i]); if (a > peak) peak = a; sum += d[i] * d[i]; n++ }
  }
  return { peak, rms: Math.sqrt(sum / n), seconds }
}
