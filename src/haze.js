// THE AIR BETWEEN: aerial perspective for every material, in place of the scene's fog. Haze grows with distance and
// stops at a ceiling (HAZE.cap). The ring's air is a thin layer on the floor, so a line of sight up to the arch leaves it.
// Fog would bury the arch; this keeps it, pale and blue, while the land a few kilometres off still fades.
// A Babylon material plugin, written for both GLSL (WebGL2) and WGSL (WebGPU): it mixes toward HAZE.color just before
// the engine's own fog step (CUSTOM_FRAGMENT_BEFORE_FOG).
import { MaterialPluginBase } from '@babylonjs/core';

/** The air: its colour (linear 0..1), how fast it thickens (per metre), and the most it ever hides (0..1). */
export const HAZE = { color: [0.62, 0.74, 0.86], k: 7.5e-5, cap: 0.7 };

/** How hazed a thing d metres off is: the same curve the shaders use (for tests and for baking). */
export const hazeAt = d => HAZE.cap*(1 - Math.exp(-d*HAZE.k));

const GLSL = `#ifdef HAZE
{ float hzD = length(vPositionW - vEyePosition.xyz); color.rgb = mix(color.rgb, haze_color, haze_k.y*(1.0 - exp(-hzD*haze_k.x))); }
#endif`;
const WGSL = `#ifdef HAZE
{ let hzD = length(fragmentInputs.vPositionW - scene.vEyePosition.xyz); color = vec4f(mix(color.rgb, uniforms.haze_color, uniforms.haze_k.y*(1.0 - exp(-hzD*uniforms.haze_k.x))), color.a); }
#endif`;

export class HazePlugin extends MaterialPluginBase {
  constructor(material){ super(material, 'Haze', 200, { HAZE: false }); this._enable(true); }
  getClassName(){ return 'HazePlugin'; }
  isCompatible(){ return true; }
  prepareDefines(defines){ defines.HAZE = true; }
  getUniforms(lang = 0){
    return { ubo: [{ name: 'haze_color', size: 3, type: 'vec3' }, { name: 'haze_k', size: 2, type: 'vec2' }],
      fragment: lang === 1 ? '#ifdef HAZE\nuniform haze_color: vec3f;\nuniform haze_k: vec2f;\n#endif'
        : '#ifdef HAZE\nuniform vec3 haze_color;\nuniform vec2 haze_k;\n#endif' };
  }
  bindForSubMesh(ubo){ const c = HAZE.color; ubo.updateFloat3('haze_color', c[0], c[1], c[2]); ubo.updateFloat2('haze_k', HAZE.k, HAZE.cap); }
  getCustomCode(type, lang = 0){ return type === 'fragment' ? { CUSTOM_FRAGMENT_BEFORE_FOG: lang === 1 ? WGSL : GLSL } : null; }
}

/** Give a material the haze, and take it out of the scene's fog. */
export function hazed(mat){ new HazePlugin(mat); mat.fogEnabled = false; return mat; }
