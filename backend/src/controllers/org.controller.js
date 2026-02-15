const Organization = require('../models/Organization');
const User = require('../models/User');

// Create a new organization
exports.createOrg = async (req, res) => {
    try {
        const { name } = req.body;
        const userId = req.user._id;

        if (!name || !name.trim()) {
            return res.status(400).json({ message: 'Organization name is required' });
        }

        // Create the organization
        const org = await Organization.create({
            name: name.trim(),
            admin: userId,
            members: [userId],
        });

        // Add org to user's list and set as active
        await User.findByIdAndUpdate(userId, {
            $push: { organizations: org._id },
            activeOrganization: org._id,
        });

        const user = await User.findById(userId).select('-password');

        res.status(201).json({
            org: {
                _id: org._id,
                name: org.name,
                inviteCode: org.inviteCode,
                members: org.members,
            },
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                organizations: user.organizations,
                activeOrganization: user.activeOrganization,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Join an existing organization via invite code
exports.joinOrg = async (req, res) => {
    try {
        const { inviteCode } = req.body;
        const userId = req.user._id;

        if (!inviteCode || !inviteCode.trim()) {
            return res.status(400).json({ message: 'Invite code is required' });
        }

        // Find org by invite code
        const org = await Organization.findOne({ inviteCode: inviteCode.trim().toUpperCase() });
        if (!org) {
            return res.status(404).json({ message: 'Invalid invite code' });
        }

        // Check if user is already a member of this specific org
        if (org.members.some(m => m.toString() === userId.toString())) {
            return res.status(400).json({ message: 'You are already a member of this organization' });
        }

        // Add user to org members
        org.members.push(userId);
        await org.save();

        // Add org to user's list and set as active
        await User.findByIdAndUpdate(userId, {
            $push: { organizations: org._id },
            activeOrganization: org._id,
        });

        const populatedOrg = await Organization.findById(org._id)
            .populate('members', 'name');
        const user = await User.findById(userId).select('-password');

        res.json({
            org: {
                _id: populatedOrg._id,
                name: populatedOrg.name,
                inviteCode: populatedOrg.inviteCode,
                members: populatedOrg.members,
            },
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                organizations: user.organizations,
                activeOrganization: user.activeOrganization,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Switch active organization
exports.switchOrg = async (req, res) => {
    try {
        const { orgId } = req.body;
        const userId = req.user._id;

        if (!orgId) {
            return res.status(400).json({ message: 'Organization ID is required' });
        }

        const user = await User.findById(userId);

        // Verify user belongs to this org
        if (!user.organizations.some(o => o.toString() === orgId)) {
            return res.status(403).json({ message: 'You do not belong to this organization' });
        }

        user.activeOrganization = orgId;
        await user.save();

        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                organizations: user.organizations,
                activeOrganization: user.activeOrganization,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all organizations the user belongs to
exports.getMyOrgs = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user.organizations || user.organizations.length === 0) {
            return res.json({ orgs: [], activeOrganization: null });
        }

        const orgs = await Organization.find({ _id: { $in: user.organizations } })
            .populate('admin', 'name')
            .select('name inviteCode admin members createdAt');

        res.json({
            orgs: orgs.map(org => ({
                _id: org._id,
                name: org.name,
                inviteCode: org.inviteCode,
                admin: org.admin,
                memberCount: org.members.length,
            })),
            activeOrganization: user.activeOrganization,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
