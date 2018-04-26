import fs from 'fs';
import path from 'path';
import appInitilizer from './initialize';

export const ModelsLoader = {
  load({ sequelize, baseFolder, DataTypes }) {
    const loaded = {};
    loaded.models = {};

    fs
      .readdirSync(baseFolder)
      .filter((file) => {
        return !file.includes('.js');
      })
      .forEach((subdomainName) => {
        console.log(path.join(baseFolder, subdomainName));
        const subdomainModels = require(path.join(baseFolder, subdomainName));
        Object.keys(subdomainModels).forEach((modelName) => {
          const model = subdomainModels[modelName](sequelize, DataTypes);
          loaded.models[modelName] = model;
        });
      });
    Object.keys(loaded.models).forEach((modelName) => {
      if (loaded.models[modelName].associate) {
        loaded.models[modelName].associate(loaded.models);
      }
    });

    loaded.database = sequelize;

    return loaded;
  },
};
