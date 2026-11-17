const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const preference={matches:true,addEventListener(){}};
const context=vm.createContext({matchMedia:()=>preference,document:{addEventListener(){}},setTimeout,clearTimeout});
vm.runInContext(fs.readFileSync('novel-motion.js','utf8'),context);
function layer(){
 const attributes=new Set();
 return {attributes,setAttribute:k=>attributes.add(k),removeAttribute:k=>attributes.delete(k),querySelectorAll:()=>[],matches:()=>false};
}
(async()=>{
 const surface=layer(),subject=layer(),phone=layer(),dialogue=layer();
 surface.isConnected=true;
 function pendingImage(){
  const image={...layer(),matches:selector=>selector==='img',complete:false,addEventListener:(event,cb)=>{if(event==='load')image.load=cb;},removeEventListener(){}};
  return image;
 }
 const background=pendingImage(),character=pendingImage(),phoneImage=pendingImage();
 subject.querySelectorAll=()=>[character];phone.querySelectorAll=()=>[phoneImage];
 const settle=()=>new Promise(resolve=>setImmediate(resolve));
 vm.runInContext('revealSceneLayers',context)(surface,[subject],[dialogue],[background],[phone]);
 assert.ok(subject.attributes.has('data-scene-wait'));
 assert.ok(dialogue.inert);
 background.load();await settle();
 assert.ok(subject.inert);
 character.load();await settle();
 assert.equal(subject.inert,false);
 assert.ok(phone.inert);
 assert.ok(dialogue.inert);
 phoneImage.load();await settle();
 assert.equal(phone.inert,false);
 assert.equal(dialogue.attributes.size,0);
 assert.equal(dialogue.inert,false);
 assert.equal(surface.attributes.size,0);
 const messageScene=layer(),reply=layer(),next=layer();
 messageScene.isConnected=true;
 let release;
 context.setTimeout=(callback,delay)=>{assert.equal(delay,2000);release=callback;};
 const completion=vm.runInContext('revealSceneLayers',context)(messageScene,[],[reply],[],[],undefined,[next],false,2000);
 await settle();
 assert.equal(reply.inert,false);
 assert.equal(next.inert,true);
 assert.ok(next.attributes.has('data-scene-wait'));
 release();
 await completion;
 assert.equal(next.inert,false);
 console.log('Кнопка сцены с мамой появляется через две секунды после реплики.');
 console.log('Сцена раскрывается после фона, затем доступны реплики.');
})().catch(error=>{console.error(error);process.exitCode=1;});
