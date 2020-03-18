const express = require('express');
const mongoose = require('mongoose');

const app = express();

const pollRoute = require('./api/routes/poll')
const userRoute = require('./api/routes/user')

const {
     getAllPoll
} = require('./api/controller/poll');

app.set('view engine', 'ejs');

// Middleware
app.use(express.urlencoded({
     extended: true
}));

app.use(express.json());

app.use('/pub', express.static('public'));

app.use('/poll', pollRoute);

app.use('/user', userRoute);

app.get('/', getAllPoll);

// DB Connection & Listen
let connectURL = process.env.MONGODB_URI || 'mongodb://localhost/poll-app';
let PORT = process.env.PORT || 3001;

mongoose.connect(connectURL, {
     useNewUrlParser: true,
     useUnifiedTopology: true,
     useFindAndModify: false
});

mongoose.connection.on('error', ()=>{
     console.log("Database Connection Error")
});

mongoose.connection.once('open', ()=>{
     console.log("Database Connect Successfully")
});

app.listen(PORT, () => {
     console.log('Application Ready with PORT ' + PORT);
});