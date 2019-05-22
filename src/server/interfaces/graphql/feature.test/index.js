import { startOfDay } from 'date-fns';

import container from '@container';
import { CRUDS } from '@common';

import getOperationNameGetter from './get-operation-name-getter';
import * as queries from './queries';
import mappers from './mappers';

const {
  tests: {
    infra: {
      factory,
      cleanUp: { onStartTest, onAfterEach, onStopTest },
    },
    interfaces: {
      apolloClient: { query, mutations },
    },
    states,
  },
} = container;

let getOperationName;

describe(`graphQl endpoint`, () => {
  beforeAll(onStartTest);
  afterEach(onAfterEach);
  afterAll(onStopTest);

  describe(`:: Queries`, () => {
    describe(`:: Seller`, () => {
      getOperationName = getOperationNameGetter('Seller');
      let operationName;
      let sellerModel;

      describe(`#seller`, () => {
        beforeEach(() =>
          factory.create('seller').then((s) => {
            sellerModel = s.get();
          })
        );
        operationName = queries.GET_SELLER_BY_ID;

        context('if pass existent ID', () => {
          test(`should return seller with corresponding id`, () =>
            query({
              query: operationName,
              variables: { id: sellerModel.sellerId },
            }).then(({ data, errors }) => {
              expect(errors).toBeUndefined();
              expect(data).toHaveProperty('seller');
              const { seller } = data;
              expect(seller.id).toEqual(sellerModel.sellerId);
              expect(seller.firstName).toBe(sellerModel.firstName);
              expect(seller.middleName).toBe(sellerModel.middleName);
              expect(seller.lastName).toBe(sellerModel.lastName);
              expect(seller.appointments).toHaveLength(
                sellerModel.appointments.length
              );
              expect(seller.appointments[0].postId).toBe(
                sellerModel.appointments[0].postId
              );
              expect(seller.appointments[0].day).toBe(
                startOfDay(sellerModel.appointments[0].day).getTime()
              );
              expect(seller.postId).toBe(sellerModel.appointments[0].postId);
              expect(seller.postIds).toHaveLength(
                sellerModel.appointments.length
              );
            }));
        });
        context('if pass unexistent ID', () => {
          test(`should return seller with corresponding id`, () =>
            query({
              query: operationName,
              variables: { id: sellerModel.sellerId },
            }).then(({ data, errors }) => {
              expect(errors).toBeUndefined();
              expect(data).toHaveProperty('seller');
              const { seller } = data;
              expect(seller.id).toEqual(sellerModel.sellerId);
              expect(seller.firstName).toBe(sellerModel.firstName);
              expect(seller.middleName).toBe(sellerModel.middleName);
              expect(seller.lastName).toBe(sellerModel.lastName);
              expect(seller.appointments).toHaveLength(
                sellerModel.appointments.length
              );
              expect(seller.appointments[0].postId).toBe(
                sellerModel.appointments[0].postId
              );
              expect(seller.appointments[0].day).toBe(
                startOfDay(sellerModel.appointments[0].day).getTime()
              );
              expect(seller.postId).toBe(sellerModel.appointments[0].postId);
              expect(seller.postIds).toHaveLength(
                sellerModel.appointments.length
              );
            }));
        });
      });
    });
  });
});
