const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const preference={matches:true,addEventListener(){}};
const context=vm.createContext({matchMedia:()=>preference,document:{addEventListener(){}},setTimeout,clearTimeout});
vm.runInContext(fs.readFileSync('novel-motion.js','utf8'),context);
function layer(){
 const attributes=new Set();
 return {attributes,setAttribute:k=>attributes.add(k),removeAttribute:k=>attributes.delete(k),querySelectorAll:()=>[],matches:()=>false};
}
(async()=>{
 const surface=layer(),subject=layer(),dialogue=layer();
 surface.isConnected=true;
 let loadBackground;
 const background={complete:false,addEventListener:(event,cb)=>{if(event==='load')loadBackground=cb;},removeEventListener(){}};
 vm.runInContext('revealSceneLayers',context)(surface,[subject],[dialogue],[background]);
 assert.ok(subject.attributes.has('data-scene-wait'));
 assert.ok(dialogue.inert);
 loadBackground();
 await new Promise(resolve=>setImmediate(resolve));
 assert.equal(subject.attributes.size,0);
 assert.equal(dialogue.attributes.size,0);
 assert.equal(dialogue.inert,false);
 assert.equal(surface.attributes.size,0);
 console.log('Сцена раскрывается после фона, затем доступны реплики.');
})().catch(error=>{console.error(error);process.exitCode=1;});
