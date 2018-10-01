import { subMonths, startOfDay } from 'date-fns';

import * as commonTypes from '../../../commonTypes';
import { SeniorityTypeDeserializer as Deserializer } from './SeniorityTypeDeserializer';
import { SeniorityType } from 'src/domain/subdomains/SellerManagement';
import { SeniorityTypeId, Day } from 'src/domain/commonTypes';
import { SeniorityType as states } from 'src/domain/states';

const today = startOfDay(new Date());
const date1 = subMonths(today, 3);
const date2 = subMonths(today, 2);

const value1 = 100;
const value2 = 200;

const day1 = new Day({ value: date1 });
const day2 = new Day({ value: date2 });

const award1 = { value: value1, day: day1 };
const award2 = { value: value2, day: day2 };

const awards1 = [];
const awards2 = [award1];
const awards3 = [award1, award2];

const seniorityTypeId = new SeniorityTypeId();
const name = 'SeniorityType';

const commonRestoreSeniorityTypeProps = {
  seniorityTypeId,
  name,
};

const seniorityTypeRestoreProps1 = {
  ...commonRestoreSeniorityTypeProps,
  state: states.ACTIVE,
  awards: awards1,
};
const seniorityTypeRestoreProps2 = {
  ...commonRestoreSeniorityTypeProps,
  state: states.ACTIVE,
  awards: awards2,
};
const seniorityTypeRestoreProps3 = {
  ...commonRestoreSeniorityTypeProps,
  state: states.DELETED,
  awards: awards3,
};

const commonSerializedSeniorityType = {
  id: commonRestoreSeniorityTypeProps.seniorityTypeId.value,
  name: commonRestoreSeniorityTypeProps.name,
};
const newSerializedSeniorityType = {
  ...commonSerializedSeniorityType,
  state: seniorityTypeRestoreProps1.state,
  award: null,
  awards: [],
};
const recruitedSerializedSeniorityType1 = {
  ...commonSerializedSeniorityType,
  state: seniorityTypeRestoreProps2.state,
  award: value1,
  awards: [{ value: value1, day: date1.toString() }],
};
const recruitedSerializedSeniorityType2 = {
  ...commonSerializedSeniorityType,
  state: seniorityTypeRestoreProps3.state,
  award: value2,
  awards: [
    { value: value1, day: date1.toString() },
    { value: value2, day: date2.toString() },
  ],
};
const serializer = new Deserializer({ commonTypes });

describe('interfaces :: serializers :: SeniorityTypeManagement :: SeniorityType', () => {
  let seniorityType, seniorityTypeRestoreProps, serializedSeniorityType;

  beforeEach(() => {});

  context('when passed new seniorityType', () => {
    beforeEach(() => {
      seniorityTypeRestoreProps = seniorityTypeRestoreProps1;

      seniorityType = SeniorityType.restore(seniorityTypeRestoreProps);
      serializedSeniorityType = newSerializedSeniorityType;
    });

    test('should return seniorityType DTO', () => {
      expect(serializer.toDTO(seniorityType)).toEqual(serializedSeniorityType);
    });
  });

  context('when passed seniorityType with one piece rate', () => {
    beforeEach(() => {
      seniorityTypeRestoreProps = seniorityTypeRestoreProps2;

      seniorityType = SeniorityType.restore(seniorityTypeRestoreProps);
      serializedSeniorityType = recruitedSerializedSeniorityType1;
    });

    test('should return seniorityType DTO', () => {
      expect(serializer.toDTO(seniorityType)).toEqual(serializedSeniorityType);
    });
  });

  context('when passed seniorityType with two piece rate', () => {
    beforeEach(() => {
      seniorityTypeRestoreProps = seniorityTypeRestoreProps3;

      seniorityType = SeniorityType.restore(seniorityTypeRestoreProps);
      serializedSeniorityType = recruitedSerializedSeniorityType2;
    });

    test('should return seniorityType DTO', () => {
      expect(serializer.toDTO(seniorityType)).toEqual(serializedSeniorityType);
    });
  });
});
