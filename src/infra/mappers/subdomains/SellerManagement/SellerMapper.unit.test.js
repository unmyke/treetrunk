import uuidv4 from 'uuid/v4';
import { format } from 'date-fns';

import { SellerMapper } from './SellerMapper';
import { container } from 'src/container';

const {
  subdomains: {
    SellerManagement: {
      entities: { Seller },
    },
  },
  commonTypes,
} = container;

const { SellerId, PostId, Day } = commonTypes;

const sellerIdValue = uuidv4();
const firstName = 'Firstname';
const middleName = 'Middlename';
const lastName = 'Lastname';
const phone = 'phone';
const postIdValue0 = uuidv4();
const postIdValue1 = uuidv4();
const postIdValue2 = uuidv4();
const postIdValue3 = uuidv4();
const date0 = new Date('2018.01.01');
const date1 = new Date('2018.02.01');
const date2 = new Date('2018.03.01');
const date3 = new Date('2018.04.01');

const date0Entry = format(date0);
const date1Entry = format(date1);
const date2Entry = format(date2);
const date3Entry = format(date3);
const entry = {
  sellerId: sellerIdValue,
  firstName,
  middleName,
  lastName,
  phone,
  appointments: [
    { postId: postIdValue0, date: date0Entry },
    { postId: postIdValue1, date: date1Entry },
    { postId: postIdValue2, date: date2Entry },
    { postId: postIdValue3, date: date3Entry },
  ],
};

const sellerId = new SellerId({ value: sellerIdValue });
const postId0 = new PostId({ value: postIdValue0 });
const postId1 = new PostId({ value: postIdValue1 });
const postId2 = new PostId({ value: postIdValue2 });
const postId3 = new PostId({ value: postIdValue3 });
const day0 = new Day({ value: date0 });
const day1 = new Day({ value: date1 });
const day2 = new Day({ value: date2 });
const day3 = new Day({ value: date3 });
const entityAppointments = [
  { postId: postId0, day: day0 },
  { postId: postId1, day: day1 },
  { postId: postId2, day: day2 },
  { postId: postId3, day: day3 },
];
const entity = new Seller({
  sellerId,
  firstName,
  middleName,
  lastName,
  phone,
});
entity.setAppointments(entityAppointments);

describe('Domain :: infra :: mappers :: SellerMapper', () => {
  let sellerMapper;

  beforeEach(() => {
    sellerMapper = new SellerMapper({ commonTypes, Entity: Seller });
  });

  describe('#toDatabase', () => {
    test('should return Seller entry', () => {
      const persistedEntry = sellerMapper.toDatabase(entity);

      expect(persistedEntry).toEqual(entry);
    });
  });

  describe('#toEntity', () => {
    test('should return Seller entity', () => {
      const persistedEntity = sellerMapper.toEntity(entry);

      expect(persistedEntity).toBeInstanceOf(Seller);
      expect(persistedEntity.sellerId).toBeInstanceOf(SellerId);
      expect(persistedEntity).toEqual(entity);
    });
  });
});
