# How to run this thing

In dev mode:

    $ npm install && npm start

To see a production build

    $ npm install && npm run build && npx serve -s build

# Chat Bot

Implement a chat bot as a web application using the [flow.json](flow.json) file as input data. You can put more or less effort into certain features to show your interests and strengths. Some features can be rudimentary, but every feature should be implemented in the end.

## Features

- [x] Load the [chat bot data](flow.json) asynchronously or via SSR
- [x] The chat bot flow starts with question id 100
- [x] Use the chosen option‘s nextId to guide the user through the dynamic flow
- [x] If the nextId is false, the flow is terminated and the following message is shown: „Herzlichen Dank für Ihre Angaben“
- [x] The answers are sent as a PUT request to [this endpoint](https://virtserver.swaggerhub.com/L8475/task/1.0.0/conversation) (see [OpenAPI specification](https://app.swaggerhub.com/apis-docs/L8475/task/1.0.0) for details)

## Tools & Technology Stack

* Visual Studio Code
*	Git
*	Typescript 3+ (Strict Mode)
*	React 17+
*	Material UI and JSS

## Target

ECMAScript 2015

## Browser compatibility

*	Internet Explorer Edge 15+
*	Firefox 54+
*	Chrome 51+
*	Safari 10+

## Delivery

One of the following delivery methods so we can review your code:

*	Git repository + yarn start to run a dev build
*	Git repository + VS Code Dev Container
*	Docker via Docker Hub

Good luck and have fun!


## Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Available Scripts

In the project directory, you can run:

#### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

#### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

#### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

### Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
