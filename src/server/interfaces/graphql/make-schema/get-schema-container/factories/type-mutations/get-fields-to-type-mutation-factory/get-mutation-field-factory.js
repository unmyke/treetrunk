import { extendType } from 'nexus';

const getMutationFieldFactory = (ctx) => ({ root, mutation: getMutation }) => {
  const { name, ...config } = getMutation(ctx);

  return extendType({
    type: root.name,
    definition: (t) => {
      t.field(name, config);
    },
  });
};
export default getMutationFieldFactory;
