import BaseRepository from './base';

const SellerRepository = ({ Model, mapper }) => {
  const baseRepo = BaseRepository({ Model, mapper });

  return Object.freeze({
    ...baseRepo,
  });
};

export default SellerRepository;
