const expect=require('expect');
const request=require('supertest');
const mongoose=require('mongoose');

const {Todo}=require('./../models/todos');
const {app}=require('./../server.js');

beforeEach((done)=>{
Todo.remove({}).then(()=>{
  done();
})
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
        Todo.find({
          text
        }).then((docs) => {
          expect(docs.length).toBe(1);
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
          expect(docs.length).toBe(0);
          done();
        }).catch((err) => done(err))
      })
  });

});
