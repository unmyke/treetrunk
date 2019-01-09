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

const dateDTO = '2018-01-21T00:00:00.000+08:00';
const date = new Date(dateDTO);

const seniorityTypeProps = { name: 'До 6 мес.', months: 6 };

const awardsDTO = [{ value: 1, date: dateDTO }];

let seniorityType;
let seniorityTypeDTO;
let persistedSeniorityType;

describe('API :: POST /api/seniority_types/:id/awards', () => {
  beforeEach(async () => {
    seniorityType = new SeniorityType(seniorityTypeProps);
    persistedSeniorityType = await seniorityTypeRepo.add(seniorityType);

    seniorityTypeDTO = {
      seniorityTypeId: seniorityType.seniorityTypeId.toString(),
      name: 'До 6 мес.',
      months: 6,
      award: 1,
      awards: awardsDTO,
    };
  });

  afterEach(() => {
    return seniorityTypeRepo.clear();
  });

  context('when seniorityType exists', () => {
    context('when props are correct', () => {
      test('should add award and return 201', async () => {
        const { statusCode, body } = await request()
          .post(
            `/api/seniority_types/${
              persistedSeniorityType.seniorityTypeId
            }/awards`
          )
          .set('Accept', 'application/json')
          .send({
            value: 1,
            date: dateDTO,
          });

        // expect(statusCode).toBe(201);

        expect(body).toEqual(seniorityTypeDTO);
      });
    });

    context('when props are not correct', () => {
      test('should not add award and return 400', async () => {
        const { statusCode, body } = await request()
          .post(
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
    context('when props are not passed', () => {
      test('should not add award and return 400', async () => {
        const { statusCode, body } = await request()
          .post(
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
    context('when award already exists', () => {
      context('when award at day already exists', () => {
        test('should not add award and return 409', async () => {
          const seniorityTypeToUpdate = await seniorityTypeRepo.getById(
            persistedSeniorityType.seniorityTypeId
          );
          const day = new Day({ value: date });
          seniorityTypeToUpdate.addAward(1, day);
          const updatedSeniorityType = await seniorityTypeRepo.save(
            seniorityTypeToUpdate
          );

          const { statusCode, body } = await request()
            .post(
              `/api/seniority_types/${
                persistedSeniorityType.seniorityTypeId
              }/awards`
            )
            .set('Accept', 'application/json')
            .send({
              value: 2,
              date: dateDTO,
            });

          expect(statusCode).toBe(409);
          expect(body.type).toBe('AlreadyExists');
          expect(body.details).toEqual({
            award: [`Award at ${day.format('DD.MM.YYYY')} already exists`],
          });
        });
      });

      context('when value eqauls existing value at date', () => {
        test('should not add award and return 409', async () => {
          const seniorityTypeToUpdate = await seniorityTypeRepo.getById(
            persistedSeniorityType.seniorityTypeId
          );
          const day = new Day({ value: date });
          seniorityTypeToUpdate.addAward(1, day.startOfMonth());
          const updatedSeniorityType = await seniorityTypeRepo.save(
            seniorityTypeToUpdate
          );

          const { statusCode, body } = await request()
            .post(
              `/api/seniority_types/${
                persistedSeniorityType.seniorityTypeId
              }/awards`
            )
            .set('Accept', 'application/json')
            .send({
              value: 1,
              date: dateDTO,
            });

          expect(statusCode).toBe(409);
          expect(body.type).toBe('AlreadyExists');
          expect(body.details).toEqual({
            award: [
              `Award value at ${day.format('DD.MM.YYYY')} already equals "1"`,
            ],
          });
        });
      });
    });
  });

  context('when seniorityType does not exists', () => {
    test('should not delete and return 404', async () => {
      const fakeSeniorityTypeId = uuidv4();

      const { statusCode, body } = await request()
        .post(`/api/seniority_types/${fakeSeniorityTypeId}/awards`)
        .set('Accept', 'application/json')
        .send({
          value: 1,
          date: date,
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
