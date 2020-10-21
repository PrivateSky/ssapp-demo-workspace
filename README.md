# ssapp-demo-workspace

*ssapp-demo-workspace*  bundles all the necessary dependencies for building and running SSApps in a single package.

### Installation

In order to use the workspace, we need to follow a list of steps presented below. 

First, let's clone the workspace

```sh
$ git clone https://github.com/PrivateSky/ssapp-demo-workspace.git
```

After the repository was cloned, you must install all the dependencies.

```sh
$ cd ssapp-demo-workspace
$ npm install
```

If you have trouble installing the ssap-demo-workspace, please try to follow the guide provided on [PrivateSky.xyz](https://privatesky.xyz/?Start/installation)

The last two commands you need to run in the *ssapp-demo-workspace* workspace
```sh
$ npm run server
$ npm run build-all
```
The SSApp application loader is the first thing you will see after starting the web server and accessing http://localhost:8080/secure-channels/loader. It is a basic web application which allows creation and loading of wallets based on the menu wallet template. The SSApp loader registers a service worker responsible with loading the built SSApps from the Brick Storage.

For more details about a *workspace* check out the [template-workspace](https://github.com/PrivateSky/template-workspace).
