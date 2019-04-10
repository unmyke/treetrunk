const { parse, pack, merge } = require('./option-set-utils');

const optionSet1 = {
  test1: 'optionSet1 test1',
  test2: 'optionSet1 test2',
  presets: [['@babel/preset-env', { loose: true, useBuiltIns: 'usage' }]],
  plugins: ['@babel/plugin-proposal-class-properties'],
};

const optionSet2 = {
  test1: 'optionSet2 test1',
  test3: 'optionSet2 test3',
  presets: [['@babel/preset-env', { forceAllTransforms: true }]],
};

const optionSet3 = {
  test1: 'optionSet3 test1',
  test4: 'optionSet3 test4',
  presets: [
    [
      '@babel/preset-env',
      {
        targets: { node: true },
        modules: 'auto',
      },
    ],
  ],
};

const parsedOptionSet1 = {
  test1: 'optionSet1 test1',
  test2: 'optionSet1 test2',
  presets: {
    name: 'presets',
    items: [
      {
        name: '@babel/preset-env',
        options: { loose: true, useBuiltIns: 'usage' },
      },
    ],
  },
  plugins: {
    name: 'plugins',
    items: [{ name: '@babel/plugin-proposal-class-properties', options: {} }],
  },
};

const parsedOptionSet2 = {
  test1: 'optionSet2 test1',
  test3: 'optionSet2 test3',
  presets: {
    name: 'presets',
    items: [
      { name: '@babel/preset-env', options: { forceAllTransforms: true } },
    ],
  },
  plugins: { name: 'plugins', items: [] },
};

const parsedOptionSet3 = {
  test1: 'optionSet3 test1',
  test4: 'optionSet3 test4',
  presets: {
    name: 'presets',
    items: [
      {
        name: '@babel/preset-env',
        options: {
          targets: { node: true },
          modules: 'auto',
        },
      },
    ],
  },
  plugins: {
    name: 'plugins',
    items: [],
  },
};

const mergedOptionSet = {
  test1: 'optionSet3 test1',
  test2: 'optionSet1 test2',
  test3: 'optionSet2 test3',
  test4: 'optionSet3 test4',
  presets: [
    [
      '@babel/preset-env',
      {
        loose: true,
        useBuiltIns: 'usage',
        targets: { node: true },
        forceAllTransforms: true,
        modules: 'auto',
      },
    ],
  ],
  plugins: ['@babel/plugin-proposal-class-properties'],
};

const mergedParsedOptionSet = {
  test1: 'optionSet3 test1',
  test2: 'optionSet1 test2',
  test3: 'optionSet2 test3',
  test4: 'optionSet3 test4',
  presets: {
    name: 'presets',
    items: [
      {
        name: '@babel/preset-env',
        options: {
          loose: true,
          useBuiltIns: 'usage',
          targets: { node: true },
          forceAllTransforms: true,
          modules: 'auto',
        },
      },
    ],
  },
  plugins: {
    name: 'plugins',
    items: [
      {
        name: '@babel/plugin-proposal-class-properties',
        options: {},
      },
    ],
  },
};

describe('#parse', () => {
  test('option set 1', () => {
    expect(parse(optionSet1)).toEqual(parsedOptionSet1);
  });
  test('option set 2', () => {
    expect(parse(optionSet2)).toEqual(parsedOptionSet2);
  });
  test('option set 3', () => {
    expect(parse(optionSet3)).toEqual(parsedOptionSet3);
  });
  test('merged option set', () => {
    expect(parse(mergedOptionSet)).toEqual(mergedParsedOptionSet);
  });
});

describe('#pack', () => {
  test('option set 1', () => {
    expect(pack(parsedOptionSet1)).toEqual(optionSet1);
  });
  test('option set 2', () => {
    expect(pack(parsedOptionSet2)).toEqual(optionSet2);
  });
  test('option set 3', () => {
    expect(pack(parsedOptionSet3)).toEqual(optionSet3);
  });
  test('merged option set', () => {
    expect(pack(mergedParsedOptionSet)).toEqual(mergedOptionSet);
  });
});

describe('#parse and pack', () => {
  test('option set 1', () => {
    expect(pack(parse(optionSet1))).toEqual(optionSet1);
    expect(pack(parse(optionSet1))).not.toBe(optionSet1);
  });
  test('option set 2', () => {
    expect(pack(parse(optionSet2))).toEqual(optionSet2);
    expect(pack(parse(optionSet2))).not.toBe(optionSet2);
  });
  test('option set 3', () => {
    expect(pack(parse(optionSet3))).toEqual(optionSet3);
    expect(pack(parse(optionSet3))).not.toBe(optionSet3);
  });
  test('merged option set', () => {
    expect(pack(parse(mergedOptionSet))).toEqual(mergedOptionSet);
  });
});

describe('#merge', () => {
  test('option set', () => {
    expect(merge(optionSet1, optionSet2, optionSet3)).toEqual(
      mergedParsedOptionSet
    );
  });
  test('option set', () => {
    expect(pack(merge(optionSet1, optionSet2, optionSet3))).toEqual(
      mergedOptionSet
    );
  });
});
