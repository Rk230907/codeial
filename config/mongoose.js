const mongoose = require('mongoose');
const env = require('../.env');

mongoose.connect('mongodb+srv://iyashpatelp:QwFJdHgTbUh3pPtM@cluster0.o8sgbxg.mongodb.net/?retryWrites=true&w=majority');

const db = mongoose.connection;

db.on('error', console.error.bind(console, "Error connecting to MongoDB"));


db.once('open', function(){
    console.log('Connected to Database :: MongoDB');
});


module.exports = db;