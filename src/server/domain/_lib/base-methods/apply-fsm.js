import StateMachine from 'javascript-state-machine';
import { errors } from '../../errors';
import { toState } from './fsm-helpers';

const SET_STATE_TRANSITION = 'setState';
const INIT_TRANSITION = 'init';

const defaultIgnoreUpdateTrasitions = [SET_STATE_TRANSITION, INIT_TRANSITION];

const applyFSM = (EntityClass) => {
  const {
    init,
    transitions,
    data,
    methods,
    ignoreUpdateTrasitions = [],
  } = EntityClass.fsm;

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
      onAfterTransition({ transition }) {
        console.log(transition, this.state);
        if (
          ![
            ...defaultIgnoreUpdateTrasitions,
            ...ignoreUpdateTrasitions,
          ].includes(transition)
        )
          this.updatedAt = new Date();
      },
      ...methods,
    },
  });
};
export default applyFSM;
