// ИИ: проверка локальных ассетов и 60 композиций. Запись №19.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({});vm.runInContext(fs.readFileSync('screen-templates.js','utf8')+';this.s=figmaScreens',c);
vm.runInContext(fs.readFileSync('screen-runtime.js','utf8').split('function exactDevice')[0]+';this.optimize=optimizedScreenHTML',c);
let frames=0,images=new Set();for(const variants of Object.values(c.s)){for(const f of [variants.desktop,variants.tablet,...variants.mobile]){frames++;for(const match of c.optimize(f.html).matchAll(/src="([^"]+)"/g)){assert(!/^https?:/.test(match[1]),'Remote runtime asset');assert(fs.existsSync(match[1]),match[1]);images.add(match[1]);}}}
assert.equal(Object.keys(c.s).length,18);assert.equal(frames,60);console.log({screens:18,frames,localAssets:images.size});
