import container from '@container';
import request from '@infra/support/test/request';

const {
  entities: {
    SellerManagement: {
      entities: { Seller },
    },
  },
  repositories: {
    SellerManagement: { Seller: sellerRepo },
  },
} = container;

const sellerDTO = {
  firstName: 'Firstname',
  middleName: 'Middlename',
  lastName: 'Lastname',
  phone: '00-00-00',
};

describe('API :: POST /api/sellers', () => {
  beforeEach(() => {
    return sellerRepo.clear();
  });

  context('when props are correct', () => {
    test('should return success with array with one seller', async () => {
      const { statusCode, body } = await request()
        .post('/api/sellers')
        .set('Accept', 'application/json')
        .send(sellerDTO);

      expect(statusCode).toBe(201);

      expect(body).toHaveProperty('sellerId');
      expect(body.firstName).toBe(sellerDTO.firstName);
      expect(body.middleName).toBe(sellerDTO.middleName);
      expect(body.middleName).toBe(sellerDTO.middleName);
      expect(body.lastName).toBe(sellerDTO.lastName);
      expect(body.phone).toBe(sellerDTO.phone);
    });
  });

  context('when props are incorrect', () => {
    context('when props are invalid', () => {
      test('should return 400 with array of errors', async () => {
        const { statusCode, body } = await request()
          .post('/api/sellers')
          .set('Accept', 'application/json')
          .send({
            ...sellerDTO,
            phone: 'test',
          });

        expect(statusCode).toBe(400);
        expect(body.type).toBe('ValidationError');
        expect(body.details).toEqual({
          phone: ['Phone is invalid'],
        });
      });
    });
    context('when there are no props', () => {
      test('should return 400 with array of errors', async () => {
        const { statusCode, body } = await request()
          .post('/api/sellers')
          .set('Accept', 'application/json')
          .send();

        expect(statusCode).toBe(400);
        expect(body.type).toBe('ValidationError');
        expect(body.details).toEqual({
          firstName: ["First name can't be blank"],
          middleName: ["Middle name can't be blank"],
          lastName: ["Last name can't be blank"],
          phone: ["Phone can't be blank"],
        });
      });
    });
  });

  context('when seller exists', () => {
    test('should return 409 with array of errors', async () => {
      const seller = new Seller(sellerDTO);
      await sellerRepo.add(seller);

      const { statusCode, body } = await request()
        .post('/api/sellers')
        .set('Accept', 'application/json')
        .send(sellerDTO);

      expect(statusCode).toBe(409);
      expect(body.type).toBe('AlreadyExists');
      expect(body.details).toEqual({
        lastName: [
          'Seller with lastName: "Lastname", firstName: "Firstname", middleName: "Middlename", phone: "00-00-00" already exists',
        ],
      });
    });
  });
});
