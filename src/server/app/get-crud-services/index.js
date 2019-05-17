import { CRUDS } from '@common';
import * as crudServices from './crud-services';
import getServiceName from '../get-crud-service-name';

const getCrudServices = (EntityName, { entities, commonTypes, repositories }) =>
  Object.values(CRUDS).reduce((prevServices, crudName) => {
    const crudServiceGererator = crudServices[crudName];
    const crudService =
      crudServiceGererator &&
      crudServiceGererator(EntityName)({
        entities,
        commonTypes,
        repositories,
      });

    return {
      ...prevServices,
      [getServiceName(EntityName, crudName)]: crudService,
    };
  }, {});

export default getCrudServices;
