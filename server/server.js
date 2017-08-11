const express=require('express');
const bodyParser=require('body-parser');

const {mongoose}=require('./db/mongoose');
const {ObjectID}=require('mongodb');
const {Todo}=require('./models/todo');
const {User}=require('./models/user');

var app=express();
var port=process.env.PORT || 3000;

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

app.listen(port,()=>{
  console.log('Server has started');
})

module.exports={app}
