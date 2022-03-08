import { createTestContext } from './__helpers'

const ctx = createTestContext()

it('ensures that a user and their posts can be created', async () => {
  const newUserResult = await ctx.client.request(`            # 1
  mutation {
  signupUser(data: { email: "1@gmail.com", name: "one",password: "123", posts: [] }) {
  jwt
  refreshToken
  }
}

  `)
  expect(newUserResult).toHaveProperty('signupUser');
  expect(newUserResult.signupUser).toHaveProperty('jwt');
  expect(newUserResult.signupUser).toHaveProperty('refreshToken');
  // Publish the previously created draft

  const publishResult = await ctx.client.request(`
  mutation {
  createDraft(
    data: { title: "First title", content: "This is test content." }
    authorEmail: "1@gmail.com"
  ) {
    title
    content
  }
}
  `)
  // Snapshot the published draft and expect `published` to be true
  expect(publishResult).toMatchInlineSnapshot(`
    Object {
      "createDraft": Object {
        "content": "This is test content.",
        "title": "First title",
      },
    }
  `)
})
