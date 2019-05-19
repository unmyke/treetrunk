import { makeAddStaticMethodPlugin } from '../_lib';

const uniquenessCheck = (Model) => ({ id, idPropName, fields }) => {
  const uniquenessCheckQuery = Model.uniquenessCheckQuery(fields);

  return (id
    ? uniquenessCheckQuery.where(idPropName).ne(id)
    : uniquenessCheckQuery
  )
    .count()
    .then((existingModelsCount) => {
      if (existingModelsCount !== 0) throw Model.errors.modelAlreadyExists();
    });
};

export default makeAddStaticMethodPlugin(uniquenessCheck);
