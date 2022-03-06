import { createTestContext } from './__helpers'

const ctx = createTestContext()

it('ensure that a user can be created and logged in/out', async () => {
  const newUserResult = await ctx.client.request(`            # 1
  mutation {
  signupUser(data: { email: "2@gmail.com", name: "two",password: "123", posts: [] }) {
    name
    email
  }
}

  `)
  expect(newUserResult).toMatchInlineSnapshot(`
    Object {
      "signupUser": Object {
        "email": "2@gmail.com",
        "name": "two",
      },
    }
  `)
  const loggedUser = await ctx.client.request(
    `
  query Login($data: UserLoginInput!) {
  login(data: $data) {
    token
    user {
      email
      name
    }
  }
}
  `,
    {
      data: {
        email: '2@gmail.com',
        password: '123',
      },
    },
  )

  expect(loggedUser).toHaveProperty('login')
  expect(loggedUser.login).toHaveProperty('token')
  expect(loggedUser.login).toHaveProperty('user')
  expect(loggedUser.login.user).toMatchObject({
    email: '2@gmail.com',
    name: 'two',
  })

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
      Authorization: loggedUser.login.token,
    },
  )
  expect(user).toMatchInlineSnapshot(`
    Object {
      "whoami": Object {
        "email": "2@gmail.com",
        "name": "two",
      },
    }
  `)
})
