const _ = require('lodash');
const request = require('request');

let QuestionModel = require('../models/question');
let AnswerModel = require('../models/answer');
let UserModel = require('../models/user');
let CategoryModel = require('../models/category');

const kuNews = () => {
    return new Promise((resolve, reject) => {
        let url = 'https://ku-gex.herokuapp.com/';
        request( {url, json:true}, (error, response, body) => {
            if(body) {
                resolve(body.slice(0, 5));                
            } else {
                resolve([]);
            }
        });        
    });
};

const getUser = (query) => {
    return new Promise((resolve, reject) => {
        if(_.isEmpty(query)) {
            UserModel.find({}, (err, users) => {
                if (users) {
                    resolve(users);
                } else {
                    reject('No User found')
                }
            });   
        } else {
            UserModel.findOne(query, (err, user) => {
                if (user) {
                    resolve(user);
                } else {
                    reject('No User found')
                }
            });        
        }    
    });    
}

const getQuestion = (query) => {
    return new Promise((resolve, reject) => {
        if(_.isEmpty(query)) {
            QuestionModel.find({}, (err, questions) => {
                if (questions) {
                    resolve(questions);
                } else {
                    reject('No Questions found')
                }
            });   
        } else {
            QuestionModel.findOne(query, (err, questions) => {
                if (questions) {
                    resolve(questions);
                } else {
                    reject('No Questions found')
                }
            });        
        }
    });    
};

const getAnswer = (query) => {
    return new Promise((resolve, reject) => {
        if(_.isEmpty(query)) {
            AnswerModel.find({}, (err, answers) => {
                if (answers) {
                    resolve(answers);
                } else {
                    reject('No answers found')
                }
            });   
        } else {
            AnswerModel.findOne(query, (err, answer) => {
                if (answer) {
                    resolve(answer);
                } else {
                    reject('No answer found')
                }
            });        
        }
    });    
}

const getTags = (query) => {
    return new Promise((resolve, reject) => {
        if(_.isEmpty(query)) {
            CategoryModel.find({}, (err, tags) => {
                if (tags) {
                    resolve(tags);
                } else {
                    reject('No Subject found')
                }
            });   
        } else {
            QuestionModel.findOne(query, (err, tag) => {
                if (tag) {
                    resolve(tag);
                } else {
                    reject('No Subject found')
                }
            });        
        }
    });    
}

const getAll = (data, error) => {
    // info = [questions, users, tags]
    let info = {};
    return new Promise( (resolve, reject) => {
        getQuestion({}).then((questions) => {
            info['questions'] = _.reverse(questions);
            return getUser({});
        }).then((users) => {
            info['users'] = users;
            return getTags({});
        }).then((tags) => {
            info['subjects'] = tags;
            return getAnswer({});
        }).then((answers) => {
            info['answers'] = answers;
            resolve(info);
        }).catch((errMsg) => {
            reject(errMsg);
        });        
    });
};

module.exports = {
    getUser,
    getQuestion,
    getAll,
    getAnswer
}