const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

const envsPath = '../../.env';

module.exports = (env) =>
  new Promise((resolve, reject) =>
    fs.readFile(path.resolve(envsPath, env), (err, data) => {
      if (err) {
        reject(new Error(err));
      }

      resolve(dotenv.parse(data));
    })
  );
