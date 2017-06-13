# template-literals-express
Template middleware for express.js based on vanilla es6 template literals

[![NPM version](http://img.shields.io/npm/v/template-literals-express.svg?style=flat)](https://npmjs.org/package/template-literals-express) 
[![NPM Downloads](https://img.shields.io/npm/dm/template-literals-express.svg?style=flat)](https://npmjs.org/package/template-literals-express)

A light-weight template engine for express.js based on vanilla es6 template literals.
Each javascript file in a `views` direcory is a module on its own. Why not? The fact that

```javascript
const string = (name) = > `Hello ${name}!`
console.log(string("world")) // "Hello world!"
```
brings us to the modularity:

```javascript
// main_page.js

const main_page = obj = > {
return `
<html>
<body>
<h1>Hello ${obj.name}!</h1>
</body>
</html>`
}
module.exports = {main_page}

// and then in a router:

app.get('/',  (req, res)=> {
res.rendel('main_page', {name: 'world'})
}
```

## Installation

`npm install template-literals-express`
Under the hood `template-literals-express` uses [hotreloader.js](https://github.com/Globik/hotreloader) as a module hot-reloading with no need the server restart. 
To enable hot-reloading please set `development:true` in options. In a production stage please set to false.

`app.use(render({root:'views', development: true}))`

# Server example

```javascript
const express = require('express');
const render = require('template-literals-express');

const app = express();

// root - directory of templating files
// development if true hotreloader.js will work, others will not work
app.use(render({root:'views', development: true}))

app.get('/', (req,res) => {
const name = 'world';
//render the main_page.js from the views directory
res.rendel('main_page', {name: name})
})
app.listen(5000)
```
## main_page.js

```javascript
//main_page.js

const main_page = n = >{
return `
<html>
<body>
<h1>Hello ${n.name}!</h1>
</body>
</html>`;
}
module.exports = {main_page}
```
## API
1. `res.rendel` - is a mimic of express's res.render function. Get the compiled string and send it to the client. 
`res.rendel('file_name',{options:variables})`
2. `res.compile` - the same as `res.rendel` but returns only a compiled string. Usful for ajax calls from client side.
`res.compile('file_name',{options:variables})`
It can be done so:

```js
res.send({content:res.compile('file_name',{variables})})
```

## Options
1. developmnet - true or false. By default false. If false `hotreloader.js` will not work.
2. root - it's a folder with templating modules.

## Error handler

Via `try{}catch(e){}` traps the errors and displays  them to the browser.

## Note
Nested directories `template-literals-express` does not support. 
Support only `.js` extension files.

## Naming convention

As it is you may need to giving the unique and the same names to your files and functions with underscore
Let's say your site have admin and users parts.
So in a `views` directory just for example
`- admin_articles.js
- admin_dashboard.js
- user_dashboard.js
- README
etc
`

Just name the function also the same:
```javascript
//admin_articles.js
const admin_articles = n => {return `blah blah blah`}

module.exports = {admin_articles}

res.rendel('admin_articles', {})
```
## Hot-reloading

`hotreloader.js` does not work with destructuring assignments

As it is:

```javascript
//some_module.js
const some_var = n = > { return `Hello ${n.name}!`}
module.exports = {some_var}

// bad:

var {some_var} = require('some_module.js');//hot-reloading will not work
var s = some_var({name:"Globik"})

// not so bad:

var some_var = require('some_module.js'); // hot-reloading will work
var s=some_var.some_var({name:"Globik"});
console.log(s)// > "Hello, Globik!"
```

## Vanilla javascript for a based functionalities

Includes, partials like in other template engines can be achieved with javascript.
One module can include other modules.

```javascript
//head.js
const head = n = > {
return `
<meta charset="utf-8">
<title>${n.title ? n.title : "Simple title"}</title>
<link rel="shortcut icon" type="image/ico" href="/images/w4.png"> 

${n.cssl ? get_cssl(n) : ''}
${n.csshelper ? `<style>${n.csshelper}</style>`:``}
${n.js ? get_js(n):''}
`;
}

function get_cssl(n){
let s='';
n.cssl.forEach((el,i)=>{
s+=`<link href="${el}" rel="stylesheet">`;
})
return s;
}

function get_js(n){
let s='';
n.js.forEach((el,i)=>{
s+=`<script src="${el}"></script>`;
})
return s;
}

module.exports = {head}

//footer.js

const footer = n = > { return `<b>footer content</b>`;}
module.exports = {footer}

//main_page.js

const head = require('./head.js');
const footer = require('./footer.js');

const main_page = n = > {
return `
<html>
<head>${head.head({cssl:['/css/css_1.css', '/css/css_2.css'], csshelper: `${get_style()}`, js:['/js/js_1.js']})}</head>
<body>
<h1>Some content.</h1>
<footer>${footer.footer({})}</footer>
</body>
</html>
`;
}
function get_style(){
return 	`
h1 {background: green;}
`;
}
module.exports={main_page}
```

## forEach loop

```javascript

`<div>${n.posts ? get_list(n.posts) : ''}</div>`
....
function get_list(array){
let s='<ul>';
array.forEach((el, i)=>{
s+=`<li>${el.post_title}<li>${el.post_author}<li>${el.post_body}`
})
return s;
}
```

## Vidgets like workaround

You can directly render the simply modules(via ajax requests)
For example:

```javascript 
//vidget_hello_world.js

const vidget_hello_world = n = > {
return `<b>Date:</b>${n.date}`;
}
module.exports = {vidget_hello_world}

//router.js

app.post('/get_date_vidget', (req,res) => {
var date = new Date();
res.send{info: "OK", content: res.compile('vidget_hello_world',{date: date})}
})

// on a client side the ajax post-call to '/get_date_vidget':
<div id="content"></div>
...
xhr.open('post', '/get_date_vidget');
xhr.onload = function(ev){
if(xhr.status == 200){
var data = JSON.parse(this.response);
document.getElementById('content').innerHTML = data.content;
console.log(data.info);
}}
...
```
# Examples

[Examples](https://github.com/Globik/template-literals-express/tree/master/examples)

Also see a real world [example](https://github.com/Globik/alikon/tree/master/views)


## Caveats
- in memory. Should be using with hotreloader.
- no highlighting for html template literals syntax in a most well known code editors. Just one color.
- no layout support.
- no nested directories support

## Benefits
- it can work in conjuction with others template engines.
- learning new syntax is not required.
- flexible
