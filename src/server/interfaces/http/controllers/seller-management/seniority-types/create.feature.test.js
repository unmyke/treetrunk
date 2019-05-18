import container from '@container';
import request from '@infra/support/test/request';

const {
  entities: {
    SellerManagement: {
      entities: { SeniorityType },
    },
  },
  repositories: {
    SellerManagement: { SeniorityType: seniorityTypeRepo },
  },
} = container;

describe('API :: POST /api/seniority_types', () => {
  beforeEach(() => {
    return seniorityTypeRepo.clear();
  });

  context('when props are correct', () => {
    test('should return success with array with one seniorityType', async () => {
      const { statusCode, body } = await request()
        .post('/api/seniority_types')
        .set('Accept', 'application/json')
        .send({ name: 'До 6 мес.', months: 6 });

      expect(statusCode).toBe(201);

      expect(body.name).toBe('До 6 мес.');
      expect(body.months).toBe(6);
      expect(body.awards).toHaveLength(0);
      expect(body).toHaveProperty('seniorityTypeId');
    });
  });

  context('when props are incorrect', () => {
    context('when props are invalid', () => {
      test('should return 400 with array of errors', async () => {
        const { statusCode, body } = await request()
          .post('/api/seniority_types')
          .set('Accept', 'application/json')
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

    context('when there are no props', () => {
      test('should return 400 with array of errors', async () => {
        const { statusCode, body } = await request()
          .post('/api/seniority_types')
          .set('Accept', 'application/json')
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

  context('when seniorityType exists', () => {
    test('should return 409 with array of errors', async () => {
      const seniorityType = new SeniorityType({ name: 'До 6 мес.', months: 6 });
      await seniorityTypeRepo.add(seniorityType);

      const { statusCode, body } = await request()
        .post('/api/seniority_types')
        .set('Accept', 'application/json')
        .send({ name: 'До 6 мес.', months: 6 });

      expect(statusCode).toBe(409);
      expect(body.type).toBe('AlreadyExists');
      expect(body.details).toEqual({
        name: ['SeniorityType with name: "До 6 мес." already exists'],
        months: ['SeniorityType with months: "6" already exists'],
      });
    });
  });
});
