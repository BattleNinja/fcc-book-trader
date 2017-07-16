var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

router.get('/setting',function(req,res){
  res.render('setting')
});

// ------------------signup----------------------//

router.get('/signup',function(req,res){
  res.render('signup');
});

router.post('/signup',function(req,res){
  req.checkBody('name','Please input your name').notEmpty();
  req.checkBody('email','Please input your email').notEmpty();
  req.checkBody('password','Password should be longer than 4 character').isLength({min:4});
  req.checkBody('password2',"Two Password should be same").equals(req.body.password);
  var errors = req.validationErrors();
  if(errors){
    res.render('signup',{errors:errors});
  } else{
    var user = new User({
      name:req.body.name,
      email:req.body.email,
      password:req.body.password,
      city:null,
      state:null,
      mybooks:[]
    });
    User.createUser(user,function(err,newuser){
      if(err) throw err;
      res.redirect('/user/login');
    });
  }

});


// ------------------Login----------------------//


router.get('/login',function(req,res){
  res.render('login');
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({
      email: username
    }, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, {
          message: 'Incorrect username.'
        });
      }
      User.comparePassword(password, user.password, function(err, isMatch) {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, {
            message: 'Invalid password'
          });
        }
      });
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/user/login',
    failureFlash: true
  }),
  function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    res.redirect('/');
  });


// ------------------Setting----------------------//
router.get('/setting',function(req,res){
  res.render('setting');
});

router.post('/setting',function(req,res){
  if(req.body.submit=='position'){
    User.savePosition(req.user.email,req.body.city,req.body.state,function(result){
      if (result)    res.redirect('/');
    });
  }
// ------------------New password----------------------//


  if(req.body.submit=='password'){
    req.checkBody('password','Password should be longer than 4 character').isLength({min:4});
    req.checkBody('password2',"Two Password should be same").equals(req.body.password);
    User.changePassword(req.user.email,req.body.password,function(err,result){
      if (err) throw err;
      res.redirect('/');
    });
  }
});



// ------------------Log out----------------------//
router.get('/logout', function(req, res) {
  req.logout();
  req.flash('success_msg', 'See you');
  // req.flash('success_msg', 'See you');

  res.redirect('/user/login');
});

// ------------------exports----------------------//
module.exports = router;
