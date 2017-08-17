const express = require('express');
const router = express.Router();

// Bring in Answer Model
let AnswerModel = require('../models/answer');

// Function to check if user is logged in
function requireLogin (req, res, next) {
    if (!req.session.user) {
        req.flash('info', 'You need to be logged in');
        res.redirect('/user/login');
    } else {
        next();
    }
};

// Post answer
router.post('/post', requireLogin, (req, res) => {
    req.checkBody('body', 'body is required').notEmpty();

    // Get Errors
    let errors = req.validationErrors();

    if (errors) {
        res.render('/questions/', {
            errors: errors
        });
    } else {
        let answer = new AnswerModel({
            body : req.body.body,
            author : req.user.username,
            createdAt : new Date(),
            parent : req.body.parent
        });

        answer.save((err) => {
            if(err) {
                return console.log(err);
            } else {
                res.redirect(`/questions/${req.body.parent}`);
            }
        });
    }
});

// Edit Answer
router.post('/edit', requireLogin, (req, res) => {
    req.checkBody('body', 'body is required').notEmpty();
    let errors = req.validationErrors();

    if(errors) {
        req.flash('info', 'You cannot leave the field blank');
        res.redirect('/questions/'+req.body.q_id);
    } else {
        let answer = {};
        answer.body = req.body.body;
        answer.updatedAt = new Date();

        let query = {_id:req.body.a_id}

        AnswerModel.update(query, answer, (err) => {
            if(err) {
                return console.log(err);
            } else {
                res.redirect('/questions/'+req.body.q_id);
            }
        });        
    }
});

// Delete Answer
router.get('/delete/:id', requireLogin, (req, res) => {
    AnswerModel.findById(req.params.id, (err, answer) => {
        if(answer) {
            if(answer.author === req.user.username) {
                AnswerModel.remove({_id:answer.id}, (err, answers) => {
                    if (err) {
                        console.log(err);
                    } else {
                        res.redirect('/questions/'+answer.parent);
                    }
                });
            } else {
                req.flash('danger', 'Unauthorized User');
                res.redirect('/questions/' + req.params.id);
            }
        } else {
            req.flash('danger', 'Invalid Request');
            res.redirect('/questions/');
        }
    });
});

module.exports = router;