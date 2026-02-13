const brevoClient = require('../config/brevo');

exports.sendEmail = async ({ to, task, assignedBy }) => {
  try {
    const response = await brevoClient.post('/smtp/email', {
      sender: { name: 'TaskPal', email: process.env.EMAIL_USER },
      to: [{ email: to }],
      subject: `New Task Assigned: ${task.title}`,
      htmlContent: `
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
    return response.data;
  } catch (err) {
    console.error('Brevo API Error (Task Assignment):', err.response?.data || err.message);
    throw err;
  }
};

exports.sendReminderEmail = async ({ to, task }) => {
  try {
    const response = await brevoClient.post('/smtp/email', {
      sender: { name: 'TaskPal', email: process.env.EMAIL_USER },
      to: [{ email: to }],
      subject: `Reminder: Task Due Soon - ${task.title}`,
      htmlContent: `
        <h2>Task Reminder</h2>
        <p>Your task <strong>${task.title}</strong> is due soon.</p>
        <p><strong>Due Date:</strong> ${new Date(task.dueDate).toDateString()}</p>
        <p>Please make sure to complete it on time.</p>      
      `,
    });
    return response.data;
  } catch (err) {
    console.error('Brevo API Error (Reminder):', err.response?.data || err.message);
    throw err;
  }
};