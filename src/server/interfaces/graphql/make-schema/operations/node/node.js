import { queryField } from 'nexus';

import interfaces from '../../interfaces';
import args from './args';
import resolve from './resolver';

const { Node: NodeInterface } = interfaces;

const Node = queryField('node', {
  type: NodeInterface,
  args,
  resolve,
});

export default Node;
