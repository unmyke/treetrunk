import { PostMapper } from './PostMapper';
import uuidv4 from 'uuid/v4';
import { container } from 'src/container';

const {
  domain: {
    entities: { Post },
    commonTypes: { PostId, Day },
  },
} = container;

let postMapper;

const postIdValue = uuidv4();

const postId = new PostId({ value: postIdValue });

const date0 = new Date('2018.01.01');
const date1 = new Date('2018.02.01');
const date2 = new Date('2018.03.01');
const date3 = new Date('2018.04.01');

const entry = {
  postId: postIdValue,
  name: 'Name',
  pieceRates: [
    { value: 0, date: date0 },
    { value: 1, date: date1 },
    { value: 2, date: date2 },
    { value: 3, date: date3 },
  ],
};

const entity = new Post({ postId, name: entry.name });
entity.setPieceRates(entry.pieceRates);

describe('Domain :: infra :: mappers :: PostMapper', () => {
  beforeEach(() => {
    postMapper = new PostMapper(container);
  });

  describe('#toEntity', () => {
    test('should return Post entity', () => {
      const persistedEntity = postMapper.toEntity(entry);

      expect(persistedEntity).toBeInstanceOf(Post);
      expect(persistedEntity.postId).toBeInstanceOf(PostId);
      expect(persistedEntity).toEqual(entity);
    });
  });

  describe('#toDatabase', () => {
    test('should return Post entry', () => {
      const persistedEntry = postMapper.toDatabase(entity);

      expect(persistedEntry).toEqual(entry);
    });
  });
});
