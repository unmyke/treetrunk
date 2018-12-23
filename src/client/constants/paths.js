const paths = {
  home: { id: 'home', path: '/', exact: true },
  sellers: { id: 'sellers', path: '/sellers', exact: true },
  shops: { id: 'shops', path: '/shops', exact: true },
  workshifts: { id: 'workshifts', path: '/workshifts', exact: true },
  dictionary: { id: 'dictionary', path: '/dictionary', exact: true },
  designSystem: {
    id: 'designSystem',
    path: '/design-system',
    exact: true,
  },
};

export const nav = [
  paths.sellers,
  paths.shops,
  paths.workshifts,
  paths.dictionary,
];

export const { home, designSystem } = paths;

export default paths;
