'use strict';
(()=>{
const one=s=>document.querySelector(s),all=s=>[...document.querySelectorAll(s)];
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let motionEnabled=one('#motion').getAttribute('aria-pressed')!=='true';
const eligible=()=>motionEnabled&&!reduced.matches&&!navigator.connection?.saveData;
let cycle=0,cycleTween=null,motionContext=null,question=0,detailTween=null;
const stops=all('[data-cycle]'),panels=all('.cycle-panel');
const cyclePosition={p:0},cycleRoute=one('.cycle-route'),cycleLength=cycleRoute.getTotalLength();
function paintCycle(){
 const angle=-Math.PI/2+cyclePosition.p*Math.PI*2;
 cycleRoute.style.strokeDasharray=String(cycleLength);cycleRoute.style.strokeDashoffset=String(cycleLength*(1-cyclePosition.p));
 one('.cycle-marker').setAttribute('cx',250+190*Math.cos(angle));one('.cycle-marker').setAttribute('cy',250+190*Math.sin(angle));
}
function selectCycle(index,focus=false,expand=false){
 const previous=cycle;cycle=index;cycleTween?.kill();
 detailTween?.kill();detailTween=null;panels.forEach(p=>{const details=p.querySelector('.cycle-details'),body=p.querySelector('.cycle-detail-body');if(details)delete details.dataset.animating;if(body){body.style.removeProperty('height');body.style.removeProperty('overflow');}});
 all('.cycle-stop svg path,.cycle-stop svg rect,.cycle-stop svg circle').forEach(shape=>{shape.style.removeProperty('stroke-dasharray');shape.style.removeProperty('stroke-dashoffset');});
 panels.forEach((p,i)=>p.hidden=i!==index);
 stops.forEach((b,i)=>{b.setAttribute('aria-pressed',String(i===index));b.classList.toggle('is-complete',i<index);});
 const center=one('.cycle-active-icon');center.innerHTML=stops[index].querySelector('svg').outerHTML;
 one('.cycle-center-step').textContent='Etapa '+String(index+1).padStart(2,'0')+' de 07';
 one('[data-cycle-prev]').disabled=index===0;
 one('[data-cycle-next]').firstChild.textContent=index===6?'Rever o caminho':'Próximo passo';
 one('.cycle-count').textContent=String(index+1).padStart(2,'0')+' / 07';
 if(eligible()&&window.gsap){
  cycleTween=gsap.timeline({defaults:{ease:'power2.out'}})
   .fromTo(panels[index],{y:9},{y:0,duration:.35},0)
   .fromTo(center,{scale:.8,y:5},{scale:1,y:0,duration:.5},0)
   .to(cyclePosition,{p:index/7,duration:previous===index?0:Math.min(.95,.4+Math.abs(index-previous)*.09),ease:'power2.inOut',onUpdate:paintCycle},0);
  const strokes=[...stops[index].querySelectorAll('svg path,svg rect,svg circle')];
  strokes.forEach(shape=>{const length=shape.getTotalLength();cycleTween.fromTo(shape,{strokeDasharray:length,strokeDashoffset:length},{strokeDashoffset:0,duration:.55,ease:'power2.out'},.06);});
 }else{cyclePosition.p=index/7;paintCycle();}
 if(expand){
  const details=panels[index].querySelector('.cycle-details'),body=details.querySelector('.cycle-detail-body');
  details.dataset.animating='true';details.open=true;
  if(eligible()&&window.gsap){const height=body.getBoundingClientRect().height;detailTween=gsap.fromTo(body,{height:0,overflow:'hidden'},{height,duration:.38,ease:'power3.out',onComplete:()=>{body.style.removeProperty('height');body.style.removeProperty('overflow');delete details.dataset.animating;window.sauloRefreshLayout?.();}});}
  else{delete details.dataset.animating;}
 }
 if(focus)stops[index].focus({preventScroll:true});
 window.dispatchEvent(new CustomEvent('saulo:cycle-selection'));window.sauloRefreshLayout?.();
}
stops.forEach((b,i)=>{
 b.addEventListener('click',()=>selectCycle(i));
 b.addEventListener('keydown',e=>{let next;if(['ArrowRight','ArrowDown'].includes(e.key))next=(i+1)%7;if(['ArrowLeft','ArrowUp'].includes(e.key))next=(i+6)%7;if(e.key==='Home')next=0;if(e.key==='End')next=6;if(next!==undefined){e.preventDefault();selectCycle(next,true);}});
});
one('[data-cycle-prev]').addEventListener('click',()=>selectCycle(Math.max(0,cycle-1)));
one('[data-cycle-next]').addEventListener('click',()=>selectCycle((cycle+1)%7,false,true));
one('.cycle-controls').hidden=false;selectCycle(0);
function fitCyclePanels(){
 const holder=one('.cycle-panels');let height=0;
 panels.forEach(panel=>{const hidden=panel.hidden,style=panel.getAttribute('style');panel.hidden=false;Object.assign(panel.style,{position:'absolute',width:holder.clientWidth+'px',visibility:'hidden'});height=Math.max(height,panel.getBoundingClientRect().height);panel.hidden=hidden;if(style===null)panel.removeAttribute('style');else panel.setAttribute('style',style);});
 holder.style.minHeight=Math.ceil(height)+'px';
}
fitCyclePanels();let panelWidth=0;
new ResizeObserver(([entry])=>{if(Math.abs(entry.contentRect.width-panelWidth)<1)return;panelWidth=entry.contentRect.width;fitCyclePanels();window.sauloRefreshLayout?.();}).observe(one('.cycle-panels'));
let touchStart=null;
one('.cycle-map').addEventListener('pointerdown',e=>{if(e.pointerType==='touch')touchStart={x:e.clientX,y:e.clientY};});
one('.cycle-map').addEventListener('pointerup',e=>{if(!touchStart)return;const dx=e.clientX-touchStart.x,dy=e.clientY-touchStart.y;touchStart=null;if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.6)selectCycle((cycle+(dx<0?1:6))%7);});
one('.cycle-map').addEventListener('pointercancel',()=>touchStart=null);
const demoQuestions=[
 {q:'Como estava sua fome à noite nesta semana?',label:'Fome à noite, de zero a dez',low:'Sem fome',high:'Muita fome',a:'O número abre uma conversa.',b:'O contexto dá sentido a ele.'},
 {q:'Como foi a qualidade do seu sono nesta semana?',label:'Qualidade do sono, de zero a dez',low:'Muito ruim',high:'Muito boa',a:'O cuidado olha para além do prato.',b:'Seu descanso também entra na conversa.'},
 {q:'Quanto o plano coube na sua rotina nesta semana?',label:'Como o plano coube na rotina, de zero a dez',low:'Não coube',high:'Coube muito bem',a:'A rotina real é o ponto de partida.',b:'A estratégia pode ser ajustada.'}
];
const saved=[5,5,5],input=one('#hunger');
input.addEventListener('input',()=>saved[question]=Number(input.value));
all('[data-demo]').forEach((b,i)=>b.addEventListener('click',()=>{
 question=i;const data=demoQuestions[i];
 all('[data-demo]').forEach((v,j)=>v.setAttribute('aria-pressed',String(i===j)));
 one('#demo-question').textContent=data.q;one('#demo-input-label').textContent=data.label;
 one('.range-labels span:first-child').textContent=data.low;one('.range-labels span:last-child').textContent=data.high;
 const message=one('.demo-message p');message.replaceChildren(document.createTextNode(data.a),document.createElement('br'));const strong=document.createElement('strong');strong.textContent=data.b;message.append(strong);
 input.value=saved[i];input.dispatchEvent(new Event('input'));
}));
function buildMotion(){
 motionContext?.revert();motionContext=null;
 if(!eligible()||!window.gsap||!window.ScrollTrigger)return;
 gsap.registerPlugin(ScrollTrigger);
 const mobile=innerWidth<761;
 motionContext=gsap.context(()=>{
  const route=one('.cycle-reveal'),length=route.getTotalLength();
  gsap.fromTo(route,{strokeDasharray:length,strokeDashoffset:length},{strokeDashoffset:0,ease:'none',scrollTrigger:{trigger:'.cycle-map',start:'top 85%',end:'bottom 45%',scrub:.6}});
  gsap.from('.cycle-stop b',{scale:.78,y:8,stagger:.075,duration:.65,ease:'power3.out',scrollTrigger:{trigger:'.cycle-map',start:'top 78%',once:true}});
  all('[data-drift]').forEach(el=>{
   const delta=Number(el.dataset.drift)*(mobile?.45:1);
  gsap.fromTo(el,{y:delta*.12},{y:-delta*.12,ease:'none',scrollTrigger:{trigger:el.closest('section'),start:'top bottom',end:'bottom top',scrub:.7,invalidateOnRefresh:true}});
  });
  all('main section').forEach(section=>{
   const heading=section.querySelector('h2');if(!heading)return;
   gsap.from(heading,{y:mobile?14:26,duration:.8,ease:'power3.out',scrollTrigger:{trigger:heading,start:'top 92%',once:true}});
  });
  gsap.from('.plan',{y:mobile?15:35,stagger:.12,duration:.8,ease:'power3.out',scrollTrigger:{trigger:'.plans-grid',start:'top 85%',once:true}});
  gsap.fromTo('.about-crop img',{scale:1.075,y:mobile?0:15},{scale:1,y:0,ease:'none',scrollTrigger:{trigger:'.about-photo',start:'top bottom',end:'bottom 35%',scrub:.8}});
  gsap.fromTo('.checkin-demo',{rotation:mobile?0:2,y:22},{rotation:0,y:0,ease:'none',scrollTrigger:{trigger:'.weekly-layout',start:'top 80%',end:'center center',scrub:.6}});
  gsap.from('.voice-grid figure',{x:i=>mobile?0:(i===0?-22:22),y:mobile?18:0,stagger:.16,duration:.8,ease:'power3.out',scrollTrigger:{trigger:'.voice-grid',start:'top 85%',once:true}});
  gsap.to('.closing-lines',{rotation:10,scale:1.13,ease:'none',scrollTrigger:{trigger:'.closing',start:'top bottom',end:'bottom bottom',scrub:.8}});
 });
 ScrollTrigger.refresh();
}
addEventListener('saulo:motion',event=>{motionEnabled=event.detail.enabled;if(!motionEnabled){detailTween?.progress(1);cycleTween?.kill();cyclePosition.p=cycle/7;paintCycle();if(window.gsap)gsap.set('.cycle-stop svg path,.cycle-stop svg rect,.cycle-stop svg circle',{clearProps:'strokeDasharray,strokeDashoffset'});}buildMotion();one('#replay').disabled=!motionEnabled;one('#replay').hidden=reduced.matches||Boolean(navigator.connection?.saveData);});buildMotion();
one('#replay').hidden=reduced.matches||Boolean(navigator.connection?.saveData);
document.fonts?.ready.then(()=>{fitCyclePanels();ScrollTrigger?.refresh();});
})();
