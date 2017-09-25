// Third Party Modules - Dependencies
const pug = require('pug');
const path = require('path');
const http = require('http');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const express = require('express');
const session = require('express-session');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const favicon = require('serve-favicon');
const socketIO = require('socket.io');

// MongoDB Database
let db;
if (process.env.NODE_ENV === 'production') {
    db = mongoose.connect('mongodb://kuraforum:kuraforum123@ds129733.mlab.com:29733/kura', {useMongoClient: true});
} else {
    db = mongoose.connect('mongodb://127.0.0.1/kura', {useMongoClient : true});    
}

// Check for Database connection and errors
db.on('error', (err) => {
    console.log(err)
}).once('open', () => {
    console.log('Connected to mongoDb')
});

// Socket-IO
let app = express();
var server = http.createServer(app);
var io = socketIO(server);
const port = process.env.PORT || 3000;

let visitorsData = {};
io.on('connection', (socket) => {
    socket.on('visitor-data', (data) => {
        visitorsData[socket.id] = data;

        io.emit('updated-stats', getActiveUsers());
    });

    socket.on('disconnect', () => {
        delete visitorsData[socket.id];

        io.emit('updated-stats', getActiveUsers());
    });
});

// get the total active users on our site
function getActiveUsers() {
    return Object.keys(visitorsData).length;
}

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Set Local Variables
app.locals.moment = require('moment');

// Body Parser
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json())

// User Static File
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
app.use(session({secret: 'kura_forum_123', resave: false, saveUninitialized: false}));

// Serve Favicon
app.use(favicon(path.join(__dirname, 'assets', 'image', 'favicon.png')))

// Check if user is logged in
let UserModel = require('./models/user');
app.use((req, res, next) => {
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

// Custom Express validator to not allow spaces
app.use(expressValidator({
    customValidators: {
        noSpaces: function(value) {
            return (value.search(' ')) >= 0 ? false : true;
        }
    }
}));

// Route Files
let indexRoute = require('./routes/index');
let userRoute = require('./routes/user');
let adminRoute = require('./routes/admin');
let answerRoute = require('./routes/answer');
let questionRoute = require('./routes/question');
let searchRoute = require('./routes/search');
app.use('/', indexRoute);
app.use('/user', userRoute);
app.use('/admin', adminRoute);
app.use('/answer', answerRoute);
app.use('/questions', questionRoute);
app.use('/search', searchRoute);

// 404 Errors
app.get('*', (req, res) => {
    res.render('info/404_page');
});

server.listen(port, ()=> {
	console.log(`Listening at port ${port}`);
});