require('./config/db');
const express=require('express');
const bodyParser=require('body-parser');
const _=require('lodash');

const {mongoose}=require('./db/mongoose');
const {ObjectID}=require('mongodb');
const {Todo}=require('./models/todo');
const {User}=require('./models/user');

var app=express();
var port=process.env.PORT;

const {authentication}=require('./middleware/authentication.js');

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var todo =new Todo(req.body);

  todo.save().then((doc) => {
    res.status(200).send(doc);
  }).catch((err) => {
    res.status(400).send();
  });
});

app.get('/todos', (req, res) => {

  Todo.find().then((docs)=>{
    res.status(200).send(docs);
  }).catch((err)=>{
    res.status(400).send();
  });

});

app.get('/todos/:id', (req, res) => {

  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findById(id).then((doc) => {
    if(!doc){
      return res.status(404).send();
    }
    res.status(200).send(doc);
  }).catch((err) => {
    res.status(400).send();
  });

});

app.delete('/todos/:id', (req, res) => {

  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findByIdAndRemove(id).then((doc) => {
    if(!doc){
      return res.status(404).send();
    }
    res.status(200).send(doc);
  }).catch((err) => {
    res.status(400).send();
  });

});

app.patch('/todos/:id', (req, res) => {

  var id = req.params.id;
  var body={};

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if(req.body.text){
    body.text=req.body.text;
  }
  if(req.body.completed){
    body.completed=req.body.completed;
  }

  if(req.body.completed && typeof(req.body.completed)==='boolean'){
    body.completedAt=new Date().getTime();
  }else{
    body.completedAt=null;
    body.completed=false;
  }

  Todo.findByIdAndUpdate(id,body,{new:true}).then((doc) => {
    if(!doc){
      return res.status(404).send();
    }
    res.status(200).send(doc);
  }).catch((err) => {
    res.status(400).send();
  });

});

app.post('/users', (req, res) => {

  var body=_.pick(req.body,['email','password']);

  var user =new User(body);

  user.generateAuthTokenAndSaveUser().then((token)=>{
    res.header('x-auth',token).send(user);
  }).catch((err)=>{
    res.status(400).send();
    console.log(err);
  })

});

app.get('/users/me',authentication,(req,res)=>{
res.status(200).send(req.user);
});

app.listen(port,()=>{
  console.log('Server has started');
})

module.exports={app}
