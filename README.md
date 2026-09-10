# QR Frame Studio

An advanced, client-side vector QR code generation and design studio. **QR Frame Studio** transforms functional machine-readable barcodes into high-fidelity, brand-aligned visual assets featuring designer CTA frame banners, custom module body geometry, segmented marker eyes, logo badge integration with boundary scaling, and multi-format vector export capabilities.

---

## 📌 What is QR Frame Studio?

QR Frame Studio is an interactive, browser-native vector design workbench engineered for creating customized, scannable QR codes. Unlike conventional QR generators that output basic pixel grids or flat raster images, QR Frame Studio operates an isolated HTML5 Canvas sub-pixel vector rendering engine that deconstructs standard QR matrix topologies and reconstructs them into layered, stylized vector compositions.

### Core Capabilities:
- **Designer Frame System**: 12 responsive frame architectures (Top Ribbon, Bottom Pill, Floating Action Pills, Polaroid Cards, Realistic Smartphone Frames, Chat Bubbles, Perforated Coupons, Circular Badges, Cyber Neon Glows, and Minimal Cards) with dynamic typography and call-to-action (CTA) banners.
- **Parametric Module & Body Styling**: 20 algorithmic body shapes (Circuits, Diamonds, Fluid Liquid, Sparkles, Hearts, Stars, Hexagons, Rounded Dots, Micro Dots, Diagonal Lines, and Chamfered Modules) with independent module scaling (40% to 100%).
- **Segmented Eye & Pupil Customization**: 15 distinct outer frame shapes and 15 center pupil markers rendered with even-odd compound path geometry to preserve hollow inner rings and clear module separation.
- **Logo Integration & Boundary Control**: Aspect-ratio-preserving logo badge system with boundary padding, shape cutouts (circle, squircle, rounded, square), and stroke scaling that safely operates within Reed-Solomon error correction limits.
- **Typography & Font Engine**: Native integration with Google Fonts (e.g., Manrope, Plus Jakarta Sans, Bebas Neue, Montserrat, Poppins, Space Grotesk, Nunito, JetBrains Mono) utilizing explicit font-weight mapping (700 Bold / 400 Regular) and document font readiness synchronization.
- **Multi-Format Vector Export Engine**: Real-time rendering to scalable SVG, print-ready PDF, lossless PNG (up to 4096px 4K resolution), and WebP, alongside direct-to-clipboard bitmap copying.

---

## 🏗️ Architecture & How It Is Made

QR Frame Studio is constructed entirely on modern web standards with zero backend dependencies—all computations, matrix encodings, color extractions, and rendering occur client-side in the user's browser.

### Technology Stack:
- **Framework & Reactivity**: React 19 with strict TypeScript for modular component composition, predictable state transitions, and responsive state synchronization.
- **Build Tooling**: Vite with Rollup for fast Hot Module Replacement (HMR) and tree-shaken production bundling.
- **Styling Architecture**: Vanilla CSS and Tailwind CSS v4 design tokens, leveraging modern CSS features such as CSS custom properties, backdrop filters, flexbox/grid layouts, and sticky preview positioning.
- **Canvas Rendering Engine**: Pure HTML5 Canvas 2D Context (`CanvasRenderingContext2D`) executing sub-pixel mathematical paths, bezier curves, quadratic splines, and compound winding rules.
- **Color Engine**: `react-colorful` and `colord` for 60 FPS color picking, HSV/RGB/HEX conversions, and automated canvas-based pixel sampling to extract dominant brand colors from uploaded logos.
- **Export Pipeline**: `jsPDF` for client-side vector/raster document generation and custom SVG string synthesizers.

### Canvas Pipeline Architecture:
The rendering pipeline (`src/engine/renderers.ts`) executes a 9-stage drawing lifecycle on every state mutation:
1. **Coordinate Normalization**: Maps the working canvas space to a resolution-independent 800×800 logical viewport, scaling dynamically for ultra-high-resolution exports (1024px, 2048px, 4096px).
2. **Background & Card Boundary Pass**: Paints card backgrounds, corner radii, drop shadows, and user-defined boundary margins.
3. **Frame Architecture Background**: Renders lower structural frame elements (e.g., phone shells, ticket perforations, card enclosures).
4. **QR Matrix Extraction**: Generates the underlying binary module grid using ISO/IEC 18004 algorithms based on the active payload and error-correction level.
5. **Body Module Drawing**: Iterates over all non-finder modules, calculating neighbor adjacency and drawing custom geometric paths (squircle arcs, chamfered corners, diamond facets, star vertices).
6. **Compound Hollow Eye Frame Pass**: Employs the `evenodd` fill rule across outer 7×7 boundaries and inner 5×5 cutouts in a single continuous path, guaranteeing that the 1-module outer frame remains hollow with a 1-module gap.
7. **Center Pupil Marker Pass**: Centers 3×3 pupil graphics (hearts, stars, diamond grids, circular discs) directly inside the hollow finder rings.
8. **Logo Badge & Cutout Pass**: Draws the isolated logo bounding container, applies boundary clipping, and draws the user's logo while preserving its intrinsic aspect ratio.
9. **Foreground Frame & Typography Pass**: Renders frame ribbons, badges, text CTA headers, and subtext using exact Google Font weights (`700`/`400`) and alignment offsets.

---

## 🧮 Algorithms Used for QR Generation

QR generation in QR Frame Studio is based on the **ISO/IEC 18004 Standard** for Quick Response Code symbology, incorporating several key mathematical and algorithmic components:

### 1. Galois Field Arithmetic & Reed-Solomon Error Correction
To maintain scannability despite heavy visual customization, stylized modules, and center logo occlusions, the generator relies on **Reed-Solomon Error Correction Code (ECC)** constructed over a Galois Field $GF(2^8)$:
- **Field Polynomial**: $P(x) = x^8 + x^4 + x^3 + x^2 + 1$ (numeric value 285).
- **Generator Polynomial**: Formed through iterative roots $G(x) = \prod_{i=0}^{t-1} (x - \alpha^i)$ where $t$ is the number of error correction codewords.
- **Error Correction Levels**:
  - **Level L (Low)**: Recovers up to ~7% corrupted or obscured codewords.
  - **Level M (Medium)**: Recovers up to ~15% codewords (standard default).
  - **Level Q (Quartile)**: Recovers up to ~25% codewords.
  - **Level H (High)**: Recovers up to ~30% codewords.
- **Logo Occlusion Strategy**: When a center logo is introduced, the engine locks or recommends **Level H (30% recovery)**. The center logo is placed within a mathematically bounded footprint (maximum 25% area coverage), allowing the Reed-Solomon decoder to correct the occluded modules as localized burst erasures without modifying the structural code words.

### 2. Payload Mode Analysis & Compact Encoding
Payload strings (URLs, Wi-Fi configuration strings, vCard 3.0 records, SMS, Email URIs, Crypto schemas) are analyzed dynamically to select the most efficient encoding mode:
- **Numeric Mode**: 10 bits per 3 digits.
- **Alphanumeric Mode**: 11 bits per 2 characters (subset of 45 characters).
- **8-bit Byte Mode**: 8 bits per character (UTF-8 encoding).
- **Kanji Mode**: 13 bits per character.

### 3. Mask Pattern Evaluation & Penalty Scoring
To avoid optical illusions or false alignment triggers that might deceive camera sensors, 8 standard evaluation masks ($M_0$ through $M_7$) are applied to the matrix:
- The mask formula toggles module bits based on mathematical coordinates $(r, c)$:
  - $M_0: (r + c) \pmod 2 = 0$
  - $M_1: r \pmod 2 = 0$
  - $M_2: c \pmod 3 = 0$
  - $M_3: (r + c) \pmod 3 = 0$
  - $M_4: (\lfloor r / 2 \rfloor + \lfloor c / 3 \rfloor) \pmod 2 = 0$
  - $M_5: ((r \cdot c) \pmod 2) + ((r \cdot c) \pmod 3) = 0$
  - $M_6: (((r \cdot c) \pmod 2) + ((r \cdot c) \pmod 3)) \pmod 2 = 0$
  - $M_7: (((r + c) \pmod 2) + ((r \cdot c) \pmod 3)) \pmod 2 = 0$
- **Penalty Calculation ($N_1$ to $N_4$)**:
  - $N_1$: Penalty for consecutive lines of 5 or more identical modules.
  - $N_2$: Penalty for 2×2 blocks of identical modules.
  - $N_3$: Penalty for finder-like patterns in unexpected matrix locations.
  - $N_4$: Penalty for imbalance between total dark and light modules.
  The mask yielding the lowest aggregate penalty score is selected.

### 4. Matrix Decomposition & Functional Pattern Isolation
Before drawing custom styles, the engine partitions the matrix into distinct functional layers:
- **Position Detection Patterns (Finder Eyes)**: Fixed at the Top-Left $(0,0)$, Top-Right $(0, \text{size}-7)$, and Bottom-Left $(\text{size}-7, 0)$ regions.
- **Timing Patterns**: Alternating dark and light modules along row 6 and column 6.
- **Alignment Patterns**: Concentric 5×5 and 3×3 markers placed across larger QR versions (Version 2+).
- **Format Information & Version Information Areas**: Preserved alongside finder boundaries.
- **Data & Error Correction Codeword Modules**: The remaining areas where custom module shapes and scale factors (40% to 100%) are applied.

### 5. Even-Odd Compound Path Rule for Hollow Ring Geometry
To create distinct outer eye frames without using fill operations that overwrite the inner pupil, the engine uses compound path construction with the **Even-Odd Winding Rule** (`ctx.fill('evenodd')`):
- The outer boundary (e.g., $7 \times 7$ cell bounds) is traced.
- The inner cutout boundary (e.g., $5 \times 5$ cell bounds) is traced immediately within the same subpath without issuing a `beginPath()`.
- When filled with the `evenodd` rule, the area between the outer and inner paths is shaded while the center remains transparent, providing a 1-module gap around the 3×3 pupil across all geometric outer frame shapes.

---

## 🎨 Design Philosophy

- **Zero Generic Aesthetics**: Custom dark workspace interface built around rich zinc/slate undertones, subtle radial glows, active ring highlights, and glassmorphism.
- **Non-Destructive Scannability**: Guardrails ensure module sizes, quiet zones, and logo proportions adhere strictly to optical readability standards.
- **Real-Time Responsiveness**: Instant feedback loop between control inputs and the live vector canvas.
