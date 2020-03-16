const express = require('express');
const mongoose = require('mongoose');
const app = express();
const Poll = require('./api/model/Poll');
const {
     postCreatePoll,
     getSinglePoll,
     postSinglePoll,
     getAllPoll,
     deletePoll,
     getUpdatePoll,
     postUpdatePoll
} = require('./api/controller/poll');

app.set('view engine', 'ejs');

// Middleware
app.use(express.urlencoded({
     extended: true
}));

app.use(express.json());

app.use('/pub', express.static('public'));

// All Routes

app.get('/test/:id', async (req,res)=>{
     let id  = req.params.id;
     let upVote;
     await Poll.findById(id, (err,result)=>{
          if(err){
               console.log(err);
          }
          result.options.map(opt=> {
               console.log(opt.vote)
          })
     })
})

app.get('/poll/update/:id', getUpdatePoll);

app.post('/poll/update/:id', postUpdatePoll);

app.post('/poll/delete/:id', deletePoll);

app.get('/poll/create', getCreatePoll);

app.post('/poll/create', postCreatePoll);

app.get('/poll/:id', getSinglePoll);

app.post('/poll/:id', postSinglePoll);

app.get('/poll', getAllPoll);

app.get('/', getAllPoll);

// DB Connection & Listen
let connectURL = process.env.MONGODB_URI || 'mongodb://localhost/';
let PORT = process.env.PORT || 3001;
mongoose.connect(connectURL + 'heroku_pqn0q0kn', {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useFindAndModify: false
     })
     .then(() => {
          app.listen(PORT, () => {
               console.log('Application Ready with PORT '+ PORT);
          })
     })
     .catch(err => console.log(err));