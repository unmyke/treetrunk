const contexts = [
  { name: 'if pass corrent id', test: returnFullSeller },
  {
    name: 'if pass nonexistent seller id',
    test: returnNullWithSellerNotFoundError,
  },
  {
    name: 'if where is no post with postId equals seller.postId',
    test: returnSellerWithPostNotFoundError,
  },
  {
    name: 'if where is no post with postId in seller.postIds',
    test: returnSellerWithAnotherPostNotFoundError,
  },
  {
    name:
      'if where is no seniorityType with seniorityTypeId corresponding seller.months',
    test: returnSellerWithSeniorityTypeNotFoundError,
  },
];

export default (opts) =>
  contexts.map(({ name, test }) => contextRunner({ name, test, opts }));
