require('./config/db');

const express=require('express');
const bodyParser=require('body-parser');
const _=require('lodash');
const bcrypt = require('bcryptjs');

const {mongoose}=require('./db/mongoose');
const {ObjectID}=require('mongodb');
const {Todo}=require('./models/todo');
const {User}=require('./models/user');

var app=express();
var port=process.env.PORT;

const {authentication}=require('./middleware/authentication.js');

app.use(bodyParser.json());

app.post('/todos',authentication,(req, res) => {

  var body=_.pick(req.body,['text','completed']);
  body._creator=req.user._id;
  var todo =new Todo(body);

  todo.save().then((doc) => {
    res.status(200).send(doc);
  }).catch((err) => {
    res.status(400).send();
  });

});

app.get('/todos', authentication,(req, res) => {

  Todo.find({
    _creator:req.user._id
  }).then((docs)=>{
    res.status(200).send(docs);
  }).catch((err)=>{
    res.status(400).send();
  });

});

app.get('/todos/:id',authentication ,(req, res) => {

  var _id = req.params.id;
  var _creator=req.user._id;


  if (!ObjectID.isValid(_id)) {
    return res.status(404).send();
  }

  Todo.findOne({_id,_creator}).then((doc) => {
    if(!doc){
      return res.status(404).send();
    }
    res.status(200).send(doc);
  }).catch((err) => {
    res.status(400).send();
  });

});

app.delete('/todos/:id',authentication,(req, res) => {

  var _id = req.params.id;
  var _creator=req.user._id;

  if (!ObjectID.isValid(_id)) {
    return res.status(404).send();
  }

  Todo.findOneAndRemove({_id,_creator}).then((doc) => {
    if(!doc){
      return res.status(404).send();
    }
    res.status(200).send(doc);
  }).catch((err) => {
    res.status(400).send();
  });

});

app.patch('/todos/:id', authentication, (req, res) => {

  var _id = req.params.id;
  var _creator = req.user._id;
  var body = {};

  if (!ObjectID.isValid(_id)) {
    return res.status(404).send();
  }

  if (req.body.text) {
    body.text = req.body.text;
  }
  if (req.body.completed) {
    body.completed = req.body.completed;
  }

  if (req.body.completed && typeof(req.body.completed) === 'boolean') {
    body.completedAt = new Date().getTime();
  } else {
    body.completedAt = null;
    body.completed = false;
  }

  Todo.findOneAndUpdate({
    _id,
    _creator
  }, body, {
    new: true
  }).then((doc) => {
    if (!doc) {
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

  user.generateAuthToken().then((token)=>{
    res.header('x-auth',token).send(user);
  }).catch((err)=>{
    res.status(400).send(err);
  })

});

app.get('/users/me',authentication,(req,res)=>{
res.status(200).send(req.user);
});

app.post('/users/login', (req, res) => {

  var email = req.body.email;
  var password = req.body.password;

  User.findByCredentials(email,password).then((user)=>{
    return user.generateAuthToken().then((token)=>{
      res.header('x-auth',token).send(user);
    });
  }).catch((err)=>{
    res.status(401).send();
  });

});

app.delete('/users/me/token',authentication,(req,res)=>{
  var user=req.user;
  var token=req.token;

  user.removeToken(token).then(()=>{
    res.status(200).send();
  }).catch(()=>{
    res.status(400).send();
  });

});

app.listen(port,()=>{
  console.log('Server has started');
})

module.exports={app}
