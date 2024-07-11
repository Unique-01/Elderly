const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmailCode = async (email, subject, message) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const verificationCode = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: subject,
            html: `<h4>${message}</h4><h2>${verificationCode}</h2>`,
        });

        return verificationCode;
    } catch (error) {
        console.log("Error sending Email", error);
    }
};

module.exports = sendEmailCode;
