import uuidv4 from 'uuid/v4';
import { BaseId } from '.';

const id = uuidv4();
const { constructor: idConstructor } = id;

describe('Domain :: lib :: BaseClasses:: BaseId', () => {
  context('when construct without argument', () => {
    it('should be uuidv4', () => {
      const idObj = new BaseId();

      expect(idObj.id.constructor).toBe(idConstructor);
    });
  });

  context('when construct with argument', () => {
    it('should be id argument', () => {
      const idObj = new BaseId(id);

      expect(idObj.id).toBe(id);
    });
  });
});
