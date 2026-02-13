const { Resend } = require('resend');

// Provide a placeholder in non-production if the key is missing to prevent crash
const apiKey = process.env.RESEND_API_KEY || 're_dummy_key_for_testing';
const resend = new Resend(apiKey);

module.exports = resend;
