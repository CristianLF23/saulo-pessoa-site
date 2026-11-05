'use strict';
(()=>{
const q=s=>document.querySelector(s),all=s=>[...document.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)'),connection=navigator.connection;
const state={chapter:0,progress:0,paused:false,visible:true,foodVisible:false,intro:false};
const video=q('#food'),poster=q('#poster'),motion=q('#motion'),canvas=q('#surface');
let threadLength=1,threadHeight=1;
function sizeThread(){
 const area=q('.experience'),svg=q('.page-thread'),w=area.clientWidth,h=area.scrollHeight,mobile=w<761;
 threadHeight=h;svg.setAttribute('viewBox',`0 0 ${w} ${h}`);
 let y=mobile?440:260;
 let d=mobile?`M${w-12} 84C${w-29} 165 ${w-25} 315 ${w-12} ${y}`:`M24 136C${w*.28} 66 ${w*.72} 78 ${w-18} ${y}`;
 const origin=area.getBoundingClientRect().top;
 const stops=all('main>section,.continuation>section').map(s=>s.getBoundingClientRect().bottom-origin+20).filter(v=>v>y+90&&v<h-80);
 for(const end of [...stops,h-25]){
  if(end<=y)continue;const span=end-y;
  d+=`C${w-(mobile?5:4)} ${y+span*.28} ${w-(mobile?27:75)} ${y+span*.72} ${w-(mobile?12:18)} ${end}`;y=end;
 }
 all('.page-thread path').forEach(p=>p.setAttribute('d',d));threadLength=q('.contour-live').getTotalLength();
}
function paintThread(progress){
 const path=q('.contour-live'),target=Math.min(threadHeight-25,progress*(threadHeight-innerHeight*.74)+innerHeight*.74);
 let lo=0,hi=threadLength;
 for(let i=0;i<13;i++){const mid=(lo+hi)/2;if(path.getPointAtLength(mid).y<target)lo=mid;else hi=mid;}
 const length=(lo+hi)/2,point=path.getPointAtLength(length);
 path.style.strokeDasharray=String(threadLength);path.style.strokeDashoffset=String(threadLength-length);
 q('.thread-tip').setAttribute('cx',point.x);q('.thread-tip').setAttribute('cy',point.y);
}
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
ink=vec3(.961,.941,.910);violet=vec3(.81,.74,.86);warm=vec3(1.,.69,.39);
vec3 c=mix(ink,violet,relief*(.06+right*.23));c=mix(c,warm,silk*lower*(.09+uChapter*.02));
float filament=pow(.5+.5*sin(space*27.+p.y*4.+uScroll*2.),26.);c-=vec3(.25,.16,.20)*filament*(.02+right*.07);
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
 window.dispatchEvent(new CustomEvent('saulo:motion',{detail:{enabled:!reduce.matches&&!save()&&!state.paused}}));
 sizeThread();
 const contour=q('.contour-live');
 if(reduce.matches||save()||state.paused||!window.gsap||!window.ScrollTrigger){contour.style.strokeDasharray='none';q('.thread-tip').style.visibility='hidden';return;}
 q('.thread-tip').style.visibility='';
 gsap.registerPlugin(ScrollTrigger);
 scrollContext=gsap.context(()=>{
  const driver={p:0};paintThread(0);
  gsap.to(driver,{p:1,ease:'none',scrollTrigger:{trigger:'.experience',start:'top top',end:'bottom bottom',scrub:.35,onUpdate:self=>{state.progress=self.progress;},onRefresh:()=>paintThread(driver.p)},onUpdate:()=>paintThread(driver.p)});
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
function introSeen(){try{return sessionStorage.getItem('saulo-site-v8')==='1';}catch{return false;}}
function showIntro(replay=false){
 if(reduce.matches||save()||!window.gsap||state.paused)return;
 introOrigin=replay?q('#replay'):null;window.scrollTo({top:0,behavior:'instant'});state.intro=true;intro.hidden=false;curtain.hidden=false;q('.experience').inert=true;motion.inert=true;document.body.classList.add('is-intro');q('#header-logo').style.visibility='hidden';q('#skip-intro').focus({preventScroll:true});
 try{sessionStorage.setItem('saulo-site-v8','1');}catch{}
 introTimer=setTimeout(closeIntro,7000);
 gsap.set(curtain,{clearProps:'clipPath'});gsap.set('#welcome-opening',{attr:{r:0,cx:innerWidth/2,cy:innerHeight/2}});
 gsap.set(introLogo,{x:0,y:12,scale:.95,opacity:0,clipPath:'inset(0% 0% 0% 0%)'});
 gsap.set('.welcome-message>span,.welcome-message>em',{opacity:0,y:30});gsap.set('.welcome-caption',{opacity:0,y:8});
 gsap.set('.welcome-rings',{opacity:1});gsap.set('.welcome-rings i',{scale:.75,opacity:0});gsap.set('#skip-intro',{opacity:1});
 gsap.set('.welcome-fruit',{x:0,y:0,scale:.15,opacity:0});
 introTimeline=gsap.timeline({defaults:{ease:'power3.out'},onComplete:closeIntro});
 introTimeline.addLabel('acolher',0)
 .to(introLogo,{opacity:1,y:0,scale:1,duration:.85},'acolher')
 .to('.welcome-rings i',{opacity:1,scale:1,duration:1.5,stagger:.12},.1)
 .to('.welcome-message>span,.welcome-message>em',{opacity:1,y:0,duration:.85,stagger:.18},.4)
 .to('.welcome-fruit',{opacity:1,scale:1,duration:1.2,stagger:{each:.1,from:'center'}},.65)
 .to('.welcome-caption',{opacity:1,y:0,duration:.65},1.3)
 .addLabel('abrir',2.9)
 .to('.welcome-message>span,.welcome-message>em,.welcome-caption',{y:-18,opacity:0,duration:.45,stagger:.04},'abrir')
 .to(introLogo,{y:-25,opacity:0,duration:.45},'abrir')
 .to('.welcome-fruit',{scale:1.12,opacity:0,x:i=>(i%2?1:-1)*80,y:i=>i<2?-60:70,duration:.85,stagger:.025,ease:'power2.in'},'abrir+=.1')
 .to('.welcome-rings',{scale:1.18,opacity:0,duration:.8},'abrir+=.1')
 .to('#welcome-opening',{attr:{r:Math.hypot(innerWidth,innerHeight)},duration:1.2,ease:'power3.inOut'},'abrir+=.3')
 .to('#skip-intro',{opacity:0,duration:.2},'abrir+=1')
 .fromTo('.hero-copy',{y:24},{y:0,duration:.8,ease:'power3.out'},'abrir+=.7');
}
q('#skip-intro').addEventListener('click',closeIntro);intro.addEventListener('keydown',event=>{if(event.key==='Escape')closeIntro();if(event.key==='Tab'){event.preventDefault();q('#skip-intro').focus();}});q('#replay').addEventListener('click',()=>showIntro(true));
reduce.addEventListener('change',()=>{if(reduce.matches){closeIntro();video.hidden=true;poster.hidden=false;canvas.hidden=true;}else if(gl)canvas.hidden=false;setupScroll();sync();});connection?.addEventListener('change',()=>{if(save()){closeIntro();video.hidden=true;poster.hidden=false;canvas.hidden=true;}else if(gl)canvas.hidden=false;setupScroll();sync();});
let lastWidth=innerWidth;let resizeTimer;addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{if(state.intro)closeIntro();resize();if(Math.abs(lastWidth-innerWidth)>30){lastWidth=innerWidth;setupScroll();}},120);},{passive:true});
if(!reduce.matches&&!save())setupGL();else canvas.hidden=true;
window.ScrollTrigger?.addEventListener('refreshInit',sizeThread);
setupScroll();sync();
if(!introSeen()||new URLSearchParams(location.search).get('intro')==='1')showIntro();
document.fonts?.ready.then(()=>window.ScrollTrigger?.refresh());
})();
