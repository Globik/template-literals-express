const head=require('./head.js');
const footer=require('./footer.js');

const main_page=n=>{
return `
<html>
<head>
${head.head({title:'main page',cssl:['/css/css_1.css'],csshelper:`${get_cssHelper()}`,js:['/js/js_1.js']})}
</head>
<body>
<nav><a href="/user">user</a></nav><br><br>
<h1>Hello ${n.str}!</h1>
<h2>Some content</h2>
${n.daddy ? n.daddy : '<h1>no daddy!</h1>'}
<hr>
<h3>app.locals here:</h3><div><b>title:</b> ${n.title}</div><div><b>email:</b> ${n.email}</div>
<hr>
<footer>
${footer.footer({})}
</footer>
</body>
</html>
`;
}
module.exports={main_page}
function get_cssHelper(){
return `h2{background:lightblue}`;
}