import uuidv4 from 'uuid/v4';

import container from '@container';
import request from '@infra/support/test/request';

const {
  subdomains: {
    SellerManagement: {
      entities: { SeniorityType, Seller },
    },
  },
  commonTypes: { Day },
  repositories: {
    SellerManagement: { SeniorityType: seniorityTypeRepo, Seller: sellerRepo },
  },
} = container;

const dateDTO1 = '2018-01-21T00:00:00.000+08:00';
const dateDTO2 = '2018-02-21T00:00:00.000+08:00';
const awardsDTO = [{ value: 1, date: dateDTO1 }, { value: 2, date: dateDTO2 }];
const afterDeleteAwardsDTO = [{ value: 2, date: dateDTO2 }];

const date1 = new Date(dateDTO1);
const date2 = new Date(dateDTO2);

const seniorityTypeProps = { name: 'До 6 мес.', months: 6 };
const day1 = new Day({ value: date1 });
const day2 = new Day({ value: date2 });
const awards = [{ value: 1, day: day1 }, { value: 2, day: day2 }];
const afterDeleteAwards = [{ value: 2, day: day2 }];

describe('API :: DELETE /api/seniority_types/:id/awards', () => {
  let seniorityType;
  let seniorityTypeDTO;
  let persistedSeniorityType;

  beforeEach(async () => {
    seniorityType = new SeniorityType(seniorityTypeProps);

    seniorityTypeDTO = {
      seniorityTypeId: seniorityType.seniorityTypeId.toString(),
      name: 'До 6 мес.',
      months: 6,
      award: 2,
      awards: afterDeleteAwardsDTO,
    };

    seniorityType.setAwards(awards);

    persistedSeniorityType = await seniorityTypeRepo.add(seniorityType);
  });

  afterEach(() => {
    return seniorityTypeRepo.clear();
  });

  context('when seniorityType exists', () => {
    context('when props are correct', () => {
      test('should delete award and return 202 with updated seniorityType', async () => {
        const { statusCode, body } = await request()
          .delete(
            `/api/seniority_types/${
              persistedSeniorityType.seniorityTypeId
            }/awards`
          )
          .set('Accept', 'application/json')
          .send({
            value: 1,
            date: dateDTO1,
          });

        expect(statusCode).toBe(202);

        expect(body).toEqual(seniorityTypeDTO);
      });
    });

    context('when props are not correct', () => {
      context('when award with props not exists', () => {
        test('should not delete award and return 400 with the not found error message', async () => {
          const { statusCode, body } = await request()
            .delete(
              `/api/seniority_types/${
                persistedSeniorityType.seniorityTypeId
              }/awards`
            )
            .set('Accept', 'application/json')
            .send({
              value: 2,
              date: dateDTO1,
            });

          expect(statusCode).toBe(404);
          expect(body.type).toBe('NotFoundError');
          expect(body.details).toEqual({
            award: [
              `Award with value 2 at ${day1.format('DD.MM.YYYY')} not found`,
            ],
          });
        });
      });
      context('when props are not correct', () => {
        test('should not delete award and return 400 with the validation error message', async () => {
          const { statusCode, body } = await request()
            .delete(
              `/api/seniority_types/${
                persistedSeniorityType.seniorityTypeId
              }/awards`
            )
            .set('Accept', 'application/json')
            .send({});

          expect(statusCode).toBe(400);
          expect(body.type).toBe('ValidationError');
          expect(body.details).toEqual({
            award: ["Award value can't be blank", "Award date can't be blank"],
          });
        });
      });
      context('when props are not passed', () => {
        test('should not delete award and return 400 with the validation error message', async () => {
          const { statusCode, body } = await request()
            .delete(
              `/api/seniority_types/${
                persistedSeniorityType.seniorityTypeId
              }/awards`
            )
            .set('Accept', 'application/json')
            .send({
              value: 'test',
              date: 'test',
            });

          expect(statusCode).toBe(400);
          expect(body.type).toBe('ValidationError');
          expect(body.details).toEqual({
            award: [
              'Award value "test" is not a valid number',
              'Award date "test" is not a valid date',
            ],
          });
        });
      });
    });
  });

  context('when seniorityType does not exists', () => {
    test('should not delete and return 404 with the nothing to update message', async () => {
      const fakeSeniorityTypeId = uuidv4();

      const { statusCode, body } = await request()
        .delete(`/api/seniority_types/${fakeSeniorityTypeId}/awards`)
        .set('Accept', 'application/json')
        .send({
          value: 1,
          date: dateDTO1,
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
});
