# project-t09-studygroup
This project is meant to provide a way for students at UCSB to get connected and set up study groups for their classes.

Joshua Avery J-Avery32

Anisha Kabir AnishaKabir

Jamie Wang ZiyueWang675

Kenneth Wang kenny-wang6

Zhenni Xu larkJennice

Our tech stack will be vue, mongodb, and ExpressJS. Joshua is familiar with using these three technologies in concert. Vue is very quick to use and has the amazing 'bootstrap vue' library which comes with great UI components. ExpressJS is a javascript library for creating servers.

# Our goals at the beginning of the quarter (Not all of them are achieved)

Our project is meant to make it easy for people to find the same classes and then communicate with people in those classes. We will have a central repository through which people can search for classes and the join. People should be able to chat with others. Professors can claim the class if they want so they can also communicate with their students. Finally TAs should be able to join as well.


Professor
- Manage their class
- Talk to any study group
- Send out mass communications
- View lab partners

Student
- Form study groups
- See peer availabilities
- Talk to others in their class
- Easily search for the specific class
- Communicate with professors and TAs

TA
- Communicate with professor
- Send out mass communication
- Talk to any study group

Administrator
- Delete classes if necessary
- Moderate study group chats
- Create classes if necessary


We will restrict the userbase to @ucsb.edu






# Dependencies

axios is a library that makes sending http requests with js easy.

Bootstrap adds nice css styling

Bootstrap vue is the vue specific version of bootstrap. Makes for easy integration of bootstrap into vue apps.

cors is a middleware for express that allows cross origin requests.

express is a framework for making web servers with nodejs

firebase allows us to communicate with the google firebase database.

firebase-admin is meant for back ends to communicate with firebase.

uuid allows us to generate uuids (not in use in our project)

vue is a frontend library for making web pages/apps

vue-advanced-chat is a vue library which implements a chat room

vue-router is meant to allow vue to programmatically manipulate the browser url

vuex is meant for storing state in vue

Eslint allows for checking of style in code

vue-cli-service is a binary for easily serving, building, and prototyping vue code

dotenv is meant for loading `.env` files into environment variables.

cross-env is meant for loading environment variables specified in the command line into node

jest is meant for testing javascript

supertest is used to test http servers

nodemon is used for hot module reloading when developing

# Code folder hierarchy
This is explained in much more detail in our design document.

# Development
## Prerequisites

User should have npm, node, and git installed. Do this through nvm (Node Version Manager). They should also have the firebase-cli installed for development.

Make sure firebase CLI is installed:

`curl -sL firebase.tools | bash`

## While developing
`npm install` to get started

`npm run serve` to start the frontend
    
`npm run start:dev` to start the backend (with hot reloading!!)
    
`npm run firebase` to start the firebase emulators
    
`npm run test:server` to run unit tests for the server
    

# Contributing

    Fork it!
    Create your feature branch: git checkout -b my-new-feature
    Commit your changes: git commit -am 'Add some feature'
    Push to the branch: git push origin my-new-feature
    Submit a pull request :D

# Deployment
 https://cs-148-study-group.herokuapp.com
    
# Deployment instructions
 [Deployment](./docs/DEPLOY.md)
