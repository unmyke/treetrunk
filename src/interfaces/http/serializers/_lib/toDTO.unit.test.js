import { toDTO } from './toDTO';

const mapper = {
  oldAttr1: { propName: 'new_attr1' },
  oldAttr2: { propName: 'new_attr2', serialize: ({ value }) => value },
  oldAttr2: {
    propName: 'new_attr2',
    serialize: {
      oldObjAttr1: { propName: 'new_obj_attr1' },
      oldObjAttr2: {
        propName: 'new_obj_attr2',
        serialize: {
          oldAttr1: {
            propName: 'new_obj_attr1',
            serialize: ({ oldValue }) => oldValue,
          },
        },
      },
      oldObjAttr2: {
        propName: 'new_obj_attr2',
        serialize: [
          {
            oldAttr1: { propName: 'new_attr1' },
            oldAttr2: {
              propName: 'new_attr2',
              serialize: ({ value }) => value,
            },
          },
        ],
      },
    },
  },
};

const obj = {
  oldAttr1: undefined,
  oldAttr2: { value: 'new_value2' },
  oldAttr2: {
    oldObjAttr1: 'new_obj_value1',
    oldObjAttr2: {
      oldAttr1: { oldValue: undefined },
    },
    oldObjAttr2: [
      {
        oldAttr1: 'new_value1_1',
        oldAttr2: { value: 'new_value1_2' },
      },
      {
        oldAttr1: undefined,
        oldAttr2: { value: 'new_value2_2' },
      },
      {
        oldAttr1: 'new_value3_1',
        oldAttr2: { value: undefined },
      },
    ],
  },
};

const expectedObj = {
  new_attr1: null,
  new_attr2: { value: 'new_value2' },
  new_attr2: {
    new_obj_attr1: 'new_obj_value1',
    new_obj_attr2: {
      new_attr1: { new_value: null },
    },
    new_obj_attr2: [
      {
        new_attr1: 'new_value1_1',
        new_attr2: { value: 'new_value1_2' },
      },
      {
        new_attr1: null,
        new_attr2: { value: 'new_value2_2' },
      },
      {
        new_attr1: 'new_value3_1',
        new_attr2: { value: null },
      },
    ],
  },
};

describe('#nullify', () => {
  test('should return deep nullified obj', () => {
    expect(toDTO(obj, mapper)).toEqual(expectedObj);
  });
});
