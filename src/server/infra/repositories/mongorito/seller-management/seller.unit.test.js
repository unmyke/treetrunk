import container from '@container';
import cleanDatabase from '@infra/support/test/clean-database';
import factory from '@infra/support/test/factory';

const {
  subdomains: {
    SellerManagement: { Seller },
  },
  commonTypes: { SellerId },
  repositories: {
    SellerManagement: { Seller: sellerRepo },
  },
  models: { Seller: SellerModel },
  database,
} = container;

describe('#SellerRepository', () => {
  beforeAll(() => database.connect());
  afterAll(() => database.disconnect());
  beforeEach(cleanDatabase);

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

      return SellerModel.count().then((c) => (countBefore = c));
    });

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

  describe('#update', () => {
    let prevSeller;
    let countBefore;

    beforeEach(() =>
      factory
        .create('seller')
        .then((s) => (prevSeller = s.get()))
        .then(() => SellerModel.count())
        .then((c) => (countBefore = c))
    );

    context('if passed correct entity', () => {
      test('should save entity', () => {
        const seller = new Seller({
          sellerId: new SellerId({ value: prevSeller.sellerId }),
          firstName: 'firstName',
          middleName: 'middleName',
          lastName: 'lastName',
          phone: '11-11-11',
        });

        return sellerRepo.save(seller).then((entity) => {
          expect(entity).toBeInstanceOf(Seller);
          expect(entity).not.toBe(seller);
          expect(entity.sellerId).toEqual(seller.sellerId);
          expect(entity.sellerId.valueOf()).toBe(prevSeller.sellerId);
          expect(entity.firstName).toBe(seller.firstName);
          expect(entity.firstName).not.toBe(prevSeller.firstName);
          expect(entity.middleName).toBe(seller.middleName);
          expect(entity.middleName).not.toBe(prevSeller.middleName);
          expect(entity.lastName).toBe(seller.lastName);
          expect(entity.lastName).not.toBe(prevSeller.lastName);
          expect(SellerModel.count()).resolves.toBe(countBefore);
        });
      });
    });
  });

  describe('#getList', () => {
    let sellers;

    context('if passed no options', () => {
      beforeEach(() =>
        factory
          .createMany('seller', 12, {}, { appointmentsCount: 0 })
          .then((models) => (sellers = models.map((seller) => seller.get())))
      );

      test('should return paged list', () =>
        sellerRepo.getList().then((list) => {
          expect(list).toBeInstanceOf(Object);
          expect(list).toHaveProperty('result');
          expect(list).toHaveProperty('hasMore');
          expect(list).toHaveProperty('cursor');
          expect(list.result).toHaveLength(10);
          list.result.forEach((seller) => {
            expect(seller).toBeInstanceOf(Seller);
          });
          expect(list.hasMore).toBeTruthy();
          expect(typeof list.cursor).toBe('string');
        }));
    });

    context('if passed cursor only', () => {
      beforeEach(() =>
        factory
          .createMany('seller', 19, {}, { appointmentsCount: 0 })
          .then((models) => (sellers = models.map((seller) => seller.get())))
      );

      test('should return paged list', () =>
        sellerRepo
          .getList({ pageSize: 15 })
          .then((list) => {
            expect(list).toBeInstanceOf(Object);
            expect(list).toHaveProperty('result');
            expect(list).toHaveProperty('hasMore');
            expect(list).toHaveProperty('cursor');
            expect(list.result).toHaveLength(15);
            list.result.forEach((seller) => {
              expect(seller).toBeInstanceOf(Seller);
            });
            expect(list.hasMore).toBeTruthy();
            expect(typeof list.cursor).toBe('string');

            return list.cursor;
          })
          .then((cursor) => sellerRepo.getList({ after: cursor }))
          .then((list) => {
            expect(list).toBeInstanceOf(Object);
            expect(list).toHaveProperty('result');
            expect(list).toHaveProperty('hasMore');
            expect(list).toHaveProperty('cursor');
            expect(list.result).toHaveLength(4);
            list.result.forEach((seller) => {
              expect(seller).toBeInstanceOf(Seller);
            });
            expect(list.hasMore).toBeFalsy();
            expect(typeof list.cursor).toBe('string');
          }));
    });

    context(
      'if passed cursor and persisted entities with same sort value',
      () => {
        beforeEach(() =>
          factory
            .createMany('seller', 19, {}, { appointmentsCount: 0 })
            .then((models) => (sellers = models.map((seller) => seller.get())))
        );

        test('should return paged portion of list', () =>
          sellerRepo
            .getList({ pageSize: 9, sort: 'state' })
            .then((list) => {
              expect(list).toBeInstanceOf(Object);
              expect(list).toHaveProperty('result');
              expect(list).toHaveProperty('hasMore');
              expect(list).toHaveProperty('cursor');
              expect(list.result).toHaveLength(9);
              list.result.forEach((seller) => {
                expect(seller).toBeInstanceOf(Seller);
              });
              expect(list.hasMore).toBeTruthy();
              expect(typeof list.cursor).toBe('string');

              return { cursor: list.cursor, prevResult: list.result };
            })
            .then(({ cursor, prevResult }) =>
              Promise.all([
                sellerRepo.getList({ after: cursor }),
                Promise.resolve(prevResult),
              ])
            )
            .then(([list, prevResult]) => {
              expect(list).toBeInstanceOf(Object);
              expect(list).toHaveProperty('result');
              expect(list).toHaveProperty('hasMore');
              expect(list).toHaveProperty('cursor');
              list.result.forEach((seller) => {
                expect(prevResult).not.toContainEqual(seller);
              });
              expect(list.result).toHaveLength(9);
              list.result.forEach((seller) => {
                expect(seller).toBeInstanceOf(Seller);
              });
              expect(list.hasMore).toBeTruthy();
              expect(typeof list.cursor).toBe('string');

              return Promise.all([
                sellerRepo.getList({ after: list.cursor }),
                Promise.resolve([...prevResult, ...list.result]),
              ]);
            })
            .then(([list, prevResult]) => {
              expect(list).toBeInstanceOf(Object);
              expect(list).toHaveProperty('result');
              expect(list).toHaveProperty('hasMore');
              expect(list).toHaveProperty('cursor');
              list.result.forEach((seller) => {
                expect(prevResult).not.toContainEqual(seller);
              });
              expect(list.result).toHaveLength(1);
              list.result.forEach((seller) => {
                expect(seller).toBeInstanceOf(Seller);
              });
              expect(list.hasMore).toBeFalsy();
              expect(typeof list.cursor).toBe('string');
            }));
      }
    );

    context('if passed offset options', () => {
      beforeEach(() =>
        factory
          .createMany('seller', 19, {}, { appointmentsCount: 0 })
          .then((models) => (sellers = models.map((seller) => seller.get())))
      );

      test('should return paged portion of list', () =>
        sellerRepo
          .getList({ pageSize: 15, page: 1, order: 'asc' })
          .then((list) => {
            const s = sellers;
            expect(list).toBeInstanceOf(Object);
            expect(list).toHaveProperty('result');
            expect(list).toHaveProperty('hasMore');
            expect(list).toHaveProperty('cursor');
            expect(list.result).toHaveLength(4);
            list.result.forEach((seller) => {
              expect(seller).toBeInstanceOf(Seller);
            });
            expect(list.hasMore).toBeFalsy();
            expect(typeof list.cursor).toBe('string');
          }));
    });
  });
});
