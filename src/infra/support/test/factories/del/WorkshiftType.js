export const WorkshiftType = (factory, { WorkshiftType }) => {
  factory.define('workshiftType', WorkshiftType, {
    name: factory.chance('word'),
    state: 'active',
  });
};
