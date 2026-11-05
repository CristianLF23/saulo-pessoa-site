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
const hunger=$('#hunger'),hungerValue=$('#hunger-value');hunger.addEventListener('input',()=>{hungerValue.value=hunger.value;hunger.style.setProperty('--value',Number(hunger.value)*10+'%');hunger.setAttribute('aria-valuetext',hunger.value+' de 10');});
let disclosureFrame=0;
$$('details').forEach(d=>d.addEventListener('toggle',()=>{if(d.dataset.animating==='true')return;cancelAnimationFrame(disclosureFrame);disclosureFrame=requestAnimationFrame(()=>window.sauloRefreshLayout?.());}));
