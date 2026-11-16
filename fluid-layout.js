/* Сюжетные сцены вписываются в окно, мобильные страницы сохраняют масштаб по ширине. */
function applyFluidConstraints(host,template,device,screenName){
 const viewport=host.querySelector('.figma-viewport'),canvas=host.querySelector('.figma-canvas');
 const root=canvas.firstElementChild;
 const unit=value=>`calc(${value} * var(--frame-unit))`;
 const isDocument=['resources','materials','help','supportPage'].includes(screenName);
 viewport.dataset.layout=isDocument?'document':'scene';
 const widthUnit=`calc(100cqw / ${template.width})`;
 const scrollable=device==='mobile'&&isDocument;
 canvas.style.setProperty('--frame-unit',scrollable?widthUnit:
  `min(${widthUnit},calc(100dvh / ${template.height}))`);
 const darkBackground=root.querySelector('[data-name="bg/foyer-dark"] > img, :scope > img[src*="figma-13378e02"]');
 if(darkBackground)darkBackground.classList.add('dark-scene-background');
 const geometry=typeof figmaGeometry==='undefined'?{}:figmaGeometry;
 const primaryBackground=[...root.children].find(node=>geometry[node.dataset.geometryId||node.dataset.nodeId]?.n.startsWith('bg/'));
 for(const node of root.children){
  const g=geometry[node.dataset.geometryId||node.dataset.nodeId];
  if(!g)continue;
  if(node===primaryBackground||g.n==='vignette'){
   Object.assign(node.style,{inset:'0',width:'100%',height:'100%',translate:'none'});
   if(g.n==='vignette'){node.style.backgroundSize='100% 100%';node.style.backgroundPosition='center';}
   continue;
  }
  if(g.n==='Bar'){
   Object.assign(node.style,{left:'0',top:'0',width:'100%'});
   continue;
  }
  if(getComputedStyle(node).position!=='absolute')continue;
  if(screenName==='prologue'&&device==='mobile'&&g.n==='panel'){
   node.style.left=`calc(50% - ${unit(g.w/2)})`;
  }else{
   node.style.left=`calc(50% + ${unit(g.x-template.width/2)})`;
  }
  node.style.top=`calc(50% + ${unit(g.y-template.height/2)})`;
  node.style.bottom='auto';
 }
}
