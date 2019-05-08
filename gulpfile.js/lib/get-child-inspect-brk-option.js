module.exports = () => {
  const processInspectBrkOption = process.execArgv
    .map((argv) => argv.trim())
    .find((argv) => argv.includes('inspect-brk'));
  return processInspectBrkOption ? [`--inspect-brk`] : [];
};
