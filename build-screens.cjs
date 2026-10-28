/* ИИ: сборка независимых HTML-композиций из сохранённых контекстов Figma. Запись №19. */
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
let ts;try{ts=require('typescript');}catch{ts=require('./build-typescript.cjs');}
const manifest={
 prologue:['1318-2535','1396-1226',['1398-1223','1413-1623']],
 dialogue:['1318-2552','1396-1242',['1398-1226']],
 chat:['1318-2561','1396-1252',['1398-1229','1499-5919','1499-5955']],
 choice:['1318-2579','1396-1275',['1471-4568','1471-4595']],
 closeness:['1318-2593','1396-1290',['1398-1235']],
 info:['1318-2602','1396-1301',['1398-1238']],
 A:['1318-2648','1396-1331',['1398-1242']],
 momUnknown:['1318-2661','1396-1344',['1398-1245']],
 tellMom:['1318-2669','1396-1353',['1398-1248']],
 messageMom:['1318-2681','1396-1366',['1398-1251','1413-1659']],
 adults:['1318-2698','1396-1385',['1398-1254']],
 openEnding:['1318-2709','1396-1398',['1398-1257','1413-1676']],
 silent:['1318-2724','1396-1411',['1398-1261']],
 resources:['1318-2730','1396-1419',['1398-1264']],
 supportPage:['1318-2747','1396-1440',['1398-1267']],
 materials:['1318-2775','1396-1483',['1398-1270']],
 help:['1318-2792','1396-1502',['1398-1273']],
 menu:['1320-2577','1396-1522',['1398-1276']]
};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const unknown=new Set(),assets=new Map();
const aliases=fs.existsSync('asset-aliases.json')?JSON.parse(fs.readFileSync('asset-aliases.json','utf8')):{};
const val=s=>s.replace(/_/g,' ').replace(/calc\((.*?)\)/g,(_,x)=>'calc('+x.replace(/([+])/g,' $1 ').replace(/([%a-z0-9)])-(?=[0-9.])/g,'$1 - ')+')');
function declarations(token){
 const simple={absolute:'position:absolute',relative:'position:relative',fixed:'position:fixed',flex:'display:flex',block:'display:block',hidden:'display:none',grid:'display:grid','flex-col':'flex-direction:column','flex-row':'flex-direction:row','flex-wrap':'flex-wrap:wrap','items-start':'align-items:flex-start','items-end':'align-items:flex-end','items-center':'align-items:center','items-stretch':'align-items:stretch','justify-center':'justify-content:center','justify-end':'justify-content:flex-end','justify-start':'justify-content:flex-start','justify-between':'justify-content:space-between','content-stretch':'align-content:stretch','self-stretch':'align-self:stretch','shrink-0':'flex-shrink:0','flex-none':'flex:none','grow':'flex-grow:1','overflow-clip':'overflow:clip','overflow-hidden':'overflow:hidden','overflow-auto':'overflow:auto','font-normal':'font-weight:400','font-medium':'font-weight:500','font-semibold':'font-weight:600','font-bold':'font-weight:700','lowercase':'text-transform:lowercase','uppercase':'text-transform:uppercase','text-center':'text-align:center','text-left':'text-align:left','whitespace-nowrap':'white-space:nowrap','whitespace-pre-wrap':'white-space:pre-wrap','break-words':'overflow-wrap:break-word','border-solid':'border-style:solid','border-dashed':'border-style:dashed','border':'border-width:1px','border-0':'border-width:0','size-full':'width:100%;height:100%','w-full':'width:100%','h-full':'height:100%','min-w-full':'min-width:100%','max-w-none':'max-width:none','min-w-px':'min-width:1px','min-h-px':'min-height:1px','inset-0':'inset:0','left-0':'left:0','right-0':'right:0','top-0':'top:0','bottom-0':'bottom:0','m-0':'margin:0','mb-0':'margin-bottom:0','pointer-events-none':'pointer-events:none','object-cover':'object-fit:cover','object-contain':'object-fit:contain','mix-blend-multiply':'mix-blend-mode:multiply','-translate-y-1/2':'translate:0 -50%','-translate-x-1/2':'translate:-50% 0','translate-x-1/2':'translate:50% 0','translate-y-1/2':'translate:0 50%','rounded-full':'border-radius:9999px','leading-none':'line-height:1','w-min':'width:min-content','h-auto':'height:auto'};
 Object.assign(simple,{'-scale-x-100':'scale:-1 1','content-center':'align-content:center','content-start':'align-content:flex-start','cursor-pointer':'cursor:pointer','decoration-from-font':'text-decoration-thickness:from-font','decoration-solid':'text-decoration-style:solid','grid-cols-[repeat(3,minmax(0,1fr))]':'grid-template-columns:repeat(3,minmax(0,1fr))','grid-rows-[repeat(2,fit-content(100%))]':'grid-template-rows:repeat(2,fit-content(100%))','h-0':'height:0','justify-self-stretch':'justify-self:stretch','left-1/2':'left:50%','top-1/2':'top:50%','row-[span_2]':'grid-row:span 2','underline':'text-decoration-line:underline'});
 if(simple[token])return simple[token];
 let m;
 if((m=token.match(/^\[(.+?):(.+)\]$/)))return m[1]+':'+val(m[2]);
 if((m=token.match(/^(w|h|min-w|min-h|max-w|max-h|size|left|right|top|bottom|inset|gap|gap-x|gap-y|px|py|pt|pb|pl|pr|p|mx|my|mt|mb|ml|mr|m|rounded|tracking|leading|opacity|z|blur|shadow|drop-shadow|rotate|flex|font|bg|text|border)(?:-\[(.*)\])$/))){
  let [,kind,v]=m;v=val(v);
  const props={w:'width',h:'height','min-w':'min-width','min-h':'min-height','max-w':'max-width','max-h':'max-height',left:'left',right:'right',top:'top',bottom:'bottom',inset:'inset',gap:'gap','gap-x':'column-gap','gap-y':'row-gap',pt:'padding-top',pb:'padding-bottom',pl:'padding-left',pr:'padding-right',p:'padding',mt:'margin-top',mb:'margin-bottom',ml:'margin-left',mr:'margin-right',m:'margin',rounded:'border-radius',tracking:'letter-spacing',leading:'line-height',opacity:'opacity',z:'z-index',shadow:'box-shadow',flex:'flex'};
  if(props[kind])return props[kind]+':'+v;
  if(kind==='size')return 'width:'+v+';height:'+v;
  if(['px','py','mx','my'].includes(kind)){const p=kind[0]==='p'?'padding':'margin';return `${p}-${kind[1]==='x'?'left':'top'}:${v};${p}-${kind[1]==='x'?'right':'bottom'}:${v}`;}
  if(kind==='blur')return 'filter:blur('+v+')';
  if(kind==='drop-shadow')return 'filter:drop-shadow('+v+')';
  if(kind==='rotate')return 'rotate:'+v.replace(/^(\-?\d+(?:\.\d+)?)$/,'$1deg');
  if(kind==='font')return 'font-family:"Golos Text",sans-serif';
  if(kind==='bg')return v.startsWith('linear-')||v.startsWith('radial-')?'background-image:'+v:'background-color:'+v;
  if(kind==='text')return /^#|^rgb|^var/.test(v)?'color:'+v:'font-size:'+v;
  if(kind==='border')return /^#|^rgb/.test(v)?'border-color:'+v:'border-width:'+v;
 }
 if((m=token.match(/^(-?)(rotate|inset|left|right|top|bottom|p|px|py|m|mt|mb|gap|border|rounded|opacity|z)-(\d+(?:\.\d+)?)$/))){
  const sign=m[1],kind=m[2],n=Number(m[3]);
  if(kind==='rotate')return 'rotate:'+sign+n+'deg';
  if(kind==='opacity')return 'opacity:'+n/100;
  if(kind==='z')return 'z-index:'+sign+n;
  return declarations(kind+'-['+sign+n+(kind==='border'?'px':'px')+']');
 }
 unknown.add(token);return '';
}
function element(type,props,...children){
 props=props||{};
 if(typeof type==='function'){const node=type({...props,children});if(node&&node.props){node.props['data-component']=type.name;if(type.name==='Social')node.props['data-social-network']=props.network||'vk';if(type.name==='MenuItem')node.props['data-menu-label']=props.label||'начать историю';}return node;}
 if(type===undefined)return {type:'fragment',props:{},children:children.flat(Infinity).filter(x=>x!==null&&x!==undefined&&x!==false)};
 return {type,props,children:children.flat(Infinity).filter(x=>x!==null&&x!==undefined&&x!==false)};
}
function html(node){
 if(node===null||node===undefined||node===false)return '';
 if(typeof node!=='object')return esc(node);
 const {type,props,children}=node;
 if(type==='fragment')return children.map(html).join('');
 let attrs='',style='';
 for(const [k,v]of Object.entries(props)){
  if(k==='className'){style+=String(v).split(/\s+/).map(declarations).filter(Boolean).join(';')+';';continue;}
  if(k==='children'||k==='key'||k==='ref'||k.startsWith('on'))continue;
  if(k==='style'){style+=Object.entries(v).map(([p,value])=>p.replace(/[A-Z]/g,l=>'-'+l.toLowerCase())+':'+value).join(';')+';';continue;}
  if(k==='src'&&typeof v==='string'&&v.startsWith('https://www.figma.com/api/mcp/asset/')){
   if(v.endsWith('/b85cfa29-9b15-45a0-8955-bc2b9f66997c.png')){attrs+=' src="./assets/menu-background.png"';continue;}
   const filename='figma-'+v.split('/').pop();assets.set(filename,v);attrs+=' src="./assets/figma/'+(aliases[filename]||filename)+'"';continue;
  }
  if(v!==false&&v!=null)attrs+=' '+k+'="'+esc(v)+'"';
 }
 if(style){style=style.replace(/(-?\d*\.?\d+)px\b/g,(_,n)=>'calc('+n+' * var(--frame-unit))');attrs+=' style="'+esc(style)+'"';}
 if(['img','input','br','hr','source'].includes(type))return '<'+type+attrs+'>';
 return '<'+type+attrs+'>'+children.map(html).join('')+'</'+type+'>';
}
function compile(id,device){
 const raw=fs.readFileSync('design-reference/'+id+'.txt','utf8');
 const cut=raw.indexOf('\nSUPER CRITICAL:');const source=cut>=0?raw.slice(0,cut):raw;
 const code=ts.transpileModule(source,{compilerOptions:{jsx:ts.JsxEmit.React,module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
 const sandbox={React:{createElement:element},exports:{}};vm.runInNewContext(code,sandbox,{timeout:3000});
 const tree=sandbox.exports.default();
 const output=html(tree);
 return {id:id.replace('-',':'),width:device==='desktop'?2560:device==='tablet'?1280:390,height:device==='desktop'?1440:device==='tablet'?800:mobileHeight(id),html:output};
}
function mobileHeight(id){return ({'1398-1223':845.37915,'1413-1623':845.37915,'1398-1238':1033,'1398-1264':1118,'1398-1267':1228,'1398-1270':1626,'1398-1273':1232})[id]||844;}
const result={};
for(const [name,[desktop,tablet,mobile]]of Object.entries(manifest)){
 try{result[name]={desktop:compile(desktop,'desktop'),tablet:compile(tablet,'tablet'),mobile:mobile.map(id=>compile(id,'mobile'))};}
 catch(e){console.error('ERROR',name,e.message);process.exitCode=1;}
}
fs.writeFileSync('screen-templates.js','/* ИИ: HTML из контекстов Figma. Пересборка: node build-screens.cjs. Запись №19. */\nconst figmaScreens='+JSON.stringify(result)+';\n');
fs.writeFileSync('figma-asset-downloads.json',JSON.stringify([...assets],null,2));
fs.writeFileSync('figma-unsupported-classes.json',JSON.stringify([...unknown].sort(),null,2));
console.log('screens',Object.keys(result).length,'assets',assets.size,'unsupported',unknown.size);
if(unknown.size)console.log([...unknown].sort().join('\n'));
