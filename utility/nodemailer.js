const nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
        user: 'kuraforum@gmail.com',
        pass: 'kuraforum123'
    }
});

const sendMail = (data) => {
    // setup email data with unicode symbols
    let mailOptions = {
        from: '"KURA 👻" <noreply@kura.com>', // sender address
        to: data.receiver, // list of receivers
        subject: data.subject || 'Kura Update', // Subject line
        text: data.body, // plain text body
        // html: '<b>Hello There</b>' // html body
    };
    return new Promise((resolve, reject) => {

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return reject(error);
            }
            resolve(info);
        });
    });
};

const sendCode = (email, code) => {
    let msgData = {
        receiver : email,
        subject : 'Verification Code - KURA',
        body : `Your Verification code is ${code}`,
    }
    return new Promise((resolve, reject) => {
        sendMail(msgData).then(()=> {
            resolve('A verification Code has been sent to your email.')
        }, (err) => {
            reject('Error Sending Code');
        });
    });
}

const sendPass = (email, user, pass) => {
    let msgData = {
        receiver : email,
        subject : 'Password - KURA',
        body : `Hi ${user}, your Password is ${pass}`,
    }
    return new Promise((resolve, reject) => {
        sendMail(msgData).then(()=> {
            resolve('Password has been sent to your email');
        }, (err) => {
            console.log('Node Mailer Error:\n' + err)
            reject('Error Sending Password');
        });
    });
};

module.exports = {
    sendCode,
    sendPass
}