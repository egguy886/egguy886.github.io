import{f as e,i as t}from"./mesh.DnpBQ695.js";import{r as n}from"./Base.astro_astro_type_script_index_0_lang.BmT7DZU3.js";import{J as r,Rt as i,St as a,n as o,ot as s,ut as c,xt as l}from"./three.module.DBbmgHoE.js";var u=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path d="M18.25 15.25V5.75M18.25 5.75H8.75M18.25 5.75L6 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
`,d=()=>matchMedia(`(prefers-reduced-motion: reduce)`).matches,f=45e3,p=3,m=96,h=e=>{let t=Math.max(0,Math.round(e/1e3));return`${Math.floor(t/60)}:${String(t%60).padStart(2,`0`)}`},g=e=>{if(!e)return``;let t=Math.max(1,Math.round((Date.now()-new Date(e).getTime())/6e4));return t<60?`${t}M`:t<1440?`${Math.round(t/60)}H`:`${Math.round(t/1440)}D`},_=e=>{let t=e.dataset.href;t&&window.open(t,`_blank`,`noopener,noreferrer`)},v=`
void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }
`,y=`
precision highp float;
uniform float uTime;   // seconds
uniform vec2  uRes;    // CSS px
uniform float uDpr;
uniform float uOffset; // dial travel, CSS px
uniform float uVel;    // dial velocity, CSS px/s
uniform float uLive;   // 0..1, eased
uniform float uBurst;  // channel-change static, 1 → 0
uniform float uDialY;  // dial center, CSS px from top
uniform float uDialH;
uniform float uWaveY;  // faces center, CSS px from top
uniform float uWaveAmp;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 px = gl_FragCoord.xy / uDpr;
  float y = uRes.y - px.y; // top-based, matches DOM measures
  float a = 0.0;

  // ── the signal. LIVE: a layered wave breathing through the faces area.
  // OFF-AIR: a DEAD CARRIER — the line goes flat and holds, with sparse
  // crackle ticks riding it. (The first cut kept a 12% wave off-air, which
  // wandered like a lost worm — a dead channel doesn't wave, it flatlines.)
  // Masked off the left side so it never fights the deck's text. ──
  float w = sin(px.x * 0.021 + uTime * 1.7) * 0.5
          + sin(px.x * 0.047 - uTime * 2.4) * 0.3
          + sin(px.x * 0.009 + uTime * 0.6) * 0.2;
  float amp = uWaveAmp * uLive; // off-air: perfectly flat
  float hmask = smoothstep(0.3, 0.62, px.x / uRes.x) * smoothstep(1.0, 0.94, px.x / uRes.x);
  float d1 = abs(y - (uWaveY + w * amp));
  a += smoothstep(5.0, 0.0, d1) * (0.02 + 0.04 * uLive) * hmask;
  float d2 = abs(y - (uWaveY - w * amp * 0.55));
  a += smoothstep(3.8, 0.0, d2) * (0.012 + 0.022 * uLive) * hmask;
  // the carrier holds slightly firmer when dead — a line, on purpose
  a += smoothstep(1.6, 0.2, d1) * 0.06 * (1.0 - uLive) * hmask;
  // crackle: brief impulse ticks on the dead carrier, 3px columns re-rolled
  // at 30Hz — dead-air static heard as ticks, not fog
  float seg = floor(px.x / 3.0);
  float tick30 = floor(uTime * 30.0);
  float cr = hash(vec2(seg * 1.618, tick30 * 3.7));
  float spike = step(0.992, cr) * (1.0 - uLive);
  float ch = 2.0 + hash(vec2(seg * 7.3, tick30)) * 6.0;
  a += spike * smoothstep(ch, 0.0, abs(y - uWaveY)) * 0.26 * hmask;

  // ── the dial: minor/major ticks scrolling under a fixed needle, with a
  // lens near the center (looking through the radio's glass) ──
  float inDial = 1.0 - step(uDialH * 0.5 + 8.0, abs(y - uDialY));
  if (inDial > 0.5) {
    float cx = uRes.x * 0.5;
    // the lens is a whisper: a slight rise toward the needle, no hotspot
    float lens = exp(-pow((px.x - cx) / 150.0, 2.0));
    float xo = px.x - uOffset - (px.x - cx) * lens * 0.05;
    float shimmer = 1.0 + min(abs(uVel) * 0.0012, 0.6);
    float ef = smoothstep(0.0, 0.13, px.x / uRes.x) * smoothstep(1.0, 0.87, px.x / uRes.x);
    float dm = abs(mod(xo, 8.0) - 4.0);
    a += smoothstep(1.1, 0.35, dm)
       * (1.0 - step(5.0 + lens * 2.0, abs(y - uDialY)))
       * (0.13 + lens * 0.07) * ef * shimmer;
    float dM = abs(mod(xo, 48.0) - 24.0);
    a += smoothstep(1.3, 0.45, dM)
       * (1.0 - step(8.0 + lens * 3.0, abs(y - uDialY)))
       * (0.26 + lens * 0.1) * ef * shimmer;
    float dn = abs(px.x - cx);
    a += smoothstep(1.7, 0.5, dn) * (1.0 - step(uDialH * 0.5, abs(y - uDialY)));
  }

  // ── snow: the channel-change burst ONLY. The old ambient off-air fizz
  // covered the whole card at 4.5% — and its hash seed added the SAME scalar
  // to both cell axes, so the field crawled diagonally instead of re-rolling:
  // that was the "drifting". Decorrelated seeds = fresh frames. ──
  float n = hash(floor(px * 0.75) + vec2(floor(uTime * 24.0) * 13.7, floor(uTime * 24.0) * 5.3));
  a += n * uBurst * 0.42;
  // a glitch band rolls through while the burst decays
  float band = smoothstep(26.0, 0.0, abs(y - mod(uTime * 640.0, uRes.y)));
  a += band * n * uBurst * 0.55;

  gl_FragColor = vec4(vec3(0.97), min(a, 1.0));
}
`,b=new class{init(){let b=document.querySelector(`[data-radio]`);if(!b)return;let x=e=>b.querySelector(e),S={state:x(`[data-radio-state]`),status:x(`[data-radio-status]`),chmeta:x(`[data-radio-chmeta]`),img:x(`[data-radio-img]`),track:x(`[data-radio-track]`),artist:x(`[data-radio-artist]`),elapsed:x(`[data-radio-elapsed]`),bar:x(`[data-radio-bar]`),remain:x(`[data-radio-remain]`),dial:x(`[data-radio-dial]`),ticks:x(`[data-radio-ticks]`),majors:x(`[data-radio-majors]`),static:x(`[data-radio-static]`),faces:[...b.querySelectorAll(`[data-radio-face]`)],chBtns:[...b.querySelectorAll(`[data-radio-ch]`)],opens:[...b.querySelectorAll(`[data-radio-open]`)]},C={live:!1,track:null,rotation:[],playlists:[]},w={live:!1,track:null,rotation:[],playlists:[]},T=null,E=0,D=0,O=0,k=(e,t,n)=>{let r=document.createElement(`div`);return r.className=e,t&&(r.dataset.href=t,r.addEventListener(`click`,()=>_(r))),r.append(...n),r},A=(e,t)=>{let n=document.createElement(`span`);return n.className=e,n.textContent=t,n},j=(e,t)=>{let n=document.createElement(`span`);return n.className=e,n.innerHTML=t,n},M=()=>{let e=S.faces[1];if(!e)return;let t=C.rotation[0]?.count??1;e.replaceChildren(...C.rotation.slice(0,5).map((e,n)=>{let r=document.createElement(`span`);r.style.width=`${Math.max(8,e.count/t*100)}%`,r.style.opacity=String(.25+.65*(e.count/t));let i=document.createElement(`span`);return i.className=`card__row-bar`,i.append(r),k(`card__row text-mono-sm`,e.url,[A(`card__row-idx`,String(n+1).padStart(2,`0`)),A(`card__row-name text-caption`,e.name),i,A(`card__row-n`,g(e.last))])}))},N=()=>{let e=S.faces[2];if(!e)return;let t=C.playlists.slice(0,3);e.replaceChildren(...t.map((e,n)=>k(`card__row text-mono-sm${n<t.length-1?` card__row--lined`:``}`,e.url,[A(`card__row-name card__row-name--grow text-caption`,e.name),A(`card__row-n`,``),j(`card__row-idx card__row-cue`,u)]))),e.querySelectorAll(`.card__row`).forEach((e,n)=>{let r=e.querySelector(`.card__row-n`);r&&(r.textContent=t[n].tracks?`${t[n].tracks} TRACKS`:`PL`,r.style.width=`auto`)})},P=e=>{C=e,b.dataset.on=String(e.live),S.state&&(S.state.textContent=e.live?`Live`:`Off-air`),S.status&&(S.status.textContent=e.live?`ON AIR`:e.track?`SIGNAL::LOST`:`DEAD::AIR`),S.track&&(S.track.textContent=e.track?.title??`Dead air`,S.track.title=e.track?.title??``),S.artist&&(S.artist.textContent=e.track?`${e.live?``:`LAST:: `}${e.track.artist}`:`—`),S.img&&(e.track?.art?(S.img.src=e.track.art,S.img.hidden=!1):S.img.hidden=!0),S.opens.forEach(t=>{e.track?.url?t.dataset.href=e.track.url:delete t.dataset.href}),E=e.track?.progress??0,D=performance.now(),L(),M(),N()},F=(e,t)=>{let n=t.track,r=e.track,i=r&&n.url&&r.url===n.url?{...r,title:n.title,artist:n.artist,art:n.art??r.art,url:n.url}:{title:n.title,artist:n.artist,art:n.art,url:n.url,progress:null,duration:0};return{...e,live:!0,track:i}},I=e=>{w=e,T?.live&&T.track?P(F(e,T)):P(e)},L=()=>{let e=C.track;if(!e||e.progress==null){S.elapsed&&(S.elapsed.textContent=`—:—`),S.remain&&(S.remain.textContent=`STATIC`),S.bar&&(S.bar.style.width=`0%`);return}let t=C.live?Math.min(E+(performance.now()-D),e.duration):E;S.elapsed&&(S.elapsed.textContent=h(t)),S.remain&&(S.remain.textContent=`−${h(e.duration-t)}`),S.bar&&(S.bar.style.width=`${t/e.duration*100}%`)},R=setInterval(()=>{C.live&&!document.hidden&&L()},1e3);t(()=>clearInterval(R));let z=null,B=()=>{z&&(z.uni.uBurst.value=1)},V=t=>{if(t===O)return;let n=S.faces[O],r=S.faces[t];if(O=t,b.dataset.ch=String(t),S.chmeta&&(S.chmeta.textContent=` · CH 0${t+1}/03`),!n||!r)return;if(d()){n.classList.remove(`is-active`),r.classList.add(`is-active`);return}let i=e.timeline();i.to(n,{opacity:0,duration:.1,ease:`power2.out`}).add(()=>{n.classList.remove(`is-active`),r.classList.add(`is-active`),z&&B()}),z||i.fromTo(S.static,{opacity:.5},{opacity:0,duration:.3,ease:`power2.out`}),i.fromTo(r,{opacity:0,y:6},{opacity:1,y:0,duration:.22,ease:`power2.out`},z?`>0.08`:`<`)},H=0,U=0,W=`idle`,G=0,K=e=>(Math.round(-e/m)%p+p)%p,q=()=>{z||(S.ticks&&(S.ticks.style.backgroundPositionX=`${H}px`),S.majors&&(S.majors.style.backgroundPositionX=`${H}px`))},J=()=>{W=`spring`,G=Math.round(H/m)*m,V(K(G))},Y=e=>{if(W===`inertia`)H+=U*e,U*=Math.exp(-e*4.2),Math.abs(U)<260&&J(),q();else if(W===`spring`){let t=(G-H)*190-U*2*Math.sqrt(190);U+=t*e,H+=U*e,Math.abs(G-H)<.3&&Math.abs(U)<6&&(H=G,U=0,W=`idle`),q()}};if(!d()){let n=performance.now(),r=()=>{let e=performance.now();z||Y(Math.min((e-n)/1e3,.05)),n=e};e.ticker.add(r),t(()=>e.ticker.remove(r))}if(S.dial){let e=!1,n=0,r=0,i=t=>{if(t.button===0){e=!0,W=`drag`,U=0,n=t.clientX,r=performance.now();try{S.dial.setPointerCapture(t.pointerId)}catch{}S.dial.style.cursor=`grabbing`}},a=t=>{if(!e)return;if(t.pointerType===`mouse`&&!(t.buttons&1)){o();return}let i=performance.now(),a=t.clientX-n,s=Math.max((i-r)/1e3,1/240);H+=a,U=U*.4+a/s*.6,n=t.clientX,r=i,q()},o=()=>{e&&(e=!1,S.dial.style.cursor=`grab`,d()?(H=Math.round(H/m)*m,V(K(H)),q()):Math.abs(U)>320?W=`inertia`:J())};S.dial.addEventListener(`pointerdown`,i),S.dial.addEventListener(`pointermove`,a),S.dial.addEventListener(`pointerup`,o),S.dial.addEventListener(`pointercancel`,o),S.dial.addEventListener(`lostpointercapture`,o),t(()=>{S.dial.removeEventListener(`pointerdown`,i),S.dial.removeEventListener(`pointermove`,a),S.dial.removeEventListener(`pointerup`,o),S.dial.removeEventListener(`pointercancel`,o),S.dial.removeEventListener(`lostpointercapture`,o)})}S.chBtns.forEach(e=>{let n=Number(e.dataset.radioCh),r=()=>{let e=Math.round(-H/m),t=((n-e)%p+p)%p;t>p/2&&(t-=p),W=`spring`,G=-(e+t)*m,V(n)};e.addEventListener(`click`,r),t(()=>e.removeEventListener(`click`,r))});let X=()=>{if(!(z||d()))try{let e=new o({antialias:!1,alpha:!0}),n={uTime:{value:0},uRes:{value:new i(1,1)},uDpr:{value:1},uOffset:{value:0},uVel:{value:0},uLive:{value:0},uBurst:{value:0},uDialY:{value:-9999},uDialH:{value:26},uWaveY:{value:0},uWaveAmp:{value:12}},u=new l,d=new c(2,2),f=new a({vertexShader:v,fragmentShader:y,uniforms:n,transparent:!0,depthTest:!1});u.add(new r(d,f));let p=new s(-1,1,1,-1,0,1),m=e.domElement;m.className=`card__glcanvas`,m.setAttribute(`aria-hidden`,`true`),b.prepend(m),b.dataset.gl=``;let h=()=>{let t=b.getBoundingClientRect(),r=Math.min(devicePixelRatio,2);e.setPixelRatio(r),e.setSize(t.width,t.height,!1),n.uRes.value.set(t.width,t.height),n.uDpr.value=r;let i=S.dial?.getBoundingClientRect();i&&(n.uDialY.value=i.top-t.top+i.height/2,n.uDialH.value=i.height);let a=S.faces[0]?.parentElement?.getBoundingClientRect();a&&(n.uWaveY.value=a.top-t.top+a.height/2,n.uWaveAmp.value=Math.min(18,a.height*.16))};h();let g=new ResizeObserver(h);g.observe(b),z={renderer:e,uni:n};let _=!0,x=new IntersectionObserver(e=>{let t=_;_=e[0].isIntersecting,_&&!t&&!w&&(T=performance.now(),w=requestAnimationFrame(E))},{rootMargin:`10% 0px`});x.observe(b);let w=0,T=performance.now(),E=t=>{if(!_){w=0;return}w=requestAnimationFrame(E);let r=Math.min((t-T)/1e3,.05);T=t,Y(r),n.uTime.value+=r,n.uOffset.value=H,n.uVel.value=U,n.uLive.value+=(+!!C.live-n.uLive.value)*Math.min(r*3,1),n.uBurst.value=n.uBurst.value*Math.exp(-r*5.5),e.render(u,p)};w=requestAnimationFrame(E),t(()=>{cancelAnimationFrame(w),g.disconnect(),x.disconnect(),d.dispose(),f.dispose(),e.dispose(),e.forceContextLoss(),m.remove(),z=null})}catch{z=null}},Z=new IntersectionObserver(e=>{e[0].isIntersecting&&(Z.disconnect(),X())},{rootMargin:`25% 0px`});Z.observe(b),t(()=>Z.disconnect()),S.opens.forEach(e=>{let n=()=>_(e);e.addEventListener(`click`,n),t(()=>e.removeEventListener(`click`,n))});let ee=n.subscribe(e=>{T=e,e.live&&e.track?P(F(w,e)):P(w)});t(ee);let Q=new AbortController;t(()=>Q.abort());let $=()=>fetch(`/api/radio.json`,{signal:Q.signal}).then(e=>e.ok?e.json():Promise.reject(e.status)).then(I).catch(()=>{});$();let te=setInterval(()=>{document.hidden||$()},f);t(()=>clearInterval(te))}};export{b as AboutRadio};