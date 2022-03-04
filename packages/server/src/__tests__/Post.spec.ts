import { createTestContext } from './__helpers'

const ctx = createTestContext()

it('ensures that a user and their posts can be created', async () => {
  // Create a new draft
  const newUserResult = await ctx.client.request(`            # 1
  mutation {
  signupUser(data: { email: "1@gmail.com", name: "one", posts: [] }) {
    id
    name
    email
  }
}

  `)
  // Snapshot that draft and expect `published` to be false
  expect(newUserResult).toMatchInlineSnapshot(`
    Object {
      "signupUser": Object {
        "email": "1@gmail.com",
        "id": 1,
        "name": "one",
      },
    }
  `) // 3
  // Publish the previously created draft

  const publishResult = await ctx.client.request(`
  mutation {
  createDraft(
    data: { title: "First title", content: "This is test content." }
    authorEmail: "1@gmail.com"
  ) {
    id
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
        "id": 1,
        "title": "First title",
      },
    }
  `)
})
