import{f as e,r as t,t as n}from"./mesh.DnpBQ695.js";import{r}from"./assets.DBbF6dnf.js";var i=[...[22,25,27].map(e=>`dts/unwrapped/DTS_Unwrapped_by_FRANCO_DUPUY_${e}.jpg`),...[6,17,44].map(e=>`dts/landing-site/DTS_Landing_Site_by_Fanette_Guilloud_${e}.jpg`)],a=i.length,o=i.map((e,t)=>`p${t}`),s={damp:.085,bend:1,fetch:0,memory:1},c={damp:[.085,.02,.3,.005],bend:[1,0,2,.05],fetch:[0,0,800,25],memory:!0},l=1.5,u=.4,d=48,f=16,p=`#version 300 es
in vec2 aUv;
uniform vec4 uRect;  // x, y, w, h — css px, y down
uniform vec2 uRes;   // css px
uniform vec2 uVel;   // smoothed px/frame
uniform float uBend;
out vec2 vUv;
void main() {
  vUv = aUv;
  vec2 p = uRect.xy + aUv * uRect.zw;
  // Paper flex: the center leads, the edges trail the motion. Zero at rest.
  p.x -= uVel.x * uBend * (1.0 - sin(3.14159 * aUv.x));
  p.y -= uVel.y * uBend * (1.0 - sin(3.14159 * aUv.y));
  gl_Position = vec4(p.x / uRes.x * 2.0 - 1.0, 1.0 - p.y / uRes.y * 2.0, 0.0, 1.0);
}`,m=`#version 300 es
precision highp float;
uniform sampler2D uImg;
uniform vec2 uImgRes;
uniform vec4 uRect;
uniform float uAlpha;
in vec2 vUv;
out vec4 outColor;
void main() {
  // object-fit: cover crop against the plane's live aspect.
  float rc = uRect.z / max(uRect.w, 1.0);
  float ri = uImgRes.x / uImgRes.y;
  vec2 uv = vUv;
  if (rc > ri) { float s = ri / rc; uv.y = (uv.y - 0.5) * s + 0.5; }
  else { float s = rc / ri; uv.x = (uv.x - 0.5) * s + 0.5; }
  // The photo as-is — no treatment fights the flight.
  vec4 t = texture(uImg, uv);
  float a = uAlpha * t.a; // the mesh tile's transparent ground stays open
  outColor = vec4(t.rgb * a, a);
}`,h=`
  .pu { position: absolute; inset: 0; user-select: none; }

  /* clear of the stage's docs button in the top-left corner */
  .pu__tabs { position: absolute; inset-inline-start: 56px;
    inset-block-start: var(--s-12); display: flex; gap: 18px; z-index: 3; }
  .pu__tab { appearance: none; background: none; border: 0; padding: 2px 0 6px;
    font-family: var(--font-mono); font-size: var(--fs-mono-meta);
    letter-spacing: 0.06em; text-transform: uppercase; cursor: pointer;
    color: var(--ink-muted); transition: color 0.25s var(--ease-in-cubic); }
  .pu__tab.is-on { color: var(--ink); transition: color 0.55s var(--ease-out-expo); }
  /* one shared underline, slid between tabs (the flip-pill move, small) */
  .pu__tabline { position: absolute; inset-block-end: 0; inset-inline-start: 0;
    height: 1px; width: 20px; background: var(--ink);
    transition: transform 0.55s var(--ease-out-expo), width 0.55s var(--ease-out-expo); }

  .pu__field { position: absolute; inset: 52px var(--s-16) 44px; }
  .pu__board { position: absolute; inset: 0; display: none; }
  .pu__board.is-on { display: grid; }

  /* Invisible boxes — almost. A pencil-line frame at the edge of perception
     marks the board's layout while textures load; the planes cover it. */
  .pu__slot { position: relative; min-height: 0; min-width: 0; cursor: pointer;
    border: 1px solid color-mix(in srgb, var(--ink) 8%, transparent); }
  .pu__slot:focus-visible { outline: 2px solid var(--ink); outline-offset: 4px; }
  .pu__slot img { position: absolute; inset: 0; width: 100%; height: 100%;
    object-fit: cover; pointer-events: none; }
  .pu__tag { position: absolute; inset-inline-start: 0;
    inset-block-start: calc(100% + 4px); font-family: var(--font-mono);
    font-size: 9px; letter-spacing: 0.16em; color: var(--ink-muted);
    text-transform: uppercase; white-space: nowrap; pointer-events: none; }

  .pu__index.is-on { grid-template: repeat(2, minmax(0, 1fr)) / repeat(3, minmax(0, 1fr));
    gap: 24px 14px; padding-block-end: 16px; }
  .pu__spread.is-on { grid-template-columns: minmax(0, 1fr) clamp(90px, 16%, 150px);
    gap: 14px; padding-block-end: 16px; }
  .pu__rail { display: grid; grid-template-rows: repeat(var(--pu-rail), minmax(0, 1fr));
    gap: 20px 0; min-height: 0; }
  .pu__strip.is-on { grid-template-columns: repeat(var(--pu-n), minmax(0, 1fr));
    gap: 14px; align-content: center; }
  .pu__strip .pu__slot { aspect-ratio: 3 / 4; align-self: center; }

  .pu__canvas { position: absolute; inset: 0; width: 100%; height: 100%;
    z-index: 2; pointer-events: none; }

  .pu__hud { position: absolute; inset-inline: var(--s-16);
    inset-block-end: var(--s-12); display: flex; justify-content: space-between;
    font-family: var(--font-mono); font-size: var(--fs-mono-meta);
    letter-spacing: 0.06em; color: var(--ink-muted); text-transform: uppercase;
    pointer-events: none; z-index: 3; }
`,g=!1;function ee(){if(g)return;g=!0;let e=document.createElement(`style`);e.dataset.labStyle=`paste-up`,e.textContent=h,document.head.append(e)}var _=e=>String(e).padStart(2,`0`),v={mount(c){ee();let h=matchMedia(`(prefers-reduced-motion: reduce)`).matches,g={...s},v=document.createElement(`div`);v.className=`pu`,v.style.setProperty(`--pu-n`,String(a)),v.style.setProperty(`--pu-rail`,String(a-1));let y=(e,t)=>`<div class="pu__slot" data-print="${e}" tabindex="0" role="button" aria-label="print ${Number(e.slice(1))+1}"><span class="pu__tag">${t}</span></div>`;v.innerHTML=`
      <nav class="pu__tabs">
        ${[`index`,`spread`,`strip`].map((e,t)=>`<button class="pu__tab${t===0?` is-on`:``}" data-board="${e}">${e}</button>`).join(``)}
        <i class="pu__tabline"></i>
      </nav>
      <div class="pu__field">
        <div class="pu__board pu__index is-on">
          ${o.map((e,t)=>y(e,`PRINT::${_(t+1)}`)).join(``)}
        </div>
        <div class="pu__board pu__spread">
          ${y(`p0`,`PLATE`)}
          <div class="pu__rail">
            ${o.slice(1).map(e=>y(e,``)).join(``)}
          </div>
        </div>
        <div class="pu__board pu__strip">
          ${o.map((e,t)=>y(e,`${_(t+1)}A`)).join(``)}
        </div>
        <canvas class="pu__canvas" aria-hidden="true"></canvas>
      </div>
      <div class="pu__hud">
        <span data-pu-board>BOARD::INDEX</span><span>A PRINT BELONGS TO ITS ID</span>
      </div>`,c.append(v);let b=v.querySelector(`.pu__field`),x=v.querySelector(`.pu__canvas`),S={index:v.querySelector(`.pu__index`),spread:v.querySelector(`.pu__spread`),strip:v.querySelector(`.pu__strip`)},C=[...v.querySelectorAll(`.pu__tab`)],w=v.querySelector(`.pu__tabline`),T=v.querySelector(`[data-pu-board]`),E=x.getContext(`webgl2`,{alpha:!0,antialias:!1});E||(x.remove(),v.querySelectorAll(`[data-print]`).forEach(e=>{let t=new Image;t.src=r(i[Number(e.dataset.print.slice(1))],720),e.prepend(t)}));let D=`index`,O=`p0`,k=new Map,A=()=>{S[D].querySelectorAll(`[data-print]`).forEach(e=>k.set(e.dataset.print,e))};A();let j=e=>{},M=e=>{O=e,j(Number(e.slice(1)));let t=S.spread.querySelectorAll(`[data-print]`),n=o.filter(t=>t!==e);t.forEach((t,r)=>t.dataset.print=r===0?e:n[r-1]),E||t.forEach(e=>{let t=e.querySelector(`img`);t&&(t.src=r(i[Number(e.dataset.print.slice(1))],720))})},N=o.map(()=>({cur:{x:0,y:0,w:0,h:0},tar:{x:0,y:0,w:0,h:0},vel:{x:0,y:0},alpha:0,placed:!1})),P=()=>{let e=b.getBoundingClientRect();o.forEach((t,n)=>{let r=k.get(t);if(!r)return;let i=r.getBoundingClientRect();if(i.width<1&&g.memory)return;let a=N[n];a.tar={x:i.left-e.left,y:i.top-e.top,w:i.width,h:i.height},(!a.placed||h)&&(a.cur={...a.tar},a.placed=!0)}),Q()},F=0,I=()=>{C.forEach(e=>e.classList.toggle(`is-on`,e.dataset.board===D));let e=C.find(e=>e.dataset.board===D);w.style.transform=`translate3d(${e.offsetLeft}px, 0, 0)`,w.style.width=`${e.offsetWidth}px`,T.textContent=`BOARD::${D.toUpperCase()}`},L=(e,t)=>{clearTimeout(F),S[D].classList.remove(`is-on`),P(),D=e,I();let n=()=>{e===`spread`&&M(t??O),S[e].classList.add(`is-on`),A(),P()};g.fetch>0&&!h?F=window.setTimeout(n,g.fetch):n()};C.forEach(e=>e.addEventListener(`click`,()=>{e.dataset.board!==D&&L(e.dataset.board)}));let R=e=>{let t=e.target.closest(`[data-print]`);if(!t)return;let n=t.dataset.print;D===`spread`?n===O?L(`index`):(M(n),A(),P()):L(`spread`,n)};b.addEventListener(`click`,R);let z=e=>{if(e.key!==`Enter`&&e.key!==` `)return;let t=e.target.closest(`[data-print]`);t&&(e.preventDefault(),t.click())};b.addEventListener(`keydown`,z);let B=new ResizeObserver(()=>{X(),P()});if(B.observe(b),!E)return I(),()=>{clearTimeout(F),B.disconnect(),v.remove()};let V=(e,t)=>{let n=E.createShader(e);return E.shaderSource(n,t),E.compileShader(n),E.getShaderParameter(n,E.COMPILE_STATUS)||console.warn(`[paste-up]`,E.getShaderInfoLog(n)),n},H=E.createProgram();E.attachShader(H,V(E.VERTEX_SHADER,p)),E.attachShader(H,V(E.FRAGMENT_SHADER,m)),E.linkProgram(H),E.useProgram(H);let U={};for(let e of[`uRect`,`uRes`,`uVel`,`uBend`,`uImg`,`uImgRes`,`uAlpha`])U[e]=E.getUniformLocation(H,e);let W=[],G=[];for(let e=0;e<=f;e++)for(let t=0;t<=f;t++)W.push(t/f,e/f);for(let e=0;e<f;e++)for(let t=0;t<f;t++){let n=e*17+t;G.push(n,n+1,n+f+1,n+1,n+f+2,n+f+1)}let te=E.createBuffer();E.bindBuffer(E.ARRAY_BUFFER,te),E.bufferData(E.ARRAY_BUFFER,new Float32Array(W),E.STATIC_DRAW);let ne=E.createBuffer();E.bindBuffer(E.ELEMENT_ARRAY_BUFFER,ne),E.bufferData(E.ELEMENT_ARRAY_BUFFER,new Uint16Array(G),E.STATIC_DRAW);let K=E.getAttribLocation(H,`aUv`);E.enableVertexAttribArray(K),E.vertexAttribPointer(K,2,E.FLOAT,!1,0,0),E.enable(E.BLEND),E.blendFunc(E.ONE,E.ONE_MINUS_SRC_ALPHA);let q=i.map((e,i)=>{let a=E.createTexture();E.bindTexture(E.TEXTURE_2D,a),E.texImage2D(E.TEXTURE_2D,0,E.RGBA,E.RGBA,E.UNSIGNED_BYTE,t(540,720,{seed:31+i*7})),E.texParameteri(E.TEXTURE_2D,E.TEXTURE_MIN_FILTER,E.LINEAR),E.texParameteri(E.TEXTURE_2D,E.TEXTURE_MAG_FILTER,E.LINEAR),E.texParameteri(E.TEXTURE_2D,E.TEXTURE_WRAP_S,E.CLAMP_TO_EDGE),E.texParameteri(E.TEXTURE_2D,E.TEXTURE_WRAP_T,E.CLAMP_TO_EDGE);let o={tex:a,w:540,h:720,ready:!0,hi:!1};if(n.on)return o;let s=new Image;return s.crossOrigin=`anonymous`,s.src=r(e,720),s.decode().then(()=>{o.w=s.naturalWidth,o.h=s.naturalHeight,E.bindTexture(E.TEXTURE_2D,a),E.texImage2D(E.TEXTURE_2D,0,E.RGBA,E.RGBA,E.UNSIGNED_BYTE,s),o.ready=!0,Q()}).catch(()=>{}),o});j=e=>{let t=q[e];if(!t||t.hi||n.on)return;t.hi=!0;let a=new Image;a.crossOrigin=`anonymous`,a.src=r(i[e],1440),a.decode().then(()=>{t.w=a.naturalWidth,t.h=a.naturalHeight,E.bindTexture(E.TEXTURE_2D,t.tex),E.texImage2D(E.TEXTURE_2D,0,E.RGBA,E.RGBA,E.UNSIGNED_BYTE,a),Q()}).catch(()=>{t.hi=!1})};let J=1,Y=1,X=()=>{let e=Math.min(devicePixelRatio||1,l),t=b.getBoundingClientRect();J=t.width,Y=t.height,x.width=Math.max(1,Math.round(t.width*e)),x.height=Math.max(1,Math.round(t.height*e)),E.viewport(0,0,x.width,x.height)};X();let Z=!0;function Q(){Z=!0}let re=()=>{E.clearColor(0,0,0,0),E.clear(E.COLOR_BUFFER_BIT),E.uniform2f(U.uRes,J,Y),E.uniform1i(U.uImg,0),E.activeTexture(E.TEXTURE0);let e=N.map((e,t)=>({i:t,s:Math.abs(e.vel.x)+Math.abs(e.vel.y)})).sort((e,t)=>e.s-t.s);for(let{i:t}of e){let e=N[t];if(!e.placed||e.alpha<=.001||e.cur.w<.5)continue;let n=q[t];E.bindTexture(E.TEXTURE_2D,n.tex),E.uniform4f(U.uRect,e.cur.x,e.cur.y,e.cur.w,e.cur.h),E.uniform2f(U.uImgRes,n.w,n.h),E.uniform2f(U.uVel,Math.max(-48,Math.min(d,e.vel.x))*u,Math.max(-48,Math.min(d,e.vel.y))*u),E.uniform1f(U.uBend,h?0:g.bend),E.uniform1f(U.uAlpha,e.alpha),E.drawElements(E.TRIANGLES,G.length,E.UNSIGNED_SHORT,0)}},$=()=>{if(!Z)return;let e=!1,t=h?1:g.damp;for(let n=0;n<a;n++){let r=N[n];if(!r.placed)continue;let i=r.cur.x,a=r.cur.y;[`x`,`y`,`w`,`h`].forEach(n=>{r.cur[n]+=(r.tar[n]-r.cur[n])*t,Math.abs(r.tar[n]-r.cur[n])<.05?r.cur[n]=r.tar[n]:e=!0}),r.vel.x=r.vel.x*.8+(r.cur.x-i)*.2,r.vel.y=r.vel.y*.8+(r.cur.y-a)*.2,Math.abs(r.vel.x)+Math.abs(r.vel.y)>.05?e=!0:r.vel.x=r.vel.y=0;let o=+!!q[n].ready;r.alpha+=(o-r.alpha)*.12,Math.abs(o-r.alpha)<.01?r.alpha=o:e=!0}re(),e||(Z=!1)};return e.ticker.add($),P(),I(),{destroy(){clearTimeout(F),e.ticker.remove($),B.disconnect(),b.removeEventListener(`click`,R),b.removeEventListener(`keydown`,z),E.getExtension(`WEBGL_lose_context`)?.loseContext(),v.remove()},set(e,t){e===`memory`?g.memory=+(t===`on`||t===!0):e in g&&(g[e]=Number(t),(e===`damp`||e===`bend`)&&Q())}}}};export{c as config,v as default};