import uuidv4 from 'uuid/v4';

import { SeniorityTypeMapper } from './seniority-type';
import container from '@container';

const seniorityTypeToDTO = ({ seniorityTypeId, name, months, awards }) => ({
  seniorityTypeId,
  name,
  months,
  awards: awards.map(({ value, day }) => {
    value, day;
  }),
});
const {
  subdomains: {
    SellerManagement: { SeniorityType },
  },
  commonTypes,
} = container;

const { SeniorityTypeId, Day } = commonTypes;

const seniorityTypeIdValue = uuidv4();
const date0 = new Date('2018.01.01');
const date1 = new Date('2018.02.01');
const date2 = new Date('2018.03.01');
const date3 = new Date('2018.04.01');
const name = 'До 6 мес.';
const months = 6;
const state = 'active';

const entry = {
  seniority_type_id: seniorityTypeIdValue,
  name,
  months,
  state,
  awards: [
    { value: 0, day: date0 },
    { value: 1, day: date1 },
    { value: 2, day: date2 },
    { value: 3, day: date3 },
  ],
};

const seniorityTypeId = new SeniorityTypeId({ value: seniorityTypeIdValue });
const day0 = new Day({ value: date0 });
const day1 = new Day({ value: date1 });
const day2 = new Day({ value: date2 });
const day3 = new Day({ value: date3 });
const entityAwards = [
  { value: 0, day: day0 },
  { value: 1, day: day1 },
  { value: 2, day: day2 },
  { value: 3, day: day3 },
];

const entity = SeniorityType.restore({
  seniorityTypeId,
  name,
  months,
  state,
  awards: entityAwards,
});

describe('Domain :: infra :: mappers :: SeniorityTypeMapper', () => {
  let seniorityTypeMapper;

  beforeEach(() => {
    seniorityTypeMapper = new SeniorityTypeMapper({
      commonTypes,
      Entity: SeniorityType,
    });
  });

  describe('#toDatabase', () => {
    test('should return SeniorityType entry', () => {
      const persistedEntry = seniorityTypeMapper.toDatabase(entity);

      expect(persistedEntry).toEqual(entry);
    });
  });

  describe('#toEntity', () => {
    test('should return SeniorityType entity', () => {
      const persistedEntity = seniorityTypeMapper.toEntity(entry);

      expect(persistedEntity).toBeInstanceOf(SeniorityType);
      expect(persistedEntity.seniorityTypeId).toBeInstanceOf(SeniorityTypeId);
      expect(seniorityTypeToDTO(persistedEntity)).toEqual(
        seniorityTypeToDTO(entity)
      );
    });
  });
});
