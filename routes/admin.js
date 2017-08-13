const express = require('express');
const router = express.Router();

// Custom Modules
const DB = require('../utility/db_api');

// Function to check if user is logged in
function requireLogin (req, res, next) {
    if (!req.user) {
        res.redirect('/user/login');
    } else {
        next();
    }
};

// Admin
router.get('/', requireLogin, (req, res) => {
    if(req.user.admin) {
        let info = [];
        DB.getAll().then((data) => {
            res.render('admin', {
                questions : data.questions,
                users: data.users,
                subjects : data.subjects,
                kuNews : data.news,
                answers : data.answers,
            });
        });
    } else {
        req.flash('info', 'Unauthorised User');
        res.redirect('/');
    }
});

// To store categories
router.post('/', requireLogin, (req, res) => {
    req.checkBody('name', 'Cannot be blank').notEmpty();
    req.checkBody('stream', 'Cannot be blank').notEmpty();
    req.checkBody('year', 'Cannot be blank').isInt();
    req.checkBody('semester', 'Cannot be blank').isInt();

    var errors = req.validationErrors();

    if (errors) {
        req.flash('info', 'Cannot be blank');
        res.redirect('/admin');
    } else {
        let user = new CategoryModel({
            name : req.body.name,
            stream : req.body.stream,
            year : req.body.year,
            sem : req.body.semester
        });

        user.save((err) => {
            if(err) {
                return console.log(err);
            } else {
                req.flash('success', 'New Category Added');
                res.redirect('/admin');
            }
        });
    }
});

module.exports = router;