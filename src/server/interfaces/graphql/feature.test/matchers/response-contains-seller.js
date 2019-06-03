async (res, mockServices) => {
  const { data, errors } = res;

  if (errors.length) return {};

  const { getSeller, getPost, getPostsList, getSeniorityType } = mockServices;
  const seller = await getSeller;
};
