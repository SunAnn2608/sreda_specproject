// ИИ: 12 полных прохождений через настоящий обработчик действий. Запись №23.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
function runtime(){
 const element={innerHTML:'',dataset:{},insertAdjacentHTML(){},focus(){}};
 const c=vm.createContext({document:{querySelector:s=>s==='.figma-viewport'?null:element,addEventListener(){}},MutationObserver:class{observe(){}},matchMedia:()=>({matches:false}),Element:class{}});
 vm.runInContext(fs.readFileSync('story.js','utf8')+'\n'+fs.readFileSync('app.js','utf8'),c);
 return code=>vm.runInContext(code,c);
}
let routes=0;
for(let first=0;first<3;first++)for(let second=0;second<2;second++)for(let last=0;last<2;last++){
 const run=runtime();run('handleAction("start")');let picks=0,seen=[];
 for(let steps=0;steps<80&&run('state.scene')!=='resources';steps++){
  const id=run('state.scene');seen.push(id);
  const before=run('JSON.stringify([state.scene,state.answers,state.branch,state.second,state.frameStep])');
  for(const modal of ['menu','materials','help','article:0','article:1','article:2','article:3','article:4','article:5']){run('handleAction('+JSON.stringify(modal)+')');run('handleAction("close")');}
  assert.equal(run('JSON.stringify([state.scene,state.answers,state.branch,state.second,state.frameStep])'),before,'Справка изменила прохождение');
  if(run('!!scenes[state.scene].options')){const index=[first,second,last][picks++];run('handleAction("choice:'+index+'")');}
  else if(id==='openEnding')run('handleAction("resources")');
  else run('handleAction("next")');
 }
 assert.equal(run('state.scene'),'resources');assert.equal(picks,3);assert.equal(run('state.answers.length'),3);
 assert.equal(run('state.branch'),['A','B','C'][first]);assert.equal(run('state.second'),second+1);
 assert(seen.includes(['anger','closeness','withdrawal'][first]));assert(seen.includes(['A','B','C'][first]+(second+1)));
 assert(seen.includes(last===0?'silent':'openEnding'));
 assert.equal(seen.includes('friendHelp'),first===1&&last===0);
 run('handleAction("restart")');assert.equal(run('state.scene'),'prologue');assert.equal(run('state.answers.length'),0);assert.equal(run('navigationPast.length'),0);
 routes++;
}
console.log(routes+' полных маршрутов: 3 выбора, оба финала, справка не меняет ответы, повтор сбрасывает прохождение.');
