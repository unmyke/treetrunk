import container from '@container';
import factory from '@infra/support/test/factory';
import Console from './console';

Console({
  expose: { container, factory },
});
