export const MetricType = (factory, { MetricType }) => {
  factory.define('metricType', MetricType, {
    name: factory.chance('word'),
    state: 'active',
  });
};
