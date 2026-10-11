import{f as e}from"./mesh.DnpBQ695.js";var t=(e,t,n)=>Math.max(t,Math.min(n,e)),n=(e,t,n,r)=>e+(t-e)*(1-Math.exp(-n*r)),r=5,i=64,a=50,o=188,s=264,c=397,l=30,ee=.8,u={morphIn:.65,morphOut:.6,restDelay:150},d=[{key:`morphIn`,label:`Bloom`,type:`range`,min:.2,max:1.2,step:.05,default:u.morphIn},{key:`morphOut`,label:`Collapse`,type:`range`,min:.2,max:1.2,step:.05,default:u.morphOut},{key:`restDelay`,label:`Rest`,type:`range`,min:50,max:500,step:10,default:u.restDelay},{key:`accent`,label:`Accent`,type:`swatch`,default:`coral`,options:[{id:`coral`,value:`#ff4d00`},{id:`blue`,value:`#3f6a99`},{id:`sage`,value:`#55703c`},{id:`mono`,value:`#ffffff`}]}],te=`#d5d5d5`,ne=`#000000`,f=[{src:`/lab/music/deep-abstract-ambient_snowcap-401656.mp3`,title:`D.A.A.S`,artist:`Umbrella`,cover:`/lab/covers/umbrella.jpg`},{src:`/lab/music/embrace-364091.mp3`,title:`Embrace`,artist:`Evgeny Bardyuzha`,cover:`/lab/covers/embrace.jpg`},{src:`/lab/music/running-night-393139.mp3`,title:`Running Night`,artist:`Alex Make Music`,cover:`/lab/covers/running-night.jpg`}],p=[{kind:`min`,text:`Scroll the page :: the bar on the right wakes up`},{kind:`min`,text:`Pause, or hover it, and it blooms into a clock`},{kind:`min`,text:`Normal scrolling still works :: it just has a pulse`},{kind:`music`,text:`A note appears. Tap it :: the player is live`},{kind:`music`,text:`Now playing. Hover to expand, drag the timeline to seek`},{kind:`min`,text:`Back to default :: clock only, no player`}],re=`<svg viewBox="0 0 20 20" fill="none" class="sb__clock-face"><rect data-hour x="9.5" y="4" width="1" height="5.5" rx="0.5" fill="currentColor"/><rect data-min x="9.5" y="2" width="1" height="8" rx="0.5" fill="currentColor"/><circle cx="10" cy="10" r="1.25" fill="currentColor"/></svg>`,ie=`<svg viewBox="0 0 20 20" fill="none"><path d="M19.5 14C19.5 15.933 17.933 17.5 16 17.5C14.067 17.5 12.5 15.933 12.5 14C12.5 12.067 14.067 10.5 16 10.5C16.98 10.5 17.865 10.903 18.5 11.552V5.59L7.5 7.423V16C7.5 17.933 5.933 19.5 4 19.5C2.067 19.5 0.5 17.933 0.5 16C0.5 14.067 2.067 12.5 4 12.5C4.98 12.5 5.865 12.903 6.5 13.552V2.576L19.5 0.41V14Z" fill="currentColor"/></svg>`,ae=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round"><line x1="2" y1="15" x2="2" y2="9"/><line x1="7" y1="19.5" x2="7" y2="4.5"/><line x1="12" y1="22" x2="12" y2="2"/><line x1="17" y1="19.5" x2="17" y2="4.5"/><line x1="22" y1="15" x2="22" y2="9"/></svg>`,oe=`<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="10 5 1 12 10 19"/><polygon points="22 5 13 12 22 19"/></svg>`,se=`<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="14 19 23 12 14 5"/><polygon points="2 19 11 12 2 5"/></svg>`,ce=`<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5.2 12 5.2 3 13 7.5 20.8 12 13 16.5 5.2 21"/></svg>`,le=`<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6.5" y="5.5" width="3" height="13" rx="0.4"/><rect x="14.5" y="5.5" width="3" height="13" rx="0.4"/></svg>`,m=`exp-scrollbar-style`,h=`
.sb{position:absolute;inset:0;overflow:hidden;font-family:var(--font-sans);
  --sb-paper:#f2f2f2;--sb-rest:#d5d5d5;--sb-ink:#000;--sb-accent:#ff4d00;--sb-muted:#727272;--sb-track:#282828;}
.sb__scroll{position:absolute;inset:0;overflow:hidden;touch-action:none;}
.sb__track{will-change:transform;}
.sb__section{height:var(--sb-vh,100%);display:grid;place-items:center;padding:2rem 4rem;box-sizing:border-box;}
.sb__caption{max-width:22ch;text-align:center;color:var(--ink-muted);
  font-size:clamp(1.1rem,2vw,1.6rem);line-height:1.25;letter-spacing:var(--track);text-wrap:balance;}

/* the bar rides the right edge; the thumb is the morphing element (anchored right) */
.sb__bar{position:absolute;top:0.75rem;right:0.75rem;bottom:0.75rem;width:${s}px;
  pointer-events:none;z-index:5;}
.sb__thumb{position:absolute;top:0;right:0;width:${r}px;height:${i}px;
  background:var(--sb-rest);color:var(--sb-paper);border-radius:${l}px;
  pointer-events:auto;cursor:pointer;will-change:transform;}
/* generous invisible hit area so the 5px bar is easy to hover / grab (the
   original wrapped the bar in a 20px buffer) — kept off the visible shape. */
.sb__thumb::before{content:"";position:absolute;inset:-16px;}
.sb__inner{position:absolute;inset:0;overflow:hidden;border-radius:inherit;}

/* ── min state: clock ── */
.sb__min{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;
  justify-content:space-between;padding:10px;box-sizing:border-box;opacity:0;
  transform:translateX(20%);filter:blur(30px);pointer-events:none;}
.sb__min-top{display:flex;flex-direction:column;align-items:center;gap:12px;}
.sb__clock{width:28px;height:28px;display:grid;place-items:center;border-radius:50%;
  background:var(--sb-paper);color:var(--sb-accent);}
.sb__clock-face{width:22px;height:22px;}
.sb__note{width:20px;height:20px;display:grid;place-items:center;color:var(--sb-accent);
  cursor:pointer;pointer-events:none;opacity:0;will-change:transform,filter,opacity;}
.sb__note svg{width:16px;height:16px;}
.sb__time{display:flex;flex-direction:column;align-items:center;gap:2px;
  font-family:var(--font-mono);font-size:10.8px;letter-spacing:-0.43px;line-height:1.1;color:var(--sb-paper);}
.sb__time .ampm{opacity:.75;}

/* ── music state: player ── */
.sb__music{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:space-between;
  padding:24px 20px;box-sizing:border-box;opacity:0;transform:translateX(100%);filter:blur(30px);
  pointer-events:none;gap:32px;}
.sb__cover{position:relative;width:160px;height:160px;align-self:center;border-radius:20px;overflow:hidden;flex:none;}
.sb__cover img{width:100%;height:100%;object-fit:cover;display:block;}
.sb__player{display:flex;flex-direction:column;gap:16px;}
.sb__head{display:flex;justify-content:space-between;align-items:flex-start;gap:.5rem;}
.sb__meta{display:flex;flex-direction:column;gap:0;min-width:0;}
.sb__title{font-size:16px;font-weight:500;letter-spacing:-0.64px;color:var(--sb-paper);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.sb__artist{font-size:16px;font-weight:500;letter-spacing:-0.64px;color:var(--sb-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.sb__wave{width:32px;flex:none;color:var(--sb-accent);}
.sb__wave svg{width:100%;height:auto;}
.sb__timeline{position:relative;height:3px;border-radius:100vw;overflow:hidden;cursor:pointer;background:var(--sb-track);}
.sb__progress{position:absolute;inset:0;background:var(--sb-rest);transform:scaleX(0);transform-origin:0 50%;}
.sb__controls{display:flex;align-items:center;justify-content:center;gap:16px;color:var(--sb-paper);}
.sb__ctrl{cursor:pointer;color:var(--sb-paper);transition:opacity .2s var(--ease-out-quad),scale .15s var(--ease-out-quad);}
.sb__ctrl:hover{opacity:.7;}.sb__ctrl:active{scale:.9;}
.sb__ctrl svg{width:100%;height:100%;display:block;}
.sb__ctrl--sm{width:28px;height:28px;}
.sb__toggle{position:relative;width:32px;height:32px;}
.sb__toggle > *{position:absolute;inset:0;width:32px;height:32px;}
/* the hidden button must NOT intercept clicks meant for the visible one — the JS
   flips pointer-events with the crossfade; this is just the resting state. */
.sb__pause{opacity:0;scale:.5;pointer-events:none;}
.sb__credits{display:flex;flex-direction:column;gap:2px;}
.sb__credit{text-align:center;font-size:12px;letter-spacing:-0.48px;line-height:1.3;color:var(--sb-paper);}
.sb__credit a{color:inherit;text-decoration:underline;text-underline-offset:2px;}

@media (prefers-reduced-motion: reduce){
  .sb__scroll{scroll-behavior:auto;}
}
`;function ue(){if(document.getElementById(m))return;let e=document.createElement(`style`);e.id=m,e.textContent=h,document.head.appendChild(e)}var g={mount(d){ue();let m=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,h={...u},g=new AbortController,{signal:_}=g,v=document.createElement(`div`);v.className=`sb`;let y=document.createElement(`div`);y.className=`sb__scroll`;let b=document.createElement(`div`);b.className=`sb__track`,p.forEach(e=>{let t=document.createElement(`section`);t.className=`sb__section`,t.dataset.kind=e.kind,t.innerHTML=`<p class="sb__caption">${e.text}</p>`,b.appendChild(t)}),y.appendChild(b);let x=document.createElement(`div`);x.className=`sb__bar`;let S=document.createElement(`div`);S.className=`sb__thumb`,S.innerHTML=`
      <div class="sb__inner">
        <div class="sb__min">
          <div class="sb__min-top">
            <div class="sb__clock">${re}</div>
            <div class="sb__note" role="button" aria-label="Open player">${ie}</div>
          </div>
          <div class="sb__time"><span data-time>00:00</span><span class="ampm" data-ampm>AM</span></div>
        </div>
        <div class="sb__music">
          <div class="sb__cover"><img alt="" decoding="async"/></div>
          <div class="sb__player">
            <div class="sb__head">
              <div class="sb__meta"><span class="sb__title" data-title></span><span class="sb__artist" data-artist></span></div>
              <div class="sb__wave">${ae}</div>
            </div>
            <div class="sb__timeline" data-timeline><div class="sb__progress" data-progress></div></div>
            <div class="sb__controls">
              <div class="sb__ctrl sb__ctrl--sm" data-prev role="button" aria-label="Previous">${oe}</div>
              <div class="sb__toggle">
                <div class="sb__ctrl sb__play" data-play role="button" aria-label="Play">${ce}</div>
                <div class="sb__ctrl sb__pause" data-pause role="button" aria-label="Pause">${le}</div>
              </div>
              <div class="sb__ctrl sb__ctrl--sm" data-next role="button" aria-label="Next">${se}</div>
            </div>
            <div class="sb__credits">
              <p class="sb__credit">Icons :: <a href="https://angularicons.com/" target="_blank" rel="noreferrer">Angular Icons</a> / <a href="https://www.osmo.supply/" target="_blank" rel="noreferrer">Osmo</a></p>
              <p class="sb__credit">Original /Motion :: Xavier Jac (<a href="https://x.com/KMkota0" target="_blank" rel="noreferrer">@KMkota0</a>)</p>
            </div>
          </div>
        </div>
      </div>`,x.appendChild(S),v.append(y,x),d.appendChild(v);let C=e=>S.querySelector(e),w=C(`.sb__min`),T=C(`.sb__music`),de=C(`[data-hour]`),fe=C(`[data-min]`),pe=C(`[data-time]`),me=C(`[data-ampm]`),E=()=>{let t=new Date,n=t.getHours(),r=t.getMinutes();e.to(de,{rotation:n%12*30+r*.5,transformOrigin:`center bottom`,duration:.5,ease:`power2.out`,overwrite:`auto`}),e.to(fe,{rotation:r*6,transformOrigin:`center bottom`,duration:.5,ease:`power2.out`,overwrite:`auto`}),pe.textContent=`${String(n%12||12).padStart(2,`0`)}:${String(r).padStart(2,`0`)}`,me.textContent=n>=12?`PM`:`AM`};E();let he=window.setInterval(E,1e3),D=new Audio;D.preload=`none`;let O=0,ge=C(`.sb__cover img`),_e=C(`[data-title]`),ve=C(`[data-artist]`),k=C(`[data-progress]`),A=C(`[data-timeline]`),j=C(`[data-play]`),M=C(`[data-pause]`),N=[...S.querySelectorAll(`.sb__wave line`)],P=null,ye=()=>{P?.kill(),P=e.timeline({repeat:-1}),N.forEach((e,t)=>{let n=+e.getAttribute(`y1`),r=+e.getAttribute(`y2`),i=Math.abs(r-n)*.4;P.to(e,{attr:{y1:n-i,y2:r+i},duration:.4+t*.05,ease:`sine.inOut`,yoyo:!0,repeat:-1},t*.08)})},be=()=>{P?.kill(),P=null,N.forEach(t=>{let n=t.dataset.y1,r=t.dataset.y2;e.to(t,{attr:{y1:n,y2:r},duration:.3,ease:`power2.out`})})};N.forEach(e=>{e.dataset.y1=e.getAttribute(`y1`),e.dataset.y2=e.getAttribute(`y2`)});let F=(t,n=!1)=>{O=(t+f.length)%f.length;let r=f[O];D.src=r.src,ge.src=r.cover,_e.textContent=r.title,ve.textContent=r.artist,e.set(k,{scaleX:0}),n&&D.play().catch(()=>{})};D.addEventListener(`play`,()=>{e.to(j,{opacity:0,scale:.5,pointerEvents:`none`,duration:.3,ease:`power2.out`}),e.to(M,{opacity:1,scale:1,pointerEvents:`auto`,duration:.3,ease:`power2.out`}),ye()},{signal:_}),D.addEventListener(`pause`,()=>{e.to(j,{opacity:1,scale:1,pointerEvents:`auto`,duration:.3,ease:`power2.out`}),e.to(M,{opacity:0,scale:.5,pointerEvents:`none`,duration:.3,ease:`power2.out`}),be()},{signal:_}),D.addEventListener(`timeupdate`,()=>{D.duration&&e.set(k,{scaleX:D.currentTime/D.duration})},{signal:_}),D.addEventListener(`ended`,()=>F(O+1,!0),{signal:_}),j.addEventListener(`click`,e=>{e.stopPropagation(),D.play().catch(()=>{})},{signal:_}),M.addEventListener(`click`,e=>{e.stopPropagation(),D.pause()},{signal:_}),C(`[data-prev]`).addEventListener(`click`,e=>{e.stopPropagation(),F(O-1,!D.paused)},{signal:_}),C(`[data-next]`).addEventListener(`click`,e=>{e.stopPropagation(),F(O+1,!D.paused)},{signal:_}),A.addEventListener(`click`,e=>{e.stopPropagation();let t=A.getBoundingClientRect();D.duration&&(D.currentTime=(e.clientX-t.left)/t.width*D.duration)},{signal:_}),F(0);let I=`default`,L={default:[r,i,l],min:[a,o,l],music:[s,c,l]},R={w:r,h:i,r:l},xe=()=>{S.style.width=`${R.w}px`,S.style.height=`${R.h}px`,S.style.borderRadius=`${R.r}px`},z=t=>{if(t===I)return;I=t;let n=t===`min`,r=t===`music`,[i,a,o]=L[t],s=m?0:t==="default"?h.morphOut:h.morphIn;e.to(R,{w:i,h:a,r:o,duration:s,ease:`power3.inOut`,overwrite:!0,onUpdate:xe}),e.to(S,{backgroundColor:t==="default"?te:ne,duration:m?0:ee,ease:t==="default"?`power3.inOut`:`power3.out`,overwrite:`auto`}),e.to(w,{opacity:+!!n,x:n?`0%`:`20%`,filter:`blur(${n?0:30}px)`,duration:m?0:.6,ease:`power3.inOut`,pointerEvents:n?`auto`:`none`,overwrite:`auto`}),e.to(T,{opacity:+!!r,x:r?`0%`:`100%`,filter:`blur(${r?0:30}px)`,duration:m?0:r?.65:.6,ease:`power3.inOut`,pointerEvents:r?`auto`:`none`,overwrite:`auto`})},B=0,V=0,H=0,U=0,W=0,G=!1,K=!1,q=`min`,J=null,Y=()=>{v.style.setProperty(`--sb-vh`,`${y.clientHeight}px`),U=Math.max(0,b.scrollHeight-y.clientHeight),B=t(B,0,U)},Se=new ResizeObserver(Y);Se.observe(y),Y(),v.addEventListener(`wheel`,e=>{e.preventDefault(),B=t(B+e.deltaY,0,U)},{passive:!1,signal:_});let X=0;v.addEventListener(`touchstart`,e=>{X=e.touches[0].clientY},{passive:!0,signal:_}),v.addEventListener(`touchmove`,e=>{e.preventDefault();let n=e.touches[0].clientY;B=t(B+(X-n)*1.5,0,U),X=n},{passive:!1,signal:_});let Ce=0,we=0;S.addEventListener(`pointerdown`,e=>{I!==`music`&&(e.target.closest(`.sb__note`)||(K=!0,Ce=e.clientY,we=B,S.setPointerCapture?.(e.pointerId)))},{signal:_}),window.addEventListener(`pointermove`,e=>{if(!K)return;let n=Math.max(1,x.clientHeight-L[I][1]);B=t(we+(e.clientY-Ce)/n*U,0,U)},{signal:_}),window.addEventListener(`pointerup`,()=>K=!1,{signal:_});let Te=()=>{let e=V+y.clientHeight/2;return p[t(Math.floor(e/y.clientHeight),0,p.length-1)].kind},Z=C(`.sb__note`),Ee=!1;e.set(Z,{y:`100%`,opacity:0,scale:.5,filter:`blur(20px)`,pointerEvents:`none`});let De=t=>{t!==Ee&&(Ee=t,e.to(Z,{y:t?`0%`:`100%`,opacity:+!!t,scale:t?1:.5,filter:t?`blur(0px)`:`blur(20px)`,duration:t?.6:.45,ease:`power3.inOut`,pointerEvents:t?`auto`:`none`}))},Q=null;S.addEventListener(`pointerenter`,()=>{Q&&=(clearTimeout(Q),null),G=!0,I==="default"&&z(`min`)},{signal:_}),S.addEventListener(`pointerleave`,()=>{G=!1,Q&&clearTimeout(Q),Q=setTimeout(()=>{Q=null,!G&&I===`min`&&!K&&z(`default`)},120)},{signal:_}),Z.addEventListener(`click`,e=>{e.stopPropagation(),q===`music`&&z(`music`)},{signal:_}),T.addEventListener(`pointerleave`,e=>{I===`music`&&(S.contains(e.relatedTarget)||z(`min`))},{signal:_});let $=(e,r)=>{let a=Math.min(r,64)/1e3||.016,o=V;V=m?B:n(V,B,9,a),Math.abs(B-V)<.05&&(V=B),H=V-o,b.style.transform=`translate3d(0, ${-V}px, 0)`,W=U>0?V/U:0,q=Te(),De(q===`music`);let s=Math.abs(H)>.15||Math.abs(B-V)>.6;I===`music`&&!K&&(s||q!==`music`)?z(`min`):!G&&!K&&(s||q===`music`?(J&&=(clearTimeout(J),null),I==="default"&&z(`min`)):I===`min`&&!J&&(J=setTimeout(()=>{J=null,!G&&!K&&I===`min`&&z(`default`)},h.restDelay)));let c=t(W*(x.clientHeight-i)+i/2-R.h/2,0,Math.max(0,x.clientHeight-R.h));S.style.transform=`translateY(${c}px)`};return e.ticker.add($),m||e.from(S,{opacity:0,duration:.6,ease:`power2.out`,delay:.1}),{destroy:()=>{g.abort(),e.ticker.remove($),Se.disconnect(),clearInterval(he),J&&clearTimeout(J),Q&&clearTimeout(Q),P?.kill(),D.pause(),D.src=``,e.killTweensOf([S,R,w,T,Z,j,M,k,...N]),v.remove()},set:(e,t)=>{e===`accent`?v.style.setProperty(`--sb-accent`,String(t)):e in h&&(h[e]=Number(t))}}}};export{d as config,g as default};