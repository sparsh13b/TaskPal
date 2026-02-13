const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use STARTTLS on 587
    logger: true,
    debug: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false // Bypass some cloud handshake restrictions
    },
    connectionTimeout: 15000, // Increase to 15 seconds
});

// Verify connection configuration
transporter.verify((error, success) => {
    if (error) {
        console.error('Mailer Connection Error:', error);
    } else {
        console.log('Mailer is ready to take messages');
    }
});

module.exports = transporter;