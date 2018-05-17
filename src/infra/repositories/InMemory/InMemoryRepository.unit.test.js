import { container } from 'src/container';

const {
  subdomains: {
    SellerManagement: {
      entities: { Seller, Post },
    },
  },
  repositories: {
    SellerManagement: { Seller: sellerRepo },
  },
  commonTypes: { Day },
} = container;

const post = new Post({ name: 'Флорист' });
post.setPieceRates([
  { value: 1, date: new Date() },
  { value: 2, date: new Date() },
]);

const sellerFactory = async (count, firstName, postId = post.postId) => {
  const sequence = Array.apply(null, { length: count }).map(
    Number.call,
    Number
  );

  return Promise.all(
    sequence.map(async (number) => {
      const seller = new Seller({
        firstName: `${firstName}${number}`,
        middleName: 'Middlename',
        lastName: 'Lastname',
        phone: '00-00-00',
      });
      seller.addAppointment(postId, new Day());

      const persistedSeller = await sellerRepo.add(seller);
      return persistedSeller;
    })
  );
};

describe('Infra :: repositories :: InMemoryRepository :: SellerInMemoryRepository', () => {
  afterEach(async () => {
    sellerRepo.store = [];
  });

  describe('#getAll', () => {
    test('should return array of Seller instances', async () => {
      const sellers = await sellerFactory(10, 'Test');

      const persistedSellers = await sellerRepo.getAll();
      expect(persistedSellers).toHaveLength(10);
      expect(persistedSellers[0]).toBeInstanceOf(Seller);
      expect(persistedSellers[0].firstName).toBe('Test0');
      expect(persistedSellers[9].firstName).toBe('Test9');
    });
  });

  describe('#getOne', () => {
    test('should return array of Seller instances', async () => {
      const sellers = await sellerFactory(10, 'Test');

      const persistedSeller = await sellerRepo.getOne({
        where: { firstName: 'Test5' },
      });

      expect(persistedSeller).toBeInstanceOf(Seller);
      expect(persistedSeller).toEqual(sellers[5]);
    });
  });

  describe('#getById(id)', () => {});

  describe('#getByIds(ids)', () => {});

  describe('#add(entity)', () => {});

  describe('#save(entity)', () => {});

  describe('#remove(id)', () => {});

  describe('#count(props)', () => {
    test('should return count of items', async () => {
      const sellers = await sellerFactory(3, 'Test');

      const sellersCount = await sellerRepo.count();
      expect(sellersCount).toBe(3);
    });
  });

  describe('#clear()', () => {});

  describe('#countByPostId', () => {
    test('should return count of sellers with post specific postId', async () => {
      const newPost = new Post({ name: 'Старший Флорист' });
      post.setPieceRates([
        { value: 1, date: new Date() },
        { value: 2, date: new Date() },
      ]);

      const sellers1 = await sellerFactory(3, 'Test');
      const sellers2 = await sellerFactory(4, 'NewTest', newPost.postId);

      const sellersCount1 = await sellerRepo.countByPostId(post.postId);
      const sellersCount2 = await sellerRepo.countByPostId(newPost.postId);
      expect(sellersCount1).toBe(3);
      expect(sellersCount2).toBe(4);
    });
  });
});
