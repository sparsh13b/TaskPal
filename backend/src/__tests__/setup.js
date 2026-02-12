const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

if (!process.env.JWT_SECRET) process.env.JWT_SECRET = 'backend-test-secret-123';

let mongoServer;

async function connectTestDB() {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
}

async function clearTestDB() {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
}

async function disconnectTestDB() {
    await mongoose.disconnect();
    await mongoServer.stop();
}

module.exports = { connectTestDB, clearTestDB, disconnectTestDB };
