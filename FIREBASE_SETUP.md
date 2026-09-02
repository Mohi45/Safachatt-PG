# Firebase Setup Guide

This guide will help you set up Firebase for saving application data from your PG registration form.

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a new project"**
3. Enter a project name (e.g., "SafachattPG")
4. Enable Google Analytics (optional)
5. Click **"Create project"**

## Step 2: Get Firebase Credentials

1. In Firebase Console, click the **⚙️ Settings icon** → **Project Settings**
2. Scroll down to **"Your apps"** section
3. Click **"Add app"** → select **Web** (</> icon)
4. Enter app name (e.g., "SafachattPG Web")
5. Check **"Also set up Firebase Hosting for this app"** (optional)
6. Click **"Register app"**

## Step 3: Copy Firebase Configuration

You'll see your Firebase config object. It will look like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDxxxxxxxxxxx",
  authDomain: "yourproject.firebaseapp.com",
  databaseURL: "https://yourproject.firebaseio.com",
  projectId: "yourproject",
  storageBucket: "yourproject.appspot.com",
  messagingSenderId: "xxxxxxxxxx",
  appId: "1:xxxxxxxxxx:web:xxxxxxxxxxxxxxxx"
};
```

## Step 4: Update script.js with Your Credentials

1. Open `script.js` in the MyPG folder
2. Find the **FIREBASE CONFIGURATION** section at the top
3. Replace the placeholder values with your actual Firebase config:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_AUTH_DOMAIN_HERE",
    databaseURL: "YOUR_DATABASE_URL_HERE",
    projectId: "YOUR_PROJECT_ID_HERE",
    storageBucket: "YOUR_STORAGE_BUCKET_HERE",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID_HERE",
    appId: "YOUR_APP_ID_HERE"
};
```

## Step 5: Set Up Realtime Database

1. In Firebase Console, go to **Realtime Database** (left sidebar)
2. Click **"Create Database"**
3. Choose location (closest to your users)
4. Start in **Test Mode** (for development)
   - **Important**: Switch to **Production Mode** before going live
5. Click **"Enable"**

### Database Rules (Test Mode - Development Only)

When starting, these rules allow anyone to read/write:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

### Authentication Setup

1. In **Authentication → Sign-in method**, enable **Email/Password** and **Anonymous** providers.
2. Create the admin user with Email/Password.
3. Set the custom claim `{ "admin": true }` for that user using the Firebase Admin SDK from a trusted server. Never set it from browser code.

This project includes `set-admin.js` to do that safely:

```bash
npm install
```

Download the service-account JSON from **Project settings → Service accounts → Generate new private key**, save it as `serviceAccountKey.json` in the project folder, then run:

```bash
npm run set-admin -- your-admin-email@example.com
```

The key is excluded by `.gitignore`. Delete it from the project folder after use if this machine is shared.

### Database Rules (Production Mode)

For production, use these rules to restrict access:

```json
{
  "rules": {
    "applications": {
      ".read": "auth != null && auth.token.admin === true",
      "$applicationId": {
        ".write": "auth != null && ((!data.exists() && newData.exists()) || auth.token.admin === true)",
        ".validate": "newData.hasChildren(['fullName', 'email', 'dob', 'age', 'mobile']) && newData.child('fullName').isString() && newData.child('email').isString() && newData.child('mobile').isString()"
      }
    },
    "receipts": {
      ".read": "auth != null && auth.token.admin === true",
      "$receiptId": {
        ".write": "auth != null && auth.token.admin === true",
        ".validate": "newData.hasChildren(['receiptNo', 'tenantId', 'tenantName', 'totalAmount'])"
      }
    },
    "contactMessages": {
      ".read": "auth != null && auth.token.admin === true",
      "$messageId": {
        ".write": "auth != null && ((!data.exists() && newData.exists()) || auth.token.admin === true)",
        ".validate": "newData.hasChildren(['name', 'email', 'message']) && newData.child('name').isString() && newData.child('email').isString() && newData.child('message').isString()"
      }
    }
  }
}
```

These rules allow anonymous visitors to submit a new application, but prevent them from reading applications or writing receipts. Only an admin account with the custom claim can read or manage either collection.

## Step 6: Verify the Database URL

1. Your database URL should look like: `https://yourproject.firebaseio.com`
2. Make sure it includes `/yourproject` at the end

## How It Works

1. **Age Calculation**: When a user selects a date of birth, the age is automatically calculated
2. **Form Submission**: When the form is submitted:
   - Data is validated
   - Age is auto-calculated
   - Data is saved to Firebase Realtime Database
   - Success message is shown

## Database Structure

Your applications will be saved in this structure:

```
applications/
  └── [timestamp]/
      ├── fullName: "John Doe"
      ├── fatherName: "Father Name"
      ├── motherName: "Mother Name"
      ├── dob: "2005-03-15"
      ├── age: 21
      ├── mobile: "9876543210"
      ├── email: "john@example.com"
      ├── address: "..."
      ├── institution: "..."
      ├── roomType: "Double Sharing"
      ├── submittedAt: "2026-05-15T10:30:00Z"
      └── ... (other fields)
```

## Testing

1. Open your application form page (`apply.html`)
2. Fill in the form with test data
3. Enter a **Date of Birth** - age should auto-fill
4. Submit the form
5. Check Firebase Console → Realtime Database to see the saved data

## Troubleshooting

### Age not calculating
- Make sure the `dob` field has a valid date
- Check browser console for errors
- Verify the `id="dob"` and `id="age"` in apply.html

### Data not saving to Firebase
- Verify Firebase config is correct
- Check browser console for errors
- Ensure database rules allow writes
- Check database URL format

### Firebase not loading
- Verify internet connection
- Check if Firebase CDN is accessible
- Look for errors in browser console

## Security Notes

⚠️ **Important**: 
- Keep your `apiKey` secret (though Firebase API keys have limited permissions)
- Switch from Test Mode to Production Mode before going live
- Implement proper authentication if storing sensitive data
- Consider using Firebase Cloud Storage for file uploads instead of storing as text

## Next Steps

1. Set up user authentication (optional)
2. Configure Cloud Storage for file uploads
3. Set up Firestore for more complex data
4. Add admin dashboard to view submissions
5. Configure email notifications on new submissions

---

For more help, visit [Firebase Documentation](https://firebase.google.com/docs)
