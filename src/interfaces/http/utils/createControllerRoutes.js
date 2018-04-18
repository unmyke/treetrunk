import path from 'path';

export function createControllerRoutes(controllerUri) {
  const controllerPath = path.resolve('../controllers', controllerUri);
  const Controller = require(controllerPath);

  return Controller.router;
}
