process.env.NODE_ENV = process.env.NODE_ENV || 'development';

import Console from './console';
import container from '@container';

Console.start({
  expose: { container },
});
