const embedToModel = (model, models) => {
  if (model.toEmbed) {
    model.toEmbed.forEach(({ path, modelName }) => {
      model.embeds(path, models[modelName]);
    });
  }
};

export default embedToModel;
