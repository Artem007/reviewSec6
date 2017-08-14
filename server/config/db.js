var env=process.env.NODE_ENV || 'development';

if(env === 'development' || env === 'test'){
  var config=require('./db.json');
  var test='test'

  Object.keys(config[test]).forEach((key,index)=> {
    process.env[key]=config[env][key];
  });
}
