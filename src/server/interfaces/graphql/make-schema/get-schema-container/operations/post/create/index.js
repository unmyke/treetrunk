import getArgs from './args';

const create = (ctx) => {
  const {
    utils: { getCrudMutation },
  } = ctx;
  const args = getArgs(ctx);

  return getCrudMutation('create', {
    description: 'Add post',
    args,
  });
};
export default create;
