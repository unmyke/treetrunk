import supertest from 'supertest';

const request = ({ server }) => supertest(server.get());

export default request;
