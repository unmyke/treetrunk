import uuidv4 from 'uuid/v4';
import { format } from 'date-fns';

import { SeniorityTypeMapper } from './SeniorityTypeMapper';
import { container } from 'src/container';

const {
  subdomains: {
    SellerManagement: {
      entities: { SeniorityType },
    },
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

const date0Entry = format(date0);
const date1Entry = format(date1);
const date2Entry = format(date2);
const date3Entry = format(date3);
const entry = {
  seniorityTypeId: seniorityTypeIdValue,
  name,
  months,
  awards: [
    { value: 0, date: date0Entry },
    { value: 1, date: date1Entry },
    { value: 2, date: date2Entry },
    { value: 3, date: date3Entry },
  ],
};

const seniorityTypeId = new SeniorityTypeId({ value: seniorityTypeIdValue });
const day0 = new Day({ value: date0 });
const day1 = new Day({ value: date1 });
const day2 = new Day({ value: date2 });
const day3 = new Day({ value: date3 });
const entity = new SeniorityType({ seniorityTypeId, name, months });
const entityAwards = [
  { value: 0, day: day0 },
  { value: 1, day: day1 },
  { value: 2, day: day2 },
  { value: 3, day: day3 },
];
entity.setAwards(entityAwards);

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
      expect(persistedEntity).toEqual(entity);
    });
  });
});
