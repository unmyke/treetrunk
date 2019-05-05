import StateMachine from 'javascript-state-machine';
import { errors } from '../../errors';
import { toState } from './fsm-helpers';

const SET_STATE_TRANSITION = 'setState';

const applyFSM = (EntityClass) => {
  const { init, transitions, data, methods } = EntityClass.fsm;

  StateMachine.factory(EntityClass, {
    init,
    transitions: [
      {
        name: SET_STATE_TRANSITION,
        from: init,
        to: toState,
      },
      ...transitions,
    ],
    data,
    methods: {
      onInvalidTransition() {
        throw errors.transitionNotAllowed();
      },
      onAfterTransition() {
        if (this.state !== init) this.updatedAt = new Date();
      },
      ...methods,
    },
  });
};
export default applyFSM;
