import StateMachine from 'javascript-state-machine';
import { errors } from '../../errors';

const INIT_STATE = 'initialized';
const SET_STATE_TRANSITION = 'setState';

export const applyFSM = (EntityClass) => {
  const { transitions, data, methods, getRawState } = EntityClass.fsm;

  EntityClass.prototype._runFSM = function() {
    this._fsm();
    this[SET_STATE_TRANSITION](getRawState(this));
  };

  StateMachine.factory(EntityClass, {
    init: INIT_STATE,
    transitions: [
      {
        name: SET_STATE_TRANSITION,
        from: INIT_STATE,
        to: function(state) {
          return state;
        },
      },
      ...transitions,
    ],
    data: data,
    methods: {
      onInvalidTransition(transition, from, to) {
        throw errors.transitionNotAllowed();
      },
      ...methods,
    },
  });
};
