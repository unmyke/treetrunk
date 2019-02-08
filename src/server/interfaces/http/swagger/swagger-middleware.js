import SwaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';

const swaggerMiddleware = [SwaggerUi.serve, SwaggerUi.setup(swaggerDocument)];

export default swaggerMiddleware;
