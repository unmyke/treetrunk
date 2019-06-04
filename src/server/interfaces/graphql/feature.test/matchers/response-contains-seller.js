async function responseContainsSeller(res, { id, mockServices }) {
  const { data } = res;

  const { getSeller, getPost, getPostsList, getSeniorityType } = mockServices;
  const seller = await getSeller;
}

export default responseContainsSeller;
