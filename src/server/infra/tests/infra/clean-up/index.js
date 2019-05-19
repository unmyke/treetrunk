import cleanDatabase from './clean-database';

const cleanUp = ({ database, models, logger }) => {
  const onStartTest = () => {
    database.connect().then(() => {
      cleanDatabase({ models, logger });
    });
  };
  const onStopTest = () => {
    cleanDatabase({ models, logger }).then(() => {
      database.disconnect();
    });
  };
  const onAfterEach = () => {
    cleanDatabase({ models, logger });
  };

  return {
    onStartTest,
    onStopTest,
    onAfterEach,
  };
};
export default cleanUp;
