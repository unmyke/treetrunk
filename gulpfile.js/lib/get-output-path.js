const { resolve } = require('path');

module.exports = ({ stats, entry }) => {
  const { outputPath, assetsByChunkName } = stats.toJson();
  const scriptPath = Array.isArray(assetsByChunkName[entry])
    ? assetsByChunkName[entry][0]
    : assetsByChunkName[entry];
  return resolve(outputPath, scriptPath);
};
