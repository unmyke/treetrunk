process.env.NODE_ENV = process.env.NODE_ENV || 'development';

import { Console } from './console';
import { container } from 'src/container';

Console.start({
  expose: { container },
});
