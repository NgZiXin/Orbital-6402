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

2. Edit Frontend/config.py and change `api_endpoint` to your desired api endpoint (usually its device's IP Address)

3. Start the app

   ```bash
    npx expo start --tunnel
   ```

4. Scan the QR Code displayed on the terminal. If you are on IOS, use the phone camera. If you are on Android, use the Expo app's QR scanner. 


### Setting up the Back-end:

1. Activate the virtualenv for your project.
    
2. Install project dependencies:

   ```bash
    pip install -r requirements/local.txt
   ```
    
3. Configure backend/backend/settings.py:
   - Under `DATABASES`, change to your own PostgreSQL database and user
     - To set up PostgreSQL, you can refer to this [guide](https://www.microfocus.com/documentation/idol/IDOL_12_0/MediaServer/Guides/html/English/Content/Getting_Started/Configure/_TRN_Set_up_PostgreSQL.htm) 

   - Under `ALLOWED_HOSTS`, add your local device's IP address

4. Apply the migrations:

   ```bash
    python manage.py migrate
   ```
   
5. You can now run the development server:

   ```bash
    python manage.py runserver 0.0.0.0:8000
   ```
    
## 💙 The Team

This project was made possible by two epic team members! <br> 
[Team Member 1](https://github.com/NgZiXin) <br>
[Team Member 2](https://github.com/YangQF2002) 

