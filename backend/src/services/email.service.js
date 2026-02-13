const resend = require('../config/resend');

exports.sendEmail = async ({ to, task, assignedBy }) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'TaskPal <onboarding@resend.dev>',
      to: [to],
      subject: `New Task Assigned: ${task.title}`,
      html: `
        <h2>You have been assigned a new task</h2>
        <p><strong>Title:</strong> ${task.title}</p>
        <p><strong>Description:</strong> ${task.description}</p>
        <p><strong>Priority:</strong> ${task.priority}</p>
        <p><strong>Due Date:</strong> ${new Date(task.dueDate).toDateString()}</p>
        <p><strong>Assigned By:</strong> ${assignedBy.name} (${assignedBy.email})</p>
        <hr />
        <p>Please log in to TaskPal to view and update your task.</p>
      `,
    });

    if (error) {
      throw new Error(error.message);
    }
    return data;
  } catch (err) {
    console.error('Resend API Error (Task Assignment):', err.message);
    throw err;
  }
};

exports.sendReminderEmail = async ({ to, task }) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'TaskPal <onboarding@resend.dev>',
      to: [to],
      subject: `Reminder: Task Due Soon - ${task.title}`,
      html: `
        <h2>Task Reminder</h2>
        <p>Your task <strong>${task.title}</strong> is due soon.</p>
        <p><strong>Due Date:</strong> ${new Date(task.dueDate).toDateString()}</p>
        <p>Please make sure to complete it on time.</p>      
      `,
    });

    if (error) {
      throw new Error(error.message);
    }
    return data;
  } catch (err) {
    console.error('Resend API Error (Reminder):', err.message);
    throw err;
  }
};