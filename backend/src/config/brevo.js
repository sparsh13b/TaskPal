const axios = require('axios');

const brevoClient = axios.create({
    baseURL: 'https://api.brevo.com/v3',
    headers: {
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json',
        'accept': 'application/json',
    },
});

module.exports = brevoClient;
