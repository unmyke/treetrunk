const { webpackStatsOptions } = require('../constants');

module.exports = (stats, webpackStatsOption) => {
  console[webpackStatsOption](
    stats.toString(webpackStatsOptions[webpackStatsOption])
  );
};
