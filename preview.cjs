const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
// ИИ: перезагружаем только код и ассеты, запись QA не сбрасывает прохождение. №23.
let version=Date.now();
const stamps=new Map();
const relevant=file=>file.startsWith('assets/')||(!file.includes('/')&&/\.(js|css|html)$/.test(file));
function remember(directory,prefix=''){
 for(const entry of fs.readdirSync(directory,{withFileTypes:true})){
  const name=prefix+entry.name,full=path.join(directory,entry.name);
  if(entry.isDirectory()){if(name==='assets'||prefix.startsWith('assets/'))remember(full,name+'/');}
  else if(relevant(name)){const stat=fs.statSync(full);stamps.set(name,stat.mtimeMs+':'+stat.size);}
 }
}
remember(__dirname);
fs.watch(__dirname,{recursive:true},(_,name)=>{
 const file=String(name||'').replaceAll('\\','/');if(!relevant(file))return;
 try{const stat=fs.statSync(path.join(__dirname,file));if(!stat.isFile())return;const stamp=stat.mtimeMs+':'+stat.size;if(stamps.get(file)!==stamp){stamps.set(file,stamp);version=Date.now();}}catch{}
});
http.createServer((request,response)=>{
 response.setHeader('Cache-Control','no-store');
 if(request.url==='/version'){response.end(String(version));return;}
 const pathname=new URL(request.url,'http://127.0.0.1').pathname;
 const file=path.join(__dirname,pathname==='/'?'index.html':pathname);
 fs.readFile(file,(error,data)=>{
  if(error){response.writeHead(404).end();return;}
  response.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.png':'image/png'})[path.extname(file)]||'application/octet-stream');
  response.end(path.extname(file)==='.html'?data.toString()+`<script>let version;setInterval(async()=>{try{const next=await(await fetch('/version')).text();if(version&&version!==next)location.reload();version=next}catch{}},800)</script>`:data);
 });
}).listen(8000,'127.0.0.1');
