import container from '@container';
import { CRUDS } from '@common';

import getOperationNameGetter from './get-operation-name-getter';
import * as queries from './queries';

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
      let seller;

      describe(`#seller`, () => {
        beforeEach(() =>
          factory.create('seller').then((s) => {
            console.log(s.get());
            seller = s.get();
          })
        );
        operationName = queries.GET_SELLER_BY_ID;

        context('if pass ID', () => {
          test(`should return seller with corresponding id`, () =>
            query({
              query: operationName,
              variables: { id: seller.sellerId },
            }).then(({ data, errors }) => {
              expect(errors).toBeUndefined();
              expect(data).toHaveProperty('seller');
              expect(data.seller).toHaveProperty('post');
            }));
        });
      });
    });
  });
});
