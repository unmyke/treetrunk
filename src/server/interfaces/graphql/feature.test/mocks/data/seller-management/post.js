import uuidv4 from 'uuid/v4';

const getPostData = (chance) => {
  const name = chance.word();
  const postId = uuidv4();
  const pieceRates = [
    {
      value: 2.5,
      day: new Date('2018-01-02'),
    },
    {
      value: 3,
      day: new Date('2018-01-03'),
    },
  ];
  const createdAt = new Date('2018-01-01');
  const state = 'active';

  const postData = {
    postId,
    name,
    pieceRates,
    createdAt,
    state,
  };
  return postData;
};
export default getPostData;
