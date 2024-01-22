var express = require('express');
var router = express.Router();
const userModel = require("./users");
const localStrategy = require("passport-local");
const passport = require('passport');
passport.use(new localStrategy(userModel.authenticate()));
router.get('/', function(req, res) {
  res.render('index')
});

router.get('/profile',isLoggedIn, function(req, res) {
  res.render('profile');
});

router.post('/register', function (req, res) { 
  var userdata = new userModel({
    username: req.body.username,
    secret: req.body.secret
  });
  userModel.register(userdata, req.body.password)
    .then(function (registereduser) {
      passport.authenticate("local")(req, res, function () {
        res.redirect('/profile');
    })
  } )
})

router.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect:'/'
}),function(req, res){})

router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});


function isLoggedIn(req, res, next) { 
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}


// router.get("/create", async function (req, res, next) {
//   const userdata = await userModel.create({
//     username: "harry",
//     nickname: "krishnoo",
//     description: "I am ur clg mate",
//     catergory: ['quiet', 'innnocent','good','thikthak'],
//   });
//   res.send(userdata);
// });

// router.get("/findone", async function(req, res){
//   var regex = new RegExp("^HaRsh$", 'i');
//   let user = await userModel.findOne({ username:regex });
//   res.send(user);
// })
// router.get("/findall", async function(req, res){
//   let user = await userModel.find();
//   res.send(user);
// })

// router.get("/findcategory", async function(req, res){
//   let user = await userModel.find({catergory:{$all:['node','3JS']}});
//   res.send(user);
// })

// router.get("/date", async function (req, res) {
//   var date1 = new Date('2024-01-22');
//   var date2 = new Date('2024-01-23');
//   let user = await userModel.find({ datecreated: { $gte: date1, $lte: date2 } });
//   res.send(user);
// })

// router.get("/findexist", async function(req, res){
//   let user = await userModel.find({catergory:{$exists: true}});
//   res.send(user);
// })

// router.get("/filteronspecificlength", async function(req, res){
//   let user = await userModel.find({
//     $expr: {
//       $and: [
//         { $gte: [{ $strLenCP: '$nickname' }, 0] },
//         { $lte: [{ $strLenCP: '$nickname' }, 4]}
//       ]
//     }
//   });
//   res.send(user);
// })





// router.get('/failed', function(req, res) {
//   res.send("done");
// });

// router.get('/failed', function(req, res) {
//   req.flash("age", 12);
//   req.flash("name", "Raktim");
//   res.send("done");
// });

// router.get('/check', function(req, res) {
//   console.log(req.flash("age"),req.flash("name"));
//   res.send("chek terminal");
// });

module.exports = router;
