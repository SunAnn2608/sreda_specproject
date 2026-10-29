const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
for(let a=0;a<3;a++)for(let b=0;b<2;b++)for(let c=0;c<2;c++){
 const el={innerHTML:'',dataset:{},insertAdjacentHTML(){},focus(){}};
 const ctx=vm.createContext({document:{querySelector:s=>s==='.figma-viewport'?null:el,addEventListener(){}},MutationObserver:class{observe(){}},matchMedia:()=>({matches:false}),Element:class{}});
 vm.runInContext(['screen-templates.js','story.js','app.js'].map(p=>fs.readFileSync(p,'utf8')).join('\n'),ctx);
 const run=s=>vm.runInContext(s,ctx);run('handleAction("start")');let picks=0;
 for(let n=0;n<60&&run('state.scene')!=='resources';n++){
  assert(run('!!figmaScreens[state.scene] || !!scenes[state.scene].options'),'Descriptive placeholder displayed');
  if(run('!!scenes[state.scene].options'))run('handleAction("choice:'+([a,b,c][picks++])+'")');
  else if(run('state.scene')==='openEnding')run('handleAction("resources")');
  else run('handleAction("next")');
 }
 assert.equal(run('state.scene'),'resources');assert.equal(picks,3);assert.equal(run('state.answers.length'),3);
}
console.log('12 Figma-only routes: no descriptive placeholder screens, all 3 choices retained.');
