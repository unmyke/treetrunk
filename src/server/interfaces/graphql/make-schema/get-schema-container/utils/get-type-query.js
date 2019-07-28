const getUpdateTypeMutationField = (ctx) => {
  const {
    utils: { getMutationField },
  } = ctx;

  return (type, { args, resolver }) => {
    const updateTypeMutationField = getMutationField(
      {
        name: 'update',
        type,
        description: `Update ${type.name}`,
        args,
        resovle: resolver,
      },
      type
    );
    return updateTypeMutationField;
  };
};
export default getUpdateTypeMutationField;
