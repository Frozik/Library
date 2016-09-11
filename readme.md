## Installation
* Install [Visual Studio Code](https://code.visualstudio.com/)
    - Configured debugging for client and server code
* Install dependency packages
    - npm i
    - npm i -g tsd typescript
* Install Typescript type definisions
    - tsd install -o
    - If [fix](https://github.com/DefinitelyTyped/DefinitelyTyped/commit/2966b1b8bad3b515b8ebeaaf40d95809a46e74a8) is still missing, apply it manually to  *./typings/node/node.d.ts*

## Tasks
**Visual Studio Code tasks**
* **css-types** - Builds definisions (*.d.ts) for CSS files 
* **build** - Build client and server applications (development environment)
* **build-client** - Build client application (development environment)
* **build-server** - Build server application (development environment)
* **test** - Run unit tests for client and server applications
* **test-client** - Run unit tests for client application
* **test-server** - Run unit tests for server application

**Gulp tasks**

Running gulp task
* "**gulp**" - If installed globbaly
* "**node ./node_modules/gulp/bin/gulp.js**" if installed locally only

Tasks
* **build** - Build client and server applications (Environment can be selected)
    - Parameter [conf|config|configuration|env|environment|build]
    - Values [d|dev|development|p|prod|production]
    - Example of process arguments:
        - "--env=prod"
        - "--configuration=development"
* **build-client** - Build client application (Environment can be selected)
    - Parameter [conf|config|configuration|env|environment|build]
    - Values [d|dev|development|p|prod|production]
    - Example of process arguments:
        - "--env=prod"
        - "--configuration=development"
* **build-server** - Build server application (Environment can be selected)
    - Parameter [conf|config|configuration|env|environment|build]
    - Values [d|dev|development|p|prod|production]
    - Example of process arguments:
        - "--env=prod"
        - "--configuration=development"
* **test** - Run unit tests for client and server applications
* **test-client** - Run unit tests for client application
* **test-server** - Run unit tests for server application
* **run-server** - Run application

**NPM tasks**

* **start"** - Run application
* **css-types** - Builds definisions (*.d.ts) for CSS files 
* **dev** - Build client and server applications for development environment
* **prod** - Build client and server applications for production environment
* **test** - Run unit tests for client and server applications

## TODO
* [React Hot Loader](https://github.com/gaearon/react-hot-loader)
* [Isomorphic React app](http://jmfurlott.com/tutorial-setting-up-a-simple-isomorphic-react-app/)
* [Coverage](https://github.com/karma-runner/karma-coverage)