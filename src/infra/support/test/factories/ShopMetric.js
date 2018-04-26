export const ShopMetric = (factory, { Metric }) => {
  factory.define('shopMetric', Metric, {
    metricTypeId: factory.assoc('metricType', 'id'),
    EntityClass: 'Shop',
    entityId: factory.assoc('shop', 'id'),
    value: factory.chance('floating', { min: 0, max: 100, fixed: 2 }),
    startDate: factory.chance('date'),
    endDate: factory.chance('date'),
  });
};
