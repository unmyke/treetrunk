import uuidv4 from 'uuid/v4';
import { container } from 'src/container';
import { request } from 'src/infra/support/test/request';

const {
  subdomains: {
    SellerManagement: {
      entities: { Post },
    },
  },
  commonTypes: { PostId, Day },
  repositories: {
    SellerManagement: { Post: postRepo },
  },
} = container;

// test DTO objects
const pieceRatesDTO = [{ value: 1, date: '2018-01-01T00:00:00.000+08:00' }];

const activePostWithPieceRatesDTO = {
  postId: uuidv4(),
  name: 'Флорист',
  pieceRate: 1,
  pieceRates: pieceRatesDTO,
  state: 'active',
};
const activePostWithoutPieceRatesDTO = {
  postId: uuidv4(),
  name: 'Старший флорист',
  pieceRates: [],
  state: 'active',
};
const inactivePostWithPieceRatesDTO = {
  postId: uuidv4(),
  name: 'Цветочник',
  pieceRate: 1,
  pieceRates: pieceRatesDTO,
  state: 'inactive',
};
const inactivePostWithoutPieceRatesDTO = {
  postId: uuidv4(),
  name: 'Старший цветочник',
  pieceRates: [],
  state: 'inactive',
};

// test aggregates
const pieceRates = [
  {
    value: pieceRatesDTO[0].value,
    day: new Day({ value: new Date(pieceRatesDTO[0].date) }),
  },
];

const activePostWithPieceRates = new Post({
  postId: new PostId({ value: activePostWithPieceRatesDTO.postId }),
  name: activePostWithPieceRatesDTO.name,
  state: activePostWithPieceRatesDTO.state,
});
activePostWithPieceRates.setPieceRates(pieceRates);

const activePostWithoutPieceRates = new Post({
  postId: new PostId({ value: activePostWithoutPieceRatesDTO.postId }),
  name: activePostWithoutPieceRatesDTO.name,
  state: activePostWithoutPieceRatesDTO.state,
});

const inactivePostWithPieceRates = new Post({
  postId: new PostId({ value: inactivePostWithPieceRatesDTO.postId }),
  name: inactivePostWithPieceRatesDTO.name,
  state: inactivePostWithPieceRatesDTO.state,
});
inactivePostWithPieceRates.setPieceRates(pieceRates);

const inactivePostWithoutPieceRates = new Post({
  postId: new PostId({ value: inactivePostWithoutPieceRatesDTO.postId }),
  name: inactivePostWithoutPieceRatesDTO.name,
  state: inactivePostWithoutPieceRatesDTO.state,
});

describe('API :: GET /api/posts', () => {
  afterEach(() => {
    return postRepo.clear();
  });

  context('when passed no props', () => {
    context('when there are persisted active posts', () => {
      beforeEach(() => {
        return Promise.all([
          postRepo.add(activePostWithPieceRates),
          postRepo.add(activePostWithoutPieceRates),
          postRepo.add(inactivePostWithPieceRates),
          postRepo.add(inactivePostWithoutPieceRates),
        ]);
      });

      test('should return 200 with array of all active posts', async () => {
        const { statusCode, body } = await request().get('/api/posts');

        expect(statusCode).toBe(200);
        expect(body).toHaveLength(2);
        expect(body[0]).toEqual(activePostWithPieceRatesDTO);
        expect(body[1]).toEqual(activePostWithoutPieceRatesDTO);
      });
    });
    context('when there is no persisted active posts', () => {
      beforeEach(() => {
        return Promise.all([
          postRepo.add(inactivePostWithPieceRates),
          postRepo.add(inactivePostWithoutPieceRates),
        ]);
      });
      test('should return 200 with empty array', async () => {
        const { statusCode, body } = await request().get('/api/posts');

        expect(statusCode).toBe(200);
        expect(body).toHaveLength(0);
      });
    });
  });

  context('when passed valid props', () => {
    context('when there are persisted filtered posts', () => {
      beforeEach(() => {
        return Promise.all([
          postRepo.add(activePostWithPieceRates),
          postRepo.add(activePostWithoutPieceRates),
          postRepo.add(inactivePostWithPieceRates),
          postRepo.add(inactivePostWithoutPieceRates),
        ]);
      });
      context('when passed { active: false }', () => {
        test('should return 200 with array of inactive posts', async () => {
          const { statusCode, body } = await request().get(
            '/api/posts?active=false'
          );

          expect(statusCode).toBe(200);
          expect(body).toHaveLength(2);
          expect(body[0]).toEqual(inactivePostWithPieceRatesDTO);
          expect(body[1]).toEqual(inactivePostWithoutPieceRatesDTO);
        });
      });
      context('when passed { hasPieceRates: false }', () => {
        test('should return 200 with array of posts without piece rates', async () => {
          const { statusCode, body } = await request().get(
            '/api/posts?hasPieceRates=false'
          );

          expect(statusCode).toBe(200);
          expect(body).toHaveLength(2);
          expect(body[0]).toEqual(activePostWithoutPieceRatesDTO);
          expect(body[1]).toEqual(inactivePostWithoutPieceRatesDTO);
        });
      });

      context('when passed { active: false, hasPieceRates: false }', () => {
        test('should return 200 with array of inactive posts whithout piece rates', async () => {
          const { statusCode, body } = await request().get(
            '/api/posts?active=false&hasPieceRates=false'
          );

          expect(statusCode).toBe(200);
          expect(body).toHaveLength(1);
          expect(body[0]).toEqual(inactivePostWithoutPieceRatesDTO);
        });
      });
    });

    context('when there is no persisted filtered posts', () => {
      test('should return 200 with empty array', async () => {
        const { statusCode, body } = await request().get(
          '/api/posts?active=false'
        );

        expect(statusCode).toBe(200);
        expect(body).toHaveLength(0);
      });
    });
    context('when passed { hasPieceRates: false }', () => {
      test('should return 200 with empty array', async () => {
        const { statusCode, body } = await request().get(
          '/api/posts?hasPieceRates=false'
        );

        expect(statusCode).toBe(200);
        expect(body).toHaveLength(0);
      });
    });

    context('when passed { active: false, hasPieceRates: false }', () => {
      test('should return 200 with empty array', async () => {
        const { statusCode, body } = await request().get(
          '/api/posts?active=false&hasPieceRates=false'
        );

        expect(statusCode).toBe(200);
        expect(body).toHaveLength(0);
      });
    });
  });

  context('when passed invalid props', () => {
    test('should return 200 with empty array', async () => {
      const { statusCode, body } = await request().get('/api/posts?test=false');

      expect(statusCode).toBe(200);
      expect(body).toHaveLength(0);
    });
  });
});
