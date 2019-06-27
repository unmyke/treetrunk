const getRestoreTypeMutationField = (ctx) => {
  const {
    args: { id: args },
    utils: { getMutationField },
  } = ctx;

  return (type) => {
    const restoreTypeMutationField = getMutationField(
      {
        name: 'restore',
        type,
        description: `Restore ${type.name}`,
        args,
        resovle: () => {},
      },
      type
    );
    return restoreTypeMutationField;
  };
};
export default getRestoreTypeMutationField;
