const request = require('supertest');
const app = require('../app');
const { connectTestDB, clearTestDB, disconnectTestDB } = require('./setup');

beforeAll(async () => await connectTestDB());
afterEach(async () => await clearTestDB());
afterAll(async () => await disconnectTestDB());

describe('Auth Endpoints', () => {

    // ──── REGISTER ────

    it('POST /api/auth/register → should create a new user and return token', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ name: 'Test User', email: 'test@example.com', password: 'password123' });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('token');
        expect(res.body).toHaveProperty('user');
        expect(res.body.user).toHaveProperty('id');
        expect(res.body.user.email).toBe('test@example.com');
    });

    it('POST /api/auth/register → should reject duplicate email', async () => {
        await request(app)
            .post('/api/auth/register')
            .send({ name: 'User 1', email: 'dup@example.com', password: 'password123' });

        const res = await request(app)
            .post('/api/auth/register')
            .send({ name: 'User 2', email: 'dup@example.com', password: 'password456' });

        expect(res.status).toBe(400);
        expect(res.body.message).toMatch(/already exists/i);
    });

    it('POST /api/auth/register → should reject missing fields', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ email: 'no-name@example.com' });

        expect(res.status).toBe(400);
    });

    // ──── LOGIN ────

    it('POST /api/auth/login → should return token for valid credentials', async () => {
        await request(app)
            .post('/api/auth/register')
            .send({ name: 'Login User', email: 'login@example.com', password: 'password123' });

        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'login@example.com', password: 'password123' });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user.email).toBe('login@example.com');
    });

    it('POST /api/auth/login → should reject wrong password', async () => {
        await request(app)
            .post('/api/auth/register')
            .send({ name: 'Wrong PW', email: 'wrong@example.com', password: 'password123' });

        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'wrong@example.com', password: 'wrongpassword' });

        expect(res.status).toBe(400);
    });
});
