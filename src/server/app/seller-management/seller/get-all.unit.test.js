import factory from '@infra/support/test/factory';
import cleanDatabase from '@infra/support/test/clean-database';

import container from '@container';

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

        expect(mockOnSuccess.mock.calls).toHaveLength(1);
        expect(mockOnSuccess.mock.calls[0][0].sellers).toHaveLength(0);
        expect(mockOnError.mock.calls).toHaveLength(0);
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
            },
            {
              first_name: 'first_name1',
              middle_name: 'middle_name2',
              last_name: 'last_name1',
              phone: 'phone2',
              state: 'recruited',
            },
            {
              first_name: 'first_name2',
              middle_name: 'middle_name2',
              last_name: 'last_name1',
              phone: 'phone3',
              state: 'new',
            },
            {
              first_name: 'first_name3',
              middle_name: 'middle_name2',
              last_name: 'last_name2',
              phone: 'phone4',
              state: 'new',
            },
            {
              first_name: 'first_name3',
              middle_name: 'middle_name3',
              last_name: 'last_name2',
              phone: 'phone4',
              state: 'dismissed',
            },
            {
              first_name: 'first_name3',
              middle_name: 'middle_name4',
              last_name: 'last_name2',
              phone: 'phone4',
              state: 'dismissed',
            },
            {
              first_name: 'first_name4',
              middle_name: 'middle_name4',
              last_name: 'last_name3',
              phone: 'phone4',
              state: 'deleted',
            },
            {
              first_name: 'first_name4',
              middle_name: 'middle_name2',
              last_name: 'last_name3',
              phone: 'phone4',
              state: 'deleted',
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
          // console.log(sellers);
          // console.log(posts);

          expect(mockOnSuccess.mock.calls).toHaveLength(1);
          expect(sellers).toHaveLength(8);
          expect(posts).toHaveLength(8 * 3);
          expect(mockOnError.mock.calls).toHaveLength(0);
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

          expect(mockOnSuccess.mock.calls).toHaveLength(1);
          expect(sellers).toHaveLength(4);
          expect(posts).toHaveLength(4 * 3);
          expect(mockOnError.mock.calls).toHaveLength(0);
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

          expect(mockOnSuccess.mock.calls).toHaveLength(1);
          expect(sellers).toHaveLength(6);
          expect(posts).toHaveLength(6 * 3);
          expect(mockOnError.mock.calls).toHaveLength(0);
        });
      });
    });
  });
});
