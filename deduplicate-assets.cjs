/* ИИ: дедупликация одинаковых файлов без изменения графики. Запись №19. */
const fs=require('node:fs'),crypto=require('node:crypto');
const byHash=new Map(),aliases={};let before=0,after=0;
for(const name of fs.readdirSync('assets/figma').sort()){
 const file='assets/figma/'+name,data=fs.readFileSync(file);before+=data.length;
 const hash=crypto.createHash('sha256').update(data).digest('hex');
 if(!byHash.has(hash)){byHash.set(hash,name);after+=data.length;}
 aliases[name]=byHash.get(hash);
}
fs.writeFileSync('asset-aliases.json',JSON.stringify(aliases,null,2));
fs.writeFileSync('asset-used.json',JSON.stringify([...byHash.values()],null,2));
console.log({files:Object.keys(aliases).length,unique:byHash.size,before,after});
