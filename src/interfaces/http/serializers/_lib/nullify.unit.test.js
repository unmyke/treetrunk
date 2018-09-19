import { nullify } from './nullify';

const obj = {
  inObj1: 'inObj1',
  inObj2: undefined,
  arrInObj: [
    {
      inArrTest1: undefined,
      inArrTest2: 'inArrTest2',
      inArrObj: { inArrTest1: 'inArrTest1', inArrTest2: undefined },
    },
    {
      inArrTest1: 'inArrTest1',
      inArrTest2: undefined,
      arrInArr: [
        {
          inObj1: undefined,
          inObj2: 'inObj2',
        },
        {
          inObj1: [
            {
              inObj1: undefined,
              inObj2: 'inObj2',
            },
          ],
          inObj2: 'inObj2',
        },
      ],
    },
  ],
  objInObj: {
    inObj1: undefined,
    inObj2: 'inObj2',
    inObjArr: [
      {
        inObj1: undefined,
        inObj2: 'inObj2',
      },
    ],
  },
};

const expectedObj = {
  inObj1: 'inObj1',
  inObj2: null,
  arrInObj: [
    {
      inArrTest1: null,
      inArrTest2: 'inArrTest2',
      inArrObj: { inArrTest1: 'inArrTest1', inArrTest2: null },
    },
    {
      inArrTest1: 'inArrTest1',
      inArrTest2: null,
      arrInArr: [
        {
          inObj1: null,
          inObj2: 'inObj2',
        },
        {
          inObj1: [
            {
              inObj1: null,
              inObj2: 'inObj2',
            },
          ],
          inObj2: 'inObj2',
        },
      ],
    },
  ],
  objInObj: {
    inObj1: null,
    inObj2: 'inObj2',
    inObjArr: [
      {
        inObj1: null,
        inObj2: 'inObj2',
      },
    ],
  },
};

describe('#nullify', () => {
  test('should return deep nullified obj', () => {
    expect(nullify(obj)).toEqual(expectedObj);
  });
});
