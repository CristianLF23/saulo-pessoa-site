'use strict';
(()=>{
const q=s=>document.querySelector(s),all=s=>[...document.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)'),connection=navigator.connection;
const state={chapter:0,progress:0,paused:false,visible:true,foodVisible:false,intro:false};
const video=q('#food'),poster=q('#poster'),motion=q('#motion'),canvas=q('#surface');
const desktopCurve=q('.contour-live').getAttribute('d');
const save=()=>Boolean(connection&&connection.saveData);
const canMove=()=>!state.paused&&!reduce.matches&&!save()&&state.visible&&!document.hidden;
let gl=null,program=null,uniforms={},frame=0,last=0,clock=0,started=false,pending=false,failed=false,scrollContext=null,introTimeline=null,introTimer=0,phaseTimeline=null;
const vertex='attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';
const fragment=`precision mediump float;
uniform vec2 uSize;uniform float uTime;uniform float uScroll;uniform float uChapter;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){return .58*noise(p)+.28*noise(p*2.03)+.14*noise(p*4.07);}
void main(){vec2 uv=gl_FragCoord.xy/uSize;vec2 p=vec2(uv.x,uv.y*1.35);float t=uTime*.055;
float flow=fbm(p*2.1+vec2(t,-t*.4));float bend=sin(p.y*4.2+p.x*2.2+t)*.14+flow*.28;
float space=p.x+bend+sin(p.y*2.4-t)*.13;
float folds=sin(space*12.-p.y*3.8+t+uScroll*2.2);float silk=pow(.5+.5*folds,3.);
float relief=smoothstep(.2,.95,flow+silk*.22);float right=smoothstep(.18,.9,uv.x);
float lower=1.-smoothstep(.08,.7,uv.y);vec3 ink=vec3(.111,.049,.153);vec3 violet=vec3(.31,.17,.37);vec3 warm=vec3(.43,.25,.25);
vec3 c=mix(ink,violet,relief*(.18+right*.38));c=mix(c,warm,silk*lower*(.13+uChapter*.045));
float filament=pow(.5+.5*sin(space*27.+p.y*4.+uScroll*2.),26.);c+=vec3(.27,.18,.25)*filament*(.07+right*.13);
float grain=(hash(gl_FragCoord.xy)-.5)*.018;c+=grain;
float readMask=1.-smoothstep(.0,.62,uv.x);c=mix(c,ink,readMask*.28);
gl_FragColor=vec4(c,1.);}`;
function setupGL(){
 try{gl=canvas.getContext('webgl',{alpha:false,antialias:false,depth:false,stencil:false,powerPreference:'low-power'});if(!gl){canvas.hidden=true;return;}function compile(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;}
 const vs=compile(gl.VERTEX_SHADER,vertex),fs=compile(gl.FRAGMENT_SHADER,fragment);program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('link');gl.useProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);const a=gl.getAttribLocation(program,'a');gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,2,gl.FLOAT,false,0,0);for(const key of ['uSize','uTime','uScroll','uChapter'])uniforms[key]=gl.getUniformLocation(program,key);document.body.dataset.surface='webgl';resize();
 }catch(error){document.body.dataset.surface='fallback';canvas.hidden=true;if(gl)gl.getExtension('WEBGL_lose_context')?.loseContext();gl=null;}
}
function resize(){if(!gl)return;const bounds=canvas.getBoundingClientRect(),scale=innerWidth<760?.6:.7;canvas.width=Math.round(Math.min(1800,bounds.width*scale));canvas.height=Math.round(Math.min(1800,bounds.height*scale));gl.viewport(0,0,canvas.width,canvas.height);render();}
function render(){if(!gl||gl.isContextLost())return;gl.useProgram(program);gl.uniform2f(uniforms.uSize,canvas.width,canvas.height);gl.uniform1f(uniforms.uTime,clock);gl.uniform1f(uniforms.uScroll,state.progress);gl.uniform1f(uniforms.uChapter,state.chapter);gl.drawArrays(gl.TRIANGLES,0,6);}
function draw(now){frame=0;if(!canMove())return;if(now-last>=33){clock+=Math.min((now-last)/1000,.06);last=now;render();}frame=requestAnimationFrame(draw);}
function sync(){
 cancelAnimationFrame(frame);frame=0;
 if(canMove()){last=performance.now();if(gl)frame=requestAnimationFrame(draw);playVideo();}else video.pause();
 if(!state.foodVisible)video.pause();
 motion.hidden=reduce.matches||save();motion.setAttribute('aria-pressed',String(state.paused));motion.querySelector('span').textContent=state.paused?'Retomar movimento':'Pausar movimento';motion.querySelector('path').setAttribute('d',state.paused?'M4 2 14 8 4 14Z':'M3 2h3v12H3zm7 0h3v12h-3z');
}
function playVideo(){if(failed||pending||!canMove()||!state.foodVisible)return;if(!started){video.src='assets/food-loop.mp4';started=true;}if(!video.paused)return;pending=true;video.play().then(()=>{pending=false;}).catch(error=>{pending=false;if(error.name==='AbortError'){if(canMove()&&state.foodVisible)queueMicrotask(playVideo);return;}video.hidden=true;poster.hidden=false;if(error.name!=='NotAllowedError')failed=true;});}
video.addEventListener('playing',()=>{if(!canMove()||!state.foodVisible){video.pause();return;}video.hidden=false;poster.hidden=true;});video.addEventListener('error',()=>{failed=true;video.hidden=true;poster.hidden=false;});
canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();cancelAnimationFrame(frame);gl=null;canvas.hidden=true;document.body.dataset.surface='fallback';});
new IntersectionObserver(([entry])=>{state.visible=entry.isIntersecting;sync();}).observe(q('.experience'));
new IntersectionObserver(([entry])=>{state.foodVisible=entry.isIntersecting;sync();}).observe(q('.real-life'));
document.addEventListener('visibilitychange',()=>{if(document.hidden)introTimeline?.pause();else introTimeline?.resume();sync();});
motion.addEventListener('click',()=>{state.paused=!state.paused;setupScroll();sync();});
function setupScroll(){
 scrollContext?.revert();scrollContext=null;
 all('.contour path').forEach(path=>path.setAttribute('d',innerWidth<761?'M1400 10C1320 260 1500 620 1320 850S1140 1010 1240 1110 40 1150 80 1450 1220 1730 1350 1880':desktopCurve));
 const contour=q('.contour-live'),length=contour.getTotalLength();
 if(reduce.matches||save()||state.paused||!window.gsap||!window.ScrollTrigger){contour.style.strokeDasharray='none';return;}
 gsap.registerPlugin(ScrollTrigger);
 scrollContext=gsap.context(()=>{
  gsap.set(contour,{strokeDasharray:length,strokeDashoffset:length*.7});
  const driver={p:0};gsap.to(driver,{p:1,ease:'none',scrollTrigger:{trigger:'.experience',start:'top top',end:'bottom bottom',scrub:.4,onUpdate:self=>{state.progress=self.progress;}},onUpdate:()=>{gsap.set(contour,{strokeDashoffset:length*(.7-driver.p*.7)});}});
  if(innerWidth>760){gsap.to('.hero-portrait',{y:-28,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:.4}});gsap.to('.food-scene',{y:-38,ease:'none',scrollTrigger:{trigger:'.real-life',start:'top bottom',end:'bottom top',scrub:.5}});}
  all('[data-scene]').forEach((section,i)=>ScrollTrigger.create({trigger:section,start:'top 65%',end:'bottom 35%',onEnter:()=>{state.chapter=i%3;},onEnterBack:()=>{state.chapter=i%3;}}));
 });
 ScrollTrigger.refresh();
}
function choosePhase(index,focus=false){
 const tabs=all('.phase-tab'),panels=all('.phase');const prior=panels.find(p=>!p.hidden);if(state.chapter===index&&panels[index]===prior)return;phaseTimeline?.kill();state.chapter=index;
 tabs.forEach((tab,i)=>{tab.classList.toggle('is-active',i===index);if(i===index)tab.setAttribute('aria-current','step');else tab.removeAttribute('aria-current');});
 panels.forEach((panel,i)=>{panel.hidden=i!==index;panel.classList.toggle('is-active',i===index);panel.style.removeProperty('opacity');panel.style.removeProperty('transform');});
 if(window.gsap&&!reduce.matches&&!state.paused)phaseTimeline=gsap.fromTo(panels[index],{opacity:.3,y:8},{opacity:1,y:0,duration:.28,ease:'power2.out'});
 q('.phase-progress i').style.transform='translateX('+index*100+'%)';if(focus)tabs[index].focus();render();
}
all('.phase-tab').forEach((tab,index)=>{tab.addEventListener('click',event=>{event.preventDefault();choosePhase(index);});tab.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight')next=(index+1)%3;if(event.key==='ArrowLeft')next=(index+2)%3;if(event.key==='Home')next=0;if(event.key==='End')next=2;if(next!==undefined){event.preventDefault();choosePhase(next,true);}});});
all('.phase').forEach((p,i)=>p.hidden=i!==0);
const intro=q('.intro'),curtain=q('.intro-curtain'),introLogo=q('#intro-logo');let introOrigin=null;
function closeIntro(){
 clearTimeout(introTimer);introTimeline?.kill();introTimeline=null;state.intro=false;if(window.gsap)gsap.set('.hero-copy',{clearProps:'transform'});intro.hidden=true;curtain.hidden=true;q('.experience').inert=false;motion.inert=false;document.body.classList.remove('is-intro');q('#header-logo').style.visibility='';if(intro.contains(document.activeElement)){(introOrigin||q('.brand')).focus({preventScroll:true});}sync();
}
function introSeen(){try{return sessionStorage.getItem('saulo-site-v7')==='1';}catch{return false;}}
function showIntro(replay=false){
 if(reduce.matches||save()||!window.gsap||state.paused)return;
 introOrigin=replay?q('#replay'):null;window.scrollTo({top:0,behavior:'instant'});state.intro=true;intro.hidden=false;curtain.hidden=false;q('.experience').inert=true;motion.inert=true;document.body.classList.add('is-intro');q('#header-logo').style.visibility='hidden';q('#skip-intro').focus({preventScroll:true});
 try{sessionStorage.setItem('saulo-site-v7','1');}catch{}
 introTimer=setTimeout(closeIntro,4000);
 gsap.set(curtain,{clipPath:'inset(0% 0% 0% 0% round 0% 0% 0% 0%)'});gsap.set(introLogo,{x:0,y:0,scale:1,opacity:1,clipPath:'inset(0% 100% 0% 0%)'});gsap.set('.intro-curtain>p',{opacity:1,y:0});gsap.set('.intro-arc',{scale:.88,rotation:-30,opacity:0});gsap.set('.intro-line',{scaleX:0});gsap.set('#skip-intro',{opacity:1});
 const from=introLogo.getBoundingClientRect(),to=q('#header-logo').getBoundingClientRect();
 introTimeline=gsap.timeline({defaults:{ease:'power2.inOut'},onComplete:closeIntro});
 introTimeline.to(introLogo,{clipPath:'inset(0% 0% 0% 0%)',duration:.7,ease:'power2.out'},0)
 .to('.intro-arc',{scale:1,rotation:-20,opacity:1,duration:1.1},0)
 .to('.intro-line',{scaleX:1,duration:1.3,ease:'none'},0)
 .to('.intro-curtain>p',{y:-10,opacity:0,duration:.3},.95)
 .to(introLogo,{x:to.left-from.left,y:to.top-from.top,scale:to.width/from.width,duration:.65,ease:'power3.inOut'},1.0)
 .to(curtain,{clipPath:'inset(0% 0% 100% 0% round 0% 0% 45% 45%)',duration:.75,ease:'power3.inOut'},.95)
 .to('#skip-intro',{opacity:0,duration:.2},1.4)
 .fromTo('.hero-copy',{y:18},{y:0,duration:.55,ease:'power2.out'},1.1);
}
q('#skip-intro').addEventListener('click',closeIntro);intro.addEventListener('keydown',event=>{if(event.key==='Escape')closeIntro();if(event.key==='Tab'){event.preventDefault();q('#skip-intro').focus();}});q('#replay').addEventListener('click',()=>showIntro(true));
reduce.addEventListener('change',()=>{if(reduce.matches){closeIntro();video.hidden=true;poster.hidden=false;canvas.hidden=true;}else if(gl)canvas.hidden=false;setupScroll();sync();});connection?.addEventListener('change',()=>{if(save()){closeIntro();video.hidden=true;poster.hidden=false;canvas.hidden=true;}else if(gl)canvas.hidden=false;setupScroll();sync();});
let lastWidth=innerWidth;let resizeTimer;addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{if(state.intro)closeIntro();resize();if(Math.abs(lastWidth-innerWidth)>30){lastWidth=innerWidth;setupScroll();}},120);},{passive:true});
if(!reduce.matches&&!save())setupGL();else canvas.hidden=true;
setupScroll();sync();
if(!introSeen()||new URLSearchParams(location.search).get('intro')==='1')showIntro();
document.fonts?.ready.then(()=>window.ScrollTrigger?.refresh());
})();
