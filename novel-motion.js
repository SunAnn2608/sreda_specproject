/* ИИ: короткие анимации интерфейса, без непрерывного движения. Запись №23. */
const novelMotionPreference=matchMedia('(prefers-reduced-motion: reduce)');
const sceneFadeTime=360;
const scenePhaseInterval=210;
const choicePause=520;
let sceneEntryReady;
const interactivePause=2500;

function sceneImageReady(image){
 if(image.complete)return Promise.resolve();
 return new Promise(resolve=>{
  const done=()=>{clearTimeout(timer);image.removeEventListener('load',done);image.removeEventListener('error',done);resolve();};
  const timer=setTimeout(done,2500);
  image.addEventListener('load',done);
  image.addEventListener('error',done);
 });
}

function revealSceneLayers(surface,steps,crossfading=false){
 const phases=steps.filter(({layers})=>layers.length);
 if(!phases.length)return;
 surface.setAttribute('data-scene-loading','');
 const loads=phases.map(({layers})=>Promise.all(layers.flatMap(layer=>layer.matches('img')?[layer]:[...layer.querySelectorAll('img')]).map(sceneImageReady)));
 let entryReady;
 sceneEntryReady=new Promise(resolve=>{entryReady=resolve;});
 for(const {layers} of phases)for(const layer of layers){
  layer.setAttribute('data-scene-wait','');
  layer.inert=true;
 }
 const reveal=async()=>{
  for(const [index,{layers,wait,finish}] of phases.entries()){
   await loads[index];
   if(!surface.isConnected)return;
   const animated=!novelMotionPreference.matches&&!(crossfading&&index===0);
   for(const layer of layers){
    if(animated)layer.animate([{opacity:0,offset:0},{offset:1}],
     {duration:sceneFadeTime,easing:'cubic-bezier(.22,.61,.36,1)'});
    layer.removeAttribute('data-scene-wait');
    layer.inert=false;
   }
   if(index===0)entryReady();
   if(index<phases.length-1){
    const delay=wait??(novelMotionPreference.matches?0:index===0&&crossfading?420:scenePhaseInterval);
    if(delay)await new Promise(resolve=>setTimeout(resolve,delay));
   }
   await finish?.();
  }
 };
 return reveal().finally(()=>{
  entryReady();
  surface.removeAttribute('data-scene-loading');
 });
}

function animateNovelFrame(host,screenName,contextNote){
 const surface=host.querySelector('.figma-viewport,.stage');
 if(!surface)return;
 if(state.modal||['resources','supportPage'].includes(screenName)){
  if(!novelMotionPreference.matches)surface.animate([{opacity:0},{opacity:1}],{duration:sceneFadeTime,easing:'ease-out'});
  return;
 }
 if(!scenes[screenName])return;
 const root=surface.querySelector('.figma-canvas')?.firstElementChild||surface;
 const artwork='[data-name^="char/"],[data-name^="aura/"],.story-character,.story-other,.chat-kroli,.chat-aura,.chat-shade';
 const chatArtwork='[data-node-id="1322:5053"],[data-node-id="1396:1254"],[data-node-id="1318:3729"],[data-node-id="1396:1271"],[data-node-id="1499:6013"],[data-node-id="1499:6036"],[data-node-id="1401:1548"],[data-node-id="1499:6016"],[data-node-id="1499:5935"],[data-node-id="1499:6019"]';
 const subject=[...root.querySelectorAll(screenName==='chat'?artwork+','+chatArtwork:artwork)];
 const phone=[...root.querySelectorAll('[data-name="phone"],.chat-phone')];
 const background=root.querySelector(':scope > [data-name^="bg/"] img,:scope > [data-name="image 188"] img,:scope > img,.scene-art picture img')||root.firstElementChild?.querySelector('img');
 if(background){background.fetchPriority='high';background.loading='eager';}
 const immediateContinue=scenes[screenName].kind==='info';
 const next=immediateContinue?[]:[...root.querySelectorAll('[data-exact-action="exact-next"],button[data-action="next"]:not(.bubble)')];
 const mobile=surface.dataset.exactDevice==='mobile'||
  surface.matches('.stage')&&typeof compactNovelLayout==='function'&&compactNovelLayout();
 const replies=mobile||['adults','closeness'].includes(screenName)?
  [...root.querySelectorAll('[data-name="Bubble"],.dialogue-layout>.bubble')]:[];
 const sequential=mobile&&replies.length>1;
 const prompt=[...root.querySelectorAll('[data-name="Prompt"],[data-component="Prompt"],.dialogue-layout>.prompt')];
 const choices=[...root.querySelectorAll('[data-name="choices"],.dialogue-layout>.choices')];
 const delayed=new Set([...next,...replies,...prompt,...choices,contextNote]);
 const content=[...root.children].flatMap(node=>node.matches('.main')&&[...phone,...subject].some(layer=>node.contains(layer))?[...node.children]:[node])
  .filter(node=>!delayed.has(node)&&node.matches('.story-continue-group,.main,.chat-reply,.mom-message,[data-exact-action],[data-name="dialogue"],[data-name="choice-block"],[data-name="Bubble"],[data-name="notes"],[data-name="panel"],[data-name="actions"],[data-name^="button/"]'));
 const steps=[];
 const add=(layers,wait,finish)=>steps.push({layers:[...new Set(layers.filter(Boolean))],wait,finish});
 const final=screenName==='silent';
 const revealContent=[...content];
 if(replies.length)revealContent.push(replies[0]);
 const hasLaterReply=replies.length>1;
 const compact=typeof compactNovelLayout==='function'&&compactNovelLayout();
 const continuePause=compact?650:interactivePause;
 const leadInWait=contextNote?storyReadingDelay(contextNote.textContent):
  (!revealContent.length&&next.length?continuePause:undefined);
 const clearContext=contextNote&&!final?()=>dismissSceneContext(contextNote):undefined;
 // Кадр открывается только после загрузки всех его начальных слоёв.
 if(compact&&screenName==='chat'&&contextNote){
  add([background,contextNote],leadInWait,clearContext);
  add([...subject,...phone]);
 }else add([background,...subject,...phone,contextNote],leadInWait,clearContext);
 const contentHold=hasLaterReply?storyReadingDelay(replies[0].textContent):
  prompt.length?choicePause:next.length&&revealContent.length?continuePause:undefined;
 if(hasLaterReply)replies.at(-1).setAttribute('data-final-reply','');
 if(sequential){
  const retire=async reply=>{
   if(!surface.isConnected)return;
   if(!novelMotionPreference.matches){
    await reply.animate([{opacity:1},{opacity:0}],{duration:sceneFadeTime,fill:'forwards'}).finished.catch(()=>{});
   }
   reply.inert=true;
   reply.style.setProperty('display','none','important');
  };
  replies.forEach((reply,index)=>{
   const last=index===replies.length-1;
   add(index===0?revealContent:[reply],
    last?(next.length?continuePause:undefined):storyReadingDelay(reply.textContent),
    last?undefined:()=>retire(reply));
  });
 }else{
  add(revealContent,contentHold);
  if(hasLaterReply)add(replies.slice(1),next.length?continuePause:undefined);
 }
 add(prompt,sceneFadeTime);add(choices);add(next);
 return revealSceneLayers(surface,steps,host.hasAttribute('data-scene-crossfade'));
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

function storyReadingDelay(text=''){
 const words=text.match(/[\p{L}\p{N}]+(?:[-‑’'][\p{L}\p{N}]+)*/gu)?.length??0;
 if(!words)return 1800;
 const sentencePauses=(text.match(/[!?….]+(?=\s|$)/g)?.length??0)*180;
 return Math.max(2600,Math.ceil((950+words*320+sentencePauses)/100)*100);
}

const storyAdvanceControls=new WeakMap();
async function queueStoryAdvance(surface,reveal,action){
 if(!surface?.isConnected||state.modal)return;
 let revealed=false;
 let skipRequested=false;
 const wait=duration=>new Promise(resolve=>setTimeout(resolve,duration));
 let advanced=false;
 const ready=()=>!advanced&&surface.isConnected&&!state.modal;
 const goNext=()=>{
  if(!ready())return;
  advanced=true;
  surface.removeEventListener('click',skip);
  storyAdvanceControls.delete(surface);
  handleAction(action);
 };
 const requestSkip=()=>{
  skipRequested=true;
  if(revealed)goNext();
 };
 const skip=event=>{
  if(event.button!==0||event.defaultPrevented||event.target.closest(
   'a,button,input,textarea,select,label,[role="button"],[data-exact-action],[data-action],[data-name="Bar"],header'
  ))return;
  if(getSelection()?.isCollapsed===false)return;
  requestSkip();
 };
 surface.addEventListener('click',skip);
 storyAdvanceControls.set(surface,requestSkip);
 await reveal;
 if(!ready())return;
 revealed=true;
 if(skipRequested){goNext();return;}
 const notice=surface.querySelector?.('.compact-notice');
 if(notice&&action==='frame-next'){
  const messages=[...notice.children];
  const background=surface.querySelector('.compact-frame > img');
  if(background&&!novelMotionPreference.matches){
   const nextFrame=figmaScreens.prologue.mobile[1];
   const crop=figmaGeometry['1413:1624'];
   const width=surface.clientWidth,height=surface.clientHeight;
   const unit=Math.min(width/nextFrame.width,height/nextFrame.height);
   const left=Math.min(0,width/2+(crop.x-nextFrame.width/2)*unit);
   const top=Math.min(0,height/2+(crop.y-nextFrame.height/2)*unit);
   const right=Math.min(0,width/2+(nextFrame.width/2-crop.x-crop.w)*unit);
   const bottom=Math.min(0,height/2+(nextFrame.height/2-crop.y-crop.h)*unit);
   const duration=messages.reduce((total,message)=>total+storyReadingDelay(message.textContent),0);
   background.animate([
    {left:'0px',top:'0px',width:width+'px',height:height+'px'},
    {left:left+'px',top:top+'px',width:(width-left-right)+'px',height:(height-top-bottom)+'px'}
   ],{duration,easing:'ease-in-out',fill:'forwards'});
  }
  for(const message of messages){
   if(!ready())return;
   for(const item of messages)item.hidden=item!==message;
   await wait(storyReadingDelay(message.textContent));
   while(ready()&&(document.hidden||message.contains(document.activeElement)))await wait(1000);
  }
  goNext();
  return;
 }
 const content=[...surface.querySelectorAll('p,h1,h2,h3,li,.scene-context,.story-dialogue .bubble>span:not(.speaker)')]
  .filter(node=>!node.closest('[data-name="Bar"],[data-name="Chapter"],header,[data-exact-action],[data-name="Name"],[data-name="Arrow"],[data-component="ChatInput"],[hidden]')&&
   node.getClientRects().length&&getComputedStyle(node).visibility!=='hidden');
 const lastReply=surface.querySelector('[data-final-reply]');
 const duration=storyReadingDelay(lastReply?.innerText??content.map(node=>node.innerText).join(' '));
 const cutsceneCopy=surface.querySelector('.story-cutscene-copy');
 if(cutsceneCopy&&!novelMotionPreference.matches){
  cutsceneCopy.animate([{scale:'.96'},{scale:'1.05'}],{
   duration:Math.min(1800,duration),easing:'cubic-bezier(.22,.61,.36,1)',fill:'both'
  });
 }
 function advance(){
  if(!ready())return;
  if(document.hidden){setTimeout(advance,500);return;}
  goNext();
 }
 setTimeout(advance,duration);
}
