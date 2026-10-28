/* ИИ: интерфейс новеллы. Журнал и незавершённые расхождения — в README и FIGMA-AUDIT.md. */
"use strict";
// ИИ: оригинальные ассеты пролога из Figma. Запись №2 в README.
const originalRenderHook = new MutationObserver(()=>{const stage=document.querySelector('[data-scene="prologue"]');if(!stage)return;const art=stage.querySelector('.scene-art');if(!art.querySelector('img'))art.innerHTML='<img src="./assets/prologue-park.png" alt="">';const logo=stage.querySelector('.logo');if(!logo.querySelector('img'))logo.innerHTML='<img src="./assets/logo.svg" alt="среда">';const panel=stage.querySelector('.panel');if(!panel.querySelector('.prologue-doodle'))panel.insertAdjacentHTML('afterbegin','<img class="prologue-doodle" src="./assets/doodle.svg" alt="среда">');});
originalRenderHook.observe(document.querySelector('#app'),{childList:true,subtree:true});
const app=document.querySelector("#app");
const figma="https://www.figma.com/design/Dh9CU2f4N47sWnTVCKPgVH/среда?node-id=400-688";
const scenes={
 prologue:{chapter:"пролог",kind:"prologue"},
 // ИИ: экран 02-01 по Desktop/Tablet/Mobile Figma. Запись №4 в README.
 dialogue:{chapter:"день 1 · коридор",kind:"dialogue",speaker:"банни",text:"Ты сделал алгебру? Я опять ничего не понял в этой теме.",next:"chat",art:"corridor.png",character:"bunny-default.png"},
 chat:{chapter:"день 1 · общий чат",kind:"chat",speaker:"банни",text:"Я просил удалить. Никто не ответил.",next:"choice",art:"corridor-bunny.png"},
 choice:{chapter:"день 2 · что скажешь?",kind:"choice",speaker:"банни",art:"corridor.png",character:"bunny-humiliated.png",text:"Опять чувствую себя ничтожеством. И все смотрят.",prompt:"что ты скажешь?",options:[
  {label:"Так оставлять нельзя.",next:"anger"},
  {label:"Давай пока здесь посидим.",next:"closeness"},
  {label:"Я не знаю. Мне надо идти.",next:"withdrawal"}
 ]},
};
Object.assign(scenes,storyRoutes);
scenes.chat.next="afterChat";
let state={scene:"prologue",history:[],answers:[],modal:null,branch:null,second:null};
const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const btn=(label,action,cls="")=>`<button type="button" class="${cls}" data-action="${action}">${escapeHTML(label)}</button>`;
const header=(s)=>`<header class="topbar"><a href="#prologue" class="logo" aria-label="среда — в начало">среда</a><span class="pill chapter">${escapeHTML(s.chapter)}</span><nav class="header-actions" aria-label="Главное меню">${btn("нужна поддержка","help","pill help")}${btn("материалы","materials","pill materials")}${btn('<span></span>','menu','pill menu-button') .replace("&lt;span&gt;&lt;/span&gt;","<span></span><span></span><span></span>")}</nav></header>`;
function render(){
 const s=scenes[state.scene]||scenes.prologue;
 let inner="";
 if(s.kind==="prologue"){
  inner=`<article class="panel stitched"><span class="tag">спецпроект о травле</span><p class="poem">Под дождем остался зайка.<br>Со скамейки слезть не мог,<br>Весь до ниточки промок.</p><div class="notice">В истории есть сцены травли. Если тебе сейчас тяжело, кнопка «нужна поддержка» всегда наверху.</div><div class="actions">${btn("отмотать время","start","action")}${btn("материалы","materials","action secondary")}</div></article>`;
 }else{
  const dialogue=`<article class="panel bubble"><span class="speaker">${escapeHTML(s.speaker||"среда")}</span><p>${escapeHTML(s.text||"")}</p></article>`;
  const options=s.options?`<div class="prompt">${escapeHTML(s.prompt)}</div><div class="choices">${s.options.map((o,i)=>btn(o.label,"choice:"+i,"choice")).join("")}</div>`:"";
  inner=`<div class="dialogue-layout">${dialogue}${options}</div>`;
 }
 if(state.scene==="dialogue")inner=`<div class="story-dialogue"><button class="panel bubble" data-action="next"><span class="speaker">банни</span><span>${escapeHTML(s.text)}</span><img class="bubble-tail" src="./assets/tail.svg" alt=""><img class="bubble-arrow" src="./assets/arrow.svg" alt=""></button><button class="story-hint" data-action="next">тапни, чтобы читать дальше</button></div>`;
 // ИИ: телефон и Кроли экрана 02-02 из Figma 1318:2561. Запись №6.
 if(state.scene==="chat")inner=`<img class="chat-aura" src="./assets/kroli-glow.svg" alt=""><img class="chat-kroli" src="./assets/kroli.png" alt="Кроли"><section class="chat-phone" aria-label="8 Б — общий чат"><h2>8 «Б» · общий чат</h2><div class="chat-messages"><p>смотрите,<br>кто опять в шапке</p><div class="chat-photo"><img src="./assets/chat-photo.png" alt="Фотография Банни, опубликованная без разрешения"></div><p>ахаха</p><p class="outgoing">Удалите, пожалуйста. Я не разрешал.</p><small>Прочитано: 24 · ответов нет</small></div></section><button class="panel bubble chat-reply" data-action="next"><span class="speaker">банни</span><span>Я просил удалить.<br>Никто не ответил.</span><img class="bubble-tail" src="./assets/tail.svg" alt=""><img class="bubble-arrow" src="./assets/arrow.svg" alt=""></button>`;
 if(s.kind==="info")inner=`<article class="panel stitched info-panel"><h1>${escapeHTML(s.title)}</h1><div class="info-content">${s.image?`<img class="info-image" src="./assets/${s.image}" alt="">`:""}<div><h2>${escapeHTML(s.text)}</h2>${s.points?`<ul>${s.points.map(p=>`<li>${escapeHTML(p)}</li>`).join("")}</ul>`:""}</div></div><div class="actions">${btn("материалы","materials","action secondary")}${btn("дальше","next","action")}</div></article>`;
 if(s.kind==="ending")inner=`<article class="panel stitched"><span class="tag">сегодня</span><h1>${escapeHTML(s.title)}</h1><p>${escapeHTML(s.text)}</p><div class="actions">${btn("отмотать время","start","action")}${btn("нужна поддержка","help","action secondary")}${btn("что дальше","next","action secondary")}</div></article>`;
 if(s.kind==="silent")inner=`<div class="silent-next">${btn("дальше","next","action")}</div>`;
 if(s.kind==="momchat")inner=`<div class="mom-message"><article class="panel bubble"><span class="speaker">банни</span><p>${escapeHTML(s.text)}</p></article><section class="chat-phone"><h2>мама</h2><div class="chat-messages"><p class="outgoing">Мам, можно поговорить? Это важно. Про школу.</p><small>печатает…</small></div></section><div class="actions">${btn("дальше","next","action")}</div></div>`;
 if(s.kind==="resources"||s.kind==="supportpage")inner=`<section class="resource-page"><h1>${escapeHTML(s.title)}</h1><div class="resource-grid">${s.kind==="resources"?[['если травят тебя','Как начать разговор и к кому обратиться','help'],['если ты видишь травлю','Как поддержать друга и не выгореть самому','materials'],['для взрослых','Если подросток рассказал вам о травле','materials'],['материалы','Шесть коротких статей: для себя, друзей и взрослых','materials']].map(([title,text,action])=>`<article class="panel"><h2>${title}</h2><p>${text}</p>${btn("открыть",action,"action secondary")}</article>`).join(""):'<article class="panel"><h2>фонд поддержки</h2><p>Напиши в фонд «Тебе поверят»</p><p>info@verimtebe.ru · t.me/tebepoveriat</p></article>'}</div><div class="actions">${btn("начать историю","start","action")}${s.next?btn("дальше","next","action secondary"):""}</div></section>`;
 if(s.other)inner=`<img class="story-other" src="./assets/${s.other}" alt="">`+inner;
 if(s.reply){
  const reply=`<article class="panel bubble player-reply"><span class="speaker">ты</span><p>${escapeHTML(s.reply)}</p><img class="bubble-arrow" src="./assets/arrow.svg" alt=""></article>`;
  inner=state.scene==="adults"?inner.replace('</div>',reply+'</div>'):inner.replace('<div class="dialogue-layout">','<div class="dialogue-layout">'+reply);
 }
 app.innerHTML=`<div class="stage ${s.kind==="dialogue"?"story-screen":""}" data-screen="${state.scene}" data-scene="${escapeHTML(s.kind)}">${header(s)}<div class="scene-art" aria-hidden="true">${s.art?`<picture>${state.scene==="dialogue"?'<source media="(max-width:767px)" srcset="./assets/corridor-mobile.png">':""}<img src="./assets/${s.art}" alt=""></picture>`:""}</div>${s.character?`<img class="story-character" src="./assets/${s.character}" alt="">`:""}<main class="main" id="main" tabindex="-1">${inner}</main></div>${modalHTML()}`;
 document.querySelector('.logo').innerHTML='<img src="./assets/logo.svg" alt="среда">';
 if(state.scene==="chat"){
  document.querySelector('.stage').dataset.chatStep=state.chatStep||0;
 }
 document.title=`среда · ${s.chapter}`;
}
// ИИ: чтение и меню поверх истории с сохранением позиции. Запись №8.
const articles=[
 ['«Мы же просто шутим»: когда это уже травля','Шутка перестаёт быть шуткой, когда смеются не все и это повторяется.'],
 ['Когда хочется ответить в общий чат','Ответ сгоряча часто только разгоняет чат. Сохрани скрины и напиши тому, кто поддержит.'],
 ['Нельзя всё время быть рядом','Поддерживать не значит спасать в одиночку. Обратись к взрослому и береги себя.'],
 ['Если разговор не получился','Неудачный разговор — не конец. Можно вернуться к нему позже или найти другого взрослого.'],
 ['«А если после разговора станет хуже?»','Обсуди со взрослым, что будет дальше, чтобы не остаться один на один с последствиями.'],
 ['Если подросток рассказал вам о травле','Выслушайте без обесценивания, сохраните доказательства и решайте вместе с подростком.']
];
function modalHTML(){
 if(!state.modal)return "";
 let title="",body="";
 if(state.modal==="help"){title="нужна поддержка";body=`<p>Как начать разговор и к кому обратиться, если тебя травят или ты видишь травлю.</p><div class="modal-cards">${[['Выбери взрослого','Родитель, классный руководитель, психолог, тренер — тот, кому доверяешь.'],['Начни с факта','«Меня снимают без разрешения и выкладывают в чат». Можно показать переписку.'],['Скажи, что нужно','Чтобы выслушали, чтобы помогли поговорить со школой, чтобы не делали без тебя.']].map(([h,p],i)=>`<article><span>шаг ${i+1}</span><h3>${h}</h3><p>${p}</p></article>`).join("")}</div>`;}
 else if(state.modal==="menu"){title="меню";body=`<nav class="menu-links" aria-label="Разделы проекта">${btn("материалы","materials","action secondary")}${btn("нужна поддержка","help","action")}${btn("поддержать","supportPage","action secondary")}${btn("о проекте","about","action secondary")}</nav>`;}
 else if(state.modal==="about"){title="о проекте";body='<p>«среда» — социальный спецпроект о травле в образовательной среде. Ты не управляешь травящей толпой. Но можешь выбрать, как быть рядом.</p><p>Три выбора, 12 маршрутов и два финала. За безопасность отвечают взрослые.</p>';}
 else if(state.modal.startsWith("article:")){const a=articles[Number(state.modal.split(":")[1])];title=a[0];body=`<p>${a[1]}</p>${btn("все материалы","materials","action secondary")}`;}
 else {title="материалы";body=`<div class="modal-cards">${articles.map(([h,p],i)=>`<article><h3>${h}</h3><p>${p}</p>${btn("читать","article:"+i,"action secondary")}</article>`).join("")}</div>`;}
 return `<div class="modal-backdrop" data-overlay="true"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button class="pill modal-close" data-action="close" aria-label="Закрыть">×</button><h2 id="modal-title">${escapeHTML(title)}</h2>${body}<div class="actions">${btn("к истории","close","action secondary")}${btn("начать сначала","restart","action")}</div></section></div>`;
}
function go(id){if(id==="branch")id=state.branch;if(id==="hard")id="hard"+state.branch+state.second;if(id==="friendOrAdults")id=state.branch==="B"?"friendHelp":"adults";if(!scenes[id])return;state.history.push(state.scene);state.scene=id;state.modal=null;render();document.querySelector("#main")?.focus?.()}
function handleAction(action){
 if(action==="start"){state.branch=null;state.second=null;state.answers=[];state.history=[];go("dialogue");return}
 if(action==="next"){if(state.scene==="chat"&&matchMedia('(max-width:767px)').matches&&(state.chatStep||0)<2){state.chatStep=(state.chatStep||0)+1;render();return}state.chatStep=0;go(scenes[state.scene].next||"resources");return}
 if(action==="restart"){state={scene:"prologue",history:[],answers:[],modal:null};render();return}
 if(action==="supportPage"){go("supportPage");return}
 if(["help","materials","menu","about"].includes(action)||action.startsWith("article:")){state.modal=action;render();document.querySelector(".modal-close")?.focus();return}
 if(action==="close"){state.modal=null;render();return}
 if(action.startsWith("choice:")){const i=Number(action.split(":")[1]);const option=scenes[state.scene].options?.[i];if(option){if(state.scene==="choice")state.branch=["A","B","C"][i];if(["A","B","C"].includes(state.scene))state.second=i+1;state.answers.push({scene:state.scene,index:i});go(option.next)}}
}
// ИИ: диалоги листаются кликом по сцене, элементы управления не листают её. Запись №9.
const canAdvanceScene=()=>!state.modal&&["dialogue","chat","momchat"].includes(scenes[state.scene].kind);
// ИИ: история навигации восстанавливает ответы и мобильный подэкран. Запись №13.
const navigationPast=[],navigationFuture=[];
const navigationSnapshot=()=>JSON.parse(JSON.stringify(state));
const navigationKey=s=>JSON.stringify([s.scene,s.chatStep||0,s.answers,s.branch,s.second]);
function navigateBack(){if(state.modal||!navigationPast.length)return;navigationFuture.push(navigationSnapshot());state=navigationPast.pop();state.modal=null;render();}
function navigateForward(){if(state.modal)return;if(navigationFuture.length){navigationPast.push(navigationSnapshot());state=navigationFuture.pop();state.modal=null;render();return;}if(canAdvanceScene())handleAction("next");}
const originalHandleAction=handleAction;
handleAction=function(action){const before=navigationSnapshot();originalHandleAction(action);if(action==="start"||action==="restart"){navigationPast.length=0;navigationFuture.length=0;return;}if(navigationKey(before)!==navigationKey(state)){navigationPast.push(before);navigationFuture.length=0;}};
const editableTarget=target=>target instanceof Element&&target.closest('input,textarea,select,[contenteditable="true"]');
document.addEventListener("keydown",e=>{if(e.repeat||e.altKey||e.ctrlKey||e.metaKey||editableTarget(e.target)||state.modal)return;if(e.key==="ArrowLeft"){e.preventDefault();navigateBack();}else if(e.key==="ArrowRight"){e.preventDefault();navigateForward();}});
function mouseNavigation(e){if(![3,4].includes(e.button)||state.modal||editableTarget(e.target))return;e.preventDefault();e.stopPropagation();if(e.type==="mouseup"){if(e.button===3)navigateBack();else navigateForward();}}
for(const eventName of ["mousedown","mouseup","auxclick"])document.addEventListener(eventName,mouseNavigation,{capture:true});
document.addEventListener("click",e=>{const el=e.target.closest("[data-action]");if(el){handleAction(el.dataset.action);return}if(e.target.matches("[data-overlay]")){handleAction("close");return}if(canAdvanceScene()&&e.target.closest(".stage")&&!e.target.closest("header,a,button,input,select,textarea"))handleAction("next")});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&state.modal)handleAction("close")});
document.addEventListener("keydown",e=>{if(e.code==="Space"&&canAdvanceScene()&&!e.target.closest("a,button,input,select,textarea")){e.preventDefault();handleAction("next")}});
render();
