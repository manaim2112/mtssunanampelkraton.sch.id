const WebpackObfuscator = require('webpack-obfuscator');

module.exports = function override(config, env) {
  if (env === 'production') {
    config.plugins.push(
      new WebpackObfuscator({
        compact : true,
        rotateStringArray: true,
        stringArray: true,
        stringArrayEncoding: ["none"],
      })
    );
  }
  return config;
};
