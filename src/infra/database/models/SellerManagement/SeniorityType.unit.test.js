import { Op } from 'sequelize';
import { factory } from 'src/infra/support/test/factory';
import { cleanDatabase } from 'src/infra/support/test/cleanDatabase';

import { container } from 'src/container';

const {
  subdomains: {
    SellerManagement: { SeniorityType },
  },
  commonTypes: { Day },
  mappers: {
    subdomains: {
      SellerManagement: { SeniorityType: seniorityTypeMapper },
    },
  },
  models: {
    SellerManagement: { SeniorityType: SeniorityTypeModel },
  },
  database,
} = container;

const seniorityTypeProps = {
  name: 'до 6 месяцев',
  months: 6,
};

const seniorityType = new SeniorityType(seniorityTypeProps);
const pieceRateDay = new Day();
seniorityType.addAward(5, new Day(pieceRateDay));

describe('Infra :: Model :: SeniorityType', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(() => {
    return database.close();
  });

  describe('#findAll', () => {
    beforeEach(() => {
      return factory.createMany(
        'seniorityType',
        [{ name: 'SeniorityType 1' }, { name: 'SeniorityType 2' }],
        { awardsCount: 1 }
      );
    });

    test('returns all seniorityTypes from the database', async () => {
      expect.assertions(9);
      const seniorityTypes = await SeniorityTypeModel.scope('awards').findAll();

      expect(seniorityTypes.length).toBe(2);

      const seniorityType1 = seniorityTypes.find(
        ({ name }) => name === 'SeniorityType 1'
      );
      const seniorityType2 = seniorityTypes.find(
        ({ name }) => name === 'SeniorityType 2'
      );

      expect(seniorityType1.months).toBeGreaterThanOrEqual(1);
      expect(seniorityType1.awards).toHaveLength(1);
      expect(seniorityType1.awards[0]).toHaveProperty('value');
      expect(seniorityType1.awards[0]).toHaveProperty('day');

      expect(seniorityType2.months).toBeGreaterThanOrEqual(1);
      expect(seniorityType2.awards).toHaveLength(1);
      expect(seniorityType2.awards[0]).toHaveProperty('value');
      expect(seniorityType2.awards[0]).toHaveProperty('day');
    });
  });

  describe('#findById', () => {
    beforeEach(() => {
      return factory.create('seniorityType', { name: 'The SeniorityType' });
    });

    context('when seniorityType exists', () => {
      test('returns the seniorityType', async () => {
        expect.assertions(2);

        const seniorityTypes = await SeniorityTypeModel.findAll();
        expect(seniorityTypes.length).toBe(1);
        const { seniority_type_id } = seniorityTypes[0];

        const seniorityType = await SeniorityTypeModel.findById(
          seniority_type_id
        );
        expect(seniorityType.name).toBe('The SeniorityType');
      });
    });

    context('when the seniorityType does not exist', () => {
      test('returns null', async () => {
        expect.assertions(1);

        expect(await SeniorityTypeModel.findById(-1)).toBeNull();
      });
    });
  });

  describe('#findOne', () => {
    beforeEach(() => {
      return factory.createMany('seniorityType', [
        { name: 'SeniorityType 1' },
        { name: 'SeniorityType 2' },
      ]);
    });

    context('when seniorityType exists', () => {
      test('returns the seniorityType', async () => {
        expect.assertions(1);

        const seniorityType = await SeniorityTypeModel.findOne({
          where: {
            name: {
              [Op.like]: 'SeniorityType 1',
            },
          },
        });

        expect(seniorityType.name).toBe('SeniorityType 1');
      });
    });

    context('when the seniorityType does not exist', () => {
      test('returns null', async () => {
        expect.assertions(1);

        const seniorityType = await SeniorityTypeModel.findOne({
          where: {
            name: {
              [Op.notLike]: 'SeniorityType%',
            },
          },
        });

        expect(seniorityType).toBeNull();
      });
    });
  });

  describe('#add', () => {
    context('when seniorityType is valid', () => {
      test('persists the seniorityType', async () => {
        expect.assertions(2);

        const countBefore = await SeniorityTypeModel.count();
        const persistedSeniorityType = await SeniorityTypeModel.create(
          seniorityTypeMapper.toDatabase(seniorityType)
        );

        expect(persistedSeniorityType.name).toBe(seniorityType.name);

        const countAfter = await SeniorityTypeModel.count();
        expect(countAfter - countBefore).toBe(1);
      });
    });

    context('when seniorityType is invalid', () => {
      test('does not persist the seniorityType and rejects with an error', async () => {
        expect.assertions(3);

        const expectedErrors = [
          'seniority_type.name cannot be null',
          'seniority_type.months cannot be null',
          'seniority_type.state cannot be null',
        ];

        const countBefore = await SeniorityTypeModel.count();

        try {
          await SeniorityTypeModel.create({});
        } catch (error) {
          const { name, errors } = error;
          const recievedErrors = errors.map((e) => e.message);
          expect(name).toBe('SequelizeValidationError');
          expect(recievedErrors).toEqual(expectedErrors);
        }

        const countAfter = await SeniorityTypeModel.count();

        expect(countAfter - countBefore).toBe(0);
      });
    });

    context('when seniorityType is non-unique (same name)', () => {
      test('does not persist the seniorityType and rejects with an error', async () => {
        expect.assertions(3);

        const countBefore = await SeniorityTypeModel.count();

        await SeniorityTypeModel.create(
          seniorityTypeMapper.toDatabase(seniorityType)
        );

        try {
          const sameSeler = new SeniorityType({
            ...seniorityTypeProps,
            months: 12,
          });
          await SeniorityTypeModel.create(
            seniorityTypeMapper.toDatabase(sameSeler)
          );
        } catch (error) {
          const { name, errors } = error;
          const recievedErrors = errors.map((e) => e.message);
          expect(name).toBe('SequelizeUniqueConstraintError');
          expect(recievedErrors).toEqual([
            "seniority type's name must be unique",
          ]);
        }

        const countAfter = await SeniorityTypeModel.count();

        expect(countAfter - countBefore).toBe(1);
      });
    });

    context('when seniorityType is non-unique (same months)', () => {
      test('does not persist the seniorityType and rejects with an error', async () => {
        expect.assertions(3);

        const countBefore = await SeniorityTypeModel.count();

        await SeniorityTypeModel.create(
          seniorityTypeMapper.toDatabase(seniorityType)
        );

        try {
          const sameSeler = new SeniorityType({
            ...seniorityTypeProps,
            name: 'до года',
          });
          await SeniorityTypeModel.create(
            seniorityTypeMapper.toDatabase(sameSeler)
          );
        } catch (error) {
          const { name, errors } = error;
          const recievedErrors = errors.map((e) => e.message);
          expect(name).toBe('SequelizeUniqueConstraintError');
          expect(recievedErrors).toEqual([
            "seniority type's months must be unique",
          ]);
        }

        const countAfter = await SeniorityTypeModel.count();

        expect(countAfter - countBefore).toBe(1);
      });
    });
  });

  describe('#destroy', () => {
    beforeEach(() => {
      return factory.create('seniorityType', {
        name: 'Destroyed SeniorityType',
      });
    });

    test('destroys the seniorityType', async () => {
      expect.assertions(1);
      const countBefore = await SeniorityTypeModel.count();
      const seniorityType = await SeniorityTypeModel.findOne({
        where: {
          name: 'Destroyed SeniorityType',
        },
      });

      await seniorityType.destroy();

      const countAfter = await SeniorityTypeModel.count();
      expect(countBefore - countAfter).toBe(1);
    });
  });

  describe('#update', () => {
    beforeEach(() => {
      return factory.createMany('seniorityType', [
        { name: 'SeniorityType to update 1' },
        { name: 'SeniorityType to update 2' },
      ]);
    });

    context('when seniorityType is valid', () => {
      test('updates seniorityType', async () => {
        expect.assertions(2);
        const seniorityType = await SeniorityTypeModel.findOne({
          where: {
            name: 'SeniorityType to update 1',
          },
        });
        const { seniority_type_id } = seniorityType;
        expect(seniorityType.name).toBe('SeniorityType to update 1');
        await seniorityType.update({ name: 'New SeniorityType' });
        const updatedSeniorityType = await SeniorityTypeModel.findById(
          seniority_type_id
        );
        expect(updatedSeniorityType.name).toBe('New SeniorityType');
      });
    });

    context('when seniorityType is non-unique', () => {
      let name, months, seniority_type_id, seniorityTypeToUpdate;

      beforeEach(async () => {
        const seniorityType = await SeniorityTypeModel.findOne({
          where: {
            name: 'SeniorityType to update 1',
          },
        });
        name = seniorityType.name;
        months = seniorityType.months;

        seniorityTypeToUpdate = await SeniorityTypeModel.findOne({
          where: {
            name: 'SeniorityType to update 2',
          },
        });
        seniority_type_id = seniorityTypeToUpdate.seniority_type_id;
      });

      context('when passed same name', () => {
        test('does not persist the seniorityType and rejects with an error', async () => {
          expect.assertions(3);

          try {
            await seniorityTypeToUpdate.update({ name, months: 12 });
          } catch (error) {
            const { name, errors } = error;
            const recievedErrors = errors.map((e) => e.message);
            expect(name).toBe('SequelizeUniqueConstraintError');
            expect(recievedErrors).toEqual([
              "seniority type's name must be unique",
            ]);
          }

          const updatedSeniorityType = await SeniorityTypeModel.findById(
            seniority_type_id
          );
          expect(updatedSeniorityType.name).toBe('SeniorityType to update 2');
        });
      });

      context('when passed same name', () => {
        test('does not persist the seniorityType and rejects with an error', async () => {
          expect.assertions(3);

          try {
            await seniorityTypeToUpdate.update({ name: 'до года', months });
          } catch (error) {
            const { name, errors } = error;
            const recievedErrors = errors.map((e) => e.message);
            expect(name).toBe('SequelizeUniqueConstraintError');
            expect(recievedErrors).toEqual([
              "seniority type's months must be unique",
            ]);
          }

          const updatedSeniorityType = await SeniorityTypeModel.findById(
            seniority_type_id
          );
          expect(updatedSeniorityType.name).toBe('SeniorityType to update 2');
        });
      });
    });
  });
});
