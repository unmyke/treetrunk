const { parse, pack, merge } = require('./option-set-utils');

const optionSet1 = {
  test1: 'optionSet1 test1',
  test2: 'optionSet1 test2',
  presets: [
    [
      'preset1',
      { preset1Key1: 'preset1Key1Value', preset1Key2: 'preset1Key2Value' },
    ],
  ],
  plugins: [['plugin1', { plugin1Key1: 'plugin1Key1Value' }]],
};

const optionSet2 = {
  test1: 'optionSet2 test1',
  test3: 'optionSet2 test3',
  presets: [['preset1', { preset1Key3: 'preset1Key3Value' }], 'preset2'],
  plugins: [['plugin2', { plugin2Key1: 'plugin2Key1Value' }]],
};

const optionSet3 = {
  test1: 'optionSet3 test1',
  test4: 'optionSet3 test4',
  presets: [
    [
      'preset1',
      {
        preset1Key4: 'preset1Key4Value',
        preset1Key5: 'preset1Key5Value',
      },
    ],
    [
      'preset2',
      {
        preset2Key1: 'preset2Key1Value',
        preset2Key2: 'preset2Key2Value',
      },
    ],
  ],
  plugins: [
    ['plugin2', { plugin2Key2: 'plugin2Key2Value' }],
    ['plugin3', { plugin3Key1: 'plugin3Key1Value' }],
  ],
};

const parsedOptionSet1 = {
  test1: 'optionSet1 test1',
  test2: 'optionSet1 test2',
  presets: {
    name: 'presets',
    items: [
      {
        name: 'preset1',
        options: {
          preset1Key1: 'preset1Key1Value',
          preset1Key2: 'preset1Key2Value',
        },
      },
    ],
  },
  plugins: {
    name: 'plugins',
    items: [{ name: 'plugin1', options: { plugin1Key1: 'plugin1Key1Value' } }],
  },
};

const parsedOptionSet2 = {
  test1: 'optionSet2 test1',
  test3: 'optionSet2 test3',
  presets: {
    name: 'presets',
    items: [
      { name: 'preset1', options: { preset1Key3: 'preset1Key3Value' } },
      { name: 'preset2', options: {} },
    ],
  },
  plugins: {
    name: 'plugins',
    items: [{ name: 'plugin2', options: { plugin2Key1: 'plugin2Key1Value' } }],
  },
};

const parsedOptionSet3 = {
  test1: 'optionSet3 test1',
  test4: 'optionSet3 test4',
  presets: {
    name: 'presets',
    items: [
      {
        name: 'preset1',
        options: {
          preset1Key4: 'preset1Key4Value',
          preset1Key5: 'preset1Key5Value',
        },
      },
      {
        name: 'preset2',
        options: {
          preset2Key1: 'preset2Key1Value',
          preset2Key2: 'preset2Key2Value',
        },
      },
    ],
  },
  plugins: {
    name: 'plugins',
    items: [
      { name: 'plugin2', options: { plugin2Key2: 'plugin2Key2Value' } },
      { name: 'plugin3', options: { plugin3Key1: 'plugin3Key1Value' } },
    ],
  },
};

const mergedOptionSet = {
  test1: 'optionSet3 test1',
  test2: 'optionSet1 test2',
  test3: 'optionSet2 test3',
  test4: 'optionSet3 test4',
  presets: [
    [
      'preset1',
      {
        preset1Key1: 'preset1Key1Value',
        preset1Key2: 'preset1Key2Value',
        preset1Key4: 'preset1Key4Value',
        preset1Key3: 'preset1Key3Value',
        preset1Key5: 'preset1Key5Value',
      },
    ],
    [
      'preset2',
      {
        preset2Key1: 'preset2Key1Value',
        preset2Key2: 'preset2Key2Value',
      },
    ],
  ],
  plugins: [
    ['plugin1', { plugin1Key1: 'plugin1Key1Value' }],
    [
      'plugin2',
      { plugin2Key1: 'plugin2Key1Value', plugin2Key2: 'plugin2Key2Value' },
    ],
    ['plugin3', { plugin3Key1: 'plugin3Key1Value' }],
  ],
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
        name: 'preset1',
        options: {
          preset1Key1: 'preset1Key1Value',
          preset1Key2: 'preset1Key2Value',
          preset1Key4: 'preset1Key4Value',
          preset1Key3: 'preset1Key3Value',
          preset1Key5: 'preset1Key5Value',
        },
      },
      {
        name: 'preset2',
        options: {
          preset2Key1: 'preset2Key1Value',
          preset2Key2: 'preset2Key2Value',
        },
      },
    ],
  },
  plugins: {
    name: 'plugins',
    items: [
      { name: 'plugin1', options: { plugin1Key1: 'plugin1Key1Value' } },
      {
        name: 'plugin2',
        options: {
          plugin2Key1: 'plugin2Key1Value',
          plugin2Key2: 'plugin2Key2Value',
        },
      },
      { name: 'plugin3', options: { plugin3Key1: 'plugin3Key1Value' } },
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
    expect(pack(parse(mergedOptionSet))).not.toBe(mergedOptionSet);
  });
});

describe('#pack and parse', () => {
  test('option set 1', () => {
    expect(parse(pack(parsedOptionSet1))).toEqual(parsedOptionSet1);
    expect(parse(pack(parsedOptionSet1))).not.toBe(parsedOptionSet1);
  });
  test('option set 2', () => {
    expect(parse(pack(parsedOptionSet2))).toEqual(parsedOptionSet2);
    expect(parse(pack(parsedOptionSet2))).not.toBe(parsedOptionSet2);
  });
  test('option set 3', () => {
    expect(parse(pack(parsedOptionSet3))).toEqual(parsedOptionSet3);
    expect(parse(pack(parsedOptionSet3))).not.toBe(parsedOptionSet3);
  });
  test('merged option set', () => {
    expect(parse(pack(mergedParsedOptionSet))).toEqual(mergedParsedOptionSet);
    expect(parse(pack(mergedParsedOptionSet))).not.toBe(mergedParsedOptionSet);
  });
});

describe('#merge', () => {
  test('all', () => {
    expect(merge(parsedOptionSet1, parsedOptionSet2, parsedOptionSet3)).toEqual(
      mergedParsedOptionSet
    );
  });
  test('presets', () => {
    expect(
      merge(parsedOptionSet1, parsedOptionSet2, parsedOptionSet3).presets
    ).toEqual(mergedParsedOptionSet.presets);
  });
  test('plugins', () => {
    expect(
      merge(parsedOptionSet1, parsedOptionSet2, parsedOptionSet3).plugins
    ).toEqual(mergedParsedOptionSet.plugins);
  });
});
