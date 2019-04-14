import BaseRepository from './base';

const SeniorityTypeRepository = ({ Model, mapper }) => {
  const baseRepo = BaseRepository({ Model, mapper });

  return Object.freeze({
    ...baseRepo,
  });
};

export default SeniorityTypeRepository;
