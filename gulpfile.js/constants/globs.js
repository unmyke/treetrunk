const {
  globs: { NODE, REACT }
} = require("./types");

module.exports = {
  [NODE]: "**/*.js",
  [REACT]: "**/*.js?x"
};
