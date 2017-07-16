var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var userSchema = new Schema({
  name:String,
  email:String,
  password:String,
  city:String,
  state:String,
  mybooks:[{
    title:String,
    thumbnail:String,
    owner:String,
    newowner:String,
    status:Boolean
  }]
});

var User = module.exports = mongoose.model('User',userSchema);

module.exports.createUser = function(user,callback){
  bcrypt.genSalt(10,function(err,salt){
    bcrypt.hash(user.password,salt,function(err,hash){
      user.password = hash;
      user.save(callback);
    });
  });
}

module.exports.comparePassword = function(password,hash,callback){
  bcrypt.compare(password,hash,function(err,isMatch){
    callback(err,isMatch);
  });
}

module.exports.savePosition = function(email,city,state,callback){
  User.findOne({email:email},function(err,user){
    if (err) throw err;
    user.city = city;
    user.state = state;
    user.save(function(err,result){
      if (err) throw err;
      callback(result);
    });
  });
}

module.exports.changePassword = function(email,password,callback){
  User.findOne({email:email},function(err,user){
    if (err) throw err;
    bcrypt.genSalt(10,function(err,salt){
      bcrypt.hash(password,salt,function(err,hash){
        user.password = hash;
        user.save(callback);
      });
    });

  });
}

module.exports.getBooklist = function(email,callback){
  User.findOne({email:email},function(err,user){
    if(err) throw err;
    callback(user.mybooks);
  });
}

module.exports.newBook = function(email,title,thumbnail,callback){
  User.findOne({email:email},function(err,user){
    if(err) throw err;
    var booklist = user.mybooks.map(function(item){return item.title;});
    if(booklist.indexOf(title)<0){
      user.mybooks.push({'title':title,'thumbnail':thumbnail,'owner':email,'newowner':'',status:false});
      user.save(function(err,result){
        if (err) throw err;
        callback(result);
      });
    }else{
      callback(false);
    }
  });
}

module.exports.deletBook = function(email,title,callback){
  User.findOne({email:email},function(err,user){
    if (err) throw err;
    for (let i=0;i<user.mybooks.length;i++){
      if(user.mybooks[i].title === title){
        user.mybooks.splice(i,1);
        break;
      }
    }
    user.save(function(err,result){
      if(err) throw err;
      callback(result.mybooks);
    });

  });
}



module.exports.allBooks = function(callback){
  User.find({},function(err,users){
    if(err) throw err;
    callback(users);
  });
}

module.exports.transfer = function(owner,title,newowner){
  User.findOne({email:owner},function(err,user){
    if (err) throw err;
    for (let i=0;i<user.mybooks.length;i++){
      if(user.mybooks[i].title === title){
        user.mybooks[i].newowner=newowner;
        console.log(user.mybooks[i])
        user.save(function(err,result){
          if(err) throw err;
        });
        break;
      }
    }
    // user.update(
    //   {'mybooks.title': title},
    //   {'$set': {
    //     'mybooks.$.newowner': newowner
    //   }}, function(err) {
    //   console.log(err)
    });
}

module.exports.cancelTransfer = function(owner,title){
  User.findOne({email:owner},function(err,user){
    if (err) throw err;
    for (let i=0;i<user.mybooks.length;i++){
      if(user.mybooks[i].title === title){
        user.mybooks[i].newowner='';
        console.log(user.mybooks[i])
        user.save(function(err,result){
          if(err) throw err;
          console.log('canceled')
        });
        break;
      }
    }
  });
}

module.exports.acceptTransfer = function(owner,title){
  User.findOne({email:owner},function(err,user){
    if (err) throw err;
    for (let i=0;i<user.mybooks.length;i++){
      if(user.mybooks[i].title === title){
        user.mybooks[i].status=true;
        user.save(function(err,result){
          if(err) throw err;
          console.log('accept')
        });
        break;
      }
    }
  });
}
