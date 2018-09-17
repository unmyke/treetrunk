import { subMonths, startOfDay } from 'date-fns';

import * as commonTypes from '../../../commonTypes';
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
  post: undefined,
  recruit_day: undefined,
  dismiss_day: undefined,
  seniority: undefined,
  appointments: [],
};
const recruitedSerializedSeller1 = {
  ...commonSerializedSeller,
  state: recruitedSellerRestoreProps1.state,
  post: postId2.value,
  recruit_day: date1,
  dismiss_day: undefined,
  seniority: 4,
  appointments: [
    { post: postId1.value, day: day1.value },
    { post: postId2.value, day: day2.value },
  ],
};
const dismissSerializedSeller = {
  ...commonSerializedSeller,
  state: dismissSellerRestoreProps.state,
  post: undefined,
  recruit_day: undefined,
  dismiss_day: dismissDate,
  seniority: undefined,
  appointments: [],
};
const recruitedSerializedSeller2 = {
  ...commonSerializedSeller,
  state: recruitedSellerRestoreProps2.state,
  post: postId3.value,
  recruit_day: date3,
  dismiss_day: undefined,
  seniority: 1,
  appointments: [{ post: postId3.value, day: day3.value }],
};
const serializer = new Serializer({ commonTypes });

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
