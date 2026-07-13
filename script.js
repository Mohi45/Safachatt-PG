// ======== FIREBASE CONFIGURATION ========
// Replace with your Firebase project credentials
let firebaseApp;
let firebaseDatabase;

const initializeFirebase = () => {
    try {
        // Configure your Firebase project here
        const firebaseConfig = {
            apiKey: "AIzaSyBx0_BJ9UpIf4h300WO2FX2VKp7DgjC8oY",
            authDomain: "safachattpg.firebaseapp.com",
            databaseURL: "https://safachattpg-default-rtdb.firebaseio.com/",
            projectId: "safachattpg",
            storageBucket: "safachattpg.appspot.com",
            messagingSenderId: "995130651401",
            appId: "1:995130651401:web:a9320f26512c9314b519d8"
        };

        // Initialize Firebase with compat version
        if (typeof firebase !== 'undefined') {
            if (!firebase.apps.length) {
                firebaseApp = firebase.initializeApp(firebaseConfig);
                firebaseDatabase = firebase.database();
                console.log('✅ Firebase initialized successfully');
                console.log('Database URL:', firebaseConfig.databaseURL);
            } else {
                firebaseDatabase = firebase.database();
                console.log('✅ Firebase already initialized');
            }
        } else {
            console.error('❌ Firebase SDK not loaded. Make sure you are using http:// or https://, not file://');
        }
    } catch (error) {
        console.error('❌ Firebase initialization error:', error);
        console.error('Make sure: 1) Using local server (http://), 2) Database is enabled in Firebase Console, 3) Credentials are correct');
    }
};

// ======== AGE CALCULATION ========
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
        if (!Number.isNaN(age) && age >= 0) {
            ageField.value = age;
        } else {
            ageField.value = '';
        }
    }
};

const initAgeCalculation = () => {
    const dobField = document.getElementById('dob');
    if (dobField) {
        // Trigger on both 'change' and 'input' events for better UX
        dobField.addEventListener('change', updateAgeField);
        dobField.addEventListener('input', updateAgeField);
        // Also calculate age on page load if dob is already filled
        if (dobField.value) {
            updateAgeField();
        }
    }
};

// ======== FIREBASE DATABASE OPERATIONS ========
const saveApplicationToFirebase = async (formData) => {
    if (!firebaseDatabase) {
        console.warn('Firebase database not initialized');
        return false;
    }

    try {
        const timestamp = new Date().toISOString();
        const applicationRef = firebaseDatabase.ref('applications/' + Date.now());

        // Prepare data without files
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

// ======== DOM ELEMENT REFERENCES ========
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.querySelector('.nav-menu');
const themeToggle = document.getElementById('themeToggle');
const typeText = document.getElementById('typeText');
const backToTop = document.getElementById('backToTop');
const toast = document.getElementById('toast');
const successModal = document.getElementById('successModal');
const closeModal = document.getElementById('closeModal');
const pageLoader = document.getElementById('page-loader');
const lightbox = document.getElementById('lightbox');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxImage = lightbox?.querySelector('img');
const galleryItems = document.querySelectorAll('.gallery-item');
const applicationForm = document.getElementById('applicationForm');
const contactForm = document.getElementById('contactForm');
const faqButtons = document.querySelectorAll('.faq-question');
const counters = document.querySelectorAll('.counter');
const testimonialCards = document.querySelectorAll('.testimonial-card');
const adminApplicationsTableBody = document.getElementById('applicationsTableBody');
const adminContactsTableBody = document.getElementById('contactsTableBody');
const adminTotalApplications = document.getElementById('adminTotalApplications');
const adminTotalContacts = document.getElementById('adminTotalContacts');
const refreshAdminButton = document.getElementById('refreshAdmin');
const adminLoginOverlay = document.getElementById('adminLoginOverlay');
const adminPasswordInput = document.getElementById('adminPassword');
const adminUnlockButton = document.getElementById('adminUnlockButton');
const adminTabButtons = document.querySelectorAll('.admin-tab-button');
const adminPanels = document.querySelectorAll('.admin-panel');
const adminLoginButton = document.getElementById('adminLoginButton');
const adminSearchInput = document.getElementById('studentNameSearch');
const adminTableScroll = document.getElementById('applicationsTableScroll');
const adminTableScrollTop = document.getElementById('applicationsTableScrollTop');
const adminAccessKey = 'safachatt-admin-access';
const adminPassword = 'Safachatt2026!';

let adminApplicationEntriesCache = [];
let adminContactEntriesCache = [];

const typedWords = ['comfort', 'security', 'harmony', 'community'];
let typedIndex = 0;
let charIndex = 0;
let typingForward = true;

const toggleMenu = () => {
    navMenu.classList.toggle('open');
    menuToggle.classList.toggle('active');
};

const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast.hideTimeout);
    toast.hideTimeout = setTimeout(() => toast.classList.remove('show'), 3200);
};

const openModal = () => {
    if (successModal) {
        successModal.classList.add('open');
        successModal.setAttribute('aria-hidden', 'false');
        closeModal?.focus();
    }
};
const closeModalWindow = () => {
    if (successModal) {
        successModal.classList.remove('open');
        successModal.setAttribute('aria-hidden', 'true');
    }
};

const startTyping = () => {
    if (!typeText) return;
    const word = typedWords[typedIndex];
    if (typingForward) {
        typeText.textContent = word.slice(0, charIndex + 1);
        charIndex += 1;
        if (charIndex === word.length) {
            typingForward = false;
            setTimeout(startTyping, 1300);
            return;
        }
    } else {
        typeText.textContent = word.slice(0, charIndex - 1);
        charIndex -= 1;
        if (charIndex === 0) {
            typingForward = true;
            typedIndex = (typedIndex + 1) % typedWords.length;
        }
    }
    setTimeout(startTyping, typingForward ? 120 : 60);
};

const updateThemeIcon = () => {
    const themeIcon = themeToggle.querySelector('.theme-icon');
    if (document.documentElement.dataset.theme === 'dark') {
        themeIcon.textContent = '☀️';
    } else {
        themeIcon.textContent = '🌙';
    }
};

const loadTheme = () => {
    const savedTheme = localStorage.getItem('bloom-theme');
    if (savedTheme) {
        document.documentElement.dataset.theme = savedTheme;
    }
    updateThemeIcon();
};

const saveTheme = (theme) => {
    localStorage.setItem('bloom-theme', theme);
};

const revealOnScroll = () => {
    const reveals = document.querySelectorAll('.reveal');
    if (revealObserver && reveals.length) {
        revealObserver.observe(document.body);
        reveals.forEach((section) => revealObserver.observe(section));
    }
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.18 });

const handleCounter = () => {
    counters.forEach((counter) => {
        const updateCount = () => {
            const target = +counter.dataset.target;
            const current = +counter.textContent;
            const increment = Math.ceil(target / 120);
            if (current < target) {
                counter.textContent = current + increment;
                requestAnimationFrame(updateCount);
            } else {
                counter.textContent = target;
            }
        };
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    updateCount();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        counterObserver.observe(counter);
    });
};

const smoothScroll = (event) => {
    if (event.target.matches('.nav-menu a')) {
        const href = event.target.getAttribute('href');
        if (href && href.startsWith('#')) {
            event.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                navMenu?.classList.remove('open');
            }
        }
    }
};

const toggleBackToTop = () => {
    backToTop.classList.toggle('visible', window.scrollY > 500);
};

const sanitizeText = (value) => {
    return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
};

const formatSubmittedAt = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? sanitizeText(value) : date.toLocaleString();
};

const isImageUrl = (value) => {
    if (!value || typeof value !== 'string') return false;
    return value.startsWith('data:image/') || value.startsWith('http') || /\.(jpe?g|png|webp|gif|svg)$/i.test(value);
};

const fileToDataUrl = (file) => {
    return new Promise((resolve, reject) => {
        if (!(file instanceof File)) {
            reject(new Error('Invalid file object'));
            return;
        }
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Failed to read file as data URL'));
        reader.readAsDataURL(file);
    });
};

const toggleAdminPanel = (panelName) => {
    adminTabButtons.forEach((button) => {
        button.classList.toggle('active', button.dataset.panel === panelName);
    });
    adminPanels.forEach((panel) => {
        panel.classList.toggle('hidden', panel.dataset.panel !== panelName);
    });
};

const getResidentStatus = (data) => {
    const today = new Date();
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const moveOutDate = data?.moveOutDate;
    const moveInDate = data?.moveInDate;

    if (moveOutDate) {
        const parsedMoveOutDate = new Date(moveOutDate);
        const normalizedMoveOutDate = new Date(parsedMoveOutDate.getFullYear(), parsedMoveOutDate.getMonth(), parsedMoveOutDate.getDate());
        if (!Number.isNaN(normalizedMoveOutDate.getTime()) && normalizedMoveOutDate <= todayDate) {
            return { label: 'Checked Out', className: 'checked-out' };
        }
        if (!Number.isNaN(normalizedMoveOutDate.getTime())) {
            return { label: 'Leaving Soon', className: 'leaving-soon' };
        }
    }

    if (moveInDate) {
        return { label: 'Active', className: 'active' };
    }

    return { label: 'Pending', className: 'pending' };
};

const unlockAdminAccess = () => {
    const entered = adminPasswordInput?.value ?? '';
    if (entered === adminPassword) {
        adminLoginOverlay?.classList.add('hidden');
        document.body.classList.remove('admin-login-hidden');
        loadAdminData();
        showToast('Admin access granted.');
        if (adminPasswordInput) {
            adminPasswordInput.value = '';
        }
    } else {
        showToast('Incorrect password. Please try again.');
        if (adminPasswordInput) {
            adminPasswordInput.value = '';
            adminPasswordInput.focus();
        }
    }
};

const checkAdminAccess = () => {
    if (!adminLoginOverlay) return;

    localStorage.removeItem(adminAccessKey);
    document.body.classList.add('admin-login-hidden');
    adminLoginOverlay.classList.remove('hidden');

    if (adminPasswordInput) {
        adminPasswordInput.value = '';
        adminPasswordInput.focus();
    }
};

const createApplicationDetails = (data) => {
    if (!data) return '-';
    const rows = [
        ['Father Name', data.fatherName],
        ['Mother Name', data.motherName],
        ['DOB', data.dob],
        ['Age', data.age],
        ['Move-in Date', data.moveInDate],
        ['Move Out Date', data.moveOutDate],
        ['Alternate Number', data.alternateNumber],
        ['Aadhaar', data.aadhaar],
        ['Address', data.address],
        ['Status', data.status],
        ['Institution', data.institution],
        ['Course / Role', data.position],
        ['Food Preference', data.foodPref],
        ['Emergency Contact', data.emergencyContact],
        ['Medical Conditions', data.medicalConditions],
        ['Passport Photo', data.passportPhoto],
        ['Aadhaar Upload', data.aadhaarUpload],
        ['ID Card Upload', data.idCardUpload]
    ];
    return `
        <details class="admin-details">
            <summary>View all fields</summary>
            <div class="details-grid">
                ${rows.map(([label, value]) => `<div><strong>${sanitizeText(label)}:</strong> ${sanitizeText(value || '-')}</div>`).join('')}
            </div>
        </details>
    `;
};

const updateMoveOutDateInFirebase = async (entryId, value) => {
    if (!firebaseDatabase || !entryId) return false;
    try {
        await firebaseDatabase.ref(`applications/${entryId}`).update({ moveOutDate: value || '' });
        showToast('Move-out date updated.');
        return true;
    } catch (error) {
        console.error('Error updating move-out date:', error);
        showToast('Unable to update move-out date.');
        return false;
    }
};

const attachMoveOutDateHandlers = () => {
    document.querySelectorAll('.admin-move-out-date').forEach((input) => {
        input.addEventListener('change', async (event) => {
            const target = event.currentTarget;
            const entryId = target.dataset.entryId;
            await updateMoveOutDateInFirebase(entryId, target.value);
        });
    });
};

const filterApplicationEntries = (entries, query = '') => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return entries;

    return entries.filter(([, data]) => {
        const studentName = String(data?.fullName || '').toLowerCase();
        return studentName.includes(normalizedQuery);
    });
};

const handleApplicationSearch = () => {
    if (!adminSearchInput) return;
    const filteredEntries = filterApplicationEntries(adminApplicationEntriesCache, adminSearchInput.value);
    renderApplicationsTable(filteredEntries);
    updateAdminTotals(filteredEntries, adminContactEntriesCache);
};

const renderApplicationsTable = (entries) => {
    if (!adminApplicationsTableBody) return;
    if (!entries.length) {
        adminApplicationsTableBody.innerHTML = '<tr><td colspan="10">No applications found.</td></tr>';
        return;
    }



    const fieldLabels = [
        ['Applicant Name', 'fullName'],
        ['Photo', 'passportPhoto'],
        ['Email', 'email'],
        ['Father Name', 'fatherName'],
        ['Mother Name', 'motherName'],
        ['DOB', 'dob'],
        ['Age', 'age'],
        ['Move-in Date', 'moveInDate'],
        ['Move Out Date', 'moveOutDate'],
        ['Resident Status', 'residentStatus'],
        ['Alternate Number', 'alternateNumber'],
        ['Aadhaar', 'aadhaar'],
        ['Address', 'address'],
        ['Status', 'status'],
        ['Institution', 'institution'],
        ['Course / Role', 'position'],
        ['Food Preference', 'foodPref'],
        ['Emergency Contact', 'emergencyContact'],
        ['Medical Conditions', 'medicalConditions'],
        ['Aadhaar Upload', 'aadhaarUpload'],
        ['ID Card Upload', 'idCardUpload']
    ];

    adminApplicationsTableBody.innerHTML = fieldLabels
        .map(([label, key]) => {
            const cells = entries
                .map(([id, data]) => {
                    const value = data[key] || '-';
                    if (key === 'moveOutDate') {
                        const inputValue = value === '-' ? '' : value;
                        return `<td><input type="date" class="admin-move-out-date" data-entry-id="${sanitizeText(id)}" value="${sanitizeText(inputValue)}" /></td>`;
                    }
                    if (key === 'residentStatus') {
                        const status = getResidentStatus(data);
                        return `<td><span class="admin-status-badge ${status.className}">${sanitizeText(status.label)}</span></td>`;
                    }
                    // Display all photo fields as image previews
                    if ((key === 'passportPhoto' || key === 'aadhaarUpload' || key === 'idCardUpload') && isImageUrl(value)) {
                        const previewClass = key === 'passportPhoto' ? 'admin-photo-preview admin-passport-preview' : 'admin-photo-preview';
                        return `<td><img src="${sanitizeText(value)}" alt="${label}" class="${previewClass}" /></td>`;
                    }
                    return `<td>${sanitizeText(value)}</td>`;
                })
                .join('');
            return `<tr><th>${sanitizeText(label)}</th>${cells}</tr>`;
        })
        .join('');

    attachMoveOutDateHandlers();
};

const renderContactsTable = (entries) => {
    if (!adminContactsTableBody) return;
    if (!entries.length) {
        adminContactsTableBody.innerHTML = '<tr><td colspan="3">No contact messages found.</td></tr>';
        return;
    }
    adminContactsTableBody.innerHTML = entries.map(([id, data]) => `
        <tr>
            <td>
                <div class="contact-column">
                    <strong>${sanitizeText(data.contactName)}</strong>
                    <div>${sanitizeText(data.contactPhone)}</div>
                    <div class="applicant-meta">${sanitizeText(data.contactEmail)}</div>
                </div>
            </td>
            <td>${sanitizeText(data.contactMessage)}</td>
            <td>${formatSubmittedAt(data.submittedAt)}</td>
        </tr>
    `).join('');
};

const updateAdminTotals = (apps, contacts) => {
    if (adminTotalApplications) adminTotalApplications.textContent = String(apps.length);
    if (adminTotalContacts) adminTotalContacts.textContent = String(contacts.length);
};

const loadAdminData = async () => {
    if (!firebaseDatabase) {
        showToast('Firebase not initialized. Admin data cannot load.');
        return;
    }

    try {
        const [appsSnapshot, contactsSnapshot] = await Promise.all([
            firebaseDatabase.ref('applications').orderByKey().once('value'),
            firebaseDatabase.ref('contactMessages').orderByKey().once('value')
        ]);

        const appsData = appsSnapshot.val() || {};
        const contactsData = contactsSnapshot.val() || {};
        const applicationEntries = Object.entries(appsData).sort(([a], [b]) => Number(a) - Number(b));
        const contactEntries = Object.entries(contactsData).sort(([a], [b]) => Number(a) - Number(b));

        adminApplicationEntriesCache = applicationEntries;
        adminContactEntriesCache = contactEntries;
        const filteredApplicationEntries = filterApplicationEntries(applicationEntries, adminSearchInput?.value || '');
        renderApplicationsTable(filteredApplicationEntries);
        renderContactsTable(contactEntries);
        updateAdminTotals(filteredApplicationEntries, contactEntries);
    } catch (error) {
        console.error('Error loading admin data:', error);
        if (adminApplicationsTableBody) adminApplicationsTableBody.innerHTML = '<tr><td colspan="9">Failed to load applications.</td></tr>';
        if (adminContactsTableBody) adminContactsTableBody.innerHTML = '<tr><td colspan="5">Failed to load contact messages.</td></tr>';
        showToast('Unable to load admin dashboard data.');
    }
};

const syncAdminTableScroll = () => {
    if (!adminTableScroll || !adminTableScrollTop) return;

    const table = adminTableScroll.querySelector('table');
    const spacer = adminTableScrollTop.querySelector('.admin-table-scroll-spacer');

    if (table && spacer) {
        spacer.style.minWidth = `${table.scrollWidth}px`;
    }

    adminTableScrollTop.scrollLeft = adminTableScroll.scrollLeft;
};

const initAdminDashboard = () => {
    if (!adminApplicationsTableBody && !adminContactsTableBody && !adminLoginOverlay) return;
    checkAdminAccess();
    if (refreshAdminButton) {
        refreshAdminButton.addEventListener('click', () => {
            showToast('Refreshing admin data...');
            loadAdminData();
        });
    }

    if (adminUnlockButton) {
        adminUnlockButton.addEventListener('click', unlockAdminAccess);
    }

    if (adminPasswordInput) {
        adminPasswordInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                unlockAdminAccess();
            }
        });
    }

    if (adminTabButtons.length) {
        adminTabButtons.forEach((button) => {
            button.addEventListener('click', () => toggleAdminPanel(button.dataset.panel));
        });
    }

    if (adminSearchInput) {
        adminSearchInput.addEventListener('input', handleApplicationSearch);
    }

    if (adminTableScroll && adminTableScrollTop) {
        adminTableScroll.addEventListener('scroll', syncAdminTableScroll);
        adminTableScrollTop.addEventListener('scroll', () => {
            adminTableScroll.scrollLeft = adminTableScrollTop.scrollLeft;
        });
        window.addEventListener('resize', syncAdminTableScroll);
    }

    syncAdminTableScroll();

    if (adminLoginButton) {
        adminLoginButton.addEventListener('click', () => {
            const provided = prompt('Enter admin password to access dashboard');
            if (provided === adminPassword) {
                window.location.href = 'admin.html';
            } else if (provided !== null) {
                showToast('Incorrect admin password.');
            }
        });
    }
};

const showLightbox = (imageSrc, imageAlt) => {
    lightboxImage.src = imageSrc;
    lightboxImage.alt = imageAlt;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
};

const closeLightbox = () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImage.src = '';
};

const getFormData = (formElement) => {
    const data = {};
    if (!formElement) return data;
    const formData = new FormData(formElement);
    formData.forEach((value, key) => {
        if (value instanceof File) {
            data[key] = value.size ? value : null;
        } else {
            data[key] = value;
        }
    });
    return data;
};

const uploadFileToStorage = async (file, folder) => {
    if (!firebaseDatabase || !file || !(file instanceof File)) return null;

    const isGithubHost = window.location.origin.includes('github.io');
    if (isGithubHost) {
        console.warn('Skipping Firebase Storage upload on GitHub Pages origin; using inline data URL fallback.');
        try {
            return await fileToDataUrl(file);
        } catch (readError) {
            console.error('Error converting file to data URL:', readError);
            return null;
        }
    }

    const storageRef = firebase.storage().ref(`${folder}/${Date.now()}-${file.name}`);
    try {
        const snapshot = await Promise.race([
            storageRef.put(file),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Firebase Storage upload timed out')), 8000))
        ]);
        return await snapshot.ref.getDownloadURL();
    } catch (error) {
        console.error('Error uploading file to Firebase Storage:', error);
        console.warn('Falling back to inline file storage in Firebase Database as a data URL.');
        try {
            return await fileToDataUrl(file);
        } catch (readError) {
            console.error('Error converting file to data URL:', readError);
            return null;
        }
    }
};

const saveApplicationData = () => {
    if (!applicationForm) return;
    const values = getFormData(applicationForm);
    localStorage.setItem('bloom-application', JSON.stringify(values));
};

const saveFormToFirebase = async (formElement, collectionName) => {
    if (!firebaseDatabase) {
        console.warn('Firebase database not initialized');
        return false;
    }

    try {
        const timestamp = new Date().toISOString();
        const formData = getFormData(formElement);
        const processedData = {};

        for (const [key, value] of Object.entries(formData)) {
            if (value instanceof File && value.name) {
                const downloadUrl = await uploadFileToStorage(value, collectionName);
                processedData[key] = downloadUrl || value.name;
            } else {
                processedData[key] = value;
            }
        }

        const databaseRef = firebaseDatabase.ref(`${collectionName}/${Date.now()}`);
        const dataToSave = {
            ...processedData,
            submittedAt: timestamp,
            formVersion: '1.0'
        };
        await databaseRef.set(dataToSave);
        return true;
    } catch (error) {
        console.error('Error saving to Firebase:', error);
        return false;
    }
};

const loadApplicationData = () => {
    if (!applicationForm) return;
    const stored = localStorage.getItem('bloom-application');
    if (!stored) return;
    const data = JSON.parse(stored);
    Object.entries(data).forEach(([key, value]) => {
        const field = applicationForm.elements[key];
        if (field && field.type !== 'file') {
            field.value = value;
        }
    });
};

const validateField = (field) => {
    const errorField = field.parentElement.querySelector('.error-message');
    if (field.validity.valid) {
        errorField.textContent = '';
        return true;
    }
    if (field.validity.valueMissing) {
        errorField.textContent = 'This field is required.';
    } else if (field.validity.typeMismatch) {
        errorField.textContent = 'Please enter a valid value.';
    } else if (field.validity.patternMismatch) {
        errorField.textContent = 'Please use the correct format.';
    } else if (field.validity.rangeUnderflow || field.validity.rangeOverflow) {
        errorField.textContent = 'Please enter a valid age.';
    } else {
        errorField.textContent = 'Please complete this field.';
    }
    return false;
};

const validateForm = (form) => {
    const fields = Array.from(form.querySelectorAll('input, select, textarea')).filter((el) => el.willValidate);
    let valid = true;
    fields.forEach((field) => {
        if (!validateField(field)) valid = false;
    });
    return valid;
};

const animateSubmit = async () => {
    if (!applicationForm) return;
    applicationForm.classList.add('loading');

    const savedToFirebase = await saveFormToFirebase(applicationForm, 'applications');

    setTimeout(() => {
        applicationForm.classList.remove('loading');
        openModal();
        const message = savedToFirebase
            ? 'Your application has been submitted successfully and saved to database.'
            : 'Your application has been submitted (saving failed).';
        showToast(message);
    }, 1200);
};

const resetFormFields = () => {
    if (!applicationForm) return;
    applicationForm.reset();
    localStorage.removeItem('bloom-application');
    applicationForm.querySelectorAll('.error-message').forEach((span) => (span.textContent = ''));
    showToast('Form reset successfully.');
};

const highlightInvalid = (event) => {
    if (event.target.willValidate) validateField(event.target);
};

const initContactForm = () => {
    if (!contactForm) return;
    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!validateForm(contactForm)) {
            showToast('Please complete all contact form fields correctly.');
            return;
        }

        const savedToFirebase = await saveFormToFirebase(contactForm, 'contactMessages');
        if (savedToFirebase) {
            showToast('Message sent and saved successfully. We will reply soon.');
        } else {
            showToast('Message sent, but saving to database failed.');
        }

        contactForm.reset();
    });
};

if (menuToggle) {
    menuToggle.addEventListener('click', toggleMenu);
}
if (navMenu) {
    navMenu.addEventListener('click', smoothScroll);
}
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.dataset.theme = currentTheme;
        saveTheme(currentTheme);
        updateThemeIcon();
    });
}
if (backToTop) {
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}
window.addEventListener('scroll', toggleBackToTop);
window.addEventListener('click', (event) => {
    if (!navMenu?.contains(event.target) && !menuToggle?.contains(event.target)) {
        navMenu?.classList.remove('open');
    }
});
if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
}
if (lightbox) {
    lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox) closeLightbox();
    });
}

if (galleryItems.length) {
    galleryItems.forEach((button) => {
        button.addEventListener('click', () => {
            const src = button.dataset.src;
            const alt = button.querySelector('img')?.alt || 'Gallery image preview';
            showLightbox(src, alt);
        });
    });
}

if (faqButtons.length) {
    faqButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const item = button.closest('.faq-item');
            if (!item) return;
            const opened = item.classList.toggle('open');
            button.setAttribute('aria-expanded', opened);
            button.querySelector('.faq-icon').textContent = opened ? '−' : '+';
        });
    });
}

if (applicationForm) {
    applicationForm.addEventListener('input', highlightInvalid);
    applicationForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!validateForm(applicationForm)) {
            showToast('Please correct the highlighted fields before submitting.');
            return;
        }
        saveApplicationData();
        animateSubmit();
    });
    applicationForm.addEventListener('reset', resetFormFields);
    applicationForm.addEventListener('change', saveApplicationData);
}

if (closeModal) {
    closeModal.addEventListener('click', closeModalWindow);
}
window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeModalWindow();
        closeLightbox();
    }
});

window.addEventListener('DOMContentLoaded', () => {
    initializeFirebase();
    initAgeCalculation();
    loadTheme();
    loadApplicationData();
    startTyping();
    revealOnScroll();
    handleCounter();
    initContactForm();
    initAdminDashboard();

    // Admin Login button - navigate to admin page
    if (adminLoginButton) {
        adminLoginButton.addEventListener('click', () => {
            window.location.href = 'admin.html';
        });
    }

    setTimeout(() => {
        if (pageLoader) {
            pageLoader.style.opacity = '0';
            pageLoader.style.transform = 'scale(1.02)';
            setTimeout(() => pageLoader.remove(), 350);
        }
    }, 700);
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 880) {
        navMenu?.classList.remove('open');
    }
});

let testimonialIndex = 0;
const rotateTestimonials = () => {
    if (!testimonialCards.length) return;
    testimonialCards.forEach((card, index) => {
        card.classList.toggle('active', index === testimonialIndex);
    });
    testimonialIndex = (testimonialIndex + 1) % testimonialCards.length;
};

if (testimonialCards.length) {
    setInterval(rotateTestimonials, 5000);
    rotateTestimonials();
}
