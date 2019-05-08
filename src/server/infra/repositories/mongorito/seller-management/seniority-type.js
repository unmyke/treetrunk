import BaseRepository from './base';

const SeniorityTypeRepository = ({ Model, mapper, errors }) => {
  const baseRepo = BaseRepository({ Model, mapper, errors });
  const getAllBetweenMonths = ({ min, max }) =>
    Model.getAllBetweenMonths({ min, max }).then(
      (seniorityTypesBeteenMonths) => {
        console.log(
          seniorityTypesBeteenMonths.map((seniorityType) =>
            mapper.toEntity(seniorityType.get())
          )
        );
        return seniorityTypesBeteenMonths.map((seniorityType) =>
          mapper.toEntity(seniorityType.get())
        );
      }
    );

  const getByMonths = (months) =>
    getAllBetweenMonths({ min: months, max: months });

  return Object.freeze({
    ...baseRepo,
    getAllBetweenMonths,
    getByMonths,
  });
};

export default SeniorityTypeRepository;
