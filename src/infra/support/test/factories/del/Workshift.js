export const Workshift = (factory, { Workshift }) => {
  factory.define('workshift', Workshift, {
    employeeId: factory.assoc('employee', 'id'),
    shopId: factory.assoc('shop', 'id'),
    state: 'active',
  });
};
