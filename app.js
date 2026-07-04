// ===== Character Unlock Test — comic store edition =====
// Zero-dependency: raw WebGL shader, vanilla glare card, CSS room scene,
// WebAudio sound effects. Colors + voices come from the persona sheet.

// ---------- character suite (accent = persona primary_colour) ----------
// phrases are written in each persona's dialogue tonality
const CHARACTERS = [
  {
    id: "kami",
    name: "Kami",
    accent: "#07D6A0", // computer program — balanced, warm
    pitch: 1.0,
    phrases: [
      "System online. Enthusiasm: calibrated.",
      "I simulated 1,000 greetings. This one won.",
      "Friendliness module loaded successfully.",
      "All systems nominal. Vibes: optimal.",
      "Update installed: me.",
    ],
  },
  {
    id: "patty",
    name: "Patty",
    accent: "#6433B3", // parrot teen — quirky, dramatic, innocent
    pitch: 1.3,
    phrases: [
      "Let's get it on!",
      "WAIT. Did I just get UNLOCKED?!",
      "This is the best thing since... five seconds ago!",
      "SQUAWK! I mean— hello, destiny!",
      "Doors?! I have SO many thoughts about doors now.",
    ],
  },
  {
    id: "bram",
    name: "Bram",
    accent: "#9B75E4", // human teen — snack-obsessed friendly chaos
    pitch: 1.2,
    phrases: [
      "Okay so— wait. Are there snacks in here?",
      "I had three plans and ate two of them.",
      "Story time! Okay so— I forgot the middle part.",
      "Unlocked?! I wasn't even done loading, bro!",
      "This calls for celebratory nachos.",
    ],
  },
  {
    id: "atlas",
    name: "Atlas",
    accent: "#013F83", // human adult — motivational podcast about himself
    pitch: 0.8,
    phrases: [
      "Progress. I invented that, you know.",
      "Welcome to chapter one of greatness: me.",
      "Breathe deeply. I taught the air how.",
      "Observe closely. This is what arriving looks like.",
      "Success called. I let it go to voicemail.",
    ],
  },
  {
    id: "vela",
    name: "Vela",
    accent: "#FA7C03", // parrot adult — theatrical, poetic, slightly extra
    pitch: 1.1,
    phrases: [
      "The stage is set... and I have arrived.",
      "Cue the soft lighting, darling.",
      "An entrance? No, no. A moment.",
      "Sing it with me: laaa~! ...Perfect.",
      "Applause is welcome. Encouraged, even.",
    ],
  },
  {
    id: "suki",
    name: "Suki",
    accent: "#9AC097", // cat teen — dry, mysterious, judges you kindly
    pitch: 1.15,
    phrases: [
      "I knew you'd pick me. Obviously.",
      "Hm. Acceptable choice.",
      "I judged everyone here already. You passed.",
      "Purr. That's all you get.",
      "I was never locked. I was waiting.",
    ],
  },
  {
    id: "kiko",
    name: "Kiko",
    accent: "#DE1920", // monkey teen — hyper, needs sound effects
    pitch: 1.4,
    phrases: [
      "OOH-OOH! BOING! I'm here! WHAT'S NEXT?!",
      "Kiko time! *drum noises* ba-dum-TSS!",
      "WAIT WAIT WAIT— okay GO GO GO!",
      "New plan! It's terrible! LET'S DO IT!",
      "*swings in* WHEEE— I meant to do that.",
    ],
  },
  {
    id: "nori",
    name: "Nori",
    accent: "#00357B", // human adult — dry, too cool to explain twice
    pitch: 0.95,
    phrases: [
      "Oh. You unlocked me. Neat, I guess.",
      "Cool. Don't make it weird.",
      "I was already here. Mentally.",
      "Wow. Big moment. For you, mostly.",
      "Fine, I'm in. Act casual.",
    ],
  },
  {
    id: "miso",
    name: "Miso",
    accent: "#FAC602", // frog teen — tiny scientist, very serious
    pitch: 1.25,
    phrases: [
      "Fascinating. The unlock emitted a 'bloop'.",
      "Note: subject unlocked. Thrilling data.",
      "Hypothesis confirmed: I am the discovery.",
      "Recording this moment for science. Ribbit.",
      "The data suggests you chose... correctly.",
    ],
  },
  {
    id: "rune",
    name: "Rune",
    accent: "#F46282", // owl teen — sleepy ancient librarian
    pitch: 0.9,
    phrases: [
      "Ah yes... the prophecy... zzz... hm? Oh.",
      "I read about this moment. Lovely binding.",
      "Hoot... I mean — greetings, traveler.",
      "The dust has settled. Mostly on me.",
      "Chapter you: a promising read.",
    ],
  },
  {
    id: "tavo",
    name: "Tavo",
    accent: "#E38932", // turtle adult — grumpy cowboy sheriff
    pitch: 0.7,
    phrases: [
      "Hold yer horses. ...Alright. Now go.",
      "Unlocked? In MY day, we knocked.",
      "This better be worth the paperwork.",
      "Slow down, partner. Glory takes time.",
      "Hmph. Fine, I'm in. Don't tell Patty.",
    ],
  },
  {
    id: "zeni",
    name: "Zeni",
    accent: "#023D7D", // human adult — smug therapist, lovable roast
    pitch: 1.0,
    phrases: [
      "Excellent choice. I'd have picked me too.",
      "Let's unpack why you took so long.",
      "Growth! I'm so proud of one of us.",
      "You're doing your best. I'm doing better.",
      "This unlock says a lot about you. Good things. Mostly.",
    ],
  },
];

// derived asset paths + shader tint (normalize hex so the brightest
// channel hits 1.0 — keeps the hue but glows on a dark screen)
const ICONS_WITHOUT_FILE = new Set(["kami"]); // no transparent icon supplied
for (const c of CHARACTERS) {
  c.image = `public/characterImages/${c.id}.png`;
  c.icon = ICONS_WITHOUT_FILE.has(c.id)
    ? c.image
    : `public/transparent_icons/${c.id}.png`;
  const r = parseInt(c.accent.slice(1, 3), 16) / 255;
  const g = parseInt(c.accent.slice(3, 5), 16) / 255;
  const b = parseInt(c.accent.slice(5, 7), 16) / 255;
  const m = Math.max(r, g, b, 0.001);
  c.shaderColor = [r / m, g / m, b / m];
}

// ---------- sound effects (WebAudio, no assets) ----------
const sfx = (() => {
  let ctx = null;
  let muted = false;

  function ac() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function tone({ type = "sine", from = 440, to = from, t0 = 0, dur = 0.2, vol = 0.2 }) {
    const c = ac();
    if (!c || muted) return;
    const start = c.currentTime + t0;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(from, start);
    osc.frequency.exponentialRampToValueAtTime(Math.max(to, 1), start + dur);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(vol, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    osc.connect(gain).connect(c.destination);
    osc.start(start);
    osc.stop(start + dur + 0.05);
  }

  function noise({ t0 = 0, dur = 0.4, vol = 0.08, freq = 1200 }) {
    const c = ac();
    if (!c || muted) return;
    const start = c.currentTime + t0;
    const len = Math.floor(c.sampleRate * dur);
    const buf = c.createBuffer(1, len, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    const src = c.createBufferSource();
    src.buffer = buf;
    const filter = c.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(freq, start);
    filter.frequency.exponentialRampToValueAtTime(freq * 3, start + dur);
    const gain = c.createGain();
    gain.gain.setValueAtTime(vol, start);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    src.connect(filter).connect(gain).connect(c.destination);
    src.start(start);
  }

  return {
    // tiny pop for pill taps
    click() {
      tone({ type: "sine", from: 700, to: 900, dur: 0.07, vol: 0.12 });
    },
    // shader reveal: rising sweep + electric zaps
    reveal(pitch = 1) {
      tone({ type: "sawtooth", from: 90 * pitch, to: 700 * pitch, dur: 1.5, vol: 0.08 });
      noise({ dur: 1.4, vol: 0.05, freq: 500 * pitch });
      for (let i = 0; i < 4; i++) {
        tone({
          type: "square",
          from: (300 + i * 180) * pitch,
          to: (900 + i * 220) * pitch,
          t0: 0.5 + i * 0.55,
          dur: 0.12,
          vol: 0.05,
        });
      }
    },
    // card lands: comic POP + ta-da arpeggio + sparkle
    unlock(pitch = 1) {
      tone({ type: "sine", from: 420 * pitch, to: 80, dur: 0.18, vol: 0.25 });
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((f, i) =>
        tone({
          type: "triangle",
          from: f * pitch,
          dur: 0.22,
          t0: 0.12 + i * 0.09,
          vol: 0.16,
        })
      );
      noise({ t0: 0.15, dur: 0.6, vol: 0.05, freq: 3200 });
    },
    toggle() {
      muted = !muted;
      return muted;
    },
  };
})();

// ---------- raw WebGL shader lines (three.js-free port) ----------
const shader = (() => {
  const canvas = document.getElementById("shaderCanvas");
  const gl =
    canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  if (!gl) {
    console.error("WebGL not available");
    return { start() {}, stop() {}, setTint() {} };
  }

  const vertexSrc = `
    attribute vec2 position;
    void main() {
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  const fragmentSrc = `
    precision highp float;
    uniform vec2 resolution;
    uniform float time;
    uniform vec3 tint;

    float random (in float x) {
      return fract(sin(x)*1e4);
    }

    void main(void) {
      vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);

      vec2 fMosaicScal = vec2(4.0, 2.0);
      vec2 vScreenSize = vec2(256.0, 256.0);
      uv.x = floor(uv.x * vScreenSize.x / fMosaicScal.x) / (vScreenSize.x / fMosaicScal.x);
      uv.y = floor(uv.y * vScreenSize.y / fMosaicScal.y) / (vScreenSize.y / fMosaicScal.y);

      float t = time*0.06+random(uv.x)*0.4;
      float lineWidth = 0.0008;

      vec3 color = vec3(0.0);
      for(int j = 0; j < 3; j++){
        for(int i = 0; i < 5; i++){
          color[j] += lineWidth*float(i*i) / abs(fract(t - 0.01*float(j)+float(i)*0.01)*1.0 - length(uv));
        }
      }

      vec3 lines = vec3(color[2], color[1], color[0]);
      gl_FragColor = vec4(lines * tint, 1.0);
    }
  `;

  function compile(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(s));
    }
    return s;
  }

  const program = gl.createProgram();
  gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexSrc));
  gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentSrc));
  gl.linkProgram(program);
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW
  );
  const positionLoc = gl.getAttribLocation(program, "position");
  gl.enableVertexAttribArray(positionLoc);
  gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

  const timeLoc = gl.getUniformLocation(program, "time");
  const resolutionLoc = gl.getUniformLocation(program, "resolution");
  const tintLoc = gl.getUniformLocation(program, "tint");

  let time = 1.0;
  let animationId = null;

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    const w = Math.floor(canvas.clientWidth * dpr);
    const h = Math.floor(canvas.clientHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
    gl.uniform2f(resolutionLoc, canvas.width, canvas.height);
  }

  window.addEventListener("resize", () => {
    if (animationId !== null) resize();
  });

  function frame() {
    animationId = requestAnimationFrame(frame);
    time += 0.05;
    gl.uniform1f(timeLoc, time);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  return {
    setTint([r, g, b]) {
      gl.uniform3f(tintLoc, r, g, b);
    },
    start() {
      resize();
      if (animationId === null) frame();
    },
    stop() {
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    },
  };
})();

// ---------- glare card pointer tracking (vanilla port) ----------
(() => {
  const card = document.getElementById("glareCard");
  let inside = false;

  card.addEventListener("pointermove", (event) => {
    const rotateFactor = 0.4;
    const rect = card.getBoundingClientRect();
    const px = (100 / rect.width) * (event.clientX - rect.left);
    const py = (100 / rect.height) * (event.clientY - rect.top);
    const dx = px - 50;
    const dy = py - 50;

    card.style.setProperty("--m-x", `${px}%`);
    card.style.setProperty("--m-y", `${py}%`);
    card.style.setProperty("--r-x", `${-(dx / 3.5) * rotateFactor}deg`);
    card.style.setProperty("--r-y", `${(dy / 2) * rotateFactor}deg`);
    card.style.setProperty("--bg-x", `${50 + px / 4 - 12.5}%`);
    card.style.setProperty("--bg-y", `${50 + py / 3 - 16.67}%`);
  });

  card.addEventListener("pointerenter", () => {
    inside = true;
    setTimeout(() => {
      if (inside) card.style.setProperty("--duration", "0s");
    }, 300);
  });

  card.addEventListener("pointerleave", () => {
    inside = false;
    card.style.removeProperty("--duration");
    card.style.setProperty("--r-x", "0deg");
    card.style.setProperty("--r-y", "0deg");
  });
})();

// ---------- unlock flow ----------
const REVEAL_MS = 3800;

const el = {
  idle: document.getElementById("idle"),
  reveal: document.getElementById("reveal"),
  cardPhase: document.getElementById("cardPhase"),
  phrase: document.getElementById("phrase"),
  heroContent: document.getElementById("heroContent"),
  cubeMain: document.getElementById("cubeMain"),
  cubeReflect: document.getElementById("cubeReflect"),
  cardImage: document.getElementById("cardImage"),
  bigName: document.getElementById("bigName"),
  posterName: document.getElementById("posterNameText"),
  pillScroll: document.getElementById("pillScroll"),
  randomBtn: document.getElementById("randomBtn"),
  muteBtn: document.getElementById("muteBtn"),
};

let timer = null;
let current = null;
const unlocked = new Set();
// per-character bag of unused phrases: repeats only after the pool empties
const phraseBags = {};

function pickPhrase(c) {
  let bag = phraseBags[c.id];
  if (!bag || bag.length === 0) {
    bag = c.phrases.slice();
    phraseBags[c.id] = bag;
  }
  const i = Math.floor(Math.random() * bag.length);
  return bag.splice(i, 1)[0];
}

function buildMarquee(target, name) {
  const run = new Array(40).fill(name).join(" • ");
  target.innerHTML = "";
  for (const side of ["left", "right", "back"]) {
    const face = document.createElement("div");
    face.className = `face ${side}`;
    const p = document.createElement("p");
    p.textContent = run;
    face.appendChild(p);
    target.appendChild(face);
  }
}

function unlock(c) {
  if (timer) clearTimeout(timer);
  current = c;
  document.getElementById("app").style.setProperty("--accent", c.accent);

  // phase: shader reveal + persona phrase
  el.idle.hidden = true;
  el.cardPhase.hidden = true;
  el.reveal.hidden = false;

  el.phrase.textContent = pickPhrase(c);
  el.phrase.style.animation = "none";
  void el.phrase.offsetWidth;
  el.phrase.style.animation = "";

  shader.start();
  shader.setTint(c.shaderColor);
  sfx.reveal(c.pitch);

  markActive(c, false);

  // phase: comic store room + card
  timer = setTimeout(() => {
    shader.stop();
    el.reveal.hidden = true;

    buildMarquee(el.cubeMain, c.name);
    buildMarquee(el.cubeReflect, c.name);
    el.cardImage.src = c.image;
    el.cardImage.alt = c.name;
    el.bigName.textContent = c.name;
    el.posterName.textContent = c.name;

    el.cardPhase.hidden = false;
    scaleHero();
    sfx.unlock(c.pitch);

    unlocked.add(c.id);
    markActive(c, true);
  }, REVEAL_MS);
}

// responsive scaling of the fixed-size 1000x562 marquee stage
function scaleHero() {
  const scale = Math.min(
    1,
    (window.innerWidth / 1000) * 1.1,
    (window.innerHeight / 562) * 1.1
  );
  el.heroContent.style.transform = `scale(${scale})`;
}
window.addEventListener("resize", scaleHero);

// ---------- character switcher pill ----------
function markActive(c, showUnlockedDot) {
  for (const btn of el.pillScroll.children) {
    btn.classList.toggle("is-active", btn.dataset.id === c.id);
    if (showUnlockedDot && btn.dataset.id === c.id) {
      btn.classList.add("is-unlocked");
    }
  }
}

for (const c of CHARACTERS) {
  const btn = document.createElement("button");
  btn.className = "pill-char";
  btn.dataset.id = c.id;
  btn.style.setProperty("--char", c.accent);
  btn.setAttribute("aria-label", `Unlock ${c.name}`);
  btn.title = c.name;
  const img = document.createElement("img");
  img.src = c.icon;
  img.alt = "";
  img.draggable = false;
  btn.appendChild(img);
  btn.addEventListener("click", () => {
    sfx.click();
    unlock(c);
    btn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  });
  el.pillScroll.appendChild(btn);
}

// sparkle = random character (different from the current one)
el.randomBtn.addEventListener("click", () => {
  sfx.click();
  let pool = CHARACTERS.filter((c) => c !== current);
  const c = pool[Math.floor(Math.random() * pool.length)];
  unlock(c);
  const btn = [...el.pillScroll.children].find((b) => b.dataset.id === c.id);
  btn?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
});

el.muteBtn.addEventListener("click", () => {
  const muted = sfx.toggle();
  el.muteBtn.textContent = muted ? "🔇" : "🔊";
});
