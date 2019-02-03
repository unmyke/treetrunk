/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

module.exports = ({ configName, mode }) => require(`./${configName}/${mode}`);
