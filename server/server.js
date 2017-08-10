const express=require('express');
const bodyParser=require('body-parser');

const {mongoose}=require('./db/mongoose');
const {Todo}=require('./models/todos');
const {User}=require('./models/users');

var app=express();

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


app.listen(3000,()=>{
  console.log('Server has started');
})

module.exports={app}
