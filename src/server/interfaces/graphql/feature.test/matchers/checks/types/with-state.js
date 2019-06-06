import { upperCase, snakeCase } from 'lodash';

const checkEntityTimestamp = (typeChecker) => (
  entity,
  mockEntity,
  includes
) => {
  expect(entity.state).toBe(upperCase(snakeCase(mockEntity.state)));
  return typeChecker(entity, mockEntity, includes);
};
export default checkEntityTimestamp;
