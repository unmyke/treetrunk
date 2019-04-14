const _ = require('lodash/fp');

const parse = ({
  presets: rawPresets = [],
  plugins: rawPlugins = [],
  ...options
}) => {
  const parseItem = (item) => {
    const { name, options } = Array.isArray(item)
      ? { name: item[0], options: item[1] }
      : { name: item, options: {} };

    if (
      typeof name !== 'string' ||
      !(options instanceof Object) ||
      (Array.isArray(item) && item.length > 2)
    ) {
      console.log('name', name);
      console.log('item', item.length);
      throw new Error(
        `Option ${item} has incorrect format. Must be 'string' or ['string', { ...option }]`
      );
    }

    return {
      name,
      options,
    };
  };

  const getList = (rawList, name) => ({
    name,
    items: rawList.map(parseItem),
  });

  const presets = getList(rawPresets, 'presets');
  const plugins = getList(rawPlugins, 'plugins');

  return {
    ...options,
    presets,
    plugins,
  };
};

const pack = ({
  presets: parsedPresets = { name: 'presets', items: [] },
  plugins: parsedPlugins = { name: 'plugins', items: [] },
  ...options
}) => {
  const packItem = ({ name, options }) =>
    Object.keys(options).length === 0 ? name : [name, options];

  const getList = ({ name, items }) =>
    items.length ? { [name]: items.map(packItem) } : {};

  return {
    ...options,
    ...getList(parsedPresets),
    ...getList(parsedPlugins),
  };
};

const merge = (...rawOptionSets) => {
  const mergeList = (target, source) =>
    Array.isArray(target)
      ? _.unionBy(_.property('name'))(
          _.map(({ name, options }) => {
            const sourceItem = _.find(
              ({ name: sourceName }) => sourceName === name
            )(source);
            return sourceItem
              ? { name, options: _.merge(options, sourceItem.options) }
              : { name, options };
          })(target),
          source
        )
      : undefined;

  return _.reduce((prevOptionSet, currentOptionSet) =>
    _.mergeWith(mergeList)(prevOptionSet, currentOptionSet)
  )({}, rawOptionSets);
};

module.exports = {
  parse,
  pack,
  merge,
};
