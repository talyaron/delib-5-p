# delib-5

## Goal

The objective of Delib 5 is to serve as an inclusive B2C deliberative app, offering a diverse array of deliberation methods.
Deliberation stands as an informed and inclusive mode of discussion dedicated to discovering the most optimal solution for all stakeholders while actively striving to minimize any harm to the interests of those who might be adversely affected by the proposed solution.

For more information and a roadmap, please look at the [wiki in this repository](https://github.com/delib-org/delib-5/wiki).

## Installation

The technological stack consists of React-Redux-PWA (built with Vite) and Firebase. To be able to work efficientyl it is better to get femilier with firebase and React, before turning to delib developemnt. 

To install Delib on you local machine, you will have to install the client ```/clint``` and the ```/functions``` node modules:

    Go to the root directory and run ```npm i```. 

    Go to the functions directory and run ```npm i```.

Then you have to install the emulators. You must have Java JDK installed on your machine. If it is not installed, please install [JDK  heigher than version 17](https://www.oracle.com/il-en/java/technologies/downloads/#java21).

To install emulators, first make sure you firebase CLI is installed.

```firebase --version```

If the firebase cli is not install, run:
```npm install -g firebase-tools``` or ```sudo npm install -g firebase-tools``` if you use a macOS.


if you still get an error try to give permission to your self as a manager with this command and then run all above commands

```Set-ExecutionPolicy RemoteSigned -Scope CurrentUser```

Run the commend below and login to your google account

```firebase login``` 

In firebase console, create a new project, and call it "delib-5", and copy the project id. In ```.firebaserc``` change the project id to the project id you just created.

Then run ```firebase use <project-id>``` to select the project you just created.

Then run ```firebase init emulators``` and install all the emulators.

## settings configKey file

under ```/src/functions/db/``` add  ```configKey.ts``` file. This file is not uploaded to github, and you will have to create it yourself.
use the Project config to set the cofig file:


``` javascript
export const keys = {
    apiKey: "your key",
    authDomain: "your key",
    databaseURL: "your key",
    projectId: "your key",
    storageBucket: "your key",
    messagingSenderId: "your key",
    appId: "your key",
    measurementId: "your key"
}


export const vapidKey = 'your key';
```

# Development mode

Then initlise the emualtors by running:
```firebase init emulators``` and install all the maulators.

To run the emulators, run ```npm run deve``` in the root direcotry.
To run client run ```npm run dev``` in the root directory.
To run function, run in /functions ```npm run dev```.

go to ```localhost:5173``` to see the app, and to ```localhost:5002``` to see the emulators.








