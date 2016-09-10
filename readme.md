## Installation
* Install [Visual Studio Code](https://code.visualstudio.com/)
* Install dependency packages
    - npm i
    - npm i -g tsd typescript
* Install Typescript type definisions
    - tsd install -overwrite
    - If [fix](https://github.com/DefinitelyTyped/DefinitelyTyped/commit/2966b1b8bad3b515b8ebeaaf40d95809a46e74a8) is still missing, apply it manually to  ./typings/node/node.d.ts

## Tasks
**Visual Studio Code tasks**
* build-css-definisions - Builds definisions (*.d.ts) for CSS files, configured for 
* build - Build client and server applications (development environment)
* build-client - Build client application (development environment)
* build-server - Build server application (development environment)
* test - Run unit tests for client and server applications
* test-client - Run unit tests for client application
* test-server - Run unit tests for server application

**Gulp tasks**

Running gulp task
* "gulp" - If installed globbaly
* "node ./node_modules/gulp/bin/gulp.js" if installed locally only

Tasks
* build - Build client and server applications (Environment can be selected)
    - Parameter [conf|config|configuration|env|environment|build]
    - Values [d|dev|development|p|prod|production]
    - Example of process arguments:
        - "--env=prod"
        - "--configuration=development"
* build-server - Build client application (Environment can be selected)
    - Parameter [conf|config|configuration|env|environment|build]
    - Values [d|dev|development|p|prod|production]
    - Example of process arguments:
        - "--env=prod"
        - "--configuration=development"
* build-client - Build server application (Environment can be selected)
    - Parameter [conf|config|configuration|env|environment|build]
    - Values [d|dev|development|p|prod|production]
    - Example of process arguments:
        - "--env=prod"
        - "--configuration=development"
* test - Run unit tests for client and server applications
* test-server - Run unit tests for client application
* test-client - Run unit tests for server application
* run-server - Run application
