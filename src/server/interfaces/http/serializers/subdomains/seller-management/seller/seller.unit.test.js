import { subMonths, startOfDay } from 'date-fns';
import { merge } from 'lodash';
import { inspect } from 'util';

import { SellerSerializer as Serializer } from './seller';
import {
  Seller,
  Post,
  SeniorityType,
} from '@domain/subdomains/SellerManagement';
import { SellerId, Day, PostId, SeniorityTypeId } from '@domain/common-types';
import { Seller as states } from '@domain/states';

const simplifyCollection = (collection) =>
  collection.map(({ value, day: { value: day } }) => ({ value, day }));

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
const postName1 = 'post1';
const postName2 = 'post2';
const postName3 = 'post3';
const postState = 'active';
const pieceRates1 = [{ value: 1, day: day1 }, { value: 2, day: day2 }];
const pieceRates2 = [
  { value: 1, day: day1 },
  { value: 2, day: day2 },
  { value: 3, day: day3 },
];
const pieceRates3 = [];
const commonPostRestoreProps = {
  state: postState,
};
const post1RestoreProps = {
  ...commonPostRestoreProps,
  postId: postId1,
  name: postName1,
  pieceRates: pieceRates1,
};
const post2RestoreProps = {
  ...commonPostRestoreProps,
  postId: postId2,
  name: postName2,
  pieceRates: pieceRates2,
};
const post3RestoreProps = {
  ...commonPostRestoreProps,
  postId: postId3,
  name: postName3,
  pieceRates: pieceRates3,
};
const post1 = Post.restore(post1RestoreProps);
const post2 = Post.restore(post2RestoreProps);
const post3 = Post.restore(post3RestoreProps);
const posts = [post1, post2, post3];

const seniorityTypeId0 = new SeniorityTypeId();
const seniorityTypeId1 = new SeniorityTypeId();
const seniorityTypeId2 = new SeniorityTypeId();
const seniorityTypeId3 = new SeniorityTypeId();
const seniorityTypeId4 = new SeniorityTypeId();
const seniorityTypeId5 = new SeniorityTypeId();
const seniorityTypeName0 = 'seniorityType0';
const seniorityTypeName1 = 'seniorityType1';
const seniorityTypeName2 = 'seniorityType2';
const seniorityTypeName3 = 'seniorityType3';
const seniorityTypeName4 = 'seniorityType4';
const seniorityTypeName5 = 'seniorityType5';
const seniorityTypeMonths0 = 0;
const seniorityTypeMonths1 = 1;
const seniorityTypeMonths2 = 2;
const seniorityTypeMonths3 = 3;
const seniorityTypeMonths4 = 4;
const seniorityTypeMonths5 = 5;
const awards0 = [{ value: 50, day: day1 }];
const awards1 = [{ value: 100, day: day1 }];
const awards2 = [{ value: 100, day: day1 }, { value: 200, day: day2 }];
const awards3 = [
  { value: 100, day: day1 },
  { value: 200, day: day2 },
  { value: 300, day: day3 },
];
const awards4 = [{ value: 100, day: day1 }, { value: 300, day: day3 }];
const awards5 = [];
const seniorityTypeState = 'active';

const commonSeniorityTypeRestoreProps = {
  state: seniorityTypeState,
};
const seniorityType0RestoreProps = {
  ...commonSeniorityTypeRestoreProps,
  seniorityTypeId: seniorityTypeId0,
  name: seniorityTypeName0,
  months: seniorityTypeMonths0,
  awards: awards0,
};
const seniorityType1RestoreProps = {
  ...commonSeniorityTypeRestoreProps,
  seniorityTypeId: seniorityTypeId1,
  name: seniorityTypeName1,
  months: seniorityTypeMonths1,
  awards: awards1,
};
const seniorityType2RestoreProps = {
  ...commonSeniorityTypeRestoreProps,
  seniorityTypeId: seniorityTypeId2,
  name: seniorityTypeName2,
  months: seniorityTypeMonths2,
  awards: awards2,
};
const seniorityType3RestoreProps = {
  ...commonSeniorityTypeRestoreProps,
  seniorityTypeId: seniorityTypeId3,
  name: seniorityTypeName3,
  months: seniorityTypeMonths3,
  awards: awards3,
};
const seniorityType4RestoreProps = {
  ...commonSeniorityTypeRestoreProps,
  seniorityTypeId: seniorityTypeId4,
  name: seniorityTypeName4,
  months: seniorityTypeMonths4,
  awards: awards4,
};
const seniorityType5RestoreProps = {
  ...commonSeniorityTypeRestoreProps,
  seniorityTypeId: seniorityTypeId5,
  name: seniorityTypeName5,
  months: seniorityTypeMonths5,
  awards: awards5,
};
const seniorityType0 = SeniorityType.restore(seniorityType0RestoreProps);
const seniorityType1 = SeniorityType.restore(seniorityType1RestoreProps);
const seniorityType2 = SeniorityType.restore(seniorityType2RestoreProps);
const seniorityType3 = SeniorityType.restore(seniorityType3RestoreProps);
const seniorityType4 = SeniorityType.restore(seniorityType4RestoreProps);
const seniorityType5 = SeniorityType.restore(seniorityType5RestoreProps);

const seniorityTypes = [
  seniorityType0,
  seniorityType1,
  seniorityType2,
  seniorityType3,
  seniorityType4,
  seniorityType5,
];

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

const newSellerId = new SellerId();
const recruitedSellerId1 = new SellerId();
const dismissSellerId = new SellerId();
const recruitedSellerId2 = new SellerId();
const firstName = 'Firstname';
const middleName = 'Middlename';
const lastName = 'Lastname';
const phone = '00-00-00';

const commonRestoreSellerProps = {
  firstName,
  middleName,
  lastName,
  phone,
};

const newSellerRestoreProps = {
  ...commonRestoreSellerProps,
  sellerId: newSellerId,
  state: states.NEW,
  appointments: newAppointments,
};
const recruitedSellerRestoreProps1 = {
  ...commonRestoreSellerProps,
  sellerId: recruitedSellerId1,
  state: states.RECRUITED,
  appointments: recruitedAppointments1,
};
const dismissSellerRestoreProps = {
  ...commonRestoreSellerProps,
  sellerId: dismissSellerId,
  state: states.DISMISSED,
  appointments: dismissAppointments,
};
const recruitedSellerRestoreProps2 = {
  ...commonRestoreSellerProps,
  sellerId: recruitedSellerId2,
  state: states.RECRUITED,
  appointments: recruitedAppointments2,
};

const commonSerializedSeller = {
  data: {
    type: 'sellers',
    attributes: {
      first_name: commonRestoreSellerProps.firstName,
      middle_name: commonRestoreSellerProps.middleName,
      last_name: commonRestoreSellerProps.lastName,
      phone,
    },
  },
};
const newSerializedSeller = merge({}, commonSerializedSeller, {
  data: {
    id: newSellerId.value,
    links: {
      self: `${rootUri}/sellers/${newSellerId.value}`,
    },
    attributes: {
      id: newSellerId.value,
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
    id: recruitedSellerId1.value,
    links: {
      self: `${rootUri}/sellers/${recruitedSellerId1.value}`,
    },
    attributes: {
      id: recruitedSellerId1.value,
      state: recruitedSellerRestoreProps1.state,
      recruit_day: date1,
      dismiss_day: null,
      seniority: 4,
      appointments: [
        {
          post: {
            data: {},
          },
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
          id: seniorityTypeId4.value,
        },
      },
    },
  },
  included: [
    {
      type: 'seniority_types',
      id: seniorityTypeId4.value,
      attributes: {
        id: seniorityTypeId4.value,
        name: seniorityTypeName4,
        months: seniorityTypeMonths4,
        state: seniorityTypeState,
        award: awards4[awards4.length - 1].value,
        awards: simplifyCollection(awards4),
      },
    },
    {
      type: 'posts',
      id: postId2.value,
      attributes: {
        id: postId2.value,
        name: postName2,
        state: postState,
        piece_rate: pieceRates2[pieceRates2.length - 1].value,
        piece_rates: simplifyCollection(pieceRates2),
      },
      relationships: {},
    },
    {
      type: 'posts',
      id: postId1.value,
      attributes: {
        id: postId1.value,
        name: postName1,
        state: postState,
        piece_rate: pieceRates1[pieceRates1.length - 1].value,
        piece_rates: simplifyCollection(pieceRates1),
      },
    },
  ],
});
const dismissSerializedSeller = merge({}, commonSerializedSeller, {
  data: {
    id: dismissSellerId.value,
    links: {
      self: `${rootUri}/sellers/${dismissSellerId.value}`,
    },
    attributes: {
      id: dismissSellerId.value,
      state: dismissSellerRestoreProps.state,
      recruit_day: null,
      dismiss_day: dismissDate,
      seniority: null,
      appointments: [],
    },
    relationships: {
      post: { data: null },
      seniority_type: { data: null },
    },
  },
});
const recruitedSerializedSeller2 = merge({}, commonSerializedSeller, {
  data: {
    id: recruitedSellerId2.value,
    links: {
      self: `${rootUri}/sellers/${recruitedSellerId2.value}`,
    },
    attributes: {
      id: recruitedSellerId2.value,
      state: recruitedSellerRestoreProps2.state,
      recruit_day: date3,
      dismiss_day: null,
      seniority: 1,
      appointments: [
        {
          // post: postId3.value,
          day: date3,
        },
      ],
    },
    relationships: {
      post: {
        data: {
          id: postId3.value,
          type: 'posts',
        },
      },
      seniority_type: {
        data: {
          id: seniorityTypeId1.value,
          type: 'seniority_types',
        },
      },
    },
  },
  included: [
    {
      attributes: {
        award: awards1[awards1.length - 1].value,
        awards: simplifyCollection(awards1),
        months: seniorityTypeMonths1,
        id: seniorityTypeId1.value,
        name: seniorityTypeName1,
        state: seniorityTypeState,
      },
      id: seniorityTypeId1.value,
      type: 'seniority_types',
    },
    {
      attributes: {
        id: postId3.value,
        name: postName3,
        state: postState,
        piece_rate: null,
        piece_rates: [],
      },
      id: postId3.value,
      relationships: {},
      type: 'posts',
    },
  ],
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
      expect(
        serializer.serialize({
          data: seller,
          included: { posts, seniorityTypes },
        })
      ).toEqual(serializedSeller);
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

// console.log('## newSerializedSeller ##');
// console.log(inspect(newSerializedSeller, { showHidden: false, depth: null }));
console.log('## recruitedSerializedSeller1 ##');
console.log(
  inspect(
    serializer.serialize({
      data: [
        Seller.restore(recruitedSellerRestoreProps1),
        Seller.restore(recruitedSellerRestoreProps2),
      ],
      included: { posts, seniorityTypes },
    }),
    {
      showHidden: false,
      depth: null,
    }
  )
);
// console.log('## dismissSerializedSeller ##');
// console.log(
//   inspect(dismissSerializedSeller, { showHidden: false, depth: null })
// );
// console.log('## recruitedSerializedSeller2 ##');
// console.log(
//   inspect(recruitedSerializedSeller2, { showHidden: false, depth: null })
// );
