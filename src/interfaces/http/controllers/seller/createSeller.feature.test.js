import { container } from 'src/container';
import { request } from 'src/infra/support/test/request';

const {
  subdomains: {
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
  context('when props are correct', () => {
    beforeEach(() => {
      return sellerRepo.clear();
    });

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
        phone: ["Phone name can't be blank"],
      });
    });
  });

  context('when seller exists', () => {
    test('should return 409 with array of errors', async () => {
      const seller = new Seller({ name: 'Флорист' });
      const { statusCode, body } = await request()
        .post('/api/posts')
        .set('Accept', 'application/json')
        .send(postDTO);

      expect(statusCode).toBe(409);
      expect(body.type).toBe('AlreadyExists');
      expect(body.details).toEqual({
        name: ['Seller with name: "Флорист" already exists'],
      });
    });
  });
});
