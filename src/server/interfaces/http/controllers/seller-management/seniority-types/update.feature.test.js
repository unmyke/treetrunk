import uuidv4 from 'uuid/v4';

import container from '@container';
import request from '@infra/tests/request';

const {
  entities: {
    SellerManagement: {
      entities: { SeniorityType },
    },
  },
  commonTypes: { Day },
  repositories: {
    SellerManagement: { SeniorityType: seniorityTypeRepo },
  },
} = container;

const dateDTO1 = '2018-01-21T00:00:00.000+08:00';
const dateDTO2 = '2018-02-21T00:00:00.000+08:00';
const awardsDTO = [
  { value: 1000, date: dateDTO1 },
  { value: 2000, date: dateDTO2 },
];

const date1 = new Date(dateDTO1);
const date2 = new Date(dateDTO2);

const seniorityTypeProps = { name: 'До 6 мес.', months: 6 };
const day1 = new Day({ value: date1 });
const day2 = new Day({ value: date2 });
const awards = [{ value: 1000, day: day1 }, { value: 2000, day: day2 }];

let seniorityType;
let seniorityTypeDTO;
let seniorityTypeToUpdate;

describe('API :: PUT /api/seniority_types/:id', () => {
  beforeEach(async () => {
    seniorityType = new SeniorityType(seniorityTypeProps);
    seniorityType.setAwards(awards);

    seniorityTypeDTO = {
      seniorityTypeId: seniorityType.seniorityTypeId.toString(),
      name: 'До 6 мес.',
      award: 2000,
      awards: awardsDTO,
    };

    seniorityTypeToUpdate = await seniorityTypeRepo.add(seniorityType);
  });

  afterEach(() => {
    return seniorityTypeRepo.clear();
  });

  context('when props are correct', () => {
    test('should update and return 202 with the updated seniorityType', async () => {
      const { statusCode, body } = await request()
        .put(`/api/seniority_types/${seniorityTypeToUpdate.seniorityTypeId}`)
        .set('Accept', 'application/json')
        .send({ name: 'От 6 до 12 мес.', months: 12 });

      expect(statusCode).toBe(202);

      expect(body).toEqual({
        ...seniorityTypeDTO,
        name: 'От 6 до 12 мес.',
        months: 12,
      });
    });

    context('when props are incorrect', () => {
      context('when props are invalid', () => {
        test('should not update and returns 400 with the validation error', async () => {
          const { statusCode, body } = await request()
            .put(
              `/api/seniority_types/${seniorityTypeToUpdate.seniorityTypeId}`
            )
            .send({
              name: '',
              months: 'test',
            });

          expect(statusCode).toBe(400);
          expect(body.type).toBe('ValidationError');
          expect(body.details).toEqual({
            name: ["Name can't be blank"],
            months: ['Months is not a number'],
          });
        });
      });

      context('when send no props', () => {
        test('should not update and returns 400 with the validation error', async () => {
          const { statusCode, body } = await request()
            .put(
              `/api/seniority_types/${seniorityTypeToUpdate.seniorityTypeId}`
            )
            .send();

          expect(statusCode).toBe(400);
          expect(body.type).toBe('ValidationError');
          expect(body.details).toEqual({
            name: ["Name can't be blank"],
            months: ["Months can't be blank"],
          });
        });
      });
    });
  });

  context('when seniorityType does not exist', () => {
    test('should not update and returns 400 with the not found message', async () => {
      const fakeSeniorityTypeId = uuidv4();

      const { statusCode, body } = await request()
        .put(`/api/seniority_types/${fakeSeniorityTypeId}`)
        .send({
          name: 'От 6 до 12 мес.',
          months: 12,
        });

      expect(statusCode).toBe(404);
      expect(body.type).toBe('NotFoundError');
      expect(body.details).toEqual({
        seniorityTypeId: [
          `SeniorityType with seniorityTypeId: "${fakeSeniorityTypeId}" not found`,
        ],
      });
    });
  });

  context('when seniorityType with updated name already exists', () => {
    test('should not update and returns 409 with the already exists message', async () => {
      const name = 'От 6 до 12 мес.';
      const duplicateSeniorityTypeProps = { name, months: 12 };
      const duplicateSeniorityType = new SeniorityType(
        duplicateSeniorityTypeProps
      );
      duplicateSeniorityType.addAward(3, day1);
      duplicateSeniorityType.addAward(4, day2);
      await seniorityTypeRepo.add(duplicateSeniorityType);

      const { statusCode, body } = await request()
        .put(`/api/seniority_types/${seniorityTypeToUpdate.seniorityTypeId}`)
        .send({
          name,
          months: 12,
        });

      expect(statusCode).toBe(409);
      expect(body.type).toBe('AlreadyExists');
      expect(body.details).toEqual({
        name: ['SeniorityType with name: "От 6 до 12 мес." already exists'],
        months: ['SeniorityType with months: "12" already exists'],
      });
    });
  });

  context('when seniorityType nothing to update', () => {
    test('should not update and returns 400 with the nothing to update message', async () => {
      const { statusCode, body } = await request()
        .put(`/api/seniority_types/${seniorityTypeToUpdate.seniorityTypeId}`)
        .send({
          name: 'До 6 мес.',
          months: 6,
        });

      expect(statusCode).toBe(400);
      expect(body.type).toBe('NothingToUpdate');
      expect(body.details).toEqual({
        seniorityType: [
          'SeniorityType already has name "До 6 мес."',
          'SeniorityType already has months "6"',
        ],
      });
    });
  });
});
