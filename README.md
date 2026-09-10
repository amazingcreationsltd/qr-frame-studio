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



---

## 🎨 Design Philosophy

- **Zero Generic Aesthetics**: Custom dark workspace interface built around rich zinc/slate undertones, subtle radial glows, active ring highlights, and glassmorphism.
- **Non-Destructive Scannability**: Guardrails ensure module sizes, quiet zones, and logo proportions adhere strictly to optical readability standards.
- **Real-Time Responsiveness**: Instant feedback loop between control inputs and the live vector canvas.
