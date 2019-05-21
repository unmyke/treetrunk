import { omit } from 'lodash';

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
            sellerModel = s;
          })
        );
        operationName = queries.GET_SELLER_BY_ID;

        context('if pass ID', () => {
          test(`should return seller with corresponding id`, () =>
            query({
              query: operationName,
              variables: { id: sellerModel.get('sellerId') },
            }).then(({ data, errors }) => {
              expect(errors).toBeUndefined();
              expect(data).toHaveProperty('seller');
              const { seller } = data;
              expect(seller).toEqual(mappers.Seller(seller));
            }));
        });
      });
    });
  });
});
