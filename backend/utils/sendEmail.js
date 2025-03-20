const nodemailer = require('nodemailer');

const sendEmail = async (email, subject, message) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'sainishubham7627@gmail.com', // Replace with your Gmail
                pass: 'sethrollins1234@'  // Use App Password (if 2FA is enabled)
            }
        });

        const mailOptions = {
            from: 'sainishubham7627@gmail.com',
            to: email,
            subject: subject,
            html: message
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Email not sent:', error);
    }
};

module.exports = sendEmail;
