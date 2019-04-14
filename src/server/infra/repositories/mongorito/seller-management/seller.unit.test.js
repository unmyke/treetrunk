import container from '@container';
import cleanDatabase from '@infra/support/test/clean-database';
import factory from '@infra/support/test/factory';

const {
  subdomains: {
    SellerManagement: { Seller },
  },
  repositories: {
    SellerManagement: { Seller: sellerRepo },
  },
  models: { Seller: SellerModel },
  database,
} = container;

describe('SellerRepository', () => {
  beforeAll(() => database.connect());
  afterAll(() => database.disconnect());

  describe('#add', () => {
    let seller;
    let countBefore;

    beforeEach(() => {
      seller = new Seller({
        firstName: 'firstName',
        middleName: 'middleName',
        lastName: 'lastName',
        phone: '11-11-11',
      });

      return SellerModel.count().then((c) => {
        countBefore = c;
      });
    });

    afterEach(() => cleanDatabase());

    context('if passed correct entity', () => {
      test('should save entity', () =>
        sellerRepo.add(seller).then((entity) => {
          expect(entity).toBeInstanceOf(Seller);
          expect(entity).not.toBe(seller);
          expect(entity.firstName).toBe(seller.firstName);
          expect(entity.middleName).toBe(seller.middleName);
          expect(entity.lastName).toBe(seller.lastName);
          expect(SellerModel.count()).resolves.toBe(countBefore + 1);
        }));
    });
  });

  describe('#getList', () => {
    beforeEach(() => {
      const sellers = [];
    });
  });
});
