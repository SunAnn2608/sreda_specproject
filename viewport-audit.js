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
 const device=auditParams.get('device')||(auditWidth<768?'mobile':auditWidth<=1280?'tablet':'desktop');
 const scenesOnly=auditParams.get('audit')==='scenes';
 const screens=Object.entries(figmaScreens).filter(([name])=>!scenesOnly||!['resources','materials','help','supportPage'].includes(name));
 const results=[];
 async function auditViewport(){
  for(const [name,variants] of screens){
   const count=device==='mobile'?variants.mobile.length:1;
   for(let step=0;step<count;step++){
    const params=new URLSearchParams({screen:name,step:String(step)});
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
    const bounds=viewport.getBoundingClientRect();
    const outside=[...canvas.querySelectorAll('[data-exact-action],a[href],p')].flatMap(node=>{
     if(view.getComputedStyle(node).display==='none'||view.getComputedStyle(node).visibility==='hidden'&&!node.closest('[data-scene-wait]'))return [];
     const range=document.createRange();
     range.selectNodeContents(node);
     const rect=node.matches('p')?range.getBoundingClientRect():node.getBoundingClientRect();
     if(!rect.width||!rect.height||rect.left>=-1&&rect.top>=-1&&rect.right<=view.innerWidth+1&&rect.bottom<=view.innerHeight+1)return [];
     return [{label:node.textContent.trim().slice(0,55),bounds:[rect.left,rect.top,rect.right,rect.bottom].map(Math.round)}];
    });
    if(bounds.width!==view.innerWidth||bounds.height!==view.innerHeight||outside.length)results.push({name,step,viewport:[bounds.width,bounds.height],outside});
   }
  }
  report.textContent=JSON.stringify({width:auditWidth,height:auditHeight,device,issues:results},null,2);
 }
 void auditViewport();
}
