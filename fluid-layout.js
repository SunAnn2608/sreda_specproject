/* ИИ: ограничения, поток и читаемая типографика между макетами. Запись №22. */
let fluidObserver;
function applyFluidConstraints(host,template,device,screenName){
 fluidObserver?.disconnect();
 const viewport=host.querySelector('.figma-viewport'),canvas=host.querySelector('.figma-canvas');
 const root=canvas.firstElementChild,unit=n=>`calc(${n} * var(--frame-unit))`;
 const isDocument=(device!=='mobile'?['materials','help']:['info','resources','materials','help','supportPage']).includes(screenName);
 viewport.dataset.layout=isDocument?'document':'scene';
 canvas.style.setProperty('--card-min',unit(device==='desktop'?704:device==='tablet'?352:342));
 canvas.style.setProperty('--layout-unit',`calc(100cqw / ${template.width})`);
 canvas.style.setProperty('--height-shortfall',`max(0px,calc(${template.height} * var(--frame-unit) - 100svh))`);
 const geometry=typeof figmaGeometry==='undefined'?{}:figmaGeometry;
 const children=[...root.children].map(node=>({node,g:geometry[node.dataset.geometryId||node.dataset.nodeId]})).filter(item=>item.g);
 const bar=children.find(({g})=>g.n==='Bar');
 // ИИ №28: сцены ПК вписываются по обеим осям, фон заполняет окно.
 if(device!=='mobile'&&!isDocument){
  const fitted=`min(calc(100cqw / ${template.width}),calc(100svh / ${template.height}))`;
  canvas.style.setProperty('--frame-unit',fitted);
  canvas.style.setProperty('--layout-unit',fitted);
  canvas.style.setProperty('--height-shortfall','0px');
  const background=children.find(({g})=>g.n.startsWith('bg/'))?.node;
  for(const {node,g} of children){
   if(node===background){
    Object.assign(node.style,{left:'0',top:'0',width:'100%',height:'100%'});
    if(screenName==='menu')for(const image of node.querySelectorAll('img'))image.style.objectPosition='left top';
   }else if(g.n==='Bar'){
    node.style.left='0';node.style.width='100%';
   }else{
    node.style.left=`calc(50% + ${g.x-template.width/2} * var(--frame-unit))`;
   }
  }
 }

 // ИИ №37: виньетка привязана к окну, без смещения и параллакса.
 if(screenName==='menu')for(const shade of canvas.querySelectorAll('[data-name="vignette"]')){
  Object.assign(shade.style,{position:'absolute',inset:'0',left:'0',top:'0',width:'100%',height:'100%',translate:'none',transform:'none',backgroundSize:'100% 100%',backgroundPosition:'center',pointerEvents:'none'});
 }
 const artwork=({g})=>/^(bg\/|char\/|aura\/)/.test(g.n);
 // Читаемый размер — отдельное ограничение, а не масштаб всей иллюстрации.
 for(const node of canvas.querySelectorAll('[style]')){
  const match=node.style.fontSize.match(/^calc\(([\d.]+) \* var\(--frame-unit\)\)$/);
  if(!match)continue;
  const size=Number(match[1]);if(!size)continue;
  const floor=device==='mobile'?Math.min(size,size>=20?18:size>=18?16:14):Math.min(size,size>=32?18:14);
  const ceiling=device==='mobile'?size*1.2:size;
  const line=node.style.lineHeight.match(/^calc\(([\d.]+) \* var\(--frame-unit\)\)$/);
  const value=`clamp(${floor}px,${unit(size)},${ceiling}px)`;
  node.style.fontSize=value;
  if(line)node.style.lineHeight=`calc(${value} * ${Number(line[1])/size})`;
 }
 // Фон заполняет поле; внутри него изображение сохраняет пропорции через cover.
 for(const {node,g} of children.filter(artwork)){
  if(!(device!=='mobile'&&!isDocument)&&g.n.startsWith('bg/')&&g.h>=template.height*.95){
   node.style.height=`calc(100% + ${g.h-template.height} * var(--frame-unit))`;
  }
  if(device==='mobile'&&/^(char\/|aura\/)/.test(g.n)){
   node.style.left=`calc(50% + ${g.x-template.width/2} * var(--art-unit))`;
   node.style.width=`calc(${g.w} * var(--art-unit))`;
   node.style.height=`calc(${g.h} * var(--art-unit))`;
   node.style.top=`${g.y/template.height*100}%`;
  }
 }
 if(isDocument&&device==='mobile'){
  const content=children.filter(item=>!artwork(item)&&item!==bar).sort((a,b)=>a.g.y-b.g.y);
  if(content.length){
   const margin=Math.max(16,Math.min(...content.map(({g})=>Math.max(0,g.x))));
   Object.assign(root.style,{display:'flex',flexDirection:'column',alignItems:'stretch',gap:unit(device==='desktop'?48:28),paddingLeft:unit(margin),paddingRight:unit(margin),paddingTop:unit(content[0].g.y),paddingBottom:unit(device==='desktop'?80:40),height:'auto',minHeight:'100svh'});
   for(const {node} of content){Object.assign(node.style,{position:'relative',inset:'auto',width:'100%',height:'auto',minHeight:'0',flex:'none'});}
  }
  // Растягиваем исходные декоративные панели вокруг реального содержимого.
  for(const node of root.querySelectorAll('[data-name="Card"],[data-name="panel"]')){
   if(getComputedStyle(node).display.includes('flex'))node.style.height='auto';
  }
 }else if(isDocument){
  const content=children.filter(item=>!artwork(item)&&item!==bar&&!item.g.n.startsWith('emoji/'));
  const measureDocument=()=>{
   const top=root.getBoundingClientRect().top;
   const minimum=Math.ceil(Math.max(0,...content.map(({node})=>node.getBoundingClientRect().bottom-top))+40*viewport.clientWidth/template.width);
   const value=minimum+'px';if(root.style.getPropertyValue('--document-min-height')!==value)root.style.setProperty('--document-min-height',value);
  };
  measureDocument();fluidObserver=new ResizeObserver(measureDocument);content.forEach(({node})=>fluidObserver.observe(node));
 }else{
  const groups=children.filter(({node,g})=>!artwork({g})&&g.n!=='Bar'&&/^(dialogue|notes|choice-block|panel|phone|menu|content|actions|Bubble|button\/next|Hint|menu-aside)$/.test(g.n));
  for(const node of canvas.querySelectorAll('[data-name="dialogue"],[data-name="choices"],[data-name="choice-block"]')){
   const gap=node.style.gap;if(gap&&gap!=='0px')node.style.gap=`clamp(12px,calc(${gap} - var(--height-shortfall) * .12),${gap})`;
  }
  for(const {node,g} of groups){
   node.style.top='auto';
   const bottom=unit(Math.max(16,template.height-g.y-g.h));
   node.style.bottom=`clamp(16px,calc(${bottom} - var(--height-shortfall) * .2),${bottom})`;
  }
  // Минимальная высота вычисляется из содержимого. На низком окне доступна
  // вертикальная прокрутка вместо обрезания реплик и уменьшения шрифта.
  const measure=()=>{
   if(!viewport.isConnected)return;
   const scale=viewport.clientWidth/template.width;
   const header=bar?bar.node.getBoundingClientRect().height:0;
   const minimum=Math.max(0,...groups.map(({node,g})=>node.getBoundingClientRect().height+header+(parseFloat(getComputedStyle(node).bottom)||16)+24*scale));
   const value=Math.ceil(minimum)+'px';
   if(viewport.style.getPropertyValue('--scene-min-height')!==value)viewport.style.setProperty('--scene-min-height',value);
  };
  if(device!=='mobile'){viewport.style.setProperty('--scene-min-height','0px');return;}
  measure();
  fluidObserver=new ResizeObserver(measure);
  groups.forEach(({node})=>fluidObserver.observe(node));
  if(bar)fluidObserver.observe(bar.node);
 }
}
