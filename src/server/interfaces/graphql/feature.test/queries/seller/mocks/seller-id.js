import uuidv4 from 'uuid/v4';
import { SellerId } from '@domain/common-types';

const idValue = uuidv4();

export default new SellerId({ value: idValue });
