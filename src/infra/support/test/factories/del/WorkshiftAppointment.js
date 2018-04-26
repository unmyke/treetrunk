export const WorkshiftAppointment = (factory, { Appointment }) => {
  factory.define('workshiftAppointment', Appointment, {
    EntityClass: 'Workshift',
    entityId: factory.assoc('workshift', 'id'),
    EntityTypeClass: 'WorkshiftType',
    entityTypeId: factory.assoc('workshiftType', 'id'),
    date: factory.chance('date'),
    state: 'active',
  });
};
