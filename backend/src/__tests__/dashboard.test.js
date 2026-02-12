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

describe('Dashboard Endpoints', () => {

    it('GET /api/dashboard/stats → should return stats for authenticated user', async () => {
        const user = await createUser({
            name: 'Dashboard User', email: 'dash@test.com', password: '123456'
        });

        const res = await request(app)
            .get('/api/dashboard/stats')
            .set('Authorization', `Bearer ${user.token}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('totalTasks');
        expect(res.body).toHaveProperty('tasksAssignedByMe');
        expect(res.body).toHaveProperty('tasksAssignedToMe');
        expect(res.body).toHaveProperty('statusBreakdown');
        expect(res.body.statusBreakdown).toHaveProperty('pending');
        expect(res.body.statusBreakdown).toHaveProperty('completed');
        expect(res.body.statusBreakdown).toHaveProperty('overdue');
    });

    it('GET /api/dashboard/stats → should reject without auth token', async () => {
        const res = await request(app)
            .get('/api/dashboard/stats');

        expect(res.status).toBe(401);
    });
});
