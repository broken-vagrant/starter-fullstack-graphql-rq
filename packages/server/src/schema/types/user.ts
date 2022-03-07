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
  },
})

export const UserLoginInput = inputObjectType({
  name: 'UserLoginInput',
  definition(t) {
    t.nonNull.string('email')
    t.nonNull.string('password')
  }
})

export const UserAuthResponse = objectType({
  name: "UserAuthResponse",
  definition(t) {
    t.nonNull.string('jwt')
    t.nonNull.string('refreshToken')
  }
})
export const RefreshTokenResponse = objectType({
  name: "RefreshTokenResponse",
  definition(t) {
    t.nonNull.string('jwt')
  }
})

export const RefreshTokenInput = inputObjectType({
  name: "RefreshTokenInput",
  definition(t) {
    t.nonNull.string('refreshToken')
    t.nonNull.string('fingerPrintHash')
  }
})

