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
let AnswerModel = require('../models/answer');

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
                res.redirect('/user/'+user.username);
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
    req.checkBody('lastName', 'Invalid Last Name').notEmpty().isAlpha();
    req.checkBody('userName', 'Invalid User Name').notEmpty().noSpaces().len(5, 20);
    req.checkBody('password', 'Password must be at least 6 characters long').notEmpty().len(8, 30);
    req.checkBody('email', 'Invalid Email').isEmail();

    UserModel.findOne({username: req.body.userName}, (err, user) => {
        if(!user) {
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
                    password : req.body.password,
                    year: req.body.year,
                    semester : req.body.semester,
                    faculty : req.body.faculty
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
        } else {
            req.flash('danger', 'User with that username already exists');
            res.redirect('/user/register');
        }
    })

    
});

// Logout
router.get('/logout', (req,res) => {
    req.session.destroy(() => {
        res.redirect('/');        
    });
});

// Edit profile
router.get('/edit', requireLogin, (req, res) => {
    res.render('edit_profile');
});

// Edit account
router.get('/account', requireLogin, (req, res) => {
    res.render('edit_account');
})

// Edit Profile
router.post('/edit', requireLogin, (req, res) => {
    req.checkBody('firstname', 'Invalid First Name').notEmpty().isAlpha();
    req.checkBody('lastname', 'Invalid Last Name').notEmpty();
    req.checkBody('bio', 'Too Long Description').len(0, 160);
    
    UserModel.findOne({_id: req.user._id}, (err, user) => {
        if(err) {
            return console.log(err);
        }

        user.firstname = req.body.firstname;
        user.lastname = req.body.lastname;
        user.year = req.body.year;
        user.semester = req.body.semester;
        user.imgsrc = req.body.imgsrc;
        user.bio = req.body.bio;

        user.save((err, newuser) => {
            if(err) {
                console.log(err);
                req.flash('info', 'Could not update profile');
            } else {
                req.flash('success', 'Successfully edited');                
            }
            res.redirect('/user/'+user.username);
        })
    });
});

// Display Single User Profile
router.get('/:username', (req, res) => {
    UserModel.findOne({username: req.params.username}, (err, user) => {
        if(user) {
            QuestionModel.find({author : req.params.username}, (err, question) => {
                if (err) {
                    console.log(err);
                } else {
                    let totalVotes = 0;
                    for(q of question) {
                        totalVotes += q.votes;
                    }
                    AnswerModel.find({author: req.params.username}, (err, answers) => {
                        res.render('userinfo', {
                            questions: question,
                            answers: answers,
                            user : user,
                            votes: totalVotes
                        });
                    });
                }
            });
        } else {
            req.flash('info', 'No User found');
            res.redirect('/');
        }
    }); 
});


module.exports = router;