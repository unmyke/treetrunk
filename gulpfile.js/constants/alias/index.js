const {
  targets: { SERVER, CLIENT }
} = require("../types");

module.exports = {
  [SERVER]: require(`./${SERVER}`),
  [CLIENT]: require(`./${CLIENT}`)
};
