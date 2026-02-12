const transporter = require('../config/mailer');

exports.sendEmail = async ({ to, task, assignedBy }) => {
  const mailOptions = {
    from: `"${assignedBy.name} via TaskPal" <${process.env.EMAIL_USER}>`,
    to,
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
  };

  await transporter.sendMail(mailOptions);
};

exports.sendReminderEmail = async ({ to, task }) => {
  const mailOptions = {
    from: `"TaskPal" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Reminder: Task Due Soon - ${task.title}`,
    html: `
        <h2>Task Reminder</h2>
        <p>Your task <strong>${task.title}</strong> is due soon.</p>
        <p><strong>Due Date:</strong> ${new Date(task.dueDate).toDateString()}</p>
        <p>Please make sure to complete it on time.</p>      
        `,
  };
  await transporter.sendMail(mailOptions);
};