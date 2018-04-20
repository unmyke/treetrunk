import fs from 'fs';
import path from 'path';

export const ModelsLoader = {
  load({ sequelize, baseFolder, indexFile = 'index.js' }) {
    const loaded = {};
    loaded.models = {};

    fs
      .readdirSync(baseFolder)
      .filter((file) => {
        return (file.indexOf('.') !== 0) && (file !== indexFile) && (file.slice(-3) === '.js');
      })
      .forEach((file) => {
        const model = sequelize['import'](path.join(baseFolder, file));
        const modelName = file.split('.')[0];
        loaded.models[modelName] = model;
      });

    Object.keys(loaded.models).forEach((modelName) => {
      if(loaded.models[modelName].associate) {
        loaded.models[modelName].associate(loaded.models);
      }
    });

    loaded.database = sequelize;

    return loaded;
  }
};
