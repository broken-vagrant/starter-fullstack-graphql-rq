import {
  createFakePostData,
  createFakeUser,
  createTestContext,
} from './__helpers';

const ctx = createTestContext();
const user1 = createFakeUser();
const post1 = createFakePostData();

describe('post', () => {
  test('create draft with invalid email', async () => {
    try {
      const newPost = await ctx.client.request(
        `
  mutation create($data: PostCreateInput!, $authorEmail: String!) {
    createDraft(authorEmail: $authorEmail, data: $data) {
      title
      content
    }
  }
    `,
        {
          data: {
            ...post1,
          },
          authorEmail: user1.email,
        }
      );
    } catch (e) {
      expect(e).not.toBeNull();
    }
  });
  test('create draft with valid email', async () => {
    await ctx.client.request(
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

    const post = await ctx.client.request(
      `
      mutation create($data: PostCreateInput!, $authorEmail: String!) {
        createDraft(authorEmail: $authorEmail, data: $data) {
          title
          content
        }
      }
    `,
      {
        data: {
          ...post1,
        },
        authorEmail: user1.email,
      }
    );

    expect(post).toHaveProperty('createDraft');
    expect(post.createDraft).toHaveProperty('title');
    expect(post.createDraft).toHaveProperty('content');
    expect(post.createDraft.title).toBe(post1.title);
    expect(post.createDraft.content).toBe(post1.content);
  });
});
