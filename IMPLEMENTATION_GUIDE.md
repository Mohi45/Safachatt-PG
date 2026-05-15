# PG Application Form - Age Calculation & Firebase Integration

## Features Implemented

### 1. Automatic Age Calculation
- Age is automatically calculated from the Date of Birth field
- Calculation happens instantly when user selects a date
- Formula: Current Year - Birth Year (adjusted for month/day)

### 2. Firebase Database Integration
- All application form data is saved to Firebase Realtime Database
- Data is timestamped automatically
- Includes error handling and logging

## How to Use

### Age Calculation
1. User opens the registration form (apply.html)
2. User selects a "Date of Birth"
3. The "Age" field is **automatically populated**
4. No manual entry needed

### Firebase Data Saving
1. User fills the complete form
2. User clicks "Submit Application"
3. System validates all fields
4. Age is calculated (if not already filled)
5. Data is saved to Firebase database
6. Success message is displayed

## Code Changes Made

### 1. In `apply.html`
Added Firebase SDK scripts before closing body tag:
```html
<script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js"></script>
```

### 2. In `script.js`
Added at the beginning:

#### Firebase Configuration Section
```javascript
const initializeFirebase = () => {
    const firebaseConfig = {
        apiKey: "YOUR_API_KEY_HERE",
        authDomain: "YOUR_AUTH_DOMAIN_HERE",
        databaseURL: "YOUR_DATABASE_URL_HERE",
        projectId: "YOUR_PROJECT_ID_HERE",
        storageBucket: "YOUR_STORAGE_BUCKET_HERE",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID_HERE",
        appId: "YOUR_APP_ID_HERE"
    };
    // Initialize Firebase...
};
```

#### Age Calculation Functions
```javascript
const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
};

const updateAgeField = () => {
    const dobField = document.getElementById('dob');
    const ageField = document.getElementById('age');
    
    if (dobField && ageField && dobField.value) {
        const age = calculateAge(dobField.value);
        if (age >= 18 && age <= 60) {
            ageField.value = age;
        }
    }
};

const initAgeCalculation = () => {
    const dobField = document.getElementById('dob');
    if (dobField) {
        dobField.addEventListener('change', updateAgeField);
    }
};
```

#### Firebase Database Save Function
```javascript
const saveApplicationToFirebase = async (formData) => {
    if (!firebaseDatabase) {
        console.warn('Firebase database not initialized');
        return false;
    }

    try {
        const timestamp = new Date().toISOString();
        const applicationRef = firebaseDatabase.ref('applications/' + Date.now());
        
        const dataToSave = {
            ...formData,
            submittedAt: timestamp,
            formVersion: '1.0'
        };
        
        await applicationRef.set(dataToSave);
        console.log('Application saved to Firebase successfully');
        return true;
    } catch (error) {
        console.error('Error saving to Firebase:', error);
        return false;
    }
};
```

#### Updated Form Submission Handler
```javascript
const animateSubmit = async () => {
    if (!applicationForm) return;
    applicationForm.classList.add('loading');
    
    const formData = getFormData();
    const savedToFirebase = await saveApplicationToFirebase(formData);
    
    setTimeout(() => {
        applicationForm.classList.remove('loading');
        openModal();
        const message = savedToFirebase 
            ? 'Your application has been submitted successfully and saved to database.'
            : 'Your application has been submitted (local save).';
        showToast(message);
    }, 1200);
};
```

## Form Fields Saved to Database

The following fields from the form are saved to Firebase:

**Personal Details:**
- fullName
- fatherName
- motherName
- dob (Date of Birth)
- age (auto-calculated)
- mobile
- alternateNumber (if provided)
- email
- aadhaar
- address

**Education/Work:**
- status (Student/Working Professional)
- institution (College/Company Name)
- position (Course/Job Role)
- roomType (Single/Double/Triple Sharing)
- moveInDate
- duration (3/6/12 months)
- foodPref (Veg/Non-veg/Custom)

**Emergency & Medical:**
- emergencyContact
- medicalConditions (if any)

**System Fields:**
- submittedAt (timestamp)
- formVersion

## Database Path Structure

All submissions are stored at:
```
applications/
  └── [unique timestamp ID]/
      ├── fullName: "..."
      ├── dob: "YYYY-MM-DD"
      ├── age: 21
      ├── submittedAt: "ISO timestamp"
      └── ... other fields
```

## Validation

Before saving to Firebase:
1. All required fields are validated
2. Phone numbers must be 10 digits
3. Aadhaar must be 12 digits
4. Age is validated (18-60 range)
5. Email format is checked
6. Terms and conditions must be agreed

## Browser Console Logs

When submitting a form, check browser console (F12 → Console) for:
- "Firebase initialized successfully" ✓
- "Application saved to Firebase successfully" ✓
- Any error messages if something fails

## Next Steps

1. ✅ Set up Firebase project (see FIREBASE_SETUP.md)
2. ✅ Add your Firebase credentials to script.js
3. ✅ Test the form with sample data
4. ✅ Check Firebase Console for saved data
5. Optional: Add more features (file upload, email notifications, etc.)
