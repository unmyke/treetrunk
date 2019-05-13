import getList from './get-list';

export default (Model) => {
  Model.getList = (query) => getList(Model, query);
};
