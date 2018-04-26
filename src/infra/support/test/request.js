import supertest from 'supertest-as-promised';
import { container } from 'src/container';
const { server } = container;

export const request = () => supertest(server.express);
