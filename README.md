# hac-infra

Hybrid Application Console Infrastructure repository

## Local Development

Since the plugin is not served directly from console.redhat.com you have to run webpack proxy in order to properly develop locally.

First, run

```
yarn install
```

Then you have two options

* With hac-core served from CDN - if you want to test your changes just in your plugin
* With hac-core locally - if you want to add new plugin or change how navigation is treated.

### With hac-core served from CDN (default)

Once your plugin has been enabled in hac-core and promoted to at least stage environment you can start serving hac-core from CDN. You can just run

```
yarn dev
```

Note: This will require the internal VPN.

### With hac-core locally (advanced)

In order to run hac-core and your plugin together, you will have to pull https://github.com/openshift/hac-core repository, install all dependencies and follow [dynamic plugins](https://github.com/openshift/hac-core#dynamic-plugins). Once hac-core is running you'll have to run your plugin in federated mode.

```
yarn dev:federated
```

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

### Proxies & etc/hosts

The proxy set up in the webpack assumes you have the following entries in your /etc/hosts file (mac/linux):

```
127.0.0.1	prod.foo.redhat.com
127.0.0.1	stage.foo.redhat.com
```

## Extension properties

This repository is using [@redhat-cloud-services/frontend-components-config-utilities/extensions-plugin](https://github.com/RedHatInsights/frontend-components/tree/master/packages/config-utils#extensions-plugin) to bootstrap the plugin, it wraps the plugin entry with specific function and generates plugin manifest.

Using this methodology you can add routes & navigation in `config/plugins.js`. There is limited support in HAC-Core today for extensions as use-cases grow.

## Building the output

Production build is available via the yarn command:

```
yarn prod
```

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
