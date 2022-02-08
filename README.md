# hac-infra

Hybrid Application Console Infrastructure repository

## Local Development

Since the plugin is not served directly from console.redhat.com you have to run webpack proxy in order to properly develop locally. You have two options

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

* BETA - to switch between stable and beta releases
* ENVIRONMENT
  * stage - default environment, it will use stage API
  * prod - production environment, it will use production API
* API_PORT - if you want to run your API locally set this variable to whichever port you need, also please change your API url in /config/dev.webpack.config.js
* ~~CONFIG_PORT - if you want to run navigation config locally you can pass this variable and see your changes~~ Currently disabled while a bug is being fixed

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
