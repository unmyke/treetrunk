import { BaseId } from '../BaseId';
import { BaseEntity } from '.';

const id = new BaseId();
const { constructor: idConstructor } = id;

describe('Domain :: lib :: BaseEntity', () => {
  context('when construct without argument', () => {
    test('should be instance of BaseEntity', () => {
      const idObj = new BaseEntity();

      expect(idObj.baseId.constructor).toBe(idConstructor);
    });
  });

  context('when construct with argument', () => {
    test('should be id argument', () => {
      const idObj = new BaseEntity(id);

      expect(idObj.baseId).toBe(id);
    });
  });
});
