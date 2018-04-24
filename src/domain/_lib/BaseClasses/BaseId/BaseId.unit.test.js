import uuidv4 from 'uuid/v4';
import { BaseId } from '.';

const value = uuidv4();
const { constructor: idConstructor } = value;

describe('Domain :: lib :: BaseClasses:: BaseId', () => {
  context('when construct without argument', () => {
    it('should be uuidv4', () => {
      const idObj = new BaseId();

      expect(idObj.value.constructor).toBe(idConstructor);
    });
  });

  context('when construct with argument', () => {
    it('should be id argument', () => {
      const idObj = new BaseId({ value });

      expect(idObj.value).toBe(value);
    });
  });
});
