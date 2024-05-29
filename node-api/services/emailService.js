const nodemailer = require('nodemailer');
const EmailTemplate = require('../models/EmailTemplate');

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

// Function to send email using a template
const sendEmailWithTemplate = async (templateId, recipient, placeholders) => {
    try {
        // Fetch the email template from the database
        const emailTemplate = await EmailTemplate.findByPk(templateId);
        if (!emailTemplate) {
            throw new Error('Email template not found');
        }

        // Replace placeholders in the template body
        let emailBody = emailTemplate.body;
        for (const [key, value] of Object.entries(placeholders)) {
            const regex = new RegExp(`{${key}}`, 'g');
            emailBody = emailBody.replace(regex, value);
        }

        // Send the email
        const info = await transporter.sendMail({
            from: 'supporttogether@i2gether.com',
            to: recipient,
            subject: emailTemplate.subject,
            text: emailBody
        });

        console.log('Email sent:', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = { sendEmail, sendEmailWithTemplate };
