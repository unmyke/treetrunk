const getNode = (
  _,
  {
    input: {
      cursor: { typeName, id },
    },
  },
  {
    dataSources: {
      services: { [`get${typeName}`]: getById },
    },
    serializers: { [typeName]: serializer },
  }
) => getById(id).then(serializer);
export default getNode;
