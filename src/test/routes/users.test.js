const request = require('supertest');
const buildApp = require('../../app');
const UserRepo = require('../../repos/user-repo');
const pool = require('../../pool');
const Context = require('../context');

let context;
// beforeAll make sure it is connected to the database before
// the test runs.
beforeAll(async () => {
  context = await Context.build();
});
// Delete the data records before each test run
beforeEach(async () => {
    await context.reset();
})
// afterAll make sure the connection is closed. 
afterAll(() => {
  return context.close();
});

it('create a user', async () => {
    // Record the count of users before testing.
  const startingCount = await UserRepo.count();
    // Test adding one user to users table.
  await request(buildApp())
    .post('/users')
    .send({ username: 'testuser', bio: 'test bio' })
    .expect(200);

    // Record the count of users after test.
  const finishCount = await UserRepo.count();
  expect(finishCount - startingCount).toEqual(1);
});
