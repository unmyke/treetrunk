export const EmployeeAppointment = (factory, { Appointment }) => {
  factory.define('employeeAppointment', Appointment, {
    EntityClass: 'Employee',
    entityId: factory.assoc('employee', 'id'),
    EntityTypeClass: 'Post',
    entityTypeId: factory.assoc('post', 'id'),
    date: factory.chance('date'),
    state: 'active',
  });
};
