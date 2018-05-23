import uuidv4 from 'uuid/v4';

import { container } from 'src/container';
import { request } from 'src/infra/support/test/request';

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
const awardsDTO = [{ value: 1, date: dateDTO1 }];
const updatedAwardsDTO = [{ value: 2, date: dateDTO2 }];

const date1 = new Date(dateDTO1);
const date2 = new Date(dateDTO2);

const seniorityTypeProps = { name: 'До 6 мес.', months: 6 };
const day1 = new Day({ value: date1 });
const day2 = new Day({ value: date2 });
const awards = [{ value: 1, day: day1 }];
const updatedAwards = [{ value: 2, day: day2 }];

describe('API :: POST /api/seniorityTypes/:id/piece_rates', () => {
  let seniorityType;
  let seniorityTypeDTO;
  let persistedSeniorityType;

  beforeEach(async () => {
    seniorityType = new SeniorityType(seniorityTypeProps);

    seniorityTypeDTO = {
      seniorityTypeId: seniorityType.seniorityTypeId.toString(),
      name: 'До 6 мес.',
      award: 2,
      awards: updatedAwardsDTO,
    };

    seniorityType.setAwards(awards);

    persistedSeniorityType = await seniorityTypeRepo.add(seniorityType);
  });

  afterEach(() => {
    return seniorityTypeRepo.clear();
  });

  context('when seniorityType exists', () => {
    context('when props are correct', () => {
      test('should edit piece rate and return 202 with updated seniorityType', async () => {
        const { statusCode, body } = await request()
          .put(
            `/api/seniorityTypes/${
              persistedSeniorityType.seniorityTypeId
            }/piece_rates`
          )
          .set('Accept', 'application/json')
          .send({
            award: {
              value: 1,
              date: dateDTO1,
            },
            updatedAward: {
              value: 2,
              date: dateDTO2,
            },
          });

        expect(statusCode).toBe(202);

        expect(body).toEqual(seniorityTypeDTO);
      });
    });

    context('when props are not correct', () => {
      context('when original and updated piece rate props are same', () => {
        test('should not edit piece rate and return 400 with the nothing to update error message', async () => {
          const { statusCode, body } = await request()
            .put(
              `/api/seniorityTypes/${
                persistedSeniorityType.seniorityTypeId
              }/piece_rates`
            )
            .set('Accept', 'application/json')
            .send({
              award: {
                value: 1,
                date: dateDTO1,
              },
              updatedAward: {
                value: 1,
                date: dateDTO1,
              },
            });

          expect(statusCode).toBe(400);
          expect(body.type).toBe('NothingToUpdate');
          expect(body.details).toEqual({
            award: [
              'Updated piece rate at 21.01.2018 for seniorityType "До 6 мес." already equlas 1%',
            ],
          });
        });
      });
      context(
        'when original and updated piece rate props are not passed',
        () => {
          test('should not edit piece rate and return 400 with the validation error message', async () => {
            const { statusCode, body } = await request()
              .put(
                `/api/seniorityTypes/${
                  persistedSeniorityType.seniorityTypeId
                }/piece_rates`
              )
              .set('Accept', 'application/json')
              .send({});

            expect(statusCode).toBe(400);
            expect(body.type).toBe('ValidationError');
            expect(body.details).toEqual({
              award: ["Piece rate can't be blank"],
              updatedAward: ["Updated piece rate can't be blank"],
            });
          });
        }
      );
      context('when original piece rate not exists', () => {
        test('should not edit piece rate and return 404 with the not found error message', async () => {
          const { statusCode, body } = await request()
            .put(
              `/api/seniorityTypes/${
                persistedSeniorityType.seniorityTypeId
              }/piece_rates`
            )
            .set('Accept', 'application/json')
            .send({
              award: {
                value: 2,
                date: dateDTO1,
              },
              updatedAward: {
                value: 2,
                date: dateDTO2,
              },
            });

          expect(statusCode).toBe(404);
          expect(body.type).toBe('NotFoundError');
          expect(body.details).toEqual({
            award: [
              `Piece rate with value 2 at ${day1.format(
                'DD.MM.YYYY'
              )} not found`,
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
        .put(`/api/seniorityTypes/${fakeSeniorityTypeId}/piece_rates`)
        .set('Accept', 'application/json')
        .send({
          award: {
            value: 1,
            date: date1,
          },
          updatedAward: {
            value: 2,
            date: date2,
          },
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
