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
 const chapter=root.querySelector('[data-name="Chapter"]');
 if(chapter){
  if(window.innerWidth<768)chapter.remove();
  else chapter.classList.add('compact-chapter');
 }
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
   notice.classList.add('compact-notice');
   notice.innerHTML=`<p>В истории есть сцены травли.<br>Если&nbsp;тебе&nbsp;тяжело, <a href="tel:88002000122">позвони на телефон доверия 8 800 2000-122</a>.</p><p hidden>Банни травят в школе. Ты решаешь, что сказать и как быть рядом.</p><p hidden>Сцены сменяются сами. Когда появятся ответы, выбери один.</p>`;
   const messages=[...notice.children];
   let current=0;
   const cycle=()=>{
    if(!notice.isConnected)return;
    if(!notice.contains(document.activeElement)){
     messages[current].hidden=true;
     current=(current+1)%messages.length;
     messages[current].hidden=false;
    }
    setTimeout(cycle,5500);
   };
   setTimeout(cycle,5500);
  }
  if(panel){
   panel.querySelectorAll('[data-name="actions"]').forEach(actions=>actions.classList.add('compact-actions'));
  }
 }
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
 let inView=false;
 let touching=false;
 const stop=()=>clearTimeout(timer);
 const schedule=()=>{
  stop();
  if(!inView||touching||carousel.contains(document.activeElement)||
     matchMedia('(prefers-reduced-motion: reduce)').matches||cards.length<2)return;
  timer=setTimeout(()=>{
   if(!carousel.isConnected||!carousel.clientWidth)return;
   if(document.hidden){schedule();return;}
   const origin=cards[0].offsetLeft;
   const offsets=cards.map(card=>card.offsetLeft-origin);
   const current=offsets.reduce((closest,offset,index)=>
    Math.abs(offset-carousel.scrollLeft)<Math.abs(offsets[closest]-carousel.scrollLeft)?index:closest,0);
   carousel.scrollTo({left:offsets[(current+1)%cards.length],behavior:'smooth'});
   schedule();
  },6500);
 };
 carousel.addEventListener('pointerdown',()=>{touching=true;stop();},{passive:true});
 for(const event of ['pointerup','pointercancel','pointerleave']){
  carousel.addEventListener(event,()=>{touching=false;schedule();},{passive:true});
 }
 carousel.addEventListener('focusin',stop);
 carousel.addEventListener('focusout',event=>{
  if(!carousel.contains(event.relatedTarget))queueMicrotask(schedule);
 });
 carousel.addEventListener('scroll',schedule,{passive:true});
 const observer=new IntersectionObserver(([entry])=>{
  inView=entry.isIntersecting;
  schedule();
 });
 observer.observe(carousel);
 root.append(carousel);
 return carousel;
}

function adaptCompactDocument(root,name){
 root.classList.add('compact-document');
 const header=root.querySelector('.mobile-document-intro');
 if(name==='help'&&!header){
  root.querySelectorAll(':scope > p').forEach(p=>p.remove());
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
  const b=document.createElement('a');b.href='tel:88002000122';b.textContent='Детский телефон доверия 8 800 2000‑122.';
  p.append(a,document.createElement('br'),'Поговорить анонимно и бесплатно: ',b);emergency.append(p);
  emergency.classList.add('compact-emergency');
 }
 if(name!=='materials'&&cards.length)createCompactCarousel(root,cards);
 for(const empty of root.querySelectorAll('[data-name="cards"],[data-name="steps"]')){
  if(!empty.children.length)empty.remove();
 }
 if(actions){actions.classList.add('compact-document-actions');root.append(actions);}
 if(emergency){
  const intro=root.querySelector('.mobile-document-intro');
  if(intro)intro.after(emergency);
 }
 for(const social of socials){social.classList.add('compact-socials');root.append(social);}
 if(name==='resources'||name==='materials'){
  const start=root.querySelector('.mobile-document-start');
  if(start){
   start.classList.add('compact-primary-start');
   if(name==='resources')root.querySelector('.mobile-document-intro')?.after(start);
   else root.append(start);
  }
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
 const close=root.querySelector('[data-component="IconButton"]');
 if(close&&panel)panel.append(close);
 const cover=root.querySelector('[data-name^="bg/key-visual"]');
 if(cover){
  cover.classList.add('compact-menu-cover');
  const image=cover.querySelector('img');
  if(image){
   image.draggable=false;
   image.style.pointerEvents='auto';
   const center=()=>{cover.scrollLeft=(cover.scrollWidth-cover.clientWidth)/2;};
   if(image.complete)requestAnimationFrame(center);
   else image.addEventListener('load',center,{once:true});
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
