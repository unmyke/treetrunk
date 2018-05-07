import path from 'path';
import * as Controllers from '../controllers';

export function createControllerRoutes(controller) {
  const Controller = Controllers[controller];

  return Controller.router;
}
