const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const { userOne, userOneID, setupDatabase } = require('./fixtures/db');

beforeEach(setupDatabase);

test('should signup a new user', async () => {
    const response = await request(app).post('/user').send({
        name: 'Testen Name',
        email: 'email@email.com',
        passwort: 'MockPasswort777'
    }).expect(201);

    // Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    // Assertons about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'Testen Name',
            email: 'email@email.com',
        },
        token: user.tokens[0].token
    });
    expect(user.passwort).not.toBe('MockPasswort777');
});

test('should login existing user', async () => {
    const response = await request(app).post('/user/login').send({
        email: userOne.email,
        passwort: userOne.passwort
    }).expect(200);
    const user = await User.findById(response.body.user._id);

    expect(response.body.token).toBe(user.tokens[0].token);
});

test('should not login nonexistent user', async () => {
    await request(app).post('/user/login').send({
        email: userOne.email,
        passwort: 'wrongPasswort'
    }).expect(400);
});

test('should get profile for user', async () => {
    await request(app)
        .get('/user/ich')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
});

test('should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/user/ich')
        .send()
        .expect(401);
});

test('should delete account for user', async () => {
    const response = await request(app)
        .del('/user/ich')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
    const user = await User.findById(response.body._id);
    expect(user).toBeNull();
});

test('should not delete account for user', async () => {
    await request(app)
        .del('/user/ich')
        .send()
        .expect(401);
});

test('should upload avatar image', async () => {
    await request(app)
        .post('/user/ich/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'test/fixtures/profile-pic.jpg')
        .expect(200);

    const user = await User.findById(userOneID);
    expect(user.avatar).toEqual(expect.any(Buffer));
});

test('should update valid user fields', async () => {
    await request(app)
        .patch('/user/ich')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({ name: 'New Name' })
        .expect(200);

    const user = await User.findById(userOneID);
    expect(user.name).toEqual('New Name');
});

test('should not update invalid user fields', async () => {
    await request(app)
        .patch('/user/ich')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({ invalidField: 'Mock Value' })
        .expect(400);
});