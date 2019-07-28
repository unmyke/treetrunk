import checks from './checks';

async function haveSeller(
  res,
  { getSeller, getPost, getPostsList, getSeniorityTypeByMonths }
) {
  expect(getSeller).toBeCalledTimes(1);
  expect(getPostsList).toBeCalledTimes(1);

  const [
    {
      data: { seller },
    },
    mockSeller,
    mockSeniorityType,
    mockPostsList,
    mockPosts,
  ] = await Promise.all([
    res,
    getSeller.mock.results[0].value,
    getSeniorityTypeByMonths.mock.results[0] &&
      getSeniorityTypeByMonths.mock.results[0].value,
    getPostsList.mock.results[0].value,
    Promise.all(getPost.mock.results.map(({ value }) => value)),
  ]);

  expect(getPost).toBeCalledTimes(seller.postIds.length);
  if (seller.seniority) {
    expect(getSeniorityTypeByMonths).toBeCalledTimes(1);
  } else {
    expect(getSeniorityTypeByMonths).toBeCalledTimes(0);
  }

  const includes = {
    mockPosts,
    mockPostsList,
    mockSeniorityType,
  };

  return await checks.seller(seller, mockSeller, includes);
}

export default haveSeller;
