import StateMachine from 'javascript-state-machine';
import { makeError, errors } from '../../errors';

export const applyFSM = (EntityClass) => {
  StateMachine.factory(EntityClass, {
    init: EntityClass.fsm.init,
    transitions: [
      ...EntityClass.fsm.transitions,
      {
        name: 'setState',
        from: '*',
        to: function(s) {
          return s;
        },
      },
    ],
    data: EntityClass.fsm.data,
    methods: {
      onInvalidTransition(transition, from, to) {
        throw makeError({ state: errors.transitionNotAllowed });
      },
      ...EntityClass.fsm.methods,
    },
  });
};
