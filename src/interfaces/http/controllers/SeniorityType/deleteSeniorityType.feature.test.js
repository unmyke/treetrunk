import uuidv4 from 'uuid/v4';

import { container } from 'src/container';
import { request } from 'src/infra/support/test/request';

const {
  subdomains: {
    SellerManagement: {
      entities: { SeniorityType, Seller },
    },
  },
  commonTypes: { Day, SeniorityTypeId },
  repositories: {
    SellerManagement: { SeniorityType: seniorityTypeRepo, Seller: sellerRepo },
  },
} = container;

SeniorityTypeId.quitSeniorityTypeId = new SeniorityTypeId();

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
let seniorityTypeToDelete;

describe('API :: DELETE /api/seniorityTypes/:id', () => {
  beforeEach(async () => {
    seniorityType = new SeniorityType(seniorityTypeProps);
    seniorityType.setAwards(awards);

    seniorityTypeDTO = {
      seniorityTypeId: seniorityType.seniorityTypeId.toString(),
      name: 'До 6 мес.',
      award: 2,
      awards,
    };

    seniorityTypeToDelete = await seniorityTypeRepo.add(seniorityType);
  });

  afterEach(() => {
    return seniorityTypeRepo.clear();
  });

  context('when seniorityType exists', () => {
    test('should delete and return 202', async () => {
      const { statusCode, body } = await request()
        .delete(`/api/seniorityTypes/${seniorityTypeToDelete.seniorityTypeId}`)
        .send();

      expect(statusCode).toBe(202);

      expect(body).toEqual({});
    });
  });

  context('when seniorityType does not exists', () => {
    test('should not delete and return 404', async () => {
      const fakeSeniorityTypeId = uuidv4();

      const { statusCode, body } = await request()
        .delete(`/api/seniorityTypes/${fakeSeniorityTypeId}`)
        .send();

      expect(statusCode).toBe(404);
      expect(body.type).toBe('NotFoundError');
      expect(body.details).toEqual({
        seniorityTypeId: [
          `SeniorityType with seniorityTypeId: "${fakeSeniorityTypeId}" not found`,
        ],
      });
    });
  });

  context('when seniorityType is appointed by existing sellers', () => {
    test('should not delete and return 409', async () => {
      const seller = new Seller({
        firstName: 'Firstname',
        middleName: 'Middlename',
        lastName: 'Lastname',
        phone: '00-00-00',
      });
      seller.addAppointment(seniorityTypeToDelete.seniorityTypeId, new Day());
      await sellerRepo.add(seller);

      const { statusCode, body } = await request()
        .delete(`/api/seniorityTypes/${seniorityTypeToDelete.seniorityTypeId}`)
        .send();

      expect(statusCode).toBe(409);
      expect(body.type).toBe('NotAllowedError');
      expect(body.details).toEqual({
        seniorityType: [
          'There are sellers appointed to seniorityType "До 6 мес."',
        ],
      });
    });
  });
});
