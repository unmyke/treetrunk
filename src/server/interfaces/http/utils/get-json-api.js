import { config } from 'config';
const {
  web: { domain },
} = config;

export const getIndividualResource = ({
  entity,
  attributes,
  type,
  idName,
  uri,
  relationships,
}) => {
  const json = {
    links: {
      self: `http://${domain}/${uri}`,
    },
    data: {
      type,
      id: entity[idName].toString(),
      attributes: {
        ...attributes.reduce(
          (attributes, attribute) => ({
            ...attributes,
            [attribute]: entity[attributes],
          }),
          {}
        ),
      },
      relationships: {
        author: {
          links: {
            related: 'http://example.com/articles/1/author',
          },
        },
      },
    },
  };
};
export const getResourceCollection = ({}) => {};
