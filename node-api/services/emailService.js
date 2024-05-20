const nodemailer = require('nodemailer');

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
    host: 'mail.i2gether.com',
    port: 587,
    secure: false,
    auth: {
        user: 'supporttogether@i2gether.com',
        pass: '!BadPassw0rd'
    }
});

// Function to send email
const sendEmail = async (recipient, subject, text) => {
    try {
        const info = await transporter.sendMail({
            from: 'supporttogether@i2gether.com',
            to: recipient,
            subject,
            text
        });

        console.log('Email sent:', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = { sendEmail };
