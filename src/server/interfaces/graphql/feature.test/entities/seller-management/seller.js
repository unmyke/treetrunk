import uuidv4 from 'uuid/v4';

const getSellerData = (chance) => {
  const sellerId = uuidv4();
  const firstName = chance.first();
  const middleName = chance.name();
  const lastName = chance.name();
  const phone = chance.phone();
  const createdAt = new Date('2018-01-01');
  const state = 'new';

  const sellerData = {
    sellerId,
    firstName,
    middleName,
    lastName,
    phone,
    // appointments,
    createdAt,
    state,
  };
  return sellerData;
};
export default getSellerData;
