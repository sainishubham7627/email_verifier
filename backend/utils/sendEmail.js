const nodemailer = require('nodemailer');
require('dotenv').config();  // Load environment variables from .env file

// Function to send email
const sendMail = async (to, subject, text) => {
    try {
        // Create a transporter using Gmail SMTP
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,  // Use environment variable for security
                pass: process.env.EMAIL_PASS   // Use App Password
            }
        });

        // Define the mail options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent:', info.response);
        return { success: true, message: 'Email sent successfully' };
    } catch (error) {
        console.error('❌ Error sending email:', error);
        return { success: false, message: error.message };
    }
};

module.exports = sendMail;
