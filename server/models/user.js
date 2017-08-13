const mongoose=require('mongoose');
const validator=require('validator');
const jwt=require('jsonwebtoken');
const _=require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    validate: {
      validator: (email)=>{
        validator.isEmail(email);
      },
      message: '{VALUE} is not a valid email!'
    }
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]

});

UserSchema.methods.toJSON=function(){
  var user=this;

  var userObj=user.toObject();

  return _.pick(userObj,['email','_id']);

};

UserSchema.methods.generateAuthTokenAndSaveUser=function(){

  var user=this;
  var access='auth';

  var token=jwt.sign({_id:user._id,access},'secret').toString();
  user.tokens.push({access,token});

  return user.save().then(()=>{
    return token;
  });

}

UserSchema.statics.findByToken=function(token){
var User=this;
return User.findOne({'tokens.token':token});
}

UserSchema.pre('save', function(next) {
  var user = this;

  if (user.isModified('password')) {
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(user.password, salt, (err, hash)=> {
        user.password=hash;
        next();
      });
    });
  }else{
    next();
  }
});

var User=mongoose.model('users',UserSchema);

module.exports={User}
