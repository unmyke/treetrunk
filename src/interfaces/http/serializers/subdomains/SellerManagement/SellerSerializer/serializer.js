const { inspect } = require('util');
const { Serializer } = require('jsonapi-serializer');

const optsResource = {
  attributes: ['id', 'simpleProp'],
};

const optsComplexResource = {
  attributes: ['array', 'simpleProp', 'resource'],
  array: {
    attributes: ['resource', 'simpleProp'],
    resource: {
      ...optsResource,
      ref: 'id',
    },
  },
  resource: {
    ...optsResource,
    ref: 'id',
  },
  keyForAttribute: 'snake_case',
};

const resource1 = {
  id: 'resource1',
  simpleProp: 'resource1SimpleProp',
};
const resource2 = {
  id: 'resource2',
  simpleProp: 'resource2SimpleProp',
};
const resource3 = {
  id: 'resource3',
  simpleProp: 'resource3SimpleProp',
};
const resource4 = {
  id: 'resource4',
  simpleProp: 'resource4SimpleProp',
};

const complexResource1 = {
  id: 'complexResource1',
  simpleProp: 'complexResource1SimpleProp',
  resource: resource1,
  array: [
    { resource: resource1, simpleProp: 'complexResource1ArrarySimpleResource' },
    { resource: resource3, simpleProp: 'complexResource1ArrarySimpleResource' },
    { resource: resource4, simpleProp: 'complexResource1ArrarySimpleResource' },
  ],
};

const complexResource2 = {
  id: 'complexResource2',
  simpleProp: 'complexResource2SimpleProp',
  resource: resource1,
  array: [
    { resource: resource1, simpleProp: 'complexResource2ArrarySimpleResource' },
    { resource: resource2, simpleProp: 'complexResource2ArrarySimpleResource' },
  ],
};

const complexResources = [complexResource1, complexResource2];

console.log(
  inspect(
    new Serializer('complexResource', optsComplexResource).serialize(
      complexResources
    ),
    { showHidden: false, depth: null }
  )
);
