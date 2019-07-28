import * as commonPlugins from './plugins';
import { embedToModel } from './_lib';

const modelLoader = ({ models, database, modelsPlugins }) => {
  const modelsListNames = Object.keys(models);

  return modelsListNames.map((modelName) => {
    const Model = models[modelName];
    embedToModel(Model, models);

    const modelPlugins = modelsPlugins[modelName];
    Model.use([...Object.values({ ...commonPlugins, ...modelPlugins })]);
    return database.register(Model);
  });
};

export default modelLoader;
