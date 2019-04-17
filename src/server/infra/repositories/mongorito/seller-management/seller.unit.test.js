import config from '@config';
console.log(config);
import { Seller } from '@domain/subdomains/seller-management';
import { Seller as sellerRepo } from '@infra/repositories/seller-management';
import getDatabase from 'src/server/infra/database';

import cleanDatabase from '@infra/support/test/clean-database';
import factory from '@infra/support/test/factory';

const {
  models: { Seller: SellerModel },
  database,
} = getDatabase(config);

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
    let sellers;

    beforeEach(() =>
      factory
        .createMany('seller', 10, {}, { appointmentsCount: 10 })
        .then((models) => {
          sellers = models;
        })
    );

    // afterEach(() => factory.cleanUp());

    context('if passed no options', () => {
      test('should return paged portion of list', () =>
        sellerRepo.getList().then((list) => {
          expect(list).toBeInstanceOf(Object);
        }));
    });
  });
});
