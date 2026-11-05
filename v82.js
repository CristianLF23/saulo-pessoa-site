'use strict';
(()=>{
const q=s=>document.querySelector(s),all=s=>[...document.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
let enabled=q('#motion').getAttribute('aria-pressed')!=='true',playing=!document.hidden,cycleVisible=false,plateVisible=false;
const permitted=()=>enabled&&playing&&!reduce.matches&&!navigator.connection?.saveData&&!document.body.classList.contains('is-intro');
const orbit={p:0};let pass=-1;
const loop=window.gsap?gsap.to(orbit,{p:1,duration:18,repeat:-1,ease:'none',paused:true,onUpdate:()=>{
 q('.cycle-flow').setAttribute('transform','rotate('+orbit.p*360+' 250 250)');
 const next=Math.round(orbit.p*7)%7;if(next!==pass){pass=next;all('.cycle-stop').forEach((node,i)=>node.classList.toggle('is-passing',i===pass));}
}}):null;
const turn=window.gsap?gsap.to('.plate-turn',{rotation:360,duration:65,repeat:-1,ease:'none',paused:true}):null;
function sync(){
 const can=permitted();if(can&&cycleVisible)loop?.resume();else loop?.pause();
 if(can&&plateVisible)turn?.resume();else turn?.pause();
 if(!can)all('.cycle-stop').forEach(n=>n.classList.remove('is-passing'));
}
new IntersectionObserver(([e])=>{cycleVisible=e.isIntersecting;sync();},{threshold:.05}).observe(q('.cycle-map'));
new IntersectionObserver(([e])=>{plateVisible=e.isIntersecting;sync();},{threshold:.04}).observe(q('.food-scene'));
addEventListener('saulo:motion',e=>{enabled=e.detail.enabled;sync();});
addEventListener('saulo:playback',e=>{playing=e.detail.playing;sync();});
document.addEventListener('visibilitychange',()=>{playing=!document.hidden;sync();});
reduce.addEventListener('change',sync);navigator.connection?.addEventListener('change',sync);sync();
// Native horizontal scrolling keeps touch, trackpad, keyboard and links usable.
const track=q('#report-track'),cards=all('.report-card'),prev=q('[data-report-prev]'),next=q('[data-report-next]');
q('.report-navigation').hidden=false;
let current=0,scrollFrame=0;
function cardLeft(card){return card.getBoundingClientRect().left-track.getBoundingClientRect().left+track.scrollLeft-3;}
function updateReports(){
 scrollFrame=0;const max=track.scrollWidth-track.clientWidth;
 current=cards.reduce((best,card,i)=>Math.abs(cardLeft(card)-track.scrollLeft)<Math.abs(cardLeft(cards[best])-track.scrollLeft)?i:best,0);
 q('.report-count').textContent=String(current+1).padStart(2,'0')+' / '+String(cards.length).padStart(2,'0');
 prev.disabled=track.scrollLeft<3;next.disabled=track.scrollLeft>max-3;
}
function moveReport(direction){const target=Math.max(0,Math.min(cards.length-1,current+direction));track.scrollTo({left:cardLeft(cards[target]),behavior:reduce.matches?'auto':'smooth'});}
prev.addEventListener('click',()=>moveReport(-1));next.addEventListener('click',()=>moveReport(1));
track.addEventListener('scroll',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(updateReports);},{passive:true});
track.addEventListener('keydown',e=>{if(e.target!==track)return;if(e.key==='ArrowRight'){e.preventDefault();moveReport(1);}if(e.key==='ArrowLeft'){e.preventDefault();moveReport(-1);}if(e.key==='Home'||e.key==='End'){e.preventDefault();track.scrollTo({left:e.key==='Home'?0:track.scrollWidth,behavior:reduce.matches?'auto':'smooth'});}});
let drag=null,suppressClick=false;
track.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button!==0)return;drag={x:e.clientX,left:track.scrollLeft,active:false,id:e.pointerId};});
track.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x;if(!drag.active&&Math.abs(dx)>8){drag.active=true;track.setPointerCapture(e.pointerId);track.classList.add('is-dragging');}if(drag.active){e.preventDefault();track.scrollLeft=drag.left-dx;}});
function endDrag(){if(!drag)return;if(drag.active){suppressClick=true;track.classList.remove('is-dragging');if(track.hasPointerCapture(drag.id))track.releasePointerCapture(drag.id);setTimeout(()=>suppressClick=false,0);}drag=null;}
track.addEventListener('pointerup',endDrag);track.addEventListener('pointercancel',endDrag);
track.addEventListener('click',e=>{if(suppressClick){e.preventDefault();e.stopImmediatePropagation();}},true);
new ResizeObserver(()=>{updateReports();window.sauloRefreshLayout?.();}).observe(track);
cards.forEach(card=>card.querySelector('img').loading='eager');
document.fonts?.ready.then(updateReports);updateReports();
})();
