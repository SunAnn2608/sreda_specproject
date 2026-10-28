// ИИ: проверка навигации и изменения ветки. Запись №13.
const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const listeners={};const element={innerHTML:'',dataset:{},insertAdjacentHTML(){},focus(){}};
const context=vm.createContext({document:{querySelector:()=>element,addEventListener:(name,fn)=>(listeners[name]??=[]).push(fn)},MutationObserver:class{observe(){}},matchMedia:()=>({matches:true}),Element:class{}});
vm.runInContext(fs.readFileSync('story.js','utf8')+'\n'+fs.readFileSync('app.js','utf8'),context);
const run=code=>vm.runInContext(code,context);
run('handleAction("start");handleAction("next");handleAction("next")');
assert.equal(run('state.chatStep'),1);
run('navigateBack()');assert.equal(run('state.chatStep||0'),0);
run('navigateForward()');assert.equal(run('state.chatStep'),1);
run('go("choice");handleAction("choice:0")');assert.equal(run('state.branch'),'A');
run('navigateBack()');assert.equal(run('state.scene'),'choice');assert.equal(run('state.branch'),null);
run('handleAction("choice:1")');assert.equal(run('state.branch'),'B');assert.equal(run('navigationFuture.length'),0);
run('handleAction("menu");navigateBack()');assert.equal(run('state.scene'),'closeness');
console.log('Назад/вперёд, подэкран, смена ветки и блокировка меню: OK');
