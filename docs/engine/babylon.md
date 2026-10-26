# Babylon.js engine reference: Vulpéa Mechanória

A working reference for coding agents. Checked 2026-10-26. Tags: **[src](URL)** means the claim was read at that source. **[est]** means it is our own judgment and should be tested before relying on it.

> How this was sourced: the doc.babylonjs.com pages were read from their markdown source, the BabylonJS/Documentation repo at commit `1f4f17e` (2026-10-26). The site itself could not be fetched from the research sandbox. The `[src]` links point to the doc.babylonjs.com page that each markdown file renders. API signatures were checked against the published `@babylonjs/core@9.32.0` typings.

## 0. Versions and packages (npm, 2026-10-26)

| Package | Version | Licence | Use |
|---|---|---|---|
| `@babylonjs/core` | 9.32.0 | Apache-2.0 | engine [src](https://registry.npmjs.org/@babylonjs/core/latest) |
| `@babylonjs/gui` | 9.32.0 | Apache-2.0 | HUD, touch joysticks [src](https://registry.npmjs.org/@babylonjs/gui/latest) |
| `@babylonjs/loaders` | 9.32.0 | Apache-2.0 | glTF: `import "@babylonjs/loaders/glTF.js"` [src](https://doc.babylonjs.com/setup/frameworkPackages/es6Support) |
| `@babylonjs/materials` | 9.32.0 | Apache-2.0 | CellMaterial, SkyMaterial, etc. [src](https://registry.npmjs.org/@babylonjs/materials/latest) |
| `@babylonjs/addons` | 9.32.0 | Apache-2.0 | `Atmosphere` [src](https://doc.babylonjs.com/addons/atmosphere) |
| `@babylonjs/inspector` | 9.32.0 | Apache-2.0 | dev only [src](https://registry.npmjs.org/@babylonjs/inspector/latest) |
| `@babylonjs/havok` | 1.3.14 | MIT | physics WASM [src](https://registry.npmjs.org/@babylonjs/havok/latest) |

Other packages: `@babylonjs/post-processes`, `@babylonjs/procedural-textures`, `@babylonjs/serializers` and `@babylonjs/ktx2decoder` [src](https://doc.babylonjs.com/setup/frameworkPackages/es6Support). Version 9.0 added several features this project can use: Clustered Lighting, Frame Graph, Large World Rendering, Physically Based Atmosphere, Inspector v2 and Volumetric Lighting [src](https://doc.babylonjs.com/whats-new).

## 1. Setup

### Imports and tree-shaking
| Style | Example | Tree-shakes? |
|---|---|---|
| Top-level barrel | `@babylonjs/core` | limited |
| Deep imports | `@babylonjs/core/Engines/engine.js` | yes; side-effect modules must be imported explicitly |
| **Pure barrel** | `@babylonjs/core/pure` | yes; side effects are switched on by `Register*()` calls |

Source for the table: [src](https://doc.babylonjs.com/setup/frameworkPackages/es6Support/treeShaking). With the pure barrel, call `RegisterStandardEngineExtensions()` for most apps. `RegisterFullEngineExtensions()` adds compute, queries, multiview and cube/raw textures [src](https://doc.babylonjs.com/setup/frameworkPackages/es6Support/treeShaking). **Use the pure barrel plus the Full tier**, because occlusion queries and WebGPU compute need it [est].

### Vite
- Vite needs no special configuration for pure imports [src](https://doc.babylonjs.com/setup/frameworkPackages/es6Support/treeShaking/usingPureImports).
- Build with `vite build --base=./` so asset paths are relative. Put static assets in `public/` [src](https://doc.babylonjs.com/guidedLearning/usingVite).
- Havok in Vite dev mode needs `optimizeDeps: { exclude: ["@babylonjs/havok"] }`, plus `server.fs.allow` if the WASM sits outside the root [src](https://forum.babylonjs.com/t/importing-and-implementing-havok-in-vite-react-ts-project-fails/48441/4).
- Working without a bundler is possible through the CDN ES modules, but the docs say the CDN "should not be used in production" [src](https://doc.babylonjs.com/features/featuresDeepDive/physics/havokPlugin). **Use Vite** [est].

### Engine: WebGPU first, WebGL2 fallback
```ts
import { EngineFactory, WebGPUEngine, Engine } from "@babylonjs/core/pure";
// One line: tries WebGPU, then WebGL, then NullEngine
const engine = await EngineFactory.CreateAsync(canvas, { /* options */ });
// Or by hand:
const engine2 = (await WebGPUEngine.IsSupportedAsync)
  ? await (async () => { const e = new WebGPUEngine(canvas); await e.initAsync(); return e; })()
  : new Engine(canvas, true);
```
Source: [src](https://doc.babylonjs.com/setup/support/webGPU/webGPUBreakingChanges).

How WebGPU differs from WebGL2:
- **Async creation.** You must `await engine.initAsync()` [src](https://doc.babylonjs.com/setup/support/webGPU).
- **Async pixel reads.** `readPixels` returns a promise on both backends [src](https://doc.babylonjs.com/setup/support/webGPU/webGPUBreakingChanges).
- **Shader language.**
  - WebGPU runs only WGSL, and the core shaders have been native WGSL since 2024 [src](https://doc.babylonjs.com/setup/support/webGPU).
  - Custom GLSL is converted to WGSL at runtime by a WASM library that has to be downloaded. That conversion adds startup time and download size, so write `ShaderMaterial` code in WGSL with `shaderLanguage: ShaderLanguage.WGSL` and `ShaderStore.ShadersStoreWGSL` [src](https://doc.babylonjs.com/setup/support/webGPU/webGPUWGSL).
  - `CustomMaterial`/`PBRCustomMaterial` injection stays in GLSL [src](https://doc.babylonjs.com/setup/support/webGPU/webGPUWGSL).
  - NDC z runs 0..1 in WGSL and −1..1 in GLSL [src](https://doc.babylonjs.com/setup/support/webGPU/webGPUWGSL).
- **WebGPU-only speed-ups.**
  - `engine.snapshotRendering = true` records the draw calls and replays them. It saves JS time only, and the scene must be mostly static [src](https://doc.babylonjs.com/setup/support/webGPU/webGPUOptimization/webGPUSnapshotRendering).
  - `engine.compatibilityMode = false` turns on the "fast path", which uses render bundles. It hurts performance if bundles are rebuilt every frame [src](https://doc.babylonjs.com/setup/support/webGPU/webGPUOptimization/webGPUNonCompatibilityMode).
- **Missing on WebGPU.** Only point size ≠ 1 and triangle-fan/line-loop drawing are absent [src](https://doc.babylonjs.com/setup/support/webGPU/webGPUStatus).

### WebGPU browser support (gpuweb wiki, read 2026-10-26)
| Browser | Shipped |
|---|---|
| Chrome/Edge | Windows, macOS, ChromeOS since 113. Linux: Intel Gen12+ since 144, NVIDIA/Wayland since 147, other GPUs behind a flag. Windows ARM64 behind a flag |
| Chrome Android | Android 12+ with ARM/Qualcomm/Intel GPUs since 121. Imagination GPUs on Android 16+ since 139. Samsung Xclipse and other GPUs not yet |
| Firefox | Windows since 141. macOS Apple Silicon since 145 (macOS 26+), all macOS versions from 147. Linux Nightly only. Android behind a flag |
| Safari | macOS, iOS/iPadOS and visionOS 26, on by default |

Source for the table: [src](https://github.com/gpuweb/gpuweb/wiki/Implementation-Status). See also [src](https://web.dev/blog/webgpu-supported-major-browsers).

Chromium's intent for WebGPU *Compatibility mode* (an OpenGL ES 3.1 backend for older Android devices) targets milestone 146 and lists Android WebView [src](https://groups.google.com/a/chromium.org/g/blink-dev/c/N3RlLGCOTJ4/m/loneRTlPBwAJ?hl=es). **Always ship the WebGL2 fallback** [est].

## 2. Large terrain

**Precision first.** A ring is huge, so `new Engine(canvas, true, { useLargeWorldRendering: true })` (WebGPUEngine takes the same option) is needed [est].
- It turns on 64-bit CPU matrices and `floatingOriginMode`, which offsets all matrices relative to the camera [src](https://doc.babylonjs.com/features/featuresDeepDive/scene/large_world).
- These are handled automatically: Standard/PBR/Node materials, CSM, particles, sprites, clustered lights and Atmosphere.
- Custom shaders must use the standard uniform names (`world`, `viewProjection`, …), or `u_`-prefixed names in Node Material blocks [src](https://doc.babylonjs.com/features/featuresDeepDive/scene/large_world).

### Option A: Dynamic Terrain (community extension)
How it works:
- It is a single ribbon mesh that follows the camera. Its vertex count (`terrainSub`) never changes; it morphs over a `Float32Array` map of xyz points [src](https://doc.babylonjs.com/communityExtensions/dynamicTerrains).
- **Streaming:** assign `terrain.mapData = nextChunk`. Without new data the map repeats [src](https://doc.babylonjs.com/communityExtensions/dynamicTerrains).

LOD controls:
- `initialLOD`: map quads per terrain quad.
- `updateCameraLOD(cam)`: LOD that changes with camera height.
- `LODLimits = [1,2,4]`: coarser rings toward the edge.
- `subToleranceX/Z`: update only every N quads crossed.
- Source: [src](https://doc.babylonjs.com/communityExtensions/dynamicTerrains).

Other useful members: `getHeightFromMap(x, z, normalRef)`, `useCustomVertexFunction` and `precomputeNormalsFromMap` [src](https://doc.babylonjs.com/communityExtensions/dynamicTerrains).

Packaging: it is a plain JS file in BabylonJS/Extensions, and the only ES6 version is a community TypeScript gist [src](https://doc.babylonjs.com/communityExtensions/dynamicTerrains). There is **no npm package**: `babylonjs-dynamic-terrain` returns 404 [src](https://registry.npmjs.org/babylonjs-dynamic-terrain).

Limitations: LOD changes in whole-number steps and is computed on the CPU with no geomorphing, so expect visible LOD steps. It is good for prototypes [est].

### Option B: chunked ground meshes
- Build each chunk with `CreateGround`/`CreateGroundFromHeightMap` [src](https://doc.babylonjs.com/features/featuresDeepDive/mesh/creation/set/ground_hmap).
- For ground following, `GroundMesh.getHeightAtCoordinates(x, z)` and `getNormalAtCoordinates` [src](https://registry.npmjs.org/@babylonjs/core/-/core-9.32.0.tgz).
- For collision, use a Havok `PhysicsShapeHeightField` built from the same height buffer (`passHeightBufferInCallback: true`) [src](https://doc.babylonjs.com/features/featuresDeepDive/physics/shapes).
- When adding and removing many meshes, the Scene options `useGeometryUniqueIdsMap`, `useMaterialMeshMap` and `useClonedMeshMap` speed it up at a memory cost [src](https://doc.babylonjs.com/features/featuresDeepDive/scene/optimize_your_scene).

### Option C (recommended for production): custom CDLOD-style patches
Babylon has no built-in CDLOD [est]. Build it yourself [est]:
1. Make one grid patch mesh and draw it as **thin instances**. Each instance carries offset, scale and LOD attributes (see section 3).
2. Displace the vertices in the vertex shader from a height texture, using a WGSL `ShaderMaterial`, a NodeMaterial, or a material plugin on Standard/PBR.
3. Keep a quadtree on the CPU.
4. Generate heights in a Web Worker, or with a compute shader on WebGPU.

Avoiding popping and swimming [est]:
- Geomorph: blend vertices toward the coarser grid across the last ~30% of each LOD range.
- Add hysteresis to LOD switches.
- Snap patch origins to multiples of their own grid spacing. Moving grids that resample the height field cause "swimming".
- Sample heights at fixed world positions.
- For meshes, cross-fade or dither between LODs, and keep `stabilizeCascades` on for shadows.

## 3. Many objects

| Technique | JS cost | Culling | Per-instance data | Use for |
|---|---|---|---|---|
| `createInstance` (InstancedMesh) | one object per instance | per instance | `registerInstancedBuffer("color",4)` + `instance.instancedBuffers.color` | scattered props, dynamic add/remove |
| Thin instances | none per instance | **all or nothing** per mesh | `thinInstanceSetBuffer("matrix"/"color", buf, stride, static)`, `thinInstanceRegisterAttribute` | grass, rocks, trees per chunk |
| SPS (SolidParticleSystem) | one mesh, one draw call | whole mesh | particle colour/uv | debris, animated swarms |

Sources: [src](https://doc.babylonjs.com/features/featuresDeepDive/mesh/copies/instances), [src](https://doc.babylonjs.com/features/featuresDeepDive/mesh/copies/thinInstances), [src](https://doc.babylonjs.com/features/featuresDeepDive/particles/solid_particle_system/sps_intro).

Thin instances:
- They are best for static sets. Adding or removing them costs more than with regular instances [src](https://doc.babylonjs.com/features/featuresDeepDive/mesh/copies/thinInstances).
- Buffers are not updatable unless `static=false`; call `thinInstanceBufferUpdated` after changing them.
- Picking, rendering and shadows work per instance. Collisions use one combined bounding box [src](https://doc.babylonjs.com/features/featuresDeepDive/mesh/copies/thinInstances).
- **Use one thin-instance mesh per terrain chunk per species** so frustum culling still works [est].

SPS: update a slice of particles per frame with `setParticles(start, stop, update)` [src](https://doc.babylonjs.com/features/featuresDeepDive/particles/solid_particle_system/optimize_sps).

Culling:
- Frustum culling is automatic. `mesh.cullingStrategy` (e.g. `CULLINGSTRATEGY_BOUNDINGSPHERE_ONLY`) makes it cheaper [src](https://doc.babylonjs.com/features/featuresDeepDive/scene/optimize_your_scene).
- Occlusion queries:
  - Turn on with `mesh.occlusionType = AbstractMesh.OCCLUSION_TYPE_OPTIMISTIC` (or `_STRICT`) plus `occlusionRetryCount`.
  - Results arrive asynchronously and are used the frame after.
  - Occludees must draw after occluders, via `renderingGroupId`.
  - They need `engine.query` and `boundingBoxRenderer` imports.
  - Source: [src](https://doc.babylonjs.com/features/featuresDeepDive/occlusionQueries).

LOD:
- `mesh.addLODLevel(distance, lowerMesh)`. Pass `null` to cull beyond a distance.
- `useLODScreenCoverage = true` uses screen coverage (0..1) instead of distance.
- Instances inherit the root mesh's LOD, and the root must be hidden [src](https://doc.babylonjs.com/features/featuresDeepDive/mesh/LOD).
- Auto-LOD: `mesh.simplify([{quality, distance}], parallel, SimplificationType.QUADRATIC, cb)` runs asynchronously [src](https://doc.babylonjs.com/features/featuresDeepDive/mesh/simplifyingMeshes). Do this offline in Blender/gltfpack for shipped assets [est].

Impostors:
- `new SpriteManager(name, url, capacity, cellSize)` with `new Sprite(name, mgr)` [src](https://doc.babylonjs.com/features/featuresDeepDive/sprites/sprite_manager).
- `mesh.billboardMode` (`BILLBOARDMODE_ALL` = 7) [src](https://doc.babylonjs.com/features/featuresDeepDive/mesh/billboardMode).
- Use distant trees as sprites or billboarded thin-instance quads as the last LOD [est].

## 4. Look (Risk of Rain 2-style stylized)

Materials:
- **StandardMaterial** is the cheapest lit option. **PBRMaterial** is needed if you use the Atmosphere addon, which integrates with PBR [src](https://doc.babylonjs.com/addons/atmosphere). StandardMaterial plus a ramp is a better fit for flat shading on phones [est].
- **Toon shading:**
  - `CellMaterial` (`@babylonjs/materials`): `computeHighLevel` gives up to 5 light bands, otherwise 2 [src](https://doc.babylonjs.com/toolsAndResources/assetLibraries/materialsLibrary/cellShadingMat).
  - Better: a **material plugin** (`MaterialPluginBase`). It works only on Standard/PBR and supports both GLSL and WGSL through `isCompatible(shaderLanguage)` [src](https://doc.babylonjs.com/features/featuresDeepDive/materials/using/materialPlugins). Use it to quantize NdotL against a ramp texture and to add height fog [est].
- **NodeMaterial** can target WGSL via `nodeMaterial.shaderLanguage` [src](https://doc.babylonjs.com/features/featuresDeepDive/materials/node_material/nodeMaterial).
- **ShaderMaterial** supports fog through `#include<fogVertex>`/`<fogFragment>` [src](https://doc.babylonjs.com/features/featuresDeepDive/materials/shaders/Fog+ShaderMat).

Fog:
- `scene.fogMode = Scene.FOGMODE_EXP | EXP2 | LINEAR`, with `fogDensity`, `fogStart`/`fogEnd` and `fogColor` [src](https://doc.babylonjs.com/features/featuresDeepDive/environment/environment_introduction).
- There is no built-in height fog. Do it in a material plugin or a depth-based post-process [est].

Sky:
- `SkyMaterial` (turbidity, luminance, sun position) on a skybox [src](https://doc.babylonjs.com/toolsAndResources/assetLibraries/materialsLibrary/skyMat).
- `Atmosphere` (`@babylonjs/addons/atmosphere`):
  - Physically based sky and aerial perspective. It needs WebGPU or WebGL2; check with `Atmosphere.IsSupported(engine)`.
  - Sun is a `DirectionalLight`. Rayleigh, Mie and ozone are tunable.
  - Defaults to an Earth-like planet [src](https://doc.babylonjs.com/addons/atmosphere).
  - Its planet model does not match a ring arching overhead. Plan a custom sky shader for the "ring arch" band [est].

Shadows: `CascadedShadowGenerator`.
- Needs WebGL2+.
- `numCascades` 2–4 (default 4), `lambda` (0.5), `cascadeBlendPercentage`, `stabilizeCascades` to stop shimmer, and its own `shadowMaxZ`.
- `light.shadowMinZ/MaxZ` are ignored. Filtering is PCF/PCSS only.
- Source: [src](https://doc.babylonjs.com/features/featuresDeepDive/lights/shadows_csm).

Post-processing: `new DefaultRenderingPipeline(name, hdr, scene, [camera])` [src](https://doc.babylonjs.com/features/featuresDeepDive/postProcesses/defaultRenderingPipeline).
- `samples` (MSAA), `fxaaEnabled`, `sharpenEnabled`, `bloomEnabled`.
- `imageProcessingEnabled` covers tone mapping, colour grading/curves and dithering.
- Also `chromaticAberrationEnabled`, `grainEnabled` and depth of field.
- Use `hdr=true` unless targeting low-end devices.

Upscaling: `FSR1RenderingPipeline` (AMD FSR 1, spatial).
- Works on WebGPU and WebGL2.
- `scaleFactor` presets run from 1.3 to 2.0; `sharpnessStops` controls sharpening.
- Keep MSAA or FXAA on, because the upscaler amplifies aliasing.
- Source: [src](https://doc.babylonjs.com/features/featuresDeepDive/postProcesses/FSR1RenderingPipeline).

Glow: `new GlowLayer("glow", scene)` blooms emissive colour and textures. `intensity`; a lower `mainTextureRatio` is faster [src](https://doc.babylonjs.com/features/featuresDeepDive/mesh/glowLayer).

G-buffer and deferred rendering:
- No classic deferred pipeline is documented.
- `scene.enableGeometryBufferRenderer()` and `scene.enablePrePassRenderer()` exist. PrePassRenderer is described as "necessary for effects like subsurface scattering or deferred shading" [src](https://registry.npmjs.org/@babylonjs/core/-/core-9.32.0.tgz).
- The Frame Graph has a `FrameGraphGeometryRendererTask` that outputs depth, normals and velocity [src](https://doc.babylonjs.com/features/featuresDeepDive/frameGraph/frameGraphClassFramework/frameGraphTaskList).
- For many lights use `ClusteredLightContainer`. It works on WebGPU, and on WebGL2 when float colour buffers are blendable [src](https://doc.babylonjs.com/features/featuresDeepDive/lights/clusteredLighting).

## 5. Physics (Havok)

```ts
import HavokPhysics from "@babylonjs/havok";
import { HavokPlugin } from "@babylonjs/core/Physics/v2/Plugins/havokPlugin.js";
const hk = await HavokPhysics();
scene.enablePhysics(new Vector3(0, -9.81, 0), new HavokPlugin(true, hk));
```
Source: [src](https://doc.babylonjs.com/setup/frameworkPackages/es6Support).

- **Licence:** MIT, free to use [src](https://doc.babylonjs.com/features/featuresDeepDive/physics/havokPlugin).
- **Requires WASM SIMD**, so no iOS before 16.4 [src](https://doc.babylonjs.com/features/featuresDeepDive/physics/havokPlugin).
- **Pass the instance in.** Don't rely on the global `HK`. Ammo, Cannon and Oimo (V1) are deprecated [src](https://doc.babylonjs.com/setup/frameworkPackages/es6Support).
- **Large worlds:**
  - With floating origin on, Havok automatically splits bodies into multiple regions. The size is set by `floatingOriginWorldRadius` (default 100,000).
  - Bodies move between regions with a 20% hysteresis margin.
  - Each region can have its own gravity [src](https://doc.babylonjs.com/features/featuresDeepDive/scene/large_world).

**PhysicsCharacterController**
- Create: `new PhysicsCharacterController(pos, {capsuleHeight, capsuleRadius}, scene)`.
- Per frame:
  1. `checkSupport(dt, down)`
  2. compute the desired velocity (state machine: `ON_GROUND`/`IN_AIR`/…)
  3. `setVelocity(v)`
  4. `integrate(dt, support, gravity)`
  5. `getPosition()`
- There is also synchronous `moveWithCollisions`. Moving platforms are `PhysicsMotionType.ANIMATED`. Collision events come through `onTriggerCollisionObservable`.
- Source: [src](https://doc.babylonjs.com/features/featuresDeepDive/physics/characterController).
- The typings expose a settable `up: Vector3`, `maxSlopeCosine`, `keepDistance` and `characterMass`, and `integrate()` takes a gravity vector [src](https://registry.npmjs.org/@babylonjs/core/-/core-9.32.0.tgz). That is enough for ring "spin gravity": set `up` and gravity to point toward the ring's axis every frame [est].
- **Ground following without physics:** `GroundMesh.getHeightAtCoordinates` or Dynamic Terrain's `getHeightFromMap` (section 2).

## 6. Input

- **DeviceSourceManager** gives one polling and observable API for:
  - Keyboard, Mouse, Touch (`DeviceType.Pointer`)
  - DualShock, Xbox, Switch and Generic gamepads (`getDeviceSource(DeviceType.Xbox)?.getInput(XboxInput.A)`)
  - plus `onDeviceConnectedObservable`/`onDeviceDisconnectedObservable` and per-device `onInputChangedObservable`.
  - Source: [src](https://doc.babylonjs.com/features/featuresDeepDive/input/deviceSourceManager).
  - Use it as the single input layer, mapped to game actions [est].
- **GamepadManager** is the older event API (`onGamepadConnectedObservable`, `Xbox360Pad`, `leftStick`) [src](https://doc.babylonjs.com/features/featuresDeepDive/input/gamepads).
- **Touch:**
  - `new VirtualJoystick(true|false)` draws an overlay canvas that blocks GUI and scene pointer events [src](https://doc.babylonjs.com/features/featuresDeepDive/input/virtualJoysticks).
  - Prefer the **Babylon GUI custom joystick** (Playground `#C6V6UY#5`): left-side move stick, right-side swipe to look [src](https://doc.babylonjs.com/features/featuresDeepDive/input/virtualJoysticks).
  - Set `touch-action: none` on the canvas, which iOS needs [src](https://doc.babylonjs.com/legacy/babylonViewer/defaultViewerConfig).
- **Pointer lock:** `engine.enterPointerlock()` / `exitPointerlock()`, on both Engine and WebGPUEngine [src](https://registry.npmjs.org/@babylonjs/core/-/core-9.32.0.tgz). Call it from a click handler [est].

## 7. Scalability

Resolution:
- `engine.setHardwareScalingLevel(n)`: 1 = canvas resolution, 2 = half [src](https://registry.npmjs.org/@babylonjs/core/-/core-9.32.0.tgz).
- `adaptToDeviceRatio` is off by default. It is the 4th Engine argument [src](https://doc.babylonjs.com/features/featuresDeepDive/scene/optimize_your_scene).
- **Use FSR1 rather than plain downscaling** [est].

Adaptive quality: `SceneOptimizer.OptimizeAsync(scene, SceneOptimizerOptions.ModerateDegradationAllowed(target))` [src](https://doc.babylonjs.com/features/featuresDeepDive/scene/sceneOptimizer).
- Options: `targetFrameRate` (60) and `trackerDuration` (2000 ms).
- Built-in steps: MergeMeshes, Shadows, PostProcesses, Particles, LensFlares, `HardwareScalingOptimization(priority, maxScale)`.
- Plus success and failure observables.
- Prefer our own tiered presets driven by frame-time telemetry, and use the optimizer only as a backstop [est].

`scene.performancePriority`:
- **Intermediate** freezes materials and makes meshes unpickable. It also sets `alwaysSelectAsActiveMesh`, which **skips frustum culling**, and turns off `autoClear`.
- **Aggressive** also sets `skipFrustumClipping` and `doNotSyncBoundingInfo`, and keeps render state between frames.
- Neither mode is backward compatible [src](https://doc.babylonjs.com/features/featuresDeepDive/scene/optimize_your_scene).
- **Wrong for an open world**, which needs culling. Apply the individual settings selectively [est].

Other levers [src](https://doc.babylonjs.com/features/featuresDeepDive/scene/optimize_your_scene):
- `material.freeze()`, `mesh.freezeWorldMatrix()`
- `scene.freezeActiveMeshes()`
- `skipPointerMovePicking`
- `blockMaterialDirtyMechanism`
- `engine.maxFPS` caps the frame rate [src](https://registry.npmjs.org/@babylonjs/core/-/core-9.32.0.tgz)

Measuring:
- `EngineInstrumentation`: `gpuFrameTimeCounter`, shader compile time.
- `SceneInstrumentation`: frame, render, active-mesh evaluation, physics, draw calls.
- Read counters in `onAfterRender` [src](https://doc.babylonjs.com/features/featuresDeepDive/scene/optimize_your_scene).
- GPU timing in the Inspector does not work in Chrome unless launched with flags [src](https://doc.babylonjs.com/setup/support/webGPU/webGPUStatus).
- Inspector v2: `ShowInspector` (the old `scene.debugLayer.show` still works) [src](https://doc.babylonjs.com/toolsAndResources/inspectorv2). Load it with a dynamic `import()` in dev builds only [est].

## 8. Shipping

**Static site**
- `vite build --base=./`, then upload `dist/` [src](https://doc.babylonjs.com/guidedLearning/usingVite).
- Self-host Havok, Draco, Basis and KTX2 decoders; the CDN is not for production [src](https://doc.babylonjs.com/features/featuresDeepDive/physics/havokPlugin).
- Serve `.wasm` as `application/wasm` over HTTPS [est].
- Offline caching:
  - The docs say assets go to IndexedDB by default (`enableOfflineSupport`) [src](https://doc.babylonjs.com/features/featuresDeepDive/scene/reducingMemoryUsage).
  - That is outdated: the 9.32 engine source sets `enableOfflineSupport = false` [src](https://registry.npmjs.org/@babylonjs/core/-/core-9.32.0.tgz).
  - **For offline play, use a PWA service worker instead** [est].

**Android APK**
- **Capacitor (v8):**
  - Setup: `npm i @capacitor/core`, then `npm i -D @capacitor/cli`, then `npx cap init` (set `webDir: "dist"`), then `npm i @capacitor/android`, then `npx cap add android`, then `npx cap sync` [src](https://capacitorjs.com/docs/getting-started).
  - Requires API 24+ (Android 7). Uses the Android System WebView on Android 10+ (Chrome 60+ WebView minimum) [src](https://capacitorjs.com/docs/android).
  - WebGPU inside WebView is not confirmed outside the Compatibility-mode intent, so expect WebGL2 on many devices [est].
- **TWA (Bubblewrap / PWABuilder):**
  - Runs the PWA full screen in the user's browser rather than a WebView. It needs `/.well-known/assetlinks.json` matching the signing key, and falls back to a Custom Tab if verification fails.
  - Output is `app-release-signed.apk` [src](https://developer.android.com/develop/ui/views/layout/webapps/guide-trusted-web-activities-version2).
  - WebGPU availability then matches Chrome on Android [est].
  - **Pick TWA if the game is hosted online. Pick Capacitor for a self-contained, offline APK** [est].

**Licences:** Babylon packages are Apache-2.0. Havok (`@babylonjs/havok`) is MIT [src](https://registry.npmjs.org/@babylonjs/havok/latest). Keep the NOTICE/licence text in the app's credits [est].

## 9. Gotchas on phones

- Some Android GPUs (Xclipse, others) have no WebGPU yet, and Firefox Android has it behind a flag. Always test the WebGL2 path [src](https://github.com/gpuweb/gpuweb/wiki/Implementation-Status).
- Havok fails on iOS before 16.4 (no WASM SIMD) [src](https://doc.babylonjs.com/features/featuresDeepDive/physics/havokPlugin).
- CSM, FSR1, Atmosphere and clustered lights need WebGL2 or WebGPU. Clustered lights also need blendable float buffers [src](https://doc.babylonjs.com/features/featuresDeepDive/lights/clusteredLighting).
- GLSL custom shaders on WebGPU trigger a WASM converter download and a slow first frame. Write WGSL [src](https://doc.babylonjs.com/setup/support/webGPU/webGPUWGSL).
- Handle `engine.onContextLostObservable`/`onContextRestoredObservable` (backgrounded tabs) [src](https://doc.babylonjs.com/features/featuresDeepDive/scene/optimize_your_scene).
- `doNotHandleContextLost: true` saves memory, but only if you can rebuild [src](https://doc.babylonjs.com/features/featuresDeepDive/scene/reducingMemoryUsage).
- `VirtualJoystick` swallows GUI and pointer input. Use the GUI joystick [src](https://doc.babylonjs.com/features/featuresDeepDive/input/virtualJoysticks).
- `performancePriority` Intermediate/Aggressive turns off frustum culling [src](https://doc.babylonjs.com/features/featuresDeepDive/scene/optimize_your_scene).
- Thin instances cull all-or-nothing, so chunk them [src](https://doc.babylonjs.com/features/featuresDeepDive/mesh/copies/thinInstances).
- High-DPI screens: keep the hardware scaling level ≥1 and render through FSR1.
- Cap `maxFPS` (e.g. 30 or 60) to limit heat and battery drain.
- Use KTX2/Basis textures to save VRAM [est].
- Defaults per tier [est]:
  - shadow map 1024
  - 2–3 cascades
  - glow `mainTextureRatio` 0.25–0.5
  - FXAA instead of MSAA 4× on low tiers

## Doc links by topic

| Topic | Open these |
|---|---|
| Setup | [ES6 packages](https://doc.babylonjs.com/setup/frameworkPackages/es6Support) · [Tree-shaking/pure](https://doc.babylonjs.com/setup/frameworkPackages/es6Support/treeShaking) · [Pure imports + bundlers](https://doc.babylonjs.com/setup/frameworkPackages/es6Support/treeShaking/usingPureImports) · [Vite](https://doc.babylonjs.com/guidedLearning/usingVite) |
| WebGPU | [Support](https://doc.babylonjs.com/setup/support/webGPU) · [Breaking changes/EngineFactory](https://doc.babylonjs.com/setup/support/webGPU/webGPUBreakingChanges) · [WGSL](https://doc.babylonjs.com/setup/support/webGPU/webGPUWGSL) · [Status](https://doc.babylonjs.com/setup/support/webGPU/webGPUStatus) · [Snapshot](https://doc.babylonjs.com/setup/support/webGPU/webGPUOptimization/webGPUSnapshotRendering) · [Fast path](https://doc.babylonjs.com/setup/support/webGPU/webGPUOptimization/webGPUNonCompatibilityMode) · [Browser matrix](https://github.com/gpuweb/gpuweb/wiki/Implementation-Status) |
| Terrain / big world | [Dynamic Terrain](https://doc.babylonjs.com/communityExtensions/dynamicTerrains) · [Heightmap ground](https://doc.babylonjs.com/features/featuresDeepDive/mesh/creation/set/ground_hmap) · [Large world/floating origin](https://doc.babylonjs.com/features/featuresDeepDive/scene/large_world) |
| Many objects | [Instances](https://doc.babylonjs.com/features/featuresDeepDive/mesh/copies/instances) · [Thin instances](https://doc.babylonjs.com/features/featuresDeepDive/mesh/copies/thinInstances) · [SPS](https://doc.babylonjs.com/features/featuresDeepDive/particles/solid_particle_system/sps_intro) · [LOD](https://doc.babylonjs.com/features/featuresDeepDive/mesh/LOD) · [Simplify](https://doc.babylonjs.com/features/featuresDeepDive/mesh/simplifyingMeshes) · [Occlusion](https://doc.babylonjs.com/features/featuresDeepDive/occlusionQueries) · [Sprites](https://doc.babylonjs.com/features/featuresDeepDive/sprites/sprite_manager) · [Billboard](https://doc.babylonjs.com/features/featuresDeepDive/mesh/billboardMode) |
| Look | [Material plugins](https://doc.babylonjs.com/features/featuresDeepDive/materials/using/materialPlugins) · [Node Material](https://doc.babylonjs.com/features/featuresDeepDive/materials/node_material/nodeMaterial) · [ShaderMaterial](https://doc.babylonjs.com/features/featuresDeepDive/materials/shaders/shaderMaterial) · [Cell material](https://doc.babylonjs.com/toolsAndResources/assetLibraries/materialsLibrary/cellShadingMat) · [Fog](https://doc.babylonjs.com/features/featuresDeepDive/environment/environment_introduction) · [Fog in shaders](https://doc.babylonjs.com/features/featuresDeepDive/materials/shaders/Fog+ShaderMat) · [Sky material](https://doc.babylonjs.com/toolsAndResources/assetLibraries/materialsLibrary/skyMat) · [Atmosphere](https://doc.babylonjs.com/addons/atmosphere) · [CSM](https://doc.babylonjs.com/features/featuresDeepDive/lights/shadows_csm) · [Default pipeline](https://doc.babylonjs.com/features/featuresDeepDive/postProcesses/defaultRenderingPipeline) · [FSR1](https://doc.babylonjs.com/features/featuresDeepDive/postProcesses/FSR1RenderingPipeline) · [Glow](https://doc.babylonjs.com/features/featuresDeepDive/mesh/glowLayer) · [Clustered lights](https://doc.babylonjs.com/features/featuresDeepDive/lights/clusteredLighting) · [Frame Graph](https://doc.babylonjs.com/features/featuresDeepDive/frameGraph) · [GeometryBufferRenderer API](https://doc.babylonjs.com/typedoc/classes/BABYLON.GeometryBufferRenderer) · [PrePassRenderer API](https://doc.babylonjs.com/typedoc/classes/BABYLON.PrePassRenderer) |
| Physics | [Havok plugin](https://doc.babylonjs.com/features/featuresDeepDive/physics/havokPlugin) · [Character controller](https://doc.babylonjs.com/features/featuresDeepDive/physics/characterController) · [Shapes/heightfield](https://doc.babylonjs.com/features/featuresDeepDive/physics/shapes) |
| Input | [DeviceSourceManager](https://doc.babylonjs.com/features/featuresDeepDive/input/deviceSourceManager) · [Gamepads](https://doc.babylonjs.com/features/featuresDeepDive/input/gamepads) · [Virtual joysticks](https://doc.babylonjs.com/features/featuresDeepDive/input/virtualJoysticks) |
| Scalability | [Optimize your scene](https://doc.babylonjs.com/features/featuresDeepDive/scene/optimize_your_scene) · [SceneOptimizer](https://doc.babylonjs.com/features/featuresDeepDive/scene/sceneOptimizer) · [Memory](https://doc.babylonjs.com/features/featuresDeepDive/scene/reducingMemoryUsage) · [Inspector v2](https://doc.babylonjs.com/toolsAndResources/inspectorv2) |
| Shipping | [Capacitor](https://capacitorjs.com/docs/getting-started) · [Capacitor Android](https://capacitorjs.com/docs/android) · [TWA](https://developer.android.com/develop/ui/views/layout/webapps/guide-trusted-web-activities-version2) · [What's new 9.x](https://doc.babylonjs.com/whats-new) |
