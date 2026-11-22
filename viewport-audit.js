/* Точные размеры окна для проверки адаптивов через verify.html. */
const auditParams=new URLSearchParams(location.search);
const auditWidth=Number(auditParams.get('width'));
const auditHeight=Number(auditParams.get('height'));
if(auditWidth>0&&auditHeight>0&&auditWidth<=1920&&auditHeight<=1440){
 const frame=document.createElement('iframe');
 frame.title='Проверка размера окна';
 frame.style.cssText=`display:block;border:0;width:${auditWidth}px;height:${auditHeight}px`;
 const report=document.createElement('pre');
 report.textContent='Проверка…';
 document.body.replaceChildren(frame,report);
 const device=auditParams.get('device')||(auditWidth<768||auditWidth<=1280&&auditHeight>auditWidth?'mobile':auditWidth<=1280?'tablet':'desktop');
 const scenesOnly=auditParams.get('audit')==='scenes';
 if(auditParams.get('view')==='single'){
  const params=new URLSearchParams({screen:auditParams.get('screen')||'prologue',step:auditParams.get('step')||'0',release:auditParams.get('release')||'compact'});
  frame.src='./verify.html?'+params;report.remove();
 }
 const screens=Object.entries({...figmaScreens,B:storyScreenVariants("B"),C:storyScreenVariants("C")}).filter(([name])=>!scenesOnly||!['resources','materials','help','supportPage'].includes(name));
 const results=[];
 let checked=0;
 async function auditViewport(){
  for(const [name,variants] of screens){
   const count=device==='mobile'?variants.mobile.length:1;
   for(let step=0;step<count;step++){
    const params=new URLSearchParams({screen:name,step:String(step),release:auditParams.get('release')||'fit'});
    if(auditParams.has('device'))params.set('device',device);
    await new Promise(resolve=>{
     frame.addEventListener('load',resolve,{once:true});
     frame.src='./verify.html?'+params;
    });
    const view=frame.contentWindow;
    const document=frame.contentDocument;
    await document.fonts.ready;
    const viewport=document.querySelector('.figma-viewport');
    const canvas=viewport?.querySelector('.figma-canvas');
    if(!canvas){
     results.push({name,step,error:'Композиция не загрузилась'});
     continue;
    }
    checked++;
    const bounds=viewport.getBoundingClientRect();
    const outside=[...canvas.querySelectorAll('[data-exact-action],a[href],p')].flatMap(node=>{
     if(view.getComputedStyle(node).display==='none'||view.getComputedStyle(node).visibility==='hidden'&&!node.closest('[data-scene-wait]'))return [];
     const range=document.createRange();
     range.selectNodeContents(node);
     const rect=node.matches('p')?range.getBoundingClientRect():node.getBoundingClientRect();
     if(!rect.width||!rect.height||rect.left>=-1&&rect.top>=-1&&rect.right<=view.innerWidth+1&&rect.bottom<=view.innerHeight+1)return [];
     return [{label:node.textContent.trim().slice(0,55),bounds:[rect.left,rect.top,rect.right,rect.bottom].map(Math.round)}];
    });
    const scroll=view.getComputedStyle(viewport).overflowY;
    if(bounds.width!==auditWidth||bounds.height!==auditHeight||viewport.dataset.exactDevice!==device||outside.length||!['clip','hidden'].includes(scroll))results.push({name,step,viewport:[bounds.width,bounds.height],scroll,outside});
   }
  }
  report.textContent=JSON.stringify({width:auditWidth,height:auditHeight,device,checked,issues:results},null,2);
 }
 if(auditParams.get('view')!=='single')void auditViewport();
}
