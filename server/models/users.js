const mongoose=require('mongoose');

var UserSchema=mongoose.Schema({
  email:{
    type:String,
    required:true,
    trim:true,
  }
});

var User=mongoose.model('users',UserSchema);

module.exports={User}
