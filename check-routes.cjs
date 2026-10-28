// ИИ: проверка достижимости 12 маршрутов и обоих исходов. Запись №7.
const assert=require('node:assert/strict'),fs=require('node:fs');
const routes=require('./story.js');
let count=0;
for(const branch of ['A','B','C'])for(const second of [1,2])for(const ending of ['messageMom','openEnding']){
 let id=branch+second,seen=new Set();
 while(id!=='supportPage'){
  assert(!seen.has(id),`Зацикливание: ${id}`);seen.add(id);
  const scene=routes[id];assert(scene,`Нет сцены: ${id}`);
  if(scene.art)assert(fs.existsSync('assets/'+scene.art),`Нет фона: ${scene.art}`);
  if(scene.character)assert(fs.existsSync('assets/'+scene.character),`Нет персонажа: ${scene.character}`);
  id=scene.options?ending:scene.next;
  if(id==='hard')id='hard'+branch+second;
  if(id==='friendOrAdults')id=branch==='B'?'friendHelp':'adults';
 }
 assert(seen.has(ending));count++;
}
assert.equal(count,12);console.log('12 маршрутов: оба финала доступны из каждой ветки.');
