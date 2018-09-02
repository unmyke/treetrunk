import { Op } from 'sequelize';
import { factory } from 'src/infra/support/test/factory';
import { cleanDatabase } from 'src/infra/support/test/cleanDatabase';

import { container } from 'src/container';

const {
  subdomains: {
    SellerManagement: { Seller, Post },
  },
  commonTypes: { Day },
  mappers: {
    subdomains: {
      SellerManagement: { Seller: sellerMapper },
    },
  },
  models: {
    SellerManagement: { Seller: SellerModel },
  },
  database,
} = container;

const postProps = {
  name: 'Флорист',
};
const post = new Post(postProps);
const pieceRateDate = new Date();
post.addPieceRate(5, new Day({ value: pieceRateDate }));

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
const appointmentDay = new Day();

seller.addAppointment(post.postId, new Day(appointmentDay));

const expectedUniqueErrors = ["seller's person name and phone must be unique"];

describe('Infra :: Model :: Seller', () => {
  beforeEach(() => {
    return cleanDatabase();
  });

  afterAll(() => {
    return database.close();
  });

  describe('#findAll', () => {
    beforeEach(() => {
      return factory.createMany(
        'seller',
        [{ last_name: 'Seller 1' }, { last_name: 'Seller 2' }],
        { appointmentsCount: 1 }
      );
    });

    test('returns all sellers from the database', async () => {
      expect.assertions(7);
      const sellers = await SellerModel.scope('appointments').findAll();

      expect(sellers.length).toBe(2);

      const seller1 = sellers.find(({ last_name }) => last_name === 'Seller 1');
      const seller2 = sellers.find(({ last_name }) => last_name === 'Seller 2');

      expect(seller1.appointments).toHaveLength(1);
      expect(seller1.appointments[0]).toHaveProperty('post_id');
      expect(seller1.appointments[0]).toHaveProperty('day');

      expect(seller2.appointments).toHaveLength(1);
      expect(seller2.appointments[0]).toHaveProperty('post_id');
      expect(seller2.appointments[0]).toHaveProperty('day');
    });
  });

  describe('#findById', () => {
    beforeEach(() => {
      return factory.create('seller', { last_name: 'The Seller' });
    });

    context('when seller exists', () => {
      test('returns the seller', async () => {
        expect.assertions(2);

        const sellers = await SellerModel.findAll();
        expect(sellers.length).toBe(1);
        const { seller_id } = sellers[0];

        const seller = await SellerModel.findById(seller_id);
        expect(seller.last_name).toBe('The Seller');
      });
    });

    context('when the seller does not exist', () => {
      test('returns null', async () => {
        expect.assertions(1);

        expect(await SellerModel.findById(-1)).toBeNull();
      });
    });
  });

  describe('#findOne', () => {
    beforeEach(() => {
      return factory
        .createMany('seller', [
          { last_name: 'Seller 1' },
          { last_name: 'Seller 2' },
        ])
        .catch((e) => {
          console.log(e);
        });
    });

    context('when seller exists', () => {
      test('returns the seller', async () => {
        expect.assertions(1);

        const seller = await SellerModel.findOne({
          where: {
            last_name: {
              [Op.like]: '% 1',
            },
          },
        });

        expect(seller.last_name).toBe('Seller 1');
      });
    });

    context('when the seller does not exist', () => {
      test('returns null', async () => {
        expect.assertions(1);

        const seller = await SellerModel.findOne({
          where: {
            last_name: {
              [Op.notLike]: 'Seller%',
            },
          },
        });

        expect(seller).toBeNull();
      });
    });
  });

  describe('#add', () => {
    context('when seller is valid', () => {
      test('persists the seller', async () => {
        expect.assertions(2);

        const countBefore = await SellerModel.count();
        const persistedSeller = await SellerModel.create(
          sellerMapper.toDatabase(seller)
        );

        expect(persistedSeller.last_name).toBe(seller.lastName);

        const countAfter = await SellerModel.count();
        expect(countAfter - countBefore).toBe(1);
      });
    });

    context('when seller is invalid', () => {
      test('does not persist the seller and rejects with an error', async () => {
        expect.assertions(3);

        const expectedErrors = [
          'seller.first_name cannot be null',
          'seller.middle_name cannot be null',
          'seller.last_name cannot be null',
          'seller.phone cannot be null',
          'seller.state cannot be null',
        ];

        const countBefore = await SellerModel.count();

        try {
          await SellerModel.create({});
        } catch (error) {
          const { name, errors } = error;
          const recievedErrors = errors.map((e) => e.message);
          expect(name).toBe('SequelizeValidationError');
          expect(recievedErrors).toEqual(expectedErrors);
        }

        const countAfter = await SellerModel.count();

        expect(countAfter - countBefore).toBe(0);
      });
    });

    context('when seller is non-unique', () => {
      test('does not persist the seller and rejects with an error', async () => {
        expect.assertions(3);

        const countBefore = await SellerModel.count();

        await SellerModel.create(sellerMapper.toDatabase(seller));

        try {
          const sameSeler = new Seller(sellerProps);
          await SellerModel.create(sellerMapper.toDatabase(sameSeler));
        } catch (error) {
          const { name, errors } = error;
          const recievedErrors = errors.map((e) => e.message);
          expect(name).toBe('SequelizeUniqueConstraintError');
          expect(recievedErrors).toEqual(expectedUniqueErrors);
        }

        const countAfter = await SellerModel.count();

        expect(countAfter - countBefore).toBe(1);
      });
    });
  });

  describe('#destroy', () => {
    beforeEach(() => {
      return factory.create('seller', {
        last_name: 'Destroyed Seller',
      });
    });

    test('destroys the seller', async () => {
      expect.assertions(1);
      const countBefore = await SellerModel.count();
      const seller = await SellerModel.findOne({
        where: {
          last_name: 'Destroyed Seller',
        },
      });

      await seller.destroy();

      const countAfter = await SellerModel.count();
      expect(countBefore - countAfter).toBe(1);
    });
  });

  describe('#update', () => {
    beforeEach(() => {
      return factory.createMany('seller', [
        { last_name: 'Seller to update 1' },
        { last_name: 'Seller to update 2' },
      ]);
    });

    context('when seller is valid', () => {
      test('updates seller', async () => {
        expect.assertions(2);
        const seller = await SellerModel.findOne({
          where: {
            last_name: 'Seller to update 1',
          },
        });
        const { seller_id } = seller;
        expect(seller.last_name).toBe('Seller to update 1');
        await seller.update({ last_name: 'New Seller' });
        const updatedSeller = await SellerModel.findById(seller_id);
        expect(updatedSeller.last_name).toBe('New Seller');
      });
    });

    context('when seller is non-unique', () => {
      test('does not persist the seller and rejects with an error', async () => {
        expect.assertions(3);

        const {
          last_name,
          first_name,
          middle_name,
          phone,
        } = await SellerModel.findOne({
          where: {
            last_name: 'Seller to update 1',
          },
        });

        const seller = await SellerModel.findOne({
          where: {
            last_name: 'Seller to update 2',
          },
        });
        const { seller_id } = seller;

        try {
          await seller.update({ last_name, first_name, middle_name, phone });
        } catch (error) {
          const { name, errors } = error;
          const recievedErrors = errors.map((e) => e.message);
          expect(name).toBe('SequelizeUniqueConstraintError');
          expect(recievedErrors).toEqual(expectedUniqueErrors);
        }

        const updatedSeller = await SellerModel.findById(seller_id);
        expect(updatedSeller.last_name).toBe('Seller to update 2');
      });
    });
  });
});
