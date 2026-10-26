// VULPÉA MECHANÓRIA — first light: the engine opened (WebGPU where the browser has it, WebGL2 where not), the seed's
// land laid round you in chunks, a sun and a sky, and a walker's camera: WASD or the arrows and the mouse, a gamepad's
// sticks, or a finger. ?seed=N picks the world; ?gl forces WebGL2; ?q=low|mid|high sets the render scale; ?x=metres round
// the ring and ?pitch=degrees set where you start and how far you look up.
import { Engine, WebGPUEngine, Scene, UniversalCamera, Vector3, HemisphericLight, DirectionalLight, Color3, Color4 } from '@babylonjs/core';
import { makeWorld } from './world/world.js';
import { makeTerrain } from './terrain.js';
import { makeFarRing } from './farRing.js';
import { SKY } from './palette.js';
import { RELEASE } from './release.js';

const Q = new URLSearchParams(location.search), canvas = document.getElementById('view');
const SEED = (+Q.get('seed') || 1793) >>> 0, QUALITY = { low: 2, mid: 1.4, high: 1 }[Q.get('q')] ?? (devicePixelRatio > 1.5 ? 1.5 : 1);

async function openEngine(){
  if(!Q.has('gl') && navigator.gpu){ try { const e = new WebGPUEngine(canvas, { antialias: true }); await e.initAsync(); return e; } catch(err){ console.warn('WebGPU unavailable, using WebGL2:', err); } }
  return new Engine(canvas, true, { preserveDrawingBuffer: false, stencil: true });
}

const engine = await openEngine();
engine.setHardwareScalingLevel(QUALITY);
const scene = new Scene(engine), sky = Color3.FromArray(SKY);
scene.clearColor = Color4.FromColor3(sky, 1);
scene.fogMode = Scene.FOGMODE_EXP2; scene.fogDensity = 0.0002; scene.fogColor = sky;   // (about a third hazed by the chunks' far edge, 3 km off, as the far ring is)

const world = makeWorld(SEED), terrain = makeTerrain(scene, world), far = makeFarRing(scene, world);

const hemi = new HemisphericLight('sky', new Vector3(0, 1, 0), scene); hemi.intensity = 0.55; hemi.groundColor = new Color3(0.32, 0.30, 0.28);
const sun = new DirectionalLight('sun', new Vector3(-0.4, -0.8, 0.45), scene); sun.intensity = 1.1; sun.diffuse = new Color3(1, 0.95, 0.86);

// THE WALKER: eye height 1.7 m over the ground, five metres a second (three times that with Shift). The player stays at
// the scene's origin along the ring: each frame what the camera walked is taken off it and added to the player's place
// round the ring (xp), and the world is turned under them (ring.js); across the band (z) the camera moves as it is.
let xp = ((+Q.get('x') || 0) % world.circumference + world.circumference) % world.circumference;
const groundAt = (x, z) => Math.max(world.height(x, z, 2), world.sea);
const cam = new UniversalCamera('eye', new Vector3(0, groundAt(xp, 0) + 1.7, 0), scene);
cam.setTarget(new Vector3(100, cam.position.y + 100*Math.tan((+Q.get('pitch') || 0)*Math.PI/180), 0)); cam.attachControl(canvas, true);
cam.minZ = 0.2; cam.maxZ = world.radius*2.2; cam.fov = 1.0;
cam.keysUp.push(87); cam.keysDown.push(83); cam.keysLeft.push(65); cam.keysRight.push(68);   // (W S A D)
cam.speed = 0.6; cam.angularSensibility = 3000; cam.inertia = 0.6;
addEventListener('keydown', e => { if(e.key === 'Shift') cam.speed = 1.8; });
addEventListener('keyup', e => { if(e.key === 'Shift') cam.speed = 0.6; });
scene.onBeforeRenderObservable.add(() => {
  const p = cam.position; xp = ((xp + p.x) % world.circumference + world.circumference) % world.circumference; p.x = 0;
  p.z = Math.max(-world.width/2 + 5, Math.min(world.width/2 - 5, p.z)); p.y = groundAt(xp, p.z) + 1.7;
  terrain.update(xp, p.z); far.update(xp); });

const hud = document.getElementById('hud');
if(hud) hud.textContent = `Vulpéa Mechanória · ${RELEASE} · seed ${SEED} · ${engine.isWebGPU ? 'WebGPU' : 'WebGL2'}`;
engine.runRenderLoop(() => scene.render());
addEventListener('resize', () => engine.resize());
window.__vulpea = { engine, scene, world, terrain, where: () => ({ x: xp, z: cam.position.z }), ready: true };
