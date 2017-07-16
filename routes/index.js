var express = require('express');
var router = express.Router();
var books = require('google-books-search');
var User = require('../models/user');

router.get('/', function(req, res) {
  res.render('home');
});


// ------------------All book----------------------//

router.get('/allbooks',function(req,res){
  if(req.user){
      res.render('allbooks');
  }else{
    res.redirect('user/login');
  }
});

// ------------------My Book----------------------//

router.get('/mybooks',function(req,res){
  if(req.user){
      res.render('mybooks');
  }else{
    res.redirect('user/login');
  }
});


module.exports = router;
