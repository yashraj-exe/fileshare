const res = require('express/lib/response');
const nodemailer = require('nodemailer');

async function sendMail({from, to, subject, text, html}){

    const transporter = nodemailer.createTransport({
        host : process.env.SMTP_HOST,
        port : process.env.SMTP_PORT,
        secure : false, // if true then use port = 465
        auth : {
            user :process.env.SMTP_USER,
            pass:process.env.SMTP_PASS 
        }

    })

    let info = await transporter.sendMail({
        from,
        to,
        subject,
        text,
        html

    })

}

module.exports = sendMail;