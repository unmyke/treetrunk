import { factory } from 'src/infra/support/test/factory';
import { Op } from 'sequelize';
import { cleanDatabase } from 'src/infra/support/test/cleanDatabase';

import { container } from 'src/container';
const {
  entities: { Seller, Post },
  commonTypes: { Day },
  // mappers: { Seller: sellerMapper },
  models: { Seller: SellerModel, Post: PostModel },
} = container;

const postProps = {
  name: 'Флорист',
};
const post = new Post(postProps);
const pieceRateDate = new Date();
post.addPieceRate(5, new Day(pieceRateDate));

const personName = {
  lastName: 'Lastname',
  firstName: 'Firstname',
  middleName: 'Middlename',
};
const phone = '55-66-77';
const sellerProps = {
  ...personName,
  phone,
};
const seller = new Seller(sellerProps);
const appointmentDate = new Date();
seller.addAppointment(post.postId, new Day(appointmentDate));

const expectedUniqueErrors = ['sallerId must be unique'];

describe('Infra :: Model :: Seller', () => {
  beforeEach(() => {
    return cleanDatabase();
  });

  describe('#findAll', () => {
    beforeEach(() => {
      return factory.createMany('seller', 2, [
        { personName: { lastName: 'Seller 1' } },
        { personName: { lastName: 'Seller 2' } },
      ]);
    });

    it('returns all sellers from the database', async () => {
      expect.assertions(3);

      const sellers = await SellerModel.findAll();

      expect(sellers.length).toBe(2);
      expect(sellers[0].lastName).toBe('Seller 1');
      expect(sellers[0].appointments).toHaveLength(1);
      expect(sellers[0].appointments[0]).toHaveProperty('postId');
      expect(sellers[0].appointments[0]).toHaveProperty('day');
      expect(sellers[1].lastName).toBe('Seller 2');
      expect(sellers[1].appointments).toHaveLength(1);
      expect(sellers[1].appointments[0]).toHaveProperty('postId');
      expect(sellers[1].appointments[0]).toHaveProperty('day');
    });
  });

  // describe('#findById', () => {
  //   beforeEach(() => {
  //     return factory.createMany('seller', 1, [{ lastName: 'The Seller' }]);
  //   });

  //   context('when seller exists', () => {
  //     it('returns the seller', async () => {
  //       expect.assertions(2);

  //       const sellers = await SellerModel.findAll();
  //       expect(sellers.length).toBe(1);
  //       const { id } = sellers[0];

  //       const seller = await SellerModel.findById(id);
  //       expect(seller.lastName).toBe('The Seller');
  //     });
  //   });

  //   context('when the seller does not exist', () => {
  //     it('returns null', async () => {
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
  //     it('returns the seller', async () => {
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
  //     it('returns null', async () => {
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
  //     it('persists the seller', async () => {
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
  //     it('does not persist the seller and rejects with an error', async () => {
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
  //     it('does not persist the seller and rejects with an error', async () => {
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

  //   it('destroys the seller', async () => {
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
  //     it('updates seller', async () => {
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
  //     it('does not persist the seller and rejects with an error', async () => {
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
