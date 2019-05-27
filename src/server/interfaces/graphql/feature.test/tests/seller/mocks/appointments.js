import uuidv4 from 'uuid/v4';

const appointmentMock = [
  { postId: uuidv4(), day: new Date('2018-01-01') },
  { postId: uuidv4(), day: new Date('2018-02-01') },
];
export default appointmentMock;
