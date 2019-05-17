import { identity } from '@common';
import roundTo from '../round-to';

export const serialize = identity;
export const parse = roundTo(identity, 2);
