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
 const offsets=()=>cards.map(card=>card.offsetLeft-cards[0].offsetLeft);
 const currentSlide=positions=>positions.reduce((closest,offset,index)=>
  Math.abs(offset-carousel.scrollLeft)<Math.abs(positions[closest]-carousel.scrollLeft)?index:closest,0);
 const go=direction=>{
  const positions=offsets();
  const next=(currentSlide(positions)+direction+cards.length)%cards.length;
  carousel.scrollTo({left:positions[next],behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
 };
 const stop=()=>clearTimeout(timer);
 const schedule=()=>{
  stop();
  if(!inView||touching||carousel.contains(document.activeElement)||
     matchMedia('(prefers-reduced-motion: reduce)').matches||cards.length<2)return;
  timer=setTimeout(()=>{
   if(!carousel.isConnected||!carousel.clientWidth)return;
   if(document.hidden){schedule();return;}
   go(1);
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
 if(name==='supportPage'){
  root.querySelectorAll('[data-name="contacts"]').forEach(node=>node.remove());
  for(const card of cards){
   if(window.innerWidth<768){
    const description=card.querySelector(':scope > p:last-of-type');
    const shortCopy={
     '1402:1607':'Чем больше подписей,\nтем сложнее делать вид, что травли нет.',
     '1402:1622':'Бесплатные консультации психологов для подростков: онлайн или очно, до восьми встреч.'
    }[card.dataset.nodeId];
    if(description&&shortCopy){
     const [firstLine,secondLine]=shortCopy.split('\n');
     description.textContent=firstLine;
     if(secondLine)description.append(document.createElement('br'),secondLine);
    }
   }
   const button=card.querySelector(':scope > .button-link');
   if(!button)continue;
   const slide=document.createElement('div');
   slide.className='compact-support-slide';
   card.replaceWith(slide);
   slide.append(card,button);
   cards[cards.indexOf(card)]=slide;
  }
 }
 const resourceGrid=name==='resources'&&window.innerWidth<768
  ?root.querySelector('[data-name="cards"]'):null;
 if(resourceGrid)resourceGrid.classList.add('compact-resource-grid');
 else if(cards.length)createCompactCarousel(root,cards);
 for(const empty of root.querySelectorAll('[data-name="cards"],[data-name="steps"],[data-name="articles"]')){
  if(!empty.children.length)empty.remove();
 }
 if(actions){
  if(name==='help')actions.querySelector('[data-exact-action="materials"]')?.remove();
  actions.classList.add('compact-document-actions');
  root.append(actions);
 }
 if(emergency){
  const intro=root.querySelector('.mobile-document-intro');
  if(intro)intro.after(emergency);
 }
 for(const social of socials){social.classList.add('compact-socials');root.append(social);}
 root.querySelectorAll('[data-name="contacts"]').forEach(n=>root.append(n));
 if(name==='resources'){
  const petition=root.querySelector('.button-link[href*="change.org/p/"]');
  if(petition){
   const actions=document.createElement('div');
   actions.className='compact-document-actions compact-resource-actions';
   actions.append(petition);
   if(resourceGrid)root.append(actions);
   else{
    const intro=root.querySelector('.mobile-document-intro');
    const heading=document.createElement('div');
    heading.className='compact-resource-heading';
    intro.before(heading);
    heading.append(intro,actions);
   }
  }
 }
 if(name==='materials'){
  const start=root.querySelector('.mobile-document-start');
  if(start){
   start.classList.add('compact-primary-start');
   if(window.innerWidth<768){
    const footer=document.createElement('div');
    footer.className='compact-document-actions compact-materials-actions';
    const foundation=document.createElement('a');
    foundation.className='action mobile-document-start compact-foundation-link';
    foundation.href='https://verimtebe.ru/get-psy-assistance/#anketa';
    foundation.target='_blank';
    foundation.rel='noopener noreferrer';
    foundation.textContent='написать в фонд';
    footer.append(foundation,start);
    root.append(footer);
   }else root.append(start);
  }
 }
}

function adaptCompactMenu(root){
 root.classList.add('compact-menu');
 const panel=root.querySelector('[data-component="Menu"]');
 const socials=panel?.querySelector('[data-name="socials-block"]');
 if(socials){
  socials.querySelector('[data-name="divider"]')?.remove();
  panel.append(socials);
  socials.classList.add('compact-menu-socials');
 }
 const cover=root.querySelector('[data-name^="bg/key-visual"]');
 if(cover){
  cover.classList.add('compact-menu-cover');
  const image=cover.querySelector('img');
  if(image)image.src='./assets/menu-mobile-art-3x.jpg';
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
