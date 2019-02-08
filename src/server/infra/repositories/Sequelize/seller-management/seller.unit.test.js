import uuidv4 from 'uuid/v4';
import factory from '@infra/support/test/factory';
import cleanDatabase from '@infra/support/test/clean-database';

import container from '@container';

const getRawSeller = ({
  sellerId,
  firstName,
  middleName,
  lastName,
  phone,
  flatAppointments,
}) => ({
  sellerId,
  firstName,
  middleName,
  lastName,
  phone,
  flatAppointments,
});

const {
  subdomains: {
    SellerManagement: { Seller },
  },
  commonTypes: { Day, SellerId, PostId },
  repositories: {
    SellerManagement: { Seller: sellerRepo },
  },
  models: {
    SellerManagement: {
      Seller: SellerModel,
      SellerAppointment: SellerAppointmentModel,
    },
  },
  mappers: {
    subdomains: {
      SellerManagement: { Seller: sellerMapper },
    },
  },
  database,
} = container;

const postId = new PostId({ value: uuidv4() });

const sellerProps = {
  lastName: 'Lastname',
  firstName: 'Firstname',
  middleName: 'Middlename',
  phone: '55-66-77',
};

const newSellerProps = {
  firstName: `${sellerProps.firstName}_new`,
  middleName: `${sellerProps.middleName}_new`,
  lastName: `${sellerProps.lastName}_new`,
  phone: `${sellerProps.phone}_new`,
};

const day = new Day({ value: new Date('2018.01.01') });
const newDay = new Day();

let sellerEntity;
let sellerId;
let newSellerEntity;

describe('Infra :: Repository :: Seller', () => {
  beforeEach(() => {
    sellerId = new SellerId({ value: uuidv4() });
    sellerEntity = new Seller({ ...sellerProps, sellerId });

    return cleanDatabase();
  });

  afterAll(() => {
    return database.close();
  });

  describe('#getById', () => {
    context('when there is seller in db', () => {
      beforeEach(() => {
        return factory.create('seller', sellerMapper.toDatabase(sellerEntity));
      });

      test('should return array of sellers', async () => {
        expect.assertions(2);

        const seller = await sellerRepo.getById(sellerId);

        expect(seller).toBeInstanceOf(Seller);
        expect(seller.sellerId).toEqual(sellerId);
      });
    });

    context('when there is no seller in db', () => {
      test('should throw not found error', async () => {
        expect.assertions(1);
        try {
          await sellerRepo.getById(sellerId);
        } catch ({ message }) {
          expect(message).toBe('SELLER_NOT_FOUND');
        }
      });
    });
  });

  describe('#getAll', () => {
    context('when there are sellers in db', () => {
      beforeEach(() => {
        return factory.createMany('seller', [
          { first_name: 'Seller1', state: 'deleted' },
          { first_name: 'Seller2', state: 'recruited' },
          { first_name: 'Seller3', state: 'deleted' },
          { first_name: 'Seller4', state: 'recruited' },
        ]);
      });

      test('should return array of sellers', async () => {
        expect.assertions(4);

        const sellers = await sellerRepo.getAll();

        expect(sellers).toHaveLength(2);
        expect(sellers[0]).toBeInstanceOf(Seller);
        expect(sellers[0].state).toBe('recruited');
        expect(sellers[1].state).toBe('recruited');
      });
    });

    context('when there are no sellers in db', () => {
      test('should return empty array', async () => {
        expect.assertions(1);

        const sellers = await sellerRepo.getAll();

        expect(sellers).toHaveLength(0);
      });
    });
  });

  describe('#find', () => {
    beforeEach(() => {
      return factory
        .createMany('seller', [
          { state: 'dismissed' },
          { state: 'deleted' },
          { state: 'recruited' },
          { state: 'new' },
          { state: 'dismissed' },
          { state: 'recruited' },
          { state: 'new' },
          { state: 'deleted' },
          { state: 'dismissed' },
          { state: 'recruited' },
          { state: 'deleted' },
          { state: 'recruited' },
          { state: 'dismissed' },
          { state: 'new' },
          { state: 'recruited' },
          { state: 'new' },
          { state: 'dismissed' },
          { state: 'dismissed' },
        ])
        .catch((e) => {
          console.log(e);
        });
    });
    context('when there are new sellers in db', () => {
      test('should return array of sellers', async () => {
        expect.assertions(3);

        const sellers = await sellerRepo.find({ states: ['new'] });

        expect(sellers).toHaveLength(4);
        expect(sellers[0]).toBeInstanceOf(Seller);
        expect(sellers[0].state).toBe('new');
      });
    });

    context('when there are recruited sellers in db', () => {
      test('should return array of sellers', async () => {
        expect.assertions(3);

        const sellers = await sellerRepo.find({ states: ['recruited'] });

        expect(sellers).toHaveLength(5);
        expect(sellers[0]).toBeInstanceOf(Seller);
        expect(sellers[0].state).toBe('recruited');
      });
    });

    context('when there are dismissed sellers in db', () => {
      test('should return array of sellers', async () => {
        expect.assertions(3);

        const sellers = await sellerRepo.find({ states: ['dismissed'] });

        expect(sellers).toHaveLength(6);
        expect(sellers[0]).toBeInstanceOf(Seller);
        expect(sellers[0].state).toBe('dismissed');
      });
    });

    context('when there are deleted sellers in db', () => {
      test('should return array of sellers', async () => {
        expect.assertions(3);

        const sellers = await sellerRepo.find({ states: ['deleted'] });

        expect(sellers).toHaveLength(3);
        expect(sellers[0]).toBeInstanceOf(Seller);
        expect(sellers[0].state).toBe('deleted');
      });
    });

    context('when there are new and recruited sellers in db', () => {
      test('should return array of sellers', async () => {
        expect.assertions(3);

        const sellers = await sellerRepo.find({ states: ['new', 'recruited'] });

        expect(sellers).toHaveLength(9);
        expect(sellers[0]).toBeInstanceOf(Seller);
        expect(['new', 'recruited']).toContain(sellers[0].state);
      });
    });
  });

  describe('#add', () => {
    context('when pass seller without appointments', () => {
      test('should return seller with empty appointments array', async () => {
        expect.assertions(2);

        const seller = await sellerRepo.add(sellerEntity);

        expect(seller).toBeInstanceOf(Seller);
        expect(getRawSeller(seller)).toEqual(getRawSeller(sellerEntity));
      });
    });

    context('when pass seller with appointments', () => {
      beforeEach(() => {
        sellerEntity.addAppointment(postId, day);

        expect(sellerEntity.appointments).toHaveLength(1);
      });

      test('should return seller with appointments array', async () => {
        expect.assertions(3);

        const seller = await sellerRepo.add(sellerEntity);

        expect(seller).toBeInstanceOf(Seller);
        expect(getRawSeller(seller)).toEqual(getRawSeller(sellerEntity));
      });
    });

    context('when re-add same seller', () => {
      beforeEach(() => {
        sellerEntity.addAppointment(postId, day);

        expect(sellerEntity.appointments).toHaveLength(1);
        return sellerRepo.add(sellerEntity);
      });

      test('should throw already exists error', async () => {
        expect.assertions(3);

        const countBefore = await sellerRepo.count();

        try {
          await sellerRepo.add(sellerEntity);
        } catch ({ message }) {
          expect(message).toBe('SELLER_ALREADY_EXISTS');
        }

        const countAfter = await sellerRepo.count();
        expect(countBefore).toBe(countAfter);
      });
    });

    context('when add ununique seller', () => {
      beforeEach(() => {
        return sellerRepo.add(sellerEntity);
      });

      test('should throw already exists error', async () => {
        expect.assertions(2);

        const countBefore = await sellerRepo.count();

        try {
          await sellerRepo.add(sellerEntity);
        } catch ({ message }) {
          expect(message).toBe('SELLER_ALREADY_EXISTS');
        }

        const countAfter = await sellerRepo.count();
        expect(countBefore).toBe(countAfter);
      });
    });
  });

  describe('#delete', () => {
    context('when seller exists', () => {
      beforeEach(() => {
        return factory.create('seller', sellerMapper.toDatabase(sellerEntity), {
          appointmentsCount: 0,
        });
      });

      test('should delete seller and return true', async () => {
        expect.assertions(3);

        const sellersCountBefore = await sellerRepo.count();
        const appointmentsCountBefore = await SellerAppointmentModel.count();

        const result = await sellerRepo.delete(sellerId);

        const sellersCountAfter = await sellerRepo.count();
        const appointmentsCountAfter = await SellerAppointmentModel.count();

        expect(result).toBeTruthy();
        expect(sellersCountBefore).toBe(sellersCountAfter + 1);
        expect(appointmentsCountBefore).toBe(appointmentsCountAfter);
      });
    });

    context('when seller not exists', () => {
      test('should throw not found error', async () => {
        expect.assertions(2);

        const countBefore = await sellerRepo.count();

        try {
          await sellerRepo.delete(sellerId);
        } catch ({ message }) {
          expect(message).toBe('SELLER_NOT_FOUND');
        }

        const countAfter = await sellerRepo.count();
        expect(countBefore).toBe(countAfter);
      });
    });
  });

  describe('#update', () => {
    beforeEach(() => {
      return factory.create('seller', sellerMapper.toDatabase(sellerEntity), {
        appointmentsCount: 0,
      });
    });

    context('when seller with update props exists', () => {
      beforeEach(() => {
        newSellerEntity = new Seller({ ...newSellerProps, sellerId });
      });

      context("when updated seller's props are unique", () => {
        test('should return updated seller', async () => {
          expect.assertions(1);

          const seller = await sellerRepo.update(newSellerEntity);

          expect(getRawSeller(seller)).toEqual(getRawSeller(newSellerEntity));
        });
      });

      context("when updated seller's props are non-unique", () => {
        beforeEach(() => {
          return factory.create(
            'seller',
            sellerMapper.toDatabase(new Seller(newSellerProps))
          );
        });

        test('should throw already exists error', async () => {
          expect.assertions(2);

          try {
            await sellerRepo.update(newSellerEntity);
          } catch ({ message }) {
            expect(message).toBe('SELLER_ALREADY_EXISTS');
          }

          expect(getRawSeller(await sellerRepo.getById(sellerId))).toEqual(
            getRawSeller(sellerEntity)
          );
        });
      });
    });

    context('when updated seller not exists', () => {
      beforeEach(() => {
        newSellerEntity = new Seller(newSellerProps);
      });

      test('should throw not found error', async () => {
        expect.assertions(1);

        try {
          await sellerRepo.update(newSellerEntity);
        } catch ({ message }) {
          expect(message).toBe('SELLER_NOT_FOUND');
        }
      });
    });
  });

  describe('#addAppointment', () => {
    let appointmentsCountBefore;

    beforeEach(() => {
      return factory
        .create('seller', sellerMapper.toDatabase(sellerEntity), {
          appointmentsCount: 0,
        })
        .then((seller) => {
          sellerEntity.addAppointment(postId, day);
          appointmentsCountBefore = seller.appointments.length;
        });
    });

    test('should return true', async () => {
      expect.assertions(2);

      const result = await sellerRepo.addAppointment(sellerId, postId, day);
      const appointmentsCountAfter = await SellerAppointmentModel.count();

      expect(result).toBeTruthy();
      expect(appointmentsCountAfter).toBe(appointmentsCountBefore + 1);
    });
  });

  describe('#deleteAppointmentAt', () => {
    let appointmentsCountBefore;

    beforeEach(() => {
      sellerEntity.addAppointment(postId, day);

      return factory
        .create('seller', sellerMapper.toDatabase(sellerEntity))
        .then((seller) => {
          appointmentsCountBefore = seller.appointments.length;
        });
    });

    test('should return true', async () => {
      expect.assertions(2);

      const result = await sellerRepo.deleteAppointmentAt(sellerId, day);
      const appointmentsCountAfter = await SellerAppointmentModel.count();

      expect(result).toBeTruthy();
      expect(appointmentsCountAfter).toBe(appointmentsCountBefore - 1);
    });
  });

  describe('#updateAppointmentTo', () => {
    let appointmentsCountBefore;
    let newPostId;

    beforeEach(() => {
      sellerEntity.addAppointment(postId, day);
      newPostId = new PostId();

      return factory
        .create('seller', sellerMapper.toDatabase(sellerEntity))
        .then((seller) => {
          appointmentsCountBefore = seller.appointments.length;
        });
    });

    test('should return true', async () => {
      expect.assertions(3);

      const result = await sellerRepo.updateAppointmentTo(
        sellerId,
        day,
        newPostId,
        newDay
      );
      const appointmentsCountAfter = await SellerAppointmentModel.count();

      expect(result).toBeTruthy();
      expect(appointmentsCountAfter).toBe(appointmentsCountBefore);
      expect(
        await SellerAppointmentModel.count({
          where: {
            seller_id: sellerId.value,
            post_id: newPostId.value,
            day: newDay.value,
          },
        })
      ).toBe(1);
    });
  });
});
