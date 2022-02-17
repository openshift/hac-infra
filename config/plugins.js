const { resolve } = require('path');
const ExtensionsPlugin = require('@redhat-cloud-services/frontend-components-config-utilities/extensions-plugin');

module.exports = [
  new ExtensionsPlugin(
    {
      /**
       * These extensions are offered up as 'console-extensions.json' (a subset are currently supported in HAC-Core)
       */
      extensions: [
        {
          type: 'console.page/route',
          properties: {
            path: '/infra',
            component: {
              $codeRef: 'init',
            },
          },
        },
        {
          type: 'console.navigation/href',
          properties: {
            href: '/infra',
            name: 'Infra Home',
          },
        },
      ],
    },
    {
      exposes: {
        init: resolve(__dirname, '../src/PluginEntry/PluginEntry.tsx'),
      },
    },
  ),
];
