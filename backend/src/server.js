const app = require('./app');
const connectDB = require('./config/db');
const startTaskCron = require('./jobs/task.cron');

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    startTaskCron();
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
