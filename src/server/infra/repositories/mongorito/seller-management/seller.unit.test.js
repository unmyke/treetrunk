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

describe('#SellerRepository', () => {
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
    let sellers;

    beforeEach(() =>
      factory
        .createMany('seller', 11, {}, { appointmentsCount: 2 })
        .then((models) => {
          sellers = models;
        })
    );

    afterEach(() => factory.cleanUp());

    context('if passed no options', () => {
      test('should return paged portion of list', () =>
        sellerRepo.getList().then((list) => {
          expect(list).toBeInstanceOf(Object);
          expect(list).toHaveProperty('result');
          expect(list).toHaveProperty('hasMore');
          expect(list).toHaveProperty('cursor');
          expect(list.result).toHaveLength(10);
          expect(list.hasMore).toBeTruthy();
          expect(typeof list.cursor).toBe('string');
        }));
    });

    context('if passed cursor only', () => {
      test('should return paged portion of list', () =>
        sellerRepo.getList().then(({ cursor }) =>
          sellerRepo.getList({ after: cursor }).then((list) => {
            expect(list).toBeInstanceOf(Object);
            expect(list).toHaveProperty('result');
            expect(list).toHaveProperty('hasMore');
            expect(list).toHaveProperty('cursor');
            expect(list.result).toHaveLength(1);
            expect(list.hasMore).toBeFalsy();
            expect(typeof list.cursor).toBe('string');
          })
        ));
    });
  });
});
