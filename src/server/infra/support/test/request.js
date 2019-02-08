import supertest from 'supertest';
import container from '@container';
const { server } = container;

const request = () => supertest(server.express);

export default request;
