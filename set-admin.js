const admin = require('firebase-admin');
const path = require('path');

const adminEmail = process.argv[2] || process.env.ADMIN_EMAIL;
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT || path.join(__dirname, 'serviceAccountKey.json');

if (!adminEmail) {
    console.error('Usage: node set-admin.js your-admin-email@example.com');
    process.exit(1);
}

try {
    const serviceAccount = require(serviceAccountPath);

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });

    admin.auth().getUserByEmail(adminEmail)
        .then((user) => admin.auth().setCustomUserClaims(user.uid, { admin: true }))
        .then(() => {
            console.log(`Admin claim set for ${adminEmail}`);
            console.log('Sign out and sign in again in the website to refresh permissions.');
        })
        .catch((error) => {
            console.error('Unable to set admin claim:', error.message);
            process.exitCode = 1;
        });
} catch (error) {
    console.error('Unable to load Firebase service-account key.');
    console.error(`Expected file: ${serviceAccountPath}`);
    console.error(error.message);
    process.exitCode = 1;
}
