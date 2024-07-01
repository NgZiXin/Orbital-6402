## 🌟 Introduction

🧙 Workout Wizards 🧙 is a fitness app that complements the popular Strava fitness app. Its aim is to help local Singaporean users along in their fitness journey. It implements many meaningful features, such as personalized workout and running route recommendations. <br> 

The overall objective of this app is to elevate the standard of fitness guidance and support available to Singaporean Strava users, tailoring each aspect of their exercise regimen for an optimized and engaging workout journey that they will enjoy.


## 📋 Table of Contents

- [🌟 Introduction](#-introduction)
- [🗺 Project Layout](#-project-layout)
- [📚 Getting Started](#-getting-started)
- [📅 Current Progress](#-current-progress)
- [💙 The Team](#-the-team)


## 🗺 Project Layout

[`Frontend`](https://github.com/NgZiXin/Orbital-6402/tree/main/Frontend) The front-end of the app, built using React Native and TypeScript!<br>
[`app`](https://github.com/NgZiXin/Orbital-6402/tree/main/Frontend/app) The main frontend logic behind the app <br>
[`components`](https://github.com/NgZiXin/Orbital-6402/tree/main/Frontend/components) Helper components, functions and constants <br>
[`styles`](https://github.com/NgZiXin/Orbital-6402/tree/main/Frontend/styles) Common CSS styles reused across the app <br> 
[`backend`](https://github.com/NgZiXin/Orbital-6402/tree/main/backend) The back-end of the app, built using Django and PostgreSQL! <br>


## 📚 Getting Started

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app). 
To learn more about Expo, do look at the following resources:
- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with their [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.
- Required software: Python, Node Package Manager (NPM), PostgresSQL


### Setting up the Front-end:

1. Navigate into `Frontend` folder. 
   > Note that all the following commands and creations are to be done in this subfolder.

   ```bash
      cd ./Frontend
   ```

2. Install dependencies in the `Frontend` folder.

   ```bash
      npm install
   ```

3. Create `.env` file under `Frontend` folder

   ```bash
      touch .env
   ```

4. Add the following attribute into the .env file. 
   > If it is your first time developing mobile application, the most straight-forward way to access your back-end sever during development is to connect to localhost over the same Wifi network. You can refer to this [webpage](https://prowe214.medium.com/tip-how-to-view-localhost-web-apps-on-your-phone-ad6b2c883a7c) for more infomation.  

   ```
      # API Endpoint
      EXPO_PUBLIC_DOMAIN='your back-end domain'
   ```

   An example of an `.env` file:
   ```
      # API Endpoint
      EXPO_PUBLIC_DOMAIN='http://191.300.50.50:8000/'
   ```

4. Start the app 

   ```bash
      npx expo start --tunnel
   ```

5. Scan the QR Code displayed on the terminal. Alternatively, view the app on an emulator. <br>

### Setting up the Back-end:

1. Before setting up the back-end, you will need a [OneMap account](https://www.onemap.gov.sg/apidocs/register), [Strava account](https://www.strava.com/register/free) and a local [Postgres database](https://www.digitalocean.com/community/tutorials/how-to-use-postgresql-with-your-django-application-on-ubuntu-20-04) set up.

2. Navigate into `./backend` folder. 
   > Note that all the following commands and creations are to be done in this subfolder.

   ```bash
      cd ./backend
   ```

3. Create a virtual environment in the `backend` folder.
   > This command will create a `venv` subfolder.

   ```bash
      python -m venv venv
   ```

4. Activate the virtual environment

   ```bash
      venv\Scripts\activate
   ```

5. Install all dependencies

   ```bash
      pip install -r ./requirements.txt
   ```

6. Create `.env` file under the ./backend folder

   ```bash
      touch .env
   ```

7. Add the following attributes into the .env file. 

   ```
      # DB Config
      DATABASE_NAME='your postgres database name'
      DATABASE_USER='your postgres user'
      DATABASE_PASSWORD='your postgres database password'
      DATABASE_HOST='your postgres host' 
      DATABASE_PORT='your postgres port'

      # OneMap API Config 
      ONEMAP_EMAIL= 'your onemap account email'
      ONEMAP_EMAIL_PASSWORD = 'your onemap account password'
      ```

      An example of an `.env` file:
      ```
      # DB Config
      DATABASE_NAME='orbital'
      DATABASE_USER='Tom'
      DATABASE_PASSWORD='12345'
      DATABASE_HOST='localhost' 
      DATABASE_PORT='5432'

      # One Map API Config 
      ONEMAP_EMAIL= 'tom@gmail.com'
      ONEMAP_EMAIL_PASSWORD = 'tom123' 
   ```

   
8. Apply the migrations:

   ```bash
      python manage.py migrate
   ```

   
9. You can now run the backend development server:

   ```bash
      python manage.py runserver 0.0.0.0:8000
   ```

10. Whitelist metro's domain in Strava's callback domain field.


## 📅 Current Progress
The following pages have been implemented
- Sign up page
- Login page
- Location page
- Stats page 

Please note that the rest of the app is still in development.
    
## 💙 The Team

This project was made possible by two epic team members! <br> 
[Team Member 1](https://github.com/NgZiXin) <br>
[Team Member 2](https://github.com/YangQF2002) 

