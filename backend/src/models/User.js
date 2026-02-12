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

//  Explicit index for fast email lookups (login/register)
userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);
