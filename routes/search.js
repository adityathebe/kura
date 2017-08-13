const express = require('express');
const router = express.Router();

// Custom Modules
const DB = require('../utility/db_api');

// Importing Models
let Questions = require('../models/question');

const _ = require('lodash');

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

// Search
router.get("/", (req, res) => {
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Questions.find({ "title": regex }, (err, found) => {
            if(err) {
               console.log(err);
            } else {
                DB.getAll().then((data) => {
                    if(_.isEmpty(found)) {
                        req.flash('info', 'No result found!');
                    } 
                    res.render('home', {
                        questions: found, 
                        users: data.users,
                        tags : data.subjects,
                        kuNews : data.news,
                    });
                }, (errMsg) => {
                    console.log(errMsg);
                });
           }
       }); 
    } else {
        res.redirect('/');
    }
});

module.exports = router;