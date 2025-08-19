# Firebase Setup Guide

This guide will help you set up Firebase authentication for the Cyber Security Flashcards app.

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "cyber-security-flashcards")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## 2. Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable the following providers:
   - **Email/Password**: Click "Enable" and save
   - **Google**: Click "Enable", add your authorized domain, and save
   - **Anonymous**: Click "Enable" and save

## 3. Set up Firestore Database

1. Go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" for development (you can secure it later)
4. Select a location close to your users
5. Click "Done"

## 4. Get Your Firebase Configuration

1. Go to "Project settings" (gear icon in the top left)
2. Scroll down to "Your apps" section
3. Click the web icon (</>) to add a web app
4. Enter an app nickname (e.g., "Cyber Security Flashcards")
5. Click "Register app"
6. Copy the configuration object

## 5. Set Up Environment Variables

1. Create a `.env.local` file in the root of your project
2. Add the following variables with your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 6. Security Rules (Optional)

For production, you should set up proper Firestore security rules. Here's a basic example:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Allow access to user's progress and changes
      match /{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

## 7. Test the Setup

1. Start your development server: `npm run dev`
2. Click the "Sign In" button in the top right
3. Try creating an account with email/password
4. Try signing in with Google
5. Try the "Continue as Guest" option

## Features Implemented

- ✅ Email/Password authentication
- ✅ Google Sign-In
- ✅ Anonymous authentication
- ✅ User profile management
- ✅ Progress synchronization
- ✅ Offline support with local storage
- ✅ Modern UI with animations

## Troubleshooting

### Common Issues

1. **"Firebase: Error (auth/popup-blocked)"**
   - Make sure popups are allowed for your domain
   - Add your domain to authorized domains in Firebase Console

2. **"Firebase: Error (auth/unauthorized-domain)"**
   - Add your domain to authorized domains in Firebase Console
   - For localhost, add `localhost` and `127.0.0.1`

3. **Environment variables not loading**
   - Make sure the file is named `.env.local` (not `.env`)
   - Restart your development server after adding environment variables

4. **Firestore permission errors**
   - Check that your security rules allow the operations you're trying to perform
   - Make sure you're in test mode for development

### Getting Help

- Check the Firebase documentation: https://firebase.google.com/docs
- Review the browser console for detailed error messages
- Ensure all environment variables are correctly set
