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
    player: 0xe03030, ai1: 0x3070e0, ai2: 0xe0c020, ai3: 0x30c050,
    road: 0x606060, roadEdge: 0x888888, dirt: 0x8B7355, grass: 0x4a8a3a,
    mud: 0x5a4830, hud: 0x111111, money: 0xFFD700, nitro: 0xff4400,
};

const NAMES = ['YOU', 'MADMAN', 'HURRICANE', "JAMMIN'"];
const TCOLORS = [C.player, C.ai1, C.ai2, C.ai3];
const TKEYS = ['player', 'ai1', 'ai2', 'ai3'];
const PRIZES = [100000, 90000, 80000, 70000];

const TRUCK_SPRITES = {
    player: 'kenney_car_red',
    ai1: 'kenney_car_blue',
    ai2: 'kenney_car_yellow',
    ai3: 'kenney_car_green',
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
];

// ── GAME STATE ──────────────────────────────────────────────
let gs = resetGameState();
function resetGameState() {
    return {
        money: 200000, tires: 0, shocks: 0, acceleration: 0,
        topSpeed: 0, nitros: 3, raceNum: 0,
    };
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

// ── BOOT SCENE ──────────────────────────────────────────────
class BootScene extends Phaser.Scene {
    constructor() { super('BootScene'); }

    preload() {
        this.load.on('loaderror', (file) => {
            console.warn('Asset load failed:', file.key, file.src || 'unknown source');
        });

        this.load.image(TRUCK_SPRITES.player, 'kenney_racing-pack/PNG/Cars/car_red_1.png');
        this.load.image(TRUCK_SPRITES.ai1, 'kenney_racing-pack/PNG/Cars/car_blue_1.png');
        this.load.image(TRUCK_SPRITES.ai2, 'kenney_racing-pack/PNG/Cars/car_yellow_1.png');
        this.load.image(TRUCK_SPRITES.ai3, 'kenney_racing-pack/PNG/Cars/car_green_1.png');
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
            const wp = spline(t.cp, 20);
            t.wp = wp;

            // ── visual ──
            const vc = document.createElement('canvas'); vc.width = GW; vc.height = GH;
            const vx = vc.getContext('2d');

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

            // start / finish line
            const s0 = wp[0], s1 = wp[1];
            const sa = Math.atan2(s1.y - s0.y, s1.x - s0.x);
            const pa = sa + Math.PI / 2;
            vx.save();
            vx.strokeStyle = '#fff'; vx.lineWidth = 5;
            vx.beginPath();
            vx.moveTo(s0.x + Math.cos(pa) * t.rw / 2, s0.y + Math.sin(pa) * t.rw / 2);
            vx.lineTo(s0.x - Math.cos(pa) * t.rw / 2, s0.y - Math.sin(pa) * t.rw / 2);
            vx.stroke();
            // checkerboard
            for (let i = -3; i <= 3; i++) {
                vx.fillStyle = i % 2 === 0 ? '#000' : '#fff';
                const bx = s0.x + Math.cos(pa) * i * (t.rw / 7);
                const by = s0.y + Math.sin(pa) * i * (t.rw / 7);
                vx.fillRect(bx - 3, by - 3, 6, 6);
            }
            vx.restore();

            // track name subtle watermark
            vx.fillStyle = 'rgba(0,0,0,0.25)'; vx.font = 'bold 13px monospace';
            vx.textAlign = 'left'; vx.fillText(t.name, 8, GH - 8);

            this.textures.addCanvas('tv_' + idx, vc);

            // ── collision map ──
            const cc = document.createElement('canvas'); cc.width = GW; cc.height = GH;
            const cx = cc.getContext('2d');
            cx.fillStyle = '#804000'; cx.fillRect(0, 0, GW, GH);
            cx.strokeStyle = '#00ff00'; cx.lineWidth = t.rw;
            cx.lineCap = 'round'; cx.lineJoin = 'round';
            drawPath(cx, wp); cx.stroke();
            t.mud.forEach(m => {
                cx.fillStyle = '#0000ff'; cx.beginPath(); cx.arc(m.x, m.y, m.r, 0, Math.PI * 2); cx.fill();
            });
            t.cpx = cx.getImageData(0, 0, GW, GH).data;

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
            this.add.image(GW / 2, GH / 2, 'tv_' + tidx).setAlpha(0.15);
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

        const pt = this.add.text(GW / 2, 640, 'PRESS ENTER TO START', {
            fontSize: '26px', fontFamily: 'monospace', color: '#fff',
        }).setOrigin(0.5);
        this.tweens.add({ targets: pt, alpha: 0.2, duration: 600, yoyo: true, repeat: -1 });

        const startGame = () => {
            gs = resetGameState();
            this.scene.start('RaceScene');
        };
        this.input.keyboard.on('keydown-ENTER', startGame);
        this.input.keyboard.on('keydown-SPACE', startGame);
    }
}

// ── RACE SCENE ──────────────────────────────────────────────
class RaceScene extends Phaser.Scene {
    constructor() { super('RaceScene'); }

    create() {
        const ti = gs.raceNum % TRACKS.length;
        this.td = TRACKS[ti];
        this.wp = this.td.wp;

        // track background
        this.add.image(GW / 2, GH / 2, 'tv_' + ti);

        // create trucks
        this.trucks = [];
        for (let i = 0; i < 4; i++) {
            const sp = this.td.starts[i];
            const isP = i === 0;
            const tKey = TKEYS[i];
            const spriteKey = this.textures.exists(TRUCK_SPRITES[tKey]) ? TRUCK_SPRITES[tKey] : `truck_${tKey}`;
            const t = {
                spr: this.add.sprite(sp.x, sp.y, spriteKey)
                    .setOrigin(0.5)
                    .setDepth(10 + i)
                    .setDisplaySize(TRUCK_W, TRUCK_H),
                x: sp.x, y: sp.y, a: sp.a, vx: 0, vy: 0,
                isP, name: NAMES[i], col: TCOLORS[i], idx: i,
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
            };
            this.syncSprite(t);
            this.trucks.push(t);
        }

        // pickups
        this.pkActive = this.td.pks.map((p, i) => ({ ...p, on: true, i }));
        this.pkSprites = this.pkActive.map(p => {
            return this.add.image(p.x, p.y, p.type === 'money' ? 'pk_money' : 'pk_nitro').setDepth(5);
        });

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

        // countdown
        this.cdTxt = this.add.text(GW / 2, GH / 2 - 60, '3', {
            fontSize: '72px', fontFamily: 'monospace', color: '#ff0000',
            fontStyle: 'bold', stroke: '#000', strokeThickness: 5,
        }).setOrigin(0.5).setDepth(100);

        this.time.delayedCall(1000, () => {
            this.cdTxt.setText('2');
            this.time.delayedCall(1000, () => {
                this.cdTxt.setText('1');
                this.time.delayedCall(1000, () => {
                    this.cdTxt.setText('GO!').setColor('#00ff00');
                    this.started = true;
                    this.time.delayedCall(600, () => this.cdTxt.destroy());
                });
            });
        });
    }

    buildHUD() {
        const bar = this.add.rectangle(GW / 2, 22, GW, 44, 0x111111, 0.88).setDepth(50);
        const s = { fontSize: '15px', fontFamily: 'monospace', color: '#fff' };
        this.hPos = this.add.text(16, 8, 'POS: 1st', s).setDepth(51);
        this.hLap = this.add.text(150, 8, 'LAP: 1/4', s).setDepth(51);
        this.hMon = this.add.text(300, 8, '$200,000', { ...s, color: '#FFD700' }).setDepth(51);
        this.hNit = this.add.text(480, 8, 'NITRO: 3', { ...s, color: '#ff6600' }).setDepth(51);
        this.hRce = this.add.text(640, 8, `RACE ${gs.raceNum + 1}`, { ...s, color: '#aaa' }).setDepth(51);
        this.hTrk = this.add.text(790, 8, this.td.name, { ...s, color: '#aaa' }).setDepth(51);
        this.hBoard = [];
        for (let i = 0; i < 4; i++) {
            this.hBoard.push(this.add.text(16, 28, '', { fontSize: '11px', fontFamily: 'monospace', color: '#ccc' }).setDepth(51));
        }
    }

    update(time, delta) {
        if (!this.started || this.over) return;
        const dt = Math.min(delta / 16.67, 3); // cap dt to prevent tunnelling
        this.raceTime += delta;

        // update trucks
        this.trucks.forEach(t => {
            if (t.fin) { this.syncSprite(t); return; }
            if (t.isP) this.drivePlayer(t, dt);
            else this.driveAI(t, dt);
            this.physics(t, dt);
            this.checkCks(t);
            if (t.isP) this.checkPks(t);
            this.syncSprite(t);
        });

        this.updateDust(dt);
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
        const steer = t.hand * dt * (0.3 + 0.7 * sf);
        if (this.cur.left.isDown) t.a -= steer;
        if (this.cur.right.isDown) t.a += steer;

        if (this.cur.up.isDown) {
            const am = t.nAct ? 1.8 : 1.0;
            t.vx += Math.cos(t.a) * t.acc * am * t.tMult * dt;
            t.vy += Math.sin(t.a) * t.acc * am * t.tMult * dt;
        }

        if (Phaser.Input.Keyboard.JustDown(this.spc) && t.nitros > 0 && !t.nAct) {
            t.nAct = true; t.nitros--; gs.nitros = t.nitros; t.nTmr = 90;
            this.nitroFX(t);
        }
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
        if (t.nAct) { t.nTmr -= dt; if (t.nTmr <= 0) t.nAct = false; }

        // decompose velocity
        const fx = Math.cos(t.a), fy = Math.sin(t.a);
        const rx = -Math.sin(t.a), ry = Math.cos(t.a);
        const fwd = t.vx * fx + t.vy * fy;
        const lat = t.vx * rx + t.vy * ry;

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
        t.x = Phaser.Math.Clamp(nx, 8, GW - 8);
        t.y = Phaser.Math.Clamp(ny, 8, GH - 8);

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
        const ix = Math.floor(x), iy = Math.floor(y);
        if (ix < 0 || ix >= GW || iy < 0 || iy >= GH) return 'offroad';
        const i = (iy * GW + ix) * 4;
        if (px[i + 1] > 200 && px[i] < 100 && px[i + 2] < 100) return 'road';
        if (px[i + 2] > 200 && px[i] < 100 && px[i + 1] < 100) return 'mud';
        return 'offroad';
    }

    syncSprite(t) {
        t.spr.x = t.x; t.spr.y = t.y;
        if (t.spr.texture && t.spr.texture.key.startsWith('kenney_car_')) {
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
                        }).setOrigin(0.5).setDepth(100);
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
                } else {
                    t.nitros++; gs.nitros = t.nitros;
                    this.floatTxt(p.x, p.y, '+1 NITRO', '#ff6600');
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

    nitroFX(t) {
        for (let i = 0; i < 6; i++) {
            const bx = t.x - Math.cos(t.a) * TS, by = t.y - Math.sin(t.a) * TS;
            const fl = this.add.circle(bx + (Math.random() - 0.5) * 8, by + (Math.random() - 0.5) * 8,
                2 + Math.random() * 4, 0xff4400, 0.9).setDepth(3);
            fl._life = 12 + Math.random() * 15; this.dust.push(fl);
        }
    }

    updateDust(dt) {
        for (let i = this.dust.length - 1; i >= 0; i--) {
            const p = this.dust[i]; p._life -= dt; p.setAlpha(Math.max(0, p._life / 30));
            if (p._life <= 0) { p.destroy(); this.dust.splice(i, 1); }
        }
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
        if (this.posOrder) {
            this.hBoard.forEach((txt, i) => {
                const ti = this.posOrder[i];
                const tk = this.trucks[ti];
                txt.setText(pl[i] + ' ' + tk.name);
                txt.setColor(hexCSS(tk.col));
                txt.setPosition(GW - 150, 6 + i * 11);
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
            order: this.finOrder.map(t => ({ name: t.name, isP: t.isP, pos: t.finPos })),
            pp, prize,
        };
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
            this.add.text(GW / 2, y, `${pl[i]}  ${e.name}${e.isP ? '  ◄ YOU' : ''}`, {
                fontSize: '26px', fontFamily: 'monospace',
                color: e.isP ? '#e03030' : '#ccc', fontStyle: 'bold',
            }).setOrigin(0.5);
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
    scene: [BootScene, TitleScene, RaceScene, ResultsScene, ShopScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    pixelArt: true,
};

new Phaser.Game(config);
