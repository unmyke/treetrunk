import fs from 'fs';
import path from 'path';

export const loadFactories = ({ factoryGirl, baseFolder, models }) => {
  fs
    .readdirSync(baseFolder)
    .filter((file) => {
      return file.indexOf('.') !== 0 && file.slice(-3) === '.js';
    })
    .map((file) => file.split('.')[0])
    .forEach((file) => {
      const factoryPath = path.join(baseFolder, file);
      const { [file]: factory } = require(factoryPath);

      factory(factoryGirl, models);
    });

  return factoryGirl;
};
