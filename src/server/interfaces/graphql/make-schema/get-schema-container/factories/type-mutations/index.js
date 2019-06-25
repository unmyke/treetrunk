import * as Seller from './seller';
import * as Post from './post';
import * as SeniorityType from './seniority-type';

const typesMutationFieldFactories = { Seller, Post, SeniorityType };

const typesFieldFactories = Object.entries(typesMutationFieldFactories).reduce(
  (prevTypeFieldsFactories, [typeName, fieldFactories]) => ({
    ...prevTypeFieldsFactories,
    ...Object.entries(fieldFactories).reduce(
      (prevFileds, [fieldName, field]) => ({
        ...prevFileds,
        [`${typeName}:${fieldName}`]: (ctx) => {
          const { utils: getMutationField } = ctx;

          return getMutationField({ typeName, field });
        },
      }),
      {
        [typeName]: (ctx) => {
          const { utils: getMutation } = ctx;

          return getMutation(typeName);
        },
      }
    ),
  }),
  {}
);
return typesFieldFactories;
