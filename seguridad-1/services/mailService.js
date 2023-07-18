const nodemailer = require('nodemailer');

const mailServiceFactory = () => {

    const send2FA = async (email, _2FA) => {

        const transporter = nodemailer.createTransport({
            host: "send.one.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.AUTH_MAIL,
                pass: process.env.AUTH_PASS
            }
        });

        const info = await transporter.sendMail({
            from: 'it@mybilingual.net', // sender address
            to: `${email}`, // list of receivers
            subject: "[DEV TEST] Your 2FA code", // Subject line
            html: `<h2>Don't share this with anyone...</h2> <b>${_2FA}</b>`, // html body
        });
    };

    return { send2FA };
};


module.exports = {
    mailServiceFactory,
};
