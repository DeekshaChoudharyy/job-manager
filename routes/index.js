var express = require('express');
var router = express.Router();
const userModel = require('../models/userModel');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('signin', { title: 'Express' });
});

router.get('/signin', function(req, res, next) {
  res.render('signin', { title: 'Express' });
});

router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Express' });
});

router.get('/forgot', function(req, res, next) {
  res.render('forgot', { title: 'Express' });
});


// router.post('/signup', function(req, res, next){
//   const  newuser = new user(req.body);
//    newuser.save()
//   .then(() => res.redirect("/signup"))
//   .catch((err) => res.send(err));
// })

router.post('/signup', async function(req, res, next){
  const  newuser = await userModel.create(req.body);
   newuser.save()
  .then(() => res.redirect("/signin"))
  .catch((err) => res.send(err));
})

router.post('/signin', async function(req, res, next){
  try{
    const {username, password} = req.body;
    const User = await userModel.findOne({username});
    if (User === null){
      return res.send(`User not found. <a href="/signin">Signin<a/>`);
    }
    if (User.password !== password){
      return res.send(`Incorrect Password. <a href="/signin">Signin<a/>`);
    }
    router.get("/profile", async function(req, res, next){
      try{
        const users = await userModel.find();
        res.render("profile", { title: "profile", users});
        // res.json(users);
      }
  
  catch (error){
    res.send(error);
  }
});

router.get("/delete/:id", async function(req, res, next){
  try{
       await userModel.findByIdAndDelete(req.params.id);
       res.redirect("/profile");
  }
  catch (error){
    res.send(error)
  }
});
res.redirect("/profile")
  }
  catch (error){
    res.send(error)
  }
})

router.get("/update/:id", async function(req, res, next){
  try{
  const user = await  userModel.findById(req.params.id);
 res.render("update", {title: "update", user});
}
catch (error){
  res.send(error);
}
});

router.post("/update/:id", async function(req, res, next){
   try{
    await userModel.findByIdAndUpdate(req.params.id, req.body);
    res.redirect("/profile");
   }
   catch (error){
    res.send(error);
   }
})

router.post("/forgot", async function(req,res,next){
  try{
     const user = await userModel.findOne({ email: req.body.email});

     if(user === null){
      return res.send(
        `User not found. <a href="/forgot">Forgot Password</a>`
      )
     }

 res.redirect("/changepassword/" + user._id);

  }
  catch (error){
     res.send(error);
  }
})

router.get("/changepassword/:id", function(req, res, next){
  res.render("changepassword",{
    title: "change password",
    id: req.params.id
  });
});

router.post("/changepassword/:id", async function(req, res, next){
  try{
        await userModel.findByIdAndUpdate(req.params.id ,req.body);
        res.redirect("/signin");
  }
  catch (error){
    res.send(error)
  }
})

router.get("/reset/:id", function(req, res, next){
  res.render("reset", {
    title: "reset password",
    id: req.params.id,
  });
});

router.post("/reset/:id", async function(req, res, next){
  try{
    const {oldpassword, password} = req.body;
    const user = await userModel.findById(req.params.id);
    console.log(user)
    console.log(req.body)
    if (oldpassword == user.password){
      return res.send(`incorrect password , <a href="/reset/<% user._id%>">Reset again</a>`)
    }
    await userModel.findByIdAndUpdate(req.params.id, req.body);
    res.redirect("/profile");
  }
  catch (error){
    res.send(error);
  }
});

module.exports = router;
