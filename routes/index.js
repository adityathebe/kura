const express = require('express');
const router = express.Router();

// Custom Modules
const DB = require('../utility/db_api');

// Home Page
router.get('/', (req, res) => {
    DB.getAll().then((data) => {
        res.render('home', {
            questions : data.questions,
            users: data.users,
            tags : data.subjects,
            kuNews : data.news
        });
    });
});

// About Us
router.get('/about', (req, res) => {
    res.render('about_us');
});

// Contact Us
router.get('/contact', (req, res) => {
    res.render('contact_us');
});

// Category Page
router.get('/category/:id', (req, res) => {
    let subject = decodeURI(req.params.id);
    Questions.find({category:subject}, (err, questions) => {
        if(err) {
            console.log(err);
        } else {
            res.render('category', {questions, subject});
        }
    });
});

module.exports = router;