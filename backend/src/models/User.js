const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true,
            minlength: 6
        },
        organizations: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Organization'
            }
        ],
        activeOrganization: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Organization',
            default: null
        }
    },

    { timestamps: true }
);

// module exports
module.exports = mongoose.model('User', userSchema);
