import * as Seller from './seller';
import * as Post from './post';
import * as SeniorityType from './seniority-type';

const typesFieldFactories = { ...Seller, ...Post, ...SeniorityType };

export default typesFieldFactories;
