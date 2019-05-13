import { identity } from '@common';

import roundTo from '../round-to';

export const serialize = identity;
export const parse = (value) => roundTo(value, 1);
