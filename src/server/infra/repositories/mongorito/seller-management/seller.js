import BaseRepository from '../base';

const SellerRepository = ({ Model, mapper, errors }) => {
  const baseRepo = BaseRepository({ Model, mapper, errors });

  return Object.freeze({
    ...baseRepo,
  });
};

export default SellerRepository;
