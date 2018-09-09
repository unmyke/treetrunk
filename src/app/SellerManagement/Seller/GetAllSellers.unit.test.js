import uuidv4 from 'uuid/v4';
import { factory } from 'src/infra/support/test/factory';
import { cleanDatabase } from 'src/infra/support/test/cleanDatabase';

import { container } from 'src/container';

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
  services: {
    SellerManagement: {
      Seller: { getAllSellers: GetAllSellers },
    },
  },
  commonTypes: { Day },
  database,
} = container;

let getAllSellers;

// const postId = new PostId({ value: uuidv4() });

// const sellerProps = {
//   lastName: 'Lastname',
//   firstName: 'Firstname',
//   middleName: 'Middlename',
//   phone: '55-66-77',
// };

// const newSellerProps = {
//   firstName: `${sellerProps.firstName}_new`,
//   middleName: `${sellerProps.middleName}_new`,
//   lastName: `${sellerProps.lastName}_new`,
//   phone: `${sellerProps.phone}_new`,
// };

// const day = new Day({ value: new Date('2018.01.01') });
// const newDay = new Day();

// let sellerEntity;
// let sellerId;
// let newSellerEntity;

describe('App :: SellerManagement :: Seller :: GetAllSellers', () => {
  beforeEach(() => {
    // sellerId = new SellerId({ value: uuidv4() });
    // sellerEntity = new Seller({ ...sellerProps, sellerId });
    getAllSellers = GetAllSellers();
    return cleanDatabase();
  });

  afterAll(() => {
    return database.close();
  });

  describe('#execute', () => {
    context('when there is no sellers in database', () => {
      test('should return empty array', async () => {
        expect.assertions(2);

        const mock = jest.fn();

        getAllSellers.on('SUCCESS', mock);
        getAllSellers.on('ERROR', (e) => {
          console.log(e);
        });

        await getAllSellers.execute();

        expect(mock.mock.calls.length).toBe(1);
        expect(mock.mock.calls[0][0].sellers.length).toBe(0);
      });
    });

    context('when there is sellers in database', () => {
      beforeEach(() => {
        return factory
          .createMany('seller', [
            {
              first_name: 'first_name1',
              middle_name: 'middle_name1',
              last_name: 'last_name1',
              phone: 'phone1',
              state: 'recruited',
              appointments: [{ day: new Day().subMonths(1).value }],
            },
            {
              first_name: 'first_name1',
              middle_name: 'middle_name2',
              last_name: 'last_name1',
              phone: 'phone2',
              state: 'recruited',
              appointments: [{ day: new Day().subMonths(2).value }],
            },
            {
              first_name: 'first_name2',
              middle_name: 'middle_name2',
              last_name: 'last_name1',
              phone: 'phone3',
              state: 'new',
              appointments: [],
            },
            {
              first_name: 'first_name3',
              middle_name: 'middle_name2',
              last_name: 'last_name2',
              phone: 'phone4',
              state: 'new',
              appointments: [],
            },
            {
              first_name: 'first_name3',
              middle_name: 'middle_name3',
              last_name: 'last_name2',
              phone: 'phone4',
              state: 'dismissed',
              appointments: [],
            },
            {
              first_name: 'first_name3',
              middle_name: 'middle_name4',
              last_name: 'last_name2',
              phone: 'phone4',
              state: 'dismissed',
              appointments: [],
            },
            {
              first_name: 'first_name4',
              middle_name: 'middle_name4',
              last_name: 'last_name3',
              phone: 'phone4',
              state: 'deleted',
              appointments: [],
            },
            {
              first_name: 'first_name4',
              middle_name: 'middle_name2',
              last_name: 'last_name3',
              phone: 'phone4',
              state: 'deleted',
              appointments: [],
            },
          ])
          .catch((e) => {
            console.log(e);
          });
      });
      context('when there is no query', () => {
        test('should return array of undeleted sellers', async () => {
          expect.assertions(1);

          getAllSellers.on('SUCCESS', ({ sellers, posts, seniorityTypes }) => {
            expect(sellers).toHaveLength(6);
          });

          // getAllSellers.on('ERROR', (e) => {
          //   console.log(e);
          // });

          await getAllSellers.execute();
        });
      });
      context('when query contains first name', () => {});
      context('when query contains middle name', () => {});
      context('when query contains last name', () => {});
      context('when query contains phone', () => {});
      context('when query contains state', () => {});
    });
  });
});
