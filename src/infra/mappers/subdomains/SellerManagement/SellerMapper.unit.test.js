import { SellerMapper } from './SellerMapper';
import uuidv4 from 'uuid/v4';
import { container } from 'src/container';

const {
  subdomains: {
    SellerManagement: {
      entities: { Seller },
    },
  },
  commonTypes: { SellerId, PostId, Day },
} = container;

let sellerMapper;

const sellerIdValue = uuidv4();
const sellerId = new SellerId({ value: sellerIdValue });

const postIdValue0 = uuidv4();
const postIdValue1 = uuidv4();
const postIdValue2 = uuidv4();
const postIdValue3 = uuidv4();
// const postId0 = new PostId({ value: postIdValue0 });
// const postId1 = new PostId({ value: postIdValue1 });
// const postId2 = new PostId({ value: postIdValue2 });
// const postId3 = new PostId({ value: postIdValue3 });

const date0 = new Date('2018.01.01');
const date1 = new Date('2018.02.01');
const date2 = new Date('2018.03.01');
const date3 = new Date('2018.04.01');

const firstName = 'Firstname';
const middleName = 'Middlename';
const lastName = 'Lastname';
const phone = 'phone';

const appointments = [
  { postId: postIdValue0, date: date0 },
  { postId: postIdValue1, date: date1 },
  { postId: postIdValue2, date: date2 },
  { postId: postIdValue3, date: date3 },
];

const entry = {
  sellerId: sellerIdValue,
  firstName,
  middleName,
  lastName,
  phone,
  appointments,
};

const entity = new Seller({
  sellerId,
  firstName,
  middleName,
  lastName,
  phone,
});
entity.setAppointments(appointments);

describe('Domain :: infra :: mappers :: SellerMapper', () => {
  beforeEach(() => {
    sellerMapper = new SellerMapper(container);
  });

  describe('#toEntity', () => {
    test('should return Seller entity', () => {
      const persistedEntity = sellerMapper.toEntity(entry);

      expect(persistedEntity).toBeInstanceOf(Seller);
      expect(persistedEntity.sellerId).toBeInstanceOf(SellerId);
      expect(persistedEntity).toEqual(entity);
    });
  });

  describe('#toDatabase', () => {
    test('should return Seller entry', () => {
      const persistedEntry = sellerMapper.toDatabase(entity);

      expect(persistedEntry).toEqual(entry);
    });
  });
});
