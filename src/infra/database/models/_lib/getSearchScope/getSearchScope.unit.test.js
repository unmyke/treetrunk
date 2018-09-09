import { getSearchScope } from './getSearchScope';

describe('infra :: models :: lib :: getSearchScope', () => {
  const search = getSearchScope('name', 'state');
  console.log(search('test'));
});
