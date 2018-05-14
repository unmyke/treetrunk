import { BaseId, BaseEntity } from '../_lib';
import { PersistenceErrorFactory } from './PersistenceErrorFactory';

const uniqueness = {
  firstName: {
    with: ['middleName', 'lastName'],
  },
  phone: true,
};

const baseId = new BaseId({ value: 'baseIdValue' });
const baseIds = [
  new BaseId({ value: 'baseIdValue0' }),
  new BaseId({ value: 'baseIdValue1' }),
  new BaseId({ value: 'baseIdValue2' }),
];

const base = new BaseEntity();
base.firstName = 'Firstname';
base.middleName = 'Middlename';
base.lastName = 'Lastname';
base.phone = 'phone';

const errorFactory = new PersistenceErrorFactory();

describe('Domain :: lib :: Errors:: PersistenceErrorFactory', () => {
  describe('#createIdNotFound', () => {
    test('should construct NOT_FOUND Error', () => {
      const notFoundError = errorFactory.createIdNotFound(baseId);

      expect(notFoundError).toBeInstanceOf(Error);
      expect(notFoundError.code).toBe('NOT_FOUND');
      expect(notFoundError.message).toBe('Not found');
      expect(notFoundError.type).toBe('PERSISTENCE_ERROR');
      expect(notFoundError.details).toEqual({
        baseId: ['Base with baseId: "baseIdValue" not found.'],
      });
    });
  });

  describe('#createIdsNotFound', () => {
    test('should construct NOT_FOUND Error', () => {
      const notFoundError = errorFactory.createIdsNotFound(baseIds);

      expect(notFoundError).toBeInstanceOf(Error);
      expect(notFoundError.code).toBe('NOT_FOUND');
      expect(notFoundError.message).toBe('Not found');
      expect(notFoundError.type).toBe('PERSISTENCE_ERROR');
      expect(notFoundError.details).toEqual({
        baseId: [
          'Base with baseId in ["baseIdValue0", "baseIdValue1", "baseIdValue2"] not found.',
        ],
      });
    });
  });

  describe('#createAlreadyExists', () => {
    test('should construct Persistence Error', () => {
      const alredyExistsError = errorFactory.createAlreadyExists(
        base,
        uniqueness
      );

      expect(alredyExistsError).toBeInstanceOf(Error);
      expect(alredyExistsError.code).toBe('ALREADY_EXISTS');
      expect(alredyExistsError.message).toBe('Already exists');
      expect(alredyExistsError.type).toBe('PERSISTENCE_ERROR');
      expect(alredyExistsError.details).toEqual({
        firstName: [
          'BaseEntity with firstName: "Firstname", middleName: "Middlename", lastName: "Lastname" already exists.',
        ],
        phone: ['BaseEntity with phone: "phone" already exists.'],
      });
    });
  });
});
