import container from '@container';

const {
  entities: {
    SellerManagement: { Seller },
  },
  commonTypes: { SellerId },
  repositories: {
    SellerManagement: { Seller: sellerRepo },
  },
  models: { Seller: SellerModel },
  tests: {
    infra: { cleanDatabase, factory },
  },
  database,
} = container;

describe('#SellerRepository', () => {
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

        return sellerRepo
          .save(seller)
          .then((entity) =>
            Promise.all([
              SellerModel.findOne({ sellerId: prevSeller.sellerId }),
              Promise.resolve(entity),
            ])
          )
          .then(([model, entity]) => {
            const persistedSeller = model.get();

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
            expect(entity.state).toBe(seller.state);
            expect(entity.state).not.toBe(prevSeller.state);
            expect(SellerModel.count()).resolves.toBe(countBefore);

            expect(persistedSeller.sellerId).toBe(entity.sellerId.value);
            expect(persistedSeller.firstName).toBe(entity.firstName);
            expect(persistedSeller.middleName).toBe(entity.middleName);
            expect(persistedSeller.lastName).toBe(entity.lastName);
            expect(persistedSeller.phone).toBe(entity.phone);
            expect(persistedSeller.state).toBe(entity.state);
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
          expect(list).toHaveProperty('entities');
          expect(list).toHaveProperty('hasAfter');
          expect(list).toHaveProperty('hasBefore');
          expect(list.entities).toHaveLength(10);
          list.entities.forEach((seller) => {
            expect(seller).toBeInstanceOf(Seller);
          });
          expect(list.hasBefore).toBeFalsy();
          expect(list.hasAfter).toBeTruthy();
        }));
    });

    context('if passed id only', () => {
      beforeEach(() =>
        factory
          .createMany('seller', 19, {}, { appointmentsCount: 0 })
          .then((models) => (sellers = models.map((seller) => seller.get())))
      );

      test('should return paged list', () =>
        sellerRepo
          .getList({ count: 15 })
          .then((list) => {
            expect(list).toBeInstanceOf(Object);
            expect(list).toHaveProperty('entities');
            expect(list).toHaveProperty('hasAfter');
            expect(list).toHaveProperty('hasBefore');
            expect(list.entities).toHaveLength(15);
            list.entities.forEach((seller) => {
              expect(seller).toBeInstanceOf(Seller);
            });
            expect(list.hasAfter).toBeTruthy();

            const lastId = list.entities[list.entities.length - 1].sellerId;
            return lastId;
          })
          .then((id) => sellerRepo.getList({ id }))
          .then((list) => {
            expect(list).toBeInstanceOf(Object);
            expect(list).toHaveProperty('entities');
            expect(list).toHaveProperty('hasAfter');
            expect(list).toHaveProperty('hasBefore');
            expect(list.entities).toHaveLength(4);
            list.entities.forEach((seller) => {
              expect(seller).toBeInstanceOf(Seller);
            });
            expect(list.hasAfter).toBeFalsy();
          }));
    });

    context('if passed id and persisted entities with same sort value', () => {
      beforeEach(() =>
        factory
          .createMany('seller', 19, {}, { appointmentsCount: 0 })
          .then(() => SellerModel.find())
          .then((models) => (sellers = models.map((seller) => seller.get())))
      );

      test('should return paged portion of list', () =>
        sellerRepo
          .getList({ count: 9, sort: { field: 'state' } })
          .then((list) => {
            expect(list).toBeInstanceOf(Object);
            expect(list).toHaveProperty('entities');
            expect(list).toHaveProperty('hasAfter');
            expect(list).toHaveProperty('hasBefore');
            expect(list.entities).toHaveLength(9);
            list.entities.forEach((seller) => {
              expect(seller).toBeInstanceOf(Seller);
            });
            expect(list.hasAfter).toBeTruthy();

            const lastId = list.entities[list.entities.length - 1].sellerId;
            return {
              id: lastId,
              prevIds: list.entities.map(({ sellerId: { value } }) => value),
            };
          })
          .then(({ id, prevIds }) =>
            Promise.all([
              sellerRepo.getList({ id, count: 9, sort: { field: 'state' } }),
              Promise.resolve(prevIds),
            ])
          )
          .then(([list, prevIds]) => {
            expect(list).toBeInstanceOf(Object);
            expect(list).toHaveProperty('entities');
            expect(list).toHaveProperty('hasAfter');
            expect(list).toHaveProperty('hasBefore');
            list.entities.forEach(({ sellerId: { value } }) => {
              expect(prevIds).not.toContainEqual(value);
            });
            expect(list.entities).toHaveLength(9);
            list.entities.forEach((seller) => {
              expect(seller).toBeInstanceOf(Seller);
            });
            expect(list.hasAfter).toBeTruthy();

            const lastId = list.entities[list.entities.length - 1].sellerId;
            return Promise.all([
              sellerRepo.getList({
                id: lastId,
                count: 9,
                sort: { field: 'state' },
              }),
              Promise.resolve([
                ...prevIds,
                ...list.entities.map(({ sellerId: { value } }) => value),
              ]),
            ]);
          })
          .then(([list, prevIds]) => {
            expect(list).toBeInstanceOf(Object);
            expect(list).toHaveProperty('entities');
            expect(list).toHaveProperty('hasAfter');
            expect(list).toHaveProperty('hasBefore');
            list.entities.forEach(({ sellerId: { value } }) => {
              expect(prevIds).not.toContainEqual(value);
            });
            expect(list.entities).toHaveLength(1);
            list.entities.forEach((seller) => {
              expect(seller).toBeInstanceOf(Seller);
            });
            expect(list.hasAfter).toBeFalsy();
          }));
    });

    context('if passed filter options', () => {
      beforeEach(() =>
        factory
          .createMany(
            'seller',
            [
              { firstName: 'filter1_0' },
              { middleName: 'filter1_1' },
              { lastName: 'filter1_2' },
              { phone: 'filter1_3' },
              { firstName: 'filter1_4' },
              { firstName: 'filter1_5' },
              { firstName: 'filter2_0' },
              { middleName: 'filter2_1' },
              { lastName: 'filter2_2' },
              { phone: 'filter2_3' },
              { firstName: 'filter2_4' },
            ],
            { appointmentsCount: 0 }
          )
          .then((models) => (sellers = models.map((seller) => seller.get())))
      );

      test('should return paged portion of list', () =>
        Promise.all([
          sellerRepo.getList({
            filter: {
              text: 'filter1',
            },
          }),
          sellerRepo.getList({
            filter: {
              text: 'filter2',
            },
          }),
        ]).then(([list1, list2]) => {
          expect(list1).toBeInstanceOf(Object);
          expect(list1).toHaveProperty('entities');
          expect(list1).toHaveProperty('hasAfter');
          expect(list1).toHaveProperty('hasBefore');
          expect(list1.entities).toHaveLength(6);
          list1.entities.forEach((seller) => {
            expect(seller).toBeInstanceOf(Seller);
          });
          expect(list1.hasBefore).toBeFalsy();
          expect(list1.hasAfter).toBeFalsy();

          expect(list2).toBeInstanceOf(Object);
          expect(list2).toHaveProperty('entities');
          expect(list2).toHaveProperty('hasAfter');
          expect(list2).toHaveProperty('hasBefore');
          expect(list2.entities).toHaveLength(5);
          list2.entities.forEach((seller) => {
            expect(seller).toBeInstanceOf(Seller);
          });
          expect(list1.hasBefore).toBeFalsy();
          expect(list2.hasAfter).toBeFalsy();
        }));
    });

    context('if passed unexistent curosor', () => {
      beforeEach(() =>
        factory.createMany('seller', 19, {}, { appointmentsCount: 1 })
      );

      test('should return paged list', () =>
        sellerRepo.getList({ id: 1 }).then((list) => {
          expect(list).toBeInstanceOf(Object);
          expect(list).toHaveProperty('entities');
          expect(list).toHaveProperty('hasAfter');
          expect(list).toHaveProperty('hasBefore');
          expect(list.entities).toHaveLength(10);
          list.entities.forEach((seller) => {
            expect(seller).toBeInstanceOf(Seller);
          });
          expect(list.hasBefore).toBeFalsy();
          expect(list.hasAfter).toBeTruthy();
        }));
    });
  });
});
