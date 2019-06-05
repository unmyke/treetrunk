import checks from './checks';

async function haveSeller(
  res,
  { getSeller, getPost, getPostsList, getSeniorityType }
) {
  expect(getSeller).toBeCalledTimes(1);
  expect(getPost).toBeCalledTimes(3);
  expect(getPostsList).toBeCalledTimes(1);
  expect(getSeniorityType).toBeCalledTimes(1);

  const [
    seller,
    mockSeller,
    mockSeniorityType,
    mockPostsList,
  ] = await Promise.all([
    res,
    getSeller.mock.results[0].value,
    getSeniorityType.mock.results[0].value,
    getPostsList.mock.results[0].value,
  ]);

  const mockPosts = await Promise.all(
    mockSeller.getPost.mock.results.map(({ value }) => value)
  );

  const includes = {
    mockPosts,
    mockPostsList,
    mockSeniorityType,
  };

  return await checks.Seller(seller, mockSeller, includes);
}

export default haveSeller;
