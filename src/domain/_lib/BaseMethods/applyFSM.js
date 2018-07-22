import StateMachine from 'javascript-state-machine';
import { errors } from '../../errors';

export const applyFSM = (EntityClass) => {
  StateMachine.factory(EntityClass, {
    init: EntityClass.fsm.init,
    transitions: [
      {
        name: 'setState',
        from: '*',
        to: function(s) {
          return s;
        },
      },
      ...EntityClass.fsm.transitions,
    ],
    data: EntityClass.fsm.data,
    methods: {
      onInvalidTransition(transition, from, to) {
        throw errors.transitionNotAllowed();
      },
      ...EntityClass.fsm.methods,
    },
  });
};
