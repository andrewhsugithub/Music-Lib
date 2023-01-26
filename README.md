# Music Lib

![demo](https://github.com/andrewhsugithub/Music-Lib/blob/master/src/assets/img/demo.png)
A music library for you to listen and store your favorite music. Create your own playlist in a personal space authenticated with Firebase. Explore all the features [here]() and have fun!

## How to create your own Music Lib with your own Firebase account?

1. Create a new project in Firebase
2. Copy the API details and paste it in [firebase.js](https://github.com/andrewhsugithub/Music-Lib/blob/master/src/firebase.js)
3. Open your terminal and type `npx create-react-app project-name` and `npm start`

## Why I didn't hide my API key?

You can go API credentials in Google https://console.developers.google.com/apis/credentials ,click on the "Browser Key", and then you can restrict your API key.

Read [here](https://jsmobiledev.com/article/hide-firebase-api/) for more details.

### Features

1. Sign in/Sign up
   ![sign-in](https://github.com/andrewhsugithub/Music-Lib/blob/master/src/assets/img/signIn.png)
   You can either sign in with Google or with your own email account, all data will be authenticated with Firebase.

2. Upload your Album
   ![upload](https://github.com/andrewhsugithub/Music-Lib/blob/master/src/assets/img/upload.png)
   You have to have at least your album image, album audio, and album name to be able to upload. All data will be stored in Firebase database and Firebase storage.

3. Edit/Delete your Album
   ![edit](https://github.com/andrewhsugithub/Music-Lib/blob/master/src/assets/img/edit.png)
   You can edit details such as album image, audio, description, etc... and save it, and again image, audio, name shouldn't be left blank, or you can also delete the whole album.
