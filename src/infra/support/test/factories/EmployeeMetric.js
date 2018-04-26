export const EmployeeMetric = (factory, { Metric }) => {
  factory.define('employeeMetric', Metric, {
    metricTypeId: factory.assoc('metricType', 'id'),
    EntityClass: 'Employee',
    entityId: factory.assoc('employee', 'id'),
    value: factory.chance('floating', { min: 0, max: 100, fixed: 2 }),
    startDate: factory.chance('date'),
    endDate: factory.chance('date'),
  });
};
