const cron = require('node-cron');
const Task = require('../models/Task');
const { sendReminderEmail } = require('../services/email.service');

const startTaskCron = () => {
  // Runs every hour
  cron.schedule('0 * * * *', async () => {
    console.log('Running task cron job...');

    const now = new Date();
    const next24Hours = new Date();
    next24Hours.setHours(now.getHours() + 24);

    try {
      //  Send reminder emails (due in next 24 hours)
      const tasksDueSoon = await Task.find({
        status: 'pending',
        reminderSent: false,
        dueDate: { $gte: now, $lte: next24Hours },
      }).populate('assignedTo', 'email name');

      for (const task of tasksDueSoon) {
        await sendReminderEmail({
          to: task.assignedTo.email,
          task,
        });

        task.reminderSent = true;
        await task.save();
      }

      // Mark overdue tasks
      await Task.updateMany(
        {
          status: 'pending',
          dueDate: { $lt: now },
        },
        {
          status: 'overdue',
        }
      );

      console.log(`Cron completed: reminders=${tasksDueSoon.length}`);
    } catch (error) {
      console.error('Cron job failed:', error.message);
    }
  });
};

module.exports = startTaskCron;
