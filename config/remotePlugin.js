const { resolve } = require('path');
const packageInfo = require('../package.json');

const ROUTES = {
  workspaces: '/workspaces',
};

module.exports = {
  pluginMetadata: {
    name: packageInfo.name,
    version: packageInfo.version,
    exposedModules: {
      init: resolve(__dirname, '../src/pages/PluginEntry/PluginEntry.tsx'),
      details: resolve(__dirname, '../src/pages/WorkspaceDetails/WorkspaceDetails.tsx'),
    },
  },
  extensions: [
    {
      type: 'core.page/route',
      properties: {
        path: ROUTES.workspaces,
        component: {
          $codeRef: 'init',
        },
      },
    },
    {
      type: 'core.page/route',
      properties: {
        path: `${ROUTES.workspaces}/:workspaceName`,
        component: {
          $codeRef: 'details',
        },
      },
    },
    {
      type: 'core.navigation/href',
      properties: {
        href: ROUTES.workspaces,
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
