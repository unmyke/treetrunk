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

const seniorityType = new SeniorityType(seniorityTypeProps);
seniorityType.setAwards(awards);

const seniorityTypeDTO = {
  seniorityTypeId: seniorityType.seniorityTypeId.toString(),
  name: 'До 6 мес.',
  award: 2,
  awards: awardsDTO,
};

describe('API :: GET /api/seniorityTypes/:id', () => {
  beforeEach(() => {
    return seniorityTypeRepo.add(seniorityType);
  });

  afterEach(() => {
    return seniorityTypeRepo.clear();
  });

  context('when seniorityType exists', () => {
    test('updates and returns 202 with the updated seniorityType', async () => {
      const { statusCode, body } = await request().get(
        `/api/seniorityTypes/${seniorityType.seniorityTypeId}`
      );

      expect(statusCode).toBe(200);

      expect(body).toEqual(seniorityTypeDTO);
    });
  });

  context('when seller does not exist', () => {
    test('returns a not found error and status 404', async () => {
      const uuid = uuidv4();
      const { statusCode, body } = await request().get(
        `/api/seniorityTypes/${uuid}`
      );

      expect(statusCode).toBe(404);
      expect(body).toEqual({
        type: 'NotFoundError',
        details: {
          seniorityTypeId: [
            `SeniorityType with seniorityTypeId: "${uuid}" not found`,
          ],
        },
      });
    });
  });
});
