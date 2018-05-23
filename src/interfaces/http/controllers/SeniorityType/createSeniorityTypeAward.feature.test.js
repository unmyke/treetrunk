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

const dateDTO = '2018-01-21T00:00:00.000+08:00';
const date = new Date(dateDTO);

const seniorityTypeProps = { name: 'До 6 мес.', months: 6 };

const awardsDTO = [{ value: 1, date: dateDTO }];

let seniorityType;
let seniorityTypeDTO;
let persistedSeniorityType;

describe('API :: POST /api/seniorityTypes/:id/piece_rates', () => {
  beforeEach(async () => {
    seniorityType = new SeniorityType(seniorityTypeProps);
    persistedSeniorityType = await seniorityTypeRepo.add(seniorityType);

    seniorityTypeDTO = {
      seniorityTypeId: seniorityType.seniorityTypeId.toString(),
      name: 'До 6 мес.',
      award: 1,
      awards: awardsDTO,
    };
  });

  afterEach(() => {
    return seniorityTypeRepo.clear();
  });

  context('when seniorityType exists', () => {
    context('when props are correct', () => {
      test('should add piece rate and return 201', async () => {
        const { statusCode, body } = await request()
          .post(
            `/api/seniorityTypes/${
              persistedSeniorityType.seniorityTypeId
            }/piece_rates`
          )
          .set('Accept', 'application/json')
          .send({
            value: 1,
            date: dateDTO,
          });

        expect(statusCode).toBe(201);

        expect(body).toEqual(seniorityTypeDTO);
      });
    });

    context('when props are not correct', () => {
      test('should not add piece rate and return 400', async () => {
        const { statusCode, body } = await request()
          .post(
            `/api/seniorityTypes/${
              persistedSeniorityType.seniorityTypeId
            }/piece_rates`
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
            'Piece rate value "test" is not a valid number',
            'Piece rate date "test" is not a valid date',
          ],
        });
      });
    });
    context('when props are not passed', () => {
      test('should not add piece rate and return 400', async () => {
        const { statusCode, body } = await request()
          .post(
            `/api/seniorityTypes/${
              persistedSeniorityType.seniorityTypeId
            }/piece_rates`
          )
          .set('Accept', 'application/json')
          .send({});

        expect(statusCode).toBe(400);
        expect(body.type).toBe('ValidationError');
        expect(body.details).toEqual({
          award: [
            "Piece rate value can't be blank",
            "Piece rate date can't be blank",
          ],
        });
      });
    });
    context('when piece rate already exists', () => {
      test('should not add piece rate and return 409', async () => {
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
            `/api/seniorityTypes/${
              persistedSeniorityType.seniorityTypeId
            }/piece_rates`
          )
          .set('Accept', 'application/json')
          .send({
            value: '1',
            date: dateDTO,
          });

        expect(statusCode).toBe(409);
        expect(body.type).toBe('AlreadyExists');
        expect(body.details).toEqual({
          award: [
            `Piece rate with value: 1 at ${day.format(
              'DD.MM.YYYY'
            )} already exists`,
          ],
        });
      });
    });
  });

  context('when seniorityType does not exists', () => {
    test('should not delete and return 404', async () => {
      const fakeSeniorityTypeId = uuidv4();

      const { statusCode, body } = await request()
        .post(`/api/seniorityTypes/${fakeSeniorityTypeId}/piece_rates`)
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

  // context('when seniorityType is appointed by existing sellers', () => {
  //   test('should not delete and return 409', async () => {
  //     const seller = new Seller({
  //       firstName: 'Firstname',
  //       middleName: 'Middlename',
  //       lastName: 'Lastname',
  //       phone: '00-00-00',
  //     });
  //     seller.addAppointment(persistedSeniorityType.seniorityTypeId, new Day());
  //     await sellerRepo.add(seller);

  //     const { statusCode, body } = await request()
  //       .delete(`/api/seniorityTypes/${persistedSeniorityType.seniorityTypeId}`)
  //       .send();

  //     expect(statusCode).toBe(409);
  //     expect(body.type).toBe('NotAllowedError');
  //     expect(body.details).toEqual({
  //       seniorityType: [`There are sellers appointed to seniorityType "До 6 мес."`],
  //     });
  //   });
  // });
});
