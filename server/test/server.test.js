const expect=require('expect');
const request=require('supertest');
const mongoose=require('mongoose');
const {ObjectID}=require('mongodb');

const {Todo}=require('./../models/todo');
const {app}=require('./../server.js');

var firstId=new ObjectID();
var secId=new ObjectID();;

var TodoData = [{
  _id:firstId,
  text: 'first test todo'
}, {
  _id:secId,
  text: 'second test todo'
}];

beforeEach((done)=>{
Todo.remove({}).then(()=>{
  return Todo.insertMany(TodoData);
}).then((docs)=>{
  done();
}).catch((err)=>{
  console.log(err);
  done();
});

});

describe('POST /todos', () => {

  it('should create todo', (done) => {
    var text = 'From test todo';
    request(app)
      .post('/todos')
      .send({
        text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          console.log(err);
          done();
        }
        Todo.find().then((docs) => {
          expect(docs.length).toBe(3);
          done();
        }).catch((err) => done(err))
      })
  });

  it('should get an error', (done) => {
    request(app)
      .post('/todos')
      .send()
      .expect(400)
      .end((err, res) => {
        if (err) {
          console.log(err);
          done();
        }
        Todo.find().then((docs) => {
          expect(docs.length).toBe(2);
          done();
        }).catch((err) => done(err))
      })
  });

});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .send()
      .expect(200)
      .end((err, res) => {
        if (err) {
          console.log(err);
        }
        expect(res.body.length).toBe(2)
        Todo.find().then((docs) => {
          expect(docs.length).toBe(2);
          done();
        }).catch((err) => {
          if (err) {
            console.log(err);
          }
          done();
        });
      })
  })
});

describe('GET /todos/:id', () => {

  it('should get a todo', (done) => {
    var id=firstId;

    request(app)
      .get(`/todos/${id}`)
      .send()
      .expect(200)
      .end((err, res) => {
          if (err) {
          console.log(err);
        }
        Todo.findById(id).then((doc) => {
          expect(res.body._id).toBe(doc._id.toHexString());
          done();
        }).catch((err) => {
          if (err) {
            console.log(err);
          }
          done();
        });
      })
  });

  it('should return 404 becouse ID is invalid', (done) => {
    var id=firstId;

    request(app)
      .get(`/todos/123546`)
      .send()
      .expect(404)
      .end(done);
  });

  it('should return 404 becouse there is no todo with such ID', (done) => {
    var id=new ObjectID();

    request(app)
      .get(`/todos/${id}`)
      .send()
      .expect(404)
      .end(done);
  });

});
