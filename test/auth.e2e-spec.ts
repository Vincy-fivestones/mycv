import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { setUpApp } from '../src/setup-app';
describe('Authentication System', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    setUpApp(app);
    await app.init();
  });

  it('handles a signup request', () => {
    const email = 'test6@test.com';
    return (
      request(app.getHttpServer())
        //   .get('/') // make GET request to root route
        //   .expect(200)
        //   .expect('Hello World!');
        .post('/auth/signup')
        .send({ email, password: 'password' })
        .expect(201)
        .then((res) => {
          // contains the response
          const { id, email } = res.body;
          expect(id).toBeDefined();
          expect(email).toEqual(email);
        })
    );
  });
});
