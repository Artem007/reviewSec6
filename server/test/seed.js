const {ObjectID}=require('mongodb');
const {Todo}=require('./../models/todo');
const {User}=require('./../models/user');
const jwt=require('jsonwebtoken');

var firstUserId=new ObjectID();
var secondUserId=new ObjectID();

var TodoData = [{
  _id: new ObjectID(),
  text: 'first test todo',
  completed:true,
  _creator:firstUserId
}, {
  _id: new ObjectID(),
  text: 'second test todo',
  completed:false,
  _creator:secondUserId
}];


var UserData = [{
  _id: firstUserId,
  email: 'artem@axmple.com',
  password:'123abc'
}, {
  _id: secondUserId,
  email: 'roger@axmple.com',
  password:'123abc',
  tokens:[]
}];

var populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(TodoData);
  }).then((docs) => {
    done();
  }).catch((err) => {
    console.log(err);
    done();
  });
}

var token=jwt.sign({_id:UserData[1]._id,access:'auth'},'secret').toString();
UserData[1].tokens.push({access:'auth',token})

var populateUsers = (done) => {
  User.remove({}).then((res) => {
    var userOne=new User(UserData[0]).save();
    var userTwo=new User(UserData[1]).save();
    return Promise.all([userOne,userTwo]);
  }).then((docs) => {
    done();
  }).catch((err) => {
    console.log(err);
    done();
  });
}

module.exports={TodoData,UserData,populateTodos,populateUsers}
