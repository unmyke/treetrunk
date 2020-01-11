import { upperFirst } from 'lodash';

export function loop() {
  return this.state;
}

export function toState(state) {
  return state;
}

export const getLifecycleEventName = (lifecycle, target) =>
  `on${upperFirst(lifecycle)}${upperFirst(target)}`;
