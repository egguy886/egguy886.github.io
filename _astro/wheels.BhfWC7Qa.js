const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/wheels-lab.BC1G2FRG.js","_astro/mesh.DnpBQ695.js"])))=>i.map(i=>d[i]);
import{f as e,i as t,o as n,r,t as i,u as a}from"./mesh.DnpBQ695.js";import{n as o}from"./Base.astro_astro_type_script_index_0_lang.BmT7DZU3.js";import{C as s,Ct as c,Ht as l,J as u,Nt as d,Pt as f,Q as p,Rt as ee,St as te,b as m,bt as h,ct as g,d as _,h as ne,ht as v,n as re,t as y,ut as b,xt as x,y as S,zt as ie}from"./three.module.DBbmgHoE.js";import{t as ae}from"./gl-warm.Cs1frxOX.js";import{t as oe}from"./RoomEnvironment.CsPbsEjR.js";var C={radius:1.14,overlap:.42,nip:1,nipSide:.35,nipMargin:.04,nipClear:.04,pitchGap:.18,bend:1.5,shear:.5,warp:1,push:1,restWarp:.35,checkWarp:.8,trail:1,jerk:1,sway:1,pLean:1.6,pRock:1.2,pSide:1.4,relief:1,bevelPx:3.5,inkGloss:.35,inkGate:90,inkSat:.18,stockGloss:.08,cavity:.6,wet:1,sweep:.5,glint:.6,chrome:.85,tint:.5,disperse:1,chromeLife:1,stockDark:.14,flake:.6,rim:.6,bodyLight:.85,rimLight:0,iridescence:1,stockLight:1,pSpin:1.5,streak:.6,grain:.06,grainReel:.02,drift:.15,arc:.022,fish:.14,dim:.22,cornerR:4,cropY:.72,tiltX:-5,tiltY:14,cardW:.7,slots:9,plateW:.3,balance:1,dieFollow:.08,dieRatio:2/3,camZ:3.2,damp:.08,lean:.6,focusS:1.6,throwDim:.7,wheel:.0011,drag:.0034,touchPitch:90,flickMin:.35,flick:90,flickLead:.35,momentum:.6,vmax:.09,tail:.3,floor:12,stepIn:.05,land:.24,inject:.28,life:1,idle:2,idleRate:1,parallax:0,frameTilt:.55,ring:.7,ringSpeed:.55,ringGap:.012,ringW:.002,ringBase:.13,ringShine:.28,stackY:-.04,envD:.6,envL:.85,calm:260,press:1,lurch:.42,checkW:.54,flag:.145,bank:.23,lapMs:700,lineA:.5,checkK:.017,checkZ:1,sheen:.08,sheenH:.6,sheenK:12,tube:1,tubeSide:.6,tubeDome:1,tubeLens:0,depthPar:.03,depthN:2,soft:1.1,dof:.9,lamp:.34,notch:.05,reel:1,reelTurns:3,reelDur:1.6,reelEach:.04,reelDelay:.2,reelIn:.2,reelLine:.08,reelIdle:6,huntA:.18,huntF:11,pulseA:.08,pulseL:.35,pulseFall:.88,stir:.045,stirRate:2,stirHand:0},w=(e,t)=>1-(1-e)**t,T=16/9,se=()=>C.dieRatio*(C.cardW/T)*C.focusS/C.plateW,ce=.06,le=1.2,ue=Math.PI*2,E=typeof matchMedia==`function`?matchMedia(`(prefers-reduced-motion: reduce)`):null,de=()=>!!E?.matches,fe=()=>matchMedia(`(pointer: coarse)`).matches,pe=e=>e*e*(3-2*e),me=e=>(e+1)*2654435761%4294967296/4294967296,D=(e,t=0)=>{let n=Math.imul(e,374761393)+Math.imul(t+1,668265263)>>>0;return n=Math.imul(n^n>>>13,1274126177)>>>0,((n^n>>>16)>>>0)/4294967296},O=e=>e*Math.PI/180,he=()=>{let e=getComputedStyle(document.documentElement);return{paper:e.getPropertyValue(`--paper`).trim()||`#161616`,ink:e.getPropertyValue(`--ink`).trim()||`#f2f1ee`,theme:document.documentElement.getAttribute(`data-theme`)??`dark`}},ge=(e,t,n)=>{let r=new c,i=-e/2,a=-t/2;return r.moveTo(i+n,a),r.lineTo(i+e-n,a),r.quadraticCurveTo(i+e,a,i+e,a+n),r.lineTo(i+e,a+t-n),r.quadraticCurveTo(i+e,a+t,i+e-n,a+t),r.lineTo(i+n,a+t),r.quadraticCurveTo(i,a+t,i,a+t-n),r.lineTo(i,a+n),r.quadraticCurveTo(i,a,i+n,a),r},_e=`

  uniform float uVel;
  uniform float uBend;
  uniform float uJerk;   // smoothed acceleration, saturated (−1..1) — the force behind the speed
  uniform float uTrail;  // the trailing edge's curl, local units
  uniform float uWarp;   // in-plane stretch along the travel, local units
  uniform float uPush;   // in-plane lead of the centre column, local units
  uniform float uRestWarp; // the warp the active proof keeps at rest
  uniform float uTravelX; // 1 when the press stands on end and travel runs along uv.x
  uniform float uFocus;  // 0 in transit, 1 at the detent
  uniform float uDrift;  // active card eases a touch toward center (+x)
  uniform float uArc;    // the ribbon — cylindrical z-arc
  uniform float uShear;  // leading-edge shear with velocity
  uniform float uFlag;   // flutter amplitude — the sheet in flight
  uniform float uFlagT;  // flutter phase — runs while the sheet moves
  uniform float uStir;   // THE STIR — the whole sheet breathing under the hand, no anchor
  uniform float uStirT;  // …its phase
  uniform float uHead;   // the focus ring's orbiting light, 0..1 around the frame (the ring's own uHead)
  uniform float uHead2;  // …and its second glint's orbit (continuous across the wrap)
  uniform float uStirOn; // the ring's engagement (its uOn) — the light lifts the cloth only while it is there
  uniform float uTube;   // THE TUBE — the old set's glass under the hand: barrel + dome, local units
  uniform float uTubeS;  // …the sides' share of the barrel
  uniform float uTubeZ;  // …the dome's share
  vec3 sheetWarp(vec3 p, vec2 uv) {
    float PI = 3.141592653589793;
    // THE STIR (2026-09-08): cloth, not a flag — two slow waves crossing
    // the whole plane with every edge free, so the sheet lifts and settles
    // under the hand at rest; the flight's flag (below) is the anchored one
    float breath =
      sin(uv.x * PI * 1.3 + uStirT) * sin(uv.y * PI * 1.1 - uStirT * 0.7) * 0.6 +
      sin((uv.x + uv.y) * PI * 1.9 + uStirT * 1.3) * 0.4;
    // …IN SYNC WITH THE RING (Carter): the same perimeter coordinate the
    // ring shader uses puts the orbiting light at one point on the rim, and
    // the cloth lifts there — a bulge travelling the edge under the light
    // (and a smaller one under its second, offset glint), fading inward
    // (the plane has a vertex dead centre — atan(0,0) is undefined there and
    // a NaN in one vertex tears the whole mesh; the nudge keeps it finite)
    vec2 q = (uv - 0.5) * 2.0 + vec2(1e-4, 1e-4);
    float t = atan(q.y, q.x) / 6.28318530718 + 0.5;
    float d1 = abs(fract(t - uHead + 0.5) - 0.5);
    float d2 = abs(fract(t + uHead2 + 0.27 + 0.5) - 0.5);
    float rim = smoothstep(0.15, 1.0, max(abs(q.x), abs(q.y)));
    float lift = (exp(-d1 * d1 * 70.0) + 0.5 * exp(-d2 * d2 * 70.0)) * rim;
    // the breath leads; the light only touches the rim (Carter: "not let the
    // border control the cloth… still connect them somewhat") — the two are
    // tied by TEMPO instead: the breath's clock runs off the ring's orbit
    p.z += uStir * (breath * 0.8 + lift * uStirOn * 0.3);
    // THE FLAG — pinned at its leading edge, the free edge ripples with two
    // travelling harmonics while the sheet is pulled off the cylinder (the
    // press check) and again as it goes back; ∝ the check's own speed, so
    // it settles flat with the flight, never at rest
    float mast = uv.x * uv.x;
    p.z += uFlag * mast * (0.6 + 0.4 * sin(uv.y * PI)) *
      (sin(uv.x * PI * 1.4 - uFlagT) * 0.75 + sin(uv.x * PI * 2.6 - uFlagT * 1.5 + uv.y * 2.0) * 0.25);
    // ACTIVE = the same honest 16:9 (it will hold an image or video) —
    // presence comes from treatment, not shape (Carter's epiphany; the
    // Landberg reference): scale + drift here, lens + hierarchy in the
    // fragment, and THE RIBBON — a soft cylindrical arc, center breathing
    // toward the viewer, vertical edges receding; whisper on travelers,
    // fuller at the detent, amplified by the travel bend below.
    p.x += uDrift * uFocus;
    p.z += uArc * sin(uv.x * PI) * (0.35 + 0.65 * uFocus);
    // travel physics — the Landberg read: a traveling WAVE (phase rides
    // velocity so it ripples through the cloth, settling flat), a base bow,
    // and leading-edge SHEAR that makes speed legible. All ∝ uVel → crisp
    // at rest, render-on-demand undisturbed.
    float w = (uVel + uJerk * 0.5) * uBend;
    p.z += sin(uv.x * PI * 1.6 + uVel * 5.0) * sin(uv.y * PI) * w * 0.9;
    p.z += sin(uv.y * PI) * w * 0.7;
    p.x += (uv.y - 0.5) * uVel * uShear;
    // THE TRAIL — the edge behind the travel lags and curls back (paper in
    // wind): direction-signed, ∝ speed, along whichever axis the press
    // travels. Squared so the curl lives in the last third of the sheet.
    float tv = mix(uv.y, uv.x, uTravelX) - 0.5;
    float behind = clamp(-sign(uVel) * tv * 2.0, 0.0, 1.0);
    p.z -= behind * behind * abs(uVel) * uTrail;
    // THE WARP — in the plane, where a 2D eye reads it (the z-bow above is
    // depth, and depth is quiet from the front): along the travel axis the
    // sheet STRETCHES with speed — its leading edge bows ahead at the
    // middle, its trailing edge bows back — and the whole centre column
    // leads the corners in the direction of travel (Carter's red lines)
    float across = sin(mix(uv.x, uv.y, uTravelX) * PI); // 0 at the side edges, 1 down the middle
    float along = across * (tv * 2.0 * (abs(uVel) * uWarp + uRestWarp * uFocus) + uVel * uPush);
    if (uTravelX > 0.5) p.x += along; else p.y += along;
    // THE TUBE — the old set's glass under the hand: every edge bows out
    // at its middle (the barrel, in plane, both axes) and the face domes
    // toward the eye. ∝ hover, so it swells in and lies flat again.
    float bx = sin(uv.y * PI), by = sin(uv.x * PI);
    p.x += (uv.x - 0.5) * 2.0 * bx * uTube * uTubeS;
    p.y += (uv.y - 0.5) * 2.0 * by * uTube;
    p.z += bx * by * uTube * uTubeZ;
    return p;
  }
`,ve=`
  ${_e}
  uniform vec2 uSize;   // the card's size — the ring's vertex read in card space
  varying vec2 vP;
  void main() {
    vP = position.xy;
    // the same cloth as the print: this vertex's place over the card (the
    // margin past the edge extrapolates the waves smoothly)
    vec2 cuv = 0.5 + position.xy / uSize;
    vec3 p = sheetWarp(position, cuv);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`,ye=`
  uniform vec2 uHalf;   // ring path half-extents, world units
  uniform float uR;     // path corner radius
  uniform float uW;     // stroke half-thickness
  uniform float uOn;    // damped hover gate
  uniform float uHead;  // orbit position 0..1
  uniform float uHead2; // the second glint's own orbit, 0..1 — accumulated continuously (0.618× the head's rate) so the wrap never jumps
  uniform float uBase;  // standing outline strength between glint passes
  uniform float uCur;   // perimeter position nearest the cursor, 0..1
  uniform float uShine; // the cursor shine's strength (its own damped state)
  varying vec2 vP;

  float sdRR(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return length(max(q, vec2(0.0))) + min(max(q.x, q.y), 0.0) - r;
  }

  void main() {
    float d = sdRR(vP, uHalf, uR);
    float aa = fwidth(d);
    float band = 1.0 - smoothstep(uW, uW + aa, abs(d));
    float glow = exp(-(d * d) / (uW * uW * 16.0)) * 0.3;
    // perimeter coordinate — square-normalized angle keeps the head's pace
    // reading even along edges and corners
    vec2 q = vP / (uHalf + uR);
    float t = atan(q.y, q.x) / 6.28318530718 + 0.5;
    float d1 = abs(fract(t - uHead + 0.5) - 0.5);
    float head = exp(-d1 * d1 * 240.0);
    float d2 = abs(fract(t + uHead2 + 0.27 + 0.5) - 0.5);
    float spot = exp(-d2 * d2 * 55.0) * 0.28;
    // the cursor shine — a wider, softer glint that sits where the hand is
    // (the PS5 anatomy's third light), on top of the orbit
    float d3 = abs(fract(t - uCur + 0.5) - 0.5);
    float shine = exp(-d3 * d3 * 48.0) * uShine;
    float a = (band + glow) * (uBase + head + spot + shine) * uOn;
    gl_FragColor = vec4(vec3(1.0), a);
  }
`,be=(()=>{let e=new Map;return t=>{let n=Math.round(t*1e3),r=e.get(n);if(r)return r;let i=document.createElement(`canvas`);i.width=i.height=256;let a=i.getContext(`2d`);a.fillStyle=`#000`,a.fillRect(0,0,256,256),a.fillStyle=`#fff`,a.beginPath(),a.roundRect(0,0,256,256,256*t),a.fill();let o=new _(i);return e.set(n,o),o}})(),xe=`
  ${_e}
  uniform vec2 uSize;    // the geometry's own extent — position = (uv − 0.5) × uSize
  uniform vec2 uPar;     // the hand over the card (−1..1)
  uniform float uSheenH; // the sheen's lamp height, × card height
  varying vec2 vUv;
  varying vec3 vN;   // the cloth's normal, view space
  varying vec3 vVp;  // this vertex, view space
  varying vec3 vLp;  // the sheen's lamp, view space
  void main() {
    vUv = uv;
    vec3 p = sheetWarp(position, uv);
    // THE CLOTH'S NORMAL — the same warp, sampled a step either way along
    // each axis (the surface the sheen reflects off is the surface the
    // vertices make, bow, arc, breath and all)
    vec2 e = vec2(0.02);
    vec3 xa = sheetWarp(position + vec3(e.x * uSize.x, 0.0, 0.0), uv + vec2(e.x, 0.0));
    vec3 xb = sheetWarp(position - vec3(e.x * uSize.x, 0.0, 0.0), uv - vec2(e.x, 0.0));
    vec3 ya = sheetWarp(position + vec3(0.0, e.y * uSize.y, 0.0), uv + vec2(0.0, e.y));
    vec3 yb = sheetWarp(position - vec3(0.0, e.y * uSize.y, 0.0), uv - vec2(0.0, e.y));
    vN = normalize(normalMatrix * normalize(cross(xa - xb, ya - yb)));
    vec4 vp = modelViewMatrix * vec4(p, 1.0);
    vVp = vp.xyz;
    // the lamp hangs over the hand (the hover's reach is 0.75 of the width
    // per side), a card-height or so above the sheet
    vLp = (modelViewMatrix * vec4(uPar.x * 0.75 * uSize.x, uPar.y * 0.75 * uSize.x, uSheenH * uSize.y, 1.0)).xyz;
    gl_Position = projectionMatrix * vp;
  }
`,Se=`
  uniform sampler2D uMap;
  uniform vec3 uInk;     // the construction grid's ink (theme)
  uniform vec2 uSize;    // card w/h in world units
  uniform float uRadius; // corner radius, world units
  uniform float uProg;   // the reel's progress 0..1 along the bottom edge (−1 = no reel)
  uniform float uLeave;  // the previous lap's line leaving to the right, 0..1 (−1 = none)
  uniform float uLineA;  // the line's strength (a translucent white — "less invasive")
  uniform float uImgA;   // source image aspect (w/h)
  uniform float uVideo;  // 1 while uMap is the reel: three uploads a VideoTexture LINEAR (RGBA8, no GPU sRGB decode)
                         // and decodes in its own materials' shaders (DECODE_VIDEO_TEXTURE) — this shader must too,
                         // or the clip prints double-encoded: pale, lifted, "too white" (Carter 2026-09-14)
  uniform float uRestA;  // the card's RESTING aspect (16:9) — the crop is cut against this, never the live size
  uniform float uCropY;  // vertical crop bias (0 bottom … 1 top)
  uniform float uFocus;
  uniform float uFish;   // tiny lens on the active card's content
  uniform float uDim;    // hierarchy — travelers sit back, the active leads
  uniform float uHover;  // cursor proximity on the active card, damped
  uniform float uSheen;  // glass sheen strength — proximity × dial
  uniform float uSheenK; // …the lobe's spread (higher = tighter)
  uniform sampler2D uDepth; // THE RELIEF — the still's depth map (near = bright), cut like the still
  uniform float uDepthOn;   // 1 while the still the map belongs to is on the sheet
  uniform float uDepthPar;  // the picture's parallax by depth
  uniform float uDepthN;    // the relief's tilt in the sheen's normal
  uniform float uHand;      // the damped hover, ungated by the parallax dial
  uniform vec2 uPar;     // pointer offset in card space (−1..1)
  uniform float uVel;
  uniform float uStreak;
  uniform float uGrain;
  uniform float uGrainV; // the reel's tooth — display space (see the tooth below)
  uniform float uSeed;
  uniform float uReveal;
  uniform float uSoft;   // motion softness: a thrown print goes out of focus (× |uVel|)
  uniform float uDof;    // depth of field by role: travellers sample softer than the active proof
  uniform float uSpoke;  // the card's angle on the cylinder (0 = the detent, facing the lamp)
  uniform float uLamp;   // how far the far side of the cylinder falls into shadow
  uniform float uPulse;  // the click's flash: 1 at the press, decaying — a radial chromatic burst + a lens swell
  uniform float uPulseA; // …its aberration amplitude
  uniform float uPulseL; // …its lens swell
  varying vec2 vUv;
  varying vec3 vN;   // the cloth's normal, view space
  varying vec3 vVp;  // this fragment, view space
  varying vec3 vLp;  // the sheen's lamp, view space

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }
  float sdRoundRect(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return length(max(q, vec2(0.0))) + min(max(q.x, q.y), 0.0) - r;
  }

  void main() {
    // procedural rounded corners — crisp at any scale, AA by derivative
    vec2 pos = (vUv - 0.5) * uSize;
    float dist = sdRoundRect(pos, uSize * 0.5, uRadius);
    float aa = fwidth(dist);
    float shape = 1.0 - smoothstep(-aa, aa, dist);
    if (shape < 0.003) discard;

    // procedural cover-crop against the RESTING frame (16:9). Cropping to
    // the live uSize re-cut the print every frame the card squared on
    // landing or morphed in a throw — edges clipped in and out (Carter
    // 2026-09-09). Cut once for rest; the effects then bend the whole print
    // with the cloth, aspect and all.
    float cardA = uSize.x / uSize.y; // the LIVE aspect — the construction grid below follows it
    vec2 uv = vUv;
    float sRatio = uRestA / uImgA;
    // uCropY biases WHERE the vertical window sits (1 = top of the image —
    // subjects' heads live there; blind centering guillotined them)
    if (sRatio < 1.0) uv.x = uv.x * sRatio + (1.0 - sRatio) * 0.5;
    else uv.y = uv.y / sRatio + (1.0 - 1.0 / sRatio) * uCropY;
    // THE RELIEF'S PARALLAX: the near parts of the picture shift with the
    // hand, the far parts against it — the subject comes off its ground
    // under glass (one tap at the unshifted uv; the shift is small enough
    // that no hole opens behind an edge). Read before the flat parallax and
    // the lens, in the still's own uv
    float dep = texture2D(uDepth, uv).r;
    vec2 dgrad = vec2(0.0);
    if (uDepthOn > 0.5) {
      // …faded out over the last few percent at each edge, or the near
      // ground would sample past the picture and streak the side (the
      // subject lives in the middle — nothing is lost)
      float rim = smoothstep(0.0, 0.08, uv.x) * smoothstep(0.0, 0.08, 1.0 - uv.x) * smoothstep(0.0, 0.08, uv.y) * smoothstep(0.0, 0.08, 1.0 - uv.y);
      uv += uPar * uDepthPar * uHand * (dep - 0.5) * rim;
      // …and the slope of the relief, four texels either way, for the sheen.
      // SATURATED: a silhouette is a cliff in the map and lit raw it drew a
      // white rim round every prop — the curve caps the cliffs and keeps the
      // gentle slopes (the form) proportional
      vec2 e = vec2(4.0 / 640.0, 4.0 / 360.0);
      dgrad = vec2(
        texture2D(uDepth, uv + vec2(e.x, 0.0)).r - texture2D(uDepth, uv - vec2(e.x, 0.0)).r,
        texture2D(uDepth, uv + vec2(0.0, e.y)).r - texture2D(uDepth, uv - vec2(0.0, e.y)).r);
      dgrad /= 1.0 + 10.0 * length(dgrad);
    }
    // print under glass: the image PARALLAXES toward the cursor inside its
    // frame (the frame never moves — print stays squared), and the lens
    // center FOLLOWS the pointer
    // …the slide is paid for with a hair of zoom about the centre, so the
    // print never slides past its own edge (with no margin it sampled beyond
    // the picture and the clamp smeared the edge pixels into streaks)
    vec2 sh = uPar * 0.013 * uHover;
    uv = 0.5 + (uv - 0.5) * (1.0 - 2.0 * abs(sh)) + sh;
    vec2 lensC = vec2(0.5) + uPar * 0.05 * uHover;
    vec2 cc = uv - lensC;
    // THE PULSE (2026-09-08): the click lands and the glass answers — the
    // lens swells for a beat and the print's colour splits radially from
    // the lens centre, both riding one decaying scalar
    // …NORMALISED so the zoom that pushed the edges out is gone (Carter
    // 2026-09-09: the top bar and bottom row of a cover were gone) — pinned
    // at the NEAREST edge, so every point of the frame samples on or inside
    // the picture. Pinned at the far corner, the edge midpoints sampled ~2%
    // OUT and the clamp dragged the edge pixels into streaks down both sides
    // (Carter 2026-09-28); now the barrel costs the corners a hair instead.
    float k = uFish * uFocus + uPulseL * uPulse;
    vec2 nearE = vec2(0.5) - abs(lensC - vec2(0.5));
    float dmin = min(nearE.x, nearE.y);
    uv = lensC + cc * (1.0 - k * dot(cc, cc)) / (1.0 - k * dmin * dmin);
    vec2 ab = cc * uPulseA * uPulse;
    // chromatic streak along travel — motion you can feel, stillness that's crisp
    float s = clamp(uVel * uStreak, -0.02, 0.02);
    vec2 dir = vec2(0.0, 1.0);
    // FOCUS IS THE HONEST SPEED (2026-09-08): the print samples up the mip
    // chain by velocity — a thrown proof goes soft and snaps crisp the frame
    // it lands (a camera, not a streak) — and by ROLE: the travellers sit a
    // step out of focus behind the active proof, hierarchy the way a lens
    // makes it, not only the dim below
    float lod = uSoft * abs(uVel) + uDof * (1.0 - uFocus);
    vec3 col;
    col.r = texture2D(uMap, uv + dir * s + ab, lod).r;
    col.g = texture2D(uMap, uv, lod).g;
    col.b = texture2D(uMap, uv - dir * s - ab, lod).b;
    // THE REEL'S DECODE — the sRGB EOTF (three's sRGBTransferEOTF, exact),
    // only for the video; the stills come in through SRGB8_ALPHA8 and are
    // already linear here
    if (uVideo > 0.5) col = mix(pow(col * 0.9478672986 + vec3(0.0521327014), vec3(2.4)), col * 0.0773993808, vec3(lessThanEqual(col, vec3(0.04045))));

    // THE CONSTRUCTION under the print: the plane's own quad grid, drawn in
    // the fragment from the vertex UVs — so it bends with the vertices (the
    // curl, the flag, the bank) and stays a hairline at any scale (fwidth
    // AA). Nine cells along the short side, square; the frame drawn. The
    // print dissolves in over it, per-pixel staggered by noise, never a pop.
    vec2 cells = vec2(floor(cardA * 9.0 + 0.5), 9.0);
    vec2 gp = vUv * cells;
    vec2 gd = abs(fract(gp - 0.5) - 0.5) / fwidth(gp);
    float line = 1.0 - min(min(gd.x, gd.y), 1.0);
    // the frame is the card's own rounded outline (the SDF), one px inside
    line = max(line, 1.0 - min(abs(dist + 1.5 * aa) / (1.1 * aa), 1.0));
    vec4 m = vec4(uInk, line * 0.72);
    // remapped so reveal 0 is FULLY the grid (the noise band would otherwise
    // leak a speckle of print through at rest) and 1 is fully the print
    float n = hash(vUv * 9.7 + uSeed * 3.1);
    float reveal = smoothstep(n - 0.12, n + 0.12, uReveal * 1.24 - 0.12);
    col = mix(m.rgb, col, reveal);

    // paper tooth — seeded, static (render-on-demand stays asleep at rest)
    // …on a still it IS the paper. On the reel the picture moves under a
    // tooth that doesn't, and added here in LINEAR light it lifts the clip's
    // shadows hardest (the ±0.03 that barely touches a highlight puts black
    // at ~19% in display terms): white specks over every dark frame, a dusty
    // screen (Carter 2026-09-28: "too much grain when vid is playing"). The
    // reel takes its own tooth in DISPLAY space instead — even across tones.
    float g = hash(vUv * 617.0 + uSeed) - 0.5;
    if (uVideo > 0.5) col = pow(max(pow(col, vec3(1.0 / 2.2)) + g * uGrainV, 0.0), vec3(2.2));
    else col += g * uGrain;

    // hierarchy — travelers sit back a register; the active card leads
    col *= mix(1.0 - uDim, 1.0, uFocus);
    // ONE LAMP (2026-09-08): the same key that lights the dies rakes the
    // proofs — a sheet turned away from the front of the cylinder falls
    // into shadow by the cosine of its spoke, so both wheels sit under one
    // light and the drum reads as a drum, not a list
    float lit = cos(clamp(uSpoke, -3.14159, 3.14159)) * 0.5 + 0.5;
    col *= mix(1.0 - uLamp, 1.0, lit);

    // GLASS SHEEN — LIT, not drawn (2026-09-13): a lamp over the hand, the
    // glass answering by its own surface. Where the cloth's normal bisects
    // the lamp and the eye the glass lights up — a soft pool under the
    // hand that bends with the ribbon's arc (a curved sheet stretches a
    // reflection along its curvature), ripples with the breath and skates
    // when the sheet bows, because it is geometry, not a band. Two lobes,
    // broad and core, and a faint glaze where the sheet turns from the eye
    // (the glass's own Fresnel). Screen-blended toward white.
    // …the relief tilts the glass's normal: the highlight rolls over the
    // subject's form (near = bright, so the slope points down the depth)
    vec3 N = normalize(normalize(vN) + vec3(-dgrad.x, -dgrad.y, 0.0) * uDepthN);
    vec3 V = normalize(-vVp);
    vec3 L = normalize(vLp - vVp);
    vec3 H = normalize(L + V);
    float ndh = max(dot(N, H), 0.0);
    float ndv = max(dot(N, V), 0.0);
    float pool = pow(ndh, uSheenK) * 0.75 + pow(ndh, uSheenK * 4.0) * 0.35;
    float glaze = pow(1.0 - ndv, 4.0) * 0.5;
    col = mix(col, vec3(1.0), clamp((pool + glaze) * uSheen, 0.0, 1.0));

    // THE REEL'S LINE (Carter, 2026-09-08: "a white line at the bottom as a
    // progress bar for the vids, can't be too invasive… bottom bottom edge"):
    // a hairline ON the sheet's bottom edge — a band of the rounded-rect
    // distance field, so it rides the corner arcs like a player's bar —
    // growing left to right with the clip. No track, no chrome; it stays a
    // hairline at any scale (fwidth) and lives only while a reel shows
    if (uProg >= 0.0) {
      float hw = aa * 2.2; // ~2px on the edge (the shape's own AA eats the outer half)
      float band = 1.0 - smoothstep(hw - aa, hw + aa, -dist);
      float bottom = 1.0 - smoothstep(-uSize.y * 0.5 + uRadius, -uSize.y * 0.5 + uRadius + aa * 2.0, pos.y);
      // the straight run only — it starts and ends where the corner arcs begin
      float ax = fwidth(pos.x);
      float x0 = -uSize.x * 0.5 + uRadius, xe = uSize.x * 0.5 - uRadius;
      float x1 = x0 + uProg * (xe - x0);
      float line = band * bottom * smoothstep(x0 - ax, x0 + ax, pos.x) * (1.0 - smoothstep(x1 - ax, x1 + ax, pos.x));
      // THE LAP (Carter: "a sweet loop for the line"): when the clip wraps,
      // the full line does not vanish — its tail sweeps right and it slides
      // out past the corner while the new lap grows in from the left
      if (uLeave >= 0.0) {
        float xt = x0 + uLeave * (xe - x0);
        line = max(line, band * bottom * smoothstep(xt - ax, xt + ax, pos.x) * (1.0 - smoothstep(xe - ax, xe + ax, pos.x)));
      }
      col = mix(col, vec3(1.0), line * uLineA); // a translucent white, not a solid
    }

    float a = shape * mix(m.a, 1.0, reveal);
    if (a < 0.01) discard; // no depth write through the wireframe's holes
    gl_FragColor = vec4(col, a);
    #include <colorspace_fragment>
  }
`;function Ce(){let e=document.createElement(`canvas`);return e.width=e.height=1,new _(e)}var we=e=>new Promise(t=>{let n=new Image;n.onload=()=>t(n),n.onerror=()=>t(null),n.src=e}),k=new WeakMap;function Te(e){let t=k.get(e);if(t)return t;let n=document.createElement(`canvas`);n.width=e.width,n.height=e.height;let r=n.getContext(`2d`,{willReadFrequently:!0});r.drawImage(e,0,0);let{data:i}=r.getImageData(0,0,n.width,n.height),a=n.width,o=n.height,s=(e,t)=>i[(t*a+e)*4+3]>8,c=e=>{for(let t=0;t<a;t++)if(s(t,e))return!0;return!1},l=0;for(;l<o&&!c(l);)l++;let u=a,d=0,f=0;if(l<o){for(d=o-1;d>l&&!c(d);)d--;let e=e=>{for(let t=l;t<=d;t++)if(s(e,t))return!0;return!1};for(u=0;!e(u);)u++;for(f=a-1;!e(f);)f--}let p=f<=u?{x:0,y:0,w:e.width,h:e.height}:{x:u,y:l,w:f-u+1,h:d-l+1};return k.set(e,p),p}function A(e,t,n,a,o){let s=document.createElement(`canvas`);s.width=s.height=o;let c=s.getContext(`2d`);if(a){let e=Te(a),t=o*.66,n=e.w/e.h,r=n>=1?t:t*n,i=n>=1?t/n:t;c.drawImage(a,e.x,e.y,e.w,e.h,(o-r)/2,(o-i)/2,r,i)}else i.on?c.drawImage(r(o,o,{seed:Math.round(n*1e4),ink:t,step:o/9}),0,0):(c.fillStyle=t,c.font=`600 ${o*.34}px "Geist Mono", ui-monospace, monospace`,c.textAlign=`center`,c.textBaseline=`middle`,c.fillText(e.mono,o/2,o/2));return s}var Ee=new WeakMap;function j(e){let t=Ee.get(e);if(t)return t;let n=document.createElement(`canvas`);n.width=n.height=64;let r=n.getContext(`2d`,{willReadFrequently:!0});r.drawImage(e,0,0,64,64);let i=r.getImageData(0,0,64,64).data,a=0,o=0,s=0;for(let e=0;e<i.length;e+=4){if(i[e+3]<40)continue;let t=i[e],n=i[e+1],r=i[e+2],c=Math.max(t,n,r),l=Math.min(t,n,r);o+=.2126*t+.7152*n+.0722*r,s+=c?(c-l)/c:0,a++}let c=a?{L:o/a,sat:s/a}:{L:128,sat:0};return Ee.set(e,c),c}var De=(e,t)=>{let n=(t-.5)*6,r=18+e*224+n;return[r,r-1+e*0,r-4*e]},Oe=()=>{let e=document.createElement(`canvas`);return e.width=e.height=512,{c:e,flake:null,flakeKey:``,mark:null,markKey:``,scratch:null}};function ke(e,t,n,r,a,o){let s=o.c,c=s.getContext(`2d`),[l,u,d]=De(a,n);if(c.fillStyle=`rgb(${Math.round(l)}, ${Math.round(u)}, ${Math.round(d)})`,c.fillRect(0,0,512,512),a<.5&&C.flake>0){let e=`${n}|${C.flake}`;if(!o.flake||o.flakeKey!==e){let t=o.flake??document.createElement(`canvas`);t.width=t.height=512;let r=t.getContext(`2d`),i=Math.round(n*977);r.fillStyle=`#fff`;for(let e=0;e<2600;e++){let t=D(e,i)*512,n=D(e,i+7919)*512;r.globalAlpha=+((.35+D(e,i+104729)*.65)*.35*C.flake).toFixed(3),r.fillRect(t,n,1+D(e,17)*1.2,1+D(e,19)*1.2)}o.flake=t,o.flakeKey=e}c.drawImage(o.flake,0,0)}let f=i.on?t:a<.5?`#e8e6e0`:t,p;if(r||i.on){let t=`${r?.src??``}|${i.on?f:``}`;(!o.mark||o.markKey!==t)&&(o.mark=A(e,f,n,r,512),o.markKey=t),p=o.mark}else p=A(e,f,n,r,512);if(r&&!i.on){let e=j(r),t=18+a*224,n=Math.abs(e.L-t);if(n<C.inkGate){let t=o.scratch??document.createElement(`canvas`);t.width=t.height=512,o.scratch=t;let r=t.getContext(`2d`);if(r.drawImage(p,0,0),p=t,r.globalCompositeOperation=e.sat<C.inkSat?`source-in`:`source-atop`,e.sat<C.inkSat)r.fillStyle=a<.5?`#e8e6e0`:`#1c1c1c`;else{let e=.7*(1-n/C.inkGate);r.fillStyle=a<.5?`rgba(232,230,224,${e.toFixed(3)})`:`rgba(28,28,28,${e.toFixed(3)})`}r.fillRect(0,0,512,512)}}return c.drawImage(p,0,0),s}function Ae(e,t,n,r){if(!r){let e=document.createElement(`canvas`);e.width=e.height=1;let t=e.getContext(`2d`);return t.fillStyle=`rgb(128,128,0)`,t.fillRect(0,0,1,1),new _(e)}let a=A(e,t,n,r,512),o=document.createElement(`canvas`);o.width=o.height=512;let s=o.getContext(`2d`,{willReadFrequently:!0});if(s.fillStyle=`#000`,s.fillRect(0,0,512,512),!i.on){let e=document.createElement(`canvas`);e.width=e.height=512;let t=e.getContext(`2d`);t.drawImage(a,0,0),t.globalCompositeOperation=`source-in`,t.fillStyle=`#fff`,t.fillRect(0,0,512,512),s.filter=`blur(${Math.max(.5,C.bevelPx)}px)`,s.drawImage(e,0,0),s.filter=`none`}let c=s.getImageData(0,0,512,512),l=s.createImageData(512,512),u=new Uint8Array(264196);for(let e=-1;e<=512;e++){let t=Math.max(0,Math.min(511,e))*512,n=(e+1)*514;for(let e=-1;e<=512;e++)u[n+e+1]=c.data[(t+Math.max(0,Math.min(511,e)))*4]}let d=l.data;for(let e=0;e<512;e++){let t=e*514+1,n=t+514,r=n+514;for(let i=0;i<512;i++){let a=u[t+i-1],o=u[t+i],s=u[t+i+1],c=u[n+i-1],l=u[n+i],f=u[n+i+1],p=u[r+i-1],ee=u[r+i],te=u[r+i+1],m=(s+2*f+te-a-2*c-p)/1020,h=(p+2*ee+te-a-2*o-s)/1020,g=(e*512+i)*4;d[g]=Math.round((.5-m*2.5)*255),d[g+1]=Math.round((.5+h*2.5)*255),d[g+2]=l,d[g+3]=255}}return s.putImageData(l,0,0),new _(o)}var je=(()=>{let e=null;return()=>{if(e)return e;e=document.createElement(`canvas`),e.width=e.height=128;let t=e.getContext(`2d`);t.fillStyle=`#808080`,t.fillRect(0,0,128,128);for(let e=0;e<1400;e++){let n=D(e,3)*128,r=D(e,7)*128,i=118+Math.floor(D(e,11)*24);t.fillStyle=`rgba(${i},${i},${i},0.5)`,t.fillRect(n,r,1.4,1.4)}return e}})(),Me=`
  varying vec2 vUv;
  varying vec3 vT;
  varying vec3 vB;
  varying vec3 vN;
  varying vec3 vP;
  void main() {
    vUv = uv;
    vT = normalize(normalMatrix * vec3(1.0, 0.0, 0.0));
    vB = normalize(normalMatrix * vec3(0.0, 1.0, 0.0));
    vN = normalize(normalMatrix * vec3(0.0, 0.0, 1.0));
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vP = mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`,Ne=`
  uniform sampler2D uMap;
  uniform sampler2D uRelief;
  uniform sampler2D uAlpha;
  uniform float uDepth;      // relief depth
  uniform float uInkGloss;   // the inked top's dry gloss
  uniform float uStockGloss; // the stock's gloss
  uniform float uCavity;     // the recess walls' shadow
  uniform float uWet;        // the landing's wet flash, 1 → 0
  uniform float uSweep;      // the glancing band's position along the travel (wraps)
  uniform float uSweepA;     // …its strength
  uniform float uVel;        // the wheel's saturated velocity
  uniform float uHov;        // cursor proximity on the active die
  uniform vec2 uCur;         // the cursor in face space (0..1)
  uniform float uGlint;      // the cursor's glint strength
  uniform vec3 uLampDir;     // the key, view space
  uniform float uTravelX;    // 1 when the press stands on end
  uniform float uRim;        // the iridescent rim inside the face's edge
  uniform float uTone;       // this die's stock, 0 graphite … 1 bone
  uniform float uRimLight;   // the printed lip's strength on bone (0 = none)
  uniform float uCornerUv;   // the face's corner radius in uv
  uniform float uChrome;     // the inked top as polished metal, 0..1
  uniform float uTint;       // the brand colour left in the chrome
  uniform float uDisperse;   // the spectral split at the band's edges
  uniform float uIdle;       // the idle clock, seconds (0 = the press is asleep)
  uniform float uLife;       // the chrome's breath — the band's slow drift
  uniform float uSeed;       // this die's own phase
  // the studio: a dark floor, one softbox, a dark ceiling — read by the
  // reflected ray's height
  // (a NARROW softbox: the references are mostly dark metal with one bright
  // band — a wide box read as a pastel wash on the flat tops)
  float studio(float t) {
    float box = smoothstep(0.40, 0.50, t) * (1.0 - smoothstep(0.57, 0.72, t));
    float floor_ = 0.10 + smoothstep(0.0, 0.45, t) * 0.16 + smoothstep(0.8, 1.0, t) * 0.06;
    return box + floor_;
  }
  varying vec2 vUv;
  varying vec3 vT;
  varying vec3 vB;
  varying vec3 vN;
  varying vec3 vP;
  void main() {
    float a = texture2D(uAlpha, vUv).r;
    if (a < 0.01) discard;
    vec3 base = texture2D(uMap, vUv).rgb;
    vec3 rel = texture2D(uRelief, vUv).xyz;
    vec2 slope = (rel.xy - 0.5) * 2.0;
    float h = rel.z;
    float top = smoothstep(0.55, 0.85, h);        // the inked top face
    float wall = length(slope);                   // the bevel's steepness
    vec3 nl = normalize(vec3(slope * uDepth, 1.0));
    vec3 n = normalize(vT * nl.x + vB * nl.y + vN * nl.z);
    vec3 V = normalize(-vP);
    vec3 L = normalize(uLampDir);
    float diff = max(dot(n, L), 0.0);
    float flat_ = max(dot(vN, L), 0.0);
    // the light shapes the relief only: relative to the flat face, so the
    // print keeps its colour and the walls take the light
    float shade = 0.72 + 0.28 * (diff / max(flat_, 0.2));
    vec3 col = base * shade;
    // the recess: the walls fall into shadow where they face away
    col *= 1.0 - uCavity * wall * (1.0 - top) * 0.6;
    // the highlight — Blinn, the ink glossier than the stock, wet ink glassy
    vec3 H = normalize(L + V);
    float gloss = mix(uStockGloss, uInkGloss + uWet * 1.4, top);
    float shin = mix(28.0, 110.0, top) + uWet * 120.0;
    float spec = pow(max(dot(n, H), 0.0), shin) * gloss;
    // wet ink is darker and deeper while it flashes
    col = mix(col, col * 0.72, uWet * top * 0.9);
    col += spec;
    // THE METAL — the reflected ray reads the studio; three samples at a
    // spectral offset split the softbox's edges (warm above, cool below);
    // the tilt of the die and the wheel's sweep move the band; a Fresnel
    // rim brightens the grazing edges; the brand colour tints the chrome
    if (uChrome > 0.001 && top > 0.001) {
      vec3 R = reflect(-V, n);
      // the band runs DIAGONALLY across the face (the reference's read on a
      // flat glyph); the die's tilt and the wheel's sweep carry it
      // the breath: two slow sines, never in phase, walk the band across the
      // face and let the fringe widen and narrow — a lamp moving in the room
      float ph = uSeed * 6.2831853;
      float breath = (sin(uIdle * 0.33 + ph) * 0.08 + sin(uIdle * 0.19 + ph * 1.7) * 0.05) * uLife; // ±0.13 of the studio — the band never walks fully off the mark
      float band = R.y * 0.5 + 0.5 + (vUv.x + vUv.y - 1.0) * 0.42 + breath + (uSweep - 0.5) * 0.35 * abs(uVel) * uSweepA;
      float sh = 0.045 * uDisperse * (1.0 + sin(uIdle * 0.27 + ph * 2.3) * 0.35 * uLife);
      vec3 metal = vec3(studio(band + sh), studio(band), studio(band - sh));
      float fres = pow(1.0 - max(dot(n, V), 0.0), 3.0);
      metal = metal + fres * 0.3;
      metal += pow(max(dot(n, H), 0.0), 240.0) * 0.6; // the key's pinpoint
      vec3 tinted = metal * mix(vec3(1.0), clamp(base * 1.35, 0.0, 1.0), uTint);
      col = mix(col, tinted, uChrome * top);
    }
    // the glancing band — a light passing over the face with the wheel
    float along = uTravelX > 0.5 ? vUv.x : vUv.y;
    float band = exp(-pow((along - uSweep) * 5.0, 2.0)) * abs(uVel) * uSweepA;
    col += band * (0.06 + spec * 3.0) * (0.5 + 0.5 * top);
    // THE RIM — inside the face's edge a thin band reads the studio at a
    // spectral offset, its colour walking with the edge's own angle and
    // the die's tilt (the reference's iridescent lip); the flake under it
    // (the stock's light specks) sharpens into sparkle at the highlight
    {
      vec2 q = abs(vUv - 0.5) - (0.5 - uCornerUv);
      float dEdge = -(length(max(q, vec2(0.0))) + min(max(q.x, q.y), 0.0) - uCornerUv); // 0 at the edge, growing inward
      float lip = (1.0 - smoothstep(0.0, 0.045, dEdge)) * smoothstep(0.0, 0.006, dEdge);
      vec3 Rr = reflect(-V, vN);
      float ang = atan(vUv.y - 0.5, vUv.x - 0.5) / 6.2831853;
      float bnd = Rr.y * 0.5 + 0.5 + ang * 0.9 + sin(uIdle * 0.23 + uSeed * 6.2831853) * 0.08 * uLife + (uSweep - 0.5) * 0.3 * abs(uVel) * uSweepA;
      float shr = 0.06;
      vec3 irid = vec3(studio(fract(bnd + shr)), studio(fract(bnd)), studio(fract(bnd - shr)));
      float lipE = lip * (1.0 - top) * uRim;
      vec3 lit = col + irid * lipE * (0.55 + 0.45 * uHov) + lipE * 0.05;
      // ON BONE THE LIP IS PRINTED, NOT LIT (2026-10-01, Carter: "why do we
      // see separate white edge line… works fine on dark mode"): added light
      // clips to white on a near-white stock, and the band's hair of a gap at
      // the edge made it read as a stray line inside the die. On bone the
      // same studio colours TINT the edge instead, from the very rim inward.
      // Graphite (tone 0.14) keeps the lit lip exactly as it was.
      float lipP = (1.0 - smoothstep(0.0, 0.045, dEdge)) * (1.0 - top) * uRim * uRimLight;
      vec3 printed = col * mix(vec3(1.0), irid * 0.85, lipP);
      col = mix(lit, printed, smoothstep(0.5, 0.9, uTone));
      // sparkle: specks lighter than the stock catch the key hard
      float lum = dot(base, vec3(0.333));
      float speck = smoothstep(0.03, 0.2, lum - 0.12) * (1.0 - top);
      col += speck * pow(max(dot(n, H), 0.0), 60.0) * 0.6 * uStockGloss * 4.0;
    }
    // the cursor's glint — a small light over the hand's spot
    vec3 Lc = normalize(vT * (uCur.x - vUv.x) * 2.2 + vB * (uCur.y - vUv.y) * 2.2 + vN * 0.8);
    float sc = pow(max(dot(n, normalize(Lc + V)), 0.0), 70.0) * uHov * uGlint;
    float near = exp(-dot(uCur - vUv, uCur - vUv) * 7.0) * uHov * uGlint;
    col += sc * (0.35 + 0.65 * top) + near * 0.03;
    gl_FragColor = vec4(col, a);
  }
`,Pe=new class{init(){let r=document.querySelector(`[data-wheels]`);if(!r)return;let c=document.querySelector(`[data-wheels-classic]`);if(de())return;let E,D=fe();try{E=new re({antialias:!D,alpha:!0,powerPreference:`high-performance`,failIfMajorPerformanceCaveat:!0})}catch{return}let _e=document.querySelector(`[data-wheels-data]`);if(!_e?.textContent)return;let k=JSON.parse(_e.textContent),A=k.length;if(!A)return;r.hidden=!1,c&&(c.hidden=!0);let Ee=new AbortController,{signal:j}=Ee;E.domElement.addEventListener(`webglcontextlost`,()=>{r.hidden=!0,c&&(c.hidden=!1)},{signal:j});let Pe=[],Fe=he(),Ie=0,M=()=>{Ie=0};E.setPixelRatio(Math.min(devicePixelRatio,2)),E.toneMapping=4;let Le=E.domElement;Le.style.cssText=`position:absolute;inset:0;width:100%;height:100%;`,r.prepend(Le);let N=new x,P=new g(30,1,.6,12);P.position.set(0,0,C.camZ);let Re=E.capabilities.getMaxAnisotropy(),ze=new y(E),Be=ze.fromScene(new oe,.04);N.environment=Be.texture,N.environmentIntensity=Fe.theme===`dark`?C.envD:C.envL,Pe.push({dispose:()=>Be.texture.dispose()},{dispose:()=>ze.dispose()});let Ve=new S(16777215,1.1);Ve.position.set(-1.6,2.2,2.6),N.add(Ve);let He=new f;He.crossOrigin=`anonymous`;let Ue=typeof createImageBitmap==`function`&&`userAgentData`in navigator,We=(e,t,n)=>{if(!Ue)return void He.load(e,t,void 0,n);fetch(e,{credentials:`same-origin`,headers:{Accept:`image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8`},signal:j}).then(e=>e.ok?e.blob():Promise.reject(Error(String(e.status)))).then(e=>createImageBitmap(e,{imageOrientation:`flipY`,premultiplyAlpha:`none`})).then(e=>{let n=new d(e);n.flipY=!1,n.needsUpdate=!0,n.onUpdate=()=>{e.close(),n.onUpdate=null},t(n)},()=>j.aborted?n():He.load(e,t,void 0,n))},Ge=C.cardW/T,Ke=new p({color:new ne(`#e8e6e0`),roughness:.92});Pe.push(Ke);let qe={value:0},Je={value:0},F={uDepth:{value:C.relief},uInkGloss:{value:C.inkGloss},uStockGloss:{value:C.stockGloss},uCavity:{value:C.cavity},uSweepA:{value:C.sweep},uSweep:{value:0},uGlint:{value:C.glint},uLampDir:{value:new ie(-.42,.62,.68)},uTravelX:{value:0},uChrome:{value:C.chrome},uTint:{value:C.tint},uDisperse:{value:C.disperse},uRim:{value:C.rim},uRimLight:{value:C.rimLight},uIdle:{value:0},uLife:{value:C.chromeLife}},Ye=()=>Fe.theme===`dark`?C.stockDark:C.stockLight,Xe={value:C.soft},Ze={value:C.dof},Qe={value:C.lamp},$e=[],et=(t,r,a)=>{let o=new s,c=new b(C.cardW,Ge,24,16),l=Ce(),d=new te({vertexShader:xe,fragmentShader:Se,transparent:!0,uniforms:{uMap:{value:l},uInk:{value:new ne(Fe.ink)},uSize:{value:new ee(C.cardW,Ge)},uRadius:{value:.02},uProg:{value:-1},uLeave:{value:-1},uLineA:{value:.5},uImgA:{value:T},uVideo:{value:0},uRestA:{value:T},uCropY:{value:C.cropY},uFocus:{value:0},uDrift:{value:C.drift},uArc:{value:C.arc},uFish:{value:C.fish},uDim:{value:C.dim},uVel:{value:0},uBend:{value:0},uShear:{value:0},uHover:{value:0},uPar:{value:new ee(0,0)},uStreak:{value:0},uSoft:{value:C.soft},uDof:{value:C.dof},uSpoke:{value:0},uLamp:{value:C.lamp},uPulse:{value:0},uPulseA:{value:C.pulseA},uPulseL:{value:C.pulseL},uGrain:{value:0},uGrainV:{value:0},uFlag:{value:0},uFlagT:{value:0},uStir:{value:0},uStirT:{value:0},uHead:{value:0},uHead2:{value:0},uStirOn:{value:0},uSheen:{value:0},uSheenH:{value:C.sheenH},uSheenK:{value:C.sheenK},uTube:{value:0},uTubeS:{value:C.tubeSide},uTubeZ:{value:C.tubeDome},uDepth:{value:l},uDepthOn:{value:0},uDepthPar:{value:C.depthPar},uDepthN:{value:C.depthN},uHand:{value:0},uSeed:{value:me(r*7+a)*100},uReveal:{value:0}}});d.uniforms.uVel=qe,d.uniforms.uJerk=Je,d.uniforms.uTrail={value:C.trail*.03},d.uniforms.uWarp={value:C.warp*.03},d.uniforms.uPush={value:C.push*.03},d.uniforms.uRestWarp={value:C.restWarp*C.warp*.03},d.uniforms.uTravelX={value:0},d.uniforms.uSoft=Xe,d.uniforms.uDof=Ze,d.uniforms.uLamp=Qe,$e.push(d);let f=()=>{};n.hold(new Promise(e=>f=e),2e3),i.on?f():We(t.hand[a%t.hand.length],n=>{f(),n.colorSpace=h,n.anisotropy=Re;let r=n.image;d.uniforms.uImgA.value=r.width/r.height,d.uniforms.uMap.value.dispose(),d.uniforms.uMap.value=n;let i=t.depth?.[a%t.hand.length];i&&He.load(i,e=>{e.colorSpace=``,d.uniforms.uDepth.value=e,d.userData.depthFor=n,M()},void 0,()=>{}),d.uniforms.uReveal.value=0,e.to(d.uniforms.uReveal,{value:1,duration:.7,ease:`power1.out`,onUpdate:M})},()=>f());let p=new u(c,d);p.renderOrder=3,p.frustumCulled=!1,Pe.push(c,d,{dispose:()=>{d.uniforms.uMap.value.dispose(),d.uniforms.uDepth.value.dispose()}}),o.add(p);let m=C.cardW/2+ce,g=Ge/2+ce,_=.04,v=new b((m+_)*2,(g+_)*2,24,16),re=Object.fromEntries([`uVel`,`uBend`,`uJerk`,`uTrail`,`uWarp`,`uPush`,`uRestWarp`,`uTravelX`,`uFocus`,`uDrift`,`uArc`,`uShear`,`uFlag`,`uFlagT`,`uStir`,`uStirT`,`uStirOn`,`uTube`,`uTubeS`,`uTubeZ`,`uSize`].map(e=>[e,d.uniforms[e]])),y=new te({vertexShader:ve,fragmentShader:ye,transparent:!0,depthWrite:!1,depthTest:!1,blending:2,uniforms:{...re,uHalf:{value:new ee(C.cardW/2+C.ringGap,Ge/2+C.ringGap)},uR:{value:C.cornerR/100*Ge+C.ringGap},uW:{value:C.ringW},uOn:{value:0},uHead:{value:0},uHead2:{value:0},uCur:{value:0},uShine:{value:0},uBase:{value:C.ringBase}}}),x=new u(v,y);return x.position.z=.017,x.renderOrder=5,x.frustumCulled=!1,x.visible=!1,Pe.push(v,y),o.add(x),N.add(o),{g:o,mat:d,ring:x,ringMat:y}},tt=(e,t)=>{let n=new s,r=me(t*53),a=.007,o=C.plateW*.065,c=C.plateW*.03,l=new m(ge(C.plateW-a*2,C.plateW-a*2,Math.max(.002,o-a)),{depth:.034,bevelEnabled:!0,bevelThickness:a,bevelSize:a,bevelSegments:3}),d=Ke.clone(),f=null,p=e=>{let[t,n,i]=De(e,r),a=e<.5?1:1+(C.bodyLight-1)*Math.min(1,(e-.5)/.4);d.color.setRGB(t/255*a,n/255*a,i/255*a,h);let o=e<.5;d.metalness=o?.45:0,d.roughness=o?.38:.92,d.clearcoat=o?.55:0,d.clearcoatRoughness=.28,d.iridescence=o?C.iridescence:0,d.iridescenceIOR=1.4,d.iridescenceThicknessRange=[140,520],d.bumpScale=o?.9*C.flake:.3,o!==f&&(d.needsUpdate=!0),f=o};p(Ye());let g=new _(je());g.center.set(.5,.5),g.rotation=r*Math.PI,g.repeat.set(1.6,1.6),g.wrapS=g.wrapT=1e3,d.bumpMap=g,d.bumpScale=.3;let ne=new u(l,d);ne.position.z=-.045,Pe.push(l,d,{dispose:()=>g.dispose()}),n.add(ne);let v=new b(C.plateW*.94,C.plateW*.94),re=Oe(),y=new _(re.c);y.colorSpace=h,y.anisotropy=Re;let x=Ae(e,`#1c1c1c`,r,null),S=new te({vertexShader:Me,fragmentShader:Ne,transparent:!0,toneMapped:!1,uniforms:{uMap:{value:y},uRelief:{value:x},uTone:{value:Ye()},uRimLight:F.uRimLight,uAlpha:{value:be(Math.max(.004,o-c)/(C.plateW*.94))},uDepth:F.uDepth,uInkGloss:F.uInkGloss,uStockGloss:F.uStockGloss,uCavity:F.uCavity,uSweepA:F.uSweepA,uSweep:F.uSweep,uGlint:F.uGlint,uLampDir:F.uLampDir,uTravelX:F.uTravelX,uChrome:F.uChrome,uTint:F.uTint,uDisperse:F.uDisperse,uRim:F.uRim,uIdle:F.uIdle,uLife:F.uLife,uSeed:{value:r},uCornerUv:{value:Math.max(.004,o-c)/(C.plateW*.94)},uVel:qe,uWet:{value:0},uHov:{value:0},uCur:{value:new ee(.5,.5)}}});S.polygonOffset=!0,S.polygonOffsetFactor=-2;let ie=null,ae=!1,oe=(t=Ye())=>{ke(e,`#1c1c1c`,r,ie,t,re),ae=!0,y.needsUpdate=!0,S.uniforms.uTone.value=t,p(t),M()},w=()=>{x.dispose(),x=Ae(e,`#1c1c1c`,r,ie),S.uniforms.uRelief.value=x,oe()};we(e.logo??``).then(t=>{!t||i.on||(Te(t),setTimeout(()=>{if(j.aborted)return;let n=Ae(e,`#1c1c1c`,r,t);setTimeout(()=>{if(j.aborted)return void n.dispose();ie=t,x.dispose(),x=n,S.uniforms.uRelief.value=x,oe()},0)},0))});let T=new u(v,S);return T.renderOrder=2,T.position.z=.006,Pe.push(v,S,{dispose:()=>{y.dispose(),x.dispose()}}),n.add(T),N.add(n),{g:n,mat:S,rebake:w,retint:oe,print:()=>{ae||oe()}}},I=new s,L=new s;N.add(I,L);let nt=C.cardW,rt=C.plateW,it=k.map((e,t)=>me(t*31)),R=k.map((e,t)=>{let{g:n,mat:r,ring:i,ringMat:a}=et(e,t,0);return I.add(n),{g:n,mat:r,ring:i,ringMat:a,sS:{x:0,v:0},sway:{x:0,v:0},hov:0,tube:0,ring_:{st:`off`,on:0,shine:0}}}),at=me(7)*1,ot=me(11)*1,st=(e,t,n,r,i)=>(e.v+=(n*(t-e.x)-r*e.v)*i,e.x+=e.v*i,Math.abs(t-e.x)+Math.abs(e.v)),z=k.map((e,t)=>{let{g:n,mat:r,rebake:i,retint:a,print:o}=tt(e,t);return L.add(n),{g:n,mat:r,rebake:i,retint:a,print:o,wet:0,wetIn:0,wetT:0,seed:me(t*29),zS:{x:0,v:0},foc:{x:0,v:0},wob:{x:0,v:0},rock:{x:0,v:0},side:{x:0,v:0},spin:{x:0,v:0},hov:0}});{let e=z.map((e,t)=>t).sort((e,t)=>Math.min(e,A-e)-Math.min(t,A-t)),t=0,n=()=>{j.aborted||t>=e.length||(z[e[t++]].print(),setTimeout(n,0))};setTimeout(n,0)}let B=ue/A,ct=ue,lt=()=>{B=ue/Math.min(A,Math.max(3,Math.round(C.slots))),ct=A*B};lt();let V=0,H=0,ut={off:-1.62},dt={v:1},ft=0,pt=0,mt=0,ht=0,gt=0,U=`rest`,_t=1;r.dataset.state=U;let vt=!1,yt=!0,bt=1e4,xt=1,St=0,Ct=e=>{let t=(e%ct+ct)%ct;return t>ct/2?t-ct:t},wt=1,Tt=1,W=!1,G=1,Et=0,Dt=-1,Ot=-1,kt=-1,K=()=>Dt>0?Dt:r.clientWidth,At=()=>Ot>0?Ot:r.clientHeight,jt=(e=!1)=>{let t=r.clientWidth,n=r.clientHeight;if(!t||!n)return;let i=Math.min(devicePixelRatio,2);if(!e&&t===Dt&&n===Ot&&i===kt)return;Dt=t,Ot=n,i!==kt&&(kt=i,E.setPixelRatio(i)),E.setSize(t,n,!1),P.aspect=t/n,P.updateProjectionMatrix(),wt=2*Math.tan(O(P.fov)/2)*C.camZ,Tt=wt*P.aspect,W=P.aspect<le,r.classList.toggle(`is-stacked`,W);let a=wt/n,o=W?(document.querySelector(`header`)?.offsetHeight??0)*a:0,s=W&&Qn?(n-Qn.offsetTop)*a:0,c=C.cardW,l=C.cardW/T,u=W?wt:Tt,d=(W?Tt:wt)*.92/((W?c:l)*C.focusS),f=u*.6699999999999999/(2*C.radius*C.overlap+(W?l:c)*C.focusS);G=Math.min(1,d,f);let p=(s-o)/2+(C.plateW*G*se()-l*G*C.focusS)/4;if(Et=W?Math.max(-.26,Math.min(.14,p))+C.stackY:0,W){let e=wt/2-C.radius*C.overlap*G,t=-wt/2+s+.03+e+C.plateW*G*se()/2;Et=Math.max(Et,Math.min(.14,t))}Ht(),M()},Mt=0,Nt=0,Pt=0,Ft=0,It=0,Lt=0,Rt=0,zt=0,Bt=0,q=new ie,Vt=e=>{let t=Mt+Pt+It*e,n=Nt+Ft+It*e;W?(I.position.set(0,Et+t,0),L.position.set(0,Et-n,0)):(I.position.set(Et-t,Rt,0),L.position.set(Et+n,Rt,0))},Ht=()=>{let e=C.radius*G,t=e*C.overlap,n=W?wt:Tt;if(Mt=Nt=n/2-t,Pt=Ft=e,W){let t=(C.cardW*G*(C.focusS+.9)/2+C.pitchGap*G)/(2*Math.sin(B/2));Pt=Math.max(e,t)}W?(I.rotation.set(O(C.tiltY),O(C.tiltX),-Math.PI/2),L.rotation.set(-O(C.tiltY),O(C.tiltX),-Math.PI/2),It=t+C.cardW/T*G*C.focusS+.2):(I.rotation.set(O(C.tiltX),O(C.tiltY),0),L.rotation.set(O(C.tiltX),-O(C.tiltY),0),It=t+C.cardW*G*C.focusS+.2);{let e=C.plateW*G*se()/2,t=Math.max(0,n/2-C.nipMargin*n-(Nt+e));Lt=It>0?Math.min(.22,t/It):0}let i=0;if(W){let e=Mt-C.cardW/T*G*C.focusS/2,t=-Nt+C.plateW*G*se()/2;i=Et+(e+t)/2,Bt=0,r.style.removeProperty(`--nip-w`),r.style.removeProperty(`--open-dx`)}else{r.style.removeProperty(`--open-dy`),Rt=0;{let e=document.querySelector(`[data-header] .header__bar`),t=1-((e?Math.max(0,e.getBoundingClientRect().bottom-r.getBoundingClientRect().top):0)+r.clientHeight)/r.clientHeight,n=(e,t,n)=>(e.updateWorldMatrix(!0,!1),q.set(Math.cos(t)*n,Math.sin(t)*n,0),e.localToWorld(q).project(P).y),a=0;for(let e=0;e<4;e++){Rt=a,Vt(0),P.updateMatrixWorld(!0);let e=(n(I,B,Pt)+n(I,-B,Pt)+n(L,Math.PI-B,Ft)+n(L,Math.PI+B,Ft))/4;a-=(e-t)*wt/2}Rt=a*C.balance,i=Rt}let e=C.cardW*G*C.focusS/2,t=C.plateW*G*se()/2,a=C.drift*C.focusS*G*(C.cardW/nt),o=Mt-e-a,s=Math.max(0,Nt-t-o)*C.nip,c=Math.max(0,n/2-C.nipMargin*n-(Mt+e-a)),l=Math.max(0,Math.min(s*C.nipSide,c));Mt+=l,Vt(0),P.updateMatrixWorld(!0);let u=(e,t)=>(e.updateWorldMatrix(!0,!1),q.set(t,0,0),e.localToWorld(q).project(P),q.x*Tt/2),d=-u(I,Pt+e+a),f=0;for(let e=0;e<4;e++)f+=u(L,-(Ft+f+t))-d;Bt=Math.max(0,f*C.nip);let p=Math.max(0,2*(d-C.nipClear*G));r.style.setProperty(`--nip-w`,`${(p/Tt*r.clientWidth).toFixed(2)}px`)}zt=-i/wt*r.clientHeight,r.style.setProperty(`--nip`,`${zt.toFixed(2)}px`),Vt(dt.v)},J=null,Ut=0,Wt=0,Gt=C.drag,Kt=!1,qt=0,Jt=0,Yt=0,Xt=0,Y=0,Zt=-1e4,Qt=!1,$t=60,en=-1e4,tn=0,nn=0,rn=0,an=0,on=!1,sn=!1,cn=-1,ln=0,un=0;r.addEventListener(`wheel`,e=>{if(e.ctrlKey)return;if(e.preventDefault(),Z.t){Dn(),Yn();return}let t=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?innerHeight:1);if(!t)return;let n=performance.now(),r=Math.abs(t),i=Math.sign(t),a=n-en;if(en=n,on){if(!(a>80||i!==nn||r>tn*1.5+2)){tn=Math.min(tn,r);return}on=!1,rn=0}if(rn=a>60||i!==nn||r>tn?0:rn+1,rn===0&&(an=r),tn=r,nn=i,rn>=3&&an>=C.floor&&r<=an*C.tail){on=!0;return}let o=a>40,s=o&&(sn||r>=60);if(sn=o,s){qn(Math.round((Q??H)/B-i)*B),Y=0,Zt=n,er(t);return}Yn(),$t=a<30?60:160,Qt=!1;let c=-t*C.wheel,l=a>40?B*C.stepIn:1/0,u=Math.max(-l,Math.min(l,c));H+=u,Y+=c-u,Zt=n,er(t)},{passive:!1,signal:j});let dn=0,fn=0,pn=!1;r.addEventListener(`pointerdown`,e=>{if(e.button===0&&!e.target.closest?.(`.hv2__ctarow`)){Z.t&&(Dn(),_n=!0),J=e.clientX,Ut=e.clientY,Wt=0,Xt=performance.now(),Kt=e.pointerType===`touch`,Gt=Kt?B/C.touchPitch:C.drag,qt=Math.round(H/B),Jt=0,Yt=e.timeStamp,Yn(),dn=e.clientX,fn=e.clientY,X=e.clientX,mn=e.clientY;try{r.setPointerCapture(e.pointerId)}catch{}pn=!1}},{signal:j});let X=-1e4,mn=-1e4;r.addEventListener(`pointermove`,e=>{if(X=e.clientX,mn=e.clientY,J===null)return;if(e.buttons===0){J=null,pn=!1;return}let t=Ut-e.clientY+(e.clientX-J);!pn&&Math.hypot(e.clientX-dn,e.clientY-fn)>8&&(pn=!0),H+=t*Gt,Wt=Wt*.7+t*.3,Jt=Jt*.5+t/Math.max(4,e.timeStamp-Yt)*.5,Yt=e.timeStamp,Zt=performance.now(),Xt=Zt,er(t),J=e.clientX,Ut=e.clientY},{signal:j}),r.addEventListener(`pointerup`,e=>{if(J!==null){J=null;try{r.releasePointerCapture(e.pointerId)}catch{}if(pn=!1,Math.hypot(e.clientX-dn,e.clientY-fn)<8&&!Z.t&&!_n){let t=(Math.round(-V/B)%A+A)%A,n=(Math.round(-H/B)%A+A)%A,r=Math.abs(H-Math.round(H/B)*B)<B*.25,i=Kn(e.clientX,e.clientY);if(i){if(i.i===n&&r){H=Math.round(H/B)*B,En(n);return}if(i.i===t&&Math.abs(H-V)<.02){En(t);return}Jn(i.i),_n=!1;return}}_n=!1,H+=Wt*C.flick*Gt*.02,Zt=performance.now(),$t=60,Qt=!0,Kt&&Math.abs(Jt)>C.flickMin&&performance.now()-Xt<90&&Math.round(H/B)===qt&&qn((qt+Math.sign(Jt))*B)}},{signal:j}),r.addEventListener(`pointercancel`,()=>{J=null,pn=!1,_n=!1},{signal:j}),r.addEventListener(`lostpointercapture`,()=>{J=null,pn=!1},{signal:j}),r.addEventListener(`pointerleave`,()=>{X=-1e4,mn=-1e4},{signal:j}),r.addEventListener(`keydown`,e=>{if(e.metaKey||e.ctrlKey||e.altKey||e.shiftKey)return;let t=Q??H;(e.key===`ArrowRight`||e.key===`ArrowDown`)&&(e.preventDefault(),Dn(),qn(Math.round(t/B-1)*B)),(e.key===`ArrowLeft`||e.key===`ArrowUp`)&&(e.preventDefault(),Dn(),qn(Math.round(t/B+1)*B)),e.key===`Enter`&&e.target===r&&!Z.t&&En((Math.round(-t/B)%A+A)%A)},{signal:j}),window.addEventListener(`keydown`,e=>{e.key===`Escape`&&Dn()},{signal:j});let Z={t:0,c:0,i:-1},hn=0,gn=-1,_n=!1,vn=-1,yn=0,bn=0,xn=0,Sn=0,Cn=0,wn=0,Tn={v:0},En=e=>{if(Z.i>=0&&Z.i!==e){let e=On.get(Z.i);e?.on?Fn(Z.i,!0):e?.landing&&Pn(Z.i),Z.c=0,hn=0}Z.i=e,Z.t=1,Tn.v=1,r.classList.add(`is-open`),Nn(e),M()},Dn=()=>{Z.t&&(Z.t=0,Tn.v=.45,r.classList.remove(`is-open`),Fn(Z.i),M())},On=new Map,kn=!!navigator.connection?.saveData,An=e=>{let t=k[e]?.video;if(!t||de()||kn||i.on)return null;let n=On.get(e);if(n)return n;let r=document.createElement(`video`);r.muted=!0,r.loop=!0,r.playsInline=!0,r.preload=`none`,r.crossOrigin=`anonymous`,r.src=t;let a=new l(r);a.colorSpace=h,a.anisotropy=Re;let o={el:r,tex:a,still:null,stillA:0,on:!1,ready:!1,landing:!1,lastT:0,lapAt:-1e9};return r.addEventListener(`loadeddata`,()=>{o.ready=!0,M()},{signal:j}),On.set(e,o),Pe.push({dispose:()=>{r.pause(),r.removeAttribute(`src`),r.load(),a.dispose()}}),o},jn=e=>{let t=On.get(e);if(!t||!t.on||!t.ready)return;let n=R[e].mat.uniforms;n.uMap.value!==t.tex&&(t.still=n.uMap.value,t.stillA=n.uImgA.value,n.uMap.value=t.tex,n.uImgA.value=t.el.videoWidth/Math.max(1,t.el.videoHeight),n.uVideo.value=1,M())},Mn=(e,t)=>{let n=An(e);if(!n||n.ready)return;let r={none:0,metadata:1,auto:2};r[t]<=r[n.el.preload||`none`]||(n.el.preload=t,n.el.load())},Nn=e=>{let t=An(e);t&&(t.on=!0,t.landing=!1,t.el.play().catch(()=>{}))},Pn=e=>{let t=On.get(e);if(!t)return;t.landing=!1;let n=R[e].mat.uniforms;n.uMap.value===t.tex&&t.still&&(n.uMap.value=t.still,n.uImgA.value=t.stillA),n.uVideo.value=0,n.uProg.value=-1,n.uLeave.value=-1,t.lastT=0,t.lapAt=-1e9;try{t.el.currentTime=0}catch{}M()},Fn=(e,t=!1)=>{let n=On.get(e);!n||!n.on||(n.on=!1,n.el.pause(),t?Pn(e):n.landing=!0,M())};document.addEventListener(`visibilitychange`,()=>{On.forEach(e=>{e.on&&(document.hidden?e.el.pause():e.el.play().catch(()=>{}))})},{signal:j});let In=new ie,Ln=new v,Rn=new v,zn=0,Bn=``,Vn=e=>{e!==Bn&&(Bn=e,r.style.cursor=e)},Hn=(e,t)=>{if(Z.i<0||Z.c<.5)return!1;R[Z.i].g.getWorldPosition($).project(P);let n=($.x*.5+.5)*K(),r=(-$.y*.5+.5)*At(),i=.3*G,a=2*Math.tan(O(P.fov)/2)*(C.camZ-i)*P.aspect,o=zn*nt/(a||1)*K();return Math.abs(e-n)<o/2&&Math.abs(t-r)<o/T/2},Un=()=>{if(D)return;if(J!==null&&pn)return Vn(`grabbing`);if(X<-1e3)return Vn(`grab`);if(Z.t)return Vn(Hn(X,mn)?`zoom-out`:`default`);let e=Kn(X,mn),t=(Math.round(-V/B)%A+A)%A,n=(Math.round(-H/B)%A+A)%A,r=!!e&&(e.i!==t||Math.abs(H-V)<.02||e.i===n);e?.kind===`proof`&&e.i===t&&r&&Mn(t,`auto`),Vn(r?`pointer`:`grab`)},Wn=(e,t,n)=>{let r=R[e];r.g.getWorldPosition($).project(P);let i=($.x*.5+.5)*K(),a=(-$.y*.5+.5)*At(),o=r.g.scale.x*K()/(Tt||1),s=(t-i)/o-C.drift*r.mat.uniforms.uFocus.value,c=-(n-a)/o,l=C.cardW/2,u=Ge/2;return{lx:s,ly:c,in:Math.abs(s)<l*1.04&&Math.abs(c)<u*1.06,out:Math.abs(s)>l*1.18||Math.abs(c)>u*1.24}},Gn=(e,t,n)=>{let r=z[e];if(!r.g.visible)return!1;r.g.getWorldPosition($).project(P);let i=($.x*.5+.5)*K(),a=(-$.y*.5+.5)*At(),o=rt*r.g.scale.x*.56/(Tt||1)*K();return Math.abs(t-i)<o&&Math.abs(n-a)<o},Kn=(e,t)=>{let n=(Math.round(-V/B)%A+A)%A;if(R[n].g.visible&&Wn(n,e,t).in)return{kind:`proof`,i:n};for(let r=0;r<A;r++)if(r!==n&&R[r].g.visible&&Wn(r,e,t).in)return{kind:`proof`,i:r};for(let n=0;n<A;n++)if(Gn(n,e,t))return{kind:`plate`,i:n};return null},Q=null,qn=e=>{Q=e,Zt=performance.now(),M()},Jn=e=>{let t=-e*B;t+=Math.round((H-t)/ct)*ct,qn(t)},Yn=()=>{Q=null},Xn=(e,t,n)=>{R[e].g.getWorldPosition($).project(P);let r=($.x*.5+.5)*K(),i=(-$.y*.5+.5)*At(),a=C.cardW*G*C.focusS*.75/(Tt||1)*K(),o=(t-r)/a,s=(n-i)/a;return{p:pe(Math.max(0,1-Math.hypot(o,s))),dx:o,dy:s}},Zn=0,Qn=r.querySelector(`[data-wheels-hint]`),$n=[r.querySelector(`.hv2__wlabel--l`),r.querySelector(`.hv2__wlabel--r`)].filter(Boolean);Qn&&D&&(Qn.textContent=`SWIPE:: THE PRESS TURNS`);let er=t=>{Zn+=Math.abs(t),Qn&&Zn>600&&e.to(Qn,{autoAlpha:0,duration:.6})},tr=e=>r.querySelector(e);tr(`[data-wheels-center]`);let nr=e=>String(e+1).padStart(2,`0`),rr=-1,ir=1e4,ar=r.querySelector(`[data-wheels-announce]`),or=0,sr=e=>{if(e===rr)return;if(rr=e,clearTimeout(or),ar&&(or=window.setTimeout(()=>{let t=k[e];ar.textContent=`${t.name}, ${t.collab}, ${t.year}. ${e+1} of ${A}.`},700)),D&&rr>=0&&`vibrate`in navigator)try{navigator.vibrate(5)}catch{}let t=Math.max(0,1-gt*1.6);z[e].zS.v+=.012*C.life*t,z[e].wob.v+=(z[e].seed-.5)*.05*C.life*t,R[e].sS.v+=.006*C.life*t,ir=0},cr=.72,lr=[{name:`eyebrow`,lag:.16,hosts:e=>[e],write:(e,t)=>{e.textContent=`N°${nr(t)} / ${nr(A-1)}`}},{name:`title`,lag:.12,hosts:e=>[e],write:(e,t)=>{e.textContent=k[t].name},fit:e=>{e.style.removeProperty(`--fit`),e.style.whiteSpace=`nowrap`;let t=e.clientWidth,n=e.scrollWidth;if(!t||n<=t+.5)return;let r=t/n;e.style.setProperty(`--fit`,Math.max(cr,r).toFixed(3)),r<cr&&(e.style.whiteSpace=``)}},{name:`chips`,lag:.095,hosts:e=>Array.from(e.querySelectorAll(`[data-chip-collab], [data-chip-year]`)),write:(e,t)=>{let n=e.querySelector(`[data-chip-collab]`),r=e.querySelector(`[data-chip-year]`);n&&(n.textContent=k[t].collab),r&&(r.textContent=k[t].year)}},{name:`cta`,lag:.075,hosts:()=>[],write:(e,t)=>{let n=e.querySelector(`[data-cta]`);if(!n)return;let r=k[t].href;r?(n.href=r,n.hidden=!1):n.hidden=!0}}].map(e=>{let t=r.querySelector(`[data-wheels-line="${e.name}"]`);if(!t)return null;let n=Array.from(t.querySelectorAll(`[data-drum]`));return{win:t,copies:n,st:n.map(()=>NaN),write:e.write,hosts:e.hosts,reels:n.map(()=>[]),lag:e.lag,th:0,v:0,h:0,vis:-1,fit:e.fit}}).filter(e=>!!e&&e.copies.length===2),ur=e=>(e%A+A)%A,dr=e=>(e%2+2)%2,fr=(e,t)=>{let n=[];for(let r of e.hosts(e.copies[t])){let e=r.textContent??``;r.textContent=``;let t=document.createElement(`span`);t.className=`u-sr-only`,t.textContent=e,r.appendChild(t);for(let t of e.split(/( )/)){if(!t)continue;if(t===` `){r.appendChild(document.createTextNode(` `));continue}let e=document.createElement(`span`);e.className=`hv2__word`;for(let r of[...t]){let t=document.createElement(`span`);t.className=`hv2__ch`,t.setAttribute(`aria-hidden`,`true`);let i=document.createElement(`span`);i.textContent=r,t.append(i,i.cloneNode(!0)),e.appendChild(t),n.push({el:t,turns:0,delay:0,r:0})}r.appendChild(e)}}e.reels[t]=n},pr=-1,mr=0,hr=0,gr=!1,_r=0,vr=()=>{if(C.reel<=0||de())return;let e=Math.round(-V/B);pr=-1,gr=!0,_r=0,mr=0,lr.forEach((t,n)=>{for(let r of[0,1]){if(t.st[r]!==e)continue;let i=t.reels[r].map((e,t)=>t).sort(()=>Math.random()-.5);t.reels[r].forEach((e,t)=>{e.turns=Math.max(1,Math.round(C.reelTurns+(Math.random()*2-1))),e.delay=C.reelDelay+n*C.reelLine+i[t]*C.reelEach,mr=Math.max(mr,e.delay+C.reelDur)})}}),hr=performance.now()},yr=()=>{pr=-1,gr=!1;for(let e of lr)for(let t of[0,1])for(let n of e.reels[t])n.r!==0&&(n.r=0,n.el.style.removeProperty(`--r`))},br=!1,xr=e=>{let t=-V/B;br=!1,(pr>=0||gr)&&(U===`hand`||U===`throw`||U===`check`||Math.abs(H-V)>B*.2)&&yr(),pr<0&&!gr&&C.reelIdle>0&&U===`rest`&&!Z.t&&J===null&&performance.now()-hr>C.reelIdle*1e3&&performance.now()-Zt>C.reelIdle*1e3&&vr(),gr?(br=!0,_r+=e*16.667/1e3,(_r>1.5||lr.every(e=>e.v===0&&e.th===Math.round(e.th)))&&(gr=!1,pr=0)):pr>=0&&(pr+=e*16.667/1e3,br=!0);for(let n of lr){if(de())n.th=Math.round(t),n.v=0;else{n.v+=(n.lag*(t-n.th)-.48*n.v)*e,n.th+=n.v*e;let r=Math.round(n.th);Math.abs(n.th-r)<.004&&Math.abs(n.v)<.002&&Math.abs(t-r)<.01&&(n.th=r,n.v=0)}let r=Math.floor(n.th),i=!1;for(let e of[r,r+1]){let t=dr(e);n.st[t]!==e&&(n.st[t]=e,n.write(n.copies[t],ur(e)),C.reel>0&&fr(n,t),i=!0)}if(i||!n.h){n.fit&&n.copies.forEach(n.fit);let e=Math.max(n.copies[0].offsetHeight,n.copies[1].offsetHeight)+4;e!==n.h&&(n.h=e,n.win.style.blockSize=`${e}px`)}for(let e of[r,r+1])n.copies[dr(e)].style.transform=`translateY(${((e-n.th)*n.h).toFixed(2)}px)`;let a=dr(Math.round(n.th));if(a!==n.vis&&(n.vis=a,n.copies.forEach((e,t)=>{e.inert=t!==a,e.toggleAttribute(`aria-hidden`,t!==a)})),pr>=0)for(let e of[0,1])for(let t of n.reels[e]){let e=pr-t.delay,n=0;if(e>0&&e<C.reelDur){let r=e/C.reelDur,i=C.reelIn>0?Math.sin(Math.min(r/C.reelIn,1)*Math.PI/2):1;n=t.turns*(1-2**(-10*r))*i}let r=e>=C.reelDur||e<=0?0:n-Math.floor(n);r!==t.r&&(t.r=r,r===0?t.el.style.removeProperty(`--r`):t.el.style.setProperty(`--r`,r.toFixed(4)))}}};xr(1);let Sr=()=>{pr>=0&&pr>mr+.05&&yr()};new ie(0,0,1);let $=new ie,Cr=(e,t=16.667)=>{if(!(t>.25))return;let n=Math.min(t,50)/16.667;if(Q!==null&&(H=Q),J!==null&&performance.now()-Xt>40&&(Wt*=.75**n),Math.abs(Y)>5e-5){let e=Y*w(C.inject,n);H+=e,Y-=e}else Y=0;if(J===null&&Q===null&&cn<0){let e=Qt?B*C.flickLead:C.vmax/w(C.damp,1);H=Math.max(V-e,Math.min(V+e,H))}if(J!==null&&pn){let e=1/(1+Math.abs(pt)*90);H+=-Math.sin(H/B*ue)*B*C.notch*e*w(.25,n)}let i=performance.now()-Zt,a=0,o=Q!==null;if(J===null&&(o||Math.abs(Y)<B*.08&&(i>$t||on))){if(o&&ln!==Q&&(cn=-1),cn<0){cn=performance.now(),H+=Y,Y=0;let e=ft/C.land*C.momentum,t=Math.max(-6,Math.min(6,e/B))*B;ln=o?Q:Math.round((H+t)/B)*B,un=ft}H=ln,a=1}else cn=-1;let s=V;if(a>0){let e=C.land,t=V-ln;un+=(-e*e*t-2*e*un)*n,un=Math.max(-C.vmax,Math.min(C.vmax,un)),V+=un*n,Math.abs(V-ln)<3e-4&&Math.abs(un)<4e-5&&(V=ln,un=0,Yn())}else V+=Math.max(-C.vmax*n,Math.min(C.vmax*n,(H-V)*w(C.damp,n)));ft=(V-s)/n,pt+=(ft-pt)*w(.16,n),qe.value=Math.tanh(pt*16),mt+=((ft-ht)/Math.max(n,.25)-mt)*w(.2,n),ht=ft,Je.value=Math.tanh(mt*260)*C.jerk,xr(n),Sr();let c=1/(1+Math.abs(pt)*C.calm);_t+=(+(U===`rest`||U===`check`)-_t)*w(.1,n);let l=Math.abs(qe.value);gt+=(l-gt)*w(l>gt?.3:a>0?.14:.06,n),Math.abs(l-gt)<5e-4&&(gt=l),Xe.value=C.soft,Ze.value=C.dof,Qe.value=C.lamp,F.uDepth.value=C.relief,F.uInkGloss.value=C.inkGloss,F.uStockGloss.value=C.stockGloss,F.uCavity.value=C.cavity,F.uSweepA.value=C.sweep,F.uGlint.value=C.glint,F.uTravelX.value=+!!W,F.uChrome.value=C.chrome,F.uTint.value=C.tint,F.uDisperse.value=C.disperse,F.uRim.value=C.rim,F.uRimLight.value=C.rimLight,F.uLife.value=C.chromeLife,F.uSweep.value=(-V*1.4%1+1)%1;let u=Z.t?`check`:J!==null&&pn?`hand`:a>0&&Math.abs(H-V)>.004?`landing`:gt>.35?`throw`:Math.abs(H-V)>.004||Math.abs(Y)>.001?`landing`:`rest`;if(u!==U&&(U=u,r.dataset.state=U),!(Math.abs(H-Math.round(H/B)*B)<5e-4)||Math.abs(H-V)>.03)yt=!1;else if(!yt&&Math.abs(H-V)<.004&&J===null&&Math.abs(Y)<.001){yt=!0,vr(),bt=0,xt=pt<0?-1:1;let e=(Math.round(-V/B)%A+A)%A;R[e].sS.v-=.009*C.life*C.press,z[e].wetIn=C.wet,z[e].wetT=0,ir=0}{let e=C.checkK,t=2*Math.sqrt(e)*C.checkZ;hn+=(e*(Z.t-Z.c)-t*hn)*n,Z.c+=hn*n,Math.abs(Z.t-Z.c)<5e-4&&Math.abs(hn)<5e-5&&(Z.c=Z.t,hn=0)}if(Z.i>=0){let e=On.get(Z.i);if(e?.on){if(e.ready&&Z.c>.35&&jn(Z.i),R[Z.i].mat.uniforms.uMap.value===e.tex){let t=R[Z.i].mat.uniforms,n=e.el.currentTime;n+.05<e.lastT&&(e.lapAt=performance.now()),e.lastT=n,t.uProg.value=e.el.duration>0?n/e.el.duration:0,t.uLineA.value=C.lineA;let r=(performance.now()-e.lapAt)/(C.lapMs||700);t.uLeave.value=r<1?r<.5?2**(20*r-10)/2:(2-2**(-20*r+10))/2:-1,M()}}else e?.landing&&Z.c<.02&&Pn(Z.i)}{let e=(Math.round(-V/B)%A+A)%A;e!==gn&&Math.abs(H-V)<.02&&J===null&&(gn=e,Mn(e,`metadata`))}let d=pe(Z.c),f=Math.abs(d-yn);yn=d;let p=Math.sin(Math.PI*Z.c),ee=Math.min(1,f/Math.max(n,.001)*10);bn+=(Math.max(p,ee)-bn)*w(p>bn?.5:.045,n),bn>.002?xn+=f*9+.06*n:bn=0,Sn+=(C.bank*Math.max(-1,Math.min(1,hn/(n*.04)))-Sn)*w(.12,n);let te=Sn;if(Z.c!==vn){vn=Z.c,r.style.setProperty(`--open`,Z.c.toFixed(4));for(let e of $n)e.style.opacity=(1-d).toFixed(3)}let m=Math.abs(H-V)>5e-4||Math.abs(pt)>15e-5||Math.abs(Y)>5e-5||Math.abs(Z.t-Z.c)>5e-4||bn>.002||Math.abs(H-Math.round(H/B)*B)>5e-4||br;if(Tn.v>.004?(Tn.v*=C.pulseFall**+n,m=!0):Tn.v=0,bt<3&&(bt+=Math.min(t,50)/1e3,St=de()?0:xt*O(C.huntA)*Math.exp(-bt*5)*Math.sin(bt*C.huntF),Math.abs(St)>1e-5?m=!0:(St=0,bt=3)),!vt&&!m&&(vt=!0),Math.abs(V)>400){let e=Math.round(V/ct)*ct;V-=e,H-=e,ln-=e,Q!==null&&(Q-=e)}for(let e of $e)e.uniforms.uBend.value=C.bend*.02,e.uniforms.uShear.value=C.shear*.06,e.uniforms.uTrail.value=C.trail*.03,e.uniforms.uWarp.value=C.warp*.03,e.uniforms.uPush.value=C.push*.03,e.uniforms.uRestWarp.value=C.restWarp*C.warp*.03,e.uniforms.uTravelX.value=+!!W,e.uniforms.uStreak.value=C.streak,e.uniforms.uGrain.value=C.grain,e.uniforms.uGrainV.value=C.grainReel;let h=(Math.round(-V/B)%A+A)%A;ir+=n;let g=W?Math.PI/2:0;if((Math.abs(ut.off)>4e-4||dt.v>4e-4)&&(m=!0),Vt(Math.max(dt.v,d*Lt)),d>5e-4&&Z.i>=0){let e=.3*G,t=2*Math.tan(O(P.fov)/2)*(C.camZ-e),n=t*P.aspect,i=W?Math.min(n*.86,t*.36*T):Math.min(n*C.checkW,t*.62*T);if(zn=i/nt,W?In.set(0,t*.17,e):In.set(-n*.19,0,e),W){let e=-(t*.17-i/T/2)/t*At(),n=C.plateW*G*se()/2;L.updateWorldMatrix(!0,!1),q.set(-(Ft+n),0,0),L.localToWorld(q).project(P);let a=-q.y*At()/2;r.style.setProperty(`--open-dy`,`${((e+a)/2-zt).toFixed(1)}px`)}else{let e=(-n*.19+i/2)/n*K(),t=C.plateW*G*se()/2;L.updateWorldMatrix(!0,!1),q.set(-(Ft+t),0,0),L.localToWorld(q).project(P);let a=q.x*K()/2;r.style.setProperty(`--open-dx`,`${((e+a)/2).toFixed(1)}px`),r.style.setProperty(`--open-dy`,`${(-zt).toFixed(1)}px`)}I.updateWorldMatrix(!0,!1),I.worldToLocal(In),Ln.copy(I.getWorldQuaternion(Rn)).invert()}let _=0,ne=0,v=C.idle>0&&!de()&&!document.hidden&&d<.02?C.idle:0;if(v&&(wn+=Math.min(t,50)/1e3*C.idleRate,m=!0),F.uIdle.value=wn,k.forEach((e,t)=>{let r=Ct(t*B+V+ut.off+St),i=pe(Math.max(0,1-Math.abs(r)/B))*(1-C.throwDim*gt),a=pt*C.lean*(7+it[t]*5),o=a;if(C.sway>0){let e=(.11+it[t]*.05)*C.sway;st(R[t].sway,a,e,2*Math.sqrt(e),n)>5e-4&&(m=!0),o=R[t].sway.x}let s=R[t];s.mat.uniforms.uFocus.value=i,s.mat.uniforms.uSpoke.value=r,s.mat.uniforms.uPulse.value=t===Z.i?Tn.v:0,s.mat.uniforms.uPulseA.value=C.pulseA,s.mat.uniforms.uPulseL.value=C.pulseL,s.mat.uniforms.uDrift.value=W?0:C.drift,s.mat.uniforms.uDim.value=C.dim,s.mat.uniforms.uCropY.value=C.cropY,s.mat.uniforms.uRadius.value=C.cornerR/100*Ge;let l=0,u=s.mat.uniforms.uPar.value;if(i<=.6&&s.g.visible&&X>-1e3&&J===null)Wn(t,X,mn).in&&(l=.45*C.life*c*_t);else if(i>.6&&X>-1e3){let{p:e,dx:r,dy:i}=Xn(t,X,mn);l=e*C.life*c,u.x+=(Math.max(-1,Math.min(1,r))-u.x)*w(.12,n),u.y+=(Math.max(-1,Math.min(1,-i))-u.y)*w(.12,n)}let f=t===Z.i&&d>5e-4,p=t===Z.i&&(d>.02||bn>.05),ee=l*(1-d);s.tube+=(ee-s.tube)*w(.12,n),Math.abs(ee-s.tube)>.002&&(m=!0),(f||p)&&(l=0),s.hov+=(l-s.hov)*w(.12,n),Math.abs(l-s.hov)>.002&&(m=!0),s.mat.uniforms.uHover.value=s.hov*C.parallax,s.mat.uniforms.uSheen.value=s.hov*C.sheen,s.mat.uniforms.uSheenH.value=C.sheenH,s.mat.uniforms.uSheenK.value=C.sheenK,s.mat.uniforms.uHand.value=s.hov,s.mat.uniforms.uDepthPar.value=C.depthPar,s.mat.uniforms.uDepthN.value=C.depthN,s.mat.uniforms.uDepthOn.value=s.mat.userData.depthFor&&s.mat.uniforms.uMap.value===s.mat.userData.depthFor?1:0,s.mat.uniforms.uTube.value=s.tube*C.tube*.03,s.mat.uniforms.uTubeS.value=C.tubeSide,s.mat.uniforms.uTubeZ.value=C.tubeDome,s.mat.uniforms.uFish.value=C.fish+s.tube*C.tubeLens;let h=i>.6&&!f&&!p?Math.min(1,s.hov*1.8)*C.stir*C.stirHand:0,re=f||p?0:v*C.stir*(i>.6?.22:.09),y=Math.max(h,re);y>_&&(_=y),h>ne&&(ne=h),s.mat.uniforms.uStir.value=y,s.mat.uniforms.uStirT.value=Cn,s.mat.uniforms.uStirOn.value=s.ring_.on,s.mat.uniforms.uFlag.value=t===Z.i?bn*C.flag:0,s.mat.uniforms.uFlagT.value=xn;let b=s.ring_,x=i>.6&&X>-1e3?Wn(t,X,mn):null,S=!!x?.in&&!p&&c>.6&&Math.abs(H-V)<.03,ie=!x||x.out||p||c<.3||i<.6;b.st===`off`?S&&(b.st=`engage`):b.st===`engage`?(b.on+=(1-b.on)*w(.14,n),ie?b.st=`release`:b.on>.985&&(b.on=1,b.st=`on`)):b.st===`on`?ie&&(b.st=`release`):b.st===`release`&&(b.on+=(0-b.on)*w(.1,n),S?b.st=`engage`:b.on<.01&&(b.on=0,b.st=`off`));let ae=+(b.st===`engage`||b.st===`on`);b.shine+=(ae-b.shine)*w(.16,n),(b.st===`engage`||b.st===`release`||Math.abs(ae-b.shine)>.002||b.on>.01)&&(m=!0);let oe=b.on*C.ring;s.ring.visible=b.on>.01,s.ring.visible&&(at=(at+.0042*C.ringSpeed*n)%1,ot=(ot+.0042*C.ringSpeed*n*.618)%1,s.ringMat.uniforms.uOn.value=oe,s.ringMat.uniforms.uHead.value=at,s.ringMat.uniforms.uHead2.value=ot,s.mat.uniforms.uHead.value=at,s.mat.uniforms.uHead2.value=ot,s.ringMat.uniforms.uShine.value=b.shine*C.ringShine,s.ringMat.uniforms.uHalf.value.set(C.cardW/2+C.ringGap,Ge/2+C.ringGap),s.ringMat.uniforms.uR.value=C.cornerR/100*Ge+C.ringGap,s.ringMat.uniforms.uW.value=C.ringW,s.ringMat.uniforms.uBase.value=C.ringBase,m=!0),st(s.sS,0,.16,.5,n)>.003&&(m=!0);let T=1;i>.5&&ir<260&&(T=1+Math.sin(ir*.04+1.7)*.3*(1-ir/260)*C.life),f&&(s.mat.uniforms.uRestWarp.value=(C.restWarp+(C.checkWarp-C.restWarp)*d)*C.warp*.03),s.mat.uniforms.uArc.value=C.arc*T*(f?1-d:1),f&&(s.mat.uniforms.uFish.value=C.fish*(1-d),s.mat.uniforms.uDrift.value=W?0:C.drift*(1-d));let ce=r+o,le=-u.y*.15*s.hov*C.frameTilt,E=-u.x*.15*s.hov*C.frameTilt,de=v?Math.sin(wn*.55+t*1.7)*.0022*G*v:0,fe=v?Math.sin(wn*.4+t)*.0022*v:0;s.g.position.set(Math.cos(ce)*Pt,Math.sin(ce)*Pt+de,(i*.06+s.hov*.025*C.frameTilt)*G),s.g.rotation.set(W?-E:le,W?le:E,ce+g+fe);let me=(.9+(C.focusS-.9)*i)*(1+s.sS.x)*(C.cardW/nt)*G;if(f&&(s.g.position.lerp(In,d),s.g.quaternion.slerp(Ln,d),me+=(zn-me)*d),t===Z.i&&Math.abs(te)>1e-5&&(W?s.g.rotateX(-te):s.g.rotateY(te)),s.g.scale.setScalar(me),s.ring.visible&&x){let e=s.ringMat.uniforms.uR.value,t=C.cardW/2+C.ringGap+e,n=Ge/2+C.ringGap+e;s.ringMat.uniforms.uCur.value=Math.atan2(x.ly/n,x.lx/t)/ue+.5}s.g.visible=Math.abs(r)<Math.PI*.72;let D=z[t],O=Math.PI-r;st(D.foc,i,C.dieFollow,2*Math.sqrt(C.dieFollow),n)>.001&&(m=!0);let he=Math.min(1,Math.max(0,D.foc.x)),ge=pt*C.lean*C.pLean*(6+D.seed*4),_e=st(D.wob,ge,.13+D.seed*.04,.34,n);_e+=st(D.rock,Je.value*.12*C.pRock*(.7+D.seed*.6),.16+D.seed*.05,.55,n),D.side.v+=Je.value*(D.seed-.5)*.02*C.pSide*n,_e+=st(D.side,0,.12+D.seed*.06,.52,n);{let e=.09+D.seed*.03;_e+=st(D.spin,-qe.value*.35*C.pSpin*(.8+D.seed*.4),e,2*Math.sqrt(e),n)}let ve=Math.tanh(D.spin.x)*1.2,ye=0,be=0,xe=0;if(i<=.6&&X>-1e3&&J===null)Gn(t,X,mn)&&(ye=.5*C.life*c*_t);else if(i>.6&&X>-1e3){D.g.getWorldPosition($).project(P);let e=($.x*.5+.5)*K(),t=(-$.y*.5+.5)*At(),n=C.plateW*G*1.35/(Tt||1)*K(),r=(X-e)/n,i=(mn-t)/n;ye=pe(Math.max(0,1-Math.hypot(r,i)))*C.life*c,be=i*.3,xe=-r*.3}D.hov+=(ye-D.hov)*w(.14,n),Math.abs(ye-D.hov)>.002&&(m=!0),D.mat.uniforms.uHov.value=D.hov,D.mat.uniforms.uCur.value.set(.5-be/.3*.5,.5+xe/.3*.5),D.wetIn>0?(D.wetT=Math.min(1,D.wetT+n/12),D.wet=Math.max(D.wet,D.wetIn*pe(D.wetT)),D.wetT>=1&&(D.wetIn=0),m=!0):D.wet>.001?(D.wet*=.955**n,m=!0):D.wet=0,D.mat.uniforms.uWet.value=D.wet,_e+=st(D.zS,i*.05+D.hov*.045,.14,.72,n),_e>.004&&(m=!0);let Se=0,Ce=0;if(i>.5&&ir<260){let e=1-ir/260;Se=Math.sin(ir*.045+t)*.0045*e*C.life,Ce=Math.sin(ir*.03+t*2)*.008*e*C.life,m=!0}let we=0,k=0;v&&(Se+=Math.sin(wn*.7+t*1.3)*.0035*v*C.life,Ce+=Math.sin(wn*.5+t*2.1)*.006*v*C.life,we=Math.sin(wn*.45+t)*.012*v,k=Math.cos(wn*.38+t*1.3)*.012*v),D.g.position.set(Math.cos(O)*Ft-Bt*he*(1-d),Math.sin(O)*Ft+Se*G,D.zS.x*G);let Te=(D.seed-.5)*.05,A=be*D.hov,Ee=xe*D.hov;D.g.rotation.set((W?-Ee:A)+we+(W?D.side.x+ve:D.rock.x),(W?A:Ee)+k+(W?D.rock.x:D.side.x+ve),-(r+D.wob.x)+Ce+Te+g),D.g.scale.setScalar((.85+(se()-.85)*he+.05*D.hov)*(C.plateW/rt)*G),D.g.visible=Math.abs(r)<Math.PI*.72}),Math.abs(Ct(h*B+V))<.35*B&&sr(h),Un(),_>.0015&&(Cn+=.0042*C.ringSpeed*n*6.28318*C.stirRate*(ne>.0015?1:.4*C.idleRate),m=!0),m?Ie=0:Ie++,Ie<8&&Or.ready()){for(let e of z)e.g.visible&&e.print();E.render(N,P)}},wr=[...Array.from(r.querySelectorAll(`[data-wheels-line]`)),tr(`.hv2__wlabel--l`),tr(`.hv2__wlabel--r`),Qn].filter(Boolean);e.set(wr,{autoAlpha:0,y:14});let Tr=!1,Er=t=>{if(Tr)return;Tr=!0,M();let n=t?.detail,r=n?.tl,i=(n?.wipeDur??0)*.5,a=(Math.round(-V/B)%A+A)%A,o={off:B*C.lurch,duration:1.25,ease:`power3.out`,onUpdate:M},s={off:0,duration:1.1,ease:`expo.out`,onUpdate:M,onComplete:()=>{vr(),z[a].zS.v+=.012*C.life,R[a].sS.v+=.006*C.life,ir=0,M()}},c={autoAlpha:1,y:0,duration:.9,ease:`expo.out`,stagger:.07,clearProps:`transform`},l={v:0,duration:1.5,ease:`expo.out`,onUpdate:M};r?(r.to(dt,l,i),r.to(ut,o,i+.05),r.to(ut,s,i+.05+1.25),r.to(wr,c,i+.45)):(e.to(dt,l),e.to(ut,{...o,delay:.05}),e.to(ut,{...s,delay:1.3}),e.to(wr,{...c,delay:.45}))};n.active?document.addEventListener(`veil:reveal`,Er,{once:!0,signal:j}):Er(),jt(!0),addEventListener(`resize`,()=>{jt();for(let e of lr)e.h=0;M()},{signal:j});let Dr=()=>{matchMedia(`(resolution: ${devicePixelRatio}dppx)`).addEventListener(`change`,()=>{jt(),M(),Dr()},{once:!0,signal:j})};Dr(),document.fonts?.ready.then(()=>{for(let e of lr)e.h=0;M()});let Or=ae(E,N,P);Or.done.then(M),e.ticker.add(Cr),sr(0);let kr=Fe.theme,Ar=null,jr=Ye(),Mr=new MutationObserver(()=>{let t=document.documentElement.getAttribute(`data-theme`)??`dark`;if(t===kr)return;let n=Ar?jr:Ye(),r=N.environmentIntensity;kr=t,Fe=he();for(let e of $e)e.uniforms.uInk.value.set(Fe.ink);let i=Ye(),a=t===`dark`?C.envD:C.envL;Ar?.kill();let o={k:0};Ar=e.to(o,{k:1,duration:de()?0:.4,ease:`power3.out`,onUpdate(){jr=n+(i-n)*o.k,N.environmentIntensity=r+(a-r)*o.k,z.forEach(e=>e.g.visible&&e.retint(jr)),M()},onComplete(){Ar=null,jr=i,N.environmentIntensity=a,z.forEach(e=>e.retint()),M()}})});Mr.observe(document.documentElement,{attributes:!0,attributeFilter:[`data-theme`]});let Nr=a(`wheels`,[{group:`the hand`,rows:[{key:`damp`,label:`follow`,min:.03,max:.2,step:.005,value:C.damp,hint:`how tightly the angle follows the target — drag and scroll alike`},{key:`vmax`,label:`top speed`,min:.01,max:.2,step:.005,value:C.vmax,unit:`rad/f`,hint:`the governor — the angle never turns faster; the scroll may lead by vmax ÷ follow`},{key:`drag`,label:`drag gain`,min:.001,max:.008,step:1e-4,value:C.drag,unit:`rad/px`},{key:`wheel`,label:`scroll gain`,min:3e-4,max:.003,step:1e-4,value:C.wheel,unit:`rad/px`},{key:`flick`,label:`flick`,min:0,max:240,step:5,value:C.flick,hint:`release momentum from the hand's last frames`},{key:`touchPitch`,label:`thumb pitch`,min:50,max:220,step:5,value:C.touchPitch,unit:`px`,hint:`finger travel per station on touch (the mouse keeps drag gain)`},{key:`flickMin`,label:`flick intent`,min:.1,max:1.5,step:.05,value:C.flickMin,unit:`px/ms`,hint:`a touch released faster than this always reaches the next station`},{key:`flickLead`,label:`flick reach`,min:.1,max:2,step:.05,value:C.flickLead,unit:`st`,hint:`how far past the angle a released hand may throw the target`},{key:`notch`,label:`detent teeth`,min:0,max:.2,step:.005,value:C.notch,hint:`the ratchet under a slow drag`}]},{group:`the scroll`,rows:[{key:`tail`,label:`tail cut`,min:0,max:.8,step:.05,value:C.tail,hint:`a decaying run that falls to this share of its peak is OS momentum — the landing takes over`},{key:`floor`,label:`tail min peak`,min:0,max:60,step:2,value:C.floor,unit:`px`,hint:`a run that never reached this is a crawl, never cut`},{key:`stepIn`,label:`notch step`,min:.01,max:.3,step:.01,value:C.stepIn,unit:`st`,hint:`a lone notch lands this much at once`},{key:`inject`,label:`notch ramp`,min:.08,max:.6,step:.02,value:C.inject,hint:`the rate the rest of a notch feeds in`}]},{group:`the landing`,rows:[{key:`land`,label:`landing spring`,min:.05,max:.4,step:.01,value:C.land,unit:`rad/f`,hint:`critically damped — 0.24 seats a station in ~0.35s`},{key:`momentum`,label:`landing reach`,min:0,max:2,step:.05,value:C.momentum,hint:`the picker: 1 = the station where the coast would stop, 0 = the nearest`},{key:`press`,label:`impression`,min:0,max:3,step:.1,value:C.press},{key:`huntA`,label:`settle hunt`,min:0,max:1.5,step:.05,value:C.huntA,unit:`°`},{key:`huntF`,label:`settle rate`,min:2,max:16,step:.5,value:C.huntF},{key:`calm`,label:`calm gate`,min:0,max:800,step:10,value:C.calm,hint:`how fast hover treatments recede with spin`}]},{group:`the ticket`,rows:[{key:`reel`,label:`reels`,min:0,max:1,step:1,value:C.reel,hint:`the ticket's characters spin on themselves as the cylinder seats (0 = off)`},{key:`reelTurns`,label:`reel turns`,min:1,max:12,step:1,value:C.reelTurns,hint:`turns per character, ±1 at random`},{key:`reelDur`,label:`reel spin-down`,min:.4,max:4,step:.1,value:C.reelDur,unit:`s`,hint:`from the first turn to the stop — an expo-out`},{key:`reelEach`,label:`reel stagger`,min:0,max:.2,step:.005,value:C.reelEach,unit:`s`,hint:`between one character's start and the next, random order`},{key:`reelDelay`,label:`reel delay`,min:0,max:2,step:.05,value:C.reelDelay,unit:`s`,hint:`after the ticket has settled, before the first reel turns`},{key:`reelIn`,label:`reel wind-up`,min:0,max:.6,step:.02,value:C.reelIn,hint:`share of the spin-down each glyph eases into its turn (0 = leaves at full speed)`},{key:`reelLine`,label:`reel line cascade`,min:0,max:.3,step:.01,value:C.reelLine,unit:`s`,hint:`between one line's reels and the next, top down`},{key:`reelIdle`,label:`reel idle replay`,min:0,max:20,step:.5,value:C.reelIdle,unit:`s`,hint:`rest between idle replays (0 = only at the seat)`}]},{group:`the wheel`,rows:[{key:`radius`,label:`radius`,min:.6,max:2,step:.05,value:C.radius},{key:`overlap`,label:`overlap`,min:.15,max:.7,step:.01,value:C.overlap,hint:`share of the radius inside the viewport`},{key:`slots`,label:`stations per turn`,min:5,max:14,step:1,value:C.slots},{key:`tiltX`,label:`pitch`,min:-30,max:10,step:1,value:C.tiltX,unit:`°`},{key:`tiltY`,label:`turn`,min:-10,max:34,step:1,value:C.tiltY,unit:`°`,hint:`toward the centre; mirrored on the right`},{key:`camZ`,label:`camera z`,min:2.2,max:5,step:.1,value:C.camZ},{key:`balance`,label:`ring balance`,min:0,max:1,step:.05,value:C.balance,hint:`side by side: lift the rig until the neighbours above and below show alike (the pitch tips the lower ones toward you)`},{key:`dieFollow`,label:`die activation`,min:.02,max:.4,step:.01,value:C.dieFollow,hint:`how tightly the active die's grow + slide-in follow the wheel (lower = a softer glide into place)`},{key:`dieRatio`,label:`active die size`,min:.4,max:1,step:.01,value:C.dieRatio,hint:`the active die's side as a share of the active proof's height (0.57 = the old fixed 1.2×)`},{key:`nip`,label:`die to the nip`,min:0,max:1,step:.05,value:C.nip,hint:`side by side: the active die slides in from its seat; 1 = as far from the ticket as the proof, 0 = stays on the ring`},{key:`nipSide`,label:`image side's share`,min:0,max:1,step:.05,value:C.nipSide,hint:`of the correction: the proof moves out by this share, the die comes in for the rest`},{key:`nipMargin`,label:`image margin`,min:0,max:.12,step:.005,value:C.nipMargin,hint:`the outer margin the proof keeps when it moves out, share of the width`},{key:`nipClear`,label:`road clearance`,min:0,max:.3,step:.01,value:C.nipClear,hint:`the air the ticket's sheet keeps from each piece (its width follows the real gap)`},{key:`pitchGap`,label:`stacked pitch gap`,min:0,max:.4,step:.01,value:C.pitchGap,hint:`clear air between the active sheet and its neighbours, stacked`},{key:`stackY`,label:`stack lift`,min:-.3,max:.3,step:.01,value:C.stackY,hint:`stacked layout only`},{key:`cardW`,label:`proof width`,min:.28,max:.8,step:.02,value:C.cardW},{key:`plateW`,label:`die width`,min:.12,max:.4,step:.01,value:C.plateW},{key:`cornerR`,label:`corner radius`,min:0,max:12,step:.5,value:C.cornerR,unit:`%`},{key:`cropY`,label:`crop bias`,min:0,max:1,step:.02,value:C.cropY,hint:`1 = toward the top, heads survive`},{key:`lurch`,label:`entrance lurch`,min:0,max:1,step:.02,value:C.lurch,unit:`st`,hint:`stations the press rolls past its first detent`}]},{group:`the active proof`,rows:[{key:`focusS`,label:`focus scale`,min:1,max:1.6,step:.02,value:C.focusS},{key:`drift`,label:`drift to centre`,min:0,max:.3,step:.005,value:C.drift},{key:`arc`,label:`ribbon arc`,min:0,max:.08,step:.002,value:C.arc},{key:`fish`,label:`lens`,min:0,max:.5,step:.01,value:C.fish},{key:`restWarp`,label:`rest warp`,min:0,max:1,step:.05,value:C.restWarp,hint:`the share of the warp the active proof keeps at rest`},{key:`checkWarp`,label:`check warp`,min:0,max:1.5,step:.05,value:C.checkWarp,hint:`the share it keeps enlarged under the press check`},{key:`throwDim`,label:`throw withholds swell`,min:0,max:1,step:.05,value:C.throwDim},{key:`dim`,label:`traveller dim`,min:0,max:.5,step:.02,value:C.dim},{key:`dof`,label:`traveller focus`,min:0,max:3,step:.05,value:C.dof,hint:`mip levels a traveller sits behind`},{key:`lamp`,label:`one lamp`,min:0,max:.8,step:.02,value:C.lamp,hint:`how far a turned proof falls into shadow`},{key:`sheen`,label:`hand sheen`,min:0,max:.5,step:.01,value:C.sheen,hint:`the glass lit by a lamp over the hand — it reflects off the cloth's own surface`},{key:`sheenH`,label:`sheen lamp height`,min:.15,max:3,step:.05,value:C.sheenH,hint:`× card height — low = a small pool that skates, high = a broad glaze`},{key:`sheenK`,label:`sheen spread`,min:2,max:40,step:1,value:C.sheenK,hint:`the lobe — higher = tighter`},{key:`tube`,label:`tube`,min:0,max:3,step:.05,value:C.tube,hint:`the old set's glass under the hand — every edge bows out, 1 ≈ 3% of the width`},{key:`tubeSide`,label:`tube: sides' share`,min:0,max:2,step:.05,value:C.tubeSide,hint:`the short edges' bow relative to the long ones`},{key:`tubeDome`,label:`tube: dome`,min:0,max:3,step:.05,value:C.tubeDome,hint:`the face swelling toward the eye — the sheen skates over it`},{key:`tubeLens`,label:`tube: lens`,min:0,max:1,step:.01,value:C.tubeLens,hint:`the picture bulging with the glass (adds to the fish under the hand)`},{key:`depthPar`,label:`relief: parallax`,min:0,max:.1,step:.002,value:C.depthPar,hint:`the picture's near parts shift with the hand, the far parts against it (its depth map)`},{key:`depthN`,label:`relief: in the sheen`,min:0,max:8,step:.1,value:C.depthN,hint:`the depth's slope tilts the glass's normal — the highlight rolls over the subject`}]},{group:`the cloth`,rows:[{key:`bend`,label:`bow`,min:0,max:3,step:.05,value:C.bend},{key:`shear`,label:`shear`,min:0,max:3,step:.05,value:C.shear},{key:`warp`,label:`warp`,min:0,max:4,step:.1,value:C.warp,hint:`in plane along the travel`},{key:`push`,label:`push`,min:-4,max:4,step:.1,value:C.push,hint:`the centre column leads the corners`},{key:`trail`,label:`trail`,min:-3,max:3,step:.1,value:C.trail,hint:`the trailing edge curls back; sign flips the edge`},{key:`sway`,label:`inertia`,min:0,max:3,step:.1,value:C.sway,hint:`the lean lags a throw`},{key:`lean`,label:`lean`,min:0,max:2,step:.05,value:C.lean},{key:`jerk`,label:`jerk feed`,min:0,max:3,step:.1,value:C.jerk,hint:`how much acceleration feeds the bow and the rock`},{key:`streak`,label:`chromatic streak`,min:0,max:2,step:.05,value:C.streak},{key:`soft`,label:`motion softness`,min:0,max:6,step:.1,value:C.soft,hint:`mip levels a full throw pushes out of focus`},{key:`grain`,label:`paper grain`,min:0,max:1,step:.05,value:C.grain},{key:`grainReel`,label:`reel grain`,min:0,max:.2,step:.005,value:C.grainReel,hint:`the tooth over a playing reel, in display space (the stills keep the paper grain)`}]},{group:`the dies`,rows:[{key:`pLean`,label:`lag`,min:0,max:4,step:.1,value:C.pLean},{key:`pRock`,label:`rock`,min:0,max:3,step:.1,value:C.pRock,hint:`tip under acceleration and braking`},{key:`pSide`,label:`side wobble`,min:0,max:3,step:.1,value:C.pSide},{key:`pSpin`,label:`spin`,min:0,max:3,step:.1,value:C.pSpin},{key:`life`,label:`plate life`,min:0,max:1.5,step:.05,value:C.life,hint:`drop-settle / wobble / hover / breath`}]},{group:`the die's face`,rows:[{key:`relief`,label:`relief depth`,min:0,max:3,step:.05,value:C.relief,hint:`the mark cut into the die — normal strength`},{key:`bevelPx`,label:`relief bevel`,min:.5,max:12,step:.5,value:C.bevelPx,unit:`px`,hint:`the cut's softness — rebakes every die`},{key:`inkGloss`,label:`ink gloss`,min:0,max:1.5,step:.05,value:C.inkGloss},{key:`inkGate`,label:`ink gate`,min:0,max:200,step:5,value:C.inkGate,hint:`a flat mark this close in value to its stock is re-inked in the stock's opposite`},{key:`inkSat`,label:`ink gate: flat under`,min:0,max:.6,step:.02,value:C.inkSat,hint:`mean saturation — coloured marks keep their colour`},{key:`stockGloss`,label:`stock gloss`,min:0,max:1,step:.02,value:C.stockGloss},{key:`cavity`,label:`recess shadow`,min:0,max:2,step:.05,value:C.cavity},{key:`wet`,label:`wet flash`,min:0,max:2,step:.05,value:C.wet,hint:`fresh ink at the landing, drying`},{key:`sweep`,label:`glancing band`,min:0,max:2,step:.05,value:C.sweep,hint:`a light passing over the face with the wheel's speed`},{key:`glint`,label:`cursor glint`,min:0,max:2,step:.05,value:C.glint},{key:`chrome`,label:`chrome`,min:0,max:1,step:.05,value:C.chrome,hint:`the inked top as polished metal (0 = true ink)`},{key:`tint`,label:`brand tint`,min:0,max:1,step:.05,value:C.tint,hint:`the brand colour left in the chrome`},{key:`disperse`,label:`dispersion`,min:0,max:3,step:.1,value:C.disperse,hint:`the spectral split at the band's edges`},{key:`chromeLife`,label:`chrome breath`,min:0,max:3,step:.1,value:C.chromeLife,hint:`the band's slow drift on the idle clock — each die its own phase`},{key:`stockDark`,label:`stock, dark`,min:0,max:1,step:.02,value:C.stockDark,hint:`the die's tone in the dark theme — 0 black, 1 bone`},{key:`stockLight`,label:`stock, light`,min:0,max:1,step:.02,value:C.stockLight},{key:`flake`,label:`metallic flake`,min:0,max:1.5,step:.05,value:C.flake,hint:`the speck on face and body — retints every die`},{key:`rim`,label:`iridescent rim`,min:0,max:2,step:.05,value:C.rim,hint:`the thin-film lip inside the face's edge`},{key:`rimLight`,label:`rim on bone`,min:0,max:1,step:.05,value:C.rimLight,hint:`the lip PRINTED on a light die (0 = none; lit, it clipped to a white line)`},{key:`bodyLight`,label:`bone body`,min:.6,max:1,step:.01,value:C.bodyLight,hint:`a light die's body albedo — matched to the unlit face so it doesn't frame it white`},{key:`iridescence`,label:`body iridescence`,min:0,max:1,step:.05,value:C.iridescence,hint:`three's thin film on the bevels and sides (dark only)`}]},{group:`the idle`,rows:[{key:`idle`,label:`life`,min:0,max:4,step:.1,value:C.idle},{key:`idleRate`,label:`tempo`,min:.2,max:3,step:.1,value:C.idleRate},{key:`stir`,label:`stir`,min:0,max:.15,step:.005,value:C.stir,hint:`the sheet's breath — the idle whisper rides this`},{key:`stirHand`,label:`stir under the hand`,min:0,max:1,step:.05,value:C.stirHand,hint:`0 = the hover does not stir the sheet (the idle whisper stays)`},{key:`stirRate`,label:`breaths per lap`,min:.5,max:6,step:.25,value:C.stirRate}]},{group:`the hover`,rows:[{key:`frameTilt`,label:`frame tilt`,min:0,max:1.5,step:.05,value:C.frameTilt},{key:`parallax`,label:`image parallax`,min:0,max:1,step:.05,value:C.parallax},{key:`ring`,label:`focus ring`,min:0,max:1.5,step:.05,value:C.ring},{key:`ringSpeed`,label:`ring speed`,min:.2,max:3,step:.1,value:C.ringSpeed},{key:`ringGap`,label:`ring gap`,min:.004,max:.055,step:.002,value:C.ringGap},{key:`ringW`,label:`ring width`,min:.0015,max:.012,step:5e-4,value:C.ringW},{key:`ringBase`,label:`ring base`,min:0,max:.5,step:.01,value:C.ringBase},{key:`ringShine`,label:`ring shine`,min:0,max:1.5,step:.05,value:C.ringShine},{key:`pulseA`,label:`click flash split`,min:0,max:.3,step:.005,value:C.pulseA},{key:`pulseL`,label:`click flash lens`,min:0,max:1,step:.05,value:C.pulseL},{key:`pulseFall`,label:`click flash decay`,min:.7,max:.97,step:.01,value:C.pulseFall}]},{group:`the press check`,rows:[{key:`checkW`,label:`sheet width`,min:.3,max:.6,step:.01,value:C.checkW,hint:`share of the stage`},{key:`checkK`,label:`flight spring`,min:.004,max:.03,step:.001,value:C.checkK},{key:`checkZ`,label:`flight damping`,min:.6,max:1.2,step:.02,value:C.checkZ,hint:`1 = no overshoot`},{key:`flag`,label:`flutter`,min:0,max:.3,step:.005,value:C.flag},{key:`bank`,label:`bank`,min:0,max:.6,step:.01,value:C.bank,unit:`rad`},{key:`lapMs`,label:`reel line lap`,min:200,max:1500,step:50,value:C.lapMs,unit:`ms`},{key:`lineA`,label:`reel line strength`,min:.1,max:1,step:.05,value:C.lineA}]},{group:`the room`,rows:[{key:`envD`,label:`environment, dark`,min:0,max:2,step:.02,value:C.envD},{key:`envL`,label:`environment, light`,min:0,max:2,step:.02,value:C.envL}]}],e=>{let t=C.bevelPx,n=Ye(),r=C.flake,i=C.iridescence,a=C.inkGate+C.inkSat,o=C.bodyLight;Object.assign(C,e),C.bevelPx===t?(Ye()!==n||C.flake!==r||C.iridescence!==i||C.inkGate+C.inkSat!==a||C.bodyLight!==o)&&z.forEach(e=>e.retint()):z.forEach(e=>e.rebake()),lt(),P.position.z=C.camZ,N.environmentIntensity=Fe.theme===`dark`?C.envD:C.envL,jt(!0)});Nr&&t(Nr),new URLSearchParams(location.search).get(`debug`)===`wheels`&&(window.__wheels={P:C,cam:P,layout:()=>({stacked:W,fit:G,visW:Tt,visH:wt,seatA:Mt,seatB:Nt,ringA:Pt,ringB:Ft,dieIn:Bt,wingMag:It,bandMid:Et}),state:()=>({th:V,tar:H,vel:ft,shown:rr,check:{...Z}}),rings:()=>R.map(e=>({...e.ring_})),pose:(e=0)=>{let t=R[e];return[...t.g.position.toArray(),t.g.rotation.x,t.g.rotation.y,t.g.rotation.z,t.g.scale.x,t.hov,Z.c]},open:e=>En(e??(Math.round(-V/B)%A+A)%A),close:Dn,step:(e=1,t=16.7)=>{for(let n=0;n<e;n++)Cr(0,t)},setTar:e=>{H=e},pieces:()=>{let e=r.clientWidth,t=r.clientHeight,n=(n,r,i)=>{n.updateWorldMatrix(!0,!1);let a=[],o=[];for(let[s,c]of[[-r,-i],[r,-i],[r,i],[-r,i]])q.set(s,c,0).applyMatrix4(n.matrixWorld).project(P),a.push((q.x*.5+.5)*e),o.push((-q.y*.5+.5)*t);let s=Math.min(...a),c=Math.max(...a),l=Math.min(...o),u=Math.max(...o),d=Math.max(0,Math.min(c,e)-Math.max(s,0)),f=Math.max(0,Math.min(u,t)-Math.max(l,0)),p=document.querySelector(`[data-header] .header__bar`),ee=p?p.getBoundingClientRect().bottom:0,te=Math.max(0,Math.min(u,t)-Math.max(l,ee)),m=Math.round,h=(c-s)*(u-l)||1;return{cx:m((s+c)/2),cy:m((l+u)/2),l:m(s),t:m(l),r:m(c),b:m(u),shown:m(100*d*f/h),inBand:m(100*d*te/h)}},i=(Math.round(-V/B)%A+A)%A,a=e=>(i+e+A)%A,o=e=>n(R[e].g,nt/2,nt/T/2),s=e=>n(z[e].g,rt/2,rt/2),c=document.querySelector(`[data-header] .header__bar`);return{W:e,H:t,band:c?Math.round(c.getBoundingClientRect().bottom):0,proofPrev:o(a(-1)),proof:o(i),proofNext:o(a(1)),diePrev:s(a(-1)),die:s(i),dieNext:s(a(1))}},relayout:()=>{lt(),jt(!0);for(let e of lr)e.h=0;M()},probe:()=>{let e={th:V,tar:H,vel:ft,leanV:pt,energy:gt,hunt:St,gust:bn,stirT:Cn,checkT:Z.t,checkC:Z.c,checkI:Z.i,machine:U,cursor:r.style.cursor,wheelBuf:Y,entered:+!!vt,entOff:ut.off},t=[`uFocus`,`uHover`,`uSheen`,`uStir`,`uStirOn`,`uPulse`,`uFlag`,`uArc`,`uFish`,`uDrift`,`uReveal`,`uSpoke`,`uImgA`];return R.forEach((n,r)=>{let i=`c${r}.`,a=n.g.position,o=n.g.rotation;e[i+`x`]=a.x,e[i+`y`]=a.y,e[i+`z`]=a.z,e[i+`rx`]=o.x,e[i+`ry`]=o.y,e[i+`rz`]=o.z,e[i+`s`]=n.g.scale.x,e[i+`hov`]=n.hov,e[i+`vis`]=+!!n.g.visible,e[i+`ring`]=n.ring_.on,e[i+`shine`]=n.ring_.shine,e[i+`ringSt`]=n.ring_.st;for(let r of t)e[i+r]=n.mat.uniforms[r].value;e[i+`map`]=n.mat.uniforms.uMap.value?.uuid??``;let s=n.mat.uniforms.uPar.value;e[i+`parx`]=s.x,e[i+`pary`]=s.y}),z.forEach((t,n)=>{let r=`p${n}.`,i=t.g.position,a=t.g.rotation;e[r+`x`]=i.x,e[r+`y`]=i.y,e[r+`z`]=i.z,e[r+`rx`]=a.x,e[r+`ry`]=a.y,e[r+`rz`]=a.z,e[r+`s`]=t.g.scale.x,e[r+`hov`]=t.hov,e[r+`vis`]=+!!t.g.visible}),lr.forEach((t,n)=>{e[`l${n}.th`]=t.th,t.copies.forEach((t,r)=>{e[`l${n}.y${r}`]=t.style.transform})}),e},bring:Jn,screenOf:(e,t)=>((e===`card`?R[t].g:z[t].g).getWorldPosition($).project(P),[($.x*.5+.5)*r.clientWidth,(-$.y*.5+.5)*r.clientHeight]),active:()=>(Math.round(-V/B)%A+A)%A,reel:e=>On.get(e)?.el??null,N:A,STEP:B},o(()=>import(`./wheels-lab.BC1G2FRG.js`).then(e=>{window.__wheels.lab=e}),__vite__mapDeps([0,1]))),t(()=>{Ee.abort(),clearTimeout(or),e.ticker.remove(Cr),Mr.disconnect(),On.forEach((e,t)=>{e.on?Fn(t,!0):e.landing&&Pn(t)}),Pe.forEach(e=>e.dispose()),N.traverse(e=>{let t=e;t.isMesh&&(t.geometry?.dispose(),(Array.isArray(t.material)?t.material:[t.material]).forEach(e=>{e.map?.dispose(),e.dispose()}))}),E.dispose(),E.forceContextLoss(),Le.remove()})}};export{Pe as Wheels};