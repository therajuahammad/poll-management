const route = require('express').Router();

const {
     postCreatePoll,
     getSinglePoll,
     postSinglePoll,
     getAllPoll,
     deletePoll,
     getUpdatePoll,
     postUpdatePoll
} = require('../controller/poll');


route.get('/update/:id', getUpdatePoll);

route.post('/update/:id', postUpdatePoll);

route.post('/delete/:id', deletePoll);

route.get('/create', getCreatePoll);

route.post('/create', postCreatePoll);

route.get('/:id', getSinglePoll);

route.post('/:id', postSinglePoll);

route.get('/', getAllPoll);

module.exports = route