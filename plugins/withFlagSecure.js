const { withMainActivity } = require('@expo/config-plugins');

module.exports = function withFlagSecure(config) {
  return withMainActivity(config, (config) => {
    if (
      !config.modResults.contents.includes('FLAG_SECURE')
    ) {
      config.modResults.contents = config.modResults.contents.replace(
        'super.onCreate(null);',
        `super.onCreate(null);
        getWindow().setFlags(
          android.view.WindowManager.LayoutParams.FLAG_SECURE,
          android.view.WindowManager.LayoutParams.FLAG_SECURE
        );`
      );
    }
    return config;
  });
};