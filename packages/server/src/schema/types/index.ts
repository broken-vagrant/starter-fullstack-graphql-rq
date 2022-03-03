import * as  userTypes from './user'
import * as postTypes from './post'
import { DateTimeResolver } from 'graphql-scalars';
import { asNexusMethod, enumType } from 'nexus';

export const DateTime = asNexusMethod(DateTimeResolver, 'date')


const SortOrder = enumType({
  name: 'SortOrder',
  members: ['asc', 'desc'],
})

export default { ...userTypes, ...postTypes, SortOrder, DateTime };