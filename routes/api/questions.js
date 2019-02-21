const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const auth = require('../auth');
const Questions = mongoose.model('Questions');



//URL : http://localhost:5000/api/questions/list/
//GET current route (required, only authenticated users have access)
router.get('/list', auth.optional, (req, res, next) => {
  //const { payload: { id } } = req;
 
  return Questions.find({}, 'questionText inputType')
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

//URL : http://localhost:5000/api/questions/add/
//{"user":{"email":"jagat@gmail.com","firstName":"jagat","lastName":"singh","password":"12345","role":"OrgOwner"}}
// { "questions" : {
// 	"questionText" : "Do you want to add security question",
//   "inputType": "input",
//   "categoryId": "52"
	
// }
 
//  }
router.post('/add', auth.optional, (req, res, next) => {
    const { body: 
            { 
                questions 
            } 
        } = req;
    console.log("questions: add", questions.questionText);
    if(!questions.questionText) {
      return res.status(422).json({
        errors: {
            questionText: 'is required',
        },
      });
    }
  
    if(!questions.inputType) {
      return res.status(422).json({
        errors: {
            inputType: 'is required',
        },
      });
    }
    const finalQuestion = new Questions(questions);
  
   
  
    return finalQuestion.save()
      .then(() => res.json({ finalQuestion }));
    
  });



  //URL : http://localhost:5000/api/questions/id/update
//GET current route (required, only authenticated users have access)
router.put('/:id/update', auth.optional, (req, res, next) => {
    //const { payload: { id } } = req;
    //console.log('called list', id);
    // const userData = {}; 

     const { body: 
        { 
            questions 
        } 
    } = req;

    //console.log('>>>>qu', questions);
    return Questions.findByIdAndUpdate( req.params.id, questions, { new: true })
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
  
  
  
  //URL : http://localhost:5000/api/questions/id/remove
  //GET current route (required, only authenticated users have access)
  router.delete('/:id/remove', auth.optional, (req, res, next) => {
    //const { payload: { id } } = req;
    //console.log('called list', id);
     
    return Questions.findByIdAndRemove( req.params.id)
      .then((question) => {
       
        if(!question) {
          return res.sendStatus(400);
        }
        //console.log('user >>>', user);
        return res.json({ question });
      }).catch((error) => {
      console.log('get all list failed message:',error.message);
      return res.sendStatus(400);
    });
  });

  

module.exports = router;