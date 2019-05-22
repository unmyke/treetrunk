import gql from 'graphql-tag';
import pluralize from 'pluralize';
import { upperFirst } from 'lodash';

const getEntity = (type, connection) => {
  const { name: typeName } = type;
  const { name: connectionName } = connection;
  const TypeName = upperFirst(typeName);
  console.log(`typeName: ${typeName}`);
  console.log(`TypeName: ${TypeName}`);
  console.log(`connectionName: ${connectionName}`);

  return gql`
    query ${pluralize(TypeName)}(
      $after: CursorScalar
      $first: PositiveIntScalar
      $before: CursorScalar
      $last: PositiveIntScalar
      $sort: SortInput
      $filter: FilterInput
    ) {
      ${pluralize(typeName)}(
        after: $after
        first: $first
        before: $before
        last: $last
        sort: $sort
        filter: $filter
      ) {
        ...${connectionName}
      }
    }
    ${type()}
    ${connection()}
  `;
};
export default getEntity;
