const Poll = require('../model/Poll')

getCreatePoll = (req, res) => {
     res.render('createPoll');
}

postCreatePoll = async (req, res) => {
     let {
          title,
          description,
          options
     } = req.body;

     options = options.map(opt => {
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


     try {
          await poll.save();
          res.redirect('/poll');
     } catch (e) {
          console.log(e)
     }
}


getSinglePoll = async (req, res) => {
     let id = req.params.id;
     try {
          let singlePoll = await Poll.findById(id);
          let options = [...singlePoll.options];
          let results = [];
          options.forEach(option => {
               let percentage = (option.vote * 100) / singlePoll.totalVote;

               results.push({
                    ...option._doc,
                    percentage: percentage ? percentage : 0
               });
          })

          res.render('singlePoll', {
               singlePoll,
               results
          });
     } catch (e) {
          console.log(e)
     }
}

postSinglePoll = async (req, res) => {
     let id = req.params.id
     let optionId = req.body.option
     try {
          let poll = await Poll.findById(id)
          let options = [...poll.options]

          let index = options.findIndex(o => o.id === optionId)
          options[index].vote = options[index].vote + 1

          let totalVote = poll.totalVote + 1

          await Poll.findOneAndUpdate({
               _id: poll._id
          }, {
               $set: {
                    options,
                    totalVote
               }
          })

          res.redirect('/poll/' + id)

     } catch (e) {
          console.log(e)
     }
}

getAllPoll = async (req, res) => {
     try {
          let polls = await Poll.find();
          res.render('poll', {
               polls
          });
     } catch (e) {
          console.log(e)
     }
}

deletePoll = (req, res) => {
     let id = req.params.id;
     try {
          Poll.findByIdAndRemove(id).exec();
          res.redirect('/poll')
     } catch (e) {
          console.log(e)
     }
}

getUpdatePoll = async (req, res) => {
     let id = req.params.id;

     try {
          let updateSinglePoll = await Poll.findById(id);

          res.render('updatePoll', {
               updateSinglePoll
          });
     } catch (err) {
          console.log(err)
     }
}

postUpdatePoll = async (req, res) => {
     let id = req.params.id;
     let {
          title,
          description,
          options
     } = req.body;

     let poll = await Poll.findById(id); 
     let upOptions = [...poll.options]

     upOptions.map(option=>{
          return {
               vote: option.vote
          }
     })

     options = options.map(upOpt => {
          return {
               name: upOpt,
               ...upOptions
          }
     })

     try {
          await Poll.findOneAndUpdate({
               _id: id
          }, {
               $set: {
                    title,
                    description,
                    options
               }
          })

          res.redirect('/poll/' + id)

     } catch (err) {
          console.log(err)
     }
}

module.exports = {
     getCreatePoll,
     postCreatePoll,
     getSinglePoll,
     postSinglePoll,
     getAllPoll,
     deletePoll,
     getUpdatePoll,
     postUpdatePoll
}