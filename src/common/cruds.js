import plurilize from 'pluralize';

const CRUDS = {
  GET: {
    name: 'get',
    getOperationName: (EntityName) => `get${EntityName}`,
  },
  GET_LIST: {
    name: 'getList',
    getOperationName: (EntityName) => `get${plurilize(EntityName)}List`,
  },
  CREATE: {
    name: 'create',
    getOperationName: (EntityName) => `create${EntityName}`,
  },
  CREATE_MANY: {
    name: 'createMany',
    getOperationName: (EntityName) => `createMany${plurilize(EntityName)}`,
  },
  UPDATE: {
    name: 'update',
    getOperationName: (EntityName) => `update${EntityName}`,
  },
  UPDATE_MANY: {
    name: 'updateMany',
    getOperationName: (EntityName) => `updateMany${plurilize(EntityName)}`,
  },
  DELETE: {
    name: 'delete',
    getOperationName: (EntityName) => `delete${EntityName}`,
  },
  DELETE_MANY: {
    name: 'deleteMany',
    getOperationName: (EntityName) => `deleteMany${plurilize(EntityName)}`,
  },
};

export default CRUDS;
