const route = require('express').Router()
const bcrypt = require('bcrypt')
const {singupGetController} = require('../controller/user')

route.get('/signup',singupGetController);

route.post('/signup', (req,res)=>{
     let {name, email, password}  = req.body;

     bcrypt.hash(password, 10, async function(err, hash) {
          if(err){
               console.log(err)
          }

          let user = new User({
               name,
               email,
               password: hash
          });

          try{
               await user.save();

               res.redirect('/poll')

          }catch(err){
               console.log(err)
          }
     });
});

module.exports = route