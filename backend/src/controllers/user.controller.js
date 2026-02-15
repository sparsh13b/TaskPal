const User = require('../models/User');

exports.getUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;

        // Strictly enforce organization filtering
        const filter = {};
        if (req.user.activeOrganization) {
            filter.organizations = req.user.activeOrganization;
        } else {
            // If no organization is selected, return nothing to prevent global leaks
            return res.json({ users: [], total: 0, page, pages: 0 });
        }

        const [users, total] = await Promise.all([
            User.find(filter)
                .select('_id name') // STRIP EMAIL: Only return name for UI selection
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