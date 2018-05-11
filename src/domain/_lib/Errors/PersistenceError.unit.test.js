import { BaseId } from '../BaseClasses';
import { PersistenceError } from './PersistenceError';

const baseId = new BaseId({ value: 'baseIdValue' });

describe('Domain :: lib :: Errors:: PersistenceError', () => {
  context('when construct with argument', () => {
    test('should be id argument', () => {
      const notFoundError = PersistenceError.createNotFoundError(baseId);

      expect(notFoundError.code).toBe('PERSISTENCE_ERROR::NOT_FOUND');
      expect(notFoundError.message).toBe('Base-entity not found');
      expect(notFoundError.details).toEqual({
        baseId: 'Base with baseId: baseIdvalue not found.',
      });
    });
  });
});
