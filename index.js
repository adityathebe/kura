const pug = require('pug');
const path = require('path');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const express = require('express');
const session = require('express-session');
const expressValidator = require('express-validator');
const flash = require('connect-flash');

const app = express();

mongoose.connect('mongodb://localhost/kura');
let db = mongoose.connection;

// Check for Database errors
db.on('error', (err) => {
    console.log(err)
});

// Check for Database connection
db.once('open', () => {
    console.log('Connected to mongoDb')
});

// Bring in Models
let Questions = require('./models/question');
let Answers = require('./models/answer');
let UserModel = require('./models/user');

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json())
app.use(express.static(path.join(__dirname, 'assets')));

// Express Message
app.use(require('connect-flash')());
app.use((req, res, next) => {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

// Express validator middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.');
        var root    = namespace.shift();
        var formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    }
}));

// Express Session Middleware
app.use(session({secret: 'kura_forum_123', resave: true, saveUninitialized: true}));

// Check if user is logged in 
app.use(function(req, res, next) {
    if (req.session && req.session.user) {
        UserModel.findOne({ email: req.session.user.email }, (err, user) => {
            if (user) {
                req.user = user;
                delete req.user.password; // delete the password from the session
                req.session.user = user;  //refresh the session value
                res.locals.user = user;
            }
            // finishing processing the middleware and run the route
            next();
        });
    } else {
        next();
    }
});

// Function to check if user is logged in
function requireLogin (req, res, next) {
    if (!req.user) {
        res.redirect('/login');
    } else {
        next();
    }
};

// Home Page
app.get('/', (req, res) => {
    Questions.find({}, (err, questions) => {
        if (err) {
            console.log(err);
        } else {
            UserModel.find({}, (err, users) => {
                res.render('home', {
                    questions: questions.reverse().slice(0, 10),
                    tags : ['Science','Maths', 'General', 'Computer Science', 'Physics'],
                    users: users
                });
            });            
        }
    });
});

// Route Files
let questionRoute = require('./routes/question');
let answerRoute = require('./routes/answer');
let userRoute = require('./routes/user');
app.use('/questions', questionRoute);
app.use('/answer', answerRoute);
app.use('/user', userRoute);

app.listen(3000, ()=> {
	console.log("listening at port 3000");
});