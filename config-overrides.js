const WebpackObfuscator = require('webpack-obfuscator');
const TerserPlugin = require("terser-webpack-plugin");

module.exports = function override(config, env) {
  if (env === 'production') {
    // config.plugins.push(
    //   new WebpackObfuscator({
    //     compact : true,
    //     rotateStringArray: true,
    //     stringArray: true,
    //     stringArrayEncoding: ["none"],
    //     exclude: /main\.[\w\d]+\.js$/,
    //   })
    // );

    // config.optimization.splitChunks = {
    //   chunks : "all",
    //   minSize : 10000,
    //   maxSize : 250000,
    // }
    config.optimization.minimize = true;
    config.optimization.minimizer.push(new TerserPlugin({
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          collapse_vars: true,
        },
        mangle: {
          toplevel: true,
          eval: true,
        },
        output: {
          comments: false,
          ecma: 5,
        },
        format: {
          // Menggunakan obfuscation hanya pada string
          ascii_only: true,
        },
        keep_classnames: false, // Jika Anda ingin menjaga nama kelas tidak diobfuscate
        keep_fnames: false,
      },
    }))
  }
  return config;
};

