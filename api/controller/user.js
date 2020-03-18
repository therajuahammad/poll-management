const User = require('../model/User')

const singupGetController = (req,res)=>{
     res.render('signup');
}

module.exports = {
     singupGetController
}