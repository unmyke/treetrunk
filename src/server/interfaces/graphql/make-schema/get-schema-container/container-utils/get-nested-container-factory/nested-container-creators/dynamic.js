const dynamic = ({ bottle, name, resolver }) => () => {
  bottle.provider(name, function nestedDyncamicProvider() {
    this.$get = () => resolver(bottle);
  });
};
export default dynamic;
