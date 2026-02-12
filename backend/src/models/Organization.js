const mongoose = require('mongoose');
const crypto = require('crypto');

const organizationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        inviteCode: {
            type: String,
            unique: true,
            default: () => crypto.randomBytes(4).toString('hex').toUpperCase(),
        },

        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    { timestamps: true }
);

// module exports
module.exports = mongoose.model('Organization', organizationSchema);
