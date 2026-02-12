const Task = require('../models/Task');

exports.getDashboardStats = async (req, res) => {
    try {
        const userId = req.user._id;
        const orgId = req.user.activeOrganization;

        // Build org-scoped base filters
        const byMe = { createdBy: userId };
        const toMe = { assignedTo: userId };
        const myTasks = { $or: [{ createdBy: userId }, { assignedTo: userId }] };

        if (orgId) {
            byMe.organization = orgId;
            toMe.organization = orgId;
            myTasks.organization = orgId;
        }

        // Counts
        const [
            totalTasks,
            tasksAssignedByMe,
            tasksAssignedToMe,
            pendingByMe,
            pendingToMe,
            completedTasks,
            overdueTasks,
        ] = await Promise.all([
            Task.countDocuments(myTasks),
            Task.countDocuments(byMe),
            Task.countDocuments(toMe),
            Task.countDocuments({ ...byMe, status: 'pending' }),
            Task.countDocuments({ ...toMe, status: 'pending' }),
            Task.countDocuments({ ...myTasks, status: 'completed' }),
            Task.countDocuments({ ...myTasks, status: 'overdue' }),
        ]);

        // Pending task lists with populated names
        const [pendingByMeList, pendingToMeList] = await Promise.all([
            Task.find({ ...byMe, status: 'pending' })
                .populate('assignedTo', 'name email')
                .select('title priority dueDate assignedTo')
                .sort({ dueDate: 1 })
                .lean(),
            Task.find({ ...toMe, status: 'pending' })
                .populate('createdBy', 'name email')
                .select('title priority dueDate createdBy')
                .sort({ dueDate: 1 })
                .lean(),
        ]);

        // Status breakdown for chart
        const statusBreakdown = {
            pending: pendingByMe + pendingToMe,
            completed: completedTasks,
            overdue: overdueTasks,
        };

        res.json({
            totalTasks,
            tasksAssignedByMe,
            tasksAssignedToMe,
            pendingByMe,
            pendingToMe,
            completedTasks,
            overdueTasks,
            pendingByMeList,
            pendingToMeList,
            statusBreakdown,
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};