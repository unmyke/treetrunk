const sellerMock = (
  id,
  { firstName, middleName, lastName, phone, createdAt } = {}
) => ({
  sellerId: id,
  firstName: firstName || `Firstname ${id}`,
  middleName: middleName || `Middlename ${id}`,
  lastName: lastName || `Lastname ${id}`,
  phone: phone || `+ 0 123 345-67-89 ${id}`,
  createdAt: new Date(createdAt || '2018-01-01'),
});
export default sellerMock;
