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
 vm.runInContext('revealSceneLayers',context)(surface,[background,subject,phone,dialogue].map(item=>({layers:[item]})));
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
 context.setTimeout=(callback,delay)=>{assert.equal(delay,2500);release=callback;};
 const completion=vm.runInContext('revealSceneLayers',context)(messageScene,[{layers:[reply],wait:2500},{layers:[next]}]);
 await settle();
 assert.equal(reply.inert,false);
 assert.equal(next.inert,true);
 assert.ok(next.attributes.has('data-scene-wait'));
 release();
 await completion;
 assert.equal(next.inert,false);
 console.log('Сцена раскрывается после фона, затем доступны реплики.');
 const backdrop=layer(),mother=layer(),player=layer(),button=layer(),note=layer(),panel=layer();
 panel.matches=selector=>selector.includes('[data-name="panel"]');
 const root={
  firstElementChild:null,children:[panel,button],
  querySelector:()=>backdrop,
  querySelectorAll(selector){
   if(selector.startsWith('[data-exact-action'))return [button];
   if(selector.startsWith('[data-name="Bubble"]'))return [mother,player];
   return [];
  }
 };
 const surfaceFrame={querySelector:()=>({firstElementChild:root})};
 const host={querySelector:()=>surfaceFrame,hasAttribute:()=>false};
 context.state={};
 context.scenes={info:{kind:'info'},adults:{kind:'dialogue'}};
 let phases;
 context.revealSceneLayers=(_,steps)=>{phases=steps.filter(step=>step.layers.length);};
 const animate=vm.runInContext('animateNovelFrame',context);
 animate(host,'info');
 assert.equal(phases.length,2);
 assert.equal(phases[1].layers[0],panel);
 assert.equal(phases[1].wait,undefined);
 animate(host,'adults',note);
 assert.ok(phases[0].layers.includes(note));
 assert.equal(phases[0].wait,5000);
 assert.ok(phases[1].layers.includes(mother));
 assert.equal(phases[1].wait,520);
 assert.equal(phases[2].layers[0],player);
 assert.equal(phases[2].wait,2500);
 assert.equal(phases[3].layers[0],button);

 const queue=vm.runInContext('queueStoryAdvance',context);
 const frame={isConnected:true,querySelectorAll:()=>[]};
 const actions=[];
 context.handleAction=action=>actions.push(action);
 let timer;
 let reveal;
 context.setTimeout=(callback,delay)=>{assert.equal(delay,5000);timer=callback;};
 const ready=new Promise(resolve=>{reveal=resolve;});
 const queued=queue(frame,ready,'frame-next');
 assert.equal(timer,undefined);
 reveal();
 await queued;
 context.document.hidden=true;
 timer();
 assert.deepEqual(actions,[]);
 context.document.hidden=false;
 timer();
 assert.deepEqual(actions,['frame-next']);
 await queue(frame,undefined,'next');
 frame.isConnected=false;
 timer();
 assert.deepEqual(actions,['frame-next']);
})().catch(error=>{console.error(error);process.exitCode=1;});
