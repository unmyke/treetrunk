import BaseRepository from './base';

// const SellerRepository = ({ models }) => {
//   const baseRepo = BaseRepository({ models, modelName: 'Seller' });

//   return Object.freeze({
//     getById: baseRepo.getById,
//     save: baseRepo.save,
//   });
// };

const SellerRepository = BaseRepository;

export default SellerRepository;
