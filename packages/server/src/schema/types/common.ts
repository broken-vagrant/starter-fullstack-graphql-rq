import { DateTimeResolver } from 'graphql-scalars';
import { asNexusMethod, enumType } from 'nexus';

export const DateTime = asNexusMethod(DateTimeResolver, 'date');

export const SortOrder = enumType({
  name: 'SortOrder',
  members: ['asc', 'desc'],
});
