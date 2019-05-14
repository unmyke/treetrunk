import BaseRepository from '../base';

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
    Model.getByMonths(months).then((seniorityType) =>
      seniorityType ? mapper.toEntity(seniorityType.get()) : null
    );

  return Object.freeze({
    ...baseRepo,
    getAllBetweenMonths,
    getByMonths,
  });
};

export default SeniorityTypeRepository;
