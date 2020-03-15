const express = require('express');
const mongoose = require('mongoose');

const app = express();
const Poll = require('./db/db');

app.set('view engine', 'ejs');


app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use('/pub',express.static('public'));

app.get('/poll/create',(req,res)=>{
     res.render('createPoll');
});

app.post('/poll/create', async (req,res)=>{   
     let {title,description, options} = req.body;

     options = options.map(opt=>{
          return {
               name: opt,
               vote: 0
          }
     });

     let poll = new Poll({
          title,
          description,
          options
     });


     try{
          await poll.save();
          res.redirect('/poll');
     }catch (e){
          console.log(e)
     }
});


app.get('/poll/:id', async (req,res)=>{
     let id = req.params.id;
     try{
          let singlePoll = await Poll.findById(id);
          let options = [...singlePoll.options];
          let results = [];
          options.forEach(option=>{
               let percentage = (option.vote * 100) / singlePoll.totalVote;

               results.push({
                    ...option._doc,
                    percentage: percentage ? percentage : 0
               });
          })
          
          res.render('singlePoll', {singlePoll,results});
     }catch(e){
          console.log(e)
     }
})

app.post('/poll/:id', async (req,res)=>{
     let id = req.params.id
    let optionId = req.body.option
    try {   
        let poll = await Poll.findById(id)
        let options = [...poll.options]

        let index = options.findIndex(o => o.id === optionId)
        options[index].vote = options[index].vote + 1

        let totalVote = poll.totalVote + 1

        await Poll.findOneAndUpdate(
            { _id: poll._id },
            {$set: {options, totalVote}}
        )

        res.redirect('/poll/' + id)

    } catch (e) {
        console.log(e)
    }
})


app.get('/poll', async (req,res)=>{
     try{
          let polls = await Poll.find();
          res.render('poll', {polls});
     } catch(e){
          console.log(e)
     }
});


app.get('/', async (req,res)=>{
     try{
          let polls = await Poll.find();
          res.render('poll', {polls});
     } catch(e){
          console.log(e)
     }
});

mongoose.connect('mongodb://localhost/poll', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
.then(()=>{
     app.listen(4444,()=>{
          console.log('Application Ready with PORT 4444');
     })
})
.catch(err=>console.log(err));
