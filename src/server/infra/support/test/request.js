import supertest from 'supertest';
import { container } from '@container';
const { server } = container;

export const request = () => supertest(server.express);
