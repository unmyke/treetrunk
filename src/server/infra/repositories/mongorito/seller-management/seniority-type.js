import BaseRepository from './base';

const SeniorityTypeRepository = ({ Model, mapper, errors }) => {
  const baseRepo = BaseRepository({ Model, mapper, errors });

  return Object.freeze({
    ...baseRepo,
  });
};

export default SeniorityTypeRepository;
