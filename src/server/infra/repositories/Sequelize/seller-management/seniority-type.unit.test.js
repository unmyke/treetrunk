import uuidv4 from 'uuid/v4';
import factory from '@infra/tests/factory';
import cleanDatabase from '@infra/tests/clean-database';

import container from '@container';

const getRawSeniorityType = ({ seniorityTypeId, name, phone, awards }) => ({
  seniorityTypeId,
  name,
  phone,
  awards,
});

const {
  entities: {
    SellerManagement: { SeniorityType },
  },
  commonTypes: { Day, SeniorityTypeId },
  repositories: {
    SellerManagement: { SeniorityType: seniorityTypeRepo },
  },
  models: {
    SellerManagement: {
      SeniorityType: SeniorityTypeModel,
      SeniorityTypeAward: SeniorityTypeAwardModel,
    },
  },
  mappers: {
    entities: {
      SellerManagement: { SeniorityType: seniorityTypeMapper },
    },
  },
  database,
} = container;

const value = 2.5;

const seniorityTypeProps = {
  name: 'Name',
  months: 6,
};

const newSeniorityTypeProps = {
  name: `${seniorityTypeProps.name}_new`,
  months: 12,
};

const day = new Day({ value: new Date('2018.01.01') });
const newDay = new Day();

let seniorityTypeEntity;
let seniorityTypeId;
let newSeniorityTypeEntity;

describe('Infra :: Repository :: SeniorityType', () => {
  beforeEach(() => {
    seniorityTypeId = new SeniorityTypeId({ value: uuidv4() });
    seniorityTypeEntity = new SeniorityType({
      ...seniorityTypeProps,
      seniorityTypeId,
    });

    return cleanDatabase();
  });

  afterAll(() => {
    return database.close();
  });

  describe('#getById', () => {
    context('when there is seniorityType in db', () => {
      beforeEach(() => {
        return factory.create(
          'seniorityType',
          seniorityTypeMapper.toDatabase(seniorityTypeEntity)
        );
      });

      test('should return array of seniorityTypes', async () => {
        expect.assertions(2);

        const seniorityType = await seniorityTypeRepo.getById(seniorityTypeId);

        expect(seniorityType).toBeInstanceOf(SeniorityType);
        expect(seniorityType.seniorityTypeId).toEqual(seniorityTypeId);
      });
    });

    context('when there is no seniorityType in db', () => {
      test('should throw not found error', async () => {
        expect.assertions(1);
        try {
          await seniorityTypeRepo.getById(seniorityTypeId);
        } catch ({ message }) {
          expect(message).toBe('SENIORITY_TYPE_NOT_FOUND');
        }
      });
    });
  });

  describe('#getAll', () => {
    context('when there are seniorityTypes in db', () => {
      beforeEach(() => {
        return factory.createMany('seniorityType', [
          { name: 'SeniorityType1', state: 'deleted' },
          { name: 'SeniorityType2', state: 'active' },
          { name: 'SeniorityType3', state: 'deleted' },
          { name: 'SeniorityType4', state: 'active' },
        ]);
      });

      test('should return array of seniorityTypes', async () => {
        expect.assertions(4);

        const seniorityTypes = await seniorityTypeRepo.getAll();

        expect(seniorityTypes).toHaveLength(2);
        expect(seniorityTypes[0]).toBeInstanceOf(SeniorityType);
        expect(seniorityTypes[0].state).toBe('active');
        expect(seniorityTypes[1].state).toBe('active');
      });
    });

    context('when there are no seniorityTypes in db', () => {
      test('should return empty array', async () => {
        expect.assertions(1);

        const seniorityTypes = await seniorityTypeRepo.getAll();

        expect(seniorityTypes).toHaveLength(0);
      });
    });
  });

  describe('#find', () => {
    beforeEach(() => {
      return factory
        .createMany('seniorityType', [
          { months: 1, state: 'active' },
          { months: 2, state: 'deleted' },
          { months: 3, state: 'active' },
          { months: 4, state: 'deleted' },
          { months: 5, state: 'active' },
          { months: 6, state: 'deleted' },
          { months: 7, state: 'active' },
          { months: 8, state: 'active' },
          { months: 9, state: 'active' },
        ])
        .catch((e) => {
          console.log(e);
        });
    });

    context('when passed states-query', () => {
      context('when there are active seniorityTypes in db', () => {
        test('should return array of seniorityTypes', async () => {
          expect.assertions(3);

          const seniorityTypes = await seniorityTypeRepo.find({
            states: ['active'],
          });

          expect(seniorityTypes).toHaveLength(6);
          expect(seniorityTypes[0]).toBeInstanceOf(SeniorityType);
          expect(seniorityTypes[0].state).toBe('active');
        });
      });

      context('when there are deleted seniorityTypes in db', () => {
        test('should return array of seniorityTypes', async () => {
          expect.assertions(3);

          const seniorityTypes = await seniorityTypeRepo.find({
            states: ['deleted'],
          });

          expect(seniorityTypes).toHaveLength(3);
          expect(seniorityTypes[0]).toBeInstanceOf(SeniorityType);
          expect(seniorityTypes[0].state).toBe('deleted');
        });
      });

      context('when there are deleted seniorityTypes in db', () => {
        test('should return array of seniorityTypes', async () => {
          expect.assertions(3);

          const seniorityTypes = await seniorityTypeRepo.find({
            states: ['deleted'],
          });

          expect(seniorityTypes).toHaveLength(3);
          expect(seniorityTypes[0]).toBeInstanceOf(SeniorityType);
          expect(seniorityTypes[0].state).toBe('deleted');
        });
      });

      context('when there are active and deleted seniorityTypes in db', () => {
        test('should return array of seniorityTypes', async () => {
          expect.assertions(3);

          const seniorityTypes = await seniorityTypeRepo.find({
            states: ['active', 'deleted'],
          });

          expect(seniorityTypes).toHaveLength(9);
          expect(seniorityTypes[0]).toBeInstanceOf(SeniorityType);
          expect(['active', 'deleted']).toContain(seniorityTypes[0].state);
        });
      });
    });

    context('when passed montsBetween-query', () => {
      context(
        'when there are seniorityTypes with months between 3 and 6 in db',
        () => {
          test('should return array of seniorityTypes', async () => {
            expect.assertions(10);

            const seniorityTypes = await seniorityTypeRepo.find({
              monthsBetween: { min: 3, max: 6 },
            });

            expect(seniorityTypes).toHaveLength(4);
            expect(seniorityTypes[0]).toBeInstanceOf(SeniorityType);
            expect(seniorityTypes[0].months).toBeGreaterThanOrEqual(3);
            expect(seniorityTypes[0].months).toBeLessThanOrEqual(6);
            expect(seniorityTypes[1].months).toBeGreaterThanOrEqual(3);
            expect(seniorityTypes[1].months).toBeLessThanOrEqual(6);
            expect(seniorityTypes[2].months).toBeGreaterThanOrEqual(3);
            expect(seniorityTypes[2].months).toBeLessThanOrEqual(6);
            expect(seniorityTypes[3].months).toBeGreaterThanOrEqual(3);
            expect(seniorityTypes[3].months).toBeLessThanOrEqual(6);
          });
        }
      );
    });
  });

  describe('#add', () => {
    context('when pass seniorityType without awards', () => {
      test('should return seniorityType with empty awards array', async () => {
        expect.assertions(2);

        const seniorityType = await seniorityTypeRepo.add(seniorityTypeEntity);

        expect(seniorityType).toBeInstanceOf(SeniorityType);
        expect(getRawSeniorityType(seniorityType)).toEqual(
          getRawSeniorityType(seniorityTypeEntity)
        );
      });
    });

    context('when pass seniorityType with awards', () => {
      beforeEach(() => {
        seniorityTypeEntity.addAward(value, day);

        expect(seniorityTypeEntity.awards).toHaveLength(1);
      });

      test('should return seniorityType with awards array', async () => {
        expect.assertions(3);

        const seniorityType = await seniorityTypeRepo.add(seniorityTypeEntity);

        expect(seniorityType).toBeInstanceOf(SeniorityType);
        expect(getRawSeniorityType(seniorityType)).toEqual(
          getRawSeniorityType(seniorityTypeEntity)
        );
      });
    });

    context('when re-add same seniorityType', () => {
      beforeEach(() => {
        seniorityTypeEntity.addAward(value, day);

        expect(seniorityTypeEntity.awards).toHaveLength(1);
        return seniorityTypeRepo.add(seniorityTypeEntity);
      });

      test('should throw already exists error', async () => {
        expect.assertions(3);

        const countBefore = await seniorityTypeRepo.count();

        try {
          await seniorityTypeRepo.add(seniorityTypeEntity);
        } catch ({ message }) {
          expect(message).toBe('SENIORITY_TYPE_ALREADY_EXISTS');
        }

        const countAfter = await seniorityTypeRepo.count();
        expect(countBefore).toBe(countAfter);
      });
    });

    context('when add ununique seniorityType', () => {
      beforeEach(() => {
        return seniorityTypeRepo.add(seniorityTypeEntity);
      });

      test('should throw already exists error', async () => {
        expect.assertions(2);

        const countBefore = await seniorityTypeRepo.count();

        try {
          await seniorityTypeRepo.add(seniorityTypeEntity);
        } catch ({ message }) {
          expect(message).toBe('SENIORITY_TYPE_ALREADY_EXISTS');
        }

        const countAfter = await seniorityTypeRepo.count();
        expect(countBefore).toBe(countAfter);
      });
    });
  });

  describe('#delete', () => {
    context('when seniorityType exists', () => {
      beforeEach(() => {
        return factory.create(
          'seniorityType',
          seniorityTypeMapper.toDatabase(seniorityTypeEntity),
          {
            awardsCount: 0,
          }
        );
      });

      test('should delete seniorityType and return true', async () => {
        expect.assertions(3);

        const seniorityTypesCountBefore = await seniorityTypeRepo.count();
        const awardsCountBefore = await SeniorityTypeAwardModel.count();

        const result = await seniorityTypeRepo.delete(seniorityTypeId);

        const seniorityTypesCountAfter = await seniorityTypeRepo.count();
        const awardsCountAfter = await SeniorityTypeAwardModel.count();

        expect(result).toBeTruthy();
        expect(seniorityTypesCountBefore).toBe(seniorityTypesCountAfter + 1);
        expect(awardsCountBefore).toBe(awardsCountAfter);
      });
    });

    context('when seniorityType not exists', () => {
      test('should throw not found error', async () => {
        expect.assertions(2);

        const countBefore = await seniorityTypeRepo.count();

        try {
          await seniorityTypeRepo.delete(seniorityTypeId);
        } catch ({ message }) {
          expect(message).toBe('SENIORITY_TYPE_NOT_FOUND');
        }

        const countAfter = await seniorityTypeRepo.count();
        expect(countBefore).toBe(countAfter);
      });
    });
  });

  describe('#update', () => {
    beforeEach(() => {
      return factory.create(
        'seniorityType',
        seniorityTypeMapper.toDatabase(seniorityTypeEntity),
        {
          awardsCount: 0,
        }
      );
    });

    context('when seniorityType with update props exists', () => {
      beforeEach(() => {
        newSeniorityTypeEntity = new SeniorityType({
          ...newSeniorityTypeProps,
          seniorityTypeId,
        });
      });

      context("when updated seniorityType's props are unique", () => {
        test('should return updated seniorityType', async () => {
          expect.assertions(1);

          const seniorityType = await seniorityTypeRepo.update(
            newSeniorityTypeEntity
          );

          expect(getRawSeniorityType(seniorityType)).toEqual(
            getRawSeniorityType(newSeniorityTypeEntity)
          );
        });
      });

      context("when updated seniorityType's props are non-unique", () => {
        beforeEach(() => {
          return factory.create(
            'seniorityType',
            seniorityTypeMapper.toDatabase(
              new SeniorityType(newSeniorityTypeProps)
            )
          );
        });

        test('should throw already exists error', async () => {
          expect.assertions(2);

          try {
            await seniorityTypeRepo.update(newSeniorityTypeEntity);
          } catch ({ message }) {
            expect(message).toBe('SENIORITY_TYPE_ALREADY_EXISTS');
          }

          expect(
            getRawSeniorityType(
              await seniorityTypeRepo.getById(seniorityTypeId)
            )
          ).toEqual(getRawSeniorityType(seniorityTypeEntity));
        });
      });
    });

    context('when updated seniorityType not exists', () => {
      beforeEach(() => {
        newSeniorityTypeEntity = new SeniorityType(newSeniorityTypeProps);
      });

      test('should throw not found error', async () => {
        expect.assertions(1);

        try {
          await seniorityTypeRepo.update(newSeniorityTypeEntity);
        } catch ({ message }) {
          expect(message).toBe('SENIORITY_TYPE_NOT_FOUND');
        }
      });
    });
  });

  describe('#addAward', () => {
    let awardsCountBefore;

    beforeEach(() => {
      return factory
        .create(
          'seniorityType',
          seniorityTypeMapper.toDatabase(seniorityTypeEntity),
          {
            awardsCount: 0,
          }
        )
        .then((seniorityType) => {
          seniorityTypeEntity.addAward(value, day);
          awardsCountBefore = seniorityType.awards.length;
        });
    });

    test('should return true', async () => {
      expect.assertions(2);

      const result = await seniorityTypeRepo.addAward(
        seniorityTypeId,
        value,
        day
      );
      const awardsCountAfter = await SeniorityTypeAwardModel.count();

      expect(result).toBeTruthy();
      expect(awardsCountAfter).toBe(awardsCountBefore + 1);
    });
  });

  describe('#deleteAwardAt', () => {
    let awardsCountBefore;

    beforeEach(() => {
      seniorityTypeEntity.addAward(value, day);

      return factory
        .create(
          'seniorityType',
          seniorityTypeMapper.toDatabase(seniorityTypeEntity)
        )
        .then((seniorityType) => {
          awardsCountBefore = seniorityType.awards.length;
        });
    });

    test('should return true', async () => {
      expect.assertions(2);

      const result = await seniorityTypeRepo.deleteAwardAt(
        seniorityTypeId,
        day
      );
      const awardsCountAfter = await SeniorityTypeAwardModel.count();

      expect(result).toBeTruthy();
      expect(awardsCountAfter).toBe(awardsCountBefore - 1);
    });
  });

  describe('#updateAwardTo', () => {
    let awardsCountBefore;
    let newValue;

    beforeEach(() => {
      seniorityTypeEntity.addAward(value, day);
      newValue = 3.5;

      return factory
        .create(
          'seniorityType',
          seniorityTypeMapper.toDatabase(seniorityTypeEntity)
        )
        .then((seniorityType) => {
          awardsCountBefore = seniorityType.awards.length;
        });
    });

    test('should return true', async () => {
      expect.assertions(3);

      const result = await seniorityTypeRepo.updateAwardTo(
        seniorityTypeId,
        day,
        newValue,
        newDay
      );
      const awardsCountAfter = await SeniorityTypeAwardModel.count();

      expect(result).toBeTruthy();
      expect(awardsCountAfter).toBe(awardsCountBefore);
      expect(
        await SeniorityTypeAwardModel.count({
          where: {
            seniority_type_id: seniorityTypeId.value,
            value: newValue,
            day: newDay.value,
          },
        })
      ).toBe(1);
    });
  });
});
