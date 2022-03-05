import { inputObjectType, objectType } from "nexus"

export const UserUniqueInput = inputObjectType({
  name: 'UserUniqueInput',
  definition(t) {
    t.int('id')
    t.string('email')
  },
})


export const UserCreateWhereInput = inputObjectType({
  name: 'UserCreateWhereInput',
  definition(t) {
    t.nonNull.string('email')
    t.nonNull.string('name')
    t.nonNull.string('password')
    t.list.nonNull.field('posts', { type: 'PostCreateInput' })
  },
})

export const UserLoginInput = inputObjectType({
  name: 'UserLoginInput',
  definition(t) {
    t.nonNull.string('email')
    t.nonNull.string('password')
  }
})

export const UserLoginResponse = objectType({
  name: "UserLoginResponse",
  definition(t) {
    t.nonNull.field('user', { type: 'User' });
    t.nonNull.string('token');
  }
})