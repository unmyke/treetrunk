import checks from './checks';

async function haveSeller(
  res,
  { getSeller, getPost, getPostsList, getSeniorityTypeByMonths }
) {
  expect(getSeller).toBeCalledTimes(1);
  expect(getPost).toBeCalledTimes(3);
  expect(getPostsList).toBeCalledTimes(1);
  expect(getSeniorityTypeByMonths).toBeCalledTimes(1);

  const [
    {
      data: { seller },
    },
    mockSeller,
    mockSeniorityType,
    mockPostsList,
  ] = await Promise.all([
    res,
    getSeller.mock.results[0].value,
    getSeniorityTypeByMonths.mock.results[0].value,
    getPostsList.mock.results[0].value,
  ]);

  const mockPosts = await Promise.all(
    getPost.mock.results.map(({ value }) => value)
  );

  const includes = {
    mockPosts,
    mockPostsList,
    mockSeniorityType,
  };

  return await checks.seller(seller, mockSeller, includes);
}

export default haveSeller;
