import { Operation } from '../../_lib';
import { Seller as states } from '../../../domain/states';

const getMonthsRangeQuery = (sellers) => {
  const range = sellers.reduce(({ min, max }, { months }) => {
    const newMin = min === undefined || months < min ? months : min;
    const newMax = max === undefined || months > max ? months : max;

    return {
      min: newMin,
      max: newMax,
    };
  }, {});

  return { monthsBetween: range };
};

const getPostIdsQuery = (sellers) => ({
  postIds: sellers.map(({ postId }) => postId),
});

export class GetAllSellers extends Operation {
  static constraints = {
    state: { inclusion: states },
    first_name: {},
  };

  async execute(query = {}) {
    const { SUCCESS, ERROR, VALIDATION_ERROR } = this.outputs;
    const {
      repositories: {
        Seller: sellerRepo,
        Post: postRepo,
        SeniorityType: seniorityTypeRepo,
      },
      entities: { SellerService },
    } = this;

    try {
      const sellers = await sellerRepo.find(query);
      const [posts, seniorityTypes] = await Promise.all([
        postRepo.find(getPostIdsQuery(sellers)),
        seniorityTypeRepo.find(getMonthsRangeQuery(sellers)),
      ]);

      this.emit(SUCCESS, { sellers, posts, seniorityTypes });
    } catch (error) {
      if (error.message === 'ValidationError') {
        return this.emit(VALIDATION_ERROR, error);
      }

      this.emit(ERROR, error);
    }
  }
}

GetAllSellers.setOutputs(['SUCCESS', 'ERROR', 'VALIDATION_ERROR']);
