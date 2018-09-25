import { subMonths, startOfDay } from 'date-fns';
import { merge } from 'lodash';
import { inspect } from 'util';
// import { Serializer as JSONAPISerializer } from 'jsonapi-serializer';

import { SellerSerializer as Serializer } from './SellerSerializer';
import {
  Seller,
  Post,
  SeniorityType,
} from 'src/domain/subdomains/SellerManagement';
import { SellerId, Day, PostId } from 'src/domain/commonTypes';
import { Seller as states } from 'src/domain/states';

const rootUri = 'http://test:testport/seller_management';
const today = startOfDay(new Date());
const date1 = subMonths(today, 4);
const date2 = subMonths(today, 3);
const dismissDate = subMonths(today, 2);
const date3 = subMonths(today, 1);
const day1 = new Day({ value: date1 });
const day2 = new Day({ value: date2 });
const dismissDay = new Day({
  value: dismissDate,
});
const day3 = new Day({ value: date3 });

const dismissPostId = new PostId();
PostId.dismissPostId = dismissPostId;
const postId1 = new PostId();
const postId2 = new PostId();
const postId3 = new PostId();

const post1 = Post.restore({
  postId: postId1,
  name: 'post1',
  state: 'active',
  pieceRates: [{ value: 1, day: day1 }, { value: 2, day: day2 }],
});
const post2 = Post.restore({
  postId: postId2,
  name: 'post2',
  state: 'active',
  pieceRates: [
    { value: 1, day: day1 },
    { value: 2, day: day2 },
    { value: 3, day: day3 },
  ],
});

const post3 = Post.restore({
  postId: postId3,
  name: 'post3',
  state: 'active',
  pieceRates: [],
});
const posts = [post1, post2, post3];

const seniorityTypes = [0, 1, 2, 3, 4, 5, 6].map(
  (num) => new SeniorityType({ name: `seniorityTypeName${num}`, months: num })
);

const appointment1 = { postId: postId1, day: day1 };
const appointment2 = { postId: postId2, day: day2 };
const dismissAppointment = { postId: dismissPostId, day: dismissDay };
const appointment3 = { postId: postId3, day: day3 };

const newAppointments = [];
const recruitedAppointments1 = [appointment1, appointment2];
const dismissAppointments = [appointment1, appointment2, dismissAppointment];
const recruitedAppointments2 = [
  appointment1,
  appointment2,
  dismissAppointment,
  appointment3,
];

const sellerId = new SellerId();
const firstName = 'Firstname';
const middleName = 'Middlename';
const lastName = 'Lastname';
const phone = '00-00-00';

const commonRestoreSellerProps = {
  sellerId,
  firstName,
  middleName,
  lastName,
  phone,
};

const newSellerRestoreProps = {
  ...commonRestoreSellerProps,
  state: states.NEW,
  appointments: newAppointments,
};
const recruitedSellerRestoreProps1 = {
  ...commonRestoreSellerProps,
  state: states.RECRUITED,
  appointments: recruitedAppointments1,
};
const dismissSellerRestoreProps = {
  ...commonRestoreSellerProps,
  state: states.DISMISSED,
  appointments: dismissAppointments,
};
const recruitedSellerRestoreProps2 = {
  ...commonRestoreSellerProps,
  state: states.RECRUITED,
  appointments: recruitedAppointments2,
};

const commonSerializedSeller = {
  data: {
    id: commonRestoreSellerProps.sellerId.value,
    type: 'sellers',
    links: {
      self: `${rootUri}/sellers/${commonRestoreSellerProps.sellerId.value}`,
    },
    attributes: {
      id: commonRestoreSellerProps.sellerId.value,
      first_name: commonRestoreSellerProps.firstName,
      middle_name: commonRestoreSellerProps.middleName,
      last_name: commonRestoreSellerProps.lastName,
      phone,
    },
  },
};
const newSerializedSeller = merge({}, commonSerializedSeller, {
  data: {
    attributes: {
      id: newSellerRestoreProps.sellerId.value,
      state: newSellerRestoreProps.state,
      recruit_day: null,
      dismiss_day: null,
      seniority: null,
      appointments: [],
    },
    relationships: {
      post: { data: null },
      seniority_type: { data: null },
    },
  },
});
const recruitedSerializedSeller1 = merge({}, commonSerializedSeller, {
  data: {
    attributes: {
      state: recruitedSellerRestoreProps1.state,
      recruit_day: date1,
      dismiss_day: null,
      seniority: 4,
      appointments: [
        {
          // post: postId1.value,
          day: date1,
        },
        {
          // post: postId2.value,
          day: date2,
        },
      ],
    },
    relationships: {
      post: {
        data: {
          type: 'posts',
          id: postId2.value,
        },
      },
      seniority_type: {
        data: {
          type: 'seniority_types',
          id: seniorityTypes[0].seniorityTypeId.value,
        },
      },
    },
  },
  included: [
    {
      type: 'seniority_types',
      id: seniorityTypes[0].seniorityTypeId.value,
      attributes: {
        id: seniorityTypes[0].seniorityTypeId.value,
        name: seniorityTypes[0].name,
        state: seniorityTypes[0].state,
        award: null,
        awards: [],
      },
    },
    {
      type: 'posts',
      id: postId2.value,
      attributes: {
        id: postId2.value,
        name: post2.name,
        state: post2.state,
        piece_rate: post2.pieceRates[2].value,
        piece_rates: post2.pieceRates.map(({ value, day: { value: day } }) => ({
          value,
          day,
        })),
      },
      relationships: {},
    },
    {
      type: 'posts',
      id: postId1.value,
      attributes: {
        id: postId1.value,
        name: post1.name,
        state: post1.state,
        piece_rate: post1.pieceRates[1].value,
        piece_rates: post1.pieceRates.map(({ value, day: { value: day } }) => ({
          value,
          day,
        })),
      },
    },
  ],
});
const dismissSerializedSeller = merge({}, commonSerializedSeller, {
  data: {
    attributes: {
      id: dismissSellerRestoreProps.sellerId.value,
      state: dismissSellerRestoreProps.state,
      post: null,
      recruit_day: null,
      dismiss_day: dismissDate,
      seniority: null,
      appointments: [],
    },
  },
});
const recruitedSerializedSeller2 = merge({}, commonSerializedSeller, {
  data: {
    attributes: {
      id: recruitedSellerRestoreProps2.sellerId.value,
      state: recruitedSellerRestoreProps2.state,
      post: postId3.value,
      recruit_day: date3,
      dismiss_day: null,
      seniority: 1,
      appointments: [{ post: postId3.value, day: date3 }],
    },
  },
});
const serializer = new Serializer();

describe('interfaces :: serializers :: SellerManagement :: Seller :: # serialize', () => {
  let seller, sellerRestoreProps, serializedSeller;

  beforeEach(() => {
    seller = undefined;
    sellerRestoreProps = undefined;
    serializedSeller = undefined;
  });

  context('when passed new seller', () => {
    beforeEach(() => {
      sellerRestoreProps = newSellerRestoreProps;

      seller = Seller.restore(sellerRestoreProps);
      serializedSeller = newSerializedSeller;
    });

    test('should return seller DTO', () => {
      expect(
        serializer.serialize({
          data: seller,
          included: { posts, seniorityTypes },
        })
      ).toEqual(serializedSeller);
    });
  });

  context('when passed recruited once seller', () => {
    beforeEach(() => {
      sellerRestoreProps = recruitedSellerRestoreProps1;

      seller = Seller.restore(sellerRestoreProps);
      serializedSeller = recruitedSerializedSeller1;
    });

    test('should return seller DTO', () => {
      // console.log(
      //   inspect(
      //     serializer.serialize({
      //       data: seller,
      //       included: { posts, seniorityTypes },
      //     }),
      //     { showHidden: false, depth: null }
      //   )
      // );
      // console.log(
      //   inspect(recruitedSerializedSeller1, { showHidden: false, depth: null })
      // );
      const sellerNew = serializer.serialize({
        data: seller,
        included: { posts, seniorityTypes },
      });
      // expect(sellerNew.id).toEqual(serializedSeller.id);
      // expect(sellerNew.type).toEqual(serializedSeller.type);
      expect(sellerNew.data).toEqual(serializedSeller.data);
      expect(sellerNew.included).toEqual(serializedSeller.included);
    });
  });

  context('when passed dismissed seller', () => {
    beforeEach(() => {
      sellerRestoreProps = dismissSellerRestoreProps;

      seller = Seller.restore(sellerRestoreProps);
      serializedSeller = dismissSerializedSeller;
    });

    test('should return seller DTO', () => {
      expect(
        serializer.serialize({
          data: seller,
          included: { posts, seniorityTypes },
        })
      ).toEqual(serializedSeller);
    });
  });

  context('when passed recruited again seller', () => {
    beforeEach(() => {
      sellerRestoreProps = recruitedSellerRestoreProps2;

      seller = Seller.restore(sellerRestoreProps);
      serializedSeller = recruitedSerializedSeller2;
    });

    test('should return seller DTO', () => {
      expect(
        serializer.serialize({
          data: seller,
          included: { posts, seniorityTypes },
        })
      ).toEqual(serializedSeller);
    });
  });
});

// const sellerJSONAPISerializer = new JSONAPISerializer('sellers', {
//   // topLevelLinks: ['https://treetrunk.krona03.ru/api/seller_management/sellers'],
//   attributes: Object.keys(recruitedSerializedSeller2),
//   nullIfMissing: true,
// });
// // console.log(newSerializedSeller);
// // console.log(recruitedSerializedSeller1);
// console.log(
//   JSON.stringify(
//     sellerJSONAPISerializer.serialize({ data: [}
//       newSerializedSeller,
//       dismissSerializedSeller,
//       recruitedSerializedSeller1,
//       recruitedSerializedSeller2,
//     ])
//   )
// );

// const posts = [0, 1, 2].map((num) => new Post({ name: `postName${num}` }));
// const seniorityTypes = [0, 1, 2].map(
//   (num) => new SeniorityType({ name: `seniorityTypeName${num}`, months: num })
// );

// console.log(
//   inspect(
//     serializer.serialize({ data: {}
//       data: Seller.restore(recruitedSellerRestoreProps2),
//       included: { posts, seniorityTypes },
//     })
//   )
// );

// console.log(
//   inspect(
//     serializer.toSerializer({
//       data: [
//         Seller.restore(recruitedSellerRestoreProps1),
//         Seller.restore(recruitedSellerRestoreProps2),
//       ],
//       included: { posts, seniorityTypes },
//     }).data
//   )
// );
