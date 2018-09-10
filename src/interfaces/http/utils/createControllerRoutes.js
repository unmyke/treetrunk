import { Router } from 'express';
import * as Controllers from '../controllers';

export function createControllerRoutes(controller) {
  const router = Router();
  router.use(controller);
  const Controller = Controllers[controller];

  return Controller.router;
}
