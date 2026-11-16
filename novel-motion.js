/* ИИ: короткие анимации интерфейса, без непрерывного движения. Запись №23. */
const novelMotionPreference=matchMedia('(prefers-reduced-motion: reduce)');
function sceneImageReady(image){
 if(image.complete)return Promise.resolve();
 return new Promise(resolve=>{
  const done=()=>{clearTimeout(timer);image.removeEventListener('load',done);image.removeEventListener('error',done);resolve();};
  const timer=setTimeout(done,2500);
  image.addEventListener('load',done);
  image.addEventListener('error',done);
 });
}

function revealSceneLayers(surface,subject,content,background){
 surface.setAttribute('data-scene-loading','');
 for(const layer of [...subject,...content])layer.setAttribute('data-scene-wait','');
 for(const group of content)group.inert=true;
 const ready=Promise.all(subject.flatMap(layer=>[...layer.querySelectorAll('img'),...(layer.matches('img')?[layer]:[])]).map(sceneImageReady));
 const reveal=async()=>{
  await Promise.all(background.map(sceneImageReady));
  if(!surface.isConnected)return;
  if(subject.length&&!novelMotionPreference.matches)await new Promise(resolve=>setTimeout(resolve,34));
  await ready;
  if(!surface.isConnected)return;
  for(const layer of subject)layer.removeAttribute('data-scene-wait');
  if(subject.length&&!novelMotionPreference.matches)await new Promise(resolve=>setTimeout(resolve,90));
  if(!surface.isConnected)return;
  for(const group of content){group.removeAttribute('data-scene-wait');group.inert=false;}
  surface.removeAttribute('data-scene-loading');
 };
 void reveal();
}

function animateNovelFrame(host,screenName){
 const surface=host.querySelector('.figma-viewport,.stage');
 if(!surface||state.modal||!['dialogue','chat','choice','momchat'].includes(scenes[screenName]?.kind))return;
 const root=surface.querySelector('.figma-canvas')?.firstElementChild||surface;
 const subject=[...root.querySelectorAll('[data-name^="char/"],.story-character,.story-other,.chat-kroli')];
 const content=[...root.children].filter(node=>node.matches('.story-continue,.main,[data-name="dialogue"],[data-name="choice-block"],[data-name="Bubble"],[data-name="phone"],[data-name="notes"],[data-name="actions"],[data-name="hint" i],[data-name^="button/"]'));
 if(!content.length)return;
 const background=[...root.querySelectorAll('[data-name^="bg/"] img,.scene-art picture img')];
 if(!background.length){const image=root.firstElementChild?.querySelector('img');if(image)background.push(image);}
 if(background[0])background[0].fetchPriority='high';
 revealSceneLayers(surface,subject,content,background);
}

novelMotionPreference.addEventListener('change',resetNovelParallax);

const novelParallaxPointer=matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)');
const novelParallaxSurface='.figma-viewport[data-exact-device=desktop]:not([data-layout=document]),.stage';
let novelParallaxImage=null;

function resetNovelParallax(){
 if(!novelParallaxImage)return;
 novelParallaxImage.style.removeProperty('--parallax-x');
 novelParallaxImage.style.removeProperty('--parallax-y');
 novelParallaxImage=null;
}

novelParallaxPointer.addEventListener('change',resetNovelParallax);
document.addEventListener('pointermove',event=>{
 if(event.pointerType!=='mouse'||novelMotionPreference.matches||!novelParallaxPointer.matches)return;
 const surface=event.target.closest(novelParallaxSurface);
 const image=surface?.querySelector('.figma-canvas > div > [data-name^="bg/"] > img,.scene-art picture > img,.scene-art > img');
 if(image!==novelParallaxImage)resetNovelParallax();
 if(!image||surface.inert)return;
 const {left,top,width,height}=surface.getBoundingClientRect();
 if(!width||!height)return;
 const distance=Math.min(14,width*.018,height*.018);
 const offset=(point,start,size)=>Math.max(-1,Math.min(1,2*(point-start)/size-1))*distance;
 novelParallaxImage=image;
 image.classList.add('novel-parallax-image');
 image.style.setProperty('--parallax-x',offset(event.clientX,left,width)+'px');
 image.style.setProperty('--parallax-y',offset(event.clientY,top,height)+'px');
},{passive:true});
document.addEventListener('pointerout',event=>{
 const surface=event.target.closest(novelParallaxSurface);
 if(surface&&!surface.contains(event.relatedTarget))resetNovelParallax();
},{passive:true});
