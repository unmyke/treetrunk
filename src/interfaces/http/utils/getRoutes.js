const routerLayerPredicate = ({ name }) => name === 'router';
export const getRoutes = ({ stack }) => {
  const routerLayers = stack.filter(routerLayerPredicate);
  if (routerLayers.length === 0) {
    return;
  }

  return routerLayers.map(({ handle: router, regexp }) => {
    return {
      path: regexp.toString().slice(3, -13),
      inside: getRoutes(router),
    };
  });
};
