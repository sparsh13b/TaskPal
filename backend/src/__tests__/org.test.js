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

describe('Organization Endpoints', () => {

    it('POST /api/org/create → should create org and return invite code', async () => {
        const user = await createUser({
            name: 'Admin', email: 'admin@test.com', password: '123456'
        });

        const res = await request(app)
            .post('/api/org/create')
            .set('Authorization', `Bearer ${user.token}`)
            .send({ name: 'Test Company' });

        expect(res.status).toBe(201);
        expect(res.body.org).toHaveProperty('name', 'Test Company');
        expect(res.body.org).toHaveProperty('inviteCode');
        expect(res.body.org.inviteCode).toHaveLength(8);
        expect(res.body.user.activeOrganization).toBeTruthy();
    });

    it('POST /api/org/join → should add user to existing org', async () => {
        // Create admin and org
        const admin = await createUser({
            name: 'Admin', email: 'admin@test.com', password: '123456'
        });
        const orgRes = await request(app)
            .post('/api/org/create')
            .set('Authorization', `Bearer ${admin.token}`)
            .send({ name: 'Join Test' });
        const inviteCode = orgRes.body.org.inviteCode;

        // New user joins
        const member = await createUser({
            name: 'Member', email: 'member@test.com', password: '123456'
        });
        const res = await request(app)
            .post('/api/org/join')
            .set('Authorization', `Bearer ${member.token}`)
            .send({ inviteCode });

        expect(res.status).toBe(200);
        expect(res.body.org.name).toBe('Join Test');
        expect(res.body.org.members).toHaveLength(2);
        expect(res.body.user.activeOrganization).toBeTruthy();
    });

    it('POST /api/org/join → should reject invalid invite code', async () => {
        const user = await createUser({
            name: 'User', email: 'user@test.com', password: '123456'
        });

        const res = await request(app)
            .post('/api/org/join')
            .set('Authorization', `Bearer ${user.token}`)
            .send({ inviteCode: 'FAKE1234' });

        expect(res.status).toBe(404);
    });

    it('Users in same org should only see each other', async () => {
        // Create two orgs with different users
        const adminA = await createUser({ name: 'Admin A', email: 'a@test.com', password: '123456' });
        await request(app).post('/api/org/create').set('Authorization', `Bearer ${adminA.token}`).send({ name: 'Org A' });

        const adminB = await createUser({ name: 'Admin B', email: 'b@test.com', password: '123456' });
        await request(app).post('/api/org/create').set('Authorization', `Bearer ${adminB.token}`).send({ name: 'Org B' });

        // Admin A fetches users — should only see themselves
        const resA = await request(app)
            .get('/api/users')
            .set('Authorization', `Bearer ${adminA.token}`);

        expect(resA.status).toBe(200);
        expect(resA.body.users).toHaveLength(1);
        expect(resA.body.users[0].name).toBe('Admin A');
    });
});
