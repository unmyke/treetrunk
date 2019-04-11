const {
  targets: { SERVER, CLIENT },
  configs: { API, WEB, DATABASE, LOGGING }
} = require("./types");

module.exports = {
  [SERVER]: [API, WEB, DATABASE, LOGGING],
  [CLIENT]: [API, WEB]
};
