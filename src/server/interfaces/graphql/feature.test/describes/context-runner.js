const contextRunner = ({ name, test }) => (opts) => {
  context(name, test(opts));
};
