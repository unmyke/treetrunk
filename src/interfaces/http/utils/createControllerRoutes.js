import path from 'path';

export function createControllerRoutes(controllerUri) {
  const controllerPath = path.resolve(
    'src/interfaces/http/controllers',
    controllerUri,
  );
  const Controller = require(controllerPath);

  return Controller.router;
}
