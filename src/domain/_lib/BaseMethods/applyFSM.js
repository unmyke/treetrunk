import StateMachine from 'javascript-state-machine';
import { errors } from '../../errors';

const SET_STATE_TRANSITION = 'setState';

export const applyFSM = (EntityClass) => {
  const { transitions, data, methods } = EntityClass.fsm;

  StateMachine.factory(EntityClass, {
    init: EntityClass.init,
    transitions: [
      {
        name: SET_STATE_TRANSITION,
        from: EntityClass.init,
        to: function(state) {
          return state;
        },
      },
      ...transitions,
    ],
    data: data,
    methods: {
      onInvalidTransition() {
        throw errors.transitionNotAllowed();
      },
      ...methods,
    },
  });
};
