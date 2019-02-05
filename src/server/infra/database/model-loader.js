const embedToModel = (model, models) => {
  if (model.toEmbed) {
    model.toEmbed.forEach(({ path, modelName }) => {
      model.embeds(path, models[modelName]);
    });
  }
};

const modelLoader = (models, db) => {
  const modelNames = Object.keys(models);

  modelNames.forEach((modelName) => {
    const model = models[modelName];
    db.register(model);
    embedToModel(model, models);
  });

  return models;
};

export default modelLoader;
