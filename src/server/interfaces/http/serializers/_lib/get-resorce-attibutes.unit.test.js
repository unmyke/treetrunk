import { Serializer } from 'jsonapi-serializer';
import { inspect } from 'util';
import { getResorceAttibutes } from './get-resorce-attibutes';
import mapperTypes from './mapper-types';

const { IDENTITY, CALLBACK, OBJECT, ARRAY } = mapperTypes;

const mapper = {
  oldId: { type: IDENTITY, attrName: 'id' },
  oldAttr1: { type: IDENTITY, attrName: 'new_attr1' },
  oldAttr2: {
    type: CALLBACK,
    attrName: 'new_attr2',
    serialize: ({ value }) => value,
  },
  oldAttr3: {
    type: OBJECT,
    attrName: 'new_attr3',
    serialize: {
      oldObjAttr1: { type: IDENTITY, attrName: 'new_obj_attr1' },
      oldObjAttr2: {
        type: OBJECT,
        attrName: 'new_obj_attr2',
        serialize: {
          oldAttr1: {
            type: CALLBACK,
            attrName: 'new_obj_attr1',
            serialize: ({ oldValue }) => oldValue,
          },
        },
      },
      oldObjAttr3: {
        type: ARRAY,
        attrName: 'new_obj_attr3',
        serialize: {
          oldAttr1: { type: IDENTITY, attrName: 'new_attr1' },
          oldAttr2: {
            type: CALLBACK,
            attrName: 'new_attr2',
            serialize: ({ value }) => value,
          },
        },
      },
    },
  },
};

const expectedAttrs = {
  attributes: ['id', 'new_attr1', 'new_attr2', 'new_attr3'],
  new_attr3: {
    attributes: ['new_obj_attr1', 'new_obj_attr2', 'new_obj_attr3'],
    new_obj_attr2: {
      attributes: ['new_obj_attr1'],
    },
    new_obj_attr3: {
      attributes: ['new_attr1', 'new_attr2'],
    },
  },
};

describe('#getResorceAttibutes', () => {
  test('should return deep nullified obj', () => {
    expect(getResorceAttibutes(mapper)).toEqual(expectedAttrs);
  });
});

const expectedObj = {
  id: 1,
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

const serializer = new Serializer('test', {
  ...getResorceAttibutes(mapper),
  keyForAttribute: 'snake_case',
});
console.log(
  inspect(serializer.serialize(expectedObj), { showHidden: false, depth: null })
);

// const expectedAttrs1 = {
//   attributes: ['new_attr1', 'new_attr2', 'new_attr3'],
//   new_attr3: {
//     attributes: ['obj_attr1', 'obj_attr2'],
//   },
// };

// const expectedObj1 = {
//   new_attr1: null,
//   new_attr2: 'new_value2',
//   new_attr3: {
//     obj_attr1: null,
//     obj_attr2: 'obj_value2',
//   },
// };

// const serializer1 = new Serializer('test', {
//   ...expectedAttrs1,
//   keyForAttribute: 'underscore_case',
// });
// console.log(serializer1.serialize(expectedObj1));
