const request = require('supertest');
const app = require('../app');
const { connectTestDB, clearTestDB, disconnectTestDB } = require('./setup');

beforeAll(async () => await connectTestDB());
afterEach(async () => await clearTestDB());
afterAll(async () => await disconnectTestDB());

// Helper: register a user and return their token + id
async function createUser(data) {
    const res = await request(app)
        .post('/api/auth/register')
        .send(data);
    return { token: res.body.token, id: res.body.user.id };
}

describe('Task Endpoints', () => {

    it('POST /api/tasks → should create a task when authenticated', async () => {
        const assigner = await createUser({
            name: 'Assigner', email: 'assigner@test.com', password: '123456'
        });
        const assignee = await createUser({
            name: 'Assignee', email: 'assignee@test.com', password: '123456'
        });

        const res = await request(app)
            .post('/api/tasks')
            .set('Authorization', `Bearer ${assigner.token}`)
            .send({
                title: 'Write tests',
                description: 'Add Jest + Supertest',
                dueDate: '2026-03-01',
                priority: 'High',
                assignedTo: assignee.id,
            });

        expect(res.status).toBe(201);
        expect(res.body.task).toHaveProperty('title', 'Write tests');
        expect(res.body.task).toHaveProperty('status', 'pending');
    });

    it('POST /api/tasks → should reject without auth token', async () => {
        const res = await request(app)
            .post('/api/tasks')
            .send({ title: 'No auth', dueDate: '2026-03-01', assignedTo: '000000000000' });

        expect(res.status).toBe(401);
    });

    it('POST /api/tasks → should reject missing required fields', async () => {
        const user = await createUser({
            name: 'User', email: 'user@test.com', password: '123456'
        });

        const res = await request(app)
            .post('/api/tasks')
            .set('Authorization', `Bearer ${user.token}`)
            .send({ description: 'No title or dueDate' });

        expect(res.status).toBe(400);
    });

    it('PATCH /api/tasks/:id → should mark task as completed', async () => {
        const assigner = await createUser({
            name: 'Boss', email: 'boss@test.com', password: '123456'
        });
        const assignee = await createUser({
            name: 'Worker', email: 'worker@test.com', password: '123456'
        });

        const taskRes = await request(app)
            .post('/api/tasks')
            .set('Authorization', `Bearer ${assigner.token}`)
            .send({
                title: 'Complete me',
                dueDate: '2026-03-01',
                priority: 'Medium',
                assignedTo: assignee.id,
            });

        const taskId = taskRes.body.task._id;

        const res = await request(app)
            .patch(`/api/tasks/${taskId}`)
            .set('Authorization', `Bearer ${assignee.token}`)
            .send({ status: 'completed' });

        expect(res.status).toBe(200);
        expect(res.body.status).toBe('completed');
    });
});
