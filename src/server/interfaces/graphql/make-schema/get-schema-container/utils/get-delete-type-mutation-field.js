const getDeleteTypeMutationField = (ctx) => {
  const {
    args: { id: args },
    utils: { getMutationField },
  } = ctx;

  return (type) => {
    const deleteTypeMutationField = getMutationField(
      {
        name: 'delete',
        type,
        description: `Delete ${type.name}`,
        args,
        resovle: () => {},
      },
      type
    );
    return deleteTypeMutationField;
  };
};
export default getDeleteTypeMutationField;
