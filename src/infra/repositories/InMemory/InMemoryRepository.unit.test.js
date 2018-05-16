import { container } from 'src/container';

const {
  subdomains: {
    SellerManagement: {
      entities: { Seller, Post },
    },
  },
  repositories: { Seller: sellerRepo },
  commonTypes: { Day },
} = container;

const post = new Post({ name: 'Флорист' });
post.setPieceRates([
  { value: 1, date: new Date() },
  { value: 2, date: new Date() },
]);

const sellerFactory = (count, firstName) => {
  for (let index = 0; index < count; index++) {
    const seller = new Seller({
      firstName: `${firstName}${count}`,
      middleName: 'Middlename',
      lastName: 'Lastname',
      phone: '00-00-00',
    });
    seller.addAppointment(post.postId, new Day());

    sellerRepo.constructor.store.push(seller);
  }
};

describe('Infra :: repositories :: InMemoryRepository :: SellerInMemoryRepository', () => {
  describe('#getAll(props = { where: {} })', () => {});

  describe('#getOne(props)', () => {});

  describe('#getById(id)', () => {});

  describe('#getByIds(ids)', () => {});

  describe('#add(entity)', () => {});

  describe('#save(entity)', () => {});

  describe('#remove(id)', () => {});

  describe('#count(props)', () => {
    test('should return count of items', async () => {
      sellerFactory(3, 'Test');
      const sellersCount = await sellerRepo.count();

      expect(sellersCount).toBe(3);
    });
  });

  describe('#clear()', () => {});
});
