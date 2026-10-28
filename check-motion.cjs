// ИИ: reduced-motion, отмена переходов и отсутствие повторов при resize. Запись №23.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
let count=0,cancelled=0,preferenceChanged;
const preference={matches:false,addEventListener(type,fn){preferenceChanged=fn;}};
const node={animate(){count++;return {cancel(){cancelled++;},addEventListener(){}};}};
const host={querySelector(selector){return selector==='.modal'?null:node;},querySelectorAll(){return [node];}};
const c=vm.createContext({matchMedia:()=>preference,document:{addEventListener(){}},state:{scene:'dialogue',modal:null,frameStep:0},host});
vm.runInContext(fs.readFileSync('novel-motion.js','utf8'),c);
const run=s=>vm.runInContext(s,c);
run('animateNovelFrame(host,"dialogue")');assert.equal(count,3);
run('animateNovelFrame(host,"dialogue")');assert.equal(count,3,'Resize повторил анимацию');
run('state.scene="chat";animateNovelFrame(host,"chat")');assert.equal(count,6);assert.equal(cancelled,3);
preference.matches=true;preferenceChanged();assert.equal(cancelled,6);
run('state.frameStep=1;animateNovelFrame(host,"chat")');assert.equal(count,6,'При reduced-motion появились анимации');
run('pressNovelControl({closest:()=>host.querySelector("button")})');assert.equal(count,6);
console.log('Анимации: reduced-motion отключает и отменяет движение, resize не повторяет вход.');
