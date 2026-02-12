const User = require('../models/User');

exports.getUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;

        // Only return users in the same organization
        const filter = {};
        if (req.user.activeOrganization) {
            filter.organizations = req.user.activeOrganization;
        }

        const [users, total] = await Promise.all([
            User.find(filter)
                .select('_id name email')
                .sort({ name: 1 })
                .skip(skip)
                .limit(limit),
            User.countDocuments(filter)
        ]);

        res.json({ users, total, page, pages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};