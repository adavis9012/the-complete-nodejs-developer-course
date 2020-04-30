const request = require('supertest');
const app = require('../src/app');
const Aufgabe = require('../src/models/aufgabe');
const { userOne, userTwo, userOneID, aufgabeEine, setupDatabase } = require('./fixtures/db');

beforeEach(setupDatabase);

test('should create task for user', async () => {
    const response = await request(app)
        .post('/aufgabe')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({bescreibung: 'From my test'        })
        .expect(201);
    const aufgabe = await Aufgabe.findById(response.body._id);

    expect(aufgabe).not.toBeNull();
    expect(aufgabe.fertig).toEqual(false);
});

test('should fetch user tasks', async () => {
    const response = await request(app)
        .get('/aufgaben')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
    
    expect(response.body.length).toEqual(2);
});

test('should delete propertly the tasks', async () => {
    await request(app)
        .del(`/aufgabe/${aufgabeEine._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);

    const aufgabe = await Aufgabe.find({ owner: userOneID });

    expect(aufgabe.length).toEqual(1)
});

test('should not delete other users tasks', async () => {
    await request(app)
        .del(`/aufgabe/${aufgabeEine._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404);
    
    const aufgabe = await Aufgabe.find({owner: userOneID});
    
    expect(aufgabe.length).toEqual(2);
});

