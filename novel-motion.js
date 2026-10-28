/* ИИ: короткие анимации интерфейса, без непрерывного движения. Запись №23. */
const novelMotionPreference=matchMedia('(prefers-reduced-motion: reduce)');
const novelAnimations=new Set();
let previousMotionFrame='';
function playNovelMotion(node,frames,options){
 if(!node||novelMotionPreference.matches||typeof node.animate!=='function')return;
 const animation=node.animate(frames,{duration:240,easing:'cubic-bezier(.2,.8,.2,1)',...options});
 novelAnimations.add(animation);
 const clear=()=>novelAnimations.delete(animation);
 animation.addEventListener('finish',clear,{once:true});animation.addEventListener('cancel',clear,{once:true});
 return animation;
}
novelMotionPreference.addEventListener('change',()=>{
 if(novelMotionPreference.matches){for(const animation of novelAnimations)animation.cancel();novelAnimations.clear();}
});
function animateNovelFrame(host,screenName){
 const key=JSON.stringify([screenName,state.scene,state.modal,state.frameStep||0,state.chatStep||0]);
 if(key===previousMotionFrame)return;previousMotionFrame=key;
 for(const animation of novelAnimations)animation.cancel();novelAnimations.clear();
 if(novelMotionPreference.matches)return;
 const canvas=host.querySelector('.figma-canvas')||host.querySelector('.stage');
 playNovelMotion(canvas,[{opacity:.55},{opacity:1}],{duration:180});
 const dialogues=[...host.querySelectorAll('[data-name="Bubble"],.story-dialogue .bubble')];
 dialogues.slice(0,2).forEach((node,i)=>playNovelMotion(node,[
  {opacity:0,transform:'translateY(10px) scale(.985)'},
  {opacity:1,transform:'translateY(-1px) scale(1.004)',offset:.78},
  {opacity:1,transform:'none'}
 ],{duration:280,delay:i*45}));
 for(const node of host.querySelectorAll('[data-name^="char/"],.story-character')){
  playNovelMotion(node,[{opacity:0,transform:'translateY(6px)'},{opacity:1,transform:'none'}],{duration:300});
 }
 const modal=host.querySelector('.modal');
 playNovelMotion(modal,[{opacity:0,transform:'translateY(8px) scale(.99)'},{opacity:1,transform:'none'}],{duration:220});
}
function pressNovelControl(target){
 const control=target.closest('[data-exact-action],button[data-action]');if(!control)return;
 playNovelMotion(control,[{transform:'scale(1)'},{transform:'translateY(1px) scale(.985)',offset:.35},{transform:'scale(1.008)',offset:.75},{transform:'none'}],{duration:210});
}
document.addEventListener('pointerdown',e=>{if(e.button===0)pressNovelControl(e.target);},{passive:true});
document.addEventListener('keydown',e=>{if(!e.repeat&&(e.key==='Enter'||e.key===' '))pressNovelControl(e.target);},{capture:true});
