const express=require('express');
const app=express();
const render=require('../index.js');
const port=5000;
app.locals.title="My awsome application";
app.locals.email="nicky@example.com";

app.use(render({root:'views', development:true}))
app.use(express.static('public'));


app.get('/', (req, res)=>{
const str="world";
res.rendel('main_page',{str:str})
})
app.get('/user', (req, res)=>{
//fake user
const user={id:1, name: 'Globik', member:true}
res.rendel('user',{user:user})
})
//ajax call
app.post('/hello_vidget', (req, res)=>{
res.send({info:'OK', content: res.compile('hello_vidget',{user:user})})
})
app.listen(port)
console.log('app on port: ', port)
