import StateMachine from 'javascript-state-machine';

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
    methods: EntityClass.fsm.methods,
  });
};
