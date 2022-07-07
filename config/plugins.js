const pckg = import('@openshift/dynamic-plugin-sdk-webpack');
const remotePluginOptions = require('./remotePlugin');

const plugins = [];

module.exports = async () => {
  const { DynamicRemotePlugin } = await pckg;
  plugins.push(new DynamicRemotePlugin(remotePluginOptions));
  return plugins;
};
