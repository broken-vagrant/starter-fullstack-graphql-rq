import { createTestContext } from './__helpers'

const ctx = createTestContext()

it('ensure that a user can be created and logged in/out', async () => {
  const newUserResult = await ctx.client.request(`           
  mutation {
    signupUser(data: { email: "1@gmail.com", name: "one",password: "123"}) {
      jwt
      refreshToken
    }
  }
  `)
  expect(newUserResult).toHaveProperty('signupUser');
  expect(newUserResult.signupUser).toHaveProperty('jwt');
  expect(newUserResult.signupUser).toHaveProperty('refreshToken');

  const loggedUser = await ctx.client.request(
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
        email: '1@gmail.com',
        password: '123',
      },
    },
  )

  expect(loggedUser).toHaveProperty('login');
  expect(loggedUser.login).toHaveProperty('jwt');
  expect(loggedUser.login.jwt).not.toBeNull();
  expect(loggedUser.login).toHaveProperty('refreshToken');

  const user = await ctx.client.request(`
  query {
    whoami {
      email
      name
    }
  }
  `,
    {},
    {
      Authorization: `Bearer ${loggedUser.login.jwt}`,
    },
  )
  expect(user).toMatchInlineSnapshot(`
    Object {
      "whoami": Object {
        "email": "1@gmail.com",
        "name": "one",
      },
    }
  `)
})
