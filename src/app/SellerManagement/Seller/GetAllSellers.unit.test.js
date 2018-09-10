import { factory } from 'src/infra/support/test/factory';
import { cleanDatabase } from 'src/infra/support/test/cleanDatabase';

import { container } from 'src/container';

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

describe('App :: SellerManagement :: Seller :: GetAllSellers', () => {
  beforeEach(() => {
    getAllSellers = GetAllSellers();
    return cleanDatabase();
  });

  afterAll(() => {
    return database.close();
  });

  describe('#execute', () => {
    context('when there is no sellers in database', () => {
      test('should return empty array', async () => {
        expect.assertions(3);

        const mockOnSuccess = jest.fn();
        const mockOnError = jest.fn();

        getAllSellers.on('SUCCESS', mockOnSuccess);
        getAllSellers.on('ERROR', mockOnError);

        await getAllSellers.execute();

        expect(mockOnSuccess.mock.calls.length).toBe(1);
        expect(mockOnSuccess.mock.calls[0][0].sellers.length).toBe(0);
        expect(mockOnError.mock.calls.length).toBe(0);
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
        test('should return array of sellers', async () => {
          expect.assertions(4);
          const mockOnSuccess = jest.fn();
          const mockOnError = jest.fn();

          getAllSellers.on('SUCCESS', mockOnSuccess);
          getAllSellers.on('ERROR', mockOnError);

          await getAllSellers.execute();

          const { sellers, posts } = mockOnSuccess.mock.calls[0][0];

          expect(mockOnSuccess.mock.calls.length).toBe(1);
          expect(sellers.length).toBe(8);
          expect(posts.length).toBe(8);
          expect(mockOnError.mock.calls.length).toBe(0);
        });
      });
      context('when query contains search attribute', () => {
        test('should return array of sellers', async () => {
          expect.assertions(4);
          const mockOnSuccess = jest.fn();
          const mockOnError = jest.fn();
          const query = {
            search: 'middle_name2',
          };

          getAllSellers.on('SUCCESS', mockOnSuccess);
          getAllSellers.on('ERROR', mockOnError);

          await getAllSellers.execute(query);

          const { sellers, posts } = mockOnSuccess.mock.calls[0][0];

          expect(mockOnSuccess.mock.calls.length).toBe(1);
          expect(sellers.length).toBe(4);
          expect(posts.length).toBe(4);
          expect(mockOnError.mock.calls.length).toBe(0);
        });
      });
      context('when query contains state', () => {
        test('should return array of sellers', async () => {
          expect.assertions(4);
          const mockOnSuccess = jest.fn();
          const mockOnError = jest.fn();
          const query = {
            states: ['new', 'dismissed', 'deleted'],
          };

          getAllSellers.on('SUCCESS', mockOnSuccess);
          getAllSellers.on('ERROR', mockOnError);

          await getAllSellers.execute(query);

          const { sellers, posts } = mockOnSuccess.mock.calls[0][0];

          expect(mockOnSuccess.mock.calls.length).toBe(1);
          expect(sellers.length).toBe(6);
          expect(posts.length).toBe(6);
          expect(mockOnError.mock.calls.length).toBe(0);
        });
      });
    });
  });
});
