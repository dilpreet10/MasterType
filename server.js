const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const knex = require('knex');
//backlink for signup page
const db = knex({
    client: 'pg',
    connection:{
        host: '127.0.0.1',
        user:'postgres',
        password:'daisy@123',
        database:'loginformtypo'
    }
})

const app = express();
 //making the path constant of html files i.e.typo
let intialpath=path.join(__dirname, "typo");

app.use(bodyParser.json());
app.use(express.static(intialpath));
//creating backlinks 
app.get('/', (req,res) => {
    //this is how we send files from server.
    res.sendFile(path.join(intialpath,"user.html"));
})
app.get('/homepage', (req,res) => {
    //this is how we send files from server.
    res.sendFile(path.join(intialpath,"homepage.html"));
})
app.get('/signin', (req,res) => {
    //this is how we send files from server.
    res.sendFile(path.join(intialpath,"signin.html"));
})
app.get('/signup', (_req,res) => {
    //this is how we send files from server.
    res.sendFile(path.join(intialpath,"signup.html"));
})
app.post('/signup-user',(req,res)=>{
    const{ name, email, password} = req.body;
    if(!name.length || !email.length || !password.length){
        res.json('fill all the fields');
    }
    else{
        db("users").insert({
            name: name,
            email:email,
            password: password
        })
        .returning(["name","email"])
        .then(data=>{
            res.json(data[0]);
        })
        .catch(err=>{
            if(err.detail?.includes('already exists')){
                res.json('email already exists');
            }
        })
    }
})
app.post('/signin-user', (req,res) => {
    const{email, password} = req.body;
    db.select('name','email')
    .from('users')
    .where({
        email:email,
        password: password
    })
    .then(data =>{
        if(data.length){
            res.json(data[0]);
        }else{
            res.json('email or password is incorrect');
        }
    })
})
app.listen(3000, (req,res) => {
console.log('listening on port 3000......')
}
)

