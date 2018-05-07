import supertest from 'supertest';
import { container } from 'src/container';
const { server } = container;

export const request = () => supertest(server.express);
