// ============================================================
// IVAN "IRONMAN" STEWART'S SUPER OFF ROAD — Web Recreation
// Built with Phaser 3 · Procedural tracks + Kenney vehicle sprites
// ============================================================

// ── CONSTANTS ───────────────────────────────────────────────
const GW = 1024;
const GH = 768;
const TOTAL_LAPS = 4;
const TS = 12;                       // truck half-size
const ROT_FRAMES = 24;              // rotation angles per truck
const ROAD_W = 50;                  // default road width
const CP_DIST = 40;                 // checkpoint trigger distance
const WP_DIST = 25;                 // AI waypoint advance distance
const PICKUP_R = 15;                // pickup collection radius
const TRUCK_W = 26;
const TRUCK_H = 38;

const C = {
    player: 0x7b5ea7, ai1: 0xf0c020, ai2: 0xe08a1e, ai3: 0xe88acc,
    road: 0x606060, roadEdge: 0x888888, dirt: 0x8B7355, grass: 0x4a8a3a,
    mud: 0x5a4830, hud: 0x111111, money: 0xFFD700, nitro: 0xff4400,
};

const NAMES = ['COPILOT', 'FRANK', 'HUBOT', 'MONA'];
const CHAR_COLORS = [0x7b5ea7, 0xf0c020, 0xe08a1e, 0xe88acc];
const TCOLORS = [C.player, C.ai1, C.ai2, C.ai3];
const PLAYER_IMGS = ['avatar_copilot', 'avatar_frank', 'avatar_hubot', 'avatar_mona'];
const CAR_SPRITES = ['car_copilot', 'car_frank', 'car_hubot', 'car_mona'];
const TKEYS = ['player', 'ai1', 'ai2', 'ai3'];
const PRIZES = [100000, 90000, 80000, 70000];

const TRACK_MUSIC = [
    'music/mfcc-racing-speed-action-music-115041.mp3',
    'music/mfcc-speed-speed-racing-cycling-music-257904.mp3',
    'music/mfcc-asian-background-music-1-min-25-sec-371823.mp3',
    'music/mfcc-speed-action-racing-music-120442.mp3',
    'music/mfcc-african-background-music-372732.mp3',
    'music/mfcc-sports-football-soccer-music-414731.mp3',
    'music/mfcc-speed-racing-action-music-115039.mp3',
    'music/mfcc-halloween-background-music-428574.mp3',
    'music/mfcc-speed-action-racing-music-120442.mp3', // synthwave reuse
];

// Synthwave track is larger than screen — world dimensions
const SW_W = 2048;
const SW_H = 1536;

const TRUCK_SPRITES = {
    player: 'car_copilot',
    ai1: 'car_frank',
    ai2: 'car_hubot',
    ai3: 'car_mona',
};

const UPGRADES = [
    { key: 'tires',        name: 'TIRES',         cost: 40000,  max: 10 },
    { key: 'shocks',       name: 'SHOCKS',        cost: 60000,  max: 10 },
    { key: 'acceleration', name: 'ACCELERATION',   cost: 80000,  max: 10 },
    { key: 'topSpeed',     name: 'TOP SPEED',      cost: 100000, max: 10 },
    { key: 'nitros',       name: 'NITRO (×1)',     cost: 1000,   max: 99 },
];

// ── TRACK DATA ──────────────────────────────────────────────
const TRACKS = [
    {
        name: 'SIDEWINDER',
        cp: [
            {x:512,y:690},{x:740,y:700},{x:900,y:620},{x:930,y:460},
            {x:880,y:310},{x:730,y:220},{x:560,y:270},{x:420,y:210},
            {x:260,y:155},{x:130,y:255},{x:100,y:420},{x:140,y:570},
            {x:300,y:660},
        ],
        rw: ROAD_W,
        mud: [{x:800,y:460,r:30},{x:200,y:400,r:25}],
    },
    {
        name: 'FANDANGO',
        cp: [
            {x:350,y:700},{x:620,y:710},{x:850,y:640},{x:920,y:480},
            {x:860,y:320},{x:680,y:240},{x:500,y:320},{x:380,y:240},
            {x:200,y:175},{x:100,y:320},{x:110,y:500},{x:180,y:630},
        ],
        rw: ROAD_W,
        mud: [{x:500,y:320,r:28}],
    },
    {
        name: 'WIPEOUT',
        cp: [
            {x:512,y:700},{x:780,y:680},{x:920,y:540},{x:880,y:360},
            {x:760,y:250},{x:900,y:150},{x:650,y:110},{x:400,y:155},
            {x:200,y:245},{x:100,y:420},{x:150,y:580},{x:300,y:680},
        ],
        rw: ROAD_W - 4,
        mud: [{x:880,y:360,r:25},{x:300,y:680,r:25}],
    },
    {
        name: 'BLASTER',
        cp: [
            {x:512,y:700},{x:780,y:690},{x:920,y:580},{x:860,y:420},
            {x:720,y:340},{x:580,y:400},{x:500,y:320},{x:380,y:220},
            {x:200,y:175},{x:100,y:310},{x:120,y:480},{x:250,y:600},
            {x:370,y:650},
        ],
        rw: ROAD_W - 2,
        mud: [{x:580,y:400,r:20},{x:120,y:480,r:22}],
    },
    {
        name: 'HUEVOS GRANDE',
        cp: [
            {x:512,y:710},{x:750,y:680},{x:920,y:560},{x:920,y:380},
            {x:840,y:230},{x:660,y:155},{x:480,y:200},{x:350,y:150},
            {x:180,y:200},{x:100,y:350},{x:100,y:520},{x:200,y:650},
            {x:370,y:700},
        ],
        rw: ROAD_W,
        mud: [{x:480,y:200,r:30}],
    },
    {
        name: 'CLIFFHANGER',
        cp: [
            {x:400,y:700},{x:650,y:710},{x:870,y:650},{x:940,y:500},
            {x:900,y:350},{x:760,y:255},{x:600,y:310},{x:500,y:220},
            {x:340,y:155},{x:180,y:235},{x:100,y:400},{x:80,y:560},
            {x:200,y:670},
        ],
        rw: ROAD_W - 4,
        mud: [{x:600,y:310,r:25},{x:200,y:670,r:20}],
    },
    {
        name: 'BIG DUKES',
        cp: [
            {x:512,y:700},{x:720,y:710},{x:900,y:640},{x:940,y:460},
            {x:880,y:300},{x:720,y:200},{x:550,y:155},{x:380,y:200},
            {x:250,y:300},{x:120,y:200},{x:80,y:380},{x:100,y:540},
            {x:250,y:650},{x:380,y:690},
        ],
        rw: ROAD_W,
        mud: [{x:380,y:200,r:25},{x:880,y:300,r:22}],
    },
    {
        name: 'HURRICANE GULCH',
        cp: [
            {x:450,y:700},{x:700,y:700},{x:880,y:620},{x:930,y:460},
            {x:860,y:310},{x:700,y:240},{x:550,y:300},{x:440,y:240},
            {x:300,y:155},{x:160,y:245},{x:120,y:400},{x:160,y:540},
            {x:300,y:640},
        ],
        rw: ROAD_W - 2,
        mud: [{x:550,y:300,r:28},{x:160,y:540,r:24}],
    },
    {
        // ── SYNTHWAVE — giant multi-screen track ──
        name: 'NEON DRIVE',
        synth: true,
        W: SW_W, H: SW_H,
        rw: ROAD_W + 4,
        cp: [
            {x:1024,y:1420}, {x:1350,y:1440}, {x:1700,y:1380}, {x:1920,y:1220},
            {x:1960,y:1000}, {x:1820,y:820},  {x:1560,y:780},  {x:1320,y:900},
            {x:1080,y:820},  {x:900,y:620},   {x:1100,y:460},  {x:1380,y:380},
            {x:1680,y:300},  {x:1900,y:180},  {x:1700,y:90},   {x:1350,y:120},
            {x:1020,y:200},  {x:720,y:160},   {x:420,y:110},   {x:180,y:230},
            {x:100,y:440},   {x:220,y:640},   {x:440,y:720},   {x:620,y:900},
            {x:480,y:1080},  {x:260,y:1180},  {x:130,y:1340},  {x:300,y:1460},
            {x:560,y:1480},  {x:780,y:1440},
        ],
        mud: [{x:1500,y:900,r:30},{x:400,y:500,r:28},{x:1700,y:1100,r:26}],
    },
];

// ── GAME STATE ──────────────────────────────────────────────
let gs = resetGameState();
function resetGameState() {
    return {
        money: 200000, tires: 0, shocks: 0, acceleration: 0,
        topSpeed: 0, nitros: 3, raceNum: 0, playerIdx: 0,
    };
}

// Returns character indices reordered so gs.playerIdx is first
function getCharOrder() {
    const order = [gs.playerIdx];
    for (let i = 0; i < 4; i++) if (i !== gs.playerIdx) order.push(i);
    return order;
}

// ── UTILITY: Catmull-Rom closed-loop spline ─────────────────
function spline(pts, spp) {
    spp = spp || 20;
    const out = [], n = pts.length;
    for (let i = 0; i < n; i++) {
        const p0 = pts[(i - 1 + n) % n], p1 = pts[i];
        const p2 = pts[(i + 1) % n],     p3 = pts[(i + 2) % n];
        for (let s = 0; s < spp; s++) {
            const t = s / spp, tt = t * t, ttt = tt * t;
            out.push({
                x: 0.5 * (2*p1.x + (-p0.x+p2.x)*t + (2*p0.x-5*p1.x+4*p2.x-p3.x)*tt + (-p0.x+3*p1.x-3*p2.x+p3.x)*ttt),
                y: 0.5 * (2*p1.y + (-p0.y+p2.y)*t + (2*p0.y-5*p1.y+4*p2.y-p3.y)*tt + (-p0.y+3*p1.y-3*p2.y+p3.y)*ttt),
            });
        }
    }
    return out;
}

function drawPath(ctx, pts) {
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.closePath();
}

function hexCSS(c) { return '#' + c.toString(16).padStart(6, '0'); }

function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }

// ── PROCEDURAL SFX (Web Audio API) ─────────────────────────
const SFX = (() => {
    let ctx = null;
    const ac = () => { if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)(); return ctx; };

    // play a simple tone burst
    function tone(freq, type, vol, attack, sustain, release, delay = 0) {
        const c = ac();
        const g = c.createGain();
        g.connect(c.destination);
        const o = c.createOscillator();
        o.type = type; o.frequency.value = freq;
        o.connect(g);
        const t0 = c.currentTime + delay;
        g.gain.setValueAtTime(0, t0);
        g.gain.linearRampToValueAtTime(vol, t0 + attack);
        g.gain.setValueAtTime(vol, t0 + attack + sustain);
        g.gain.linearRampToValueAtTime(0, t0 + attack + sustain + release);
        o.start(t0);
        o.stop(t0 + attack + sustain + release + 0.01);
    }

    // countdown beep (low for 3/2/1, high+chord for GO)
    function countdownBeep(isGo) {
        if (isGo) {
            // major chord fanfare
            [[523, 0], [659, 0.04], [784, 0.08]].forEach(([f, d]) =>
                tone(f, 'square', 0.18, 0.01, 0.18, 0.15, d)
            );
        } else {
            tone(330, 'square', 0.22, 0.005, 0.08, 0.06);
        }
    }

    // short nitro burst: noise-ish sweep up
    function nitro() {
        const c = ac();
        const g = c.createGain();
        g.connect(c.destination);
        const o = c.createOscillator();
        o.type = 'sawtooth';
        o.frequency.setValueAtTime(80, c.currentTime);
        o.frequency.exponentialRampToValueAtTime(400, c.currentTime + 0.25);
        o.connect(g);
        g.gain.setValueAtTime(0.3, c.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.35);
        o.start(); o.stop(c.currentTime + 0.36);
        // layered hiss
        const buf = c.createBuffer(1, c.sampleRate * 0.3, c.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
        const src = c.createBufferSource();
        src.buffer = buf;
        const hg = c.createGain(); hg.gain.setValueAtTime(0.12, c.currentTime);
        hg.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.3);
        src.connect(hg); hg.connect(c.destination);
        src.start();
    }

    // pickup jingles
    function pickupMoney() {
        // ascending coin chime: C5 → E5 → G5
        [[523, 0], [659, 0.07], [784, 0.14]].forEach(([f, d]) =>
            tone(f, 'sine', 0.22, 0.005, 0.06, 0.08, d)
        );
    }
    function pickupNitro() {
        // power-up rising blip: A4 → A5
        tone(440, 'square', 0.15, 0.005, 0.04, 0.05, 0);
        tone(880, 'square', 0.18, 0.005, 0.08, 0.10, 0.08);
    }

    // engine: continuous oscillator managed externally
    let engineOsc = null, engineGain = null;
    function engineStart() {
        if (engineOsc) return;
        const c = ac();
        engineGain = c.createGain(); engineGain.gain.value = 0.06;
        engineGain.connect(c.destination);
        engineOsc = c.createOscillator();
        engineOsc.type = 'sawtooth'; engineOsc.frequency.value = 38;
        engineOsc.connect(engineGain);
        engineOsc.start();
    }
    function engineUpdate(speed, maxSpeed, accelerating) {
        if (!engineOsc) return;
        const c = ac();
        const ratio = Math.min(1, speed / (maxSpeed * 0.9 + 0.01));
        const targetFreq = 38 + ratio * 95 + (accelerating ? 18 : 0);
        const targetVol  = 0.08 + ratio * 0.09 + (accelerating ? 0.04 : 0);
        engineOsc.frequency.setTargetAtTime(targetFreq, c.currentTime, 0.08);
        engineGain.gain.setTargetAtTime(targetVol,  c.currentTime, 0.08);
    }
    function engineStop() {
        if (!engineOsc) return;
        engineGain.gain.setTargetAtTime(0, ac().currentTime, 0.1);
        setTimeout(() => { try { engineOsc.stop(); } catch(e){} engineOsc = null; engineGain = null; }, 300);
    }

    // ramp launch sound: quick rising whoosh + thud on landing
    function rampJump() {
        const c = ac();
        // whoosh sweep up
        const o = c.createOscillator();
        o.type = 'triangle';
        o.frequency.setValueAtTime(120, c.currentTime);
        o.frequency.exponentialRampToValueAtTime(600, c.currentTime + 0.18);
        const g = c.createGain();
        g.gain.setValueAtTime(0.25, c.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.25);
        o.connect(g); g.connect(c.destination);
        o.start(); o.stop(c.currentTime + 0.26);
        // noise burst for texture
        const buf = c.createBuffer(1, c.sampleRate * 0.15, c.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * 0.5;
        const src = c.createBufferSource(); src.buffer = buf;
        const ng = c.createGain(); ng.gain.setValueAtTime(0.1, c.currentTime);
        ng.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.15);
        src.connect(ng); ng.connect(c.destination); src.start();
    }

    // ball kick: short punchy thud
    function ballKick() {
        const c = ac();
        const o = c.createOscillator();
        o.type = 'sine';
        o.frequency.setValueAtTime(220, c.currentTime);
        o.frequency.exponentialRampToValueAtTime(80, c.currentTime + 0.12);
        const g = c.createGain();
        g.gain.setValueAtTime(0.3, c.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.15);
        o.connect(g); g.connect(c.destination);
        o.start(); o.stop(c.currentTime + 0.16);
        // short noise pop
        const buf = c.createBuffer(1, c.sampleRate * 0.06, c.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1);
        const src = c.createBufferSource(); src.buffer = buf;
        const hg = c.createGain(); hg.gain.setValueAtTime(0.15, c.currentTime);
        hg.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.06);
        src.connect(hg); hg.connect(c.destination); src.start();
    }

    // subbuteo wobble: hollow plastic clack
    function subbuteoHit() {
        const c = ac();
        // hollow plastic knock
        const o = c.createOscillator();
        o.type = 'square';
        o.frequency.setValueAtTime(800, c.currentTime);
        o.frequency.exponentialRampToValueAtTime(200, c.currentTime + 0.08);
        const g = c.createGain();
        g.gain.setValueAtTime(0.2, c.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.12);
        o.connect(g); g.connect(c.destination);
        o.start(); o.stop(c.currentTime + 0.13);
        // secondary resonance
        const o2 = c.createOscillator();
        o2.type = 'triangle';
        o2.frequency.value = 350;
        const g2 = c.createGain();
        g2.gain.setValueAtTime(0.1, c.currentTime + 0.02);
        g2.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.18);
        o2.connect(g2); g2.connect(c.destination);
        o2.start(c.currentTime + 0.02); o2.stop(c.currentTime + 0.19);
    }

    // ghost freeze: eerie descending wail
    function ghostFreeze() {
        const c = ac();
        // descending wail
        const o = c.createOscillator();
        o.type = 'sine';
        o.frequency.setValueAtTime(900, c.currentTime);
        o.frequency.exponentialRampToValueAtTime(200, c.currentTime + 0.5);
        const g = c.createGain();
        g.gain.setValueAtTime(0.25, c.currentTime);
        g.gain.linearRampToValueAtTime(0.15, c.currentTime + 0.3);
        g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.6);
        o.connect(g); g.connect(c.destination);
        o.start(); o.stop(c.currentTime + 0.65);
        // breathy overlay
        const o2 = c.createOscillator();
        o2.type = 'triangle';
        o2.frequency.setValueAtTime(450, c.currentTime);
        o2.frequency.exponentialRampToValueAtTime(120, c.currentTime + 0.4);
        const g2 = c.createGain();
        g2.gain.setValueAtTime(0.12, c.currentTime);
        g2.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.5);
        o2.connect(g2); g2.connect(c.destination);
        o2.start(); o2.stop(c.currentTime + 0.55);
    }

    return { countdownBeep, nitro, pickupMoney, pickupNitro, engineStart, engineUpdate, engineStop, rampJump, ballKick, subbuteoHit, ghostFreeze };
})();

// ── BOOT SCENE ──────────────────────────────────────────────
class BootScene extends Phaser.Scene {
    constructor() { super('BootScene'); }

    preload() {
        this.load.on('loaderror', (file) => {
            console.warn('Asset load failed:', file.key, file.src || 'unknown source');
        });

        this.load.image(TRUCK_SPRITES.player, 'players/car_copilot.png');
        this.load.image(TRUCK_SPRITES.ai1, 'players/car_frank.png');
        this.load.image(TRUCK_SPRITES.ai2, 'players/car_hubot.png');
        this.load.image(TRUCK_SPRITES.ai3, 'players/car_mona.png');

        this.load.image('avatar_copilot', 'players/copilot.png');
        this.load.image('avatar_frank', 'players/frank.png');
        this.load.image('avatar_hubot', 'players/hubot.png');
        this.load.image('avatar_mona', 'players/mona.png');

        TRACK_MUSIC.forEach((path, i) => {
            this.load.audio('music_' + i, path);
        });
    }

    create() {
        this.genTrucks();
        this.genPickups();
        this.genTracks();
        this.scene.start('TitleScene');
    }

    genTrucks() {
        // If sprite loading fails for any reason, keep the procedural truck fallback.
        if (Object.values(TRUCK_SPRITES).every(k => this.textures.exists(k))) return;

        const sz = TS * 2;
        TCOLORS.forEach((col, idx) => {
            const cv = document.createElement('canvas');
            cv.width = sz * ROT_FRAMES; cv.height = sz;
            const ctx = cv.getContext('2d');
            const r = (col >> 16) & 0xff, g = (col >> 8) & 0xff, b = col & 0xff;
            for (let f = 0; f < ROT_FRAMES; f++) {
                const cx = f * sz + sz / 2, cy = sz / 2;
                const a = (f / ROT_FRAMES) * Math.PI * 2;
                ctx.save(); ctx.translate(cx, cy); ctx.rotate(a);
                // body
                ctx.fillStyle = `rgb(${r},${g},${b})`;
                ctx.fillRect(-TS * 0.7, -TS * 0.5, TS * 1.4, TS);
                // front (darker)
                ctx.fillStyle = `rgb(${r * 0.6 | 0},${g * 0.6 | 0},${b * 0.6 | 0})`;
                ctx.fillRect(TS * 0.2, -TS * 0.5, TS * 0.5, TS);
                // wheels
                ctx.fillStyle = '#222';
                [[-0.6, -0.6], [-0.6, 0.4], [0.3, -0.6], [0.3, 0.4]].forEach(([wx, wy]) => {
                    ctx.fillRect(TS * wx, TS * wy, TS * 0.3, TS * 0.2);
                });
                // cage
                ctx.strokeStyle = `rgb(${Math.min(255, r + 60)},${Math.min(255, g + 60)},${Math.min(255, b + 60)})`;
                ctx.lineWidth = 1;
                ctx.strokeRect(-TS * 0.25, -TS * 0.3, TS * 0.5, TS * 0.6);
                ctx.restore();
            }
            this.textures.addSpriteSheet(`truck_${TKEYS[idx]}`, cv, { frameWidth: sz, frameHeight: sz });
        });
    }

    genPickups() {
        // money bag
        let cv = document.createElement('canvas'); cv.width = cv.height = 20;
        let ctx = cv.getContext('2d');
        ctx.fillStyle = '#FFD700'; ctx.beginPath(); ctx.arc(10, 12, 7, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#8B6914'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('$', 10, 12);
        this.textures.addCanvas('pk_money', cv);

        // nitro
        cv = document.createElement('canvas'); cv.width = cv.height = 20;
        ctx = cv.getContext('2d');
        ctx.fillStyle = '#ff4400'; ctx.beginPath(); ctx.arc(10, 10, 7, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ff9944'; ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('N', 10, 11);
        this.textures.addCanvas('pk_nitro', cv);
    }

    genTracks() {
        // Seeded random for consistent track features
        let seed = 42;
        function srand() { seed = (seed * 16807 + 0) % 2147483647; return (seed - 1) / 2147483646; }

        TRACKS.forEach((t, idx) => {
            seed = idx * 7919 + 42;
            // per-track world dimensions (default to screen size)
            t.W = t.W || GW;
            t.H = t.H || GH;
            const TW = t.W, TH = t.H;
            const wp = spline(t.cp, 20);
            t.wp = wp;

            const halloween = idx === 7;
            const soccer    = idx === 5;
            const asian     = idx === 2;
            const synth     = !!t.synth;

            // ── visual ──
            const vc = document.createElement('canvas'); vc.width = TW; vc.height = TH;
            const vx = vc.getContext('2d');

            if (synth) {
                // ── SYNTHWAVE: top-down neon grid world ──
                // base: deep purple/black
                vx.fillStyle = '#0a0020'; vx.fillRect(0, 0, TW, TH);
                // subtle radial vignette gradients at corners for mood
                for (let i = 0; i < 6; i++) {
                    const rg = vx.createRadialGradient(srand()*TW, srand()*TH, 0, srand()*TW, srand()*TH, 300);
                    rg.addColorStop(0, `rgba(${120+(srand()*60|0)},0,${160+(srand()*95|0)},0.35)`);
                    rg.addColorStop(1, 'rgba(0,0,0,0)');
                    vx.fillStyle = rg; vx.fillRect(0, 0, TW, TH);
                }
                // neon grid — cyan
                vx.strokeStyle = 'rgba(42,240,255,0.35)'; vx.lineWidth = 1;
                const GRID = 48;
                for (let gx = 0; gx <= TW; gx += GRID) {
                    vx.beginPath(); vx.moveTo(gx, 0); vx.lineTo(gx, TH); vx.stroke();
                }
                for (let gy = 0; gy <= TH; gy += GRID) {
                    vx.beginPath(); vx.moveTo(0, gy); vx.lineTo(TW, gy); vx.stroke();
                }
                // every 4th line brighter magenta
                vx.strokeStyle = 'rgba(255,42,109,0.55)'; vx.lineWidth = 1.5;
                for (let gx = 0; gx <= TW; gx += GRID * 4) {
                    vx.beginPath(); vx.moveTo(gx, 0); vx.lineTo(gx, TH); vx.stroke();
                }
                for (let gy = 0; gy <= TH; gy += GRID * 4) {
                    vx.beginPath(); vx.moveTo(0, gy); vx.lineTo(TW, gy); vx.stroke();
                }
                // scattered stars / sparkles
                for (let i = 0; i < 500; i++) {
                    const sx2 = srand()*TW|0, sy2 = srand()*TH|0;
                    vx.fillStyle = `rgba(${200+(srand()*55|0)},${200+(srand()*55|0)},255,${0.3+srand()*0.5})`;
                    vx.fillRect(sx2, sy2, 1, 1);
                }
                // ── neon sun emblem (top-down "stylized") ──
                const sunCx = TW * 0.3, sunCy = TH * 0.2, sunR = 120;
                const sunG = vx.createRadialGradient(sunCx, sunCy, 0, sunCx, sunCy, sunR);
                sunG.addColorStop(0, 'rgba(255,233,74,0.95)');
                sunG.addColorStop(0.4, 'rgba(255,106,154,0.8)');
                sunG.addColorStop(1, 'rgba(255,42,109,0.1)');
                vx.fillStyle = sunG;
                vx.beginPath(); vx.arc(sunCx, sunCy, sunR, 0, Math.PI * 2); vx.fill();
                // horizontal slits
                vx.fillStyle = '#0a0020';
                for (let i = 0; i < 7; i++) {
                    vx.fillRect(sunCx - sunR, sunCy + 10 + i * 14, sunR * 2, 2.5 + i * 0.6);
                }
                // second smaller sun
                const sun2x = TW * 0.75, sun2y = TH * 0.75, sun2R = 80;
                const sun2G = vx.createRadialGradient(sun2x, sun2y, 0, sun2x, sun2y, sun2R);
                sun2G.addColorStop(0, 'rgba(42,240,255,0.95)');
                sun2G.addColorStop(0.5, 'rgba(130,80,255,0.6)');
                sun2G.addColorStop(1, 'rgba(80,40,200,0.05)');
                vx.fillStyle = sun2G;
                vx.beginPath(); vx.arc(sun2x, sun2y, sun2R, 0, Math.PI * 2); vx.fill();

                // palm tree silhouettes scattered around
                const drawPalm = (px, py, h) => {
                    // trunk
                    vx.strokeStyle = '#0a0010'; vx.lineWidth = 4;
                    vx.beginPath(); vx.moveTo(px, py); vx.lineTo(px + 2, py - h); vx.stroke();
                    // fronds
                    vx.strokeStyle = '#0a0010'; vx.lineWidth = 3;
                    for (let f = 0; f < 6; f++) {
                        const fa = (f / 6) * Math.PI + Math.PI + srand() * 0.3;
                        const fx = px + 2 + Math.cos(fa) * h * 0.45;
                        const fy = py - h + Math.sin(fa) * h * 0.3;
                        vx.beginPath(); vx.moveTo(px + 2, py - h); vx.quadraticCurveTo((px + fx)/2, py - h - 12, fx, fy); vx.stroke();
                    }
                    // neon outline on trunk
                    vx.strokeStyle = '#ff2a6d'; vx.lineWidth = 1;
                    vx.beginPath(); vx.moveTo(px - 1, py); vx.lineTo(px + 1, py - h); vx.stroke();
                };
                for (let i = 0; i < 28; i++) {
                    const px = srand() * TW, py = srand() * TH;
                    // skip if too close to track center (simple approximation)
                    drawPalm(px, py, 35 + srand() * 35);
                }
                // neon triangles / pyramids decor
                for (let i = 0; i < 20; i++) {
                    const tx = srand() * TW, ty = srand() * TH, tr = 12 + srand() * 18;
                    const col = srand() > 0.5 ? '#2af0ff' : '#ff2a6d';
                    vx.strokeStyle = col; vx.lineWidth = 1.5;
                    vx.beginPath();
                    vx.moveTo(tx, ty - tr);
                    vx.lineTo(tx - tr, ty + tr);
                    vx.lineTo(tx + tr, ty + tr);
                    vx.closePath(); vx.stroke();
                }
                // road shoulder — magenta glow
                vx.strokeStyle = '#ff2a6d'; vx.lineWidth = t.rw + 16;
                vx.lineCap = 'round'; vx.lineJoin = 'round';
                drawPath(vx, wp); vx.stroke();
                // inner shoulder — cyan glow
                vx.strokeStyle = '#2af0ff'; vx.lineWidth = t.rw + 6;
                drawPath(vx, wp); vx.stroke();
                // road surface — near-black
                vx.strokeStyle = '#0a0618'; vx.lineWidth = t.rw;
                drawPath(vx, wp); vx.stroke();
                // inner road highlight
                vx.strokeStyle = '#1a0a2a'; vx.lineWidth = t.rw - 14;
                drawPath(vx, wp); vx.stroke();
                // centre dashes — bright cyan
                vx.strokeStyle = '#2af0ff'; vx.lineWidth = 2; vx.setLineDash([10, 16]);
                drawPath(vx, wp); vx.stroke(); vx.setLineDash([]);
                // edge neon stripes (thin)
                vx.strokeStyle = 'rgba(255,42,109,0.9)'; vx.lineWidth = 1.5;
                vx.setLineDash([20, 6]); drawPath(vx, wp); vx.stroke(); vx.setLineDash([]);
                // mud as neon "glitch" pools
                t.mud.forEach(m => {
                    const g = vx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r);
                    g.addColorStop(0, 'rgba(170,0,255,0.9)'); g.addColorStop(1, 'rgba(80,0,160,0.1)');
                    vx.fillStyle = g; vx.beginPath(); vx.arc(m.x, m.y, m.r, 0, Math.PI * 2); vx.fill();
                    // glitch scanlines inside
                    vx.fillStyle = 'rgba(42,240,255,0.4)';
                    for (let s = -m.r; s < m.r; s += 4) {
                        vx.fillRect(m.x - m.r, m.y + s, m.r * 2, 1);
                    }
                });
            } else if (halloween) {
                // deep dark purple-black night sky
                vx.fillStyle = '#0d0010'; vx.fillRect(0, 0, GW, GH);
                // moody purple/dark patches
                for (let i = 0; i < 35; i++) {
                    const r2 = vx.createRadialGradient(srand()*GW, srand()*GH, 0, srand()*GW, srand()*GH, 30 + srand()*80);
                    r2.addColorStop(0, `rgba(${60+(srand()*40|0)},0,${80+(srand()*60|0)},0.55)`);
                    r2.addColorStop(1, 'rgba(0,0,0,0)');
                    vx.fillStyle = r2; vx.fillRect(0, 0, GW, GH);
                }
                // scattered stars
                for (let i = 0; i < 80; i++) {
                    vx.fillStyle = `rgba(255,220,255,${0.3 + srand()*0.7})`;
                    vx.fillRect(srand()*GW|0, srand()*GH|0, 1, 1);
                }
                // jack-o-lantern pumpkins scattered on field
                const drawPumpkin = (px, py, r) => {
                    vx.fillStyle = '#c85000';
                    vx.beginPath(); vx.ellipse(px, py, r, r*0.8, 0, 0, Math.PI*2); vx.fill();
                    vx.fillStyle = '#e06000';
                    vx.beginPath(); vx.ellipse(px-r*0.28, py, r*0.5, r*0.72, 0, 0, Math.PI*2); vx.fill();
                    vx.beginPath(); vx.ellipse(px+r*0.28, py, r*0.5, r*0.72, 0, 0, Math.PI*2); vx.fill();
                    // stem
                    vx.fillStyle = '#2a5500'; vx.fillRect(px-2, py-r*0.8-6, 4, 7);
                    // eyes
                    vx.fillStyle = '#ffcc00';
                    vx.beginPath(); vx.moveTo(px-r*0.35, py-r*0.1); vx.lineTo(px-r*0.15, py-r*0.3); vx.lineTo(px-r*0.15, py-r*0.1); vx.fill();
                    vx.beginPath(); vx.moveTo(px+r*0.35, py-r*0.1); vx.lineTo(px+r*0.15, py-r*0.3); vx.lineTo(px+r*0.15, py-r*0.1); vx.fill();
                    // mouth
                    vx.beginPath(); vx.moveTo(px-r*0.35, py+r*0.2);
                    vx.lineTo(px-r*0.2, py+r*0.35); vx.lineTo(px-r*0.05, py+r*0.22);
                    vx.lineTo(px+r*0.05, py+r*0.35); vx.lineTo(px+r*0.2, py+r*0.22);
                    vx.lineTo(px+r*0.35, py+r*0.35); vx.lineTo(px+r*0.35, py+r*0.2); vx.fill();
                };
                for (let i = 0; i < 12; i++) drawPumpkin(srand()*GW, srand()*GH, 8 + srand()*10);
                // road shoulder — purple-tinged
                vx.strokeStyle = '#4a1a6a'; vx.lineWidth = t.rw + 10;
                vx.lineCap = 'round'; vx.lineJoin = 'round';
                drawPath(vx, wp); vx.stroke();
                // road surface — very dark
                vx.strokeStyle = '#1a0828'; vx.lineWidth = t.rw;
                drawPath(vx, wp); vx.stroke();
                // inner detail
                vx.strokeStyle = '#220a32'; vx.lineWidth = t.rw - 12;
                drawPath(vx, wp); vx.stroke();
                // centre dashes — orange
                vx.strokeStyle = '#cc5500'; vx.lineWidth = 1; vx.setLineDash([8, 14]);
                drawPath(vx, wp); vx.stroke(); vx.setLineDash([]);
                // mud as glowing purple slime pools
                t.mud.forEach(m => {
                    const g = vx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r);
                    g.addColorStop(0, 'rgba(160,0,200,0.9)'); g.addColorStop(1, 'rgba(80,0,100,0.15)');
                    vx.fillStyle = g; vx.beginPath(); vx.arc(m.x, m.y, m.r, 0, Math.PI * 2); vx.fill();
                });
            } else if (soccer) {
                // ── SOCCER: vivid green pitch with field markings ──
                vx.fillStyle = '#2e8b2e'; vx.fillRect(0, 0, GW, GH);
                // alternating mow stripes
                for (let s = 0; s < GH; s += 40) {
                    vx.fillStyle = s % 80 === 0 ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.04)';
                    vx.fillRect(0, s, GW, 40);
                }
                // field boundary
                vx.strokeStyle = 'rgba(255,255,255,0.55)'; vx.lineWidth = 3; vx.setLineDash([]);
                vx.strokeRect(60, 60, GW - 120, GH - 120);
                // centre circle
                vx.beginPath(); vx.arc(GW/2, GH/2, 70, 0, Math.PI*2); vx.stroke();
                vx.beginPath(); vx.arc(GW/2, GH/2, 3, 0, Math.PI*2);
                vx.fillStyle = 'rgba(255,255,255,0.8)'; vx.fill();
                // halfway line
                vx.beginPath(); vx.moveTo(60, GH/2); vx.lineTo(GW-60, GH/2); vx.stroke();
                // penalty boxes
                vx.strokeRect(60, GH/2 - 80, 100, 160);
                vx.strokeRect(GW - 160, GH/2 - 80, 100, 160);
                // corner arcs
                [[60,60],[GW-60,60],[60,GH-60],[GW-60,GH-60]].forEach(([cx2,cy2]) => {
                    const aStart = Math.atan2(GH/2-cy2, GW/2-cx2) - 0.4;
                    vx.beginPath(); vx.arc(cx2, cy2, 20, aStart, aStart + 0.8); vx.stroke();
                });
                // soccer balls scattered off-road
                const drawBall = (bx, by, r) => {
                    // white base
                    vx.save();
                    vx.beginPath(); vx.arc(bx, by, r, 0, Math.PI*2); vx.closePath(); vx.clip();
                    vx.fillStyle = '#fff';
                    vx.fillRect(bx - r, by - r, r*2, r*2);
                    // centre pentagon
                    const drawPentagon = (cx2, cy2, pr) => {
                        vx.beginPath();
                        for (let p = 0; p < 5; p++) {
                            const a = (p / 5) * Math.PI * 2 - Math.PI / 2;
                            const px2 = cx2 + Math.cos(a) * pr;
                            const py2 = cy2 + Math.sin(a) * pr;
                            p === 0 ? vx.moveTo(px2, py2) : vx.lineTo(px2, py2);
                        }
                        vx.closePath();
                    };
                    vx.fillStyle = '#222';
                    drawPentagon(bx, by, r * 0.35); vx.fill();
                    // outer pentagons
                    for (let p = 0; p < 5; p++) {
                        const a = (p / 5) * Math.PI * 2 - Math.PI / 2;
                        const ox = bx + Math.cos(a) * r * 0.72;
                        const oy = by + Math.sin(a) * r * 0.72;
                        vx.fillStyle = '#222';
                        drawPentagon(ox, oy, r * 0.25); vx.fill();
                    }
                    // seam lines from centre pentagon vertices to outer pentagons
                    vx.strokeStyle = '#555'; vx.lineWidth = r * 0.06;
                    for (let p = 0; p < 5; p++) {
                        const a1 = (p / 5) * Math.PI * 2 - Math.PI / 2;
                        const ix = bx + Math.cos(a1) * r * 0.35;
                        const iy = by + Math.sin(a1) * r * 0.35;
                        const ox = bx + Math.cos(a1) * r * 0.72;
                        const oy = by + Math.sin(a1) * r * 0.72;
                        vx.beginPath(); vx.moveTo(ix, iy); vx.lineTo(ox, oy); vx.stroke();
                        // connect adjacent outer pentagons
                        const a2 = ((p+1) / 5) * Math.PI * 2 - Math.PI / 2;
                        const ox2 = bx + Math.cos(a2) * r * 0.72;
                        const oy2 = by + Math.sin(a2) * r * 0.72;
                        const mx = (ox + ox2) / 2 + (by - (oy + oy2)/2) * 0.15;
                        const my = (oy + oy2) / 2 + ((ox + ox2)/2 - bx) * 0.15;
                        vx.beginPath(); vx.moveTo(ox, oy); vx.quadraticCurveTo(mx, my, ox2, oy2); vx.stroke();
                    }
                    vx.restore();
                    // outer edge
                    vx.strokeStyle = '#333'; vx.lineWidth = r * 0.1;
                    vx.beginPath(); vx.arc(bx, by, r, 0, Math.PI*2); vx.stroke();
                    // subtle highlight
                    const hl = vx.createRadialGradient(bx - r*0.3, by - r*0.3, 0, bx, by, r);
                    hl.addColorStop(0, 'rgba(255,255,255,0.5)'); hl.addColorStop(1, 'rgba(0,0,0,0)');
                    vx.fillStyle = hl;
                    vx.beginPath(); vx.arc(bx, by, r, 0, Math.PI*2); vx.fill();
                };
                // store ball positions for runtime collision (drawn dynamically, not on static canvas)
                t.soccerBalls = [];
                for (let i = 0; i < 10; i++) {
                    const bx2 = srand()*GW, by2 = srand()*GH, br = 5 + srand()*5;
                    t.soccerBalls.push({ x: bx2, y: by2, r: br });
                }

                // subbuteo player — store position for runtime collision (drawn dynamically, not on static canvas)
                const spx = 100 + srand() * (GW - 200), spy = 100 + srand() * (GH - 200);
                t.subbuteo = { x: spx, y: spy };

                // Rangers vs Celtic match ticket — angled as a RAMP
                srand(); srand(); // consume random values to keep seed in sync
                const tkx = GW / 2 - 60, tky = GH / 2 - 10;
                const rampAngle = -10 * Math.PI / 180; // ~10 degrees tilted up from left
                // store ramp zone for collision detection
                t.ramp = { x: tkx + 60, y: tky + 26, hw: 65, hh: 30, angle: rampAngle };
                vx.save();
                vx.translate(tkx, tky);
                // shadow underneath the ramp to show it's elevated
                vx.save();
                vx.translate(6, 10);
                vx.rotate(rampAngle * 0.3); // shadow less tilted (on ground)
                vx.fillStyle = 'rgba(0,0,0,0.45)';
                vx.beginPath();
                vx.moveTo(0, 52); vx.lineTo(120, 52);
                vx.lineTo(115, 56); vx.lineTo(5, 58);
                vx.closePath(); vx.fill();
                // broader soft shadow
                vx.fillStyle = 'rgba(0,0,0,0.18)';
                vx.beginPath();
                vx.ellipse(60, 58, 65, 10, 0, 0, Math.PI * 2);
                vx.fill();
                vx.restore();
                // tilt the ticket like a ramp — left side on the ground
                vx.rotate(rampAngle);
                // ticket background
                const tg = vx.createLinearGradient(0, 0, 120, 0);
                tg.addColorStop(0, '#f5f0e0'); tg.addColorStop(1, '#ece5cc');
                vx.fillStyle = tg;
                vx.fillRect(0, 0, 120, 52);
                // thin edge strip to show thickness/ramp depth
                vx.fillStyle = '#c8b888';
                vx.beginPath();
                vx.moveTo(0, 52); vx.lineTo(120, 52);
                vx.lineTo(120, 55); vx.lineTo(0, 54);
                vx.closePath(); vx.fill();
                // ticket border
                vx.strokeStyle = '#8a7a5a'; vx.lineWidth = 1.2;
                vx.strokeRect(0, 0, 120, 52);
                // perforated edge
                vx.setLineDash([2, 3]); vx.strokeStyle = '#aaa'; vx.lineWidth = 0.8;
                vx.beginPath(); vx.moveTo(90, 0); vx.lineTo(90, 52); vx.stroke();
                vx.setLineDash([]);
                // header bar
                vx.fillStyle = '#1a3c7a'; vx.fillRect(2, 2, 86, 12);
                vx.fillStyle = '#fff'; vx.font = 'bold 7px sans-serif'; vx.textAlign = 'center';
                vx.fillText('OLD FIRM DERBY', 45, 11);
                // team names
                vx.fillStyle = '#0033a0'; vx.font = 'bold 8px sans-serif'; vx.textAlign = 'left';
                vx.fillText('RANGERS', 6, 26);
                vx.fillStyle = '#333'; vx.font = 'bold 7px sans-serif';
                vx.fillText('vs', 54, 26);
                vx.fillStyle = '#006b35'; vx.font = 'bold 8px sans-serif';
                vx.fillText('CELTIC', 64, 26);
                // match details
                vx.fillStyle = '#555'; vx.font = '5.5px sans-serif'; vx.textAlign = 'left';
                vx.fillText('IBROX STADIUM', 6, 35);
                vx.fillText('SAT 15:00  ADMIT ONE', 6, 43);
                // stub section
                vx.fillStyle = '#666'; vx.font = '5px sans-serif'; vx.textAlign = 'center';
                vx.fillText('SECT', 105, 18);
                vx.fillStyle = '#1a3c7a'; vx.font = 'bold 10px sans-serif';
                vx.fillText('A7', 105, 30);
                vx.fillStyle = '#888'; vx.font = '4.5px sans-serif';
                vx.fillText('ROW 12', 105, 38);
                vx.fillText('SEAT 4', 105, 45);
                vx.restore();
                // road shoulder — white line
                vx.strokeStyle = '#bbb'; vx.lineWidth = t.rw + 10; vx.setLineDash([]);
                vx.lineCap = 'round'; vx.lineJoin = 'round';
                drawPath(vx, wp); vx.stroke();
                // road surface — clean short-cut grass
                vx.strokeStyle = '#3aaa3a'; vx.lineWidth = t.rw;
                drawPath(vx, wp); vx.stroke();
                // inner detail
                vx.strokeStyle = '#35993a'; vx.lineWidth = t.rw - 12;
                drawPath(vx, wp); vx.stroke();
                // centre line — white dashes
                vx.strokeStyle = '#fff'; vx.lineWidth = 2; vx.setLineDash([6, 10]);
                drawPath(vx, wp); vx.stroke(); vx.setLineDash([]);
                // mud as puddles
                t.mud.forEach(m => {
                    const g = vx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r);
                    g.addColorStop(0, 'rgba(100,70,30,0.85)'); g.addColorStop(1, 'rgba(60,40,10,0.1)');
                    vx.fillStyle = g; vx.beginPath(); vx.arc(m.x, m.y, m.r, 0, Math.PI * 2); vx.fill();
                });

            } else if (asian) {
                // ── ASIAN: cherry blossom park with pagoda silhouettes ──
                // soft pale sky
                vx.fillStyle = '#f5e6f0'; vx.fillRect(0, 0, GW, GH);
                // gentle pink-purple gradient wash
                const skyG = vx.createLinearGradient(0,0,0,GH);
                skyG.addColorStop(0,'rgba(220,160,190,0.45)'); skyG.addColorStop(1,'rgba(180,120,160,0.1)');
                vx.fillStyle = skyG; vx.fillRect(0,0,GW,GH);
                // blossom petal rain clusters
                const drawPetal = (px2, py2, r, angle) => {
                    vx.save(); vx.translate(px2, py2); vx.rotate(angle);
                    vx.fillStyle = `rgba(${220+(srand()*30|0)},${100+(srand()*60|0)},${150+(srand()*40|0)},0.75)`;
                    vx.beginPath(); vx.ellipse(0, 0, r*1.6, r*0.8, 0, 0, Math.PI*2); vx.fill();
                    vx.restore();
                };
                for (let i = 0; i < 120; i++) drawPetal(srand()*GW, srand()*GH, 2+srand()*4, srand()*Math.PI*2);
                // cherry blossom trees (trunk + blossom cloud)
                const drawTree = (tx, ty, h) => {
                    vx.fillStyle = '#5a3010'; vx.fillRect(tx-3, ty-h, 6, h);
                    // branches
                    vx.strokeStyle = '#5a3010'; vx.lineWidth = 2;
                    [[-0.6,-0.35],[0.5,-0.4],[-0.3,-0.6],[0.2,-0.65]].forEach(([dx,dy]) => {
                        vx.beginPath(); vx.moveTo(tx, ty-h*0.6);
                        vx.lineTo(tx+dx*h*0.5, ty+dy*h); vx.stroke();
                    });
                    // blossom cloud
                    for (let b = 0; b < 7; b++) {
                        const ba = srand()*Math.PI*2, bd = srand()*h*0.55;
                        vx.fillStyle = `rgba(240,${140+(srand()*60|0)},${170+(srand()*40|0)},0.7)`;
                        vx.beginPath(); vx.arc(tx+Math.cos(ba)*bd, ty-h+Math.sin(ba)*bd*0.6, h*0.18+srand()*h*0.1, 0, Math.PI*2); vx.fill();
                    }
                };
                for (let i = 0; i < 8; i++) drawTree(srand()*GW, srand()*GH*0.85+GH*0.1, 35+srand()*30);
                // pagoda silhouettes
                const drawPagoda = (px3, py3, scale) => {
                    const floors = 3;
                    vx.fillStyle = 'rgba(80,20,10,0.7)';
                    for (let f = 0; f < floors; f++) {
                        const fw = (floors-f)*22*scale, fh = 12*scale, fy = py3 - f*18*scale;
                        vx.fillRect(px3-fw/2, fy-fh, fw, fh);
                        // roof flare
                        vx.beginPath(); vx.moveTo(px3-fw/2-6*scale, fy-fh);
                        vx.lineTo(px3, fy-fh-10*scale); vx.lineTo(px3+fw/2+6*scale, fy-fh); vx.fill();
                    }
                    // spire
                    vx.fillRect(px3-2*scale, py3-floors*18*scale-20*scale, 4*scale, 20*scale);
                };
                drawPagoda(120, 580, 1.0);
                drawPagoda(880, 200, 0.8);
                drawPagoda(550, 680, 0.7);
                // road shoulder — stone path
                vx.strokeStyle = '#c8a888'; vx.lineWidth = t.rw + 10;
                vx.lineCap = 'round'; vx.lineJoin = 'round'; vx.setLineDash([]);
                drawPath(vx, wp); vx.stroke();
                // road surface — terracotta
                vx.strokeStyle = '#d4907a'; vx.lineWidth = t.rw;
                drawPath(vx, wp); vx.stroke();
                // inner detail
                vx.strokeStyle = '#c8806a'; vx.lineWidth = t.rw - 12;
                drawPath(vx, wp); vx.stroke();
                // centre dashes — red
                vx.strokeStyle = '#cc2020'; vx.lineWidth = 1; vx.setLineDash([8, 14]);
                drawPath(vx, wp); vx.stroke(); vx.setLineDash([]);
                // mud as koi pond puddles
                t.mud.forEach(m => {
                    const g = vx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r);
                    g.addColorStop(0, 'rgba(60,100,160,0.8)'); g.addColorStop(1, 'rgba(40,80,140,0.1)');
                    vx.fillStyle = g; vx.beginPath(); vx.arc(m.x, m.y, m.r, 0, Math.PI * 2); vx.fill();
                    // koi dot
                    vx.fillStyle = 'rgba(255,80,0,0.7)';
                    vx.beginPath(); vx.arc(m.x+srand()*m.r*0.4, m.y+srand()*m.r*0.4, 3, 0, Math.PI*2); vx.fill();
                });

                // ── takeaway rice container with chopsticks (3× size) ──
                const rcx = GW / 2, rcy = GH / 2 - 40;
                vx.save(); vx.translate(rcx, rcy); vx.scale(3, 3); vx.rotate(-0.1);
                // container body — white
                const cg = vx.createLinearGradient(-16, -10, 16, -10);
                cg.addColorStop(0, '#e8e8e8'); cg.addColorStop(0.5, '#ffffff'); cg.addColorStop(1, '#e8e8e8');
                vx.fillStyle = cg;
                vx.beginPath();
                vx.moveTo(-14, 20); vx.lineTo(-18, -10); vx.lineTo(18, -10); vx.lineTo(14, 20);
                vx.closePath(); vx.fill();
                // container outline
                vx.strokeStyle = '#bbb'; vx.lineWidth = 0.6;
                vx.beginPath();
                vx.moveTo(-14, 20); vx.lineTo(-18, -10); vx.lineTo(18, -10); vx.lineTo(14, 20);
                vx.closePath(); vx.stroke();
                // wire handle
                vx.strokeStyle = '#888'; vx.lineWidth = 1.2;
                vx.beginPath(); vx.arc(0, -10, 14, Math.PI + 0.3, -0.3); vx.stroke();
                // red sign — "Lee's Takeaway"
                vx.fillStyle = '#cc1111';
                vx.fillRect(-13, -4, 26, 16);
                vx.fillStyle = '#fff'; vx.font = 'bold 5px sans-serif'; vx.textAlign = 'center';
                vx.fillText("LEE'S", 0, 3);
                vx.fillText("TAKEAWAY", 0, 9);
                // rice peeking out top
                for (let i = 0; i < 7; i++) {
                    vx.fillStyle = '#f5f0e0';
                    vx.beginPath(); vx.arc(-10 + i * 3.5, -11 - Math.sin(i * 1.2) * 2, 2.5, 0, Math.PI * 2); vx.fill();
                }
                // chopsticks sticking out
                vx.strokeStyle = '#c8a050'; vx.lineWidth = 2; vx.lineCap = 'round';
                vx.beginPath(); vx.moveTo(-2, -12); vx.lineTo(-10, -36); vx.stroke();
                vx.beginPath(); vx.moveTo(3, -12); vx.lineTo(8, -34); vx.stroke();
                // chopstick tips
                vx.strokeStyle = '#e8c878'; vx.lineWidth = 1.5;
                vx.beginPath(); vx.moveTo(-10, -36); vx.lineTo(-11, -39); vx.stroke();
                vx.beginPath(); vx.moveTo(8, -34); vx.lineTo(9, -37); vx.stroke();
                vx.restore();

                // ── opened fortune cookie with message (2× size) ──
                const fcx = 820, fcy = 520;
                vx.save(); vx.translate(fcx, fcy); vx.scale(2, 2); vx.rotate(0.15);
                // left half of cracked cookie
                vx.fillStyle = '#e8b84c';
                vx.beginPath();
                vx.moveTo(-18, 4); vx.quadraticCurveTo(-22, -8, -10, -12);
                vx.quadraticCurveTo(-2, -14, 0, -4);
                vx.quadraticCurveTo(-4, 2, -18, 4);
                vx.closePath(); vx.fill();
                // left half shadow
                vx.fillStyle = '#d0a030';
                vx.beginPath();
                vx.moveTo(-16, 2); vx.quadraticCurveTo(-18, -4, -10, -8);
                vx.quadraticCurveTo(-6, -9, -3, -3);
                vx.quadraticCurveTo(-6, 1, -16, 2);
                vx.closePath(); vx.fill();
                // right half of cracked cookie (slightly separated)
                vx.fillStyle = '#e8b84c';
                vx.beginPath();
                vx.moveTo(18, 4); vx.quadraticCurveTo(22, -8, 10, -12);
                vx.quadraticCurveTo(2, -14, 0, -4);
                vx.quadraticCurveTo(4, 2, 18, 4);
                vx.closePath(); vx.fill();
                // right half highlight
                vx.fillStyle = '#f0c860';
                vx.beginPath();
                vx.moveTo(14, 0); vx.quadraticCurveTo(16, -6, 10, -9);
                vx.quadraticCurveTo(6, -10, 3, -4);
                vx.quadraticCurveTo(5, -1, 14, 0);
                vx.closePath(); vx.fill();
                // fortune paper strip poking out
                vx.save(); vx.rotate(-0.08);
                vx.fillStyle = '#fff';
                vx.beginPath();
                vx.moveTo(-28, 2); vx.lineTo(28, -2); vx.lineTo(29, 4); vx.lineTo(-27, 8);
                vx.closePath(); vx.fill();
                // paper shadow
                vx.fillStyle = 'rgba(0,0,0,0.06)';
                vx.fillRect(-26, 4, 54, 3);
                // fortune text
                vx.fillStyle = '#cc1111'; vx.font = 'bold 4.5px serif'; vx.textAlign = 'center';
                vx.fillText("If you're not first", 0, 3);
                vx.fillText("you're last", 0, 8);
                vx.restore();
                // crumbs
                vx.fillStyle = '#d8a840';
                for (let i = 0; i < 5; i++) {
                    vx.beginPath();
                    vx.arc(-8 + srand() * 16, 6 + srand() * 8, 0.8 + srand() * 1.2, 0, Math.PI * 2);
                    vx.fill();
                }
                vx.restore();

            } else {
                // grass background with subtle patches
                vx.fillStyle = '#4a8a3a'; vx.fillRect(0, 0, GW, GH);
                for (let i = 0; i < 30; i++) {
                    const shade = 60 + (srand() * 30 | 0);
                    vx.fillStyle = `rgb(${shade},${shade + 50},${shade - 10})`;
                    vx.beginPath(); vx.arc(srand() * GW, srand() * GH, 20 + srand() * 60, 0, Math.PI * 2); vx.fill();
                }
                // road shoulder
                vx.strokeStyle = '#888'; vx.lineWidth = t.rw + 10;
                vx.lineCap = 'round'; vx.lineJoin = 'round';
                drawPath(vx, wp); vx.stroke();
                // road surface
                vx.strokeStyle = '#555'; vx.lineWidth = t.rw;
                drawPath(vx, wp); vx.stroke();
                // inner detail (subtle asphalt variation)
                vx.strokeStyle = '#5a5a5a'; vx.lineWidth = t.rw - 12;
                drawPath(vx, wp); vx.stroke();
                // centre dashes
                vx.strokeStyle = '#6a6a6a'; vx.lineWidth = 1; vx.setLineDash([8, 14]);
                drawPath(vx, wp); vx.stroke(); vx.setLineDash([]);
                // mud zones
                t.mud.forEach(m => {
                    const g = vx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r);
                    g.addColorStop(0, 'rgba(80,60,35,0.9)'); g.addColorStop(1, 'rgba(80,60,35,0.2)');
                    vx.fillStyle = g; vx.beginPath(); vx.arc(m.x, m.y, m.r, 0, Math.PI * 2); vx.fill();
                });
            }

            // start / finish line
            const s0 = wp[0], s1 = wp[1];
            const sa = Math.atan2(s1.y - s0.y, s1.x - s0.x);
            const pa = sa + Math.PI / 2;
            vx.save();
            vx.strokeStyle = synth ? '#2af0ff' : halloween ? '#ff6600' : soccer ? '#fff' : asian ? '#cc2020' : '#fff'; vx.lineWidth = 5;
            vx.beginPath();
            vx.moveTo(s0.x + Math.cos(pa) * t.rw / 2, s0.y + Math.sin(pa) * t.rw / 2);
            vx.lineTo(s0.x - Math.cos(pa) * t.rw / 2, s0.y - Math.sin(pa) * t.rw / 2);
            vx.stroke();
            // checkerboard
            for (let i = -3; i <= 3; i++) {
                vx.fillStyle = synth
                    ? (i % 2 === 0 ? '#ff2a6d' : '#2af0ff')
                    : halloween
                    ? (i % 2 === 0 ? '#c85000' : '#300030')
                    : soccer
                    ? (i % 2 === 0 ? '#fff' : '#1a6e1a')
                    : asian
                    ? (i % 2 === 0 ? '#cc2020' : '#ffd0d0')
                    : (i % 2 === 0 ? '#000' : '#fff');
                const bx = s0.x + Math.cos(pa) * i * (t.rw / 7);
                const by = s0.y + Math.sin(pa) * i * (t.rw / 7);
                vx.fillRect(bx - 3, by - 3, 6, 6);
            }
            vx.restore();

            // track name subtle watermark
            vx.fillStyle = synth ? 'rgba(255,42,109,0.7)' : halloween ? 'rgba(200,80,0,0.5)' : soccer ? 'rgba(0,80,0,0.35)' : asian ? 'rgba(160,30,30,0.45)' : 'rgba(0,0,0,0.25)'; vx.font = 'bold 13px monospace';
            vx.textAlign = 'left'; vx.fillText(t.name, 8, TH - 8);

            this.textures.addCanvas('tv_' + idx, vc);

            // ── collision map ──
            const cc = document.createElement('canvas'); cc.width = TW; cc.height = TH;
            const cx = cc.getContext('2d');
            cx.fillStyle = '#804000'; cx.fillRect(0, 0, TW, TH);
            cx.strokeStyle = '#00ff00'; cx.lineWidth = t.rw;
            cx.lineCap = 'round'; cx.lineJoin = 'round';
            drawPath(cx, wp); cx.stroke();
            t.mud.forEach(m => {
                cx.fillStyle = '#0000ff'; cx.beginPath(); cx.arc(m.x, m.y, m.r, 0, Math.PI * 2); cx.fill();
            });
            t.cpx = cx.getImageData(0, 0, TW, TH).data;

            // ── checkpoints at 1/4, 2/4, 3/4, 0 ──
            t.cks = [];
            for (let c = 0; c < 4; c++) {
                const ci = Math.floor(((c + 1) % 4 === 0 ? 0 : (c + 1) / 4) * wp.length) % wp.length;
                // 1/4, 2/4, 3/4, 0
                const realIdx = c < 3 ? Math.floor((c + 1) / 4 * wp.length) : 0;
                const pt = wp[realIdx];
                const ptN = wp[(realIdx + 1) % wp.length];
                t.cks.push({ x: pt.x, y: pt.y, a: Math.atan2(ptN.y - pt.y, ptN.x - pt.x) });
            }

            // ── start positions (staggered behind start line) ──
            t.starts = [];
            for (let s = 0; s < 4; s++) {
                const wi = (wp.length - 4 - s * 4 + wp.length) % wp.length;
                const p = wp[wi], pn = wp[(wi + 1) % wp.length];
                const a = Math.atan2(pn.y - p.y, pn.x - p.x);
                const perp = a + Math.PI / 2;
                const off = (s % 2 === 0 ? -1 : 1) * 10;
                t.starts.push({ x: p.x + Math.cos(perp) * off, y: p.y + Math.sin(perp) * off, a });
            }

            // ── pickups (deterministic placement using seeded random) ──
            t.pks = [];
            for (let p = 0; p < 5; p++) {
                const wi = Math.floor(srand() * wp.length);
                const pt = wp[wi];
                const ra = srand() * Math.PI * 2, rd = srand() * t.rw * 0.3;
                t.pks.push({ x: pt.x + Math.cos(ra) * rd, y: pt.y + Math.sin(ra) * rd, type: 'money', val: (1 + (srand() * 4 | 0)) * 10000 });
            }
            for (let p = 0; p < 3; p++) {
                const wi = Math.floor(srand() * wp.length);
                const pt = wp[wi];
                const ra = srand() * Math.PI * 2, rd = srand() * t.rw * 0.3;
                t.pks.push({ x: pt.x + Math.cos(ra) * rd, y: pt.y + Math.sin(ra) * rd, type: 'nitro' });
            }
        });
    }
}

// ── TITLE SCENE ─────────────────────────────────────────────
class TitleScene extends Phaser.Scene {
    constructor() { super('TitleScene'); }

    create() {
        this.cameras.main.setBackgroundColor('#000');

        // decorative track preview in background
        const tidx = Math.floor(Math.random() * TRACKS.length);
        if (this.textures.exists('tv_' + tidx)) {
            const bgT = TRACKS[tidx];
            const bgImg = this.add.image(GW / 2, GH / 2, 'tv_' + tidx).setAlpha(0.15);
            if ((bgT.W || GW) > GW || (bgT.H || GH) > GH) {
                bgImg.setDisplaySize(GW, GH);
            }
        }

        this.add.text(GW / 2, 150, 'SUPER OFF ROAD', {
            fontSize: '60px', fontFamily: 'monospace', color: '#FFD700',
            fontStyle: 'bold', stroke: '#6B3410', strokeThickness: 8,
        }).setOrigin(0.5);

        this.add.text(GW / 2, 225, 'Web Recreation', {
            fontSize: '22px', fontFamily: 'monospace', color: '#bbb',
        }).setOrigin(0.5);

        const lines = [
            ['CONTROLS', '#fff', '24px'],
            ['', '', '6px'],
            ['↑  Accelerate', '#aaa', '18px'],
            ['← →  Steer', '#aaa', '18px'],
            ['SPACE  Nitro Boost', '#ff6600', '18px'],
            ['', '', '10px'],
            ['Race 4 laps · Earn prize money', '#888', '16px'],
            ['Upgrade your truck at the Speed Shop', '#888', '16px'],
        ];
        let ly = 320;
        lines.forEach(([txt, col, sz]) => {
            if (txt) this.add.text(GW / 2, ly, txt, { fontSize: sz, fontFamily: 'monospace', color: col }).setOrigin(0.5);
            ly += parseInt(sz) + 8;
        });

        const pt = this.add.text(GW / 2, 620, 'PRESS ENTER TO START', {
            fontSize: '26px', fontFamily: 'monospace', color: '#fff',
        }).setOrigin(0.5);
        this.tweens.add({ targets: pt, alpha: 0.2, duration: 600, yoyo: true, repeat: -1 });

        const mapHint = this.add.text(GW / 2, 665, 'Triple-tap 1–9 to jump to a track  (e.g. 999 = NEON DRIVE)', {
            fontSize: '14px', fontFamily: 'monospace', color: '#555',
        }).setOrigin(0.5);

        // track display — updated as player types
        const mapSelect = this.add.text(GW / 2, 700, '', {
            fontSize: '20px', fontFamily: 'monospace', color: '#ff6600', fontStyle: 'bold',
        }).setOrigin(0.5);

        // triple-tap map select: collect up to 3 identical digits within 1.2 s
        let digitBuf = '';
        let digitTimer = null;
        const flushDigits = () => {
            digitBuf = '';
            mapSelect.setText('');
            digitTimer = null;
        };

        this.input.keyboard.on('keydown', (ev) => {
            const d = ev.key;
            if (d >= '1' && d <= '9') {
                if (digitBuf.length > 0 && d !== digitBuf[0]) {
                    // different digit — reset
                    digitBuf = d;
                } else {
                    digitBuf += d;
                }
                mapSelect.setText('TRACK SELECT: ' + digitBuf);
                if (digitTimer) clearTimeout(digitTimer);
                if (digitBuf.length === 3) {
                    // confirmed — jump to that track
                    const trackNum = parseInt(d);
                    gs = resetGameState();
                    gs.raceNum = trackNum - 1;
                    flushDigits();
                    this.scene.start('PlayerSelectScene');                } else {
                    digitTimer = setTimeout(flushDigits, 1200);
                }
            }
        });

        const startGame = () => {
            gs = resetGameState();
            this.scene.start('PlayerSelectScene');
        };
        this.input.keyboard.on('keydown-ENTER', startGame);
        this.input.keyboard.on('keydown-SPACE', startGame);
    }
}

// ── PLAYER SELECT SCENE ─────────────────────────────────────
class PlayerSelectScene extends Phaser.Scene {
    constructor() { super('PlayerSelectScene'); }

    create() {
        this.cameras.main.setBackgroundColor('#0a0a1a');
        this.sel = gs.playerIdx || 0;

        this.add.text(GW / 2, 80, 'CHOOSE YOUR DRIVER', {
            fontSize: '40px', fontFamily: 'monospace', color: '#FFD700',
            fontStyle: 'bold', stroke: '#6B3410', strokeThickness: 6,
        }).setOrigin(0.5);

        this.add.text(GW / 2, 135, '← →  to select  ·  ENTER to confirm', {
            fontSize: '18px', fontFamily: 'monospace', color: '#888',
        }).setOrigin(0.5);

        // layout: 4 characters evenly spaced
        const startX = GW / 2 - 1.5 * 180;
        const yAvatar = 350;
        const yName = 500;
        const spacing = 180;
        const avatarSize = 120;

        this.cards = [];
        for (let i = 0; i < 4; i++) {
            const cx = startX + i * spacing;

            // background card
            const bg = this.add.rectangle(cx, 400, 150, 240, 0x222244, 0.6)
                .setStrokeStyle(3, 0x444466);

            // avatar
            const img = this.add.image(cx, yAvatar, PLAYER_IMGS[i])
                .setDisplaySize(avatarSize, avatarSize);

            // name
            const name = this.add.text(cx, yName, NAMES[i], {
                fontSize: '22px', fontFamily: 'monospace', color: '#ccc',
                fontStyle: 'bold',
            }).setOrigin(0.5);

            this.cards.push({ bg, img, name, x: cx });
        }

        // highlight indicator
        this.highlight = this.add.rectangle(0, 400, 160, 250, 0x000000, 0)
            .setStrokeStyle(4, 0xFFD700).setDepth(5);

        // arrow indicators
        this.arrowL = this.add.text(startX - 100, 400, '◀', {
            fontSize: '48px', fontFamily: 'monospace', color: '#FFD700',
        }).setOrigin(0.5);
        this.arrowR = this.add.text(startX + 3 * spacing + 100, 400, '▶', {
            fontSize: '48px', fontFamily: 'monospace', color: '#FFD700',
        }).setOrigin(0.5);

        this.updateSelection();

        // controls
        this.input.keyboard.on('keydown-LEFT', () => {
            this.sel = (this.sel - 1 + 4) % 4;
            this.updateSelection();
        });
        this.input.keyboard.on('keydown-RIGHT', () => {
            this.sel = (this.sel + 1) % 4;
            this.updateSelection();
        });
        this.input.keyboard.on('keydown-ENTER', () => this.confirm());
        this.input.keyboard.on('keydown-SPACE', () => this.confirm());
    }

    updateSelection() {
        const card = this.cards[this.sel];
        this.highlight.setPosition(card.x, 400);
        this.cards.forEach((c, i) => {
            const active = i === this.sel;
            c.bg.setFillStyle(active ? 0x334488 : 0x222244, active ? 0.9 : 0.6);
            c.bg.setStrokeStyle(3, active ? 0xFFD700 : 0x444466);
            c.img.setAlpha(active ? 1.0 : 0.5);
            c.img.setDisplaySize(active ? 130 : 120, active ? 130 : 120);
            c.name.setColor(active ? '#FFD700' : '#888');
        });
        // pulse arrows based on edges
        this.arrowL.setAlpha(1);
        this.arrowR.setAlpha(1);
    }

    confirm() {
        gs.playerIdx = this.sel;
        // brief flash effect
        this.cameras.main.flash(300, 255, 215, 0);
        this.time.delayedCall(300, () => this.scene.start('RaceScene'));
    }
}

// ── RACE SCENE ──────────────────────────────────────────────
class RaceScene extends Phaser.Scene {
    constructor() { super('RaceScene'); }

    create() {
        const ti = gs.raceNum % TRACKS.length;
        this.td = TRACKS[ti];
        this.wp = this.td.wp;
        const TW = this.td.W, TH = this.td.H;
        this.isBig = TW > GW || TH > GH;

        // track background (positioned so top-left = world origin)
        this.add.image(TW / 2, TH / 2, 'tv_' + ti);

        // camera bounds & follow for multi-screen tracks
        this.cameras.main.setBounds(0, 0, TW, TH);

        // music: stop any previous track, play the one for this race
        this.sound.stopAll();
        const musicKey = 'music_' + (gs.raceNum % TRACK_MUSIC.length);
        if (this.cache.audio.exists(musicKey)) {
            this.sound.play(musicKey, { loop: true, volume: 0.5 });
        }

        // create trucks
        this.trucks = [];
        const charOrder = getCharOrder();
        for (let i = 0; i < 4; i++) {
            const sp = this.td.starts[i];
            const isP = i === 0;
            const ci = charOrder[i]; // character index
            const spriteKey = this.textures.exists(CAR_SPRITES[ci]) ? CAR_SPRITES[ci] : `truck_${TKEYS[i]}`;
            const t = {
                spr: this.add.sprite(sp.x, sp.y, spriteKey)
                    .setOrigin(0.5)
                    .setDepth(10 + i)
                    .setDisplaySize(TRUCK_W, TRUCK_H),
                x: sp.x, y: sp.y, a: sp.a, vx: 0, vy: 0,
                isP, name: NAMES[ci], col: CHAR_COLORS[ci], imgKey: PLAYER_IMGS[ci], idx: i,
                maxSpd: isP ? 3.0 + gs.topSpeed * 0.25 : 3.0 + Math.min(gs.raceNum * 0.06, 2.0),
                acc:    isP ? 0.06 + gs.acceleration * 0.008 : 0.06 + Math.min(gs.raceNum * 0.003, 0.04),
                hand:   isP ? 0.038 + gs.tires * 0.003 : 0.038 + Math.min(gs.raceNum * 0.001, 0.015),
                stab:   isP ? 0.85 + gs.shocks * 0.012 : 0.85 + Math.min(gs.raceNum * 0.004, 0.1),
                nitros: isP ? gs.nitros : 3 + Math.floor(gs.raceNum / 3),
                nAct: false, nTmr: 0,
                laps: 0, nxtCk: 0, fin: false, finPos: -1,
                tMult: 1.0,
                aiWp: Math.floor(this.td.wp.length * 0.96),
                aiDiff: isP ? 0 : 0.8 + i * 0.08 + Math.min(gs.raceNum * 0.025, 0.6),
                frozenTimer: 0,
            };
            this.syncSprite(t);
            this.trucks.push(t);
        }

        // pickups
        this.pkActive = this.td.pks.map((p, i) => ({ ...p, on: true, i }));
        this.pkSprites = this.pkActive.map(p => {
            const img = this.add.image(p.x, p.y, p.type === 'money' ? 'pk_money' : 'pk_nitro').setDepth(5);
            // gentle pulse & rotate for liveliness
            this.tweens.add({ targets: img, scale: { from: 1.0, to: 1.35 }, duration: 600, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
            if (p.type === 'nitro') {
                this.tweens.add({ targets: img, angle: 360, duration: 1600, repeat: -1 });
            }
            return img;
        });

        // soccer props: interactive balls + subbuteo figure
        this.soccerBalls = [];
        this.subbuteo = null;
        if (this.td.soccerBalls) {
            this.td.soccerBalls.forEach(b => {
                const gfx = this.add.graphics().setDepth(7);
                this.drawSoccerBallGfx(gfx, 0, 0, b.r);
                gfx.x = b.x; gfx.y = b.y;
                this.soccerBalls.push({ x: b.x, y: b.y, vx: 0, vy: 0, r: b.r, gfx, spin: 0 });
            });
        }
        if (this.td.subbuteo) {
            const sb = this.td.subbuteo;
            const gfx = this.add.graphics().setDepth(7);
            this.drawSubbuteoGfx(gfx, 0, 0);
            gfx.x = sb.x; gfx.y = sb.y;
            this.subbuteo = { x: sb.x, y: sb.y, gfx, tilt: 0, tiltVel: 0, baseY: sb.y };
        }

        // halloween ghost
        this.ghost = null;
        if (ti === 7) {
            const gfx = this.add.graphics().setDepth(20);
            this.ghost = {
                x: GW / 2, y: GH / 2, vx: 1.5, vy: 1.0,
                gfx, alpha: 0.85, wobble: 0, cooldown: 0,
            };
            this.drawGhostGfx(gfx, 0, 0);
        }

        // controls
        this.cur = this.input.keyboard.createCursorKeys();
        this.spc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // race state
        this.started = false; this.over = false;
        this.finOrder = []; this.raceTime = 0; this.endScheduled = false;

        // particles
        this.dust = [];

        // HUD
        this.buildHUD();

        // camera follow for multi-screen tracks
        if (this.isBig) {
            this.cameras.main.startFollow(this.trucks[0].spr, true, 0.12, 0.12);
        }

        // countdown — pinned to viewport
        this.cdTxt = this.add.text(GW / 2, GH / 2 - 60, '3', {
            fontSize: '72px', fontFamily: 'monospace', color: '#ff0000',
            fontStyle: 'bold', stroke: '#000', strokeThickness: 5,
        }).setOrigin(0.5).setDepth(100).setScrollFactor(0);

        SFX.countdownBeep(false); // '3' beep

        this.time.delayedCall(1000, () => {
            this.cdTxt.setText('2'); SFX.countdownBeep(false);
            this.time.delayedCall(1000, () => {
                this.cdTxt.setText('1'); SFX.countdownBeep(false);
                this.time.delayedCall(1000, () => {
                    this.cdTxt.setText('GO!').setColor('#00ff00');
                    SFX.countdownBeep(true);
                    SFX.engineStart();
                    this.started = true;
                    this.time.delayedCall(600, () => this.cdTxt.destroy());
                });
            });
        });
    }

    buildHUD() {
        const bar = this.add.rectangle(GW / 2, 22, GW, 44, 0x111111, 0.88).setDepth(50).setScrollFactor(0);
        const s = { fontSize: '15px', fontFamily: 'monospace', color: '#fff' };
        this.hPos = this.add.text(16, 8, 'POS: 1st', s).setDepth(51).setScrollFactor(0);
        this.hLap = this.add.text(150, 8, 'LAP: 1/4', s).setDepth(51).setScrollFactor(0);
        this.hMon = this.add.text(300, 8, '$200,000', { ...s, color: '#FFD700' }).setDepth(51).setScrollFactor(0);
        this.hNit = this.add.text(480, 8, 'NITRO: 3', { ...s, color: '#ff6600' }).setDepth(51).setScrollFactor(0);
        this.hRce = this.add.text(640, 8, `RACE ${gs.raceNum + 1}`, { ...s, color: '#aaa' }).setDepth(51).setScrollFactor(0);
        // speed meter bar
        this.hSpdLbl = this.add.text(780, 8, 'SPD', s).setDepth(51).setScrollFactor(0);
        this.hSpdBg = this.add.rectangle(820, 18, 90, 10, 0x222222, 0.8).setOrigin(0, 0.5).setDepth(50).setScrollFactor(0);
        this.hSpdFill = this.add.rectangle(820, 18, 0, 8, 0x00ff88, 1).setOrigin(0, 0.5).setDepth(51).setScrollFactor(0);
        this.hBoard = [];
        const pad = 10, imgSz = 30, rowH = 42, fontSize = '28px';
        const bw = 300, bh = pad + 4 * rowH + pad, bx = GW - bw - pad, by = 46;
        this.add.rectangle(bx + bw / 2, by + bh / 2, bw, bh, 0x111111, 0.85).setDepth(50).setOrigin(0.5).setScrollFactor(0);
        for (let i = 0; i < 4; i++) {
            const ry = by + pad + i * rowH;
            const img = this.add.image(bx + pad + imgSz / 2, ry + rowH / 2, this.trucks[i].imgKey).setDepth(51).setDisplaySize(imgSz, imgSz).setScrollFactor(0);
            const nameTxt = this.add.text(bx + pad + imgSz + 8, ry + rowH / 2, '', { fontSize, fontFamily: 'monospace', color: '#ccc' }).setDepth(51).setOrigin(0, 0.5).setScrollFactor(0);
            const posTxt = this.add.text(bx + bw - pad, ry + rowH / 2, '', { fontSize, fontFamily: 'monospace', color: '#ccc' }).setDepth(51).setOrigin(1, 0.5).setScrollFactor(0);
            this.hBoard.push({ img, nameTxt, posTxt });
        }

        // mini-map for multi-screen tracks
        if (this.isBig) {
            const mw = 140, mh = Math.round(mw * this.td.H / this.td.W);
            const mx = GW - mw - 12, my = GH - mh - 12;
            this.miniBg = this.add.rectangle(mx, my, mw, mh, 0x000022, 0.7).setOrigin(0, 0).setDepth(50).setScrollFactor(0).setStrokeStyle(2, 0xff2a6d, 0.9);
            this.miniG = this.add.graphics().setDepth(51).setScrollFactor(0);
            this.miniX = mx; this.miniY = my; this.miniW = mw; this.miniH = mh;
            // draw static track path
            this.miniG.lineStyle(2, 0x2af0ff, 0.8);
            this.miniG.beginPath();
            const wp = this.td.wp;
            for (let i = 0; i < wp.length; i++) {
                const sx = mx + wp[i].x / this.td.W * mw;
                const sy = my + wp[i].y / this.td.H * mh;
                i === 0 ? this.miniG.moveTo(sx, sy) : this.miniG.lineTo(sx, sy);
            }
            this.miniG.closePath(); this.miniG.strokePath();
        }
    }

    update(time, delta) {
        if (!this.started || this.over) return;
        const dt = Math.min(delta / 16.67, 3); // cap dt to prevent tunnelling
        this.raceTime += delta;

        // update trucks
        this.trucks.forEach(t => {
            if (t.fin) { this.syncSprite(t); return; }
            // frozen state — tick down, skip driving
            if (t.frozenTimer > 0) {
                t.frozenTimer -= delta;
                t.vx *= 0.9; t.vy *= 0.9; // skid to halt
                if (t.frozenTimer <= 0) {
                    t.frozenTimer = 0;
                    t.spr.clearTint();
                }
                t.x += t.vx * dt; t.y += t.vy * dt;
                t.x = Phaser.Math.Clamp(t.x, 8, this.td.W - 8);
                t.y = Phaser.Math.Clamp(t.y, 8, this.td.H - 8);
                this.syncSprite(t);
                return;
            }
            if (t.isP) this.drivePlayer(t, dt);
            else this.driveAI(t, dt);
            this.physics(t, dt);
            this.checkCks(t);
            if (t.isP) this.checkPks(t);
            this.syncSprite(t);
        });

        this.updateDust(dt);
        if (this.soccerBalls.length > 0 || this.subbuteo) this.updateSoccerProps(dt);
        if (this.ghost) this.updateGhost(dt, delta);
        this.calcPositions();
        this.drawHUD();

        // end race check
        if (!this.endScheduled && (this.finOrder.length >= 4 || this.finOrder.some(t => t.isP))) {
            this.endScheduled = true;
            this.time.delayedCall(2000, () => this.endRace());
        }
    }

    drivePlayer(t, dt) {
        const spd = Math.hypot(t.vx, t.vy);
        const sf = Math.min(1, spd / (t.maxSpd * 0.6 + 0.01));
        // more responsive steering at low speed, tighter at high speed
        const steer = t.hand * dt * (0.55 + 0.55 * sf);
        if (this.cur.left.isDown) t.a -= steer;
        if (this.cur.right.isDown) t.a += steer;

        if (this.cur.up.isDown) {
            const am = t.nAct ? 1.8 : 1.0;
            t.vx += Math.cos(t.a) * t.acc * am * t.tMult * dt;
            t.vy += Math.sin(t.a) * t.acc * am * t.tMult * dt;
        }
        // brake / reverse with DOWN — more responsive controls
        if (this.cur.down.isDown) {
            const dx = Math.cos(t.a), dy = Math.sin(t.a);
            const fwd = t.vx * dx + t.vy * dy;
            if (fwd > 0) {
                // braking
                t.vx *= Math.pow(0.88, dt);
                t.vy *= Math.pow(0.88, dt);
            } else {
                // reverse
                t.vx -= dx * t.acc * 0.5 * dt;
                t.vy -= dy * t.acc * 0.5 * dt;
            }
        }

        // engine SFX
        SFX.engineUpdate(Math.hypot(t.vx, t.vy), t.maxSpd, this.cur.up.isDown);

        if (Phaser.Input.Keyboard.JustDown(this.spc) && t.nitros > 0 && !t.nAct) {
            t.nAct = true; t.nitros--; gs.nitros = t.nitros; t.nTmr = 90;
            this.nitroFX(t);
            SFX.nitro();
            // punchy camera shake + flash
            this.cameras.main.shake(180, 0.008);
            this.cameras.main.flash(120, 255, 120, 40, true);
        }

        // speed lines at high velocity (only player, on-screen effect)
        if (spd > t.maxSpd * 0.85 && Math.random() < 0.5) this.spawnSpeedLine(t);
    }

    driveAI(t, dt) {
        const tgt = this.wp[t.aiWp];
        const ta = Math.atan2(tgt.y - t.y, tgt.x - t.x);
        let ad = ta - t.a;
        while (ad > Math.PI) ad -= Math.PI * 2;
        while (ad < -Math.PI) ad += Math.PI * 2;
        const ss = t.hand * t.aiDiff * dt;
        if (ad < -0.05) t.a -= Math.min(ss, -ad);
        else if (ad > 0.05) t.a += Math.min(ss, ad);

        const am = t.nAct ? 1.8 : 1.0;
        t.vx += Math.cos(t.a) * t.acc * am * t.aiDiff * t.tMult * dt;
        t.vy += Math.sin(t.a) * t.acc * am * t.aiDiff * t.tMult * dt;

        if (dist(t, tgt) < WP_DIST) t.aiWp = (t.aiWp + 1) % this.wp.length;

        // rubber-banding
        const pl = this.trucks[0];
        const pp = pl.laps * 1000 + pl.nxtCk * 250;
        const ap = t.laps * 1000 + t.nxtCk * 250;
        if (ap > pp + 400) t.aiDiff = Math.max(0.55, t.aiDiff - 0.0008 * dt);
        else if (ap < pp - 300) t.aiDiff = Math.min(1.45, t.aiDiff + 0.001 * dt);

        // AI nitro
        if (t.nitros > 0 && !t.nAct && ((ap < pp && Math.random() < 0.004) || Math.random() < 0.0008)) {
            t.nAct = true; t.nitros--; t.nTmr = 90;
        }
    }

    physics(t, dt) {
        // nitro timer
        if (t.nAct) {
            t.nTmr -= dt;
            if (t.nTmr <= 0) t.nAct = false;
            // continuous flame trail while active
            if (Math.random() < 0.7) this.nitroFX(t);
        }

        // decompose velocity
        const fx = Math.cos(t.a), fy = Math.sin(t.a);
        const rx = -Math.sin(t.a), ry = Math.cos(t.a);
        const fwd = t.vx * fx + t.vy * fy;
        const lat = t.vx * rx + t.vy * ry;

        // sharp skidding — leave tire marks when there's real lateral velocity
        if (t.isP && Math.abs(lat) > 1.0 && Math.hypot(t.vx, t.vy) > 1.2) {
            this.spawnSkid(t);
        }

        const latFric = Math.pow(t.stab, dt);
        const fwdFric = Math.pow(0.994, dt);
        const nf = fwd * fwdFric, nl = lat * latFric;
        t.vx = nf * fx + nl * rx;
        t.vy = nf * fy + nl * ry;

        // speed clamp
        const spd = Math.hypot(t.vx, t.vy);
        const eMax = (t.nAct ? t.maxSpd * 1.5 : t.maxSpd) * t.tMult;
        if (spd > eMax) { const s = eMax / spd; t.vx *= s; t.vy *= s; }

        const nx = t.x + t.vx * dt, ny = t.y + t.vy * dt;

        // terrain
        const ter = this.terrain(nx, ny);
        switch (ter) {
            case 'road': t.tMult = 1.0; break;
            case 'mud':  t.tMult = 0.45; break;
            case 'offroad':
                t.tMult = 0.55;
                if (spd > 0.5 && Math.random() < 0.25) this.spawnDust(t.x, t.y);
                break;
        }

        // boundary
        t.x = Phaser.Math.Clamp(nx, 8, this.td.W - 8);
        t.y = Phaser.Math.Clamp(ny, 8, this.td.H - 8);

        // truck-truck collisions
        for (const o of this.trucks) {
            if (o === t) continue;
            const d = dist(t, o);
            if (d < TS * 2 && d > 0.1) {
                const push = (TS * 2 - d) * 0.3;
                const dnx = (o.x - t.x) / d, dny = (o.y - t.y) / d;
                t.x -= dnx * push * 0.5; t.y -= dny * push * 0.5;
                o.x += dnx * push * 0.5; o.y += dny * push * 0.5;
                t.vx -= dnx * push * 0.08; t.vy -= dny * push * 0.08;
                o.vx += dnx * push * 0.08; o.vy += dny * push * 0.08;
            }
        }
    }

    terrain(x, y) {
        const px = this.td.cpx;
        const TW = this.td.W, TH = this.td.H;
        const ix = Math.floor(x), iy = Math.floor(y);
        if (ix < 0 || ix >= TW || iy < 0 || iy >= TH) return 'offroad';
        const i = (iy * TW + ix) * 4;
        if (px[i + 1] > 200 && px[i] < 100 && px[i + 2] < 100) return 'road';
        if (px[i + 2] > 200 && px[i] < 100 && px[i + 1] < 100) return 'mud';
        return 'offroad';
    }

    syncSprite(t) {
        t.spr.x = t.x; t.spr.y = t.y;
        if (t.spr.texture && (t.spr.texture.key.startsWith('kenney_car_') || t.spr.texture.key.startsWith('car_'))) {
            // Kenney cars face up by default; gameplay heading angle 0 points right.
            t.spr.setRotation(t.a + Math.PI / 2);
            return;
        }
        let deg = Phaser.Math.RadToDeg(t.a);
        deg = ((deg % 360) + 360) % 360;
        t.spr.setFrame(Math.round(deg / (360 / ROT_FRAMES)) % ROT_FRAMES);
    }

    checkCks(t) {
        if (t.fin) return;
        const ck = this.td.cks[t.nxtCk];
        if (dist(t, ck) < CP_DIST) {
            t.nxtCk++;
            if (t.nxtCk >= this.td.cks.length) {
                t.nxtCk = 0; t.laps++;
                if (t.laps >= TOTAL_LAPS) {
                    t.fin = true; t.finPos = this.finOrder.length;
                    this.finOrder.push(t);
                    if (t.isP) {
                        const lbl = ['1st', '2nd', '3rd', '4th'][t.finPos];
                        this.add.text(GW / 2, GH / 2, lbl + ' PLACE!', {
                            fontSize: '48px', fontFamily: 'monospace',
                            color: t.finPos === 0 ? '#FFD700' : '#fff',
                            fontStyle: 'bold', stroke: '#000', strokeThickness: 5,
                        }).setOrigin(0.5).setDepth(100).setScrollFactor(0);
                        this.cameras.main.flash(400, 255, 215, 0);
                    }
                }
            }
        }
    }

    checkPks(t) {
        this.pkActive.forEach((p, i) => {
            if (!p.on) return;
            if (dist(t, p) < PICKUP_R + TS) {
                p.on = false; this.pkSprites[i].setVisible(false);
                if (p.type === 'money') {
                    gs.money += p.val;
                    this.floatTxt(p.x, p.y, '+$' + p.val.toLocaleString(), '#FFD700');
                    SFX.pickupMoney();
                } else {
                    t.nitros++; gs.nitros = t.nitros;
                    this.floatTxt(p.x, p.y, '+1 NITRO', '#ff6600');
                    SFX.pickupNitro();
                }
            }
        });
    }

    floatTxt(x, y, txt, col) {
        const ft = this.add.text(x, y, txt, {
            fontSize: '14px', fontFamily: 'monospace', color: col,
            fontStyle: 'bold', stroke: '#000', strokeThickness: 2,
        }).setOrigin(0.5).setDepth(90);
        this.tweens.add({ targets: ft, y: y - 40, alpha: 0, duration: 1000, onComplete: () => ft.destroy() });
    }

    spawnDust(x, y) {
        const d = this.add.circle(x + (Math.random() - 0.5) * 10, y + (Math.random() - 0.5) * 10,
            2 + Math.random() * 3, 0x998877, 0.5).setDepth(4);
        d._life = 30; this.dust.push(d);
    }

    // thin streaks behind the player showing speed
    spawnSpeedLine(t) {
        const bx = t.x - Math.cos(t.a) * TS * 1.4, by = t.y - Math.sin(t.a) * TS * 1.4;
        const color = this.td.synth ? 0x2af0ff : 0xffffff;
        const l = this.add.rectangle(bx, by, 8 + Math.random() * 10, 1.5, color, 0.8).setDepth(4);
        l.setRotation(t.a);
        l._life = 14; this.dust.push(l);
    }

    // tire skid marks on sharp turns
    spawnSkid(t) {
        const rx = -Math.sin(t.a), ry = Math.cos(t.a);
        const off = TS * 0.5;
        const color = this.td.synth ? 0x220033 : 0x111111;
        for (const s of [-1, 1]) {
            const sx = t.x + rx * off * s, sy = t.y + ry * off * s;
            const m = this.add.rectangle(sx, sy, 3, 3, color, 0.4).setDepth(2);
            m._life = 120; this.dust.push(m);
        }
    }

    nitroFX(t) {
        for (let i = 0; i < 12; i++) {
            const bx = t.x - Math.cos(t.a) * TS, by = t.y - Math.sin(t.a) * TS;
            // layered hot colours: cyan/yellow/orange/red for flame effect
            const col = this.td.synth
                ? [0x2af0ff, 0xff2a6d, 0xffee00, 0xff66cc][i % 4]
                : [0xffee00, 0xff8800, 0xff4400, 0xcc0000][i % 4];
            const fl = this.add.circle(bx + (Math.random() - 0.5) * 12, by + (Math.random() - 0.5) * 12,
                2 + Math.random() * 5, col, 0.95).setDepth(3);
            fl._life = 10 + Math.random() * 20; this.dust.push(fl);
        }
    }

    updateDust(dt) {
        for (let i = this.dust.length - 1; i >= 0; i--) {
            const p = this.dust[i]; p._life -= dt;
            const maxLife = p._maxLife || 30;
            if (!p._maxLife) p._maxLife = Math.max(30, p._life + dt);
            p.setAlpha(Math.max(0, p._life / p._maxLife));
            if (p._life <= 0) { p.destroy(); this.dust.splice(i, 1); }
        }
    }

    // ── Soccer ball graphics ──
    drawSoccerBallGfx(gfx, cx, cy, r) {
        gfx.clear();
        // white base
        gfx.fillStyle(0xffffff, 1); gfx.fillCircle(cx, cy, r);
        // centre pentagon (dark)
        gfx.fillStyle(0x222222, 1);
        gfx.beginPath();
        for (let p = 0; p < 5; p++) {
            const a = (p / 5) * Math.PI * 2 - Math.PI / 2;
            const px2 = cx + Math.cos(a) * r * 0.35;
            const py2 = cy + Math.sin(a) * r * 0.35;
            p === 0 ? gfx.moveTo(px2, py2) : gfx.lineTo(px2, py2);
        }
        gfx.closePath(); gfx.fillPath();
        // outer pentagons
        for (let p = 0; p < 5; p++) {
            const a = (p / 5) * Math.PI * 2 - Math.PI / 2;
            const ox = cx + Math.cos(a) * r * 0.72;
            const oy = cy + Math.sin(a) * r * 0.72;
            gfx.beginPath();
            for (let q = 0; q < 5; q++) {
                const a2 = (q / 5) * Math.PI * 2 - Math.PI / 2;
                const px2 = ox + Math.cos(a2) * r * 0.25;
                const py2 = oy + Math.sin(a2) * r * 0.25;
                q === 0 ? gfx.moveTo(px2, py2) : gfx.lineTo(px2, py2);
            }
            gfx.closePath(); gfx.fillPath();
        }
        // outline
        gfx.lineStyle(r * 0.1, 0x333333, 1);
        gfx.strokeCircle(cx, cy, r);
    }

    // ── Subbuteo figure graphics ──
    drawSubbuteoGfx(gfx, cx, cy) {
        gfx.clear();
        // dome base
        gfx.fillStyle(0x1a1a1a, 1);
        gfx.fillEllipse(cx, cy + 12, 24, 10);
        gfx.fillStyle(0x222222, 1);
        gfx.fillEllipse(cx, cy + 10, 22, 8);
        // rod / peg
        gfx.fillStyle(0x333333, 1);
        gfx.fillRect(cx - 1.5, cy - 2, 3, 14);
        // body (blue shirt)
        gfx.fillStyle(0x1a4fc4, 1);
        gfx.fillRect(cx - 5, cy - 10, 10, 10);
        // white shorts
        gfx.fillStyle(0xffffff, 1);
        gfx.fillRect(cx - 4, cy, 8, 4);
        // legs
        gfx.fillStyle(0xe8c090, 1);
        gfx.fillRect(cx - 3, cy + 4, 2.5, 5);
        gfx.fillRect(cx + 0.5, cy + 4, 2.5, 5);
        // boots
        gfx.fillStyle(0x111111, 1);
        gfx.fillRect(cx - 3, cy + 9, 3, 2);
        gfx.fillRect(cx + 0.5, cy + 9, 3, 2);
        // head
        gfx.fillStyle(0xe8c090, 1);
        gfx.fillCircle(cx, cy - 13, 4);
        // hair
        gfx.fillStyle(0x3a2a1a, 1);
        gfx.beginPath(); gfx.arc(cx, cy - 14.5, 3.5, Math.PI, Math.PI * 2); gfx.closePath(); gfx.fillPath();
    }

    // ── Soccer ball & subbuteo collision + physics ──
    updateSoccerProps(dt) {
        const BALL_FRIC = 0.97;
        const BALL_BOUNCE = 0.7;
        const SUB_RADIUS = 14;

        // update soccer balls
        this.soccerBalls.forEach(b => {
            // truck-ball collisions
            this.trucks.forEach(t => {
                const d = Math.hypot(t.x - b.x, t.y - b.y);
                if (d < b.r + TS && d > 0.1) {
                    const nx = (b.x - t.x) / d, ny = (b.y - t.y) / d;
                    // push ball out of truck
                    const overlap = b.r + TS - d;
                    b.x += nx * overlap;
                    b.y += ny * overlap;
                    // pool-ball velocity transfer
                    const truckSpd = Math.hypot(t.vx, t.vy);
                    const impactDot = t.vx * nx + t.vy * ny;
                    const transferFactor = Math.max(impactDot, truckSpd * 0.3);
                    b.vx += nx * transferFactor * 1.8;
                    b.vy += ny * transferFactor * 1.8;
                    // slight deflection to truck
                    t.vx -= nx * transferFactor * 0.15;
                    t.vy -= ny * transferFactor * 0.15;
                    b.spin = (t.vx * ny - t.vy * nx) * 0.3;
                    SFX.ballKick();
                }
            });

            // ball-ball collisions (pool style)
            this.soccerBalls.forEach(b2 => {
                if (b2 === b) return;
                const d = Math.hypot(b.x - b2.x, b.y - b2.y);
                const minD = b.r + b2.r;
                if (d < minD && d > 0.1) {
                    const nx = (b2.x - b.x) / d, ny = (b2.y - b.y) / d;
                    const overlap = minD - d;
                    b.x -= nx * overlap * 0.5;
                    b.y -= ny * overlap * 0.5;
                    b2.x += nx * overlap * 0.5;
                    b2.y += ny * overlap * 0.5;
                    // elastic collision along normal
                    const relVn = (b.vx - b2.vx) * nx + (b.vy - b2.vy) * ny;
                    if (relVn > 0) {
                        b.vx -= relVn * nx * 0.5;
                        b.vy -= relVn * ny * 0.5;
                        b2.vx += relVn * nx * 0.5;
                        b2.vy += relVn * ny * 0.5;
                    }
                }
            });

            // physics
            b.vx *= Math.pow(BALL_FRIC, dt);
            b.vy *= Math.pow(BALL_FRIC, dt);
            b.spin *= Math.pow(0.95, dt);
            b.x += b.vx * dt;
            b.y += b.vy * dt;

            // boundary bounce
            if (b.x < b.r) { b.x = b.r; b.vx = Math.abs(b.vx) * BALL_BOUNCE; }
            if (b.x > GW - b.r) { b.x = GW - b.r; b.vx = -Math.abs(b.vx) * BALL_BOUNCE; }
            if (b.y < b.r) { b.y = b.r; b.vy = Math.abs(b.vy) * BALL_BOUNCE; }
            if (b.y > GH - b.r) { b.y = GH - b.r; b.vy = -Math.abs(b.vy) * BALL_BOUNCE; }

            // update graphics
            b.gfx.x = b.x;
            b.gfx.y = b.y;
            b.gfx.rotation += b.spin * dt * 0.1;
        });

        // update subbuteo figure
        if (this.subbuteo) {
            const sb = this.subbuteo;
            // truck-subbuteo collisions
            this.trucks.forEach(t => {
                const d = Math.hypot(t.x - sb.x, t.y - sb.y);
                if (d < SUB_RADIUS + TS && d > 0.1) {
                    const nx = (sb.x - t.x) / d;
                    // push figure slightly
                    const overlap = SUB_RADIUS + TS - d;
                    sb.x += nx * overlap * 0.3;
                    // determine tilt direction from impact
                    const impactSide = (t.x < sb.x) ? 1 : -1;
                    const truckSpd = Math.hypot(t.vx, t.vy);
                    sb.tiltVel += impactSide * Math.min(truckSpd * 0.15, 0.6);
                    // slight truck deflection
                    t.vx *= 0.92; t.vy *= 0.92;
                    SFX.subbuteoHit();
                }
            });

            // spring-damper wobble physics (like real subbuteo weighted base)
            const SPRING = 0.12;   // restoring force
            const DAMPING = 0.92;  // energy loss per frame
            const MAX_TILT = 0.7;  // max tilt angle in radians (~40 degrees)

            sb.tiltVel += -sb.tilt * SPRING * dt;
            sb.tiltVel *= Math.pow(DAMPING, dt);
            sb.tilt += sb.tiltVel * dt;
            sb.tilt = Phaser.Math.Clamp(sb.tilt, -MAX_TILT, MAX_TILT);

            // snap to rest when nearly still
            if (Math.abs(sb.tilt) < 0.005 && Math.abs(sb.tiltVel) < 0.005) {
                sb.tilt = 0; sb.tiltVel = 0;
            }

            sb.gfx.x = sb.x;
            sb.gfx.y = sb.baseY;
            sb.gfx.rotation = sb.tilt;
        }
    }

    // ── Halloween ghost ──
    drawGhostGfx(gfx, cx, cy) {
        gfx.clear();
        // ghostly glow
        gfx.fillStyle(0xffffff, 0.15);
        gfx.fillCircle(cx, cy - 4, 20);
        // main body
        gfx.fillStyle(0xeeeeff, 0.85);
        gfx.beginPath();
        gfx.moveTo(cx - 12, cy + 10);
        gfx.lineTo(cx - 14, cy - 4);
        gfx.arc(cx, cy - 8, 14, Math.PI, 0, false);
        gfx.lineTo(cx + 14, cy - 4);
        gfx.lineTo(cx + 12, cy + 10);
        // wavy bottom
        gfx.lineTo(cx + 8, cy + 6);
        gfx.lineTo(cx + 4, cy + 12);
        gfx.lineTo(cx, cy + 7);
        gfx.lineTo(cx - 4, cy + 12);
        gfx.lineTo(cx - 8, cy + 6);
        gfx.closePath();
        gfx.fillPath();
        // eyes
        gfx.fillStyle(0x111133, 1);
        gfx.fillEllipse(cx - 5, cy - 8, 5, 6);
        gfx.fillEllipse(cx + 5, cy - 8, 5, 6);
        // pupils
        gfx.fillStyle(0x4444ff, 1);
        gfx.fillCircle(cx - 5, cy - 7, 1.5);
        gfx.fillCircle(cx + 5, cy - 7, 1.5);
        // open mouth
        gfx.fillStyle(0x222244, 0.8);
        gfx.fillEllipse(cx, cy - 1, 5, 4);
    }

    updateGhost(dt, deltaMs) {
        const g = this.ghost;
        const GHOST_SPD = 1.8;
        const GHOST_R = 16;
        const FREEZE_MS = 2000;

        g.wobble += dt * 0.15;
        if (g.cooldown > 0) g.cooldown -= deltaMs;

        // drift towards nearest non-frozen truck
        let closest = null, closestD = Infinity;
        this.trucks.forEach(t => {
            if (t.fin || t.frozenTimer > 0) return;
            const d = dist(g, t);
            if (d < closestD) { closestD = d; closest = t; }
        });

        if (closest) {
            const dx = closest.x - g.x, dy = closest.y - g.y;
            const d = Math.hypot(dx, dy) || 1;
            // steer towards target with some wobble
            g.vx += (dx / d * GHOST_SPD - g.vx) * 0.03 * dt;
            g.vy += (dy / d * GHOST_SPD - g.vy) * 0.03 * dt;
        }

        // add sinusoidal drift for spooky floating movement
        g.vx += Math.sin(g.wobble * 3.1) * 0.02 * dt;
        g.vy += Math.cos(g.wobble * 2.7) * 0.02 * dt;

        // clamp speed
        const spd = Math.hypot(g.vx, g.vy);
        if (spd > GHOST_SPD) {
            g.vx = g.vx / spd * GHOST_SPD;
            g.vy = g.vy / spd * GHOST_SPD;
        }

        g.x += g.vx * dt;
        g.y += g.vy * dt;

        // boundary wrap
        if (g.x < -20) g.x = GW + 20;
        if (g.x > GW + 20) g.x = -20;
        if (g.y < -20) g.y = GH + 20;
        if (g.y > GH + 20) g.y = -20;

        // collision with trucks — freeze on contact
        if (g.cooldown <= 0) {
            this.trucks.forEach(t => {
                if (t.fin || t.frozenTimer > 0) return;
                if (dist(g, t) < GHOST_R + TS) {
                    t.frozenTimer = FREEZE_MS;
                    t.spr.setTint(0x88bbff); // icy blue tint
                    g.cooldown = 1500; // ghost can't freeze again immediately
                    SFX.ghostFreeze();
                    // ghost bounces away
                    const dx = g.x - t.x, dy = g.y - t.y;
                    const d = Math.hypot(dx, dy) || 1;
                    g.vx = dx / d * GHOST_SPD * 1.5;
                    g.vy = dy / d * GHOST_SPD * 1.5;
                    // ice particles
                    if (t.isP) {
                        this.floatTxt(t.x, t.y - 20, '❄ FROZEN! ❄', '#88bbff');
                    }
                }
            });
        }

        // update graphics position + bobbing
        g.gfx.x = g.x;
        g.gfx.y = g.y + Math.sin(g.wobble * 4) * 3;
        g.gfx.alpha = 0.7 + Math.sin(g.wobble * 5) * 0.15;
        g.gfx.scaleX = 1 + Math.sin(g.wobble * 3) * 0.05;
    }

    calcPositions() {
        const sorted = this.trucks.map((t, i) => {
            const prog = t.laps * 10000 + t.nxtCk * 2500 + (t.nxtCk < this.td.cks.length ? (2500 - dist(t, this.td.cks[t.nxtCk])) : 0);
            return { i, prog, fin: t.fin, fp: t.finPos };
        });
        sorted.sort((a, b) => {
            if (a.fin !== b.fin) return a.fin ? -1 : 1;
            if (a.fin && b.fin) return a.fp - b.fp;
            return b.prog - a.prog;
        });
        this.posOrder = sorted.map(s => s.i);
    }

    drawHUD() {
        const pi = this.posOrder ? this.posOrder.indexOf(0) : 0;
        const pl = ['1st', '2nd', '3rd', '4th'];
        const t0 = this.trucks[0];
        this.hPos.setText('POS: ' + pl[pi]);
        this.hLap.setText('LAP: ' + Math.min(t0.laps + 1, TOTAL_LAPS) + '/' + TOTAL_LAPS);
        this.hMon.setText('$' + gs.money.toLocaleString());
        this.hNit.setText('NITRO: ' + t0.nitros + (t0.nAct ? ' 🔥' : ''));
        // speed meter
        const spd = Math.hypot(t0.vx, t0.vy);
        const ratio = Math.min(1, spd / ((t0.nAct ? t0.maxSpd * 1.5 : t0.maxSpd) + 0.001));
        this.hSpdFill.width = 90 * ratio;
        const col = ratio > 0.9 ? 0xff2a6d : ratio > 0.6 ? 0xffcc00 : 0x00ff88;
        this.hSpdFill.fillColor = col;
        if (this.posOrder) {
            this.hBoard.forEach((entry, i) => {
                const ti = this.posOrder[i];
                const tk = this.trucks[ti];
                entry.img.setTexture(tk.imgKey);
                entry.nameTxt.setText(tk.name).setColor(hexCSS(tk.col));
                entry.posTxt.setText(pl[i]).setColor(hexCSS(tk.col));
            });
        }

        // update mini-map truck dots
        if (this.miniG && this.isBig) {
            // redraw dots only (preserve path by accumulating — cheaper: full redraw)
            this.miniG.clear();
            this.miniG.lineStyle(2, 0x2af0ff, 0.8);
            this.miniG.beginPath();
            const wp = this.td.wp;
            for (let i = 0; i < wp.length; i++) {
                const sx = this.miniX + wp[i].x / this.td.W * this.miniW;
                const sy = this.miniY + wp[i].y / this.td.H * this.miniH;
                i === 0 ? this.miniG.moveTo(sx, sy) : this.miniG.lineTo(sx, sy);
            }
            this.miniG.closePath(); this.miniG.strokePath();
            this.trucks.forEach(tk => {
                const mx = this.miniX + tk.x / this.td.W * this.miniW;
                const my = this.miniY + tk.y / this.td.H * this.miniH;
                this.miniG.fillStyle(tk.col, 1);
                this.miniG.fillCircle(mx, my, tk.isP ? 3.5 : 2.5);
            });
        }
    }

    endRace() {
        if (this.over) return;
        this.over = true;
        this.trucks.forEach(t => {
            if (!t.fin) { t.finPos = this.finOrder.length; this.finOrder.push(t); }
        });
        const pp = this.trucks[0].finPos;
        const prize = PRIZES[Math.min(pp, 3)];
        gs.money += prize;
        gs.raceNum++;
        gs.lastRes = {
            track: this.td.name, race: gs.raceNum,
            order: this.finOrder.map(t => ({ name: t.name, imgKey: t.imgKey, isP: t.isP, pos: t.finPos })),
            pp, prize,
        };
        this.sound.stopAll();
        SFX.engineStop();
        this.time.delayedCall(1000, () => this.scene.start('ResultsScene'));
    }
}

// ── RESULTS SCENE ───────────────────────────────────────────
class ResultsScene extends Phaser.Scene {
    constructor() { super('ResultsScene'); }

    create() {
        this.cameras.main.setBackgroundColor('#111');
        const r = gs.lastRes;

        this.add.text(GW / 2, 60, 'RACE RESULTS', {
            fontSize: '36px', fontFamily: 'monospace', color: '#FFD700', fontStyle: 'bold',
        }).setOrigin(0.5);

        this.add.text(GW / 2, 110, `Track: ${r.track}  ·  Race ${r.race}`, {
            fontSize: '18px', fontFamily: 'monospace', color: '#aaa',
        }).setOrigin(0.5);

        const pl = ['1st', '2nd', '3rd', '4th'];
        r.order.forEach((e, i) => {
            const y = 200 + i * 65;
            const imgX = GW / 2 - 120;
            this.add.image(imgX, y, e.imgKey).setOrigin(0.5).setDisplaySize(40, 40).setDepth(1);
            this.add.text(GW / 2 - 80, y, `${pl[i]}  ${e.name}${e.isP ? '  ◄ YOU' : ''}`, {
                fontSize: '26px', fontFamily: 'monospace',
                color: e.isP ? hexCSS(CHAR_COLORS[gs.playerIdx]) : '#ccc', fontStyle: 'bold',
            }).setOrigin(0, 0.5);
        });

        this.add.text(GW / 2, 490, `PRIZE:  $${r.prize.toLocaleString()}`, {
            fontSize: '28px', fontFamily: 'monospace', color: '#FFD700', fontStyle: 'bold',
        }).setOrigin(0.5);

        this.add.text(GW / 2, 540, `TOTAL:  $${gs.money.toLocaleString()}`, {
            fontSize: '22px', fontFamily: 'monospace', color: '#fff',
        }).setOrigin(0.5);

        const ct = this.add.text(GW / 2, 660, 'PRESS ENTER TO CONTINUE', {
            fontSize: '22px', fontFamily: 'monospace', color: '#fff',
        }).setOrigin(0.5);
        this.tweens.add({ targets: ct, alpha: 0.2, duration: 500, yoyo: true, repeat: -1 });

        const advance = () => this.scene.start('ShopScene');
        this.input.keyboard.on('keydown-ENTER', advance);
        this.input.keyboard.on('keydown-SPACE', advance);
    }
}

// ── SHOP SCENE ──────────────────────────────────────────────
class ShopScene extends Phaser.Scene {
    constructor() { super('ShopScene'); }

    create() {
        this.cameras.main.setBackgroundColor('#0d0d1a');

        this.add.text(GW / 2, 45, "IRONMAN'S SPEED SHOP", {
            fontSize: '34px', fontFamily: 'monospace', color: '#FFD700', fontStyle: 'bold',
        }).setOrigin(0.5);

        this.monTxt = this.add.text(GW / 2, 95, 'CASH: $' + gs.money.toLocaleString(), {
            fontSize: '24px', fontFamily: 'monospace', color: '#00ff00',
        }).setOrigin(0.5);

        this.lvlTxts = [];
        this.bars = [];

        UPGRADES.forEach((u, i) => {
            const y = 160 + i * 85;
            this.add.text(180, y, u.name, {
                fontSize: '22px', fontFamily: 'monospace', color: '#fff', fontStyle: 'bold',
            });
            this.add.text(180, y + 28, '$' + u.cost.toLocaleString(), {
                fontSize: '14px', fontFamily: 'monospace', color: '#888',
            });

            const cur = gs[u.key];
            const lt = this.add.text(480, y, `${cur}/${u.max}`, {
                fontSize: '18px', fontFamily: 'monospace', color: '#0af',
            });
            this.lvlTxts.push(lt);

            // bar segments
            const barGroup = [];
            for (let b = 0; b < u.max && b < 12; b++) {
                const filled = b < cur;
                const seg = this.add.rectangle(480 + b * 20, y + 30, 16, 10,
                    filled ? 0x00aaff : 0x222244).setOrigin(0, 0);
                barGroup.push(seg);
            }
            this.bars.push(barGroup);

            // buy button
            const btn = this.add.text(780, y + 4, '[ BUY ]', {
                fontSize: '20px', fontFamily: 'monospace', color: '#0f0',
                backgroundColor: '#002200', padding: { x: 10, y: 4 },
            }).setInteractive({ useHandCursor: true });
            btn.on('pointerdown', () => this.buy(u, i));
            btn.on('pointerover', () => btn.setColor('#6f6'));
            btn.on('pointerout', () => btn.setColor('#0f0'));
        });

        // keyboard shortcuts
        this.add.text(GW / 2, 610, 'Keys 1-5 to buy  ·  ENTER to race', {
            fontSize: '14px', fontFamily: 'monospace', color: '#666',
        }).setOrigin(0.5);

        const go = this.add.text(GW / 2, 680, '▶  START RACE  ◀', {
            fontSize: '28px', fontFamily: 'monospace', color: '#FFD700', fontStyle: 'bold',
            backgroundColor: '#332200', padding: { x: 20, y: 10 },
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        go.on('pointerdown', () => this.race());
        go.on('pointerover', () => go.setColor('#ffe080'));
        go.on('pointerout', () => go.setColor('#FFD700'));

        this.input.keyboard.on('keydown-ONE',   () => this.buy(UPGRADES[0], 0));
        this.input.keyboard.on('keydown-TWO',   () => this.buy(UPGRADES[1], 1));
        this.input.keyboard.on('keydown-THREE', () => this.buy(UPGRADES[2], 2));
        this.input.keyboard.on('keydown-FOUR',  () => this.buy(UPGRADES[3], 3));
        this.input.keyboard.on('keydown-FIVE',  () => this.buy(UPGRADES[4], 4));
        this.input.keyboard.on('keydown-ENTER', () => this.race());
        this.input.keyboard.on('keydown-SPACE', () => this.race());
    }

    buy(u, i) {
        if (gs.money >= u.cost && gs[u.key] < u.max) {
            gs.money -= u.cost;
            gs[u.key]++;
            this.monTxt.setText('CASH: $' + gs.money.toLocaleString());
            this.lvlTxts[i].setText(gs[u.key] + '/' + u.max);
            // update bar
            const cur = gs[u.key];
            if (cur - 1 < this.bars[i].length) {
                this.bars[i][cur - 1].setFillStyle(0x00aaff);
            }
        }
    }

    race() { this.scene.start('RaceScene'); }
}

// ── PHASER CONFIG ───────────────────────────────────────────
const config = {
    type: Phaser.AUTO,
    width: GW,
    height: GH,
    backgroundColor: '#000000',
    parent: 'game-container',
    loader: {
        // Works better for local file:// runs (e.g. opening index.html directly).
        imageLoadType: 'HTMLImageElement',
    },
    scene: [BootScene, TitleScene, PlayerSelectScene, RaceScene, ResultsScene, ShopScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    pixelArt: true,
};

new Phaser.Game(config);
