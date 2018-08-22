import { DataTypes } from 'sequelize';
import {
  getSubdomainsContainer,
  forEachSubdomain,
} from '../support/containerHelpers';

export const ModelsLoader = {
  load({ sequelize, subdomains }) {
    const loaded = {};
    // loaded.models = {};

    loaded.models = getSubdomainsContainer(subdomains, (model) =>
      model(sequelize, DataTypes)
    );

    forEachSubdomain(
      loaded.models,
      loaded.models,
      (model, container, SubdomainName, EntiyName) => {
        if (model.associate) {
          model.associate(container[SubdomainName]);
        }
      }
    );

    loaded.database = sequelize;

    return loaded;
  },
};
