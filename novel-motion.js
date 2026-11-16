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

function revealSceneLayers(surface,subject,content,background,phone=[]){
 surface.setAttribute('data-scene-loading','');
 const phases=[subject,phone,content].filter(group=>group.length);
 const loads=phases.map(group=>Promise.all(group.flatMap(layer=>layer.matches('img')?[layer]:[...layer.querySelectorAll('img')]).map(sceneImageReady)));
 for(const phase of phases)for(const layer of phase){
  layer.setAttribute('data-scene-wait','');
  layer.inert=true;
 }
 const reveal=async()=>{
  await Promise.all(background.map(sceneImageReady));
  for(const [index,phase] of phases.entries()){
   if(!novelMotionPreference.matches)await new Promise(resolve=>setTimeout(resolve,index===0?45:120));
   await loads[index];
   if(!surface.isConnected)return;
   for(const layer of phase){
    layer.removeAttribute('data-scene-wait');
    layer.inert=false;
   }
  }
  surface.removeAttribute('data-scene-loading');
 };
 void reveal();
}

function animateNovelFrame(host,screenName){
 const surface=host.querySelector('.figma-viewport,.stage');
 if(!surface||state.modal||!scenes[screenName]||['resources','supportPage'].includes(screenName))return;
 const root=surface.querySelector('.figma-canvas')?.firstElementChild||surface;
 const artwork='[data-name^="char/"],[data-name^="aura/"],.story-character,.story-other,.chat-kroli,.chat-aura,.chat-shade';
 const chatArtwork='[data-node-id="1322:5053"],[data-node-id="1396:1254"],[data-node-id="1318:3729"],[data-node-id="1396:1271"],[data-node-id="1499:6013"],[data-node-id="1499:6036"],[data-node-id="1401:1548"],[data-node-id="1499:6016"],[data-node-id="1499:5935"],[data-node-id="1499:6019"]';
 const subject=[...root.querySelectorAll(screenName==='chat'?artwork+','+chatArtwork:artwork)];
 const phone=[...root.querySelectorAll('[data-name="phone"],.chat-phone')];
 const content=[...root.children].flatMap(node=>node.matches('.main')&&[...phone,...subject].some(layer=>node.contains(layer))?[...node.children]:[node])
  .filter(node=>node.matches('.story-continue,.main,.chat-reply,.mom-message,[data-exact-action],[data-name="dialogue"],[data-name="choice-block"],[data-name="Bubble"],[data-name="notes"],[data-name="panel"],[data-name="actions"],[data-name^="button/"]'));
 if(!subject.length&&!phone.length&&!content.length)return;
 const background=root.querySelector(':scope > [data-name^="bg/"] img,:scope > [data-name="image 188"] img,:scope > img,.scene-art picture img')||root.firstElementChild?.querySelector('img');
 if(background)background.fetchPriority='high';
 revealSceneLayers(surface,subject,content,background?[background]:[],phone);
}

novelMotionPreference.addEventListener('change',resetNovelParallax);

const novelParallaxPointer=matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)');
const novelParallaxSurface='.figma-viewport[data-exact-device=desktop],.stage';
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
 const image=surface?.querySelector('.dark-scene-background,.figma-canvas > div > [data-name^="bg/"] > img,.scene-art picture > img,.scene-art > img');
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
