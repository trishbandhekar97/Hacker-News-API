const supertest = require('supertest');

const app = require('./app');
const { request } = require('express');
const connectDB = require('../db/db');

describe('App', () => {
  afterAll(() => {
    connectDB.close();
  });
  it('Should respond with a message', async () => {
    const response = await supertest(app)
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.message).toEqual('HackerNews API');
  });
});

describe('/top-stories', () => {
  it('Should have 10 stories', async () => {
    const response = await supertest(app)
      .get('/top-stories')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.count).toEqual(10);
  });
});

describe('/comments', () => {
  it('Should have 10 items', async () => {
    const response = await supertest(app)
      .get('/comments/8863')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.count).toEqual(10);
  }, 30000);
});
