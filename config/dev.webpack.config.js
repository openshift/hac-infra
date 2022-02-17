const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
const commonPlugins = require('./plugins');

const environment = process.env.ENVIRONMENT || 'stage';
const betaOrStable = process.env.BETA ? 'beta' : 'stable';
// for accessing prod-beta change this to 'prod-beta'
const env = `${environment}-${betaOrStable}`;

const webpackProxy = {
  deployment: process.env.BETA ? 'beta/api/plugins' : 'api/plugins',
  useProxy: true,
  env,
  appUrl: process.env.BETA ? '/beta/hac/infra' : '/hac/infra',
  ...(process.env.INSIGHTS_CHROME && {
    localChrome: process.env.INSIGHTS_CHROME,
  }),
  client: {
    overlay: false,
  },
};

const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '../'),
  debug: true,
  useFileHash: false,
  ...webpackProxy,
});

plugins.push(...commonPlugins);

module.exports = {
  ...webpackConfig,
  plugins,
};
