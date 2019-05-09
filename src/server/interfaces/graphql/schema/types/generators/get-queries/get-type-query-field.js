import { queryField } from 'nexus';
import { lowerFirst } from 'lodash/fp';

import args from '../../../args';

const { Type: TypeArgs } = args;

const getTypeQueryField = (typeName, resolver) => ({
  [typeName]: queryField(lowerFirst(typeName), {
    type: typeName,
    args: TypeArgs,
    resolve: resolver,
  }),
});

export default getTypeQueryField;
