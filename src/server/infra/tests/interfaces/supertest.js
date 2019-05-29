import supertest from 'supertest';

const request = ({ server }) => supertest(server.apolloClient);

export default request;
