export const Add = {
  transitions: [
    { name: 'add', from: 'active', to: 'validate' },
    { name: 'validate', from: 'active', to: 'validate' },
  ],
  methods: {
    onAdd({ transition, from, to }, value, day, collection) {
      if (collection.length === 0) {
      }
      // const ValueObject =
    },
  },
  data: function(collection) {
    return {
      collection: collection,
    };
  },
};
