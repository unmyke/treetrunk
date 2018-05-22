import uuidv4 from 'uuid/v4';
import { format } from 'date-fns';

import { PostMapper } from './PostMapper';
import { container } from 'src/container';

const {
  subdomains: {
    SellerManagement: {
      entities: { Post },
    },
  },
  commonTypes,
} = container;

const { PostId, Day } = commonTypes;

const postIdValue = uuidv4();
const date0 = new Date('2018.01.01');
const date1 = new Date('2018.02.01');
const date2 = new Date('2018.03.01');
const date3 = new Date('2018.04.01');
const name = 'Флорист';

const date0Entry = format(date0);
const date1Entry = format(date1);
const date2Entry = format(date2);
const date3Entry = format(date3);
const entry = {
  postId: postIdValue,
  name,
  pieceRates: [
    { value: 0, date: date0Entry },
    { value: 1, date: date1Entry },
    { value: 2, date: date2Entry },
    { value: 3, date: date3Entry },
  ],
};

const postId = new PostId({ value: postIdValue });
const day0 = new Day({ value: date0 });
const day1 = new Day({ value: date1 });
const day2 = new Day({ value: date2 });
const day3 = new Day({ value: date3 });
const entity = new Post({ postId, name });
const entityPieceRates = [
  { value: 0, day: day0 },
  { value: 1, day: day1 },
  { value: 2, day: day2 },
  { value: 3, day: day3 },
];
entity.setPieceRates(entityPieceRates);

describe('Domain :: infra :: mappers :: PostMapper', () => {
  let postMapper;

  beforeEach(() => {
    postMapper = new PostMapper({ commonTypes, Entity: Post });
  });

  describe('#toDatabase', () => {
    test('should return Post entry', () => {
      const persistedEntry = postMapper.toDatabase(entity);

      expect(persistedEntry).toEqual(entry);
    });
  });

  describe('#toEntity', () => {
    test('should return Post entity', () => {
      const persistedEntity = postMapper.toEntity(entry);

      expect(persistedEntity).toBeInstanceOf(Post);
      expect(persistedEntity.postId).toBeInstanceOf(PostId);
      expect(persistedEntity).toEqual(entity);
    });
  });
});
