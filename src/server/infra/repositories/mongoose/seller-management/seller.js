import BaseRepository from './base';

const SellerRepository = ({ models }) => {
  const baseRepo = new BaseRepository({ models, modelName: 'Seller' });

  return Object.freeze({
    getById: baseRepo.getById,
    save: baseRepo.save,
  });
};

export default SellerRepository;
