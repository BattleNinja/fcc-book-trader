var express = require('express');
var router = express.Router();
var books = require('google-books-search');
var User = require('../models/user');

router.get('/booklist/:email',function(req,res){
  User.getBooklist(req.params.email,function(booklist){
    res.json(booklist);
  });
});

// ------------------Add a new Book----------------------//
router.get('/search',function(req,res){
  var options = {
      key: "AIzaSyAjfxHl3fkpwczGU6GpoblwbJGl8s4F7hU",
      field: 'title',
      offset: 0,
      limit: 1,
      type: 'books',
      lang: 'en'
    };
  books.search(req.query.bookName, options, function(error, results, apiResponse) {
      if ( !error ) {
        if(results){
          User.newBook(req.query.email,results[0].title,results[0].thumbnail,function(user){
            if(user){
              res.json(user.mybooks);
            }else{
              res.end();
            }
          });
        }
      } else {
          console.log(error);
      }
  });
})
// ------------------Delet a Book----------------------//
router.get('/delet',function(req,res){
  if(req.query.email&&req.query.title){
    let email = req.query.email;
    let title = req.query.title;
    User.deletBook(email,title,function(result){
      res.json(result);
    })
  }
});


// ------------------Get All Books----------------------//
router.get('/allbooks',function(req,res){
  User.allBooks(function(users){
    let booklist = [];
    users.map(function(user,index){
      booklist=booklist.concat(user.mybooks)
    });
    res.send(booklist);

  });
});
// ------------------Transfer request----------------------//
router.get('/transfer',function(req,res){
  let owner = req.query.owner;
  let title = req.query.title;
  let newowner = req.query.newowner;

  User.transfer(owner,title,newowner);
  res.end()
});
// ------------------cancel transfer request----------------------//
router.get('/canceltransfer',function(req,res){
  let owner = req.query.owner;
  let title = req.query.title;
  User.cancelTransfer(owner,title);
  User.allBooks(function(users){
    let booklist = [];
    users.map(function(user,index){
      booklist=booklist.concat(user.mybooks)
    });
    res.send(booklist);

  });
});
// ------------------accept transfer request----------------------//
router.get('/accepttransfer',function(req,res){
  let owner = req.query.owner;
  let title = req.query.title;
  User.acceptTransfer(owner,title);
  res.end();
});






module.exports = router;
