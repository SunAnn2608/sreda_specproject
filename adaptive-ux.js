"use strict";

function compactNovelLayout(){
 return window.innerWidth<768 || window.innerWidth<=1280&&window.innerHeight>window.innerWidth;
}

function applyAdaptiveUX(host,name,context){
 const viewport=host.querySelector('.figma-viewport');
 if(!viewport||viewport.dataset.exactDevice!=='mobile')return;
 const root=host.querySelector('.figma-canvas').firstElementChild;
 viewport.classList.add('compact-ux');
 root.classList.add('compact-frame');
 const bar=root.querySelector('[data-name="Bar"]');
 if(bar)bar.classList.add('compact-bar');
 root.querySelectorAll('[data-name="Chapter"]').forEach(chapter=>{
  if(name==='prologue')chapter.remove();
  else chapter.classList.add('compact-chapter');
 });
 root.querySelectorAll('[data-exact-action="exact-next"]').forEach(button=>button.classList.add('compact-next'));
 root.querySelectorAll('[data-name="Bubble"]').forEach(bubble=>{
  bubble.classList.add('compact-bubble');
  bubble.querySelectorAll('[data-name="Tail"]').forEach(tail=>tail.remove());
  const speaker=normalizedLabel(bubble.querySelector('[data-name="Name"]')||bubble);
  if(!speaker.startsWith('ты'))bubble.classList.add('compact-tail');
 });
 const dialogue=root.querySelector('[data-name="dialogue"],.story-continue-group');
 if(dialogue)dialogue.classList.add('compact-dialogue');
 else root.querySelectorAll(':scope > [data-name="Bubble"]').forEach(b=>b.classList.add('compact-single-bubble'));
 root.querySelectorAll('[data-name="Choice"],[data-name="Prompt"]').forEach(n=>n.classList.add('compact-choice-part'));
 if(name==='prologue'){
  const panel=root.querySelector('[data-name="panel"]');
  if(panel)panel.classList.add('compact-prologue-panel');
  const notes=root.querySelector('[data-name="notes"]');
  if(notes)notes.classList.add('compact-prologue-notes');
  const notice=root.querySelector('[data-component="Note"]');
  if(notice){
   notice.replaceChildren();
   const text=document.createElement('p');
   text.textContent=formatStoryContext('В истории есть сцены травли. Если тебе тяжело,');
   const call=document.createElement('a');
   call.href='tel:88002000122';
   call.textContent='позвони на телефон доверия 8 800 2000-122.';
   const instruction=document.createElement('p');
   instruction.className='tap-instruction';
   instruction.textContent='Коснись экрана, чтобы продолжить. Когда появятся ответы, выбери один.';
   notice.append(text,call,instruction);
  }
  if(panel){
   panel.querySelectorAll('[data-name="actions"]').forEach(actions=>actions.classList.add('compact-actions'));
   const bg=root.querySelector('[data-name^="bg/"]');
   if(bg)bg.classList.add('compact-prologue-crop');
  }
 }
 if(name==='closeness')root.classList.add('compact-closeness');
 if(context)context.classList.add('compact-context');
 if(['resources','help','materials','supportPage'].includes(name))adaptCompactDocument(root,name);
 if(name==='menu')adaptCompactMenu(root);
}

function createCompactCarousel(root,cards){
 const carousel=document.createElement('section');
 carousel.className='compact-carousel';
 carousel.setAttribute('aria-label','Карточки — листай горизонтально');
 for(const card of cards){card.classList.add('compact-slide');carousel.append(card);}
 let timer;
 const stop=()=>clearTimeout(timer);
 const schedule=()=>{
  stop();
  if(matchMedia('(prefers-reduced-motion: reduce)').matches||cards.length<2)return;
  timer=setTimeout(()=>{
   if(!carousel.isConnected)return;
   const width=carousel.clientWidth;
   const current=Math.round(carousel.scrollLeft/width);
   carousel.scrollTo({left:((current+1)%cards.length)*width,behavior:'smooth'});
   schedule();
  },6500);
 };
 carousel.addEventListener('pointerdown',stop,{passive:true});
 carousel.addEventListener('pointerup',schedule,{passive:true});
 carousel.addEventListener('focusin',stop);
 carousel.addEventListener('focusout',schedule);
 carousel.addEventListener('scrollend',schedule,{passive:true});
 const observer=new IntersectionObserver(([entry])=>{if(entry.isIntersecting)schedule();else stop();});
 observer.observe(carousel);
 root.append(carousel);
 schedule();
 return carousel;
}

function adaptCompactDocument(root,name){
 root.classList.add('compact-document');
 const header=root.querySelector('.mobile-document-intro');
 if(name==='help'&&!header){
  const intro=document.createElement('header');
  intro.className='mobile-document-intro';
  const h=document.createElement('h1');h.textContent='получить помощь';
  const p=document.createElement('p');p.textContent='Как начать разговор и к кому обратиться, если тебя травят или ты видишь травлю.';
  intro.append(h,p);root.prepend(intro);
 }
 if(name==='supportPage'){
  const h=root.querySelector('.mobile-document-intro h1');
  if(h)h.replaceChildren('сделай',document.createElement('br'),'среду безопаснее');
 }
 const cards=[...root.querySelectorAll('[data-name="Card"],:scope > [data-name="panel"],[data-name="panel/petition-mini"]')];
 const socials=[...root.querySelectorAll('[data-name="socials"]')];
 const actions=root.querySelector(':scope > [data-name="actions"]');
 const emergency=root.querySelector('[data-name="note/emergency"]');
 if(emergency){
  emergency.replaceChildren();
  const p=document.createElement('p');
  p.append('Если опасно прямо сейчас — ');
  const a=document.createElement('a');a.href='tel:112';a.textContent='звони 112.';
  const b=document.createElement('a');b.href='tel:88002000122';b.textContent='Детский телефон доверия 8 800 2000-122.';
  p.append(a,document.createElement('br'),'Поговорить анонимно и бесплатно: ',b);emergency.append(p);
  emergency.classList.add('compact-emergency');
 }
 if(name!=='materials'&&cards.length)createCompactCarousel(root,cards);
 for(const empty of root.querySelectorAll('[data-name="cards"],[data-name="steps"]')){
  if(!empty.children.length)empty.remove();
 }
 if(actions){actions.classList.add('compact-document-actions');root.append(actions);}
 if(emergency)root.append(emergency);
 for(const social of socials){social.classList.add('compact-socials');root.append(social);}
 if(name==='resources'||name==='materials'){
  const start=root.querySelector('.mobile-document-start');
  if(start){start.classList.add('compact-primary-start');root.append(start);}
 }
 root.querySelectorAll('[data-name="contacts"]').forEach(n=>root.append(n));
}

function adaptCompactMenu(root){
 root.classList.add('compact-menu');
 const panel=root.querySelector('[data-component="Menu"]');
 if(panel){
  const socials=panel.querySelector('[data-name="socials-block"]');
  if(socials){panel.append(socials);socials.classList.add('compact-menu-socials');}
 }
 const cover=root.querySelector('[data-name^="bg/key-visual"]');
 if(cover){
  cover.classList.add('compact-menu-cover');
  const image=cover.querySelector('img');
  if(image){
   image.draggable=false;
   image.style.pointerEvents='auto';
  }
 }
}

const novelProgressKey='sreda-novel-progress-v1';
function readNovelProgress(){
 try{
  const saved=JSON.parse(localStorage.getItem(novelProgressKey));
  if(!saved||!scenes[saved.scene]||!Array.isArray(saved.answers))return null;
  return {...saved,modal:null,modalTrail:[]};
 }catch{return null;}
}
function writeNovelProgress(){
 try{localStorage.setItem(novelProgressKey,JSON.stringify({...state,modal:null,modalTrail:[]}));}catch{}
}

// Удержание ускоряет только уже просмотренные кадры.
const novelReadFrames=new Set();
let skipTimer;
document.addEventListener('pointerdown',event=>{
 if(!compactNovelLayout()||event.pointerType==='mouse'||event.clientX<24||event.clientX>innerWidth-24||
    event.target.closest('a,button,[data-exact-action],input,[data-name="Bar"],.compact-carousel'))return;
 const frame=state.scene+':'+(state.frameStep||0);
 const seen=novelReadFrames.has(frame);
 novelReadFrames.add(frame);
 if(!seen)return;
 const step=()=>{
  if(!document.querySelector('[data-scene-loading]')&&!scenes[state.scene]?.options&&!state.modal){
   const next=state.scene+':'+(state.frameStep||0);
   if(!novelReadFrames.has(next))return;
   if(document.querySelector('.figma-viewport'))exactAdvance();
   else if(canAdvanceScene())handleAction('next');
  }
  skipTimer=setTimeout(step,450);
 };
 skipTimer=setTimeout(step,650);
},{passive:true});
for(const name of ['pointerup','pointercancel','pointerleave'])document.addEventListener(name,()=>clearTimeout(skipTimer),{passive:true});
