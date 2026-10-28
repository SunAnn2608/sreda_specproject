/* ИИ: загрузка оригинальных URL из контекстов Figma. Запись №19. */
const fs=require('node:fs');
fs.mkdirSync('assets/figma',{recursive:true});
const items=JSON.parse(fs.readFileSync('figma-asset-downloads.json','utf8'));
let cursor=0,done=0;const errors=[];
async function worker(){while(cursor<items.length){const [name,url]=items[cursor++];const dest='assets/figma/'+name;if(fs.existsSync(dest)&&fs.statSync(dest).size>0){done++;continue;}let ok=false;for(let attempt=0;attempt<4;attempt++){try{const r=await fetch(url,{signal:AbortSignal.timeout(30000)});if(!r.ok)throw Error('HTTP '+r.status);if(!r.headers.get('content-type')?.includes('image'))throw Error('Not an image');const b=Buffer.from(await r.arrayBuffer());if(!b.length)throw Error('Empty asset');fs.writeFileSync(dest,b);ok=true;done++;break;}catch(e){if(attempt===3)errors.push([name,e.message]);}}if(done%30===0)console.log(done+'/'+items.length);}}
Promise.all(Array.from({length:6},worker)).then(()=>{console.log(JSON.stringify({downloaded:done,total:items.length,errors}));if(errors.length)process.exitCode=1;});
