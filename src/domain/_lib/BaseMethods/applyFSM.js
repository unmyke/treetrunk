import StateMachine from 'javascript-state-machine';
import { lowerCase } from 'lodash';

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
        throw this.constructor.errorFactory.createNotAllowed(
          this,
          `Not allowed to ${lowerCase(transition)} from ${from} state`
        );
      },
      ...EntityClass.fsm.methods,
    },
  });
};
