## 🌟 Introduction

🧙 Workout Wizards 🧙 is a fitness app that complements the popular Strava fitness app. Its aim is to help local Singaporean users along in their fitness journey. It implements many meaningful features, such as personalized workout and running route recommendations. <br> 

The overall objective of this app is to elevate the standard of fitness guidance and support available to Singaporean Strava users, tailoring each aspect of their exercise regimen for an optimized and engaging workout journey that they will enjoy.


## 📋 Table of Contents

- [🗺 Project Layout](#-project-layout)
- [📚 Getting started](#-getting-started)
- [💙 The Team](#-the-team)

## 🗺 Project Layout

[`Frontend`](https://github.com/NgZiXin/Orbital-6402/tree/main/Frontend) The front-end of the app, built using React Native and TypeScript!<br>
[`app`](https://github.com/NgZiXin/Orbital-6402/tree/main/Frontend/app) The main frontend logic behind the app <br>
[`styles`](https://github.com/NgZiXin/Orbital-6402/tree/main/Frontend/styles) Global CSS styles reused across the app <br> 
[`utility`](https://github.com/NgZiXin/Orbital-6402/tree/main/Frontend/utility) Helper components and functions <br>
[`backend`](https://github.com/NgZiXin/Orbital-6402/tree/main/backend) The back-end of the app, built using Django and PostgreSQL! <br>


## 📚 Getting Started

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app). 
To learn more about Expo, do look at the following resources:
- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with their [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.


### Setting up the Front-end:

1. Install dependencies

   ```bash
   npm install
   ```

2. Create `.env` in the root folder 

3. Add the following attributes in the .env file. You may find your ip address by running `ipconfig` in your terminal. In setting up a postgres database for the django backend, you may this website useful: https://www.digitalocean.com/community/tutorials/how-to-use-postgresql-with-your-django-application-on-ubuntu-20-04

```
# API Endpoint
# Local device's IP address
REACT_APP_DOMAIN='your device ip address'

# DB Config
DATABASE_NAME='postgres database name'
DATABASE_USER='postgres user'
DATABASE_PASSWORD='postgres database password'
DATABASE_HOST='postgres host' 
DATABASE_PORT='postgres port'
```
An example of an .env file:
```
# API Endpoint
# Local device's IP address
REACT_APP_DOMAIN='100.100.10.10'

# DB Config
DATABASE_NAME='orbital'
DATABASE_USER='Tom'
DATABASE_PASSWORD='12345'
DATABASE_HOST='localhost' 
DATABASE_PORT='5432'
```


4. Start the app

   ```bash
    npx expo start --tunnel
   ```

5. Scan the QR Code displayed on the terminal. If you are on IOS, use the phone camera. If you are on Android, use the Expo app's QR scanner. 


### Setting up the Back-end:

1. Activate the virtualenv for your project.
    
2. Install project dependencies:

   ```bash
    pip install -r requirements/local.txt
   ```
   

3. Apply the migrations:

   ```bash
    python manage.py migrate
   ```
   
4. You can now run the development server:

   ```bash
    python manage.py runserver 0.0.0.0:8000
   ```


    
## 💙 The Team

This project was made possible by two epic team members! <br> 
[Team Member 1](https://github.com/NgZiXin) <br>
[Team Member 2](https://github.com/YangQF2002) 

