var e=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path d="M21.5 9.99999L19.3787 12.1213M19.3787 12.1213L17.2574 14.2426M19.3787 12.1213L17.2574 9.99999M19.3787 12.1213L21.5 14.2426M3.75 7.74999H5.35491C5.77433 7.74999 6.18314 7.61813 6.52352 7.37306L11.4578 3.82034C11.7886 3.58221 12.25 3.81856 12.25 4.22611V19.7739C12.25 20.1814 11.7886 20.4178 11.4578 20.1796L6.52352 16.6269C6.18314 16.3818 5.77433 16.25 5.35491 16.25H3.75C2.64543 16.25 1.75 15.3546 1.75 14.25V9.74999C1.75 8.64542 2.64543 7.74999 3.75 7.74999Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
`,t=[`glass`,`silver`,`void`],n=[{id:`af_heart`,label:`Heart`},{id:`af_bella`,label:`Bella`},{id:`am_michael`,label:`Michael`},{id:`bf_emma`,label:`Emma`},{id:`bm_george`,label:`George`},{id:`bm_fable`,label:`Fable`}],r=[{id:`live`,label:`Live`},{id:`readback`,label:`Read back`}],i=[{id:`room`,label:`Room`},{id:`hall`,label:`Hall`},{id:`delay`,label:`Delay`},{id:`radio`,label:`Radio`},{id:`robot`,label:`Robot`}],a={heart:`silver`,speaker:`live`,effect:`room`,voice:`af_heart`,speed:1,energy:1,flare:1,bloom:1,spread:1,rest:.8,view:8,size:.3},o=[{key:`heart`,label:`Heart`,type:`segment`,default:a.heart,options:t.map(e=>({id:e,label:e[0].toUpperCase()+e.slice(1)}))},{key:`rest`,label:`Rest`,type:`range`,min:0,max:1,step:.05,default:a.rest},{key:`view`,label:`View`,type:`range`,min:1,max:40,step:.5,default:a.view},{key:`flare`,label:`Flare`,type:`range`,min:0,max:2,step:.05,default:a.flare},{key:`bloom`,label:`Bloom`,type:`range`,min:0,max:2,step:.05,default:a.bloom},{key:`speed`,label:`Speed`,type:`range`,min:0,max:3,step:.05,default:a.speed},{key:`energy`,label:`Energy`,type:`range`,min:0,max:2,step:.05,default:a.energy},{key:`spread`,label:`Spread`,type:`range`,min:0,max:3,step:.05,default:a.spread},{key:`size`,label:`Size`,type:`range`,min:.08,max:.4,step:.01,default:a.size}],s=`#version 300 es
out vec2 vUv;
void main() {
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  vUv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`,c=`
vec3 finish(vec3 col, vec2 frag) {
  col = 1.0 - exp(-col * 1.1);
  col = pow(max(col, 0.0), vec3(1.0 / 2.2));
  // interleaved gradient noise: an even, grain-free dither
  col += (fract(52.9829189 * fract(dot(frag, vec2(0.06711056, 0.00583715)))) - 0.5) / 255.0;
  return uBg + col * (1.0 - uBg);
}`,l=e=>`#version 300 es
precision highp float;
${e?`#define DIRECT`:``}
uniform vec2 uRes;
uniform float uTime;
uniform float uSize;
uniform float uShift; // the scene's centre, moved up from the stage's (device px)
uniform float uEnergy;
uniform float uSpread;
uniform float uFlare;
uniform float uLive;  // 0 asleep → 1 listening (sprung: it surges past 1 waking)
uniform float uDorm;  // how dormant, 0..1: asleep × Rest (dim, grey, calm, drawn in)
uniform float uVoice; // loudness, 0..1, normalised to the room
uniform vec3 uBands;  // low / mid / high, 0..1
uniform vec3 uMood;   // the felt colour (see MOODS)
uniform float uMoodAmt;    // how strongly it's felt, 0..1
uniform float uMoodEnergy; // calmer (<0) or livelier (>0)
uniform float uView;
uniform int uHeart; // 0 glass orb, 1 silver orb, 2 the void
uniform float uGlass; // the orb's face, 0 silver → 1 glass (eased: it turns as it wakes)
uniform vec2 uTilt; // the hand's parallax: the camera raised (degrees) and turned (radians)
uniform vec3 uBg;
out vec4 outColor;

const int STEPS = 420;
const float R_IN = 2.6;   // the disk's inner edge (just inside the last stable orbit)
const float R_OUT = 11.0; // where it has thinned to nothing
const float B_CRIT = 2.598; // the shadow's radius as seen from far away (3√3/2)

// ── value noise + fbm (the disk's streaks) ──
float hash3(vec3 p) {
  p = fract(p * 0.3183099 + 0.1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}
float vnoise(vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(hash3(i), hash3(i + vec3(1, 0, 0)), f.x),
                 mix(hash3(i + vec3(0, 1, 0)), hash3(i + vec3(1, 1, 0)), f.x), f.y),
             mix(mix(hash3(i + vec3(0, 0, 1)), hash3(i + vec3(1, 0, 1)), f.x),
                 mix(hash3(i + vec3(0, 1, 1)), hash3(i + vec3(1, 1, 1)), f.x), f.y), f.z);
}
float fbm2(vec3 p) {
  return (vnoise(p) * 0.5 + vnoise(p * 2.03 + vec3(1.7, 9.2, 3.1)) * 0.25) / 0.75;
}
float fbm(vec3 p) {
  float a = 0.5, s = 0.0;
  for (int i = 0; i < 4; i++) {
    s += a * vnoise(p);
    p = p * 2.03 + vec3(1.7, 9.2, 3.1);
    a *= 0.5;
  }
  return s / 0.9375;
}

// The disk is SOLID GLASS, not smoke: one wide body and a few outer bands,
// each a smooth slab with crisp edges. Their boundaries wander slowly with
// angle and time (a low-frequency wobble, sheared by the orbit), so the ring
// lives without dissolving into noise.
float band(float r, float a, float b, float e) {
  return smoothstep(a, a + e, r) * (1.0 - smoothstep(b - e, b, r));
}

// Coverage of the disk at radius r, and where across its band the point
// sits (0 at an edge, 1 mid-band) for the glass sheen. Every band edge rides
// its own share of two slow wobble fields (w1, w2 in 0..1), so the bands
// swell, pinch and nearly merge. The outer bands are STREAMS: each covers
// only part of the circle (m, a per-stream mask over angle), so it begins,
// swells, thins into a tail and ends, and the orbit carries it round. That
// is what makes the silhouette pour instead of holding a lens shape.
vec2 slabs(float r, float w1, float w2, float ripple, vec4 m, float E) {
  float u = w1 - 0.5;
  float v = w2 - 0.5;
  float e0 = 4.35 + v * 1.3 + ripple;
  float a1 = 4.55 + v * 0.7 + u * 0.4 + ripple * 0.8, b1 = 5.35 + u * 1.2;
  float a2 = 5.5 + u * 0.9,                          b2 = 6.2 + v * 1.2 + u * 0.3;
  float a3 = 6.35 + v * 0.8,                         b3 = 7.4 - u * 1.1;
  float a4 = 7.6 - v * 0.7,                          b4 = 8.3 + u * 0.8;
  // a stream thins toward its tails, not just fades
  b1 = a1 + max(b1 - a1, 0.12) * m.x; b2 = a2 + max(b2 - a2, 0.1) * m.y;
  b3 = a3 + max(b3 - a3, 0.15) * m.z; b4 = a4 + max(b4 - a4, 0.08) * m.w;
  float cov = band(r, R_IN, e0, E) + band(r, a1, b1, E) * 0.95 * m.x + band(r, a2, b2, E) * 0.85 * m.y
            + band(r, a3, b3, E) * 0.7 * m.z + band(r, a4, b4, E) * 0.5 * m.w;
  float s = 0.0;
  if (r < e0) s = (r - R_IN) / (e0 - R_IN);
  else if (r < b1) s = (r - a1) / max(b1 - a1, 1e-3);
  else if (r < b2) s = (r - a2) / max(b2 - a2, 1e-3);
  else if (r < b3) s = (r - a3) / max(b3 - a3, 1e-3);
  else s = (r - a4) / max(b4 - a4, 1e-3);
  return vec2(cov, 1.0 - abs(2.0 * clamp(s, 0.0, 1.0) - 1.0));
}

// ── THE MATERIAL: dispersive glass light ──
// Any object can wear it: hand it a coverage function sampled at a few
// offsets ACROSS an edge (here: radius), and it returns the light. Six
// wavelengths, each seeing the geometry a hair displaced and carrying its own
// spectral colour, sum back to white where coverage is solid, and fan out into
// a continuous spectrum (warm orange and yellow one side, cyan and blue the
// other) wherever an edge or a thread sits. RGB-only splitting can't do that:
// it fringes in three primaries.
const int TAPS = 6;
vec3 spectral(float x) {
  // x 0..1 → red … violet, a smooth ramp
  return clamp(vec3(
    1.4 - abs(x - 0.08) * 3.6,
    1.25 - abs(x - 0.42) * 3.4,
    1.4 - abs(x - 0.86) * 3.6), 0.0, 1.0);
}

// The threads' own colours: the reference's loop (orange, yellow, cyan, blue,
// magenta, back to orange). Green barely appears in it, so it barely appears
// here; the full spectrum is kept for the edge split above.
vec3 loopColour(float x) {
  x = fract(x) * 5.0;
  vec3 c0 = vec3(1.0, 0.42, 0.08), c1 = vec3(1.0, 0.86, 0.22), c2 = vec3(0.2, 0.86, 1.0),
       c3 = vec3(0.28, 0.36, 1.0), c4 = vec3(1.0, 0.28, 0.74);
  if (x < 1.0) return mix(c0, c1, x);
  if (x < 2.0) return mix(c1, c2, x - 1.0);
  if (x < 3.0) return mix(c2, c3, x - 2.0);
  if (x < 4.0) return mix(c3, c4, x - 3.0);
  return mix(c4, c0, x - 4.0);
}

// Blend two noise samples by weights that sum to 1 WITHOUT losing contrast
// (a plain mix of two unrelated noises flattens toward grey mid-fade).
float vpMix(float a, float b, float wa) {
  float wb = 1.0 - wa;
  return 0.5 + ((a - 0.5) * wa + (b - 0.5) * wb) / sqrt(wa * wa + wb * wb);
}

// Fine threads inside the bands, drawn along the flow: high frequency across
// the radius, low around the orbit, warped by the same wobble so they pour
// with the streams. Crisp (smoothstep), so every thread is an edge to split.
// Sampled in both flow phases (ringA / ringB, weight wa). Where a pixel
// covers more disk than a thread is wide (fp, the footprint), the detail
// fades to its average instead of aliasing.
// COST. This runs per wavelength per disk crossing, the hottest code in the
// experiment (with it, frames alternated 16/33ms; without it, a flat 60), so
// the noise is only computed where it can be seen: the coarse layer (which
// carries the rainbow fringe) per wavelength, the fine layer once per
// crossing (kFine, passed in), and neither where the footprint has faded it.
float threads(float r, vec2 ringA, vec2 ringB, float wa, float w1, float fp, float kFine) {
  float coarse = 1.0 - smoothstep(0.05, 0.14, fp);
  float n = 0.5;
  if (coarse > 0.0) {
    float zn = r * 9.0 + (w1 - 0.5) * 5.0;
    n = vpMix(vnoise(vec3(ringA * 1.4, zn)), vnoise(vec3(ringB * 1.4, zn)), wa);
  }
  float f = mix(0.5, n, coarse) * 0.7 + kFine * 0.3;
  float soft = 0.12 + fp * 2.0;
  return 0.45 + 0.55 * smoothstep(0.5 - soft, 0.5 + soft, f);
}

// The disk's slow shape fields at orbital angle a: two wobbles, the liquid
// ripple, and where round the circle each stream exists.
struct Shape { float w1; float w2; float ripple; vec4 m; };
Shape shapeAt(float a, float r, float t) {
  vec2 ring = vec2(cos(a), sin(a));
  Shape sh;
  // slow, broad wobbles: two octaves carry them (four cost double, unseen)
  sh.w1 = fbm2(vec3(ring * 1.1, r * 0.35 + t * 0.16));
  sh.w2 = fbm2(vec3(ring * 2.3 + 7.0, t * 0.22));
  sh.ripple = 0.22 * sin(a * 3.0 + t * 0.9) + 0.12 * sin(a * 5.0 - t * 1.3);
  for (int i = 0; i < 4; i++) {
    float fi = float(i);
    sh.m[i] = vnoise(vec3(ring * 1.6 + fi * 3.7, t * (0.12 + 0.04 * fi) + fi));
  }
  return sh;
}

// The light a ray picks up crossing the disk plane at p, travelling along v;
// fp is how much disk (in radius) one pixel covers there.
//
// THE FLOW. Inner rings orbit faster than outer ones (Keplerian, ω ∝ r^−1.5),
// which is what shears the streams. Left to run, that shear winds the pattern
// tighter forever: after minutes it is finer than a pixel and the disk turns
// to moiré. So the orbit is split: a rigid turn that runs forever, plus the
// shear, which runs in two copies half a period apart. Each copy resets every
// FLOW_P seconds, but only while its weight is zero, so the eye only ever sees
// a flow that keeps pouring (the flow-map crossfade).
const float OMEGA_REF = 0.33; // the rigid turn: the orbit near mid-disk
const float FLOW_P = 10.0;
vec4 disk(vec3 p, vec3 v, float t, float fp) {
  // awake, it pours harder; spoken to, harder still
  float en = uEnergy * (1.0 + 0.35 * uLive + 0.6 * uVoice) * (1.0 + 0.45 * uMoodEnergy * uMoodAmt) * (1.0 - 0.6 * uDorm);
  float r = length(p.xz);
  if (r < R_IN - 0.3 || r > R_OUT) return vec4(0.0);
  float phi = atan(p.z, p.x);
  float rigid = phi + mod(t * OMEGA_REF, 6.28318);
  float shear = 3.2 * pow(r, -1.5) - OMEGA_REF;
  float tA = mod(t, FLOW_P);
  float tB = mod(t + 0.5 * FLOW_P, FLOW_P);
  float wa = 1.0 - abs(2.0 * tA / FLOW_P - 1.0);
  wa = wa * wa * (3.0 - 2.0 * wa);
  float aA = rigid + shear * tA;
  float aB = rigid + shear * tB;
  Shape A = shapeAt(aA, r, t);
  Shape B = shapeAt(aB, r, t);
  // two slow wobble fields shape the bands (scaled about 0.5 by Energy)
  float w1 = 0.5 + (vpMix(A.w1, B.w1, wa) - 0.5) * en;
  float w2 = 0.5 + (vpMix(A.w2, B.w2, wa) - 0.5) * en;
  // the body's edge ripples like a liquid surface
  float ripple = mix(B.ripple, A.ripple, wa) * en;
  // spoken to, the edge comes alive: the lows deepen the liquid ripple, the
  // mids add a finer, quicker one
  ripple *= 1.0 + 1.8 * uBands.x;
  ripple += 0.14 * uBands.y * sin(rigid * 8.0 - t * 5.0) * smoothstep(R_IN + 0.8, R_IN + 2.0, r);
  // where round the circle each stream exists (soft ends = tails)
  vec4 m;
  for (int i = 0; i < 4; i++) m[i] = smoothstep(0.32, 0.62, vpMix(A.m[i], B.m[i], wa));
  vec2 ringA = vec2(cos(aA), sin(aA));
  vec2 ringB = vec2(cos(aB), sin(aB));

  // edges: crisp, but never thinner than the pixel that draws them
  float E = max(0.04, fp * 1.3);

  // THE VOICE IN THE SHAPE. Loudness swells the whole disk outward (sampling
  // a smaller radius), and rings travel out from the centre through the band
  // edges, so each syllable visibly pushes through it.
  // (dormant, it draws in a little; waking, it breathes back out)
  float swell = (1.0 + 0.1 * uVoice) * (1.0 - 0.06 * uDorm);
  float rings = uVoice * 0.22 * sin(r * 2.6 - t * 7.0) * smoothstep(R_IN + 0.3, R_IN + 1.5, r);
  float rv = r / swell + rings;

  // the material: six wavelengths, each sampling the geometry (slabs ×
  // threads) at its own radius; dispersion grows outward, the hot lip stays
  // nearly white
  float sp = 0.26 * uSpread * (0.4 + 0.6 * smoothstep(R_IN, R_IN + 2.5, r)) * (1.0 - 0.6 * uDorm);
  vec3 light = vec3(0.0);
  vec3 norm = vec3(0.0);
  float covMid = 0.0;
  float across = 0.0;
  // the fine thread layer, once for this crossing (faded where too small)
  float fine = 1.0 - smoothstep(0.025, 0.07, fp);
  float kFine = 0.5;
  if (fine > 0.0) {
    float zk = rv * 17.0 - t * 0.1;
    kFine = mix(0.5, vpMix(vnoise(vec3(ringA * 3.1 + 2.0, zk)), vnoise(vec3(ringB * 3.1 + 2.0, zk)), wa), fine);
  }
  for (int k = 0; k < TAPS; k++) {
    float x = (float(k) + 0.5) / float(TAPS);
    float rk = rv + (x - 0.5) * sp;
    vec2 sl = slabs(rk, w1, w2, ripple, m, E);
    float c = sl.x * threads(rk, ringA, ringB, wa, w1, fp, kFine);
    vec3 w = spectral(x);
    light += w * c;
    norm += w;
    if (k == TAPS / 2) { covMid = sl.x; across = sl.y; }
  }
  vec3 cov = light / norm;

  // sheen across each band: edges catch more light than the middle, the way
  // a glass rod does
  float sheen = 0.7 + 0.6 * pow(1.0 - across, 3.0);
  // a highlight travelling round the ring, light sliding over a solid
  float glint = pow(max(cos(phi - 2.3 + 0.25 * sin(t * 0.3)), 0.0), 10.0);

  // white-hot inside; outward, each thread carries its own spectral colour
  // (hue steps fast across the radius, drifts slowly along the orbit), the
  // reference's orange-beside-yellow-beside-cyan
  float heat = exp(-(r - R_IN) * 0.5);
  float hue = r * 0.42 + (w1 - 0.5) * 0.8 + 0.15 * sin(rigid + 0.6) - t * 0.03;
  vec3 outer = mix(vec3(1.0, 0.55, 0.2), loopColour(hue), 0.82);
  // a felt mood tints the outer streams (the white-hot core stays white)
  outer = mix(outer, uMood * (0.75 + 0.25 * loopColour(hue)), 0.72 * uMoodAmt);
  // white belongs to the hot inner lip only; the streams keep their colour
  vec3 tint = mix(outer, vec3(1.0, 0.98, 0.95), smoothstep(0.32, 0.8, heat));

  // Doppler beaming: the side orbiting toward the camera burns brighter
  vec3 orbit = normalize(vec3(-sin(phi), 0.0, cos(phi)));
  float beam = pow(clamp(1.0 + 0.22 * dot(orbit, -normalize(v)), 0.4, 2.0), 3.0);

  // (dormant, the white-hot lip cools too: it sits far past white, where
  // dimming the whole only reads after the heat itself comes down)
  float lum = (1.5 + 2.0 * heat * (1.0 - 0.8 * uDorm)) * sheen * (1.0 + 1.5 * glint) * beam;
  vec3 c = tint * cov * lum * uFlare * (1.0 + 0.15 * uLive + 0.25 * uVoice);
  // DORMANT: embers. Dimmed and drained toward a warm grey, so waking has
  // somewhere to come up from
  c = mix(c, vec3(dot(c, vec3(0.3, 0.5, 0.2))) * vec3(1.0, 0.88, 0.76), 0.65 * uDorm) * (1.0 - 0.75 * uDorm);
  // solid: the body occludes what's behind it
  float alpha = clamp(covMid * 1.15, 0.0, 0.97);
  return vec4(c, alpha);
}

// ── THE ORB: a glass sphere at the heart, just outside the horizon ──
// Big enough that light bends round it the way it bends round the shadow
// (seen from far away its outline sits almost exactly on the shadow's edge),
// so the disk still arches over it and passes in front. Gravity decides WHERE
// it sits; its FACE is drawn as a sphere looking straight at you, like the
// references: dark glass above, light below, and between them an S-curve
// that wraps with the sphere's curvature and wears the disk's six-wavelength
// dispersion. (A truly lensed orb arrives glancing and rings white; a
// volumetric surface seen from a few degrees above reads as a band, not a
// line. Both were tried.)
//
// o: the point on the face, unit disc, x right / y up; zz: its depth (1 at
// the centre, 0 at the outline); lw: the line's width in face units.
const float R_ORB = 1.6;
const float ORB_EDGE_B = 2.6128; // its outline: R / sqrt(1 − 1/R), where rays just graze it
// The S-curve at x for strand k (0 = the main curve). Awake it moves more;
// the lows lift it, the mids ripple it.
float orbCurve(float x, float t, float k) {
  // awake, it breathes even in silence (so you can see it's listening)
  float amp = (1.0 + uLive * (0.3 + 0.18 * sin(t * 2.1)) + 0.8 * uBands.x + 0.35 * uVoice) * (1.0 - 0.65 * uDorm);
  float ph = k * 1.7;
  float y = 0.17 * amp * sin(x * 2.3 + t * 0.85 + ph)
          + 0.07 * (1.0 + 1.2 * uBands.y) * sin(x * 4.7 - t * 1.25 - ph * 0.6)
          + 0.025 * uBands.y * sin(x * 9.0 - t * 4.0 + ph * 2.0);
  return (y * (1.0 - 0.28 * k) + 0.12) * sqrt(max(1.0 - x * x * 0.55, 0.0));
}

vec3 orbShade(vec2 o, float zz, float t, float glass, float lw) {
  // the curve, following the sphere's curvature toward the outline
  float yw = orbCurve(o.x, t, 0.0);
  float d = o.y - yw;
  float fill = smoothstep(lw, -lw, d);
  // the dark glass: truly dark (0.004 linear reads ~30/255 after gamma)
  vec3 col = vec3(0.0004, 0.0004, 0.0007);
  // glass: coloured light pooled just under the curve, dying into the dark
  // glass (the Siri redesign): magenta → blue → cyan across the face
  vec3 tint = loopColour(0.5 + o.x * 0.3 + 0.08 * sin(t * 0.3));
  tint = mix(tint, uMood, 0.7 * uMoodAmt);
  vec3 glassC = tint * fill * (exp(d * (4.0 - 1.2 * uVoice)) * (0.9 + 0.5 * uLive + 0.9 * uVoice) + 0.04);
  // silver: liquid metal, brighter toward the bottom where it catches the
  // light (the macOS 27 orb)
  vec3 silverC = mix(vec3(0.72, 0.75, 0.82), uMood * 0.85, 0.45 * uMoodAmt) * fill * (0.16 + 0.34 * smoothstep(0.2, -0.95, o.y));
  // one turns into the other by POURING: the glass spreads from the middle
  // of the curve outward (and drains back the same way), a soft front
  // travelling across the face, never the whole face cross-fading at once
  float far = length(vec2(o.x, d * 1.6));
  // (the last tenth sweeps the front past the whole face: a curve lifted
  // by a loud voice reaches further than the resting one, and must not keep
  // a silver crescent at the bottom of a glass orb)
  float front = mix(-0.1, 2.6, glass) + 2.0 * smoothstep(0.9, 1.0, glass);
  col += mix(silverC, glassC, 1.0 - smoothstep(front - 0.35, front, far)) * (1.0 - 0.65 * uDorm);
  // the limb: a sphere darkens toward its outline
  col *= 0.35 + 0.65 * zz;

  // the curve itself: six wavelengths, each a hair higher or lower
  vec3 line = vec3(0.0);
  vec3 lnorm = vec3(0.0);
  for (int k = 0; k < TAPS; k++) {
    float x = (float(k) + 0.5) / float(TAPS);
    float dk = d + (x - 0.5) * 0.04 * uSpread * (1.0 + 1.5 * uBands.z);
    vec3 w = spectral(x);
    line += w * exp(-dk * dk / (lw * lw));
    lnorm += w;
  }
  col += (line / lnorm * (2.2 + 0.8 * uLive + 1.6 * uBands.z + 1.0 * uVoice) + exp(-d * d / 0.003) * (0.12 + 0.12 * uLive + 0.25 * uVoice)) * (1.0 - 0.6 * uDorm);

  // while you speak, fainter strands of the curve fan out round the main one,
  // each in its own colour (Siri's waves splitting)
  for (int s = 1; s <= 2; s++) {
    float ks = float(s);
    float ds = o.y - orbCurve(o.x, t, ks);
    float wk = lw * 1.4;
    vec3 sc = loopColour(0.45 + 0.22 * ks + o.x * 0.15);
    col += sc * exp(-ds * ds / (wk * wk)) * uVoice * (1.1 / ks) * zz;
  }

  // the glass: a rim lit warm by the disk all round it, a soft key above
  // (wide and low: a luminous falloff into the edge, not a drawn rim)
  float fres = pow(1.0 - zz, 2.5);
  col += fres * vec3(1.0, 0.86, 0.7) * (0.04 + 0.14 * smoothstep(0.4, -0.5, o.y));
  vec2 key = o - vec2(-0.32, 0.5);
  // (faint and tight: gamma lifts tiny linear values, and a broad 0.05 key
  // read as a grey dome over the dark glass)
  col += exp(-dot(key, key) * 14.0) * vec3(0.9, 0.93, 1.0) * 0.012;
  return col * uFlare;
}

${e?c:``}

void main() {
  vec2 frag = gl_FragCoord.xy;
  float sh = min(uRes.x, uRes.y);
  vec2 uv = (frag - 0.5 * uRes - vec2(0.0, uShift)) / sh;
  float t = uTime;

  // camera: on a circle level with the disk, raised uView degrees (the hand
  // raises and turns it a little: uTilt), looking at the hole; the lens is
  // set so the shadow spans uSize of the short side
  float D = 26.0;
  float el = radians(max(uView + uTilt.x, 1.0));
  vec3 ro = vec3(sin(uTilt.y) * cos(el), sin(el), cos(uTilt.y) * cos(el)) * D;
  vec3 fw = normalize(-ro);
  vec3 rt = normalize(cross(fw, vec3(0.0, 1.0, 0.0)));
  vec3 up = cross(rt, fw);
  float k = (B_CRIT / D) / (uSize * 0.5);
  vec3 rd = normalize(fw + (uv.x * rt + uv.y * up) * k);
  // one pixel's angular size: with distance travelled, the footprint
  float pa = k / sh;

  // ── step the photon through the hole's gravity
  vec3 pos = ro;
  vec3 vel = rd;
  vec3 hv = cross(pos, vel);
  float h2 = dot(hv, hv);
  vec3 col = vec3(0.0);
  float alpha = 0.0;
  // light that has already wrapped round the hole once (the under-arc, the
  // ring hugging the shadow) is real but should whisper, not compete
  float pass_ = 1.0;
  float swallowed = 0.0;
  float travelled = 0.0;
  // the orb: rays carry on through it, so its edge can fade into the disk
  // wrapping behind; what lay in FRONT of it is kept apart
  float reached = 0.0;
  vec3 colFront = vec3(0.0);
  float alphaFront = 0.0;
  for (int i = 0; i < STEPS; i++) {
    float r2 = dot(pos, pos);
    if (r2 < 1.0) { swallowed = 1.0; break; } // fell in (alpha stays = the disk in front)
    // "behind" begins once the ray passes close to the orb, touching it or not
    // (rays that just miss it skim the photon sphere and gather speckle)
    if (uHeart < 2 && reached < 0.5 && r2 < (R_ORB + 0.2) * (R_ORB + 0.2)) {
      reached = 1.0;
      colFront = col;
      alphaFront = alpha;
      // aimed inside the edge (+ the fade's margin), nothing behind will show
      // (see "behind" below): stop here and save the steps
      if (sqrt(h2) < ORB_EDGE_B + 0.03) break;
    }
    float r = sqrt(r2);
    // small steps near the hole (finest where light orbits it, so the thin
    // ring hugging the shadow stays clean), long strides far out
    float dt = clamp(mix(0.022, 0.06, smoothstep(2.0, 4.5, r)) * r, 0.02, 1.2);
    travelled += dt;
    vec3 prev = pos;
    vel += -1.5 * h2 * pos / (r2 * r2 * r) * dt;
    pos += vel * dt;
    // the third and later images of the disk are thinner than a pixel: sampled,
    // they speckle. Past the second pass, the photon ring below stands in
    if (prev.y * pos.y < 0.0 && pass_ > 0.2) {
      vec3 cross_ = mix(prev, pos, prev.y / (prev.y - pos.y));
      // a pixel's footprint on the disk: wider with distance, much wider at
      // a grazing angle (the disk is seen nearly edge-on)
      float fp = pa * travelled / max(abs(normalize(vel).y), 0.03);
      // lensing squeezes the second image (the under-arc, the far side's wrap)
      // far below the pixel: draw it blurred, never sampled sharp
      // (and past the point where the thread noise switches off: it's cheap)
      if (pass_ < 1.0) fp += 0.16;
      vec4 d = disk(cross_, vel, t, fp);
      // the disk's underside (rays curling up under the hole: the under-arc)
      // glows faintly; its top surface carries the light
      float side = vel.y > 0.0 ? 0.22 : 1.0;
      col += (1.0 - alpha) * d.rgb * pass_ * side;
      alpha += (1.0 - alpha) * d.a * pass_ * side;
      pass_ *= 0.3;
      if (alpha > 0.99) break;
    } else if (prev.y * pos.y < 0.0) {
      pass_ *= 0.3;
    }
    // escaped: heading out past the disk's edge, a ray never turns back (in
    // this gravity an outgoing ray outside the photon sphere climbs forever)
    // and any plane it crosses out here holds no disk. Exact, and it spares
    // every background pixel the long climb it used to make to r = 40
    if (r2 > (R_OUT + 0.5) * (R_OUT + 0.5) && dot(pos, vel) > 0.0) break;
  }

  // The shadow, its edge and the photon ring all come from the IMPACT
  // PARAMETER b: how far off-centre the ray was aimed. It's set by the pixel
  // alone and varies smoothly across the screen, and Schwarzschild is exact
  // about it: aimed inside 3√3/2, the ray falls in. Anything measured along
  // the ray (closest approach, step count) flips within a sliver thinner than
  // a pixel there, and speckles.
  float b = sqrt(h2);
  float px = pa * D; // one pixel, in impact-parameter units
  float edgeB = B_CRIT;
  if (uHeart < 2) {
    // the orb: its outline is where rays just graze r = R_ORB
    edgeB = ORB_EDGE_B;
  }
  float inside = 1.0 - smoothstep(edgeB - px, edgeB + px, b);
  if (uHeart < 2) {
    if (reached < 0.5) { colFront = col; alphaFront = alpha; }
    // a soft edge: the orb fades over the outer ~6% of its radius, into
    // whatever lies behind it (the lensed disk), never cut on one pixel
    inside = 1.0 - smoothstep(edgeB - 0.16, edgeB + px, b);
    // only light from OUTSIDE the critical radius shows through the fade: inside
    // it, rays circle the hole before falling in and their disk light is
    // sub-pixel speckle
    vec3 behind = (col - colFront) * smoothstep(edgeB + 0.03, edgeB + 0.14, b);
    col = colFront + (1.0 - inside) * behind;
    if (inside > 0.0) {
      // Gravity decides WHERE the orb sits (its outline, what passes in front
      // of it), but its face is shaded as a plain sphere looking at you. Rays
      // that truly reach it arrive glancing (it sits just outside the photon
      // sphere, where light bends hardest), and a glancing orb rings white
      // all over; the references are calm, front-on spheres.
      float rUv = edgeB / (D * k); // the orb's radius on screen, in uv
      vec2 o = uv / rUv;
      float zz = sqrt(max(1.0 - dot(o, o), 0.0));
      float lw = max(0.012, 1.2 / (rUv * sh)); // never thinner than a pixel
      col += (1.0 - alphaFront) * orbShade(o, zz, t, uGlass, lw) * inside;
    }
  } else {
    // behind whatever disk lies in front, the shadow is black
    col *= 1.0 - inside * (1.0 - alpha);
  }
  // the photon ring: one clean hairline hugging the void (an orb has a soft
  // edge instead; a hairline round it read as an ink outline)
  if (uHeart == 2) {
    float pr = (b - edgeB - 1.5 * px) / max(px * 1.2, 0.004);
    col += vec3(1.0, 0.93, 0.85) * 0.55 * exp(-pr * pr) * (1.0 - alpha) * uFlare;
  }

#ifdef DIRECT
  outColor = vec4(finish(col, frag), 1.0);
#else
  // alpha marks the void, so the finish keeps the bloom out of it (the mask
  // fades across the edge with b, never stepping pixel by pixel). An orb
  // shines, so it takes the bloom.
  // (an orb's dark glass mostly keeps the disk's bloom off it too)
  float hole = uHeart < 2 ? inside * (1.0 - alphaFront) * 0.92 : max(inside, smoothstep(B_CRIT + 0.35, B_CRIT, b)) * (1.0 - alpha);
  outColor = vec4(col, hole);
#endif
}`,u=`#version 300 es
precision highp float;
uniform sampler2D uSrc;
uniform vec2 uTexel;
uniform float uKnee; // first pass only: keep just the light past white
in vec2 vUv;
out vec4 outColor;
vec3 tap(vec2 uv) {
  vec3 c = texture(uSrc, uv).rgb;
  if (uKnee > 0.0) {
    float l = max(c.r, max(c.g, c.b));
    c *= smoothstep(uKnee, uKnee * 2.0, l);
  }
  return c;
}
void main() {
  vec2 h = uTexel * 0.5;
  vec3 c = tap(vUv) * 4.0;
  c += tap(vUv - h);
  c += tap(vUv + h);
  c += tap(vUv + vec2(h.x, -h.y));
  c += tap(vUv - vec2(h.x, -h.y));
  outColor = vec4(c / 8.0, 1.0);
}`,d=`#version 300 es
precision highp float;
uniform sampler2D uSrc;
uniform vec2 uTexel;
in vec2 vUv;
out vec4 outColor;
void main() {
  vec2 h = uTexel * 0.5;
  vec3 c = texture(uSrc, vUv + vec2(-h.x * 2.0, 0.0)).rgb;
  c += texture(uSrc, vUv + vec2(-h.x, h.y)).rgb * 2.0;
  c += texture(uSrc, vUv + vec2(0.0, h.y * 2.0)).rgb;
  c += texture(uSrc, vUv + vec2(h.x, h.y)).rgb * 2.0;
  c += texture(uSrc, vUv + vec2(h.x * 2.0, 0.0)).rgb;
  c += texture(uSrc, vUv + vec2(h.x, -h.y)).rgb * 2.0;
  c += texture(uSrc, vUv + vec2(0.0, -h.y * 2.0)).rgb;
  c += texture(uSrc, vUv + vec2(-h.x, -h.y)).rgb * 2.0;
  outColor = vec4(c / 12.0, 1.0);
}`,f=`#version 300 es
precision highp float;
uniform sampler2D uScene;
uniform sampler2D uBloom;
uniform float uBloomAmt;
uniform float uCA;
uniform vec3 uBg;
in vec2 vUv;
out vec4 outColor;
${c}
void main() {
  // lens fringe: red and blue land a hair apart, more toward the frame's edge
  vec2 ca = (vUv - 0.5) * 0.006 * uCA;
  vec3 scene = vec3(texture(uScene, vUv + ca).r, texture(uScene, vUv).g, texture(uScene, vUv - ca).b);
  // the shadow stays black: bloom doesn't wash into it
  float hole = texture(uScene, vUv).a;
  vec3 col = scene + texture(uBloom, vUv).rgb * 0.11 * uBloomAmt * (1.0 - 0.9 * hole);
  outColor = vec4(finish(col, gl_FragCoord.xy), 1.0);
}`,p=6,m=[10/255,10/255,11/255],h=`exp-orb-style`,g=`
.orb{position:absolute;inset:0;overflow:hidden;background:#0a0a0b;}
.orb canvas{position:absolute;inset:0;display:block;width:100%;height:100%;}
.orb__note{position:absolute;inset:0;display:grid;place-items:center;color:#8a8a8a;font:14px/1.4 system-ui,sans-serif;}
.orb__ctl{position:absolute;left:50%;top:0;display:flex;gap:8px;transform:translateX(-50%);z-index:2;}
.orb__unit{display:flex;align-items:center;}
.orb__mic{position:relative;width:52px;height:52px;flex-shrink:0;display:grid;place-items:center;
  padding:0;border-radius:14px;cursor:pointer;color:#ececec;background:rgba(255,255,255,0.07);
  border:1px solid rgba(255,255,255,0.14);
  transition:border-color 180ms ease,scale 160ms ease-out;}
.orb__mic svg{width:24px;height:24px;display:block;}
/* masked labels (rise in, drop out) */
.orb__m{display:inline-block;overflow:hidden;vertical-align:top;}
.orb__m>span{display:inline-block;}
/* A :: type on the stage */
.orb__line2{position:absolute;left:50%;top:0;transform:translateX(-50%);display:flex;align-items:baseline;gap:18px;
  font:400 14px/20px var(--font-sans);letter-spacing:-0.005em;white-space:nowrap;}
.orb__line2[hidden]{display:none;}
.orb__words{display:flex;gap:18px;}
.orb__mode,.orb__word{padding:4px 0 6px;border:0;background:none;cursor:pointer;font:inherit;letter-spacing:inherit;
  color:#7d7d7d;transition:color 150ms ease;}
.orb__mode{color:#9a9a9a;}
.orb__word[aria-checked="true"]{color:#ececec;}
.orb__mode:focus-visible,.orb__word:focus-visible{outline:2px solid #ececec;outline-offset:2px;border-radius:2px;}
@media (hover:hover) and (pointer:fine){.orb__mode:hover,.orb__word:hover{color:#ececec;}}
.orb__rule{position:absolute;left:0;bottom:0;height:1px;background:#ececec;transform-origin:0 50%;
  transition:transform 280ms cubic-bezier(0.23,1,0.32,1),width 280ms cubic-bezier(0.23,1,0.32,1);}
/* C :: the margin console */
.orb__desk{position:absolute;right:56px;top:0;display:flex;flex-direction:column;align-items:flex-end;gap:30px;
  font-family:var(--font-sans);}
.orb__desk[hidden]{display:none;}
.orb__sect{display:flex;flex-direction:column;align-items:flex-end;gap:8px;}
.orb__head{margin:0;font:400 11px/14px var(--font-sans);letter-spacing:0.08em;text-transform:uppercase;color:#6f6f6f;}
.orb__list{position:relative;display:flex;flex-direction:column;align-items:flex-end;gap:2px;}
.orb__item{padding:2px 0;border:0;background:none;cursor:pointer;font:400 15px/24px var(--font-sans);letter-spacing:-0.005em;
  color:#7d7d7d;transition:color 150ms ease;}
.orb__item[aria-checked="true"]{color:#ececec;}
.orb__item:focus-visible{outline:2px solid #ececec;outline-offset:2px;border-radius:2px;}
@media (hover:hover) and (pointer:fine){.orb__item:hover{color:#ececec;}}
.orb__tick{position:absolute;left:0;top:0;width:14px;height:1px;background:#ececec;transform-origin:100% 50%;
  transition:transform 280ms cubic-bezier(0.23,1,0.32,1);}
@media (prefers-reduced-motion:reduce){.orb__rule,.orb__tick{transition:none;}}
.orb__mic:active{scale:0.96;}
@media (hover:hover) and (pointer:fine){.orb__mic:hover{border-color:rgba(255,255,255,0.32);}}
.orb__mic:focus-visible{outline:2px solid #ececec;outline-offset:3px;}
.orb__mic[aria-pressed="true"]{background:#ececec;color:#0a0a0b;border-color:#ececec;}
.orb__mic[data-state="blocked"]{color:#8a8a8a;cursor:not-allowed;}
.orb__status{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;}
.orb__cap{position:absolute;left:50%;top:0;width:min(560px,calc(100% - 48px));transform:translateX(-50%);
  display:flex;flex-direction:column;align-items:center;pointer-events:none;}
.orb__line{position:relative;align-self:stretch;margin:0;min-height:2.9em;font:400 17px/1.45 var(--font-sans);letter-spacing:-0.01em;color:#ececec;
  text-align:center;text-wrap:balance;}
.orb__w{display:inline-block;overflow:hidden;vertical-align:top;padding:0 0.13em 0.06em;}
.orb__w>span{display:inline-block;transition:color 240ms ease;}
.orb__w.is-live>span{color:#7a7a7a;}
.orb__offer{pointer-events:auto;padding:6px 10px;border:0;border-radius:8px;background:none;cursor:pointer;
  font:400 13px/1.3 var(--font-sans);font-variant-numeric:tabular-nums;color:#8a8a8a;transition:color 180ms ease;}
.orb__offer:disabled{cursor:default;}
.orb__offer:focus-visible{outline:2px solid #ececec;outline-offset:2px;}
@media (hover:hover) and (pointer:fine){.orb__offer:not(:disabled):hover{color:#ececec;}}
`;function _(){if(document.getElementById(h))return;let e=document.createElement(`style`);e.id=h,e.textContent=g,document.head.appendChild(e)}function ee(e,t){let n=(t,n)=>{let r=e.createShader(t);if(e.shaderSource(r,n),e.compileShader(r),!e.getShaderParameter(r,e.COMPILE_STATUS))throw Error(e.getShaderInfoLog(r)??`shader`);return r},r=e.createProgram();if(e.attachShader(r,n(e.VERTEX_SHADER,s)),e.attachShader(r,n(e.FRAGMENT_SHADER,t)),e.linkProgram(r),!e.getProgramParameter(r,e.LINK_STATUS))throw Error(e.getProgramInfoLog(r)??`link`);let i={};return{p:r,u:t=>t in i?i[t]:i[t]=e.getUniformLocation(r,t)}}var v=`http://www.w3.org/2000/svg`,y=[3.75,7.75,12,16.25,20.25],te=[1.25,6.25,2.25,4.25,1.25],b=`1.5`,ne=(e,t)=>({x:0,v:0,to:0,at:0,k:e,c:t});function x(e,t,n){let r=n>=e.at?e.to:1-e.to;for(let n=t;n>0;n-=1/240){let t=Math.min(n,1/240);e.v+=(e.k*(r-e.x)-e.c*e.v)*t,e.x+=e.v*t}}var re=(e,t)=>x(e,t,1/0),ie=(e,t,n)=>{e.k=t,e.c=2*n*Math.sqrt(t)},S=e=>Math.round(e*1e3)/1e3,ae=(e,t,n,r)=>r<.01?`M${e} ${S(t)}V${S(n)}`:`M${S(e-r)} ${S(t+r)}A${S(r)} ${S(r)} 0 0 1 ${S(e+r)} ${S(t+r)}V${S(n-r)}A${S(r)} ${S(r)} 0 0 1 ${S(e-r)} ${S(n-r)}Z`;function oe(e){let t=document.createElementNS(v,`svg`);t.setAttribute(`viewBox`,`0 0 24 24`),t.setAttribute(`fill`,`none`),t.setAttribute(`aria-hidden`,`true`),t.setAttribute(`shape-rendering`,`geometricPrecision`);let n=(e,n,r=t)=>{let i=document.createElementNS(v,e);for(let e in n)i.setAttribute(e,n[e]);return r.appendChild(i),i},r=new WeakMap,i=(e,t,n)=>{let i=r.get(e);i||r.set(e,i={}),i[t]!==n&&(i[t]=n,e.setAttribute(t,n))},a={stroke:`currentColor`,"stroke-width":b,"stroke-linecap":`round`,"stroke-linejoin":`round`},o=n(`g`,{});n(`path`,{...a,"vector-effect":`non-scaling-stroke`,d:`M5.124 14.5C6.281 17.149 8.924 19 12 19C15.075 19 17.719 17.149 18.876 14.5`},o),n(`path`,{...a,"vector-effect":`non-scaling-stroke`,d:`M12 19V21.25`},o);let s=n(`path`,{...a}),c=y.map((e,t)=>t===2?null:n(`path`,a)),l=n(`path`,{fill:`currentColor`,d:`M17.24 5.185L16.544 3.373C16.457 3.148 16.241 3 16 3C15.759 3 15.543 3.148 15.456 3.373L14.76 5.185C14.658 5.449 14.449 5.658 14.185 5.76L12.373 6.456C12.148 6.543 12 6.759 12 7C12 7.241 12.148 7.457 12.373 7.544L14.185 8.24C14.449 8.342 14.658 8.551 14.76 8.815L15.456 10.627C15.543 10.852 15.759 11 16 11C16.241 11 16.457 10.852 16.544 10.627L17.24 8.815C17.342 8.551 17.551 8.342 17.815 8.24L19.627 7.544C19.852 7.457 20 7.241 20 7C20 6.759 19.852 6.543 19.627 6.456L17.815 5.76C17.551 5.658 17.342 5.449 17.24 5.185Z`}),u=(e,t)=>ne(e,2*t*Math.sqrt(e)),d={spark:u(150,.75),fold:u(140,.95),capW:u(200,.92),capH:u(115,.8),inner:u(155,.75),outer:u(155,.75)},f=Object.keys(d),p={spark:0,fold:.04,capW:.08,capH:.17,inner:.22,outer:.27},m={outer:0,inner:.035,capH:.07,capW:.11,fold:.145,spark:.18},h=Object.fromEntries(f.map(e=>[e,d[e].k])),g=te.map(e=>({...u(260,.7),x:e,to:e})),_=0,ee=!1,re=(e,t)=>Math.abs(e.x-t)<1e-4&&Math.abs(e.v)<1e-4,ie=e=>{if(!ee)return!1;for(let e of f)if(_<d[e].at||!re(d[e],d[e].to))return!1;for(let t=0;t<g.length;t++)if(!re(g[t],e[t]))return!1;return!0},oe=t=>{for(let n of f){let r=h[n]*(t?1:1.35);d[n].c*=Math.sqrt(r/d[n].k),d[n].k=r,d[n].to=+!!t,d[n].at=_+(e?0:(t?p:m)[n]),e&&(d[n].x=d[n].to,d[n].v=0)}},se=(t,n)=>{let r=Math.min(t,1/30);if(_+=r,ie(n))return;if(ee=!0,!e)for(let e of f)x(d[e],r,_);g.forEach((e,t)=>{e.to=n[t],e.at=0,x(e,r,_)});let a=g.map(e=>Math.max(0,e.x)),u=d.spark.x;u>=.995?i(l,`visibility`,`hidden`):(i(l,`visibility`,`visible`),i(l,`transform`,`translate(16 7) rotate(${S(90*u)}) scale(${S(Math.max(0,1-u))}) translate(-16 -7)`));let p=d.capW.x,m=d.capH.x,h=2.75+(12-a[2]-2.75)*m,v=15.75+(12+a[2]-15.75)*m;i(s,`d`,ae(12,h,v,Math.max(0,4.25*(1-p))));let te=Math.min(1,Math.max(0,d.fold.x));te>=.995?i(o,`visibility`,`hidden`):(i(o,`visibility`,`visible`),i(o,`transform`,`translate(12 ${S(v)}) scale(${S(1-te)}) translate(-12 -15.75)`)),c.forEach((e,t)=>{if(!e)return;let n=t===0||t===4?d.outer.x:d.inner.x;if(n<=.005)return i(e,`visibility`,`hidden`);i(e,`visibility`,`visible`);let r=12+(y[t]-12)*Math.min(n,1),o=a[t]*n;i(e,`d`,`M${S(r)} ${S(12-o)}V${S(12+o)}`)})};return se(0,te),{svg:t,set:oe,step:se,settled:()=>d.outer.to===1&&d.outer.x>.98}}var se=()=>window.SpeechRecognition??window.webkitSpeechRecognition,ce=(e,t,n)=>Promise.race([e,new Promise(e=>setTimeout(()=>e(n),t))]);async function le(e){let t=se();if(!t||typeof t.available!=`function`)return`unavailable`;for(let n of[`dictation`,void 0])try{let r=await ce(t.available({langs:[e],processLocally:!0,...n?{quality:n}:{}}),2500,`unavailable`);if(r===`available`)return`available`;if(r===`downloadable`||r===`downloading`)return`downloadable`}catch{}return`unavailable`}function ue(e,t){let n=se(),r=null,i=!1,a=()=>{let r=new n;if(!(`processLocally`in r)&&!(`options`in r))throw Error(`no on-device recognition`);r.lang=e,r.continuous=!0,r.interimResults=!0,`processLocally`in r&&(r.processLocally=!0),`options`in r&&(r.options={langs:[e],processLocally:!0});let a=``,o=0;return r.onresult=e=>{let n=``;for(let t=e.resultIndex;t<e.results.length;t++){let r=e.results[t][0].transcript.trim();e.results[t].isFinal?a=`${a} ${r}`.trim():n=`${n} ${r}`.trim()}t.show(a,n),clearTimeout(o),o=window.setTimeout(()=>{a&&=(t.end(),``)},1500)},r.onerror=e=>{e.error!==`no-speech`&&e.error!==`aborted`&&(i=!1,t.failed(e.error))},r.onend=()=>{if(i)try{r.start()}catch{}},r};return{start(){i=!0,r??=a(),r.start()},stop(){i=!1,r?.stop()},destroy(){i=!1,r?.abort(),r=null}}}var de=``,C=`@huggingface/transformers@4.2.0/dist/transformers.min.js`,w=`phonemizer@1.2.1/dist/phonemizer.js`,T=`
const SR = 16000, FRAME = 512;
const SPEECH = 0.3, EXIT = 0.1;              // VAD: start / keep-going probability
const MIN_SILENCE = 0.4 * SR;                // a pause this long ends a segment
const PAD = 0.08 * SR, MIN_SPEECH = 0.25 * SR;
const MAX = 30 * SR;                         // Moonshine's window
const PARTIAL_MIN = 0.25 * SR;               // new audio before another live read
const WINDOW = 6 * SR, WINDOW_HARD = 10 * SR, SEARCH = 1.5 * SR;
const GAP = 0.15;                            // a real gap: energy < 15% of the median
const TOKENS_PER_SECOND = 6.5;               // Moonshine's own cap against loops
const DTYPES = { webgpu: { encoder_model: "fp32", decoder_model_merged: "q4" },
                 wasm:   { encoder_model: "fp32", decoder_model_merged: "q8" } };
let T, vad, asr, feel, runtime;
const loads = {};
// one honest progress figure per part: only big files count (a small one
// finishing first would read 100%), and it never goes backwards
const progressFor = (part) => {
  const files = new Map(); let shown = 0;
  return (p) => {
    if (p.status !== "progress" || !p.file || !p.total || p.total < 4e6) return;
    files.set(p.file, p);
    let l = 0, t = 0; for (const f of files.values()) { l += f.loaded || 0; t += f.total; }
    shown = Math.max(shown, t ? l / t : 0);
    postMessage({ type: "progress", part, value: shown });
  };
};
async function boot({ runtime: url, host }) {
  T = await import(url);
  if (host) {
    T.env.remoteHost = host + "/hf/";
    T.env.backends.onnx.wasm.wasmPaths = host + "/npm/onnxruntime-web@" + T.env.backends.onnx.versions.web + "/dist/";
  }
}
// MOOD: a 4.5 MB TinyBERT reads six emotions from settled text; on the CPU
// (it's instant there, and the GPU stays with the scene and the captions)
async function loadMood() {
  feel = await T.pipeline("text-classification", "AdamCodd/tinybert-emotion-balanced", { dtype: "q8", device: "wasm" });
  postMessage({ type: "ready", part: "mood" });
}
async function loadCaptions() {
  const progress = progressFor("captions");
  const device = (await navigator.gpu?.requestAdapter().catch(() => null)) ? "webgpu" : "wasm";
  vad = await T.AutoModel.from_pretrained("onnx-community/silero-vad",
    { config: { model_type: "custom" }, dtype: "fp32", progress_callback: progress });
  asr = await T.pipeline("automatic-speech-recognition", "onnx-community/moonshine-base-ONNX",
    { device, dtype: DTYPES[device], progress_callback: progress });
  postMessage({ type: "preparing", part: "captions" }); // downloaded; shaders compile next
  await asr(new Float32Array(SR));
  sr = new T.Tensor("int64", [SR], []); state = fresh();
  postMessage({ type: "ready", part: "captions", device });
}

// VOICE: Kokoro-82M speaks text back. Measured on an M-series Mac: fp32 on
// WebGPU runs ~4.7x real time; q8 on the CPU only ~0.64x (the page isn't
// cross-origin isolated, so ONNX gets one thread); fp16 on WebGPU outputs NaN.
// So: fp32 on the GPU where there is one, q8 on the CPU where there isn't. Text → phonemes (espeak-ng via the phonemizer package) →
// tokens → a waveform, sentence by sentence so playback starts on the
// first. The text handling is ported from kokoro-js (Apache-2.0).
let tts, ttsTok, phon, voiceHost, speakId = 0;
const voiceData = new Map();
async function loadVoice({ phonemizer, host }) {
  voiceHost = host;
  const progress = progressFor("voice");
  phon = await import(phonemizer);
  const gpu = await navigator.gpu?.requestAdapter().catch(() => null);
  [tts, ttsTok] = await Promise.all([
    T.StyleTextToSpeech2Model.from_pretrained("onnx-community/Kokoro-82M-v1.0-ONNX",
      gpu ? { dtype: "fp32", device: "webgpu", progress_callback: progress } : { dtype: "q8", device: "wasm", progress_callback: progress }),
    T.AutoTokenizer.from_pretrained("onnx-community/Kokoro-82M-v1.0-ONNX", { progress_callback: progress }),
  ]);
  postMessage({ type: "ready", part: "voice" });
}
// a voice is 510 style vectors (one per input length), ~0.5 MB, cached
async function voiceStyles(id) {
  if (voiceData.has(id)) return voiceData.get(id);
  const url = (voiceHost ? voiceHost + "/hf" : "https://huggingface.co") + "/onnx-community/Kokoro-82M-v1.0-ONNX/resolve/main/voices/" + id + ".bin";
  let cache = null, buf = null;
  try { cache = await caches.open("orb-voices"); const hit = await cache.match(url); if (hit) buf = await hit.arrayBuffer(); } catch {}
  if (!buf) {
    const r = await fetch(url);
    if (!r.ok) throw new Error("voice " + id + ": " + r.status);
    buf = await r.arrayBuffer();
    try { await cache?.put(url, new Response(buf.slice(0))); } catch {}
  }
  const data = new Float32Array(buf);
  voiceData.set(id, data);
  return data;
}
// numbers read the way people say them: years, times, money, decimals
function sayNumber(m) {
  if (m.includes(".")) return m;
  if (m.includes(":")) {
    const [h, mm] = m.split(":").map(Number);
    return mm === 0 ? h + " o'clock" : mm < 10 ? h + " oh " + mm : h + " " + mm;
  }
  const y = parseInt(m.slice(0, 4), 10);
  if (y < 1100 || y % 1000 < 10) return m;
  const left = m.slice(0, 2), right = parseInt(m.slice(2, 4), 10), s = m.endsWith("s") ? "s" : "";
  if (y % 1000 >= 100 && y % 1000 <= 999) {
    if (right === 0) return left + " hundred" + s;
    if (right < 10) return left + " oh " + right + s;
  }
  return left + " " + right + s;
}
function sayMoney(m) {
  const unit = m[0] === "$" ? "dollar" : "pound";
  if (isNaN(Number(m.slice(1)))) return m.slice(1) + " " + unit + "s";
  if (!m.includes(".")) return m.slice(1) + " " + unit + (m.slice(1) === "1" ? "" : "s");
  const [whole, part] = m.slice(1).split(".");
  const d = parseInt(part.padEnd(2, "0"), 10);
  return whole + " " + unit + (whole === "1" ? "" : "s") + " and " + d + " " +
    (m[0] === "$" ? (d === 1 ? "cent" : "cents") : d === 1 ? "penny" : "pence");
}
const sayPoint = (m) => { const [a, b] = m.split("."); return a + " point " + b.split("").join(" "); };
function normalize(t) {
  return t
    .replace(/[‘’]/g, "'").replace(/«/g, "“").replace(/»/g, "”").replace(/[“”]/g, '"')
    .replace(/\\(/g, "«").replace(/\\)/g, "»")
    .replace(/[^\\S \\n]/g, " ").replace(/  +/, " ").replace(/(?<=\\n) +(?=\\n)/g, "")
    .replace(/\\bD[Rr]\\.(?= [A-Z])/g, "Doctor")
    .replace(/\\b(?:Mr\\.|MR\\.(?= [A-Z]))/g, "Mister")
    .replace(/\\b(?:Ms\\.|MS\\.(?= [A-Z]))/g, "Miss")
    .replace(/\\b(?:Mrs\\.|MRS\\.(?= [A-Z]))/g, "Mrs")
    .replace(/\\betc\\.(?! [A-Z])/gi, "etc")
    .replace(/\\b(y)eah?\\b/gi, "$1e'a")
    .replace(/\\d*\\.\\d+|\\b\\d{4}s?\\b|(?<!:)\\b(?:[1-9]|1[0-2]):[0-5]\\d\\b(?!:)/g, sayNumber)
    .replace(/(?<=\\d),(?=\\d)/g, "")
    .replace(/[$£]\\d+(?:\\.\\d+)?(?: hundred| thousand| (?:[bm]|tr)illion)*\\b|[$£]\\d+\\.\\d\\d?\\b/gi, sayMoney)
    .replace(/\\d*\\.\\d+/g, sayPoint)
    .replace(/(?<=\\d)-(?=\\d)/g, " to ")
    .replace(/(?<=\\d)S/g, " S")
    .replace(/(?<=[BCDFGHJ-NP-TV-Z])'?s\\b/g, "'S")
    .replace(/(?<=X')S\\b/g, "s")
    .replace(/(?:[A-Za-z]\\.){2,} [a-z]/g, (m) => m.replace(/\\./g, "-"))
    .replace(/(?<=[A-Z])\\.(?=[A-Z])/gi, "-")
    .trim();
}
const PUNCT = /(\\s*[;:,.!?¡¿—…"«»“”(){}[\\]]+\\s*)+/g;
async function phonemes(text, lang) {
  text = normalize(text);
  const parts = [];
  let last = 0;
  for (const m of text.matchAll(PUNCT)) {
    if (last < m.index) parts.push({ punct: false, t: text.slice(last, m.index) });
    if (m[0]) parts.push({ punct: true, t: m[0] });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ punct: false, t: text.slice(last) });
  const code = lang === "a" ? "en-us" : "en";
  let ph = (await Promise.all(parts.map(async ({ punct, t }) => (punct ? t : (await phon.phonemize(t, code)).join(" "))))).join("");
  ph = ph.replace(/kəkˈoːɹoʊ/g, "kˈoʊkəɹoʊ").replace(/kəkˈɔːɹəʊ/g, "kˈəʊkəɹəʊ")
    .replace(/ʲ/g, "j").replace(/r/g, "ɹ").replace(/x/g, "k").replace(/ɬ/g, "l")
    .replace(/(?<=[a-zɹː])(?=hˈʌndɹɪd)/g, " ").replace(/ z(?=[;:,.!?¡¿—…"«»“” ]|$)/g, "z");
  if (lang === "a") ph = ph.replace(/(?<=nˈaɪn)ti(?!ː)/g, "di");
  return ph.trim();
}
async function speakText({ id, text, voice, speed }) {
  speakId = id;
  const styles = await voiceStyles(voice);
  const sentences = text.match(/[^.!?…]+[.!?…]*["')\\]]*\\s*/g) || [text];
  for (const s of sentences) {
    if (id !== speakId) return; // hushed or superseded
    const t = s.trim();
    if (!t) continue;
    const { input_ids } = ttsTok(await phonemes(t, voice[0]), { truncation: true });
    const off = 256 * Math.min(Math.max(input_ids.dims.at(-1) - 2, 0), 509);
    const style = new T.Tensor("float32", styles.slice(off, off + 256), [1, 256]);
    const { waveform } = await (chain = chain.then(() => tts({ input_ids, style, speed: new T.Tensor("float32", [speed], [1]) })));
    if (id !== speakId) return;
    const pcm = new Float32Array(waveform.data);
    postMessage({ type: "speech", id, pcm, rate: 24000 }, [pcm.buffer]);
  }
  postMessage({ type: "spoken", id });
}
let chain = Promise.resolve(), state, sr;
const BUF = new Float32Array(MAX);
let at = 0, rec = false, after = 0, since = 0, busy = false, win = 0, prev = [];
const fresh = () => new T.Tensor("float32", new Float32Array(256), [2, 1, 128]);
async function speech(frame) {
  const input = new T.Tensor("float32", frame, [1, frame.length]);
  const { output, stateN } = await (chain = chain.then(() => vad({ input, sr, state })));
  state = stateN;
  const p = output.data[0];
  return p > SPEECH || (rec && p >= EXIT);
}
function audio(end) {
  const lead = prev.reduce((n, b) => n + b.length, 0), out = new Float32Array(lead + end);
  let o = 0; for (const b of prev) { out.set(b, o); o += b.length; }
  out.set(BUF.subarray(0, end), o);
  return out;
}
async function read(a, kind, w) {
  const max_new_tokens = Math.max(8, Math.ceil(a.length / SR * TOKENS_PER_SECOND));
  const r = await (chain = chain.then(() => asr(a, { max_new_tokens })));
  const text = ((Array.isArray(r) ? r[0]?.text : r.text) || "").trim();
  if (kind === "partial" && w !== win) return;    // that window has moved on
  postMessage({ type: kind, text, window: w });
}
function commitOlder() {
  const en = [];
  for (let s = Math.max(FRAME, at - SEARCH); s + FRAME <= at - FRAME; s += FRAME) {
    let e = 0; for (let i = s; i < s + FRAME; i++) e += BUF[i] * BUF[i];
    en.push({ s, e });
  }
  if (!en.length) return;
  const median = [...en].sort((a, b) => a.e - b.e)[en.length >> 1].e;
  const q = en.reduce((a, b) => (b.e < a.e ? b : a));
  if (q.e > median * GAP && at < WINDOW_HARD) return;   // wait for a real gap
  const split = q.s + FRAME / 2;
  read(audio(split), "commit", win); win++;
  prev = [];                                     // no lead-in: it would re-hear the last word
  BUF.copyWithin(0, split, at); at -= split; BUF.fill(0, at); since = 0;
}
function endSegment() {
  if (at >= MIN_SPEECH) read(audio(Math.min(at + PAD, MAX)), "final", win);
  win++; BUF.fill(0); at = 0; rec = false; after = 0; since = 0;
}
async function hear(frame) {
  const was = rec, isSpeech = await speech(frame);
  if (!was && !isSpeech) { if (prev.length >= Math.ceil(PAD / FRAME)) prev.shift(); prev.push(frame); return; }
  if (frame.length >= MAX - at) { endSegment(); return; }
  BUF.set(frame, at); at += frame.length; since += frame.length;
  if (isSpeech) {
    rec = true; after = 0;
    if (since >= PARTIAL_MIN && !busy) { since = 0; busy = true; read(audio(at), "partial", win).finally(() => (busy = false)); }
    if (at >= WINDOW) commitOlder();
    return;
  }
  after += frame.length;
  if (after >= MIN_SILENCE) endSegment();
}
onmessage = (e) => {
  const m = e.data;
  if (m.type === "load") {
    runtime ??= boot(m);
    const loader = { captions: loadCaptions, mood: loadMood, voice: loadVoice }[m.part];
    loads[m.part] ??= runtime.then(() => loader(m)).catch((err) => {
      loads[m.part] = null;
      postMessage({ type: "error", part: m.part, message: String(err?.message ?? err) });
    });
    return;
  }
  if (m.type === "mood") {
    if (!feel) return;
    feel(m.text, { top_k: null }).then((scores) => postMessage({ type: "mood", id: m.id, scores }));
    return;
  }
  if (m.type === "speak") {
    if (tts) speakText(m).catch((err) => postMessage({ type: "spoken", id: m.id, error: String(err?.message ?? err) }));
    return;
  }
  if (m.type === "hush") { speakId = -1; return; }
  if (!asr || !state) return;
  if (m.type === "audio") hear(m.buffer);
  else if (m.type === "flush") { if (rec) endSegment(); prev = []; state = fresh(); }
};
`,E=`
class OrbTap extends AudioWorkletProcessor {
  constructor() { super(); this.ratio = sampleRate / 16000; this.pos = 0; this.acc = 0; this.n = 0; this.out = new Float32Array(512); this.k = 0; }
  process(inputs) {
    const ch = inputs[0] && inputs[0][0];
    if (!ch) return true;
    for (let i = 0; i < ch.length; i++) {
      this.acc += ch[i]; this.n++; this.pos += 1;
      if (this.pos >= this.ratio) {
        this.pos -= this.ratio; this.out[this.k++] = this.acc / this.n; this.acc = 0; this.n = 0;
        if (this.k === 512) { this.port.postMessage(this.out, [this.out.buffer]); this.out = new Float32Array(512); this.k = 0; }
      }
    }
    return true;
  }
}
registerProcessor("orb-tap", OrbTap);
`;function D(e){let t=e.split(/\s+/).filter(Boolean),n=e=>e?.toLowerCase().replace(/[^a-z']/g,``);for(let e=1;e<=4;e++)for(let r=0;r+3*e<=t.length;r++){let i=(r,i)=>{for(let a=0;a<e;a++)if(n(t[r+a])!==n(t[i+a]))return!1;return!0},a=1;for(;r+(a+1)*e<=t.length&&i(r,r+a*e);)a++;a>=3&&(t=[...t.slice(0,r+e),...t.slice(r+a*e)])}return t.join(` `).replace(/\bi\b/g,`I`).replace(/\bi'(m|ve|ll|d)\b/g,`I'$1`)}function fe(e,t){return e?t?`${e} ${!/[.?!]$/.test(e)&&!/^I(\b|')/.test(t)?t.charAt(0).toLowerCase()+t.slice(1):t}`:e:t}function pe(e){let t=URL.createObjectURL(new Blob([T],{type:`text/javascript`})),n=new Worker(t,{type:`module`});URL.revokeObjectURL(t);let r={},i=e||`https://cdn.jsdelivr.net`,a=0;return{worker:n,need(t){return r[t]??=new Promise((a,o)=>{let s=e=>{let i=e.data;i.type!==`ready`&&i.type!==`error`||i.part!==t||(n.removeEventListener(`message`,s),i.type===`ready`?a():(delete r[t],o(Error(`${t} failed to load`))))};n.addEventListener(`message`,s),n.postMessage({type:`load`,part:t,runtime:`${i}/npm/${C}`,phonemizer:`${i}/npm/${w}`,host:e})})},classify(e){let t=++a;return new Promise(r=>{let i=e=>{let a=e.data;a.type===`mood`&&a.id===t&&(n.removeEventListener(`message`,i),r(a.scores??[]))};n.addEventListener(`message`,i),n.postMessage({type:`mood`,id:t,text:e})})},speak(e,t,r,i){n.postMessage({type:`speak`,id:e,text:t,voice:r,speed:i})},hush(){n.postMessage({type:`hush`})},destroy(){n.terminate()}}}function me(e,t){let{worker:n}=t,r=null,i=``;n.addEventListener(`message`,t=>{let n=t.data;if(n.type===`progress`&&n.part===`captions`)e.progress(n.value??0);else if(n.type===`preparing`&&n.part===`captions`)e.progress(-1);else if(n.type===`partial`&&n.text)e.show(i,fe(i,D(n.text)).slice(i.length).trim());else if(n.type===`commit`)n.text&&(i=fe(i,D(n.text))),e.show(i,``);else if(n.type===`final`){let t=fe(i,D(n.text??``));i=``,t&&e.show(t,``),e.end()}else n.type===`error`&&n.part===`captions`&&e.failed(n.message??`error`)});let a=()=>t.need(`captions`);return{load:a,async start(e){if(await a(),r)return;i=``;let t=new AudioContext,o=URL.createObjectURL(new Blob([E],{type:`text/javascript`}));await t.audioWorklet.addModule(o),URL.revokeObjectURL(o);let s=new AudioWorkletNode(t,`orb-tap`);s.port.onmessage=e=>n.postMessage({type:`audio`,buffer:e.data},[e.data.buffer]);let c=t.createGain();c.gain.value=0,t.createMediaStreamSource(e).connect(s).connect(c).connect(t.destination),r={ctx:t,node:s}},stop(){r&&(r.node.port.onmessage=null,r.ctx.close(),r=null,n.postMessage({type:`flush`}))},destroy(){this.stop()}}}var O={joy:{rgb:[1,.68,.18],energy:.5},love:{rgb:[1,.32,.55],energy:.2},surprise:{rgb:[.25,.85,1],energy:.8},sadness:{rgb:[.1,.26,1],energy:-.6},fear:{rgb:[.78,.2,.95],energy:.35},anger:{rgb:[1,.1,.08],energy:.9}};function he(e){let t=e.reduce((e,t)=>t.score>e.score?t:e,{label:``,score:0});if(t.score<.45)return null;let n=0,r=0,i=0,a=0,o=0;for(let{label:t,score:s}of e){let e=O[t];if(!e||s<.15)continue;let c=s*s;n+=e.rgb[0]*c,r+=e.rgb[1]*c,i+=e.rgb[2]*c,a+=e.energy*c,o+=c}if(!o)return null;let s=Math.min(1,Math.max(0,(t.score-.45)/.45));return{rgb:[n/o,r/o,i/o],energy:a/o,amt:s*s*(3-2*s),label:t.label}}function ge(e,t){let n=e.createBiquadFilter();n.type=`highpass`,n.frequency.value=90;let r=e.createDynamicsCompressor();r.threshold.value=-20,r.ratio.value=3,r.attack.value=.004,r.release.value=.2;let i=e.createDynamicsCompressor();i.threshold.value=-3,i.ratio.value=20,i.attack.value=.001,i.release.value=.1;let a=e.createGain();a.gain.value=0,t.connect(n).connect(r),i.connect(a).connect(e.destination);let o=(t,n)=>{let r=Math.floor(e.sampleRate*t),i=e.createBuffer(2,r,e.sampleRate);for(let e=0;e<2;e++){let t=i.getChannelData(e);for(let e=0;e<r;e++)t[e]=(Math.random()*2-1)*(1-e/r)**n}let a=e.createConvolver();return a.buffer=i,a},s=t=>{let n=e.createGain();return n.gain.value=t,n},c=[],l=null,u=t=>{for(let e of c)e.disconnect();l?.stop(),l=null,r.disconnect();let n=(...e)=>(c.push(...e),e[0]);c=[];let a=(e,t)=>{let r=n(s(t));e.connect(r).connect(i)},u=e=>a(r,e);if(t===`hall`){u(.8);let e=n(o(2.8,2.2));r.connect(e),a(e,.5)}else if(t===`delay`){u(1);let t=n(e.createDelay(1));t.delayTime.value=.23;let i=n(s(.34));r.connect(t),t.connect(i).connect(t),a(t,.45)}else if(t===`radio`){let t=n(e.createBiquadFilter());t.type=`highpass`,t.frequency.value=500;let i=n(e.createBiquadFilter());i.type=`lowpass`,i.frequency.value=3200;let o=n(e.createWaveShaper()),s=new Float32Array(1024);for(let e=0;e<1024;e++){let t=e/1023*2-1;s[e]=Math.tanh(2.6*t)}o.curve=s,r.connect(t).connect(i).connect(o),a(o,.8)}else if(t===`robot`){let t=n(s(0));l=e.createOscillator(),l.frequency.value=55,l.connect(t.gain),l.start();let i=n(e.createDelay(.05));i.delayTime.value=.009;let o=n(s(.55));r.connect(t),t.connect(i),i.connect(o).connect(i),a(t,1.2),a(i,.6)}else{u(1);let e=n(o(.7,3));r.connect(e),a(e,.18)}};u(`room`);let d=!1,f=0,p=-9;return{setOn(t){d=t,a.gain.setTargetAtTime(t?.95:0,e.currentTime,.03)},setEffect:u,guard(e,t){if(!d)return!1;let n=0,r=0;for(let t=2;t<e.length;t++)e[t]>n&&(n=e[t],r=t);let i=0;for(let t=2;t<e.length;t++)Math.abs(t-r)>2&&e[t]>i&&(i=e[t]);let a=n>190&&n-i>70,o=Math.abs(r-p)<=1;return p=r,f=a&&o?f+t:0,f<.6?!1:(f=0,this.setOn(!1),!0)},destroy(){l?.stop(),a.disconnect()}}}function _e(e,t){let n=document.createElement(`div`);n.className=`orb__cap`,n.setAttribute(`aria-hidden`,`true`);let r=document.createElement(`p`);r.className=`orb__line`;let i=document.createElement(`button`);i.type=`button`,i.className=`orb__offer`,i.hidden=!0,n.append(r,i),e.appendChild(n);let a=[],o=!1,s=()=>{if(o)return!0;let e=a.shift();return e?(i.textContent=e.text,i.hidden=!1,i.disabled=!1,i.onclick=()=>{i.onclick=null,i.hidden=!0,e.act(),i.hidden&&s()},!0):!1},c=[],l=!1,u=`cubic-bezier(0.23, 1, 0.32, 1)`,d=(e,n)=>{t||e.inner.animate([{transform:`translateY(110%)`},{transform:`translateY(0)`}],{duration:380,delay:n*28,easing:`cubic-bezier(0.16, 1, 0.3, 1)`,fill:`backwards`})},f=(e,n)=>{if(e.outer.classList.add(`is-leaving`),t)return e.outer.remove();let i=r.getBoundingClientRect(),a=n??e.outer.getBoundingClientRect();Object.assign(e.outer.style,{position:`absolute`,left:`${a.left-i.left}px`,top:`${a.top-i.top}px`}),e.inner.animate([{transform:`translateY(0)`},{transform:`translateY(-110%)`}],{duration:220,easing:u,fill:`forwards`}).finished.then(()=>e.outer.remove(),()=>e.outer.remove())};return{box:n,show(e,n){let a=new Map(c.map(e=>[e,e.outer.getBoundingClientRect()]));l&&=(c.forEach(e=>f(e,a.get(e))),c=[],!1),i.hidden=!0;let o=[...e.split(/\s+/).filter(Boolean).map(e=>({t:e,live:!1})),...n.split(/\s+/).filter(Boolean).map(e=>({t:e,live:!0}))],s=Math.max(0,o.length-16),p=o.slice(s),m=Math.min(s,c.length);for(let e=0;e<m;e++)f(c[e],a.get(c[e]));c=c.slice(m);let h=0;if(p.forEach((e,n)=>{let i=c[n];if(i)i.text!==e.t&&!t&&i.inner.animate([{filter:`blur(3px)`},{filter:`blur(0)`}],{duration:140,easing:`ease-out`});else{let e=document.createElement(`span`);e.className=`orb__w`;let t=document.createElement(`span`);e.appendChild(t),r.appendChild(e),i={outer:e,inner:t,text:``},c[n]=i,d(i,h++)}i.text!==e.t&&(i.text=e.t,i.inner.textContent=e.t),i.outer.classList.toggle(`is-live`,e.live)}),c.slice(p.length).forEach(e=>f(e,a.get(e))),c=c.slice(0,p.length),!t)for(let e of c){let t=a.get(e);if(!t)continue;let n=e.outer.getBoundingClientRect(),r=t.left-n.left,i=t.top-n.top;Math.abs(r)+Math.abs(i)<.5||e.outer.animate([{transform:`translate(${r}px, ${i}px)`},{transform:`translate(0, 0)`}],{duration:280,easing:u})}},end(){l=!0,c.forEach(e=>e.outer.classList.remove(`is-live`))},clear:()=>{let e=c.map(e=>e.outer.getBoundingClientRect());c.forEach((t,n)=>f(t,e[n])),c=[]},offer(e,t){a.push({text:e,act:t}),i.hidden&&s()},say(e){o=!0,i.textContent=e,i.hidden=!1,i.disabled=!0,i.onclick=null},quiet(){o=!1,s()||(i.hidden=!0)}}}var ve={mount(o,s={}){_();let c=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,h={...a},g=document.createElement(`div`);g.className=`orb`;let v=document.createElement(`canvas`);g.appendChild(v);let y=document.createElement(`button`);y.type=`button`,y.className=`orb__mic`,y.setAttribute(`aria-pressed`,`false`),y.setAttribute(`aria-label`,`Talk to the orb`);let b=oe(c);y.appendChild(b.svg);let x=document.createElement(`p`);x.className=`orb__status`,x.setAttribute(`aria-live`,`polite`);let S=document.createElement(`button`);S.type=`button`,S.className=`orb__mic orb__spk`,S.setAttribute(`aria-pressed`,`false`),S.setAttribute(`aria-label`,`Speak back`),S.innerHTML=e;let ae=document.createElement(`div`);ae.className=`orb__ctl`;let ce=document.createElement(`div`);ce.className=`orb__unit`,ce.appendChild(S),ae.append(y,ce),g.append(ae,x);let C=_e(g,c);o.appendChild(g);let w=v.getContext(`webgl2`,{antialias:!1,alpha:!1});if(!w){let e=document.createElement(`p`);return e.className=`orb__note`,e.textContent=`This one needs WebGL2.`,g.appendChild(e),()=>g.remove()}let T=!!w.getExtension(`EXT_color_buffer_float`)||!!w.getExtension(`EXT_color_buffer_half_float`);w.getExtension(`OES_texture_half_float_linear`);let E=ee(w,l(!T)),D=T?ee(w,u):null,fe=T?ee(w,d):null,O=T?ee(w,f):null;w.bindVertexArray(w.createVertexArray());let ve=(e,t)=>{let n=w.createTexture();w.bindTexture(w.TEXTURE_2D,n),w.texImage2D(w.TEXTURE_2D,0,w.RGBA16F,e,t,0,w.RGBA,w.HALF_FLOAT,null),w.texParameteri(w.TEXTURE_2D,w.TEXTURE_MIN_FILTER,w.LINEAR),w.texParameteri(w.TEXTURE_2D,w.TEXTURE_MAG_FILTER,w.LINEAR),w.texParameteri(w.TEXTURE_2D,w.TEXTURE_WRAP_S,w.CLAMP_TO_EDGE),w.texParameteri(w.TEXTURE_2D,w.TEXTURE_WRAP_T,w.CLAMP_TO_EDGE);let r=w.createFramebuffer();return w.bindFramebuffer(w.FRAMEBUFFER,r),w.framebufferTexture2D(w.FRAMEBUFFER,w.COLOR_ATTACHMENT0,w.TEXTURE_2D,n,0),{fbo:r,tex:n,w:e,h:t}},k=null,A=[],ye=()=>{for(let e of[k,...A])e&&(w.deleteFramebuffer(e.fbo),w.deleteTexture(e.tex));k=null,A=[]},j=2,M=1,be=()=>{ye();let e=Math.max(1,Math.round(v.width*M)),t=Math.max(1,Math.round(v.height*M));k=ve(e,t);let n=e,r=t;for(let e=0;e<p;e++)n=Math.max(1,n>>1),r=Math.max(1,r>>1),A.push(ve(n,r))},xe=()=>{Ce();let e=Math.max(1,g.clientWidth*g.clientHeight),t=Math.min(window.devicePixelRatio||1,j,Math.sqrt(26e5/e)),n=Math.max(1,Math.round(g.clientWidth*t)),r=Math.max(1,Math.round(g.clientHeight*t));v.width===n&&v.height===r&&(k||!T)||(v.width=n,v.height=r,T&&be())},N=null;function Se(e,t){let n=Math.min(e,t),r=.5*Math.min(h.size,.92*e/(3.3*n))*n,i=66+(N?.capOffset??(e<760?36:0))+16,a=t-72;3.28*r+32+52+2*i>a&&(r=Math.max(24,(a-2*i-32-52)/3.28));let o=a-(3.28*r+32+52),s=(o>=2*i?o/2:Math.max(16,o-i))+1.76*r;return{r,cy:s,size:2*r/n}}function Ce(){let{r:e,cy:t}=Se(g.clientWidth,g.clientHeight),n=t+1.52*e+32;ae.style.top=`${n}px`;let r=N?.capOffset??0;N?.id===`a`&&(N.root.style.top=`${n+52+16}px`),N?.id===`c`&&N.place?.(t),C.box.style.top=`${n+52+16+r}px`}let we=new ResizeObserver(xe);we.observe(g),xe();let Te=(e,t,n)=>{w.useProgram(e.p),w.bindFramebuffer(w.FRAMEBUFFER,t?t.fbo:null),w.viewport(0,0,t?t.w:v.width,t?t.h:v.height),n&&(w.activeTexture(w.TEXTURE0),w.bindTexture(w.TEXTURE_2D,n.tex),w.uniform1i(e.u(`uSrc`),0),w.uniform2f(e.u(`uTexel`),1/n.w,1/n.h)),w.drawArrays(w.TRIANGLES,0,3)},Ee=(e,n)=>{w.useProgram(E.p);let r=k?k.w:v.width,i=k?k.h:v.height;w.uniform2f(E.u(`uRes`),r,i),w.uniform1f(E.u(`uTime`),e);let a=g.clientHeight||1;if(w.uniform1f(E.u(`uSize`),n.size),w.uniform1f(E.u(`uShift`),(a/2-n.cy)*(i/a)),w.uniform1f(E.u(`uEnergy`),h.energy),w.uniform1f(E.u(`uSpread`),h.spread),w.uniform1f(E.u(`uFlare`),h.flare),w.uniform1f(E.u(`uView`),h.view),w.uniform1i(E.u(`uHeart`),Math.max(0,t.indexOf(h.heart))),w.uniform1f(E.u(`uGlass`),Z.x),w.uniform1f(E.u(`uLive`),De),w.uniform1f(E.u(`uDorm`),Oe),w.uniform1f(E.u(`uVoice`),Me),w.uniform3f(E.u(`uBands`),I[0],I[1],I[2]),w.uniform3f(E.u(`uMood`),z.rgb[0],z.rgb[1],z.rgb[2]),w.uniform1f(E.u(`uMoodAmt`),z.amt),w.uniform1f(E.u(`uMoodEnergy`),z.energy),w.uniform2f(E.u(`uTilt`),X[0].x,X[1].x),w.uniform3f(E.u(`uBg`),...m),!T||!k||!D||!fe||!O){Te(E,null,null);return}Te(E,k,null);let o=k;for(let e of A)w.useProgram(D.p),w.uniform1f(D.u(`uKnee`),e===A[0]?1.7:0),Te(D,e,o),o=e;w.enable(w.BLEND),w.blendFunc(w.ONE,w.ONE);for(let e=A.length-2;e>=0;e--)Te(fe,A[e],A[e+1]);w.disable(w.BLEND),w.useProgram(O.p),w.activeTexture(w.TEXTURE0),w.bindTexture(w.TEXTURE_2D,k.tex),w.uniform1i(O.u(`uScene`),0),w.activeTexture(w.TEXTURE1),w.bindTexture(w.TEXTURE_2D,A[0].tex),w.uniform1i(O.u(`uBloom`),1),w.uniform1f(O.u(`uBloomAmt`),h.bloom*(1-.55*Oe)),w.uniform1f(O.u(`uCA`),h.spread),w.uniform3f(O.u(`uBg`),...m),w.bindFramebuffer(w.FRAMEBUFFER,null),w.viewport(0,0,v.width,v.height),w.drawArrays(w.TRIANGLES,0,3)},P=null,F=!1,De=0,Oe=0,ke=ne(40,1.1*Math.sqrt(40)),Ae=0,je=0,Me=0,I=[0,0,0],Ne=[.05,.05,.05,.05],Pe=(e,t)=>{y.dataset.state=e,y.setAttribute(`aria-pressed`,e===`listening`?`true`:`false`),y.setAttribute(`aria-label`,e===`listening`?`Stop listening`:e===`blocked`?`Microphone blocked`:`Talk to the orb`),e===`blocked`?(y.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path d="M16.25 11.5V7C16.25 4.65279 14.3472 2.75 12 2.75C10.6334 2.75 9.41741 3.39504 8.63994 4.39727M3 3L7.75 7.75M7.75 7.75V11.5C7.75 13.8472 9.65279 15.75 12 15.75C13.0463 15.75 14.0043 15.3719 14.7449 14.7449M7.75 7.75L14.7449 14.7449M14.7449 14.7449L17.0474 17.0474M21 21L17.0474 17.0474M12 19C8.92453 19 6.2814 17.1489 5.12407 14.5M12 19V21.25M12 19C13.9439 19 15.715 18.2605 17.0474 17.0474" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
`,y.firstElementChild?.animate([{scale:`0.25`},{scale:`1`}],{duration:200,easing:`cubic-bezier(0.2, 0, 0, 1)`})):y.contains(b.svg)||y.replaceChildren(b.svg),x.textContent=t},Fe=navigator.language||`en-US`,Ie=`orb:captions`,Le=()=>{try{return localStorage.getItem(Ie)===`on`}catch{return!1}},Re=()=>{try{localStorage.setItem(Ie,`on`)}catch{}},L=null,ze=!1,Be=``,R=null,Ve=()=>R??=pe(s.captionHost??de),z={rgb:[1,1,1],amt:0,energy:0},B={rgb:[1,1,1],amt:0,energy:0},He=0,Ue=!1,We=0,Ge=``,Ke=`orb:mood`,qe=async e=>{if(!Ue||!R||!e.trim())return;let t=he(await R.classify(e));if(He=performance.now(),Ge=t?.label??``,!t)return void(B.amt=0);B.rgb=t.rgb,B.energy=t.energy,B.amt=t.amt},Je=e=>{B.amt>0&&performance.now()-He>1e4&&(B.amt=0);let t=1-Math.exp(-e*2.5);for(let e=0;e<3;e++)z.rgb[e]+=(B.rgb[e]-z.rgb[e])*t;z.amt+=(B.amt-z.amt)*t,z.energy+=(B.energy-z.energy)*t},Ye=async()=>{try{await Ve().need(`mood`),Ue=!0}catch{}},Xe=()=>{if(Ue)return;let e=!1;try{e=localStorage.getItem(Ke)===`on`}catch{}if(e)return void Ye();C.offer(`Mood :: let the orb feel what you say, ~27 MB once`,()=>{try{localStorage.setItem(Ke,`on`)}catch{}C.quiet(),Ye()})},Ze={show:(e,t)=>{if(!F)return;C.show(e,t),e&&(Be=e);let n=e?e.split(/\s+/).length:0;n-We>=8&&(We=n,qe(e.split(/\s+/).slice(-24).join(` `)))},end:()=>{if(C.end(),Be){x.textContent=Be;let e=Be;qe(e).then(()=>mt(e))}We=0},progress:e=>C.say(e<0?`Preparing captions`:`Loading captions :: ${Math.round(e*100)}%`),failed:()=>{L?.destroy(),L=null,C.say(`Captions couldn't start here`),setTimeout(()=>C.quiet(),2600)}},Qe=()=>{if(typeof Worker>`u`||typeof AudioWorkletNode>`u`)return C.quiet();let e=async()=>{Re(),C.say(`Loading captions`);try{let e=me(Ze,Ve());await e.load(),L=e,C.quiet(),Ye(),F&&P&&await e.start(P.stream)}catch{C.say(`Captions couldn't load`),setTimeout(()=>C.quiet(),2600)}};Le()?e():C.offer(`Captions :: runs on this device, a one-time 150 MB download`,()=>void e())},$e=()=>{let e=ue(Fe,{...Ze,failed:()=>(L?.destroy(),L=null,Qe())});try{e.start(P.stream),L=e,typeof Worker<`u`&&Xe()}catch{Qe()}},et=async()=>{if(L&&P)return void await L.start(P.stream);if(!ze){ze=!0;try{let e=await le(Fe);if(!F)return;if(e===`available`)$e();else if(e===`downloadable`){let e=async()=>{Re(),C.say(`Downloading captions`);let e=await se().install({langs:[Fe],processLocally:!0,quality:`dictation`}).catch(()=>!1);C.quiet(),e&&F?$e():e||Qe()};Le()?e():C.offer(`Captions :: a one-time download, it stays on this device`,()=>void e())}else Qe()}finally{ze=!1}}},tt=()=>{L?.stop(),C.quiet(),C.clear()},nt=`orb:voice`,rt={joy:{speed:1.06,pitch:1.08},love:{speed:.97,pitch:1.02},surprise:{speed:1.08,pitch:1.12},sadness:{speed:.9,pitch:.92},fear:{speed:1.05,pitch:1.04},anger:{speed:1.04,pitch:.96}},V=!1,it=!1,H=!1,at=!1,ot=!1,st=0,U=0,W=null,ct=()=>{if(W)return W;let e=new AudioContext,t=e.createAnalyser();return t.fftSize=1024,t.smoothingTimeConstant=.55,t.connect(e.destination),W={ctx:e,an:t,time:new Uint8Array(1024),freq:new Uint8Array(512),next:0,live:new Set}},lt=()=>{let e=(typeof speechSynthesis>`u`?[]:speechSynthesis.getVoices()).filter(e=>e.lang.toLowerCase().startsWith(Fe.slice(0,2).toLowerCase()));return e.find(e=>e.localService&&/premium|enhanced|natural|neural/i.test(e.name))??e.find(e=>/samantha|daniel|karen|moira|serena|google/i.test(e.name))??e.find(e=>e.localService)??e[0]??null},ut=()=>{H&&(H=!1,at=!1,x.textContent=F?`Listening`:``,setTimeout(()=>{F&&P&&!H&&L?.start(P.stream)},250))},dt=()=>{H&&at&&ot&&W&&W.live.size===0&&ut()},ft=(e,t)=>{let n=ct(),r=n.ctx.createBuffer(1,e.length,t);r.copyToChannel(e,0);let i=n.ctx.createBufferSource();i.buffer=r,i.connect(n.an);let a=Math.max(n.ctx.currentTime+.03,n.next);i.start(a),n.next=a+r.duration,n.live.add(i),i.onended=()=>{n.live.delete(i),dt()}},pt=(e,t)=>{if(typeof speechSynthesis>`u`)return ut();let n=new SpeechSynthesisUtterance(e);n.lang=Fe,n.rate=t.speed,n.pitch=t.pitch;let r=lt();r&&(n.voice=r),n.onboundary=()=>U=1,n.onend=n.onerror=()=>ut(),speechSynthesis.cancel(),speechSynthesis.speak(n)},mt=e=>{if(!V||h.speaker!==`readback`||!F||!e.trim())return;ht();let t=++st;H=!0,ot=!1,L?.stop(),x.textContent=`Speaking`;let n=rt[Ge]??{speed:1,pitch:1};it&&R?(at=!0,ct().next=0,R.speak(t,e,h.voice,n.speed)):pt(e,n)},ht=()=>{if(st++,R?.hush(),W){for(let e of W.live){e.onended=null;try{e.stop()}catch{}}W.live.clear(),W.next=0}typeof speechSynthesis<`u`&&speechSynthesis.cancel()},gt=e=>{let t=e.data;t.type===`speech`&&t.id===st&&t.pcm?ft(t.pcm,t.rate??24e3):t.type===`spoken`&&t.id===st?(ot=!0,t.error?ut():dt()):t.type===`progress`&&t.part===`voice`&&C.say(`Loading voices :: ${Math.round((t.value??0)*100)}%`)},_t=!1,vt=async()=>{let e=Ve();_t||=(e.worker.addEventListener(`message`,gt),!0),C.say(`Loading voices`);try{await e.need(`voice`),it=!0,C.quiet()}catch{C.say(`Voices couldn't load: the system voice speaks instead`),setTimeout(()=>C.quiet(),2600)}},yt=`~92 MB`;navigator.gpu?.requestAdapter().then(e=>e&&(yt=`~330 MB`)).catch(()=>{});let bt=()=>{if(it||typeof Worker>`u`)return;let e=!1;try{e=localStorage.getItem(nt)===`on`}catch{}if(e)return void vt();C.offer(`Natural voices :: on this device, ${yt} once`,()=>{try{localStorage.setItem(nt,`on`)}catch{}vt()})},xt=!1,St=()=>{let e=V&&h.speaker===`live`;P?.rack.setOn(e),e&&P&&!xt&&(xt=!0,C.say(`Live :: headphones keep it from feeding back`),setTimeout(()=>C.quiet(),3200)),V&&h.speaker===`readback`||(ht(),ut())},Ct=t=>{V=t;let n=h.speaker===`live`;S.setAttribute(`aria-pressed`,String(t)),S.setAttribute(`aria-label`,n?t?`Stop hearing yourself`:`Hear yourself`:t?`Stop reading back`:`Read back what you say`),S.innerHTML=t?`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path d="M19.2478 4.75194C21.1027 6.60683 22.25 9.16933 22.25 11.9998C22.25 14.8302 21.1027 17.3927 19.2478 19.2476M15.8891 8.11132C16.8844 9.10662 17.5 10.4816 17.5 12.0004C17.5 13.5192 16.8844 14.8942 15.8891 15.8895M3.75 7.74999H5.35491C5.77433 7.74999 6.18314 7.61813 6.52352 7.37306L11.4578 3.82034C11.7886 3.58221 12.25 3.81856 12.25 4.22611V19.7739C12.25 20.1814 11.7886 20.4178 11.4578 20.1796L6.52352 16.6269C6.18314 16.3818 5.77433 16.25 5.35491 16.25H3.75C2.64543 16.25 1.75 15.3546 1.75 14.25V9.74999C1.75 8.64542 2.64543 7.74999 3.75 7.74999Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
`:e,c||S.firstElementChild?.animate([{scale:`0.25`},{scale:`1`}],{duration:200,easing:`cubic-bezier(0.2, 0, 0, 1)`}),t&&!n&&(ct().ctx.resume(),typeof speechSynthesis<`u`&&speechSynthesis.getVoices(),bt()),t&&P?.ctx.resume(),St(),Bt(t)},wt=()=>Ct(!V);S.addEventListener(`click`,wt);let Tt=`orb:speaker-settings`;try{let e=JSON.parse(localStorage.getItem(Tt)||`{}`);r.some(t=>t.id===e.speaker)&&(h.speaker=e.speaker),i.some(t=>t.id===e.effect)&&(h.effect=e.effect),n.some(t=>t.id===e.voice)&&(h.voice=e.voice)}catch{}let Et=()=>h.speaker===`live`?i:n,G=()=>h.speaker===`live`?h.effect:h.voice,Dt=()=>r.find(e=>e.id===h.speaker)?.label??``,Ot=()=>{try{localStorage.setItem(Tt,JSON.stringify({speaker:h.speaker,effect:h.effect,voice:h.voice}))}catch{}},kt=`cubic-bezier(0.16, 1, 0.3, 1)`,At=`cubic-bezier(0.23, 1, 0.32, 1)`,jt=g.clientWidth<760?`a`:`c`;g.classList.add(`orb--${jt}`);let Mt=(e,t)=>{let n=document.createElement(`button`);n.type=`button`,n.className=t,n.dataset.id=e.id,n.setAttribute(`role`,`radio`);let r=document.createElement(`span`);r.className=`orb__m`;let i=document.createElement(`span`);return i.textContent=e.label,r.appendChild(i),n.appendChild(r),n},Nt=(e,t)=>{e.setAttribute(`role`,`radiogroup`),e.addEventListener(`keydown`,n=>{let r=[...e.querySelectorAll(`[role=radio]`)],i=r.indexOf(document.activeElement),a=n.key===`ArrowRight`||n.key===`ArrowDown`?1:n.key===`ArrowLeft`||n.key===`ArrowUp`?-1:0;if(!a||i<0)return;n.preventDefault(),n.stopPropagation();let o=r[(i+a+r.length)%r.length];o.focus(),t(o.dataset.id)}),e.addEventListener(`click`,n=>{let r=n.target.closest(`[role=radio]`);r&&e.contains(r)&&t(r.dataset.id)})},Pt=(e,t)=>{for(let n of e.querySelectorAll(`[role=radio]`)){let e=n.dataset.id===t;n.setAttribute(`aria-checked`,String(e)),n.tabIndex=e?0:-1}},Ft=e=>e.getAnimations().forEach(e=>e.cancel()),It=(e,t=0)=>{e.forEach((e,n)=>{Ft(e),!c&&e.animate([{transform:`translateY(110%)`},{transform:`translateY(0)`}],{duration:380,delay:t+n*30,easing:kt,fill:`backwards`})})},Lt=e=>(e.forEach(Ft),c?Promise.resolve():Promise.all(e.map(e=>e.animate([{transform:`translateY(0)`},{transform:`translateY(110%)`}],{duration:180,easing:At,fill:`forwards`}).finished.catch(()=>{})))),Rt=(e,t)=>{if(Ft(e),c)return;let n=e.style.transform;e.animate([{transform:`${n} scaleX(0)`},{transform:`${n} scaleX(1)`}],{duration:320,delay:t,easing:kt,fill:`backwards`})},zt=e=>{if(Ft(e),c)return;let t=e.style.transform;e.animate([{transform:`${t} scaleX(1)`},{transform:`${t} scaleX(0)`}],{duration:140,easing:At,fill:`forwards`})},K;if(jt===`a`){let e=document.createElement(`div`);e.className=`orb__line2`,e.hidden=!0;let t=document.createElement(`button`);t.type=`button`,t.className=`orb__mode`;let n=document.createElement(`span`);n.className=`orb__m`;let r=document.createElement(`span`);n.appendChild(r),t.appendChild(n);let i=document.createElement(`div`);i.className=`orb__words`;let a=document.createElement(`span`);a.className=`orb__rule`,e.append(t,i,a),g.appendChild(e),Nt(i,e=>q(h.speaker===`live`?`effect`:`voice`,e)),t.addEventListener(`click`,()=>q(`speaker`,h.speaker===`live`?`readback`:`live`));let o=e=>{let t=i.querySelector(`[data-id="${G()}"]`);t&&(e&&(a.style.transition=`none`),a.style.width=`${t.offsetWidth}px`,a.style.transform=`translateX(${t.offsetLeft}px)`,e&&(a.offsetWidth,a.style.transition=``))},s=()=>{r.textContent=`${Dt()} ::`,t.setAttribute(`aria-label`,`Speaker: ${Dt()}. Switch to ${h.speaker===`live`?`Read back`:`Live`}`),i.setAttribute(`aria-label`,h.speaker===`live`?`Effect`:`Voice`),i.replaceChildren(...Et().map(e=>Mt(e,`orb__word`))),Pt(i,G())};s(),K={root:e,capOffset:36,show(t){if(t){e.hidden=!1,o(!0);let t=[r,...i.querySelectorAll(`.orb__m > span`)];It(t),Rt(a,120+t.length*30)}else zt(a),Lt([r,...i.querySelectorAll(`.orb__m > span`)]).then(()=>{V||(e.hidden=!0)})},render(e){if(!e){Pt(i,G()),o(!1);return}zt(a),Lt([r,...i.querySelectorAll(`.orb__m > span`)]).then(()=>{if(!V)return;s(),o(!0);let e=[r,...i.querySelectorAll(`.orb__m > span`)];It(e),Rt(a,120+e.length*30)})}}}else{let e=document.createElement(`div`);e.className=`orb__desk`,e.hidden=!0;let t=t=>{let n=document.createElement(`div`);n.className=`orb__sect`;let r=document.createElement(`p`);r.className=`orb__head`;let i=document.createElement(`span`);i.className=`orb__m`;let a=document.createElement(`span`);a.textContent=t,i.appendChild(a),r.appendChild(i);let o=document.createElement(`div`);o.className=`orb__list`,o.setAttribute(`aria-label`,t);let s=document.createElement(`span`);return s.className=`orb__tick`,o.appendChild(s),n.append(r,o),e.appendChild(n),{g:n,h:a,list:o,tick:s}},a=t(`Speaker`),o=t(`Effect`);g.appendChild(e),Nt(a.list,e=>q(`speaker`,e)),Nt(o.list,e=>q(h.speaker===`live`?`effect`:`voice`,e));let s=(e,t,n)=>{let r=e.list.querySelector(`[data-id="${t}"]`);if(!r)return;n&&(e.tick.style.transition=`none`);let i=r.offsetLeft-24,a=r.offsetTop+r.offsetHeight/2;e.tick.style.transform=`translate(${i}px, ${a}px)`,n&&(e.tick.offsetWidth,e.tick.style.transition=``)},c=()=>{for(let e of[...a.list.querySelectorAll(`[role=radio]`)])e.remove();a.list.append(...r.map(e=>Mt(e,`orb__item`))),Pt(a.list,h.speaker),o.h.textContent=h.speaker===`live`?`Effect`:`Voice`,o.list.setAttribute(`aria-label`,o.h.textContent);for(let e of[...o.list.querySelectorAll(`[role=radio]`)])e.remove();o.list.append(...Et().map(e=>Mt(e,`orb__item`))),Pt(o.list,G())};c();let l=Math.max(i.length,n.length),u=0,d=()=>{if(e.hidden)return;let t=o.list.querySelectorAll(`[role=radio]`).length,n=o.list.querySelector(`[role=radio]`),r=n?n.offsetHeight+2:30,i=e.offsetHeight+(l-t)*r;e.style.top=`${Math.round(u-i/2)}px`},f=()=>[a.h,...a.list.querySelectorAll(`.orb__m > span`),o.h,...o.list.querySelectorAll(`.orb__m > span`)];K={root:e,capOffset:0,place(e){u=e,d()},show(t){if(t){e.hidden=!1,d(),s(a,h.speaker,!0),s(o,G(),!0);let t=f();It(t),Rt(a.tick,160),Rt(o.tick,120+t.length*30)}else zt(a.tick),zt(o.tick),Lt(f()).then(()=>{V||(e.hidden=!0)})},render(e){if(e){let e=[o.h,...o.list.querySelectorAll(`.orb__m > span`)];Pt(a.list,h.speaker),s(a,h.speaker,!1),zt(o.tick),Lt(e).then(()=>{if(!V)return;c(),s(o,G(),!0);let e=[o.h,...o.list.querySelectorAll(`.orb__m > span`)];It(e),Rt(o.tick,120+e.length*30)})}else Pt(o.list,G()),s(o,G(),!1)}}}let q=(e,t)=>{if(e===`speaker`){if(h.speaker===t)return;h.speaker=t,Ct(V),K.render(!0)}else e===`effect`?(h.effect=t,P?.rack.setEffect(t)):h.voice=t,K.render(!1);Ot()},Bt=e=>K.show(e);N={id:jt,root:K.root,capOffset:K.capOffset,place:K.place?.bind(K)},Ce();let Vt=()=>{P&&=(P.rack.destroy(),P.stream.getTracks().forEach(e=>e.stop()),P.ctx.close(),null)},Ht=async()=>{if(F){F=!1,b.set(!1),ht(),ut(),tt(),Vt(),Pe(`idle`,`Stopped listening`);return}if(y.dataset.state!==`blocked`){F=!0,b.set(!0),y.setAttribute(`aria-pressed`,`true`);try{let e=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:!0,noiseSuppression:!0,autoGainControl:!0}}),t=new AudioContext({latencyHint:`interactive`}),n=t.createAnalyser();n.fftSize=1024,n.smoothingTimeConstant=.55;let r=t.createMediaStreamSource(e);r.connect(n);let i=ge(t,r);i.setEffect(h.effect),P={ctx:t,stream:e,an:n,time:new Uint8Array(n.fftSize),freq:new Uint8Array(n.frequencyBinCount),rack:i},St(),Pe(`listening`,`Listening`);let a=performance.now(),o=()=>{F&&(b.settled()||performance.now()-a>1200?et():requestAnimationFrame(o))};requestAnimationFrame(o)}catch{F=!1,b.set(!1),Pe(`blocked`,`Microphone blocked: allow it in the browser to talk to the orb`)}}};y.addEventListener(`click`,Ht);let J=new Float64Array(4),Ut=new Float64Array(5),Wt=Float64Array.from(te),Gt=e=>{let t=F||H;ke.to!==+!!t&&(ke.to=+!!t,ie(ke,t?40:10,t&&!c?.55:1)),re(ke,e),De=ke.x,Oe=h.rest*Math.min(1,Math.max(0,1-De)),J.fill(0),U=Math.max(0,U-e*5);let n=H&&at&&W?{an:W.an,time:W.time,freq:W.freq,rate:W.ctx.sampleRate}:H?null:P?{an:P.an,time:P.time,freq:P.freq,rate:P.ctx.sampleRate}:null;if(H&&!at&&(J[0]=.25+.6*U,J[1]=.5*U,J[2]=.6*U,J[3]=.35*U),n){n.an.getByteTimeDomainData(n.time);let t=0;for(let e=0;e<n.time.length;e++)t+=((n.time[e]-128)/128)**2;let r=Math.sqrt(t/n.time.length);n.an.getByteFrequencyData(n.freq),P&&n.an===P.an&&P.rack.guard(P.freq,e)&&(Ct(!1),C.say(`Feedback :: the speaker turned off, try headphones`),setTimeout(()=>C.quiet(),3200));let i=n.rate/n.an.fftSize,a=(e,t)=>{let r=0,a=0;for(let o=Math.floor(e/i);o<=Math.min(n.freq.length-1,Math.ceil(t/i));o++)r+=n.freq[o]/255,a++;return a?r/a:0};J[0]=r,J[1]=a(80,350),J[2]=a(350,2e3),J[3]=a(2e3,6e3);for(let t=0;t<4;t++){let n=J[t];Ne[t]=Math.max(n,Ne[t]-e*.04,t===0?.02:.08);let r=t===0?.006:.04;J[t]=Math.min(1,Math.max(0,(n-r)/(Ne[t]-r)))}}let r=(t,n)=>t+(n-t)*(1-Math.exp(-e*(n>t?22:5))),i=c?.4:1;Me=r(Me,J[0]*i);for(let e=0;e<3;e++)I[e]=r(I[e],J[e+1]*i);let a=b.settled()&&(F||H);Ae+=(+!!a-Ae)*(1-Math.exp(-e*(a?4:18))),je+=e,Ut[0]=Ut[4]=I[2],Ut[1]=I[0],Ut[2]=Me,Ut[3]=I[1];for(let e=0;e<Wt.length;e++){let t=.88+.12*Math.sin(je*3.2-e*.9)+.95*Ut[e];Wt[e]=Math.min(9.5,te[e]*(1+Ae*(t-1)))}b.step(e,Wt)},Y={x:0,y:0,in:!1,downX:0,downY:0},X=[ne(22,1.8*Math.sqrt(22)),ne(22,1.8*Math.sqrt(22))],Kt=e=>{if(!c){if(e.pointerType!==`mouse`){if(e.type===`pointerdown`)return void(Y.downX=e.clientX,Y.downY=e.clientY);if(e.target?.closest?.(`button`)||!Y.in&&Math.hypot(e.clientX-Y.downX,e.clientY-Y.downY)<10)return}Y.x=e.clientX,Y.y=e.clientY,Y.in=!0}},qt=e=>{(e.type!==`pointerup`||e.pointerType!==`mouse`)&&(Y.in=!1)};g.addEventListener(`pointermove`,Kt),g.addEventListener(`pointerdown`,Kt);for(let e of[`pointerleave`,`pointercancel`,`pointerup`])g.addEventListener(e,qt);let Jt=(e,t)=>{if(Y.in){let e=g.getBoundingClientRect(),n=Math.min(e.width,e.height)||1,r=Math.max(-1,Math.min(1,(t-(Y.y-e.top))/n/.4)),i=Math.max(-1,Math.min(1,(Y.x-e.left-e.width/2)/n/.55));X[0].to=(r>0?4:2)*r,X[1].to=.1*i}else X[0].to=X[1].to=0;for(let t of X)(t.x!==t.to||t.v!==0)&&(re(t,e),Math.abs(t.to-t.x)<1e-4&&Math.abs(t.v)<.001&&Object.assign(t,{x:t.to,v:0}))},Yt=()=>h.heart===`glass`||h.heart===`silver`&&F?1:0,Z=ne(9,6);Z.x=Z.to=Yt();let Xt=e=>{if(Z.to=Yt(),c)return void(Z.x=Z.to);(Z.x!==Z.to||Z.v!==0)&&re(Z,e)},Zt=3,Qt=performance.now(),$t=0,en=!0,Q=16.7,tn=0,nn=!0,$=null,rn=e=>{$t=requestAnimationFrame(rn);let t=e-Qt;Qt=e;let n=Math.min(t/1e3,.1);if(Gt(n),Je(n),Zt+=n*h.speed*(1+.5*De+.6*Me)*(1-.75*Oe)*(1+.35*z.energy*z.amt)*(c?.15:1),t<200&&(Q+=(t-Q)*.08),tn=Q>18.2?tn+1:0,$&&--$.after<=0&&(Q>$.avg*.9&&(M=$.scale,j=$.dprCap,T?be():xe(),nn=!1),$=null,tn=0),nn&&!$&&tn>30){let e=Math.min(.92,Math.max(.6,Math.sqrt(14/Q))),t={scale:M,dprCap:j,avg:Q,after:60};T&&M>.35?(M=Math.max(.35,M*e),be(),$=t):!T&&j>1&&(j=Math.max(1,Math.min(j,window.devicePixelRatio||1)*e),xe(),$=t),tn=0,Q=16.7}let r=Se(g.clientWidth,g.clientHeight||1);Jt(n,r.cy),Xt(n),Ee(Zt,r)},an=()=>{$t||!en||document.hidden||(Qt=performance.now(),$t=requestAnimationFrame(rn))},on=()=>{cancelAnimationFrame($t),$t=0},sn=new IntersectionObserver(([e])=>{en=e.isIntersecting,en?an():on()});sn.observe(g);let cn=()=>document.hidden?on():an();return document.addEventListener(`visibilitychange`,cn),an(),{destroy:()=>{on(),ht(),S.removeEventListener(`click`,wt),W?.ctx.close(),L?.destroy(),R?.destroy(),Vt(),y.removeEventListener(`click`,Ht),g.removeEventListener(`pointermove`,Kt),g.removeEventListener(`pointerdown`,Kt);for(let e of[`pointerleave`,`pointercancel`,`pointerup`])g.removeEventListener(e,qt);sn.disconnect(),we.disconnect(),document.removeEventListener(`visibilitychange`,cn),ye(),w.getExtension(`WEBGL_lose_context`)?.loseContext(),g.remove()},set:(e,a)=>{e===`heart`&&t.includes(a)?h.heart=a:e===`voice`&&n.some(e=>e.id===a)?q(`voice`,a):e===`effect`&&i.some(e=>e.id===a)?q(`effect`,a):e===`speaker`&&r.some(e=>e.id===a)?q(`speaker`,a):e in h&&typeof a==`number`&&(h[e]=a),e===`size`&&Ce()}}}};export{o as config,ve as default};