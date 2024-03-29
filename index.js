const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*'); // Update with specific origins if needed
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     next();
//   });


const port =process.env.PORT ||8000;
// const PORT = Process.env
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
// used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');

// Setup the chat Server to be used with socket.io
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);

const env = require('./.env');
const logger = require('morgan');

app.use(logger(env.morgan.mode, env.morgan.options));

require('./config/view-helper')(app);

const path = require('path');



chatServer.listen(5001, ()=>{
    console.log('Chat Server is listening on port 5000');
});



const MongoStore = require('connect-mongo');
// const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMware = require('./config/middleware');


// app.use(sassMiddleware({
//     src: './assets/scss',
//     dest: './assets/css',
//     debug: true,
//     outputStyle: 'extended',
//     prefix: '/css'
// }));
app.use(express.urlencoded());

app.use(cookieParser());

app.use(express.static('./assets'));
// make the uploads path available to the browser
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);




// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// mongo store is used to store the session cookie in the db

app.use(session({
    name: 'codeial',
    // TODO change the secret before deployment in production mode
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: MongoStore.create(
        {
            mongoUrl: 'mongodb+srv://iyashpatelp:QwFJdHgTbUh3pPtM@cluster0.o8sgbxg.mongodb.net/?retryWrites=true&w=majority',
            autoRemove: 'disabled'
        
        },
        function(err){
            console.log(err ||  'connect-mongodb setup ok');
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

// use express router
app.use('/', require('./routes'));


app.listen(port, function(err){
    if (err){
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${port}`);
});
