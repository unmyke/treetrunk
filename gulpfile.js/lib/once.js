module.exports = callback => {
  let process = false;

  return (...options) => {
    if (!process) process = callback(...options);
    return process;
  };
};
