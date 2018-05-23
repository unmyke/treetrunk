import { container } from 'src/container';
import { request } from 'src/infra/support/test/request';

const {
  subdomains: {
    SellerManagement: {
      entities: { SeniorityType },
    },
  },
  repositories: {
    SellerManagement: { SeniorityType: seniorityTypeRepo },
  },
} = container;

const seniorityTypeProps1 = { name: 'До 6 мес.', months: 6 };
const seniorityTypeProps2 = { name: 'Старший флорист' };
const seniorityType1 = new SeniorityType(seniorityTypeProps1);
const seniorityType2 = new SeniorityType(seniorityTypeProps2);

describe('API :: GET /api/seniorityTypes', () => {
  context('when there are seniorityTypes', () => {
    beforeEach(() => {
      return Promise.all([
        seniorityTypeRepo.add(seniorityType1),
        seniorityTypeRepo.add(seniorityType2),
      ]);
    });

    afterEach(() => {
      return seniorityTypeRepo.clear();
    });

    test('should return success with array of seniorityTypes', async () => {
      const { statusCode, body } = await request().get('/api/seniorityTypes');

      expect(statusCode).toBe(200);

      expect(body).toHaveLength(2);

      expect(body[0].name).toBe('До 6 мес.');
      expect(body[0].seniorityTypeId).toBe(
        seniorityType1.seniorityTypeId.toString()
      );

      expect(body[1].name).toBe('Старший флорист');
      expect(body[1].seniorityTypeId).toBe(
        seniorityType2.seniorityTypeId.toString()
      );
    });

    // context('when props is passed', () => {
    //   test('should return success with array with one seniorityType', async () => {
    //     const { statusCode, body } = await request().get(
    //       '/api/seniorityTypes?name=До 6 мес.'
    //     );

    //     expect(statusCode).toBe(200);

    //     expect(body).toHaveLength(1);

    //     expect(body[0].name).toBe('До 6 мес.');
    //     expect(body[0]).toHaveProperty('seniorityTypeId');
    //   });
    // });
  });

  context('when there are no seniorityTypes', () => {
    test('return success with empty array', async () => {
      const { statusCode, body } = await request().get('/api/seniorityTypes');

      expect(statusCode).toBe(200);
      expect(body).toHaveLength(0);
    });
  });
});
