import plugins from './plugins';

const embedToModel = (model, models) => {
  if (model.toEmbed) {
    model.toEmbed.forEach(({ path, modelName }) => {
      model.embeds(path, models[modelName]);
    });
  }
};

const modelLoader = (models, database) => {
  const modelsList = Object.values(models);

  return modelsList.map((model) => {
    embedToModel(model, models);
    model.use(plugins);
    return database.register(model);
  });
};

export default modelLoader;
