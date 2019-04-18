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

    afterEach(() => factory.cleanUp());

    context('if passed no options', () => {
      beforeEach(() =>
        factory
          .createMany('seller', 12, {}, { appointmentsCount: 0 })
          .then((models) => {
            sellers = models.map((seller) => seller.get());
          })
      );

      test('should return paged list', () =>
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
      beforeEach(() =>
        factory
          .createMany('seller', 19, {}, { appointmentsCount: 0 })
          .then((models) => {
            sellers = models.map((seller) => seller.get());
          })
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
            .then((models) => {
              sellers = models.map((seller) => seller.get());
            })
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
              expect(list.hasMore).toBeFalsy();
              expect(typeof list.cursor).toBe('string');
            }));
      }
    );

    context('if passed offset options', () => {
      beforeEach(() =>
        factory
          .createMany('seller', 19, {}, { appointmentsCount: 0 })
          .then((models) => {
            sellers = models.map((seller) => seller.get());
          })
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
            expect(list.hasMore).toBeFalsy();
            expect(typeof list.cursor).toBe('string');
          }));
    });
  });
});
