import { toDTO, mapperTypes } from './mapper-types';

const { IDENTITY, CALLBACK, OBJECT, ARRAY } = mapperTypes;

const mapper = {
  oldAttr1: { type: IDENTITY, propName: 'new_attr1' },
  oldAttr2: {
    type: CALLBACK,
    propName: 'new_attr2',
    serialize: ({ value }) => value,
  },
  oldAttr3: {
    type: OBJECT,
    propName: 'new_attr3',
    serialize: {
      oldObjAttr1: { type: IDENTITY, propName: 'new_obj_attr1' },
      oldObjAttr2: {
        type: OBJECT,
        propName: 'new_obj_attr2',
        serialize: {
          oldAttr1: {
            type: CALLBACK,
            propName: 'new_obj_attr1',
            serialize: ({ oldValue }) => oldValue,
          },
        },
      },
      oldObjAttr3: {
        type: ARRAY,
        propName: 'new_obj_attr3',
        serialize: {
          oldAttr1: { type: IDENTITY, propName: 'new_attr1' },
          oldAttr2: {
            type: CALLBACK,
            propName: 'new_attr2',
            serialize: ({ value }) => value,
          },
        },
      },
    },
  },
};

const obj = {
  oldAttr1: undefined,
  oldAttr2: { value: 'new_value2' },
  oldAttr3: {
    oldObjAttr1: 'new_obj_value1',
    oldObjAttr2: {
      oldAttr1: { oldValue: undefined },
    },
    oldObjAttr3: [
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
  new_attr2: 'new_value2',
  new_attr3: {
    new_obj_attr1: 'new_obj_value1',
    new_obj_attr2: {
      new_obj_attr1: null,
    },
    new_obj_attr3: [
      {
        new_attr1: 'new_value1_1',
        new_attr2: 'new_value1_2',
      },
      {
        new_attr1: null,
        new_attr2: 'new_value2_2',
      },
      {
        new_attr1: 'new_value3_1',
        new_attr2: null,
      },
    ],
  },
};

describe('#nullify', () => {
  test('should return deep nullified obj', () => {
    expect(toDTO(obj, mapper)).toEqual(expectedObj);
  });
});
