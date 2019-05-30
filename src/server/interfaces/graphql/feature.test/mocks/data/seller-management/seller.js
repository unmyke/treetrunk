import uuidv4 from 'uuid/v4';

const getSellerData = (chance) => {
  const sellerId = uuidv4();
  const firstName = chance.first();
  const middleName = chance.name();
  const lastName = chance.name();
  const phone = chance.phone();
  const appointments = [
    {
      postId: uuidv4(),
      day: new Date('2018-01-02'),
    },
    {
      postId: uuidv4(),
      day: new Date('2018-01-03'),
    },
  ];
  const createdAt = new Date('2018-01-01');
  const state = 'recruited';

  const sellerData = {
    sellerId,
    firstName,
    middleName,
    lastName,
    phone,
    appointments,
    createdAt,
    state,
  };
  return sellerData;
};
export default getSellerData;
