'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const menu=$('#mobile-menu'),menuButton=$('.menu-toggle'),drawer=$('#menu-drawer'),drawerPanel=$('.drawer-panel'),drawerScrim=$('.drawer-scrim');
const drawerReduce=matchMedia('(prefers-reduced-motion: reduce)');
let drawerTimeline=null,drawerClosing=false,drawerOverflow='',drawerBodyOverflow='';
function finishMenuClose(target=null,restoreFocus=true){
 drawerTimeline?.kill();drawerTimeline=null;drawerClosing=false;
 if(drawer.open)drawer.close();
 document.documentElement.classList.remove('drawer-open');document.documentElement.style.overflow=drawerOverflow;document.body.style.overflow=drawerBodyOverflow;
 menuButton.setAttribute('aria-expanded','false');
 if(target){history.pushState(null,'','#'+target.id);target.setAttribute('tabindex','-1');target.focus({preventScroll:true});target.scrollIntoView({behavior:drawerReduce.matches?'auto':'smooth',block:'start'});}
 else if(restoreFocus)menuButton.focus({preventScroll:true});
}
function closeMenu({target=null,immediate=false,restoreFocus=true}={}){
 if(!drawer.open||drawerClosing)return;
 drawerClosing=true;drawerTimeline?.kill();
 if(immediate||drawerReduce.matches||!window.gsap){finishMenuClose(target,restoreFocus);return;}
 drawerTimeline=gsap.timeline({onComplete:()=>finishMenuClose(target,restoreFocus)})
  .to(drawerPanel,{xPercent:100,duration:.23,ease:'power2.inOut'},0)
  .to(drawerScrim,{opacity:0,duration:.2,ease:'power2.out'},0);
}
function openMenu(keyboard=false){
 if(drawer.open)return;
 drawerOverflow=document.documentElement.style.overflow;drawerBodyOverflow=document.body.style.overflow;
 document.documentElement.classList.add('drawer-open');document.documentElement.style.overflow='hidden';document.body.style.overflow='hidden';
 drawer.showModal();menuButton.setAttribute('aria-expanded','true');$('.drawer-close').focus({preventScroll:true});
 drawerTimeline?.kill();drawerClosing=false;
 if(drawerReduce.matches||keyboard||!window.gsap){if(window.gsap){gsap.set(drawerPanel,{xPercent:0});gsap.set(drawerScrim,{opacity:1});gsap.set($$('a',menu),{y:0,opacity:1});}else{drawerPanel.style.transform='none';drawerScrim.style.opacity='1';$$('a',menu).forEach(a=>{a.style.opacity='1';a.style.transform='none';});}return;}
 drawerTimeline=gsap.timeline()
  .fromTo(drawerScrim,{opacity:0},{opacity:1,duration:.25,ease:'power2.out'},0)
  .fromTo(drawerPanel,{xPercent:100},{xPercent:0,duration:.34,ease:'power3.out'},0)
  .fromTo($$('a',menu),{y:12,opacity:0},{y:0,opacity:1,duration:.24,stagger:.025,ease:'power2.out'},.09);
}
menuButton.addEventListener('click',e=>openMenu(e.detail===0));
$('.drawer-close').addEventListener('click',e=>closeMenu({immediate:e.detail===0}));
drawerScrim.addEventListener('click',()=>closeMenu());
drawer.addEventListener('cancel',e=>{e.preventDefault();closeMenu({immediate:true});});
drawer.addEventListener('keydown',e=>{if(e.key!=='Tab')return;const controls=$$('a[href],button:not([disabled])',drawer),first=controls[0],last=controls[controls.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus({preventScroll:true});}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus({preventScroll:true});}});
$$('a[href^="#"]',menu).forEach(a=>a.addEventListener('click',e=>{const target=$(a.getAttribute('href'));if(!target)return;e.preventDefault();closeMenu({target,immediate:e.detail===0,restoreFocus:false});}));
drawerReduce.addEventListener('change',()=>{if(drawer.open&&drawerReduce.matches){drawerTimeline?.kill();if(drawerClosing)finishMenuClose();else{window.gsap?.set(drawerPanel,{xPercent:0});window.gsap?.set(drawerScrim,{opacity:1});window.gsap?.set($$('a',menu),{y:0,opacity:1});}}});
addEventListener('resize',()=>{if(innerWidth>760&&drawer.open)closeMenu({immediate:true,restoreFocus:false});},{passive:true});
const checkinOptions = $$('.checkin-scale button');
checkinOptions.forEach(option => {
 option.disabled = false;
 option.addEventListener('click', () => {
  checkinOptions.forEach(button => button.setAttribute('aria-pressed', String(button === option)));
 });
});
let disclosureFrame=0;
const disclosureControllers=new WeakMap(),movingDisclosures=new Set();
function refreshDisclosures(){cancelAnimationFrame(disclosureFrame);disclosureFrame=requestAnimationFrame(()=>window.sauloRefreshLayout?.());}
function enhanceDisclosure(details){
 if(disclosureControllers.has(details))return disclosureControllers.get(details);
 const summary=$(':scope > summary',details);if(!summary)return null;
 const body=document.createElement('div'),content=document.createElement('div');body.className='disclosure-body';content.className='disclosure-content';
 while(summary.nextSibling)content.append(summary.nextSibling);
 body.append(content);details.append(body);details.dataset.drawer='true';
 let expanded=details.open,timeline=null;
 function finish(){
  timeline?.kill();timeline=null;details.open=expanded;body.inert=!expanded;
  body.style.removeProperty('height');body.style.removeProperty('overflow');
  content.style.removeProperty('transform');content.style.removeProperty('opacity');
  delete details.dataset.disclosureAnimating;movingDisclosures.delete(controller);refreshDisclosures();
 }
 const controller={finish,toggle(event){
  event.preventDefault();const currentHeight=details.open?body.getBoundingClientRect().height:0;
  const wasOpen=details.open;expanded=!expanded;details.dataset.expanded=String(expanded);
  timeline?.kill();body.inert=!expanded;
  const canAnimate=window.gsap&&!drawerReduce.matches&&!navigator.connection?.saveData&&!document.body.classList.contains('motion-is-paused')&&event.detail!==0;
  if(!canAnimate){finish();return;}
  details.dataset.disclosureAnimating='true';details.open=true;movingDisclosures.add(controller);
  const height=content.getBoundingClientRect().height;
  gsap.set(body,{height:currentHeight,overflow:'hidden'});
  if(!wasOpen)gsap.set(content,{y:-8,opacity:.45});
  timeline=gsap.timeline({onComplete:finish})
   .to(body,{height:expanded?height:0,duration:expanded?.38:.26,ease:expanded?'power3.out':'power2.inOut'},0)
   .to(content,{y:expanded?0:-5,opacity:expanded?1:0,duration:expanded?.28:.18,ease:'power2.out'},0);
 }};
 details.dataset.expanded=String(expanded);body.inert=!expanded;
 details.addEventListener('toggle',()=>{if(details.dataset.disclosureAnimating)return;expanded=details.open;details.dataset.expanded=String(expanded);body.inert=!expanded;refreshDisclosures();});
 disclosureControllers.set(details,controller);return controller;
}
$$('details').forEach(enhanceDisclosure);
// Delegation also covers text disclosures created later by the quiz.
document.addEventListener('click',event=>{const summary=event.target.closest('summary');if(summary?.parentElement.tagName==='DETAILS')enhanceDisclosure(summary.parentElement)?.toggle(event);});
drawerReduce.addEventListener('change',()=>{if(drawerReduce.matches)[...movingDisclosures].forEach(controller=>controller.finish());});
addEventListener('saulo:motion',event=>{if(!event.detail.enabled)[...movingDisclosures].forEach(controller=>controller.finish());});
addEventListener('resize',()=>[...movingDisclosures].forEach(controller=>controller.finish()),{passive:true});
