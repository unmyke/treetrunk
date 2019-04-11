const { parse, pack, merge } = require("./option-set-utils");

module.exports = (...rawOptionSets) => pack(merge(...rawOptionSets.map(parse)));
