import { subMonths, startOfDay } from 'date-fns';
import { Serializer as JSONAPISerializer } from 'jsonapi-serializer';

import { SellerSerializer as Serializer } from './SellerSerializer';
import { Seller } from 'src/domain/subdomains/SellerManagement';
import { SellerId, Day, PostId } from 'src/domain/commonTypes';
import { Seller as states } from 'src/domain/states';

const today = startOfDay(new Date());
const date1 = subMonths(today, 4);
const date2 = subMonths(today, 3);
const dismissDate = subMonths(today, 2);
const date3 = subMonths(today, 1);

const dismissPostId = new PostId();
PostId.dismissPostId = dismissPostId;
const postId1 = new PostId();
const postId2 = new PostId();
const postId3 = new PostId();

const day1 = new Day({ value: date1 });
const day2 = new Day({ value: date2 });
const dismissDay = new Day({
  value: dismissDate,
});
const day3 = new Day({ value: date3 });

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
  id: commonRestoreSellerProps.sellerId.value,
  first_name: commonRestoreSellerProps.firstName,
  middle_name: commonRestoreSellerProps.middleName,
  last_name: commonRestoreSellerProps.lastName,
  phone,
};
const newSerializedSeller = {
  ...commonSerializedSeller,
  state: newSellerRestoreProps.state,
  post: null,
  recruit_day: null,
  dismiss_day: null,
  seniority: null,
  appointments: [],
};
const recruitedSerializedSeller1 = {
  ...commonSerializedSeller,
  state: recruitedSellerRestoreProps1.state,
  post: postId2.value,
  recruit_day: date1.toString(),
  dismiss_day: null,
  seniority: 4,
  appointments: [
    { post: postId1.value, day: date1.toString() },
    { post: postId2.value, day: date2.toString() },
  ],
};
const dismissSerializedSeller = {
  ...commonSerializedSeller,
  state: dismissSellerRestoreProps.state,
  post: null,
  recruit_day: null,
  dismiss_day: dismissDate.toString(),
  seniority: null,
  appointments: [],
};
const recruitedSerializedSeller2 = {
  ...commonSerializedSeller,
  state: recruitedSellerRestoreProps2.state,
  post: postId3.value,
  recruit_day: date3.toString(),
  dismiss_day: null,
  seniority: 1,
  appointments: [{ post: postId3.value, day: date3.toString() }],
};
const serializer = new Serializer();

describe('interfaces :: serializers :: SellerManagement :: Seller', () => {
  let seller, sellerRestoreProps, serializedSeller;

  beforeEach(() => {});

  context('when passed new seller', () => {
    beforeEach(() => {
      sellerRestoreProps = newSellerRestoreProps;

      seller = Seller.restore(sellerRestoreProps);
      serializedSeller = newSerializedSeller;
    });

    test('should return serialized seller', () => {
      expect(serializer.serialize(seller)).toEqual(serializedSeller);
    });
  });

  context('when passed recruited once seller', () => {
    beforeEach(() => {
      sellerRestoreProps = recruitedSellerRestoreProps1;

      seller = Seller.restore(sellerRestoreProps);
      serializedSeller = recruitedSerializedSeller1;
    });

    test('should return serialized seller', () => {
      expect(serializer.serialize(seller)).toEqual(serializedSeller);
    });
  });

  context('when passed dismissed seller', () => {
    beforeEach(() => {
      sellerRestoreProps = dismissSellerRestoreProps;

      seller = Seller.restore(sellerRestoreProps);
      serializedSeller = dismissSerializedSeller;
    });

    test('should return serialized seller', () => {
      expect(serializer.serialize(seller)).toEqual(serializedSeller);
    });
  });

  context('when passed recruited again seller', () => {
    beforeEach(() => {
      sellerRestoreProps = recruitedSellerRestoreProps2;

      seller = Seller.restore(sellerRestoreProps);
      serializedSeller = recruitedSerializedSeller2;
    });

    test('should return serialized seller', () => {
      expect(serializer.serialize(seller)).toEqual(serializedSeller);
    });
  });
});

const sellerJSONAPISerializer = new JSONAPISerializer('sellers', {
  // topLevelLinks: ['https://treetrunk.krona03.ru/api/seller_management/sellers'],
  attributes: Object.keys(recruitedSerializedSeller2),
  nullIfMissing: true,
});
// console.log(newSerializedSeller);
// console.log(recruitedSerializedSeller1);
console.log(
  JSON.stringify(
    sellerJSONAPISerializer.serialize([
      newSerializedSeller,
      dismissSerializedSeller,
      recruitedSerializedSeller1,
      recruitedSerializedSeller2,
    ])
  )
);
