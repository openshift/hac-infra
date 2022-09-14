# hac-infra

Hybrid Application Console Infrastructure repository

## Run with webpack proxy

Since the plugin is not served directly from console.redhat.com you have to run webpack proxy in order to properly develop locally.

### Update `/etc/hosts`

To use webpack proxy you need to append this to your `/etc/hosts` for auth:

```
127.0.0.1 prod.foo.redhat.com
127.0.0.1 stage.foo.redhat.com
```

### Run plugin locally and see the UI in the browser
*(With hac-core served from CDN)*

1. ```npm install --legacy-peer-deps```

2. ```npm run start:prod:beta```

3. Start the local kcp-proxy by cloning [https://github.com/vidyanambiar/kcp-proxy-poc](https://github.com/vidyanambiar/kcp-proxy-poc) and following the steps in the Readme. This proxy is needed as a temporary workaround for adding CORS headers to the KCP requests.

4. Open the URL listed in the terminal output.

### Run plugin with hac-core locally

In order to run hac-core and the hac-infra plugin together:
- Start the local kcp-proxy by cloning [https://github.com/vidyanambiar/kcp-proxy-poc](https://github.com/vidyanambiar/kcp-proxy-poc) and following the steps in the Readme. This proxy is needed as a temporary workaround for adding CORS headers to the KCP requests.
- Pull the https://github.com/openshift/hac-core repository and install all dependencies
- (temporary workaround) Change the following highlighted lines in HAC Core's [dev webpack configuration file](https://github.com/openshift/hac-core/blob/main/frontend/config/dev.webpack.config.js):
  <pre><code>
  customProxy: [
    {
      context: (path) => path.includes('/api/k8s'),
      <strong>target: 'http://localhost:3000',  // <--- Changed line to point to local proxy</strong>
      secure: false,
      changeOrigin: true,
      autoRewrite: true,
      ws: true,
      pathRewrite: { '^/api/k8s': '' },
      withCredentials: true,
    },
    pluginProxy('hac-dev'),
    pluginProxy('hac-build-service'),
    pluginProxy('hac-infra'),
    {
      context: (path) => path.includes('/wss/k8s'),
      <strong>target: 'ws://localhost:3000',  // <--- Changed line to point to local proxy</strong>
      secure: false,
      changeOrigin: true,
      autoRewrite: true,
      ws: true,
      pathRewrite: { '^/wss/k8s': '' },
      withCredentials: true,
    },
  ],
  </code></pre>
- Run `ENVIRONMENT=prod yarn dev` from the `frontend/` directory.
- Once hac-core is running you'll have to run the hac-infra plugin in federated mode as follows:
  ```bash
  npm install --legacy-peer-deps
  npm run start:federated
  ```
  **Note:** There is a dependency resolution error seen on running `npm install`. This is on the install of `@openshift/dynamic-plugin-sdk-utils` caused by the `react-virtualized` package having an obsolete React dependency. See [https://issues.redhat.com/browse/HAC-1814](https://issues.redhat.com/browse/HAC-1814). So we need to run `npm install` with `--legacy-peer-deps` as a temporary workaround.
- Open the URL in the terminal output (Note: you will need to login to RH SSO as a user with access to KCP to see the workspaces)

### Variables

* BETA - to switch between stable and beta releases (TRUE | FALSE)
    * A more volatile part of staging or prod -- used to test out on more official setups (SSO, chrome framework, etc) but without making it an official aspect of that setup; a step before a release
* ENVIRONMENT
  * **stage** - default environment, it will use stage API
  * **prod** - production environment, it will use production API
* INSIGHTS_CHROME
  * Used to allow you to run a local version of the ConsoleDot Chrome (navigation, masthead, etc)
  * This variable is intended to point at the build directory where https://github.com/RedHatInsights/insights-chrome is running locally
    * Using `npm run watch` to start it
  * Using `export INSIGHTS_CHROME=$PWD` in the build folder, you can provide that variable to this plugins start (`yarn dev`) command:
    * `INSIGHTS_CHROME=<the path> yarn dev`

## Folder Structure Design

To help with private and public accessors around tests and outside consumers the folder structure of this repo should conform to a "component folder" structure.

```text
src/
  <some amount of other folders>/
    ComponentA/
      index.ts
      ComponentA.tsx        // external component
      ComponentA.test.tsx
      InternalComponent.tsx // internal component
      utils.ts              // has a mixture of internal and external utilities
      utils.test.ts
      useInternalHook.ts    // internal, only used by InternalComponent.tsx
    ComponentB/
      index.ts
      ComponentB.tsx
      ComponentB.test.tsx
    utilities/
      foo.ts                // fully exposed api as it is public api
      foo.test.ts
```

The above folder structure favours `<ComponentName>/index.ts` kind of structure in order to allow for imports of an index file thus creating the public API interface for all other consumers while allowing for separate and fully exposed properties to be considered internal to the folder.

```javascript
// Index file for ComponentA
export { default as ComponetA } from './ComponetA';
export { someUsefulUtiility, someOtherUsefulUtiility } from './utils';

// From 'ComponentB/ComponentB.tsx'
import { ComponetA, someUsefulUtiility } from '../ComponentA'; // you can omit '/index'

// Refrain from ever digging into the component folder to import
// DO NOT DO:
import useInternalHook from '../ComponentA/useInternalHook';
```

The `index.ts` of each folder would contain only the exposed utilities and components one would import from outside the component folder. This way utilities and components can be not-exposed as desired, and only used for internal organization and/or tests.

**Rule of thumb is to navigate through _camelCase_ folders until you hit your file (a utility file) or a _PascalCase_ name (a component folder), whichever comes first.**
