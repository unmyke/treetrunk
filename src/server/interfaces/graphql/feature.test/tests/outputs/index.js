import seller from './seller';
// import sellers from './sellers';
// import post from './post';
// import posts from './posts';
// import seniorityType from './seniorityType';
// import seniorityTypes from './seniorityTypes';

const outputDescribes = [
  seller,
  // sellers,
  // post,
  // posts,
  // seniorityType,
  // seniorityTypes,
];

const outputTests = (ctx) => {
  describe(':: test operations output', () => {
    outputDescribes.forEach((outputDescribe) => {
      outputDescribe(ctx);
    });
  });
};
export default outputTests;
