import getArgs from './args';

const create = (ctx) => {
  const args = getArgs(ctx);

  return {
    name: 'create',
    description: 'Add post',
    args,
  };
};
export default create;
