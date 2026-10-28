/* ИИ: вывод точных HTML-композиций Figma, без React в браузере. Запись №19. */
"use strict";
let exactStep=0,exactScene=null,exactVariant=null;
const exactActions={};
function exactDevice(){const forced=location.pathname.endsWith('/verify.html')?new URLSearchParams(location.search).get('device'):null;return ['desktop','tablet','mobile'].includes(forced)?forced:window.innerWidth<768?'mobile':window.innerWidth<=1400?'tablet':'desktop';}
function renderExactScreen(){
 const verification=location.pathname.endsWith('/verify.html')?new URLSearchParams(location.search):null;
 const requested=verification?.get('screen');
 const screenName=requested&&figmaScreens[requested]?requested:state.modal&&figmaScreens[state.modal]?state.modal:state.scene;
 const variants=figmaScreens[screenName];if(!variants){document.querySelector('#app').classList.remove('figma-mode');return false;}
 const device=exactDevice();
 if(exactScene!==screenName){exactScene=screenName;}
 exactVariant=device;
 const steps=device==='mobile'?variants.mobile:[variants[device]];
 exactStep=Math.min(verification?Number(verification.get('step')||0):state.modal&&figmaScreens[state.modal]?0:Number(state.frameStep||0),steps.length-1);
 const template=steps[exactStep];
 const host=document.querySelector('#app');host.classList.add('figma-mode');
 host.innerHTML=`<div class="figma-viewport" data-exact-screen="${screenName}" data-exact-device="${device}" data-exact-step="${exactStep}" style="--frame-width:${template.width};--frame-height:${template.height};--frame-ratio:${template.width/template.height}"><div class="figma-canvas" style="--frame-unit:calc(100cqw / ${template.width})">${template.html}</div></div>`;
 if(state.modal&&!figmaScreens[state.modal])host.insertAdjacentHTML('beforeend',modalHTML());
 applyExactGeometry(host,template.id);
 wireExactScreen(host,screenName);
 document.title='среда · '+(scenes[state.scene]?.chapter||screenName);
 return true;
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
 for(const node of nodes){const id=mapped.get(node),g=subset[id];if(!g||id===rootId)continue;
  let parent=node.parentElement;while(parent&&parent!==host&&!mapped.has(parent))parent=parent.parentElement;
  if(!parent||mapped.get(parent)!==g.p)continue;
  const parentStyle=getComputedStyle(parent),bx=parseFloat(parentStyle.borderLeftWidth)||0,by=parseFloat(parentStyle.borderTopWidth)||0;
  Object.assign(node.style,{position:'absolute',inset:'auto',left:'calc('+g.x+' * var(--frame-unit) - '+bx+'px)',top:'calc('+g.y+' * var(--frame-unit) - '+by+'px)',width:unit(g.w),height:unit(g.h),minWidth:'0',minHeight:'0',maxWidth:'none',flex:'none',margin:'0',translate:'none'});
  if(node.offsetParent&&node.offsetParent!==parent&&!mapped.has(node.offsetParent)){const effective=getComputedStyle(node.offsetParent);node.style.left='calc('+g.x+' * var(--frame-unit) - '+(parseFloat(effective.borderLeftWidth)||0)+'px)';node.style.top='calc('+g.y+' * var(--frame-unit) - '+(parseFloat(effective.borderTopWidth)||0)+'px)';}
  if(g.r){node.style.rotate=(-g.r)+'deg';node.style.transformOrigin='0 0';for(const el of node.querySelectorAll('[style]')){if(el.hasAttribute('data-node-id'))continue;let p=el.parentElement;while(p&&p!==node&&!p.hasAttribute('data-node-id'))p=p.parentElement;if(p===node&&el.style.rotate)el.style.rotate='none';}}
  if(g.t==='TEXT'&&g.fs){node.style.fontSize=unit(g.fs);if(g.lh?.unit==='PIXELS')node.style.lineHeight=unit(g.lh.value);if(g.ls?.unit==='PERCENT')node.style.letterSpacing=unit(g.fs*g.ls.value/100);}
  // Экспорт растровой заливки MENU уже обрезан исходным фреймом 2560×1440.
  if(id==='1323:4240'){node.style.left='0';node.style.top='0';node.style.width='100%';node.style.height='100%';}
 }
}
function assignExactAction(node,action,label){node.dataset.exactAction=action;node.setAttribute('role','button');node.setAttribute('tabindex','0');node.setAttribute('aria-label',label||normalizedLabel(node));node.style.cursor='pointer';}
function wireExactScreen(host,name){
 const canvas=host.querySelector('.figma-canvas');
 for(const social of canvas.querySelectorAll('[data-social-network]')){const net=social.dataset.socialNetwork;social.innerHTML=`<img alt="${net}" src="./assets/social-${net}.png" style="position:absolute;left:0;top:0;width:106.25%;height:107.142857%;max-width:none">`;social.style.background='none';social.style.borderWidth='0';social.style.filter='none';}
 for(const node of canvas.querySelectorAll('[data-name],[data-component="Button"],[data-component="MenuItem"],[data-component="IconButton"]')){
  const kind=node.dataset.name||node.dataset.component,text=normalizedLabel(node);
  if(kind==='Help')assignExactAction(node,'help');
  else if(kind==='Materials')assignExactAction(node,'materials');
  else if(kind==='Menu')assignExactAction(node,'menu','меню');
  else if(kind==='Logo')assignExactAction(node,'restart','среда — в начало');
  else if(kind==='Choice'){
   const choiceNodes=[...canvas.querySelectorAll('[data-name="Choice"]')];assignExactAction(node,'choice:'+choiceNodes.indexOf(node));
  }
  else if(kind==='IconButton'&&name==='menu')assignExactAction(node,'close','закрыть');
  else if(kind==='Button'||kind==='MenuItem'||kind==='button/next'||kind==='button/close'){
   let action=kind==='button/close'?'close':kind==='button/next'?'exact-next':text.includes('отмотать')||text.includes('начать истор')?'start':text.includes('материал')?'materials':text.includes('нужна поддержка')?'help':text==='поддержать'?'supportPage':text.includes('о проекте')?'about':text.includes('пройти заново')?'restart':text==='дальше'?'exact-next':null;
   if(action)assignExactAction(node,action);
  }
 }
 // В MENU пункты могут быть компонентами с именем item; используем их видимый текст.
 if(name==='menu')for(const node of canvas.querySelectorAll('[data-name="item"],[data-name^="menu/"],[data-menu-label]')){const t=normalizedLabel(node);const action=t.includes('начать')?'start':t.includes('материал')?'materials':t.includes('нужна поддержка')?'help':t.includes('поддержать')?'supportPage':t.includes('о проекте')?'about':null;if(action)assignExactAction(node,action);}
 if(name==='menu'){
  for(const node of canvas.querySelectorAll('[id^="node-1379_"]')){const t=normalizedLabel(node);const action=t.includes('начать')?'start':t.includes('материал')?'materials':t.includes('нужна поддержка')?'help':t.includes('поддержать')?'supportPage':t.includes('о проекте')?'about':null;if(action)assignExactAction(node,action);}
  const close=canvas.querySelector('[data-node-id="1500:1875"]');if(close)assignExactAction(close,'close','закрыть');
 }
}
function exactAdvance(){
 const key=state.modal&&figmaScreens[state.modal]?state.modal:state.scene;
 const variants=figmaScreens[key];
 if(variants&&exactDevice()==='mobile'&&exactStep<variants.mobile.length-1){handleAction('frame-next');return true;}
 if(state.modal)return false;
 if(state.scene==='prologue'){handleAction('start');return true;}
 if(scenes[state.scene]?.options)return false;
 handleAction('next');return true;
}
function exactHasNextFrame(){return !state.modal&&exactDevice()==='mobile'&&figmaScreens[state.scene]&&Number(state.frameStep||0)<figmaScreens[state.scene].mobile.length-1;}
document.addEventListener('click',e=>{
 const host=e.target.closest('.figma-viewport');if(!host)return;
 const control=e.target.closest('[data-exact-action]');
 if(control){e.preventDefault();e.stopImmediatePropagation();if(control.dataset.exactAction==='exact-next')exactAdvance();else handleAction(control.dataset.exactAction);return;}
 if(!state.modal&&(exactHasNextFrame()||['dialogue','chat','momchat'].includes(scenes[state.scene]?.kind))){e.preventDefault();e.stopImmediatePropagation();exactAdvance();}
},{capture:true});
document.addEventListener('keydown',e=>{
 if(!document.querySelector('.figma-viewport'))return;
 if((e.key==='Enter'||e.key===' ')&&e.target.matches('[data-exact-action]')){e.preventDefault();e.stopImmediatePropagation();e.target.click();return;}
 if(e.code==='Space'&&!state.modal&&!e.target.closest('input,textarea,button,a')){e.preventDefault();e.stopImmediatePropagation();if(['dialogue','chat','momchat'].includes(scenes[state.scene]?.kind))exactAdvance();}
},{capture:true});
window.addEventListener('resize',()=>{if(typeof state!=='undefined'&&exactDevice()!==exactVariant)render();});
