import { createFakeUser, createTestContext } from './__helpers';

const ctx = createTestContext();

const user1 = createFakeUser();

describe('user', () => {
  test('create', async () => {
    const newUserResult = await ctx.client.request(
      `           
  mutation signUpUser($data: UserCreateWhereInput!){
    signupUser(data: $data) {
      jwt
      refreshToken
    }
  }
  `,
      {
        data: {
          ...user1,
        },
      }
    );
    expect(newUserResult).toHaveProperty('signupUser');
    expect(newUserResult.signupUser).toHaveProperty('jwt');
    expect(newUserResult.signupUser).toHaveProperty('refreshToken');
  });
  test('login', async () => {
    const sessionData = await ctx.client.request(
      `
  mutation Login($data: UserLoginInput!) {
    login(data: $data) {
      jwt
      refreshToken
    }
  }
  `,
      {
        data: {
          email: user1.email,
          password: user1.password,
        },
      }
    );

    expect(sessionData).toHaveProperty('login');
    expect(sessionData.login).toHaveProperty('jwt');
    expect(sessionData.login.jwt).not.toBeNull();
    expect(sessionData.login).toHaveProperty('refreshToken');

    const user = await ctx.client.request(
      `
  query {
    whoami {
      email
      name
    }
  }
  `,
      {},
      {
        Authorization: `Bearer ${sessionData.login.jwt}`,
      }
    );
    expect(user).toHaveProperty('whoami');
    expect(user.whoami).toHaveProperty('email');
    expect(user.whoami).toHaveProperty('name');
  });
});
