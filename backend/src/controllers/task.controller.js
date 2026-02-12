const Task = require('../models/Task');
const User = require('../models/User');
const { sendEmail } = require('../services/email.service');

// creating a new task
exports.createTask = async (req, res) => {
    try {
        const { title, description, dueDate, priority, assignedTo } = req.body;

        if (!title || !dueDate || !assignedTo) {
            return res.status(400).json({ message: 'Required fields missing' });
        }

        // check if assigned user exists
        const userExists = await User.findById(assignedTo);
        if (!userExists) {
            return res.status(404).json({ message: 'Assigned user not found' });
        }

        const task = await Task.create({
            title,
            description,
            dueDate,
            priority,
            assignedTo,
            createdBy: req.user._id,
            organization: req.user.activeOrganization
        });

        const populatedTask = await Task.findById(task._id)
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email');

        sendEmail({
            to: populatedTask.assignedTo.email,
            task: populatedTask,
            assignedBy: populatedTask.createdBy,
        }).catch(err => {
            console.error('Email send failed:', err.message);
        });

        res.status(201).json({
            message: 'Task created successfully',
            task: populatedTask
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// get tasks (paginated)
exports.getTasks = async (req, res) => {
    try {
        const { status, priority, assignee } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const filter = {};
        if (status) filter.status = status;
        if (priority) filter.priority = priority;
        if (assignee) filter.assignedTo = assignee;
        if (req.user.activeOrganization) filter.organization = req.user.activeOrganization;

        const [tasks, total] = await Promise.all([
            Task.find(filter)
                .populate('assignedTo', 'name email')
                .populate('createdBy', 'name email')
                .sort({ dueDate: 1 })
                .skip(skip)
                .limit(limit),
            Task.countDocuments(filter)
        ]);

        res.json({ tasks, total, page, pages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// update task
exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (
            task.createdBy.toString() !== req.user._id.toString() &&
            task.assignedTo.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const updates = req.body;
        Object.assign(task, updates);

        await task.save();
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};






