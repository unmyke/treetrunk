import uuidv4 from 'uuid/v4';

import { PostMapper } from './post';
import { container } from 'src/container';

const postToDTO = ({ postId, name, state, pieceRates }) => ({
  postId,
  name,
  state,
  pieceRates: pieceRates.map(({ value, day }) => ({ value, day })),
});

const {
  subdomains: {
    SellerManagement: { Post },
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
const state = 'active';

const entry = {
  post_id: postIdValue,
  name,
  state,
  piece_rates: [
    { value: 0, day: date0 },
    { value: 1, day: date1 },
    { value: 2, day: date2 },
    { value: 3, day: date3 },
  ],
};

const postId = new PostId({ value: postIdValue });
const day0 = new Day({ value: date0 });
const day1 = new Day({ value: date1 });
const day2 = new Day({ value: date2 });
const day3 = new Day({ value: date3 });
const entityPieceRates = [
  { value: 0, day: day0 },
  { value: 1, day: day1 },
  { value: 2, day: day2 },
  { value: 3, day: day3 },
];
const entity = Post.restore({
  postId,
  name,
  state,
  pieceRates: entityPieceRates,
});

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
      expect(postToDTO(persistedEntity)).toEqual(postToDTO(entity));
    });
  });
});
