import BaseModel from './base-model';

export default class Post extends BaseModel {}

const extendPost = (Post) => {
  Post.textFilterFields = function textFilterFields() {
    return ['name'];
  };
};

Post.use(extendPost);
