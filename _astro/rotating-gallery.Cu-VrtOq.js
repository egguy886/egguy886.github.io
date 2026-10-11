import{f as e,m as t,p as n}from"./mesh.DnpBQ695.js";import{n as r}from"./assets.DBbF6dnf.js";var i=[[1,`DRIFT`],[4,`FOLD`],[7,`BLOOM`],[10,`STATIC`],[13,`EMBER`],[16,`TIDE`],[19,`GRAIN`],[22,`PRISM`],[25,`HUSK`],[28,`VAPOR`]].map(([e,t])=>({src:r(`cdn-cgi/image/width=640,quality=86,format=auto/dts/unwrapped/DTS_Unwrapped_by_FRANCO_DUPUY_${e}.jpg`),title:t})),a=i.length,o=Math.PI/180,s=(e,t,n)=>Math.max(t,Math.min(n,e)),c=(e,t)=>(e%t+t)%t,l=(e,t,n,r)=>e+(t-e)*(1-Math.exp(-n*r)),u=360/a,ee=180,te=1.3,ne=.2,re=.22,ie=5,ae=1.4,d=[.16,1,.3,1],oe=8,se=0,ce=(e,t)=>n.create(e,`M0,0 C${t[0]},${t[1]} ${t[2]},${t[3]} 1,1`),le={glide:`power3.inOut`,snap:`back.inOut(1.4)`,spring:`back.inOut(2.2)`},f={drift:4,weight:8,perspective:4e3,morph:`spring`,imgEase:d},p=[{key:`drift`,label:`Drift`,type:`range`,min:0,max:12,step:.5,default:f.drift},{key:`weight`,label:`Weight`,type:`range`,min:4,max:20,step:1,default:f.weight},{key:`perspective`,label:`Depth`,type:`range`,min:1500,max:6e3,step:100,default:f.perspective},{key:`morph`,label:`Morph`,type:`segment`,default:f.morph,options:[{id:`glide`,label:`Glide`},{id:`snap`,label:`Snap`},{id:`spring`,label:`Spring`}]},{key:`imgEase`,label:`Image`,type:`easing`,default:f.imgEase}],m=`exp-rg-style`,h=`
.rg{position:absolute;inset:0;overflow:hidden;font-family:var(--font-sans);
  --rg-card-w:12rem;--rg-ratio:1.08;touch-action:none;
  -webkit-user-select:none;user-select:none;outline:none;}
/* isolate: the cards carry z-index up to ~600; trap that whole range inside the
   stage's own stacking context so it can never paint over the HUD (which sits
   outside the stage) or any other lab-window chrome */
.rg__stage{position:absolute;inset:0;cursor:grab;isolation:isolate;}
.rg.is-dragging .rg__stage{cursor:grabbing;}
.rg[data-view="grid"] .rg__stage{cursor:default;}

/* carousel — the perspective context; the ring is centred and sized (in JS) to
   fit the stage, radius > card so an open hub reads at the middle. NOTE: no
   preserve-3d — perspective still scales the cards by translateZ, but paint
   order comes from a STATIC z-index set once at build (see JS). Nothing re-sorts
   as it rotates, so a card never pops in front of another (the original's trick,
   which works because the depth is subtle enough that fixed order never reads
   as wrong). */
.rg__carousel{position:absolute;left:50%;top:49%;transform:translate(-50%,-50%);}
.rg__item{position:absolute;left:0;top:0;will-change:transform;}
.rg__flip{display:block;width:var(--rg-card-w);height:calc(var(--rg-card-w)*var(--rg-ratio));
  border-radius:var(--r-xs);overflow:hidden;background:var(--card-solid);text-decoration:none;}
.rg__img{width:100%;height:100%;object-fit:cover;display:block;transform:scale(1);
  -webkit-user-drag:none;user-select:none;pointer-events:none;}

/* grid — flat destination for the flip nodes */
.rg__grid{position:absolute;inset:0;display:grid;gap:clamp(.5rem,1.4vw,1.1rem);
  padding:clamp(1rem,4vw,3.5rem);align-content:center;
  grid-template-columns:repeat(5,1fr);pointer-events:none;opacity:0;}
.rg[data-view="grid"] .rg__grid{pointer-events:auto;opacity:1;}
.rg__slot{position:relative;aspect-ratio:1 / var(--rg-ratio);}
.rg__grid .rg__flip{width:100%;height:100%;}

/* HUD — odometer + name + view toggle */
.rg__hud{position:absolute;inset-inline:0;bottom:0;z-index:5;pointer-events:none;
  display:flex;align-items:flex-end;justify-content:space-between;
  padding:clamp(1rem,2.5vw,2rem);gap:1rem;}
.rg__meta{display:flex;align-items:baseline;gap:.7rem;color:var(--ink);}
.rg__odo{display:inline-flex;font-family:var(--font-mono);font-variant-numeric:tabular-nums;
  font-size:clamp(1.6rem,3vw,2.6rem);line-height:1;letter-spacing:-.02em;}
.rg__odo-col{display:block;height:1em;overflow:hidden;}
.rg__odo-strip{display:block;will-change:transform;}
.rg__odo-num{display:block;height:1em;line-height:1;text-align:center;}
.rg__name{font-family:var(--font-mono);text-transform:uppercase;letter-spacing:.08em;
  font-size:var(--fs-mono-meta,.75rem);color:var(--ink-muted);overflow:hidden;height:1.1em;}
.rg__name-strip{display:block;will-change:transform;}
.rg__name-item{display:block;height:1.1em;line-height:1.1;white-space:nowrap;}

.rg__views{display:inline-flex;gap:.25rem;pointer-events:auto;padding:.2rem;
  border-radius:var(--r-sm);background:var(--fill);}
.rg__view-btn{display:grid;place-items:center;width:2rem;height:2rem;border:0;padding:0;
  border-radius:calc(var(--r-sm) - .15rem);background:transparent;color:var(--ink-muted);
  cursor:pointer;transition:background-color .25s var(--ease-out-quad),color .25s var(--ease-out-quad),scale .15s var(--ease-out-quad);}
.rg__view-btn svg{width:1rem;height:1rem;fill:currentColor;}
.rg__view-btn:hover{color:var(--ink);}
.rg__view-btn:active{scale:.96;}
.rg__view-btn[data-active="true"]{background:var(--surface);color:var(--ink);
  box-shadow:0 1px 2px rgba(0,0,0,.12);}
.rg__view-btn:focus-visible{outline:2px solid var(--ink);outline-offset:2px;}

@media (max-width:47.99rem){
  .rg__grid{grid-template-columns:repeat(2,1fr);}
}
`;function ue(){if(document.getElementById(m))return;let e=document.createElement(`style`);e.id=m,e.textContent=h,document.head.appendChild(e)}var de=`<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="5.333" width="5.333" height="5.333"/><rect x="5.333" y="10.667" width="5.333" height="5.333"/><rect x="10.667" y="5.333" width="5.333" height="5.333"/><rect y="5.333" width="5.333" height="5.333"/></svg>`,fe=`<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="0.25" y="0.75" width="5.333" height="5.333"/><rect x="10.583" y="0.75" width="5.333" height="5.333"/><rect x="0.25" y="10" width="5.333" height="5.333"/><rect x="10.583" y="10" width="5.333" height="5.333"/></svg>`,g={mount(n){ue();let r=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,d={...f},p=`rgImg-${se++}`,m=ce(p,d.imgEase),h=document.createElement(`div`);h.className=`rg`,h.tabIndex=0,h.dataset.view=`carousel`;let g=document.createElement(`div`);g.className=`rg__stage`;let _=document.createElement(`div`);_.className=`rg__carousel`;let v=document.createElement(`div`);v.className=`rg__grid`;let y=[],b=[],x=[],S=[];i.forEach((e,t)=>{let n=document.createElement(`div`);n.className=`rg__item`,n.style.zIndex=String(Math.round(500+Math.cos(t*u*o)*100));let r=document.createElement(`div`);r.className=`rg__flip`,r.dataset.i=String(t);let i=document.createElement(`img`);i.className=`rg__img`,i.src=e.src,i.alt=e.title,i.loading=`eager`,i.decoding=`async`,r.appendChild(i),n.appendChild(r),_.appendChild(n);let a=document.createElement(`div`);a.className=`rg__slot`,a.style.zIndex=n.style.zIndex,v.appendChild(a),y.push(r),b.push(i),x.push(n),S.push(a)});let C=document.createElement(`div`);C.className=`rg__hud`;let w=document.createElement(`div`);w.className=`rg__meta`;let T=document.createElement(`div`);T.className=`rg__odo`,T.setAttribute(`aria-hidden`,`true`);let pe=()=>`<span class="rg__odo-col"><span class="rg__odo-strip">${[0,1,2,3,4,5,6,7,8,9].map(e=>`<span class="rg__odo-num">${e}</span>`).join(``)}</span></span>`;T.innerHTML=pe()+pe();let E=[...T.querySelectorAll(`.rg__odo-strip`)],D=document.createElement(`div`);D.className=`rg__name`,D.innerHTML=`<span class="rg__name-strip">${i.map(e=>`<span class="rg__name-item">${e.title}</span>`).join(``)}</span>`;let me=D.querySelector(`.rg__name-strip`);w.append(T,D);let O=document.createElement(`div`);O.className=`rg__views`,O.setAttribute(`role`,`group`),O.setAttribute(`aria-label`,`View`);let k=document.createElement(`button`);k.type=`button`,k.className=`rg__view-btn`,k.dataset.view=`carousel`,k.dataset.active=`true`,k.setAttribute(`aria-label`,`Carousel view`),k.innerHTML=de;let A=document.createElement(`button`);A.type=`button`,A.className=`rg__view-btn`,A.dataset.view=`grid`,A.dataset.active=`false`,A.setAttribute(`aria-label`,`Grid view`),A.innerHTML=fe,O.append(k,A),C.append(w,O),g.append(_,v),h.append(g,C),n.appendChild(h);let j=300,M=250,he=300,ge=()=>{let e=g.clientWidth,t=g.clientHeight,n=Math.min(e,t);j=n/2,M=s(Math.min(t*.26,e*.2),140,210),he=M*1.2;let r=M*.82;h.style.setProperty(`--rg-card-w`,`${r}px`),_.style.width=_.style.height=`${n}px`,_.style.perspective=`${d.perspective}px`},N=0,P=0,F=d.drift,I=1,L=!1,R=`carousel`,z=!1,B=-1,V=-1,H=[0,0],U=!0,W=()=>{for(let e=0;e<a;e++){let t=(e*u+N+ee)*o,n=j+M*Math.sin(t),r=j-M*Math.cos(t),i=-he*Math.cos(t);x[e].style.transform=`translate3d(${n}px, ${r}px, ${i}px) translate(-50%, -50%)`}},_e=()=>V>=0?V:B,G=()=>{let t=_e();for(let n=0;n<a;n++)e.to(b[n],{scale:n===t?1.06:1,duration:+!r,ease:m,overwrite:!0})},K=e=>{let t=e+1,n=Math.floor(t/10),r=t%10;H[0]=-n,H[1]=-r,me.style.transform=`translateY(${-e*1.1}em)`},q=e=>{if(e===R)return;R=e,h.dataset.view=e,k.dataset.active=String(e===`carousel`),A.dataset.active=String(e===`grid`);let n=_e();if(e===`carousel`){let e=-n*u;N+=((e-N)%360+540)%360-180,P=N,F=d.drift*I,B!==n&&(B=n,K(n),G()),W()}if(r){y.forEach((t,n)=>(e===`grid`?S[n]:x[n]).appendChild(t)),z=!1;return}t.killFlipsOf(y),z=!0;let i=t.getState(y,{props:`filter`});y.forEach((t,n)=>(e===`grid`?S[n]:x[n]).appendChild(t));let o=e===`grid`?.015:.02;t.from(i,{duration:ae,ease:le[d.morph],absolute:!0,nested:!0,scale:!0,prune:!0,stagger:t=>(e===`grid`?Math.max(Math.abs(t%5-n%5),Math.abs(Math.floor(t/5)-Math.floor(n/5))):Math.min(c(t-n,a),c(n-t,a)))*o,onComplete:()=>z=!1})};k.addEventListener(`click`,()=>q(`carousel`)),A.addEventListener(`click`,()=>q(`grid`)),window.matchMedia(`(hover: hover) and (pointer: fine)`).matches&&y.forEach((e,t)=>{e.addEventListener(`pointerenter`,()=>{V!==t&&(V=t,G(),K(t))}),e.addEventListener(`pointerleave`,()=>{V===t&&(V=-1,G(),K(B))})});let ve=(e,t)=>{let n=Math.min(t,64)/1e3||.016;if(R===`carousel`&&!z){L?(N=l(N,P,d.weight,n),U=!0):r||(F=l(F,d.drift*I,te,n),N+=F*n,U=!0);let e=c(Math.round(-N/u),a);e!==B&&(B=e,V<0&&(G(),K(e)))}for(let e=0;e<2;e++){let t=Number(E[e].dataset.y??`0`),n=r?H[e]:l(t,H[e],oe,1/60);Math.abs(n-t)>2e-4&&(E[e].dataset.y=String(n),E[e].style.transform=`translateY(${n}em)`,U=!0)}R===`carousel`&&U&&(U=!1,W())},ye=new AbortController,{signal:J}=ye,be=0,xe=0,Se=0,Y=null,X=0,Z=0,Q=0;g.addEventListener(`pointerdown`,e=>{R!==`carousel`||z||e.target.closest(`.rg__views`)||(L=!0,Y=null,be=e.clientX,xe=e.clientY,Se=N,P=N,X=0,Q=0,Z=performance.now(),h.classList.add(`is-dragging`),g.setPointerCapture?.(e.pointerId))},{signal:J}),window.addEventListener(`pointermove`,e=>{if(!L)return;let t=e.clientX-be,n=e.clientY-xe;if(!Y&&Math.hypot(t,n)>ie&&(Y=Math.abs(t)>Math.abs(n)?`x`:`y`),!Y)return;let r=Y===`x`?t:n;P=Se+r*ne;let i=performance.now(),a=Math.max(1,i-Z);Q=(r-X)*ne/(a/1e3),X=r,Z=i},{signal:J});let Ce=()=>{L&&(L=!1,h.classList.remove(`is-dragging`),Math.abs(Q)>1&&(F=s(Q,-900,900),I=Math.sign(F)||I))};window.addEventListener(`pointerup`,Ce,{signal:J}),window.addEventListener(`pointercancel`,Ce,{signal:J}),g.addEventListener(`wheel`,e=>{R!==`carousel`||z||(e.preventDefault(),L=!0,P=(L?P:N)+e.deltaY*re,I=Math.sign(e.deltaY)||I,clearTimeout($),$=setTimeout(()=>{L=!1,F=s(e.deltaY*re*8,-900,900)},90))},{passive:!1,signal:J});let $;h.addEventListener(`keydown`,e=>{e.key===`ArrowLeft`?(e.preventDefault(),P=N-u,N=l(N,P,1,1),L=!0,setTimeout(()=>L=!1,60)):e.key===`ArrowRight`?(e.preventDefault(),P=N+u,L=!0,setTimeout(()=>L=!1,60)):(e.key===`g`||e.key===`G`)&&q(R===`grid`?`carousel`:`grid`)},{signal:J}),ge(),B=c(Math.round(-N/u),a),K(B),G(),W();let we=new ResizeObserver(()=>{ge(),U=!0});if(we.observe(g),e.ticker.add(ve),!r){e.set(y,{clipPath:`inset(100%)`,willChange:`clip-path`}),e.set([w,O],{opacity:0,y:26});let t=e.timeline({delay:.1});t.to(y,{clipPath:`inset(0%)`,duration:1.5,stagger:.07,ease:`expo.out`,clearProps:`clipPath,willChange`}),t.to(w,{opacity:1,y:0,duration:1.1,ease:`expo.out`},`<0.1`),t.to(O,{opacity:1,y:0,duration:1.2,ease:`expo.out`},`<0.35`)}return{destroy:()=>{ye.abort(),we.disconnect(),e.ticker.remove(ve),clearTimeout($),e.killTweensOf([...b,...x,...y,w,O,h]),h.remove()},set:(e,t)=>{e===`morph`?d.morph=String(t):e===`imgEase`?Array.isArray(t)&&t.length===4&&(d.imgEase=t,m=ce(p,d.imgEase)):e===`perspective`?(d.perspective=Number(t),_.style.perspective=`${d.perspective}px`):e in d&&(d[e]=Number(t))}}}};export{p as config,g as default};