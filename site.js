'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const menu=$('#mobile-menu'),menuButton=$('.menu-toggle');
function closeMenu(){menu.hidden=true;menuButton.setAttribute('aria-expanded','false');}
menuButton.addEventListener('click',()=>{menu.hidden=!menu.hidden;menuButton.setAttribute('aria-expanded',String(!menu.hidden));});
$$('a',menu).forEach(a=>a.addEventListener('click',closeMenu));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!menu.hidden){closeMenu();menuButton.focus();}});document.addEventListener('click',e=>{if(!menu.hidden&&!e.target.closest('.header')&&!e.target.closest('#mobile-menu'))closeMenu();});addEventListener('resize',()=>{if(innerWidth>760)closeMenu();},{passive:true});
const hunger=$('#hunger'),hungerValue=$('#hunger-value');hunger.addEventListener('input',()=>{hungerValue.value=hunger.value;hunger.style.setProperty('--value',Number(hunger.value)*10+'%');hunger.setAttribute('aria-valuetext',hunger.value+' de 10');});
$$('details').forEach(d=>d.addEventListener('toggle',()=>window.ScrollTrigger?.refresh()));
