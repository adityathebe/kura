const express = require('express');
const router = express.Router();

// Bring in Answer Model
let AnswerModel = require('../models/answer');

// Post answer
router.post('/post', (req, res) => {
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

module.exports = router;