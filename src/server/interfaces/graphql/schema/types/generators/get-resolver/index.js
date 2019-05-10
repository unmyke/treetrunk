import identity from '@domain';

import * as argsParser from './args-parser';

export default ({ name: typeName }, serviceName) => (
  _,
  args,
  {
    service: {
      [typeName]: { [serviceName]: service },
    },
  }
) => service((argsParser[serviceName] || identity)(args));
