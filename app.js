/* ИИ: прототип сценарного движка и обработчиков интерфейса. Запись №1 в README.
   ВАЖНО: сцены после первого выбора являются техническим черновиком, а не утверждённым сценарием. */
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
 choice:{chapter:"день 2 · что скажешь?",kind:"choice",speaker:"банни",text:"Опять чувствую себя ничтожеством. И все смотрят.",prompt:"что ты скажешь?",options:[
  {label:"Так оставлять нельзя.",next:"anger"},
  {label:"Давай пока здесь посидим.",next:"closeness"},
  {label:"Я не знаю. Мне надо идти.",next:"withdrawal"}
 ]},
 anger:{chapter:"после разговора",kind:"dialogue",speaker:"история",text:"В этой ветке будет реакция на первый выбор. Текст и графика уточняются по Figma.",next:"info"},
 closeness:{chapter:"после разговора",kind:"dialogue",speaker:"история",text:"В этой ветке будет сцена сближения. Текст и графика уточняются по Figma.",next:"info"},
 withdrawal:{chapter:"после разговора",kind:"dialogue",speaker:"история",text:"В этой ветке будет сцена замыкания. Текст и графика уточняются по Figma.",next:"info"},
 info:{chapter:"передышка",kind:"info",speaker:"важно",text:"Травля — не то же самое, что разовый конфликт. Если ситуация повторяется и есть неравенство сил, важно искать поддержку.",next:"choice2"},
 choice2:{chapter:"выбор 2",kind:"choice",speaker:"история",text:"Что делать дальше?",prompt:"как поступишь?",options:[
  {label:"Найти взрослого, которому можно доверять.",next:"support"},
  {label:"Попробовать поговорить с другом.",next:"support"}
 ]},
 support:{chapter:"продолжение",kind:"dialogue",speaker:"история",text:"Продолжение этой ветки будет перенесено из утверждённого user flow. Пока здесь техническая остановка.",next:"end"},
 end:{chapter:"продолжение следует",kind:"end",speaker:"среда",text:"Это первый технический прототип. Полная история: 3 выбора, 12 маршрутов и 2 финала. Они ещё не реализованы."}
};
let state={scene:"prologue",history:[],answers:[],modal:null};
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
  const options=s.options?`<div class="prompt">${escapeHTML(s.prompt)}</div><div class="choices">${s.options.map((o,i)=>btn(o.label,"choice:"+i,"choice")).join("")}</div>`:`<div class="actions">${btn(s.kind==="end"?"начать сначала":"продолжить",s.kind==="end"?"restart":"next","action")}</div>`;
  inner=`<div class="dialogue-layout">${dialogue}${options}</div>`;
 }
 if(state.scene==="dialogue")inner=`<div class="story-dialogue"><button class="panel bubble" data-action="next"><span class="speaker">банни</span><span>${escapeHTML(s.text)}</span><img class="bubble-tail" src="./assets/tail.svg" alt=""><img class="bubble-arrow" src="./assets/arrow.svg" alt=""></button><button class="story-hint" data-action="next">тапни, чтобы читать дальше</button></div>`;
 app.innerHTML=`<div class="stage ${state.scene==="dialogue"?"story-screen":""}" data-scene="${escapeHTML(s.kind)}">${header(s)}<div class="scene-art" aria-hidden="true">${s.art?`<picture>${state.scene==="dialogue"?'<source media="(max-width:767px)" srcset="./assets/corridor-mobile.png">':""}<img src="./assets/${s.art}" alt=""></picture>`:""}</div>${s.character?`<img class="story-character" src="./assets/${s.character}" alt="">`:""}<main class="main" id="main" tabindex="-1">${inner}</main><footer class="footer-note">среда · технический прототип · визуальные ассеты и полный сценарий в работе</footer></div>${modalHTML()}`;
 document.querySelector('.logo').innerHTML='<img src="./assets/logo.svg" alt="среда">';
 document.title=`среда · ${s.chapter}`;
}
function modalHTML(){if(!state.modal)return "";const help=state.modal==="help";return `<div class="modal-backdrop" data-overlay="true"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button class="pill modal-close" data-action="close" aria-label="Закрыть">×</button><h2 id="modal-title">${help?"нужна поддержка":"материалы и навигация"}</h2>${help?'<p>Если тебе небезопасно, обратись к взрослому, которому доверяешь, или в местную службу экстренной помощи. Ты не обязан(а) справляться с травлей в одиночку.</p><p>Контакты специализированных служб добавим после проверки актуальности.</p>':'<p>Здесь появятся проверенные материалы о травле, поддержке и действиях свидетеля.</p><p><a href="'+figma+'" target="_blank" rel="noopener noreferrer">Макеты проекта в Figma</a></p>'}<div class="actions">${btn("к истории","close","action secondary")}${btn("начать сначала","restart","action")}</div></section></div>`}
function go(id){if(!scenes[id])return;state.history.push(state.scene);state.scene=id;state.modal=null;render();document.querySelector("#main")?.focus?.()}
function handleAction(action){
 if(action==="start"){go("dialogue");return}
 if(action==="next"){go(scenes[state.scene].next||"end");return}
 if(action==="restart"){state={scene:"prologue",history:[],answers:[],modal:null};render();return}
 if(action==="help"||action==="materials"||action==="menu"){state.modal=action==="help"?"help":"materials";render();document.querySelector(".modal-close")?.focus();return}
 if(action==="close"){state.modal=null;render();return}
 if(action.startsWith("choice:")){const i=Number(action.split(":")[1]);const option=scenes[state.scene].options?.[i];if(option){state.answers.push({scene:state.scene,index:i});go(option.next)}}
}
document.addEventListener("click",e=>{const el=e.target.closest("[data-action]");if(el){handleAction(el.dataset.action);return}if(e.target.matches("[data-overlay]"))handleAction("close")});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&state.modal)handleAction("close")});
document.addEventListener("keydown",e=>{if(e.code==="Space"&&!state.modal&&state.scene==="dialogue"&&e.target===document.body){e.preventDefault();handleAction("next")}});
render();
