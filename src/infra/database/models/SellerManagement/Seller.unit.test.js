import { factory } from 'src/infra/support/test/factory';
import uuid from 'uuid/v4';
import { cleanDatabase } from 'src/infra/support/test/cleanDatabase';

import { container } from 'src/container';

const {
  subdomains: {
    SellerManagement: { Seller, Post },
  },
  commonTypes: { Day },
  mappers: { Seller: sellerMapper },
  models: {
    SellerManagement: {
      Seller: SellerModel,
      SellerAppointment: SellerAppointmentModel,
      Post: PostModel,
      PostPieceRate: PostPieceRateModel,
    },
  },
} = container;

describe('Infra :: Model :: Seller', () => {
  beforeEach(() => {
    // return cleanDatabase();
  });

  describe('#findAll', () => {
    beforeEach(() => {
      // return factory.createMany('seller', 2, [
      //   { personName: { lastName: 'Seller 1' } },
      //   { personName: { lastName: 'Seller 2' } },
      // ]);
    });

    test('returns all sellers from the database', async () => {
      // expect.assertions(3);

      // const sellers = await SellerModel.findAll();

      // expect(sellers.length).toBe(2);
      // expect(sellers[0].lastName).toBe('Seller 1');
      // expect(sellers[0].appointments).toHaveLength(1);
      // expect(sellers[0].appointments[0]).toHaveProperty('post_id');
      // expect(sellers[0].appointments[0]).toHaveProperty('day');
      // expect(sellers[1].lastName).toBe('Seller 2');
      // expect(sellers[1].appointments).toHaveLength(1);
      // expect(sellers[1].appointments[0]).toHaveProperty('post_id');
      // expect(sellers[1].appointments[0]).toHaveProperty('day');

      try {
        const post_id = uuid();
        const seller_id = uuid();

        const postPersistence = await PostModel.create(
          {
            post_id,
            name: `test post ${post_id}`,
            piece_rates: [{ value: 1, day: Date.now() }],
          },
          {
            include: [{ model: PostPieceRateModel, as: 'piece_rates' }],
          }
        );

        const sellerPersistence = await SellerModel.create(
          {
            seller_id,
            first_name: `Firstname ${seller_id}`,
            middle_name: `Middlename ${seller_id}`,
            last_name: `Lastname ${seller_id}`,
            phone: '00-00-00',
            appointments: [{ post_id, day: Date.now() }],
          },
          {
            include: [{ model: SellerAppointmentModel, as: 'appointments' }],
          }
        );

        console.log(postPersistence);
        console.log(postPersistence.piece_rates);
        console.log(sellerPersistence);
        console.log(sellerPersistence.appointments);
      } catch (e) {
        console.log(e);
      }
    });
  });

  // describe('#findById', () => {
  //   beforeEach(() => {
  //     return factory.createMany('seller', 1, [{ lastName: 'The Seller' }]);
  //   });

  //   context('when seller exists', () => {
  //     test('returns the seller', async () => {
  //       expect.assertions(2);

  //       const sellers = await SellerModel.findAll();
  //       expect(sellers.length).toBe(1);
  //       const { id } = sellers[0];

  //       const seller = await SellerModel.findById(id);
  //       expect(seller.lastName).toBe('The Seller');
  //     });
  //   });

  //   context('when the seller does not exist', () => {
  //     test('returns null', async () => {
  //       expect.assertions(1);

  //       expect(await SellerModel.findById(-1)).toBeNull();
  //     });
  //   });
  // });

  // describe('#findOne', () => {
  //   beforeEach(() => {
  //     return factory.createMany('seller', 2, [
  //       { lastName: 'Seller 1' },
  //       { lastName: 'Seller 2' },
  //     ]);
  //   });

  //   context('when seller exists', () => {
  //     test('returns the seller', async () => {
  //       expect.assertions(1);

  //       const seller = await SellerModel.findOne({
  //         where: {
  //           lastName: {
  //             [Op.like]: '% 1',
  //           },
  //         },
  //       });

  //       expect(seller.lastName).toBe('Seller 1');
  //     });
  //   });

  //   context('when the seller does not exist', () => {
  //     test('returns null', async () => {
  //       expect.assertions(1);

  //       const seller = await SellerModel.findOne({
  //         where: {
  //           lastName: {
  //             [Op.notLike]: 'Seller%',
  //           },
  //         },
  //       });

  //       expect(seller).toBeNull();
  //     });
  //   });
  // });

  // describe('#add', () => {
  //   context('when seller is valid', () => {
  //     test('persists the seller', async () => {
  //       expect.assertions(2);

  //       const countBefore = await SellerModel.count();
  //       const persistedSeller = await SellerModel.create(
  //         sellerMapper.toDatabase(seller)
  //       );

  //       expect(persistedSeller.lastName).toBe(seller.lastName);

  //       const countAfter = await SellerModel.count();
  //       expect(countAfter - countBefore).toBe(1);
  //     });
  //   });

  //   context('when seller is invalid', () => {
  //     test('does not persist the seller and rejects with an error', async () => {
  //       expect.assertions(3);

  //       const expectedErrors = [
  //         'seller.lastName cannot be null',
  //         'seller.firstName cannot be null',
  //         'seller.middleName cannot be null',
  //         'seller.state cannot be null',
  //       ];

  //       const countBefore = await SellerModel.count();

  //       try {
  //         await SellerModel.create({});
  //       } catch (error) {
  //         const { name, errors } = error;
  //         const recievedErrors = errors.map((e) => e.message);
  //         expect(name).toBe('SequelizeValidationError');
  //         expect(recievedErrors).toEqual(expectedErrors);
  //       }

  //       const countAfter = await SellerModel.count();

  //       expect(countAfter - countBefore).toBe(0);
  //     });
  //   });

  //   context('when seller is non-unique', () => {
  //     test('does not persist the seller and rejects with an error', async () => {
  //       expect.assertions(3);

  //       const countBefore = await SellerModel.count();

  //       await SellerModel.create(sellerMapper.toDatabase(seller));

  //       try {
  //         await SellerModel.create(sellerMapper.toDatabase(seller));
  //       } catch (error) {
  //         const { name, errors } = error;
  //         const recievedErrors = errors.map((e) => e.message);
  //         expect(name).toBe('SequelizeUniqueConstraintError');
  //         expect(recievedErrors).toEqual(expectedUniqueErrors);
  //       }

  //       const countAfter = await SellerModel.count();

  //       expect(countAfter - countBefore).toBe(1);
  //     });
  //   });
  // });

  // describe('#destroy', () => {
  //   beforeEach(() => {
  //     return factory.create('seller', {
  //       lastName: 'Destroyed Seller',
  //     });
  //   });

  //   test('destroys the seller', async () => {
  //     expect.assertions(1);
  //     const countBefore = await SellerModel.count();
  //     const seller = await SellerModel.findOne({
  //       where: {
  //         lastName: 'Destroyed Seller',
  //       },
  //     });

  //     await seller.destroy();

  //     const countAfter = await SellerModel.count();
  //     expect(countBefore - countAfter).toBe(1);
  //   });
  // });

  // describe('#update', () => {
  //   beforeEach(() => {
  //     return factory.createMany('seller', 2, [
  //       { lastName: 'Seller to update 1' },
  //       { lastName: 'Seller to update 2' },
  //     ]);
  //   });

  //   context('when seller is valid', () => {
  //     test('updates seller', async () => {
  //       expect.assertions(2);
  //       const seller = await SellerModel.findOne({
  //         where: {
  //           lastName: 'Seller to update 1',
  //         },
  //       });
  //       const { id } = seller;
  //       expect(seller.lastName).toBe('Seller to update 1');
  //       await seller.update({ lastName: 'New Seller' });
  //       const updatedSeller = await SellerModel.findById(id);
  //       expect(updatedSeller.lastName).toBe('New Seller');
  //     });
  //   });

  //   context('when seller is non-unique', () => {
  //     test('does not persist the seller and rejects with an error', async () => {
  //       expect.assertions(3);

  //       const { lastName, firstName, middleName } = await SellerModel.findOne({
  //         where: {
  //           lastName: 'Seller to update 1',
  //         },
  //       });

  //       const seller = await SellerModel.findOne({
  //         where: {
  //           lastName: 'Seller to update 2',
  //         },
  //       });
  //       const { id } = seller;

  //       try {
  //         await seller.update({ lastName, firstName, middleName });
  //       } catch (error) {
  //         const { name, errors } = error;
  //         const recievedErrors = errors.map((e) => e.message);
  //         expect(name).toBe('SequelizeUniqueConstraintError');
  //         expect(recievedErrors).toEqual(expectedUniqueErrors);
  //       }

  //       const updatedSeller = await SellerModel.findById(id);
  //       expect(updatedSeller.lastName).toBe('Seller to update 2');
  //     });
  //   });
  // });
});
