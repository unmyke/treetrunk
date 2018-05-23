import uuidv4 from 'uuid/v4';

import { container } from 'src/container';
import { request } from 'src/infra/support/test/request';

const {
  subdomains: {
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
const awardsDTO = [{ value: 1, date: dateDTO1 }, { value: 2, date: dateDTO2 }];

const date1 = new Date(dateDTO1);
const date2 = new Date(dateDTO2);

const seniorityTypeProps = { name: 'До 6 мес.', months: 6 };
const day1 = new Day({ value: date1 });
const day2 = new Day({ value: date2 });
const awards = [{ value: 1, day: day1 }, { value: 2, day: day2 }];

let seniorityType;
let seniorityTypeDTO;
let seniorityTypeToUpdate;

describe('API :: PUT /api/seniorityTypes/:id', () => {
  beforeEach(async () => {
    seniorityType = new SeniorityType(seniorityTypeProps);
    seniorityType.setAwards(awards);

    seniorityTypeDTO = {
      seniorityTypeId: seniorityType.seniorityTypeId.toString(),
      name: 'До 6 мес.',
      award: 2,
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
        .put(`/api/seniorityTypes/${seniorityTypeToUpdate.seniorityTypeId}`)
        .set('Accept', 'application/json')
        .send({ name: 'Старший флорист' });

      expect(statusCode).toBe(202);

      expect(body).toEqual({ ...seniorityTypeDTO, name: 'Старший флорист' });
    });

    context('when name is empty', () => {
      test('should not update and returns 400 with the validation error', async () => {
        const { statusCode, body } = await request()
          .put(`/api/seniorityTypes/${seniorityTypeToUpdate.seniorityTypeId}`)
          .send({
            name: '',
          });

        expect(statusCode).toBe(400);
        expect(body.type).toBe('ValidationError');
        expect(body.details).toEqual({
          name: ["Name can't be blank"],
        });
      });
    });

    context('when send no props', () => {
      test('should not update and returns 400 with the validation error', async () => {
        const { statusCode, body } = await request()
          .put(`/api/seniorityTypes/${seniorityTypeToUpdate.seniorityTypeId}`)
          .send();

        expect(statusCode).toBe(400);
        expect(body.type).toBe('ValidationError');
        expect(body.details).toEqual({
          name: ["Name can't be blank"],
        });
      });
    });
  });

  context('when seniorityType does not exist', () => {
    test('should not update and returns 400 with the not found message', async () => {
      const fakeSeniorityTypeId = uuidv4();

      const { statusCode, body } = await request()
        .put(`/api/seniorityTypes/${fakeSeniorityTypeId}`)
        .send({
          name: 'Страший флорист',
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
      const name = 'Старший флорист';
      const duplicateSeniorityTypeProps = { name };
      const duplicateSeniorityType = new SeniorityType(
        duplicateSeniorityTypeProps
      );
      duplicateSeniorityType.addAward(3, day1);
      duplicateSeniorityType.addAward(4, day2);
      await seniorityTypeRepo.add(duplicateSeniorityType);

      const { statusCode, body } = await request()
        .put(`/api/seniorityTypes/${seniorityTypeToUpdate.seniorityTypeId}`)
        .send({
          name,
        });

      expect(statusCode).toBe(409);
      expect(body.type).toBe('AlreadyExists');
      expect(body.details).toEqual({
        name: ['SeniorityType with name: "Старший флорист" already exists'],
      });
    });
  });

  context('when seniorityType nothing to update', () => {
    test('should not update and returns 400 with the nothing to update message', async () => {
      const { statusCode, body } = await request()
        .put(`/api/seniorityTypes/${seniorityTypeToUpdate.seniorityTypeId}`)
        .send({
          name: 'До 6 мес.',
        });

      expect(statusCode).toBe(400);
      expect(body.type).toBe('NothingToUpdate');
      expect(body.details).toEqual({
        seniorityType: ['SeniorityType already has name "До 6 мес."'],
      });
    });
  });
});
