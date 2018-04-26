export const WorkshiftMetric = (factory, { Metric }) => {
  factory.define('workshiftMetric', Metric, {
    metricTypeId: factory.assoc('metricType', 'id'),
    EntityClass: 'Workshift',
    entityId: factory.assoc('workshift', 'id'),
    value: factory.chance('floating', { min: 0, max: 100, fixed: 2 }),
    startDate: factory.chance('date'),
    endDate: factory.chance('date'),
  });
};
