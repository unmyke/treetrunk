import { queryField, idArg } from 'nexus';
import { lowerFirst } from 'lodash/fp';

import * as resolvers from '../../resolvers';

const getTypeQueryField = (typeName) =>
  queryField(lowerFirst(typeName), {
    type: typeName,
    args: { id: idArg({ required: true }) },
    resolve: resolvers[`get${typeName}`],
  });

export default getTypeQueryField;
