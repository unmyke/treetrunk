import uuidv4 from 'uuid/v4';

import { container } from '@container';
import { request } from '@infra/support/test/request';

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

const seniorityTypeProps = { name: 'До 6 мес', months: 6 };
const day1 = new Day({ value: date1 });
const day2 = new Day({ value: date2 });
const awards = [{ value: 1, day: day1 }];
const updatedAwards = [{ value: 2, day: day2 }];

describe('API :: POST /api/seniority_types/:id/awards', () => {
  let seniorityType;
  let seniorityTypeDTO;
  let persistedSeniorityType;

  beforeEach(async () => {
    seniorityType = new SeniorityType(seniorityTypeProps);

    seniorityTypeDTO = {
      seniorityTypeId: seniorityType.seniorityTypeId.toString(),
      name: 'До 6 мес',
      months: 6,
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
      test('should edit award and return 202 with updated seniorityType', async () => {
        const { statusCode, body } = await request()
          .put(
            `/api/seniority_types/${
              persistedSeniorityType.seniorityTypeId
            }/awards`
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
      context('when original and updated award props are same', () => {
        test('should not edit award and return 400 with the nothing to update error message', async () => {
          const { statusCode, body } = await request()
            .put(
              `/api/seniority_types/${
                persistedSeniorityType.seniorityTypeId
              }/awards`
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
              'Updated award at 21.01.2018 for seniority type "До 6 мес" already equlas 1%',
            ],
          });
        });
      });

      context('when award already exists', () => {
        let dateDTO3;
        beforeEach(async () => {
          dateDTO3 = '2018-03-21T00:00:00.000+08:00';
          seniorityType.addAward(2, day2);
          await seniorityTypeRepo.save(seniorityType);
        });

        context('when award at update day already exists', () => {
          test('should not edit award and return 409 with the nothing to update error message', async () => {
            const { statusCode, body } = await request()
              .put(
                `/api/seniority_types/${
                  persistedSeniorityType.seniorityTypeId
                }/awards`
              )
              .set('Accept', 'application/json')
              .send({
                award: {
                  value: 1,
                  date: dateDTO1,
                },
                updatedAward: {
                  value: 3,
                  date: dateDTO2,
                },
              });

            expect(statusCode).toBe(409);
            expect(body.type).toBe('AlreadyExists');
            expect(body.details).toEqual({
              award: ['Award at 21.02.2018 already exists'],
            });
          });
        });
        context(
          'when update value equals existing value at update date',
          () => {
            test('should not edit award and return 409 with the nothing to update error message', async () => {
              const { statusCode, body } = await request()
                .put(
                  `/api/seniority_types/${
                    persistedSeniorityType.seniorityTypeId
                  }/awards`
                )
                .set('Accept', 'application/json')
                .send({
                  award: {
                    value: 1,
                    date: dateDTO1,
                  },
                  updatedAward: {
                    value: 2,
                    date: dateDTO3,
                  },
                });

              expect(statusCode).toBe(409);
              expect(body.type).toBe('AlreadyExists');
              expect(body.details).toEqual({
                award: ['Award value at 21.03.2018 already equals "2"'],
              });
            });
          }
        );
      });

      context('when original and updated award props are not passed', () => {
        test('should not edit award and return 400 with the validation error message', async () => {
          const { statusCode, body } = await request()
            .put(
              `/api/seniority_types/${
                persistedSeniorityType.seniorityTypeId
              }/awards`
            )
            .set('Accept', 'application/json')
            .send({});

          expect(statusCode).toBe(400);
          expect(body.type).toBe('ValidationError');
          expect(body.details).toEqual({
            award: ["Award can't be blank"],
            updatedAward: ["Updated award can't be blank"],
          });
        });
      });
      context('when original award not exists', () => {
        test('should not edit award and return 404 with the not found error message', async () => {
          const { statusCode, body } = await request()
            .put(
              `/api/seniority_types/${
                persistedSeniorityType.seniorityTypeId
              }/awards`
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
              `Award with value 2 at ${day1.format('DD.MM.YYYY')} not found`,
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
        .put(`/api/seniority_types/${fakeSeniorityTypeId}/awards`)
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
