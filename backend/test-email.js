const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function testEmail() {
  try {
    await transporter.sendMail({
      from: `"Task Manager Test" <${process.env.EMAIL_USER}>`,
      to: '22102111@mail.jiit.ac.in', // send to yourself
      subject: '✅ Email Test Successful',
      text: 'If you received this, Nodemailer is working.',
    });

    console.log('✅ Test email sent successfully');
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
  }
}

testEmail();
