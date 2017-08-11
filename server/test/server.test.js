const expect=require('expect');
const request=require('supertest');
const mongoose=require('mongoose');
const {ObjectID}=require('mongodb');

const {Todo}=require('./../models/todo');
const {app}=require('./../server.js');

var firstId=new ObjectID();
var secondId=new ObjectID();;

var TodoData = [{
  _id: firstId,
  text: 'first test todo',
  completed:true
}, {
  _id: secondId,
  text: 'second test todo',
  completed:false
}];

beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(TodoData);
  }).then((docs) => {
    done();
  }).catch((err) => {
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
      .expect(200)
      .end((err, res) => {
          if (err) {
          console.log(err);
        }
        Todo.findById(id).then((doc) => {
          console.log(doc);
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
      .expect(404)
      .end(done);
  });

  it('should return 404 becouse there is no todo with such ID', (done) => {
    var id=new ObjectID();

    request(app)
      .get(`/todos/${id}`)
      .expect(404)
      .end(done);
  });

});

describe('DELETE /todos/:id', () => {

  it('should delete a todo', (done) => {
    var id=firstId;

    request(app)
      .delete(`/todos/${id}`)
      .expect(200)
      .end((err, res) => {
          if (err) {
          console.log(err);
        }
        Todo.findById(id).then((doc) => {
          expect(doc).toNotExist();
          done();
        }).catch((err) => {
          if (err) {
            console.log(err);
          }
          done();
        });
      })
  });

  it('should delete a todo', (done) => {
    var id=firstId;

    request(app)
      .delete(`/todos/21654`)
      .expect(404)
      .end(done);
  });

  it('should delete a todo', (done) => {
    var id=new ObjectID();

    request(app)
      .delete(`/todos/${id}`)
      .expect(404)
      .end(done);
  });

});

describe('PATCH /todos/:id', () => {

  it('should update a todo', (done) => {
    var id=firstId;
    var text='From patch test';
    var completed=false;

    request(app)
      .patch(`/todos/${id}`)
      .send({text,completed})
      .expect(200)
      .end((err, res) => {
          if (err) {
          console.log(err);
        }
        Todo.findById(id).then((doc) => {
          expect(doc.text).toBe(text);
          expect(doc.completed).toBe(completed);
          expect(doc.completedAt).toNotExist();
          done();
        }).catch((err) => {
          if (err) {
            console.log(err);
          }
          done();
        });
      })
  });

  it('should update a todo', (done) => {
    var id=secondId;
    var text='From patch test';
    var completed=true;

    request(app)
      .patch(`/todos/${id}`)
      .send({text,completed})
      .expect(200)
      .end((err, res) => {
          if (err) {
          console.log(err);
        }
        Todo.findById(id).then((doc) => {
          expect(doc.text).toBe(text);
          expect(doc.completed).toBe(completed);
          expect(doc.completedAt).toExist();
          done();
        }).catch((err) => {
          if (err) {
            console.log(err);
          }
          done();
        });
      })
  });

  it('should return 404', (done) => {
    var text='From patch test';
    var completed=true;

    request(app)
      .patch(`/todos/15651fdsf`)
      .send({text,completed})
      .expect(404)
      .end(done);

  });

});
