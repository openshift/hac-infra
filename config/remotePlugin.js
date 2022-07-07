const { resolve } = require('path');
const packageInfo = require('../package.json');

module.exports = {
  pluginMetadata: {
    name: packageInfo.name,
    version: packageInfo.version,
    exposedModules: {
      init: resolve(__dirname, '../src/pages/PluginEntry/PluginEntry.tsx'),
    },
  },
  extensions: [
    {
      type: 'core.page/route',
      properties: {
        path: '/workspaces',
        component: {
          $codeRef: 'init',
        },
      },
    },
    {
      type: 'core.navigation/href',
      properties: {
        href: '/workspaces',
        name: 'Workspaces',
      },
    },
    {
      type: 'console.navigation/href',
      properties: {
        href: '/workspaces',
        name: 'Workspaces',
      },
    },
  ],
  sharedModules: {
    '@openshift/dynamic-plugin-sdk': { singleton: true, import: false },
    '@openshift/dynamic-plugin-sdk-utils': { singleton: true, import: false },
    'react-router-dom': { singleton: true },
    react: { singleton: true, import: false },
    '@scalprum/react-core': { singleton: true, import: false },
    '@patternfly/quickstarts': { singleton: true, eager: true },
  },
};
