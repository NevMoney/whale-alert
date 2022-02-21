# Whale Alerts Dapp 🐋🚨

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## About

Aim: Allow user to track wallet addresses, cross-chain (ETH/BSC/MATIC/…) and recieve alerts when specific transaction conditions are met.

Built on [create-react-app](https://reactjs.org/docs/create-a-new-react-app.html) a ReactJS front-end with a Moralis backend.

## Quick Launch 🚀

Via terminal, navigate to root directory:

```sh
npm install

```

Go to [Moralis.io](https://moralis.io/) to create your server instance.
In the root directory of your code base create a `.env` file containing the moralis servers' enviroment variables:

```sh
REACT_APP_MORALIS_APPLICATION_ID=xxx
REACT_APP_MORALIS_SERVER_URL=https://xxx.bigmoralis.com:2053/server

```

Install Moralis admin client:

```sh
npm install -g moralis-admin-cli

```

This will allow you to sync Moralis Cloud Functions in [CloudFile](src/Cloud/CloudFile.js):

```sh
moralis-admin-cli watch-cloud-file --moralisApiKey xxx --moralisApiSecret xxx --moralisSubdomain xxx.moralisweb3.com --autoSave 1 --moralisCloudfolder /xxx/moralis-whale-alerts/src/Cloud

```

Finally provide your path to the [CloudFile](src/Cloud/CloudFile.js) and sync with Moralis server instance:

```sh
/xxx/moralis-whale-alerts/src/Cloud/CloudFile.js

```

Once installed and synced with your Moralis server instance, in the project directory run:

```sh
npm start

```

## Dependencies 🏗

`moralis`: [Docs](https://docs.moralis.io/)

`@chakra-ui/react`: [Docs](https://chakra-ui.com/docs/getting-started)

`react-final-form`: [Docs](https://final-form.org/docs/final-form/getting-started)

`react`, `react-dom` `react-moralis` should be installed automatically ([package.json](./package.json)).

## Adapt Alert Conditons 🛠

Cloud function `run` on `watchEthAddress` adds `address` to your list of addresses to track transactions on.

```javascript
//
// sync all txs in realtime to WatchedEthAddress class
Moralis.Cloud.run("watchEthAddress", {
  address,
  …
});
```

Function `afterSave` on `EthTransactions` then is where you create conditons against those transactions to intiate alerts.

```javascript
 Moralis.Cloud.afterSave("EthTransactions", async function (request) {
    …
 }
```

## Todos ✅

- [ ] Dispatch alerts via Telegram/Twitter/
- [ ] Threshold conditions against tx e.g. only txs > $1,000,000.
- [ ] Enable cross-chain compatibility.
- [ ] Much more TBA.


## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)


---
