const { inspect } = require('util');
const { Serializer } = require('jsonapi-serializer');
const { normalize, schema } = require('normalizr');

const resourceSchema = new schema.Entity('resource');
const complexResourceSchema = new schema.Entity('resource', {
  array: [{ inResource: resourceSchema }],
  rootResource: resourceSchema,
});

const resourceJSONAPISerializerOpts = {
  attributes: ['id', 'simpleProp'],
};

const complexResourceJSONAPISerializerOpts = {
  attributes: ['array', 'simpleProp', 'rootResource'],
  array: {
    ref: 'id',
    // ignoreRelationshipData: 'true',
    attributes: ['inResource', 'simpleProp'],
    inResource: {
      ...resourceJSONAPISerializerOpts,
      ref: 'id',
    },
  },
  rootResource: {
    ...resourceJSONAPISerializerOpts,
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
  rootResource: resource1,
  array: [
    {
      id: 3,
      inResource: resource1,
      simpleProp: 'complexResource1ArrarySimpleResource1Prop',
    },
    {
      id: 4,
      inResource: resource3,
      simpleProp: 'complexResource1ArrarySimpleResource3Prop',
    },
    {
      id: 5,
      inResource: resource4,
      simpleProp: 'complexResource1ArrarySimpleResource4Prop',
    },
  ],
};

const complexResource2 = {
  id: 'complexResource2',
  simpleProp: 'complexResource2SimpleProp',
  rootResource: resource1,
  array: [
    {
      id: 1,
      inResource: resource1,
      simpleProp: 'complexResource2ArrarySimpleResource1Prop',
    },
    {
      id: 2,
      inResource: resource2,
      simpleProp: 'complexResource2ArrarySimpleResource2Prop',
    },
  ],
};

const complexResources = [complexResource1, complexResource2];

console.log(
  inspect(
    new Serializer(
      'complexResource',
      complexResourceJSONAPISerializerOpts
    ).serialize(complexResources),
    { showHidden: false, depth: null }
  )
);

console.log(
  inspect(normalize(complexResource1, complexResourceSchema), {
    showHidden: false,
    depth: null,
  })
);
