# project-t09-studygroup
This project is meant to provide a way for students at UCSB to get connected and set up study groups for their classes.

Joshua Avery J-Avery32

Anisha Kabir AnishaKabir

Jamie Wang ZiyueWang675

Kenneth Wang kenny-wang6

Zhenni Xu larkJennice

Our tech stack will be vue, mongodb, and fastapi. Joshua is familiar with using these three technologies in concert. Vue is very quick to use and has the amazing 'bootstrap vue' library which comes with great UI components. Fastapi is a python library. Most of the group is familiar with Python.

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



# Installation
Prerequisites

User should have npm, node, and git installed. Do this through nvm (Node Version Manager). They should also have the firebase-cli installed for development.

### Set up firebase
Make sure firebase CLI is installed:

`curl -sL firebase.tools | bash`

Start the emulators:

`firebase emulators:start`
# Dependencies

axios is a library that makes sending http requests with js easy.

Bootstrap adds nice css styling

Bootstrap vue is the vue specific version of bootstrap. Makes for easy integration of bootstrap into vue apps.

cors is a middleware for express that allows cross origin requests.

express is a framework for making web servers with nodejs

firebase allows us to communicate with the google firebase database.

uuid alloows us to generate uuids

vue is a frontend library for making web pages/apps

vue-advanced-chat is a vue library which implements a chat room

vue-router is meant to allow vue to programmatically manipulate the browser url

vuex is meant for storing state in vue

Eslint allows for checking of style in code

vue-cli-service is a binary for easily serving, building, and prototyping vue code
# Installation Steps

1. Pull this from the repo
2. Go here and make an account: https://www.mongodb.com/try
3. Make a mongodb cluster. Allow all ip addresses to connect. Create a user. Go to connect your application and create a connection url.
Replace "myFirstDatabase" with "studyapp" replace <password> with your password for that user of the database. Copy and paste the connection url into a .env file in the root folder. `MONGO_URL=<url_here>` This file should model "sample.env" DO NOT COMMIT TO GITHUB OR REVEAL THIS TO ANYONE BUT YOURSELF. 
4. Make a firebase project and replace this config with your own config
5. Make a heroku app
6. Link your heroku app with your own github repo
7. push this to the linked branch on your heroku app

# While developing
`npm run serve` to start the frontend
`npm run start:dev` to start the backend (with hot reloading!!)
`firebase emulators:start` to start the firebase emulators
`npm run test:server` to run unit tests for the server
# Functionality

1. Go to <url>/adminpanel and click on refresh courses. This will load 20 of current quarter''s courses into your firebase.
2. Go to <url>/ and search for a course by its I.D. (e.g. ANTH 3).
3. Click on the given link and send messages to the chat. Now everyone on that course page can see your messages!

# Known Problems
Cannot upload files to chat.

No username tracking for chat messages (yet!).
# Contributing

    Fork it!
    Create your feature branch: git checkout -b my-new-feature
    Commit your changes: git commit -am 'Add some feature'
    Push to the branch: git push origin my-new-feature
    Submit a pull request :D
