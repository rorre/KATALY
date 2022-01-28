const tailwind = require('preact-cli-tailwind');

module.exports = (config, env, helpers) => {
  config.devtool = false;
  config = tailwind(config, env, helpers);
  return config;
};
