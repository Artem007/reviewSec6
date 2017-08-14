const expect=require('expect');
const request=require('supertest');
const mongoose=require('mongoose');
const {ObjectID}=require('mongodb');

const {Todo}=require('./../models/todo');
const {User}=require('./../models/user');
const {app}=require('./../server.js');

var {TodoData,UserData,populateTodos,populateUsers} = require('./seed.js');

beforeEach(populateTodos);

beforeEach(populateUsers);

describe('POST /todos', () => {

  it('should create todo', (done) => {
    var text = 'From test todo';
    var token=UserData[1].tokens[0].token;
    request(app)
      .post('/todos')
      .set('x-auth',token)
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
    var token=UserData[1].tokens[0].token;
    request(app)
      .post('/todos')
      .set('x-auth',token)
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

  it('should get an error', (done) => {
    request(app)
      .post('/todos')
      .set('x-auth','token')
      .send()
      .expect(401)
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

  it('should return todos', (done) => {
    var token = UserData[1].tokens[0].token;
    request(app)
      .get('/todos')
      .set('x-auth', token)
      .send()
      .expect(200)
      .end((err, res) => {
        if (err) {
          console.log(err);
        }
        Todo.find({_creator:UserData[1]._id}).then((docs) => {
          expect(docs.length).toBe(1);
          done();
        }).catch((err) => {
          if (err) {
            console.log(err);
          }
          done();
        });
      })
  })

})

describe('GET /todos/:id', () => {

  it('should get a todo', (done) => {
    var token = UserData[1].tokens[0].token;
    var id = TodoData[1]._id;

    request(app)
      .get(`/todos/${id}`)
      .set('x-auth',token)
      .expect(200)
      .end((err, res) => {
          if (err) {
          return console.log(err);
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
    var token = UserData[1].tokens[0].token;
    request(app)
      .get(`/todos/123546`)
      .set('x-auth',token)
      .expect(404)
      .end(done);
  });

  it('should return 404 becouse there is no todo with such ID', (done) => {
    var token = UserData[1].tokens[0].token;
    var id=new ObjectID();
    request(app)
      .get(`/todos/${id}`)
      .set('x-auth',token)
      .expect(404)
      .end(done);
  });

});

describe('DELETE /todos/:id', () => {

  it('should delete a todo', (done) => {
    var id=TodoData[1]._id;
    var token=UserData[1].tokens[0].token;

    request(app)
      .delete(`/todos/${id}`)
      .set('x-auth',token)
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
    var token=UserData[1].tokens[0].token;

    request(app)
      .delete(`/todos/21654`)
      .set('x-auth',token)
      .expect(404)
      .end(done);
  });

  it('should delete a todo', (done) => {
    var token=UserData[1].tokens[0].token;
    var id=new ObjectID();

    request(app)
      .delete(`/todos/${id}`)
      .set('x-auth',token)
      .expect(404)
      .end(done);
  });

});

describe('PATCH /todos/:id', () => {

  it('should update a todo', (done) => {
    var id=TodoData[1]._id;
    var text='From patch test';
    var completed=false;
    var token=UserData[1].tokens[0].token;

    request(app)
      .patch(`/todos/${id}`)
      .set('x-auth',token)
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

  it('should return 404', (done) => {
    var text='From patch test';
    var completed=true;
    var token=UserData[1].tokens[0].token;

    request(app)
      .patch(`/todos/15651fdsf`)
      .set('x-auth',token)
      .send({text,completed})
      .expect(404)
      .end(done);
  });

});

describe('POST /users', () => {

  it('should create user', (done) => {
    var email='test@test.com';
    var password='abc123'
    request(app)
      .post('/users')
      .send({email,password})
      .expect(200)
      .expect((res) => {
        expect(res.body.email).toBe(email);
      })
      .end((err,res) => {
        if (err) {
          console.log(err);
          done();
        }

        User.find().then((docs) => {
          expect(docs.length).toBe(3);
        }).catch((err) => done(err));

        User.findOne({email}).then((doc) => {
          expect(doc.password).toNotBe(res.body.password);
          done();
        }).catch((err) => done(err));
      })
  });

  it('should return an error because email is invalid', (done) => {
    var email='rogeom';
    var password='abc123'
    request(app)
      .post('/users')
      .send({email,password})
      .expect(400)
      .end(done)
  });

  it('should return an error because email is in use', (done) => {
    var email='roger@axmple.com';
    var password='abc123'
    request(app)
      .post('/users')
      .send({email,password})
      .expect(400)
      .end(done)
  });

});

describe('GET /users/me', () => {

  it('should return user', (done) => {
    var token = UserData[1].tokens[0].token;
    request(app)
      .get('/users/me')
      .set('x-auth', token)
      .send()
      .expect(200)
      .expect((res) => {
        expect(res.body.email).toBe(UserData[1].email);
      })
      .end(done)
  });

  it('should return 401', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', 'sdasd324fsd')
      .send()
      .expect(401)
      .expect((res)=>{
        expect(res.body).toEqual({});
      })
      .end(done)
  });

});

describe('POST /users/login', () => {

  it('should return a user', (done) => {

    var email = 'roger@axmple.com';
    var password = '123abc';

    request(app)
      .post('/users/login')
      .send({
        email,
        password
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
        expect(res.body.email).toBe(UserData[1].email);
        expect(res.body._id).toBe(UserData[1]._id.toHexString());
      })
      .end((err) => {
        if (err) {
          done(err);
        }
        User.findOne({
          email
        }).then((user) => {
          expect(user.tokens.length).toBe(2);
          done();
        }).catch((err) => {
          done(err);
        });
      })


  })


  it('should reject invalid login', (done) => {

    var email = 'roger@axmple.com';
    var password = 'bla bla bla';

    request(app)
      .post('/users/login')
      .send({
        email,
        password
      })
      .expect((res)=>{
        expect(res.headers['x-auth']).toNotExist();
      })
      .expect(401)
      .end((err) => {
        if (err) {
          done(err);
        }
        User.findOne({
          email
        }).then((user) => {
          expect(user.tokens.length).toBe(1);
          done();
        }).catch((err) => {
          done(err);
        });
      })
  })

})

describe('DEL /users/me/token', () => {

  it('should delete token from array', (done) => {
    var token = UserData[1].tokens[0].token;
    var id = UserData[1]._id;

    request(app)
      .delete('/users/me/token')
      .set('x-auth', token)
      .expect(200)
      .end((err) => {
        if (err) {
          done(err)
        }
        User.findById(id).then((doc) => {
          expect(doc.tokens.length).toBe(0);
          done();
        }).catch((err) => {
          done(err)
        })
      })
  });

})
