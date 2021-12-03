1. Fork the repo and then clone onto your machine.

# Creating a Heroku Account
1. Go here: https://signup.heroku.com/ and create an account.
2. Then go here: https://dashboard.heroku.com/apps and click on "New" in the upper right corner and click on "Create new app"
3. Enter an app name and then click "Create App."
4. Then change your deployment method to GitHub and search for your forked repo to connect with heroku.


# Setting up MongoDB 
1. Go here and make an account: https://www.mongodb.com/try
2. Select "Build a new application" as your goal. "Content management" for "What type of application are you building today?" "JavaScript" as your preferred language.
3. Create a "shared" cluster. Select AWS as your provider, and Oregon as your region. Click "Create Cluster."
4. Enter a unique username and password for creating a user under the step of "How would you like to authenticate your connection." When entering an IP address, enter `0.0.0.0` This will allow you to connect from anywhere. Hit "Finish and Close" and then "Go to database."
5. Now click on "Connect," right next to the name of your cluster. Click "Connect your application." Copy the URL and go to the settings tab of your heroku app. Click "reveal config vars." Make a config var called "MONGO_URL" and use the url as the value.  Now replace the <password> with your password that you created for the database user (NOT the password for the Mongo Atlas website itself). Replace "myFirstDatabase" with "studyapp."

# Setting up UCSB API Access
1. Ask us for a ucsb api key. It takes too long to get it approved.
2. Put this api key in another heroku config var called: UCSB_API_KEY

# Setting up firebase
1. Go here and make sure you are logged in with your ucsb account: https://console.firebase.google.com/
2. Click on "Add Project."
3. Add a name for this project. Make sure to set the "Folder in organization ucsb.edu" to "UnPaid" Click Continue and then Continue on the next page.
4. Choose the Default Account for Firebase as your Google Analytics account.
5. Click Create Project.
6. Go to the project overview page.
7. Go to the Authentication section underneath "Build" and click "Get started." 
8. Click on Add Domain and add the url that heroku gives you for your project. Should be in this format: YOUR_PROJECT_NAME_HERE.herokuapp.com You can also find it in the Settings tab of your Heroku project.
9. Click on "Google" for your additional providers. Click on the enable switch. Choose a name that google will use in the auth screen. I recommend "UCSB Study Group App." Choose your project support email. Click on Save.
10. Now go to "Firestore database" underneath "Build" and click on "Start in Test mode."  Click on Next and choose a region for your database. Click "Enable." 
11. Click on the Rules tab on the top of the page and replace the current rules with this:
  ```
  rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
  ```
12. Click on the Indexes tab and then put in collection ID, 'chatRooms'. Put in a field name `users` and then select Arrays. Put in a second field name `lastUpdated` and then select Descending. Choose Collection as your query scope. Click "Create Index."
13. Click on the gear next to "Project Overview." Go to the "Service Accounts" tab. Click on "Generate New Private Key." Copy the contents of this file and put it in an env var in heroku called: FIREBASE_CONFIG.
14. Go back to Project Overview and click on the `</>` symbol. Type in a nickname for your web app. click "register app." Copy only the firebase config object. Go to this website: https://www.convertsimple.com/convert-javascript-to-json/ and convert it to JSON. (Don't worry this info will be public anyway so there's no risk of revealing it to anyone) and paste it into an environment variable called "VUE_APP_FIREBASE_CONFIG."

# Final steps
1. Click "Deploy Branch" in the bottom of the deploy tab of heroku for your app.
2. Sign in with a ucsb account.
3. Go to AdminPanel and click on refresh quarter. This will load all the current classes into the database. 
4. Search for a class using the search bar and join it.
5. Have a few others sign in and join the same class. Then you can test out the chat room creation by searching for your friends and adding them in a chat room.
