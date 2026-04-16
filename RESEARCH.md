# Ivan "Ironman" Stewart's Super Off Road: Comprehensive Research for Phaser JS Recreation

## Executive Summary

Ivan "Ironman" Stewart's Super Off Road is a top-down arcade racing game released by Leland Corporation in 1989, ported to Amiga by Graftgold/Virgin Games in 1990 and to DOS/other platforms around the same period. The game features 8 closed-circuit dirt tracks (16 with the Track Pak expansion), 4-lap races, a vehicle upgrade economy, and up to 3 simultaneous players. The directory under analysis (`/Users/leereilly/github/ir0nman`) actually contains the **Amiga version** packaged via GamesNostalgia's FS-UAE emulator wrapper (WHDLoad), not a DOS version. This report covers the game's complete design, technical specifications across platforms, and a detailed technical roadmap for recreating the game as a browser-playable Phaser JS application — including asset extraction strategies, physics modeling, AI behavior, and an existing open-source JavaScript reference implementation.

---

## Table of Contents

1. [Game Overview & History](#1-game-overview--history)
2. [Gameplay Mechanics Deep Dive](#2-gameplay-mechanics-deep-dive)
3. [Technical Specifications by Platform](#3-technical-specifications-by-platform)
4. [Analysis of the Repository Contents](#4-analysis-of-the-repository-contents)
5. [Asset Extraction & Reverse Engineering](#5-asset-extraction--reverse-engineering)
6. [Phaser JS Recreation Architecture](#6-phaser-js-recreation-architecture)
7. [Existing Reference Implementations](#7-existing-reference-implementations)
8. [Emulation vs. Recreation Trade-offs](#8-emulation-vs-recreation-trade-offs)
9. [Recommended Implementation Roadmap](#9-recommended-implementation-roadmap)
10. [Legal Considerations](#10-legal-considerations)
11. [Confidence Assessment](#11-confidence-assessment)
12. [Footnotes](#12-footnotes)

---

## 1. Game Overview & History

### Origins
Ivan "Ironman" Stewart's Super Off Road was developed by **Leland Corporation** and released as an arcade cabinet in 1989[^1]. It was endorsed by real-life off-road racing legend Ivan Stewart and built on the success of Leland's earlier "Ironman Ivan Stewart's Super Off-Road" prototype hardware. The game brought stadium off-road truck racing into arcades with an accessible, upgrade-driven multiplayer format[^2].

### Development & Porting
- **Arcade original**: Leland Corporation, 1989
- **Amiga port**: Graftgold Ltd. (code by Jason Page, Steve Turner, Gary J. Foreman, David O'Connor; graphics by John Cumming; music by Jason Page), published by Virgin Games, 1990[^3]
- **DOS port**: Published by Virgin Games/Tradewest, ~1990
- **Console ports**: NES, SNES, Sega Genesis, Game Boy, and others throughout 1990-1993[^4]

### Cultural Significance
Super Off Road pioneered several design patterns now standard in racing games:
- **Persistent vehicle upgrades** purchased with race winnings
- **Dynamic Play Adjustment (DPA)** / rubber-banding AI to keep races competitive
- **Multiplayer-first arcade design** (3 simultaneous players per cabinet)
- **Convert-a-Credit** — arcade quarters could be converted directly to in-game upgrade currency[^5]

---

## 2. Gameplay Mechanics Deep Dive

### Race Structure
| Element | Details |
|---------|---------|
| **Tracks** | 8 unique tracks (Sidewinder, Fandango, Wipeout, Blaster, Huevos Grande, Cliffhanger, Big Dukes, Hurricane Gulch)[^6] |
| **Track Pak** | 8 additional tracks (Shortcut, Cut-off Pass, Pig Bog, Rio Trio, Leapin' Lizards, Redoubt About, Boulder Hill, Volcano Valley) — arcade expansion[^7] |
| **Laps per race** | 4 |
| **Total races** | 99 in a championship campaign, looping tracks with increasing difficulty |
| **Players** | Up to 3 simultaneous (arcade/Amiga); 4 on NES |
| **View** | Fixed top-down / slight isometric — entire track visible on screen at once |

### Track Features
Tracks contain a rich variety of terrain features that affect truck behavior:
- **Jumps and ramps** — trucks go airborne, momentarily losing steering control
- **Bumps and moguls** — cause trucks to bounce, reducing traction
- **Water/mud hazards** — slow trucks down significantly
- **Tight turns and hairpins** — require skillful braking and nitro management
- **Hills** — affect acceleration depending on direction
- **Holes and dips** — slow trucks and cause them to bottom out

### Prize Money & Economy
| Finish Position | Prize (Arcade) |
|-----------------|----------------|
| 1st place | $100,000 |
| 2nd place | ~$90,000 |
| 3rd place | ~$80,000 |
| 4th place | ~$70,000 |

Additional income sources during races:
- **Money bags** scattered on track: $10,000–$50,000 each[^8]
- **Nitro pickups**: Free nitro bottles on the track
- **Convert-a-Credit** (arcade): Insert quarter → $200,000 in-game[^5]

### Upgrade System ("Ironman's Speed Shop")
Between races, players visit the Speed Shop to spend winnings:

| Upgrade | Cost | Effect |
|---------|------|--------|
| **Tires** | $40,000 | Improved handling/cornering grip |
| **Shocks** | $60,000 | Reduced bounce, better stability on bumps/jumps |
| **Acceleration** | $80,000 | Faster off-the-line speed and recovery |
| **Top Speed** | $100,000 | Higher maximum velocity |
| **Nitro** | $1,000/bottle | Short turbo boost, limited supply per race |

The strategic tension: do you invest in raw speed, handling, or stockpile nitros for tactical overtakes?[^9]

### Controls (Arcade)
- **Steering wheel** (analog dial, one per player)
- **Accelerator pedal** (one per player)
- **Nitro button** (one per player)
- No brake — players rely on releasing the accelerator and physics

### AI Behavior & Dynamic Difficulty
The arcade version pioneered **Dynamic Play Adjustment (DPA)**[^10]:
- AI opponents are named after development staff ("Madman" Sam Powell, "Hurricane" Earl Stratton, "Jammin'")
- When a human player leads, AI opponents receive speed/acceleration boosts (rubber-banding)
- When a human player trails, AI makes more "mistakes" — wider turns, slower acceleration
- The system is designed to maximize coin-drop by keeping races competitive but fair-feeling
- AI trucks follow predefined waypoint paths along the optimal racing line, with deviation introduced based on difficulty level

---

## 3. Technical Specifications by Platform

### Arcade Hardware
| Component | Specification |
|-----------|---------------|
| **Main CPUs** | 2× Zilog Z80 @ 6 MHz[^11] |
| **Sound CPU** | Intel 80186 @ 8 MHz |
| **Sound Chips** | 2× AY-3-8910A PSG @ 1.666 MHz + custom DACs |
| **Video Resolution** | 456 × 336 pixels, horizontal orientation[^12] |
| **Colors** | 256 simultaneous |
| **Display** | Horizontal raster CRT, ~66 Hz |
| **Cabinet Weight** | Upright: ~402 lbs; Cabaret: ~263 lbs |
| **Controls** | 3 steering wheel dials + 3 pedals + 3 nitro buttons |

### Platform Comparison

| Platform | Resolution | Colors | Tracks | Max Players | Audio | Developer |
|----------|-----------|--------|--------|-------------|-------|-----------|
| **Arcade** | 456×336 | 256 | 8 (16 w/Track Pak) | 3 | Multi-chip PSG+DAC | Leland Corp. |
| **Amiga** | 320×256 (PAL) | 32 (EHB mode possible) | 8 | 3 | 4-channel Paula chip | Graftgold |
| **DOS (EGA)** | 320×200 | 16 (of 64) | 8 | 3 | PC Speaker/AdLib/Tandy | — |
| **DOS (CGA)** | 320×200 | 4 | 8 | 3 | PC Speaker | — |
| **NES** | 256×240 | 25 (of 64) | 8 | 4 | 5-channel APU | Rare (attributed) |
| **SNES** | 256×224 | 256 (of 32k) | 16 | 3 | SPC700 8-channel | Tradewest |
| **Genesis** | 320×224 | 64 (of 512) | 8 | 3 | YM2612 FM + PSG | Tradewest |

Key differences[^13]:
- **SNES** has double the tracks (16) and Toyota branding instead of Ivan Stewart's name
- **NES** uniquely supports 4 players via NES Four Score adapter
- **DOS/Amiga** are the most faithful to arcade feel but with reduced color palettes
- **Genesis** is praised for the most arcade-like handling

### Graphics Architecture
All versions share a common rendering approach:
- **Static background**: The entire track is rendered as a single pre-drawn bitmap/tilemap
- **Sprite overlay**: Trucks are small bitmap sprites overlaid on the track
- **Fixed camera**: No scrolling — the entire track fits on one screen
- **Minimal animation**: Truck sprites rotate to indicate direction; dust/exhaust effects are simple
- **UI overlay**: Score, position, lap counter, nitro count rendered over the track

---

## 4. Analysis of the Repository Contents

The directory at `/Users/leereilly/github/ir0nman` contains an **Amiga version** (not DOS) of Super Off Road, packaged by GamesNostalgia.com as a self-contained FS-UAE emulator bundle[^14]:

```
ir0nman/
├── README.txt                    # GamesNostalgia Amiga package notes (v1.7.4, Oct 2020)
├── SuperOffRoad.bat              # Windows launcher script for FS-UAE
├── donations.url                 # Link to GamesNostalgia donations
├── gamesnostalgia.url            # Link to GamesNostalgia website
├── patreon.url                   # Link to GamesNostalgia Patreon
└── fsuae/
    ├── Default.fs-uae            # FS-UAE config (A1200/020, AGA chipset, 2MB chip + 8MB fast RAM)
    ├── fs-uae.exe                # FS-UAE emulator binary (Windows)
    ├── Hard Drives/              # WHDLoad game installation
    │   ├── SuperOffRoad.Slave    # WHDLoad slave (game loader — contains metadata)
    │   ├── Disk.1/               # Game data disk image
    │   ├── Manual/               # Scanned manual
    │   ├── Hints/                # Game hints
    │   ├── ReadMe                # WHDLoad readme
    │   └── S/, C/, DEVS/, ...    # Amiga system directories
    └── [DLL files, emulator deps]
```

Key observations from the WHDLoad slave binary[^15]:
- Game title: "Super Off Road"
- Credits: "1989 GraftGold/Virgin Games/Leland"
- WHDLoad conversion: "Done by Dark Angel updated by CFou!"
- Version: 1.3 (27.08.2004)
- Emulated configuration: Amiga 1200 with 020 CPU, AGA chipset

The FS-UAE configuration[^16] specifies:
- `amiga_model = A1200/020` — Amiga 1200 with Motorola 68020 CPU
- `chip_memory = 2048` — 2MB chip RAM
- `fast_memory = 8192` — 8MB fast RAM
- `uae_chipset = aga` — AGA (Advanced Graphics Architecture)
- Keyboard controls mapped for 2 joystick ports

---

## 5. Asset Extraction & Reverse Engineering

### Strategy for Extracting Game Assets

Since you have the Amiga binary (not DOS), the extraction approach differs slightly:

#### Method 1: Emulator Savestate Memory Dumping
1. Run the game in FS-UAE with savestate support (already configured with `unsafe_save_states = 1`)
2. At key moments (gameplay, different tracks, Speed Shop), create savestates via F12
3. Use **MapTapper**[^17] to browse the memory dump for graphics:
   - Set bitplane count (Amiga typically uses 4-5 bitplanes for 16-32 colors)
   - Adjust palette until sprites become visible
   - Export individual sprites as PNG

#### Method 2: Direct Binary Analysis
1. Use **IRA disassembler**[^18] or **Aira Force**[^19] to disassemble the Amiga executable in `Disk.1/`
2. Locate sprite tables and bitmap data sections in the binary
3. Decode Amiga planar graphics format (interleaved bitplanes) to modern pixel formats

#### Method 3: Screenshot-Based Recreation
1. Run the game and capture high-quality screenshots of:
   - Each of the 8 tracks (from both directions if applicable)
   - All truck sprites at every rotation angle
   - UI elements (Speed Shop, leaderboard, HUD)
   - Pickup items (money bags, nitro bottles)
2. Use image editing tools (Aseprite, GIMP, Photoshop) to isolate and clean up sprites
3. Create new sprite sheets from captured frames

#### Method 4: Community Resources
- Check **The Spriters Resource** (spriters-resource.com) for pre-ripped sprite sheets
- Check **VGMaps.com** for pre-ripped track maps
- Search Amiga-specific communities (English Amiga Board, Lemon Amiga)

### Asset Inventory Needed for Recreation

| Asset Category | Items | Format for Phaser |
|---------------|-------|-------------------|
| **Track backgrounds** | 8 unique track images | PNG (full-screen static images, ~1024×768 scaled) |
| **Truck sprites** | 4 trucks × ~16 rotation angles × 2-3 animation frames | Sprite atlas (JSON + PNG) |
| **Pickup items** | Money bags, nitro bottles | Small sprite atlas |
| **UI elements** | Speed Shop interface, HUD, leaderboard | PNG + custom fonts |
| **Particle effects** | Dust clouds, exhaust, nitro flame | Sprite atlas or Phaser particle emitter configs |
| **Sound effects** | Engine sounds, collisions, pickups, nitro, crowd | WAV/OGG/MP3 |
| **Music** | Title theme, race music, victory jingle | OGG/MP3 |
| **Track collision data** | Boundaries, terrain types per track | JSON polygon data or bitmap mask |
| **Track metadata** | Waypoints, checkpoints, start positions | JSON |

---

## 6. Phaser JS Recreation Architecture

### Recommended Technology Stack

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| **Game engine** | Phaser 3 (latest) | Best-in-class 2D HTML5 game framework[^20] |
| **Physics** | Matter.js (via Phaser) | Needed for realistic friction, drifting, terrain types[^21] |
| **Map editor** | Tiled | Define collision zones, terrain types, waypoints[^22] |
| **Sprite tool** | Aseprite or TexturePacker | Create optimized sprite atlases |
| **Build tool** | Vite or Webpack | Module bundling, hot reload |
| **Language** | TypeScript | Type safety for complex game state |

### High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Phaser 3 Game                      │
│                                                       │
│  ┌─────────┐  ┌──────────┐  ┌─────────┐  ┌────────┐ │
│  │  Boot    │→ │  Title   │→ │  Race   │→ │  Shop  │ │
│  │  Scene   │  │  Scene   │  │  Scene  │  │  Scene │ │
│  └─────────┘  └──────────┘  └─────────┘  └────────┘ │
│                                    │          │       │
│                              ┌─────┴──────┐   │       │
│                              │ Results    │───┘       │
│                              │ Scene      │           │
│                              └────────────┘           │
│                                                       │
│  ┌─────────────────────────────────────────────────┐ │
│  │              Shared Systems                      │ │
│  │  ┌──────┐ ┌────────┐ ┌─────┐ ┌──────────────┐  │ │
│  │  │Player│ │  AI    │ │Audio│ │ Game State   │  │ │
│  │  │Input │ │Manager │ │Mgr  │ │ (upgrades,   │  │ │
│  │  └──────┘ └────────┘ └─────┘ │  money, etc) │  │ │
│  │                               └──────────────┘  │ │
│  └─────────────────────────────────────────────────┘ │
│                                                       │
│  ┌─────────────────────────────────────────────────┐ │
│  │              Matter.js Physics World             │ │
│  │  • Truck bodies with friction/drag               │ │
│  │  • Track boundary colliders                      │ │
│  │  • Terrain sensor zones (mud, jumps, etc.)       │ │
│  └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

### Scene Flow

```
Boot → Title → [Player Select] → Race → Results → Speed Shop → Race → ... (99 races) → Championship
```

### Core Systems Detail

#### 1. Track Rendering System
Since Super Off Road uses a fixed camera with the entire track visible:

```javascript
// In RaceScene.create()
// Load full track as a single background image
this.add.image(512, 384, 'track_sidewinder');

// Load collision/terrain data from Tiled JSON
const trackData = this.cache.json.get('track_sidewinder_data');

// Create invisible Matter.js bodies for track boundaries
trackData.boundaries.forEach(polygon => {
    this.matter.add.fromVertices(polygon.x, polygon.y, polygon.vertices, {
        isStatic: true,
        label: 'wall'
    });
});

// Create terrain sensor zones
trackData.terrainZones.forEach(zone => {
    const sensor = this.matter.add.fromVertices(zone.x, zone.y, zone.vertices, {
        isStatic: true,
        isSensor: true,
        label: zone.type // 'mud', 'jump', 'normal'
    });
});
```

#### 2. Vehicle Physics System
Using Matter.js for realistic top-down vehicle dynamics[^23]:

```javascript
class Truck {
    constructor(scene, x, y, config) {
        this.sprite = scene.matter.add.sprite(x, y, 'truck_red', null, {
            mass: 10,
            friction: 0.1,
            frictionAir: 0.05,
            restitution: 0.3
        });

        // Upgrade-affected properties
        this.maxSpeed = 3 + (config.topSpeedLevel * 0.5);
        this.acceleration = 0.05 + (config.accelLevel * 0.01);
        this.handling = 3 + (config.tiresLevel * 0.5);     // angular velocity
        this.stability = 0.05 + (config.shocksLevel * 0.01); // bounce damping
        this.nitroCount = config.nitros;
        this.nitroBoost = 2.0; // multiplier when nitro active
    }

    update(input) {
        // Steering
        if (input.left) {
            this.sprite.setAngularVelocity(-this.handling * 0.01);
        } else if (input.right) {
            this.sprite.setAngularVelocity(this.handling * 0.01);
        } else {
            this.sprite.setAngularVelocity(this.sprite.body.angularVelocity * 0.8);
        }

        // Acceleration
        let speed = this.acceleration;
        if (this.nitroActive) speed *= this.nitroBoost;

        if (input.accelerate) {
            const force = new Phaser.Math.Vector2();
            Phaser.Math.RotateTo(force, 0, 0, this.sprite.rotation, speed * 0.001);
            this.sprite.applyForce(force);
        }

        // Nitro
        if (input.nitro && this.nitroCount > 0 && !this.nitroActive) {
            this.nitroActive = true;
            this.nitroCount--;
            this.scene.time.delayedCall(1500, () => { this.nitroActive = false; });
        }

        // Clamp speed
        const vel = this.sprite.body.velocity;
        const currentSpeed = Math.sqrt(vel.x * vel.x + vel.y * vel.y);
        if (currentSpeed > this.maxSpeed) {
            const scale = this.maxSpeed / currentSpeed;
            this.sprite.setVelocity(vel.x * scale, vel.y * scale);
        }

        // Update sprite frame based on rotation angle
        const angle = Phaser.Math.RadToDeg(this.sprite.rotation);
        const frameIndex = Math.round(((angle % 360 + 360) % 360) / 22.5) % 16;
        this.sprite.setFrame(frameIndex);
    }
}
```

#### 3. Terrain Interaction System

```javascript
// Different terrain types affect truck physics dynamically
this.matter.world.on('collisionstart', (event) => {
    event.pairs.forEach(pair => {
        const labels = [pair.bodyA.label, pair.bodyB.label];
        const truck = getTruckFromPair(pair);
        if (!truck) return;

        if (labels.includes('mud')) {
            truck.sprite.setFrictionAir(0.12);  // Heavy drag
            truck.terrainSpeedMultiplier = 0.5;
        } else if (labels.includes('jump')) {
            truck.isAirborne = true;
            truck.sprite.setFrictionAir(0.001); // No ground friction in air
            // Launch animation
        }
    });
});

this.matter.world.on('collisionend', (event) => {
    // Restore normal physics when leaving terrain zone
    event.pairs.forEach(pair => {
        const truck = getTruckFromPair(pair);
        if (truck) {
            truck.sprite.setFrictionAir(0.05);
            truck.terrainSpeedMultiplier = 1.0;
            truck.isAirborne = false;
        }
    });
});
```

#### 4. Checkpoint & Lap Counting System

```javascript
class LapTracker {
    constructor(scene, checkpoints, totalLaps = 4) {
        this.scene = scene;
        this.checkpoints = checkpoints; // Array of {x, y, width, height} zones
        this.totalLaps = totalLaps;
        this.players = {};              // Track per-player progress
    }

    initPlayer(playerId) {
        this.players[playerId] = {
            nextCheckpoint: 0,
            lap: 0,
            finished: false,
            lapTimes: []
        };
    }

    checkProgress(playerId, truckPosition) {
        const progress = this.players[playerId];
        if (progress.finished) return;

        const checkpoint = this.checkpoints[progress.nextCheckpoint];
        if (this.isInsideZone(truckPosition, checkpoint)) {
            progress.nextCheckpoint++;

            if (progress.nextCheckpoint >= this.checkpoints.length) {
                progress.nextCheckpoint = 0;
                progress.lap++;
                progress.lapTimes.push(this.scene.time.now);

                if (progress.lap >= this.totalLaps) {
                    progress.finished = true;
                    this.scene.events.emit('playerFinished', playerId);
                }
            }
        }
    }

    isInsideZone(pos, zone) {
        return pos.x > zone.x && pos.x < zone.x + zone.width &&
               pos.y > zone.y && pos.y < zone.y + zone.height;
    }
}
```

#### 5. AI Opponent System with Rubber-Banding

```javascript
class AIDriver {
    constructor(truck, waypoints, difficulty = 1.0) {
        this.truck = truck;
        this.waypoints = waypoints;        // Pre-defined optimal path
        this.currentWaypoint = 0;
        this.baseDifficulty = difficulty;
        this.effectiveDifficulty = difficulty;

        // Personality (named after dev team, like the original)
        this.names = ['Madman', 'Hurricane', 'Jammin\''];
    }

    update(playerPositions) {
        // Dynamic difficulty adjustment (rubber-banding)
        const leadPlayer = this.getLeadPlayer(playerPositions);
        const distanceToLead = this.getDistanceToPlayer(leadPlayer);

        if (distanceToLead > 200) {
            // AI is behind — boost
            this.effectiveDifficulty = this.baseDifficulty * 1.3;
        } else if (distanceToLead < -200) {
            // AI is ahead — slow down subtly
            this.effectiveDifficulty = this.baseDifficulty * 0.8;
        } else {
            this.effectiveDifficulty = this.baseDifficulty;
        }

        // Navigate towards next waypoint
        const target = this.waypoints[this.currentWaypoint];
        const angle = Phaser.Math.Angle.Between(
            this.truck.sprite.x, this.truck.sprite.y,
            target.x, target.y
        );

        // Steer towards waypoint
        const angleDiff = Phaser.Math.Angle.Wrap(angle - this.truck.sprite.rotation);
        this.truck.update({
            left: angleDiff < -0.1,
            right: angleDiff > 0.1,
            accelerate: true,
            nitro: Math.random() < 0.01 * this.effectiveDifficulty // Random nitro usage
        });

        // Advance to next waypoint when close enough
        const dist = Phaser.Math.Distance.Between(
            this.truck.sprite.x, this.truck.sprite.y,
            target.x, target.y
        );
        if (dist < 30) {
            this.currentWaypoint = (this.currentWaypoint + 1) % this.waypoints.length;
        }
    }
}
```

#### 6. Speed Shop Scene

```javascript
class SpeedShopScene extends Phaser.Scene {
    constructor() { super('SpeedShopScene'); }

    create(data) {
        this.playerState = data.playerState;
        this.add.image(512, 384, 'speed_shop_bg');

        const upgrades = [
            { name: 'Tires',        cost: 40000,  stat: 'tiresLevel',    max: 10 },
            { name: 'Shocks',       cost: 60000,  stat: 'shocksLevel',   max: 10 },
            { name: 'Acceleration', cost: 80000,  stat: 'accelLevel',    max: 10 },
            { name: 'Top Speed',    cost: 100000, stat: 'topSpeedLevel', max: 10 },
            { name: 'Nitro',        cost: 1000,   stat: 'nitros',        max: 99 },
        ];

        upgrades.forEach((upgrade, i) => {
            const btn = this.add.text(300, 200 + i * 60, 
                `${upgrade.name}: $${upgrade.cost}`, { fontSize: '24px' })
                .setInteractive()
                .on('pointerdown', () => this.buyUpgrade(upgrade));
        });

        this.add.text(300, 550, 'DONE — Start Race', { fontSize: '28px' })
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.start('RaceScene', { 
                    playerState: this.playerState,
                    raceNumber: data.raceNumber + 1
                });
            });
    }

    buyUpgrade(upgrade) {
        if (this.playerState.money >= upgrade.cost && 
            this.playerState[upgrade.stat] < upgrade.max) {
            this.playerState.money -= upgrade.cost;
            this.playerState[upgrade.stat]++;
            // Play purchase SFX, update display
        }
    }
}
```

### Recommended Phaser Configuration

```javascript
const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    backgroundColor: '#000000',
    physics: {
        default: 'matter',
        matter: {
            gravity: { x: 0, y: 0 }, // Top-down: no gravity
            debug: false
        }
    },
    scene: [BootScene, TitleScene, PlayerSelectScene, 
            RaceScene, ResultsScene, SpeedShopScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    input: {
        gamepad: true  // Support for controllers
    }
};

const game = new Phaser.Game(config);
```

---

## 7. Existing Reference Implementations

### ErikLarsson82/super-off-road (JavaScript + Canvas + Box2D)
The most directly relevant open-source recreation[^24]:

| Attribute | Details |
|-----------|---------|
| **Repository** | [ErikLarsson82/super-off-road](https://github.com/ErikLarsson82/super-off-road) |
| **Tech stack** | JavaScript, HTML5 Canvas, Box2D physics, RequireJS |
| **Status** | Work in progress |
| **Canvas size** | 1024 × 768 |
| **Structure** | `app/` (game.js, splash.js, images.js, gameContainer.js), `assets/`, `lib/` (Box2D, RequireJS), `physics_data/`, `originals/` |

Key learnings from this project:
- Uses **Box2D** for vehicle physics (similar approach to using Matter.js in Phaser)
- Has a `physics_data/` directory with track collision geometry — demonstrates how track boundaries can be defined as polygon data
- Stores original reference material in `originals/` for comparison
- Renders at 1024×768 — a good target resolution for a browser game
- Supports keyboard and gamepad (PS4/Xbox) input

### Adrian Meizoso's Super Off Road (Sega Genesis Homebrew)
A Sega Genesis homebrew recreation[^25] — not JavaScript-based but useful for understanding game mechanics decomposition and track data formatting.

### WePlayDOS / js-dos (Emulation Approach)
For comparison, [js-dos](https://js-dos.com)[^26] and [Em-DOSBox](https://github.com/dreamlayers/em-dosbox)[^27] allow running the original DOS binary directly in a browser via WebAssembly-compiled DOSBox. This is the fastest path to "playable in browser" but offers no ability to modify game logic, add features, or modernize the experience.

---

## 8. Emulation vs. Recreation Trade-offs

| Factor | Emulation (js-dos) | Recreation (Phaser JS) |
|--------|--------------------|-----------------------|
| **Development time** | Hours | Weeks to months |
| **Fidelity to original** | 100% exact | Approximate (depends on effort) |
| **Customizability** | None — black box | Full — modify anything |
| **Mobile support** | Limited (touch controls awkward) | Excellent (custom touch UI) |
| **Multiplayer** | Local only (same as original) | Can add online multiplayer |
| **Performance** | Overhead of full CPU emulation | Native JS performance |
| **Asset requirement** | Original game binary only | Extracted/recreated assets |
| **Legal risk** | Requires original game binary | Clean-room recreation possible |
| **Maintainability** | Depends on emulator project | Full control |
| **Learning value** | Minimal | Extensive |

**Recommendation**: Since the stated goal is to reverse-engineer the game (learning and customization), the **Phaser JS recreation** is the right approach. The emulation path (js-dos) could serve as a quick reference/prototype for verifying behavior accuracy.

---

## 9. Recommended Implementation Roadmap

### Phase 1: Foundation & Single Track Prototype
1. Set up Phaser 3 project with TypeScript, Vite, Matter.js physics
2. Create a single track (e.g., Sidewinder) as a static background image
3. Implement basic truck physics — steering, acceleration, top speed clamping
4. Define track boundaries as Matter.js static bodies
5. Implement single-player controls (keyboard + gamepad)
6. Add checkpoint/lap counting system

### Phase 2: Core Gameplay Loop
7. Implement the Speed Shop scene with upgrade purchases
8. Add nitro boost mechanic
9. Create 3 AI opponents with waypoint-following behavior
10. Implement basic rubber-banding DDA
11. Add race results screen with prize money
12. Implement game state persistence (money, upgrades) across races

### Phase 3: Content & Polish
13. Create/extract all 8 track backgrounds and collision data
14. Add all truck sprite rotations and animation frames
15. Implement terrain types (mud, jumps, bumps) with physics effects
16. Add pickup items (money bags, nitro bottles) spawning on tracks
17. Implement sound effects and music
18. Add particle effects (dust, exhaust, nitro flames)

### Phase 4: Multiplayer & UX
19. Add local multiplayer (split keyboard or gamepads)
20. Add title screen, player select, high score table
21. Implement the full 99-race championship progression
22. Mobile-responsive touch controls
23. Performance optimization and cross-browser testing

### Phase 5: Stretch Goals
24. Online multiplayer (WebSocket/WebRTC)
25. Track editor
26. Additional tracks beyond the original 8
27. Save/load game state (localStorage or cloud)

---

## 10. Legal Considerations

- **Copyright**: Super Off Road's code, graphics, and audio are copyrighted by Leland Corporation (now part of Midway, then acquired by Warner Bros. Interactive Entertainment)[^28]
- **Trademark**: "Ivan Stewart" and "Super Off Road" are trademarks
- **Clean-room recreation**: Writing new code that replicates gameplay mechanics is generally legal; using original assets directly is not
- **Abandonware status**: The game is widely available on abandonware sites (MyAbandonware, Archive.org) but this does not constitute a legal license
- **Safe approach**: Create original pixel art inspired by (but not copied from) the originals, write all code from scratch, use original music/SFX only for personal/educational use
- **MAME source**: The arcade version is emulated in MAME, whose source code is available and can provide technical reference for behavior verification (not for asset extraction)

---

## 11. Confidence Assessment

| Claim | Confidence | Basis |
|-------|-----------|-------|
| Game history, release dates, platforms | **High** | Multiple corroborating sources (Wikipedia, MobyGames, Arcade Museum) |
| Arcade hardware specs | **High** | Arcade manuals on Archive.org, MAME database |
| Gameplay mechanics (tracks, laps, upgrades, prizes) | **High** | Consistent across multiple sources + original manual |
| DOS/Amiga technical specs (resolution, colors) | **Medium-High** | Cross-referenced MyAbandonware, Pixelated Arcade, community reports |
| Repository contains Amiga (not DOS) version | **High** | Verified by examining FS-UAE config, WHDLoad slave binary metadata |
| Phaser JS architecture recommendations | **High** | Based on official Phaser 3 docs, examples, and established patterns |
| Physics implementation approach | **Medium-High** | Based on official Matter.js examples in Phaser; may need tuning for feel |
| AI rubber-banding specifics | **Medium** | General mechanism well-documented; exact original parameters are unknown |
| Exact upgrade costs (arcade) | **Medium** | Values vary slightly across sources; most common values cited |
| ErikLarsson82 project viability as reference | **Medium** | Project is work-in-progress; code quality/completeness not fully verified |

**Key uncertainty**: The exact physics feel of the original game (friction coefficients, acceleration curves, bounce behavior) will require extensive play-testing and iterative tuning. No source provides these exact values — they must be reverse-engineered through gameplay observation.

---

## 12. Footnotes

[^1]: [Super Off Road — Wikipedia](https://en.wikipedia.org/wiki/Super_Off_Road)
[^2]: [Ironman Ivan Stewart's Super Off-Road (rev 4) — MAME / Arcade Italia](https://adb.arcadeitalia.net/dettaglio_mame.php?game_name=offroad&lang=en)
[^3]: [Ivan 'Ironman' Stewart's Super Off Road — Lemon Amiga](https://www.lemonamiga.com/doc/ivan-ironman-stewarts-super-off-road/874); WHDLoad slave metadata in `/Users/leereilly/github/ir0nman/fsuae/Hard Drives/SuperOffRoad.Slave` (hex offset 0x50-0x70)
[^4]: [Ivan 'Ironman' Stewart's Super Off Road Releases — MobyGames](https://www.mobygames.com/game/4444/ivan-ironman-stewarts-super-off-road/releases/)
[^5]: [Ironman Ivan Stewart's Super Off-Road — Arcade-History](https://www.arcade-history.com/?n=ironman-ivan-stewarts-super-off-road&page=detail&id=1204)
[^6]: [Ivan "Ironman" Stewart's Super Off-Road (Leland Corporation, 1989) — FRGCB](https://frgcb.blogspot.com/2022/07/ivan-ironman-stewarts-super-off-road.html)
[^7]: [Ironman Ivan Stewart's Super Off Road Track Pak — Arcade Museum](https://www.arcade-museum.com/Videogame/ironman-ivan-stewarts-super-off-road-track-pak)
[^8]: [Ironman Ivan Stewart's Super Off Road series — SkoolDays](https://www.skooldays.com/categories/arcade/ag1066.htm)
[^9]: [Super Off Road Arcade Game — Vintage Arcade Superstore](https://vintagearcade.net/shop/arcade-games/super-off-road-arcade-game/)
[^10]: [Adaptive rubber-banding system of dynamic difficulty adjustment in racing games — SAGE Journals](https://journals.sagepub.com/doi/full/10.3233/ICG-220207)
[^11]: [Super Off Road — Arcadeología](https://arcadeologia.es/en/machines/super-off-road-42.html)
[^12]: [Arcade Game Manual: Ironman Ivan Stewart's Super Off Road — Archive.org](https://archive.org/details/ArcadeGameManualSuperoffroad)
[^13]: [Super Off Road — Codex Gamicus](https://gamicus.fandom.com/wiki/Super_Off_Road); [Super Off Road | Versions Comparison — YouTube](https://www.youtube.com/watch?v=ISKuhFb51MM)
[^14]: `/Users/leereilly/github/ir0nman/README.txt` — "Amiga Games Loader by GamesNostalgia - www.gamesnostalgia.com", version 1.7.4
[^15]: `/Users/leereilly/github/ir0nman/fsuae/Hard Drives/SuperOffRoad.Slave` — hex dump showing "Super Off Road", "1989 GraftGold/Virgin Games/Leland", "Done by Dark Angel updated by CFou!", "Version 1.3 (27.08.2004)"
[^16]: `/Users/leereilly/github/ir0nman/fsuae/Default.fs-uae` — `amiga_model = A1200/020`, `uae_chipset = aga`
[^17]: [Graphics/Tile Ripping — Codetapper's Amiga Site / MapTapper](https://codetapper.com/amiga/maptapper/documentation/gfx/)
[^18]: [Tetracorp: Reverse-engineering Amiga games](https://tetracorp.github.io/guide/reverse-engineering-amiga.html)
[^19]: [Aira Force by howprice — Itch.io](https://howprice.itch.io/aira-force)
[^20]: [Phaser — A fast, fun and free open source HTML5 game framework](https://phaser.io/); [phaserjs/phaser — GitHub](https://github.com/phaserjs/phaser)
[^21]: [Phaser Examples — Matter.js Top Down Car Body](https://phaser.io/examples/v3.55.0/physics/matterjs/view/top-down-car-body); [Matter Physics | Phaser Help](https://docs.phaser.io/phaser/concepts/physics/matter)
[^22]: [HTML5 Phaser Tutorial — Top-Down Games with Tiled — GameDev Academy](https://gamedevacademy.org/html5-phaser-tutorial-top-down-games-with-tiled/)
[^23]: [Top Down Vehicle Steering & Movement in ECS with Matter.js and Phaser 3 — YouTube](https://www.youtube.com/watch?v=BiGps58X1h8)
[^24]: [ErikLarsson82/super-off-road — GitHub](https://github.com/ErikLarsson82/super-off-road)
[^25]: [Adrian Meizoso's Super Off Road — adrianmeizoso.github.io](https://adrianmeizoso.github.io/SuperOffRoad/)
[^26]: [js-dos — DOSBox for browser](https://js-dos.com/overview.html); [js-dos — npm](https://www.npmjs.com/js-dos)
[^27]: [dreamlayers/em-dosbox — GitHub](https://github.com/dreamlayers/em-dosbox)
[^28]: [Ivan 'Ironman' Stewart's Super Off Road (1989) — MobyGames](https://www.mobygames.com/game/4444/ivan-ironman-stewarts-super-off-road/)

---

## Key Resources Summary

| Resource | Type | URL |
|----------|------|-----|
| **ErikLarsson82/super-off-road** | JS recreation reference | [GitHub](https://github.com/ErikLarsson82/super-off-road) |
| **Phaser 3** | Game framework | [phaser.io](https://phaser.io/) |
| **Phaser Racecar Example** | Physics reference | [Phaser Examples](https://phaser.io/examples/v3.85.0/physics/arcade/view/racecar) |
| **Phaser Top-Down Car (Matter.js)** | Physics reference | [Phaser Examples](https://phaser.io/examples/v3.55.0/physics/matterjs/view/top-down-car-body) |
| **Tiled Map Editor** | Track/level design | [mapeditor.org](https://www.mapeditor.org/) |
| **MapTapper** | Amiga sprite extraction | [Codetapper](https://codetapper.com/amiga/maptapper/documentation/gfx/) |
| **Aira Force** | Amiga reverse engineering | [Itch.io](https://howprice.itch.io/aira-force) |
| **js-dos** | DOS emulation in browser | [js-dos.com](https://js-dos.com/) |
| **Arcade Manual (Original)** | Hardware reference | [Archive.org](https://archive.org/details/ArcadeGameManualSuperoffroad) |
| **FRGCB Deep Dive** | Multi-platform comparison | [Blog](https://frgcb.blogspot.com/2022/07/ivan-ironman-stewarts-super-off-road.html) |
| **RetroReversing** | RE techniques | [retroreversing.com/Amiga](https://www.retroreversing.com/Amiga) |
| **libgamegraphics** | DOS graphics extraction | [GitHub](https://github.com/Malvineous/libgamegraphics) |
