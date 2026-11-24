/* ИИ: вывод точных HTML-композиций Figma, без React в браузере. Запись №19. */
"use strict";
let exactStep=0,exactScene=null,exactVariant=null;
const exactActions={};
const optimizedImages=new Set([
 "./assets/figma/figma-3c85cdb7-bb5a-4daa-bbb6-5cbd81f9d143.png",
 "./assets/figma/figma-09473015-692e-437b-ac60-125159ec2727.png",
 "./assets/figma/figma-0364d448-fd4d-4907-b3e5-c91548006a44.png",

 "./assets/menu-background.png",
 "./assets/figma/figma-23f06a34-faa4-40bc-8154-5f06be957d44.png",
 "./assets/figma/figma-13378e02-a69b-4e44-a2fb-c68699da766c.png",
 "./assets/figma/figma-7ddb8bd5-7a20-4a76-aec9-d9e2553f615b.png",
 "./assets/figma/figma-8bf1b13f-d0de-4d26-9342-1a8e372a0f18.png",

 "./assets/figma/figma-09ea8681-be9b-472e-8a79-2b2b30734550.png",
 "./assets/figma/figma-0c5346b7-4354-465d-8cd0-6bd621d61053.png",
 "./assets/figma/figma-14ebe20a-d04a-4676-b619-7913cbb47f05.png",
 "./assets/figma/figma-1b62ae9a-4d0f-47b4-a962-06daa2e02491.png",
 "./assets/figma/figma-1e57ecd1-dfc0-46fb-85b6-398b81add6db.png",
 "./assets/figma/figma-214ffbf0-daa9-4655-90a4-6b3b8a518f98.png",
 "./assets/figma/figma-2ce8633b-e7ae-42d3-91a3-ec6c3c6d58cd.png",
 "./assets/figma/figma-33609187-4b11-437c-9986-af010003f06d.png",
 "./assets/figma/figma-4ab1f1a1-444a-464a-a590-c496d68101ba.png",
 "./assets/figma/figma-64e921c2-58f8-4b35-affe-ab5558d6f6a3.png",
 "./assets/figma/figma-64ed97d7-30a0-487a-a95c-269629642056.png",
 "./assets/figma/figma-687dce01-18d6-41da-a19e-427f529fd81f.png",
 "./assets/figma/figma-790835f3-5ac7-4b77-9a7e-0485bb3b031e.png",
 "./assets/figma/figma-826fb7d9-1c77-4d0a-8e38-59a8efe5431b.png",
]);
const optimizedImageAliases={
 "assets/bunny-default.png": "assets/figma/figma-23f06a34-faa4-40bc-8154-5f06be957d44.webp",
 "assets/chat-shade-source.png": "assets/figma/figma-09ea8681-be9b-472e-8a79-2b2b30734550.webp",
 "assets/prologue-park.png": "assets/figma/figma-64ed97d7-30a0-487a-a95c-269629642056.webp",
 "assets/kitchen.png": "assets/figma/figma-33609187-4b11-437c-9986-af010003f06d.webp",
 "assets/info-image.png": "assets/figma/figma-0364d448-fd4d-4907-b3e5-c91548006a44.webp",
 "assets/corridor.png": "assets/figma/figma-0c5346b7-4354-465d-8cd0-6bd621d61053.webp",
 "assets/mom.png": "assets/figma/figma-8bf1b13f-d0de-4d26-9342-1a8e372a0f18.webp",
 "assets/classroom-after.png": "assets/figma/figma-2ce8633b-e7ae-42d3-91a3-ec6c3c6d58cd.webp",
 "assets/bunny-no-hat.png": "assets/figma/figma-09473015-692e-437b-ac60-125159ec2727.webp",
 "assets/corridor-mobile.png": "assets/figma/figma-4ab1f1a1-444a-464a-a590-c496d68101ba.webp",
 "assets/corridor-bunny.png": "assets/figma/figma-64e921c2-58f8-4b35-affe-ab5558d6f6a3.webp",
 "assets/final.png": "assets/final-scene.webp",
 "assets/figma/figma-826fb7d9-1c77-4d0a-8e38-59a8efe5431b.png": "assets/final-scene.webp",
 "assets/classroom.png": "assets/figma/figma-2ce8633b-e7ae-42d3-91a3-ec6c3c6d58cd.webp",
 "assets/bunny-humiliated.png": "assets/figma/figma-3c85cdb7-bb5a-4daa-bbb6-5cbd81f9d143.webp",
 "assets/foyer-dark.png": "assets/figma/figma-1b62ae9a-4d0f-47b4-a962-06daa2e02491.webp",
 "assets/bunny-runs.png": "assets/figma/figma-09ea8681-be9b-472e-8a79-2b2b30734550.webp"
};
function optimizedScreenHTML(html){
 return html.replace(/(src|srcset)="([^"]+\.png)"/g,(original,attribute,path)=>{
  const alias=optimizedImageAliases[path.slice(2)];
  if(alias)return attribute+'="./'+alias+'"';
  return optimizedImages.has(path)?attribute+'="'+path.replace(/\.png$/,'.webp')+'"':original;
 });
}

// ИИ №25: официальные ссылки, предоставленные автором 29.10.2026.
const socialLinks=Object.freeze({
 vk:'https://m.vk.ru/sreda_acceptance?utm_source=taplink&utm_medium=referral&utm_campaign=sreda_media&utm_content=vk_group',
 telegram:'https://t.me/sreda_acceptance',
 tiktok:'https://www.tiktok.com/@sreda_acceptance?_r=1&_t=ZS-9AmbAOqvCA1',
 dzen:'https://dzen.ru/sreda_acceptance?utm_source=taplink&utm_medium=referral&utm_campaign=sreda_media&utm_content=dzen',
 vc:'https://vc.ru/id5658605?utm_source=taplink&utm_medium=referral&utm_campaign=sreda_media&utm_content=vc_ru',
 taplink:'https://sredaacceptance.taplink.ws/'
});
function exactDevice(){
 const forced=location.pathname.endsWith('/verify.html')?new URLSearchParams(location.search).get('device'):null;
 if(['desktop','tablet','mobile'].includes(forced))return forced;
 if(typeof compactNovelLayout==='function'?compactNovelLayout():window.innerWidth<768)return 'mobile';
 return window.innerWidth<=1280?'tablet':'desktop';
}
function exactScreenHTML(template,screenName,device){
 const markup=optimizedScreenHTML(template.html).replace(
  /(<div[^>]*data-name="Logo"[^>]*>\s*<div[^>]*>)<img[^>]*>/g,
  (_,slot)=>slot+brandLogoImage()
 );
 if(screenName==='silent'&&device==='mobile')
  return markup.replace(/src="[^"]*figma-7ddb8bd5-7a20-4a76-aec9-d9e2553f615b\.(?:png|webp)"/,
   'src="./assets/final-1302-mobile.webp"');
 if(screenName==='silent'&&device==='tablet')
  return markup.replace('src="./assets/final-scene.webp"','src="./assets/final-1302-tablet.webp"');
 if(screenName!=='menu')return markup;
 const oldCover=device==='desktop'?'menu-background.webp':device==='tablet'
  ?'figma/figma-1e57ecd1-dfc0-46fb-85b6-398b81add6db.webp'
  :'figma/figma-790835f3-5ac7-4b77-9a7e-0485bb3b031e.webp';
 return markup.replace('src="./assets/'+oldCover+'"',
  'src="./assets/menu-cover-'+(device==='mobile'?'mobile':'wide')+'.webp"');
}
function storyScreenVariants(name){
 return figmaScreens[name]||(name==='B'?figmaScreens.tellMom:name==='C'?figmaScreens.choice:null);
}
function renderExactScreen(){
 const verification=location.pathname.endsWith('/verify.html')?new URLSearchParams(location.search):null;
 const requested=verification?.get('screen');
 const screenName=requested&&storyScreenVariants(requested)?requested:state.modal&&figmaScreens[state.modal]?state.modal:state.scene;
 const variants=storyScreenVariants(screenName);if(!variants){document.querySelector('#app').classList.remove('figma-mode');return false;}
 const device=exactDevice();
 if(exactScene!==screenName){exactScene=screenName;}
 exactVariant=device;
 const steps=device==='mobile'?variants.mobile:[variants[device]];
 exactStep=Math.min(verification?Number(verification.get('step')||0):state.modal&&figmaScreens[state.modal]?0:Number(state.frameStep||0),steps.length-1);
 const template=steps[exactStep];
 const host=document.querySelector('#app');host.classList.add('figma-mode');
 host.innerHTML=`<div class="figma-viewport" data-exact-screen="${screenName}" data-exact-device="${device}" data-exact-step="${exactStep}" style="--frame-width:${template.width};--frame-height:${template.height};--frame-ratio:${template.width/template.height}"><div class="figma-canvas" style="--frame-unit:calc(100cqw / ${template.width})">${exactScreenHTML(template,screenName,device)}</div></div>`;
 if(state.modal&&!figmaScreens[state.modal]){host.insertAdjacentHTML('beforeend',modalHTML());const background=host.querySelector('.figma-viewport');background.inert=true;background.setAttribute('aria-hidden','true');}
 applyExactGeometry(host,template.id);
 const textRuns=device==='mobile'&&typeof mobileTextRuns!=='undefined'?mobileTextRuns:device==='tablet'&&typeof tabletTextRuns!=='undefined'?tabletTextRuns:null;
 if(textRuns){
  for(const node of host.querySelectorAll('[data-geometry-id]')){
   const runs=textRuns[node.dataset.geometryId];if(!runs)continue;
   node.innerHTML=runs.map(run=>`<span style="font-weight:${run.weight}">${escapeHTML(run.text)}</span>`).join('');
   node.style.whiteSpace='pre-line';
  }
 }

 if(['B','C'].includes(screenName)){
  const scene=scenes[screenName];
  const bubble=host.querySelector('[data-name="Bubble"] p');
  const chapter=host.querySelector('[data-name="Chapter"] p');
  if(bubble)bubble.textContent=scene.text;
  if(chapter)chapter.textContent=scene.chapter;
  host.querySelectorAll('[data-name="Choice"]').forEach((choice,index)=>{
   const option=scene.options[index];
   if(option)choice.querySelector('p').textContent=option.label;
   else choice.remove();
  });
  if(screenName==='C'){
   const character=host.querySelector('[data-name^="char/bunny"] img');
   if(character)character.src='./assets/'+scene.character;
   if(device==='mobile')host.querySelectorAll('[data-name="aura/kroli-glow"]').forEach(layer=>layer.remove());
  }
 }
 if(device==='mobile'&&screenName==='materials'){
  const sharedHeader=document.createElement('template');
  sharedHeader.innerHTML=exactScreenHTML(figmaScreens.prologue.mobile[0],'prologue',device);
  const bar=sharedHeader.content.querySelector('[data-name="Bar"]');
  const currentBar=host.querySelector('[data-name="Bar"]');
  if(bar&&currentBar)currentBar.replaceWith(bar);
 }
 matchDocumentIntro(host,screenName,device);
 updateStoryCopy(host,screenName);
 if(screenName==='prologue')host.querySelectorAll('[data-name="Chapter"]').forEach(chapter=>chapter.remove());
 wireExactScreen(host,screenName);
 updateSupportLabels(host);
 if(screenName==='openEnding')updateOpenEnding(host);
 wireStoryGuidance(host,screenName);
 applyFluidConstraints(host,template,device,screenName);
 if(device==='mobile'&&(screenName==='chat'||screenName==='choice'))useMobileSceneBackdrop(host,screenName,exactStep);
 const contextNote=addSceneContext(host,screenName);
 if(typeof applyAdaptiveUX==='function')applyAdaptiveUX(host,screenName,contextNote);
 applyStoryTypography(host);
 if(typeof animateNovelFrame==='function'){
  const reveal=animateNovelFrame(host,screenName,contextNote);
  if(!verification&&!state.modal&&screenName===state.scene){
   const action=exactStep<steps.length-1?'frame-next':scenes[screenName]?.next&&!scenes[screenName].options?'next':null;
   if(action)queueStoryAdvance(host.querySelector('.figma-viewport'),reveal,action);
  }
 }
 document.title='среда · '+(scenes[state.scene]?.chapter||screenName);
 return true;
}
const sceneContext=new Map([
 ['chat','В общий чат класса выкладывают фото Банни без его согласия.'],
 ['momUnknown','Мама знает об одном случае. Банни ещё не рассказал ей, что это повторяется.'],
 ['adults','После сообщения Банни рассказывает маме, что происходит в школе.']
]);
function formatStoryContext(description){
 // Связываем служебные слова со следующим словом и два последних слова предложения.
 return description
  .replace(/([.!?…][»”)]*[ \u00a0\u202f]+[«„“(]?\p{L}[\p{L}\p{M}-]*)[ \u00a0\u202f]+(?=[«„“(]?\p{L})/gu,(match,start)=>start+'\u00a0'.repeat(match.length-start.length))
  .replace(/([^\s]+)[ \t\u00a0\u202f]+(?=[^\s]+[.!?…](?:[»”)]|$|\s))/gu,'$1\u00a0')
  .replace(/(?<![\p{L}\p{N}])((?:без|для|под|над|при|про|через|из-за|из-под|из|до|за|от|по|на|не|ни|обо|об|о|со|с|ко|к|во|в|у|а|и|но|да|или|либо|что|чтоб|чтобы|как|если|то|хотя|чем|тоже|где|куда|откуда|когда|пока|поскольку|зато|однако|словно|будто|между|около|вокруг|возле|вместо|кроме|после|перед|против|среди|сквозь|ради|вдоль|мимо|вне|—|–))[ \u00a0\u202f]+(?=\S)/giu,(match,word)=>word+'\u00a0'.repeat(match.length-word.length));
}
function applyStoryTypography(root){
 const selector='p,h1,h2,h3,li,button,a,.speaker,.scene-context,.prologue-note-message,.story-dialogue .bubble>span:not(.speaker)';
 for(const block of root.querySelectorAll(selector)){
  if(block.parentElement?.closest(selector))continue;
  const walker=document.createTreeWalker(block,NodeFilter.SHOW_TEXT|NodeFilter.SHOW_ELEMENT);
  let nodes=[];
  const formatLine=()=>{
   const text=nodes.map(node=>node.nodeValue).join('');
   const formatted=formatStoryContext(text);
   let offset=0;
   for(const node of nodes){
    const end=offset+node.nodeValue.length;
    node.nodeValue=formatted.slice(offset,end);
    offset=end;
   }
   nodes=[];
  };
  while(walker.nextNode()){
   const node=walker.currentNode;
   if(node.nodeName==='BR')formatLine();
   else if(node.nodeType===Node.TEXT_NODE)nodes.push(node);
  }
  formatLine();
 }
}
function addSceneContext(host,screenName){
 const description=scenes[screenName]?.context||sceneContext.get(screenName);
 if(!description)return;
 const surface=host.querySelector('.figma-viewport');
 const root=surface.querySelector('.figma-canvas').firstElementChild;
 const bubble=root.querySelector('[data-name="Bubble"]');
 const mobileChat=screenName==='chat'&&surface.dataset.exactDevice==='mobile';
 if(mobileChat&&exactStep!==0)return;
 if(!bubble&&screenName!=='silent'&&!mobileChat)return;
 const note=document.createElement('div');
 note.className='scene-context '+(bubble?'dialogue-context':'final-scene-context');
 note.textContent=formatStoryContext(description);
 const mobile=surface.dataset.exactDevice==='mobile';
 root.append(note);
 if(mobile)note.classList.add('mobile-scene-context');
 else if(bubble){
  const bounds=bubble.getBoundingClientRect();
  const frame=root.getBoundingClientRect();
  note.style.left=(bounds.left-frame.left)+'px';
  note.style.top=(bounds.top-frame.top)+'px';
  note.style.width=bounds.width+'px';
 }
 return note;
}
async function dismissSceneContext(note){
 note.classList.add('dialogue-context-exit');
 if(!matchMedia('(prefers-reduced-motion: reduce)').matches)
  await new Promise(resolve=>setTimeout(resolve,sceneFadeTime));
 note.remove();
}

function useMobileSceneBackdrop(host,scene,step){
 const root=host.querySelector('.figma-canvas').firstElementChild;
 let asset;
 let description='';
 if(scene==='choice'){
  root.querySelectorAll(':scope > [data-name^="bg/"],:scope > [data-name^="aura/"],:scope > [data-name^="char/bunny"]').forEach(layer=>layer.remove());
  asset=step===0?'mobile-bunny-wide.webp':'mobile-bunny-close.webp';
 }else if(step===0){
  root.querySelectorAll(':scope > img,:scope > [data-node-id="1499:6013"],:scope > [data-node-id="1499:6036"],:scope > [data-node-id="1401:1548"],:scope > [data-name^="aura/"]').forEach(layer=>layer.remove());
  asset='mobile-kroli.webp';
 }else if(step===1){
  for(const layer of [...root.children]){
   if(layer.dataset.name!=='Bar')layer.remove();
  }
  asset='mobile-chat.webp';
  description='8 Б, общий чат. Одноклассники выложили фото Банни и смеются. Банни просит удалить фото: «Я не разрешал». Сообщение прочитали 24 человека. Ответов нет.';
 }else{
  root.querySelectorAll(':scope > [data-name="image 188"],:scope > [data-node-id="1499:6019"]').forEach(layer=>layer.remove());
  asset='chat-mobile-3.webp';
 }
 const background=document.createElement('img');
 background.className='mobile-chat-backdrop';
 background.src='./assets/'+asset;
 background.alt=description;
 root.prepend(background);
}
function normalizedLabel(node){return node.textContent.replace(/\s+/g,' ').trim().toLowerCase();}
function applyExactGeometry(host,rootId){
 if(typeof figmaGeometry==='undefined')return;
 const subset={};
 for(const [id,g] of Object.entries(figmaGeometry)){let cursor=id;while(figmaGeometry[cursor]&&cursor!==rootId)cursor=figmaGeometry[cursor].p;if(cursor===rootId)subset[id]=g;}
 const nodes=[...host.querySelectorAll('[data-node-id]')],mapped=new Map();
 for(const node of nodes){const id=node.dataset.nodeId;if(subset[id])mapped.set(node,id);else{const matches=Object.keys(subset).filter(key=>key.endsWith(';'+id));if(matches.length===1)mapped.set(node,matches[0]);}}
 for(const node of [...nodes].reverse()){if(mapped.has(node))continue;const child=[...node.querySelectorAll('[data-node-id]')].find(n=>mapped.has(n));if(child){const parentId=subset[mapped.get(child)]?.p;if(subset[parentId])mapped.set(node,parentId);}}
 // Смешанные текстовые слои Figma иногда приходят без data-node-id.
 // Сохраняем их собственные координаты, когда соседняя иконка вынесена из Flexbox.
 for(const [parent,parentId] of [...mapped]){
  const used=new Set(mapped.values());
  const texts=Object.keys(subset).filter(id=>subset[id].p===parentId&&subset[id].t==='TEXT'&&!used.has(id));
  const candidates=[...parent.children].filter(n=>!n.hasAttribute('data-node-id')&&n.textContent.trim()&&!n.querySelector('[data-node-id]'));
  if(texts.length&&texts.length===candidates.length)for(let i=0;i<texts.length;i++){mapped.set(candidates[i],texts[i]);candidates[i].dataset.nodeId=texts[i];nodes.push(candidates[i]);}
 }
 const unit=n=>'calc('+n+' * var(--frame-unit))';
 for(const node of nodes){const g=subset[mapped.get(node)];if(!g)continue;for(const tag of node.querySelectorAll('[data-name="Tag"]')){if(!tag.hasAttribute('data-node-id')&&g.n==='Tag'){tag.style.width=unit(g.w);tag.style.height=unit(g.h);tag.style.flex='none';}}}
 for(const node of nodes){const id=mapped.get(node),g=subset[id];if(!g)continue;node.dataset.geometryId=id;if(id===rootId||["1318:4314","1396:1237","1413:1627"].includes(id))continue;
  let parent=node.parentElement;while(parent&&parent!==host&&!mapped.has(parent))parent=parent.parentElement;
  if(!parent||mapped.get(parent)!==g.p)continue;
  const parentStyle=getComputedStyle(parent);
  const flows=/flex|grid/.test(parentStyle.display)&&node.style.position!=='absolute';
  const stretches=node.style.inset&&!node.style.width&&!node.style.height;
  const autoHeight=getComputedStyle(node).display.includes('flex')&&!node.style.height;
  const bx=parseFloat(parentStyle.borderLeftWidth)||0,by=parseFloat(parentStyle.borderTopWidth)||0;
  if(!flows&&!stretches)Object.assign(node.style,{position:'absolute',inset:'auto',left:'calc('+g.x+' * var(--frame-unit) - '+bx+'px)',top:'calc('+g.y+' * var(--frame-unit) - '+by+'px)',width:unit(g.w),height:unit(g.h),minWidth:'0',minHeight:'0',maxWidth:'none',flex:'none',margin:'0',translate:'none'});
  if(autoHeight&&!stretches)node.style.height='auto';
  if(!flows&&!stretches&&node.offsetParent&&node.offsetParent!==parent&&!mapped.has(node.offsetParent)){const effective=getComputedStyle(node.offsetParent);node.style.left='calc('+g.x+' * var(--frame-unit) - '+(parseFloat(effective.borderLeftWidth)||0)+'px)';node.style.top='calc('+g.y+' * var(--frame-unit) - '+(parseFloat(effective.borderTopWidth)||0)+'px)';}
  if(g.r){node.style.rotate=(-g.r)+'deg';node.style.transformOrigin='0 0';for(const el of node.querySelectorAll('[style]')){if(el.hasAttribute('data-node-id'))continue;let p=el.parentElement;while(p&&p!==node&&!p.hasAttribute('data-node-id'))p=p.parentElement;if(p===node&&el.style.rotate)el.style.rotate='none';}}
  if(g.t==='TEXT'&&g.fs){node.style.fontSize=unit(g.fs);if(g.lh?.unit==='PIXELS')node.style.lineHeight=unit(g.lh.value);if(g.ls?.unit==='PERCENT')node.style.letterSpacing=unit(g.fs*g.ls.value/100);}
  // Экспорт растровой заливки MENU уже обрезан исходным фреймом 2560×1440.
  if(id==='1323:4240'){node.style.left='0';node.style.top='0';node.style.width='100%';node.style.height='100%';}
 }
}
function assignExactAction(node,action,label){node.dataset.exactAction=action;node.setAttribute('role','button');node.setAttribute('tabindex','0');node.setAttribute('aria-label',label||normalizedLabel(node));node.style.cursor='pointer';}
function wireHelpPhones(canvas){
 const walker=document.createTreeWalker(canvas,NodeFilter.SHOW_TEXT);
 const matches=[];
 for(let node=walker.nextNode();node;node=walker.nextNode()){
  const match=node.textContent.match(/звони\s+112|детский телефон доверия\s+8\s*800\s*2000[-–‑]122/i);
  if(match&&!node.parentElement.closest('a'))matches.push({node,match});
 }
 for(const {node,match} of matches){
  const link=document.createElement('a');
  link.href=match[0].includes('112')?'tel:112':'tel:88002000122';
  link.textContent=match[0];
  const text=node.textContent;
  node.replaceWith(text.slice(0,match.index),link,text.slice(match.index+match[0].length));
 }
}

function wireLinkStyles(canvas){
 for(const link of canvas.querySelectorAll('a[href]')){
  const button=link.closest('[data-name="Button"],[data-component="Button"]');
  if(button&&button!==link){
   const wrapper=document.createElement('a');
   for(const attribute of button.attributes)wrapper.setAttribute(attribute.name,attribute.value);
   wrapper.href=link.href;
   if(link.target){wrapper.target=link.target;wrapper.rel='noopener noreferrer';}
   const label=document.createElement('span');
   label.style.cssText=link.style.cssText;
   label.textContent=link.textContent;
   link.replaceWith(label);
   wrapper.append(...button.childNodes);
   button.replaceWith(wrapper);
   wrapper.classList.add('button-link');
  }else if(button)link.classList.add('button-link');
  else if(!link.classList.contains('social-link'))link.classList.add('text-link');
 }
 for(const link of canvas.querySelectorAll('p[data-exact-action]'))link.classList.add('text-link');
}

function updateSupportLabels(host){
 const labels=new Map([
  ['нужна поддержка','получить помощь'],
  ['поддержать','поддержать проект']
 ]);
 const replacement=value=>labels.get(value.replace(/\s+/g,' ').trim().toLowerCase());
 for(const element of host.querySelectorAll('p,h1,h2,h3,span,button,a')){
  const label=replacement(element.textContent);
  if(label&&!element.querySelector('p,button,a,[data-exact-action]'))element.textContent=label;
 }
 const walker=document.createTreeWalker(host,NodeFilter.SHOW_TEXT);
 while(walker.nextNode()){
  const node=walker.currentNode;
  const label=replacement(node.nodeValue);
  if(label)node.nodeValue=label;
 }
 for(const element of host.querySelectorAll('[aria-label]')){
  const label=replacement(element.getAttribute('aria-label'));
  if(label)element.setAttribute('aria-label',label);
 }
}
function matchDocumentIntro(host,name,device){
 const sourceIds={
  materials:['1318:2780','1320:2568'],
  resources:['1368:872'],
  supportPage:['1318:2752','1318:2753']
 }[name];
 if(!sourceIds||device==='desktop')return;
 const desktop=document.createElement('template');
 desktop.innerHTML=figmaScreens[name].desktop.html;
 const sourceText=id=>desktop.content.querySelector(`[data-node-id="${id}"]`).textContent.trim();
 if(device==='tablet'){
  if(name==='materials')host.querySelector('[data-node-id="1396:1497"]').textContent=sourceText(sourceIds[1]);
  return;
 }
 const root=host.querySelector('.figma-canvas').firstElementChild;
 const header=document.createElement('header');
 header.className='mobile-document-intro';
 const title=document.createElement('h1');
 title.textContent=sourceText(sourceIds[0]).toLowerCase();
 header.append(title);
 if(name==='resources'){
  const desktopHeader=desktop.content.querySelector('[data-name="header"]');
  const paragraphs=[...desktopHeader.querySelectorAll('p')].filter(p=>!p.closest('[data-name="Button"]'));
  const description=document.createElement('p');
  const copy=paragraphs.slice(1).map(p=>p.textContent.trim()).join(' ');
  const split=copy.match(/^(.*?)[ \u00a0]+(гарантировать(?=\s).*)$/su);
  if(window.innerWidth<768&&split)description.append(split[1],document.createElement('br'),split[2]);
  else description.textContent=copy;
  header.append(description);
 }else{
  const description=document.createElement('p');
  description.textContent=sourceText(sourceIds[1]);
  header.append(description);
 }
 if(name==='materials'){
  const start=document.createElement('button');
  start.type='button';
  start.className='action mobile-document-start';
  start.dataset.exactAction='start';
  start.textContent='начать историю';
  header.append(start);
 }
 root.prepend(header);
}

function updateOpenEnding(host){
 const panel=host.querySelector('[data-name="panel"]');
 if(!panel)return;
 for(const line of panel.querySelectorAll('p')){
  const label=normalizedLabel(line);
  if(label==='сегодня рассказать')line.textContent='Сегодня помочь';
  else if(label.startsWith('закончилась эта версия'))line.textContent=formatStoryContext('Банни остался один на один с проблемой.');
  else if(label.startsWith('у банни, как')){
   const sentence=formatStoryContext('Но у него, как и у тебя, есть возможность попросить о помощи.');
   const emphasis=document.createElement('strong');
   const start=sentence.indexOf('попросить');
   emphasis.textContent=sentence.slice(start);
   line.replaceChildren(sentence.slice(0,start),emphasis);
  }
 }
 const button=panel.querySelector('[data-exact-action="help"]');
 if(button){
  const label=button.querySelector('p');
  if(label)label.textContent='получить поддержку';
  button.setAttribute('aria-label','получить поддержку');
 }
}
function updateStoryCopy(host,name){
 const chapter=host.querySelector('[data-name="Chapter"] p');
 if(chapter)chapter.textContent=chapter.textContent.replace(/^день\s+[123]\s*·\s*/iu,'');
 else if(scenes[name]&&!['resources','supportPage'].includes(name)){
  const bar=host.querySelector('[data-name="Bar"]');
  if(bar){
   const badge=document.createElement('span');
   badge.dataset.name='Chapter';
   badge.className='scene-title-mobile';
   badge.textContent=scenes[name].chapter;
   bar.append(badge);
  }
 }
 const replacement=new Map([
  ['closeness','можно его позвать?'],
  ['A','я подойду к ним.'],
  ['adults','завтра вместе поговорим']
 ]).get(name);
 if(!replacement)return;
 for(const line of host.querySelectorAll('[data-name="Bubble"] p')){
  const label=normalizedLabel(line);
  if(name==="closeness"&&label==="давай пока здесь посидим."){
   line.textContent=formatStoryContext(scenes.closeness.reply);
   line.closest('[data-name="Bubble"]').classList.add('closeness-player-reply');
  }
  if(!label.startsWith(replacement))continue;
  line.textContent=name==='adults'?'Сегодня вместе поговорим со школой.':scenes[name].text;
  if(name==='closeness')line.closest('[data-name="Bubble"]').classList.add('closeness-response');
 }
}
function linkMaterialCard(card,read,url,accessibleLabel){
 const article=document.createElement('a');
 for(const attribute of card.attributes)article.setAttribute(attribute.name,attribute.value);
 article.classList.add('material-card-link');
 article.href=url;
 article.target=read.target;
 article.rel=read.rel;
 article.setAttribute('aria-label',accessibleLabel);
 const cue=document.createElement('span');
 for(const attribute of read.attributes){
  if(!['href','target','rel'].includes(attribute.name))cue.setAttribute(attribute.name,attribute.value);
 }
 cue.append(...read.childNodes);
 cue.querySelectorAll('[role="link"],[tabindex]').forEach(node=>{
  node.removeAttribute('role');
  node.removeAttribute('tabindex');
 });
 read.replaceWith(cue);
 article.append(...card.childNodes);
 card.replaceWith(article);
}
function replaceResourcePetition(canvas){
 const card=canvas.querySelector('[data-name="panel/petition-mini"]');
 if(!card)return;
 card.dataset.name='note/emergency-card';
 card.classList.add('resource-emergency-card');
 const badge=card.querySelector('[data-name="Tag"] p');
 if(badge)badge.textContent='срочно';
 const [heading,description]=card.querySelectorAll(':scope > p');
 heading.textContent='Если опасно прямо сейчас';
 const emergency=document.createElement('a');
 emergency.href='tel:112';
 emergency.textContent='звони 112';
 const trust=document.createElement('a');
 trust.href='tel:88002000122';
 trust.textContent='8 800 2000‑122';
 description.replaceChildren(emergency,'. Поговорить анонимно и бесплатно можно по детскому телефону доверия ',trust,'.');
 card.querySelectorAll(':scope > [data-name="Button"],:scope > .button-link').forEach(button=>button.remove());
}
function wireResourceCards(canvas){
 const cards=[...canvas.querySelectorAll('[data-name="Card"]')];
 const byTag=new Map(cards.map(card=>[normalizedLabel(card.querySelector('[data-name="Tag"]')),card]));
 const materials=byTag.get('материалы');
 const witness=byTag.get('если ты видишь травлю');
 if(materials&&witness){
  const slot=document.createComment('');
  materials.replaceWith(slot);
  witness.replaceWith(materials);
  slot.replaceWith(witness);
 }
 for(const [tag,card] of byTag){
  const read=card.querySelector('a[href]');
  if(read){
   const [, ,url,label]=articles[tag==='для взрослых'?5:2];
   linkMaterialCard(card,read,url,label+': '+card.firstElementChild.textContent.trim());
   continue;
  }
  const action=tag==='материалы'?'materials':'help';
  const cue=card.querySelector(':scope > p:nth-child(2)');
  cue.classList.add('text-link');
  card.classList.add('material-card-link');
  assignExactAction(card,action,cue.textContent.trim());
 }
}
function wireExactScreen(host,name){
 const canvas=host.querySelector('.figma-canvas');
 // ИИ: макет показывает hover как пример; в покое все ответы нейтральные. Запись №20.
 const choicePointer=canvas.querySelector('[data-name="Choice"] [data-name="Pointer"] img')?.getAttribute('src')
  ||'./assets/figma/figma-026dbd30-a32a-477e-a354-2b64743ad0c7.svg';
 for(const choice of canvas.querySelectorAll('[data-name="Choice"]')){
  choice.querySelectorAll('[data-name="Pointer"]').forEach(n=>n.remove());
  choice.classList.add('dialogue-choice');
  const label=choice.querySelector('p');
  if(label)Object.assign(label.style,{position:'relative',inset:'auto',width:'auto',height:'auto',maxWidth:'none',flex:'1 1 0',minWidth:'0'});
  const pointer=document.createElement('img');
  pointer.className='choice-hover-pointer';pointer.alt='';pointer.src=choicePointer;
  choice.prepend(pointer);
 }

 const socialDevice=exactVariant==='mobile'&&window.innerWidth>=768?'tablet':exactVariant;
 for(const social of canvas.querySelectorAll('[data-social-network]')){
  const net=social.dataset.socialNetwork;
  social.innerHTML=`<a class="social-link" href="${socialLinks[net]}" target="_blank" rel="noopener noreferrer" aria-label="${net} — среда"><img alt="" src="./assets/social-${net}-${socialDevice}.svg${socialDevice==='mobile'?'?v=2':''}" width="119" height="120"></a>`;
 }
 if(name==='menu'){
  if(exactVariant==='tablet'){
   const panel=canvas.querySelector('[data-component="Menu"]');
   const socials=canvas.querySelector('[data-name="menu-aside"] [data-name="socials"]');
   if(panel&&socials)panel.append(socials);
  }
  const actions={'начать историю':'restart','материалы':'materials','нужна поддержка':'help','поддержать':'supportPage'};
  for(const node of canvas.querySelectorAll('[data-component="MenuItem"],[data-name^="menu/"]')){
   const label=normalizedLabel(node);
   const action=actions[label];
   if(!action){node.remove();continue;}
   node.classList.add('menu-item');
   assignExactAction(node,action,label);
  }
 }

 for(const node of canvas.querySelectorAll('[data-name],[data-component="Button"],[data-component="MenuItem"],[data-component="IconButton"]')){
  const kind=node.dataset.name||node.dataset.component,text=normalizedLabel(node);
  if(kind==='Help')assignExactAction(node,'help');
  else if(kind==='Materials')assignExactAction(node,'materials');
  else if(kind==='Menu')assignExactAction(node,'menu','меню');
  else if(kind==='Logo'){node.classList.add('brand-logo');assignExactAction(node,'restart','среда — в начало');}
  else if(kind==='Choice'){
   const choiceNodes=[...canvas.querySelectorAll('[data-name="Choice"]')];assignExactAction(node,'choice:'+choiceNodes.indexOf(node));
  }
  else if(kind==='IconButton'&&name==='menu')assignExactAction(node,'close','закрыть');
  else if(kind==='Button'||kind==='MenuItem'||kind==='button/next'||kind==='button/close'){
   let action=kind==='button/close'?'close':kind==='button/next'?'exact-next':text.includes('отмотать')?'start':text.includes('начать истор')?'restart':text.includes('материал')?'materials':text.includes('нужна поддержка')?'help':text==='поддержать'?'supportPage':text.includes('о проекте')?'about':text.includes('пройти заново')?'restart':text==='дальше'?'exact-next':null;
   if(action)assignExactAction(node,action);
  }
 }
 if(name==='chat')for(const line of canvas.querySelectorAll('[data-name="phone"] p')){
  if(!normalizedLabel(line).startsWith('удалите,'))continue;
  line.replaceChildren('Удалите, пожалуйста.',document.createElement('br'),'Я не\u00a0разрешал.');
  line.classList.add('chat-message-outgoing');
 }
 // ИИ №27: публичные ссылки петиции и фонда, предоставленные автором.
 for(const link of canvas.querySelectorAll('a[href="https://vk.cc/d3c6Ry"],a[href*="change.org/p/"]')){
  link.href='https://www.change.org/p/'+encodeURIComponent('среда-солидарности-классные-часы-против-травли-2a6a5db9-5c1e-4364-8212-c7b6de7e8e19');
  link.target='_blank';link.rel='noopener noreferrer';
 }
 if(name==='supportPage')for(const link of canvas.querySelectorAll('a[href*="verimtebe.ru"]')){
  link.href='https://verimtebe.ru/';link.target='_blank';link.rel='noopener noreferrer';
 }
 // Ссылки на канал проекта вне карточек материалов.
 for(const link of canvas.querySelectorAll('a[href*="dzen.ru/sreda_acceptance"]')){
  link.href=socialLinks.dzen;link.target='_blank';link.rel='noopener noreferrer';
 }
 if(name==='info'){
  canvas.querySelector('[data-node-id="1318:2620"],[data-node-id="1396:1326"],[data-node-id="1401:1503"]')?.remove();
  const read=canvas.querySelector('a[href*="dzen.ru"]');
  if(read){
   read.href=articles[0][2];
   read.target='_blank';
   read.rel='noopener noreferrer';
  }
 }
 if(name==='help')wireHelpPhones(canvas);
 wireLinkStyles(canvas);
 if(name==='resources'){
  wireResourceCards(canvas);
  replaceResourcePetition(canvas);
 }
 if(name==='materials'){
  for(const [index,card] of [...canvas.querySelectorAll('[data-name="Card"]')].entries()){
   const read=card.querySelector('a[href]');
   const material=articles[index];
   if(!read||!material)continue;
   const [heading,description,url,label]=material;
   if(label==='смотреть'){
    const [firstLine,secondLine]=card.firstElementChild?.querySelectorAll('p')??[];
    const split=heading.indexOf(' и ');
    if(firstLine&&secondLine&&split>=0){
     firstLine.textContent=heading.slice(0,split);
     secondLine.textContent=heading.slice(split+1);
    }else if(firstLine){
     firstLine.textContent=heading;
    }
    const summary=[...card.children].find(node=>node.tagName==='P');
    if(summary)summary.textContent=description;
    (read.querySelector('p')||read).textContent=label;
   }
   linkMaterialCard(card,read,url,label+': '+heading);
  }
 }
 if(name==='menu'){
  const close=canvas.querySelector('[data-node-id="1500:1875"]');if(close)assignExactAction(close,'close','закрыть');
 }
}
function wireStoryGuidance(host,screenName){
 const canvas=host.querySelector('.figma-canvas');
 const hint=canvas.querySelector('[data-node-id="1324:803"],[data-node-id="1389:802"],[data-node-id="1389:804"]');

 if(screenName==='prologue'){
  const entry=canvas.querySelector('[data-exact-action="start"]');
  if(entry){
   const label=entry.querySelector('p');
   if(label)label.textContent='начать историю';
   entry.setAttribute('aria-label','начать историю');
  }
  const notice=canvas.querySelector('[data-node-id="1500:1902"],[data-node-id="1500:1905"],[data-node-id="1500:1908"]');
  if(notice&&canvas.closest('.figma-viewport').dataset.exactDevice!=='mobile'){
   notice.classList.add('prologue-note');
   notice.innerHTML=prologueNoticeMarkup;
   showPrologueNotice(notice);
  }
 }
 hint?.parentElement.remove();
 canvas.querySelectorAll('[data-exact-action="exact-next"],[data-name="Bubble"] [data-name="Arrow"]').forEach(node=>node.remove());
}
function exactHasNextFrame(){
 return !state.modal&&exactDevice()==='mobile'&&Number(state.frameStep||0)<(storyScreenVariants(state.scene)?.mobile.length??1)-1;
}
document.addEventListener('click',e=>{
 const host=e.target.closest('.figma-viewport');if(!host)return;
 if(e.target.closest('a[href]'))return;
 if(host.hasAttribute('data-scene-loading')&&!e.target.closest('[data-name="Bar"]'))return;
 const control=e.target.closest('[data-exact-action]');
 if(control){e.preventDefault();e.stopImmediatePropagation();handleAction(control.dataset.exactAction);return;}
},{capture:true});
document.addEventListener('keydown',e=>{
 if(!document.querySelector('.figma-viewport'))return;
 if((e.key==='Enter'||e.key===' ')&&e.target.matches('[data-exact-action]')){e.preventDefault();e.stopImmediatePropagation();e.target.click();return;}
},{capture:true});
window.addEventListener('resize',()=>{if(typeof state!=='undefined'&&exactDevice()!==exactVariant)render();});
