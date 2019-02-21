const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const auth = require('../auth');
const Users = mongoose.model('Users');

//POST new user route (optional, everyone has access)
//URL : http://localhost:5000/api/users/
router.post('/', auth.optional, (req, res, next) => {
  const { body: { user } } = req;

  if(!user.email) {
    return res.status(422).json({
      errors: {
        email: 'is required',
      },
    });
  }

  if(!user.password) {
    return res.status(422).json({
      errors: {
        password: 'is required',
      },
    });
  }

  const finalUser = new Users(user);

  finalUser.setPassword(user.password);

  return finalUser.save()
    .then(() => res.json({ user: finalUser.toAuthJSON() }));
});
 
//POST login route (optional, everyone has access)
router.post('/authenticate', auth.optional, (req, res, next) => {
  const { body: { user } } = req;

  if(!user.email) {
    return res.status(422).json({
      errors: {
        email: 'is required',
      },
    });
  }

  if(!user.password) {
    return res.status(422).json({
      errors: {
        password: 'is required',
      },
    });
  }

  return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
    if(err) {
      return next(err);
    }
    
    if(passportUser) {
      const user = passportUser;
      user.token = passportUser.generateJWT();
      console.log(passportUser);

      console.log('>>>>>>>>',user.toAuthJSON());
      return res.json(user.toAuthJSON());
    }
    //return res.status(400).info;
    return res.status(400).json(info);

  })(req, res, next);
});


//POST login route (optional, everyone has access)
//URL : http://localhost:5000/api/users/register/
//{"user":{"email":"jagat@gmail.com","firstName":"jagat","lastName":"singh","password":"12345","role":"OrgOwner"}}
router.post('/register', auth.optional, (req, res, next) => {
  const { body: { user } } = req;
  console.log("register: ", req);
  if(!user.email) {
    return res.status(422).json({
      errors: {
        email: 'is required',
      },
    });
  }

  if(!user.password) {
    return res.status(422).json({
      errors: {
        password: 'is required',
      },
    });
  }
  const finalUser = new Users(user);

  finalUser.setPassword(user.password);

  return finalUser.save()
    .then(() => res.json({ finalUser }));
  
});

//URL : http://localhost:5000/api/users/list/
//GET current route (required, only authenticated users have access)
router.get('/list', auth.optional, (req, res, next) => {
  //const { payload: { id } } = req;
  //console.log('called list', id);
  return Users.find({}, 'firstName lastName email role')
    .then((user) => {
     
      if(!user) {
        return res.sendStatus(400);
      }
      
      return res.json({ user });
    }).catch((error) => {
    console.log('get all list failed message:',error.message);
    return res.sendStatus(400);
  });
});



//URL : http://localhost:5000/api/users/id/update
//GET current route (required, only authenticated users have access)
router.put('/:id/update', auth.optional, (req, res, next) => {
  //const { payload: { id } } = req;
  //console.log('called list', id);
   const userData = {}; 
  return Users.findByIdAndUpdate( req.params.id, userData, { new: true })
    .then((user) => {
     
      if(!user) {
        return res.sendStatus(400);
      }
      //console.log('user >>>', user);
      return res.json({ user });
    }).catch((error) => {
    console.log('get all list failed message:',error.message);
    return res.sendStatus(400);
  });
});



//URL : http://localhost:5000/api/users/id/remove
//GET current route (required, only authenticated users have access)
router.delete('/:id/remove', auth.optional, (req, res, next) => {
  //const { payload: { id } } = req;
  //console.log('called list', id);
   
  return Users.findByIdAndRemove( req.params.id)
    .then((user) => {
     
      if(!user) {
        return res.sendStatus(400);
      }
      //console.log('user >>>', user);
      return res.json({ user });
    }).catch((error) => {
    console.log('get all list failed message:',error.message);
    return res.sendStatus(400);
  });
});


//GET current route (required, only authenticated users have access)
router.get('/current', auth.required, (req, res, next) => {
  const { payload: { id } } = req;

  return Users.findById(id)
    .then((user) => {
      if(!user) {
        return res.sendStatus(400);
      }
      
      return res.json({ user: user.toAuthJSON() });
    });
});

/////////// New APIA

router.get('/:id', auth.required, (req, res, next) => {
  //const { payload: { id } } = req;
  console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>payload ', req.params.id);
  return Users.findById(req.params.id)
    .then((user) => {
      if(!user) {
        return res.sendStatus(400);
      }

      return res.json({ user: user.toAuthJSON() });
    }).catch((err) => {
      console.log('get by id failed message:',err.message);
      return res.sendStatus(400);
    });
}); 



module.exports = router;