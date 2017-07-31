const express = require('express');
const router = express.Router();

// Function to check if user is logged in
function requireLogin (req, res, next) {
    if (!req.session.user) {
        req.flash('info', 'You need to be logged in');
        res.redirect('/user/login');
    } else {
        next();
    }
};

// Bring in Answer Model
let UserModel = require('../models/user');
let QuestionModel = require('../models/question');
let CategoryModel = require('../models/category');

// Register
router.get('/register', (req, res) => {
    res.render('register');
})

// Login
router.get('/login', (req, res) => {
    res.render('login');
})

// Login functionality
router.post('/login', (req, res) => {
    UserModel.findOne({ username: req.body.userName }, (err, user) => {
        if (!user) {
            req.flash('info', 'No user found');
            res.redirect('login');
        } else {
            if (req.body.password === user.password) {
                req.session.user = user;
                req.flash('success', 'Logged in as ' + user.username);
                res.redirect('/user/dashboard');
            } else {
                req.flash('danger', 'Incorrect password');
                res.redirect('login');
            }
        }
    });
});

// Register a New User
router.post('/register', (req, res) => {
    req.checkBody('firstName', 'Invalid First Name').notEmpty().isAlpha();
    req.checkBody('lastName', 'Invalid Last Name').notEmpty();
    req.checkBody('userName', 'Invalid User Name').notEmpty().len(5, 20);
    req.checkBody('password', 'Password must be at least 6 characters long').notEmpty().len(8, 30);
    req.checkBody('email', 'Invalid Email').isEmail();

    var errors = req.validationErrors();

    if (errors) {
        res.render('register', {
            title : 'Sign Up',
            errors: errors
        });
    } else {
        let user = new UserModel({
            username : req.body.userName,
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            gender : req.body.gender,
            email : req.body.email,
            password : req.body.password
        });

        user.save((err) => {
            if(err) {
                return console.log(err);
            } else {
                req.session.user = user;
                req.flash('success', 'Logged In as ' + user.username);
                res.redirect('/');
            }
        });
    }
});

// Logout
router.get('/logout', (req,res) => {
    req.session.destroy(() => {
        res.redirect('/');        
    });
});

// Dashboard
router.get('/dashboard', requireLogin, (req, res) => {
    QuestionModel.find({author : req.user.username}, (err, questions) => {
        if (!questions) {
            res.render('dashboard')
        } else {
            res.render('dashboard', {questions});            
        }
    })
});

// To store categories
router.post('/dashboard', requireLogin, (req, res) => {
    req.checkBody('category', 'Cannot be blank').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        req.flash('info', 'Cannot be blank');
        res.redirect('/user/dashboard');
    } else {
        let user = new CategoryModel({
            name : req.body.category
        });

        user.save((err) => {
            if(err) {
                return console.log(err);
            } else {
                req.flash('success', 'New Category Added');
                res.redirect('/user/dashboard');
            }
        });
    }
})

module.exports = router;