const fs=require('fs');
const path=require('path');
const map=new Map();
//const reload=require('../../koa/node_modules/hotreloader');
const reload=require('hotreloader');
var mama;
function vov(ms, pleva){
fs.readdirSync(`./${ms}`).forEach(filename=> {
if(path.extname(filename)==='.js'){
if(pleva){	
 mama=reload(path.resolve(`${ms}/${filename}`));}
else{
mama=require(path.resolve(`${ms}/${filename}`))}
map.set(filename,mama);
}
});
}
module.exports=(opt)=>{
if (!opt || !opt.root) {throw new Error('settings.root required');}
vov(opt.root, opt.development)
return function(req,res,next){
res.compile=function(v,ops){
var context={};
Object.assign(context,req.app.locals,ops)
var html;
try{	
html=end(v,context);
}catch(er){
html=berror({ferr:er,file:v,stack:er.stack});
}
return html;
}
res.rendel=(v,ops)=>{
return res.send(res.compile(v,ops))
}
next();
}
}
function end(v,ops){
let fn=map.get(`${v}.js`);
return fn[v](ops) 
}
function berror(n){
let st=()=>{return `<style>.err{background:red;}
.erro{background:orange;}</style>`;}	
return `${st()}<h3>Error</h3>
${n.ferr ? `<div class="err">${n.ferr}</div><div class="erri">In a file: <span class="erro">${n.file}.js</span></div>
${n.stack.replace(/\s at/g,'<br>at ')}`:''}`
}