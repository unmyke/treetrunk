import SwaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';

export const swaggerMiddleware = [SwaggerUi.serve, SwaggerUi.setup(swaggerDocument)];
