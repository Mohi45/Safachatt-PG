// ======== FIREBASE CONFIGURATION ========
// Replace with your Firebase project credentials
let firebaseApp;
let firebaseDatabase;
let firebaseAuth;
let firebaseAuthReady = Promise.resolve();

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
                firebaseAuth = typeof firebase.auth === 'function' ? firebase.auth() : null;
                console.log('✅ Firebase initialized successfully');
                console.log('Database URL:', firebaseConfig.databaseURL);
            } else {
                firebaseDatabase = firebase.database();
                firebaseAuth = typeof firebase.auth === 'function' ? firebase.auth() : null;
                console.log('✅ Firebase already initialized');
            }
            if (firebaseAuth && !document.getElementById('adminLoginOverlay')) {
                firebaseAuthReady = firebaseAuth.signInAnonymously().catch((error) => {
                    console.error('Anonymous Firebase sign-in failed:', error);
                });
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
let installAppButton = document.getElementById('installAppButton');
let backButton = document.getElementById('backButton');
let deferredPrompt = null;
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
const receiptsTableBody = document.getElementById('receiptsTableBody');
const adminTotalApplications = document.getElementById('adminTotalApplications');
const adminTotalReceipts = document.getElementById('adminTotalReceipts');
const refreshAdminButton = document.getElementById('refreshAdmin');
const adminLoginOverlay = document.getElementById('adminLoginOverlay');
const adminEmailInput = document.getElementById('adminEmail');
const adminPasswordInput = document.getElementById('adminPassword');
const adminUnlockButton = document.getElementById('adminUnlockButton');
const adminTabButtons = document.querySelectorAll('.admin-tab-button');
const adminPanels = document.querySelectorAll('.admin-panel');
const adminLoginButton = document.getElementById('adminLoginButton');
const adminSearchInput = document.getElementById('studentNameSearch');
const receiptSearchInput = document.getElementById('receiptSearch');
const adminTableScroll = document.getElementById('applicationsTableScroll');
const adminTableScrollTop = document.getElementById('applicationsTableScrollTop');
const rentSearchNameInput = document.getElementById('rentSearchName');
const rentDueTableBody = document.getElementById('rentDueTableBody');
const joiningDatesTableBody = document.getElementById('joiningDatesTableBody');
const joiningDateSearchInput = document.getElementById('joiningDateSearch');
const sendReminderToAllButton = document.getElementById('sendReminderToAll');
const rentSummaryTotal = document.getElementById('rentSummaryTotal');
const rentSummaryPaid = document.getElementById('rentSummaryPaid');
const rentSummaryPending = document.getElementById('rentSummaryPending');
const rentSummaryTodayDue = document.getElementById('rentSummaryTodayDue');
const rentSummaryOverdue = document.getElementById('rentSummaryOverdue');
const rentSummaryCollection = document.getElementById('rentSummaryCollection');
const adminAccessKey = 'safachatt-admin-access';

let adminApplicationEntriesCache = [];
let adminReceiptEntriesCache = [];

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

const registerServiceWorker = async () => {
    if (!('serviceWorker' in navigator)) return;
    try {
        await navigator.serviceWorker.register('./sw.js');
        console.log('Service worker registered');
    } catch (error) {
        console.error('Service worker registration failed', error);
    }
};

const handleInstallPrompt = () => {
    if (!deferredPrompt) {
        showToast('This app is ready to be installed from your browser.');
        return;
    }
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(() => {
        deferredPrompt = null;
    });
};

const ensureMobileShell = () => {
    if (!document.querySelector('.mobile-nav')) {
        const mobileNav = document.createElement('nav');
        mobileNav.className = 'mobile-nav';
        mobileNav.setAttribute('aria-label', 'Bottom navigation');
        mobileNav.innerHTML = `
            <a href="index.html" class="mobile-nav-link">Home</a>
            <a href="rooms.html" class="mobile-nav-link">Rooms</a>
            <a href="apply.html" class="mobile-nav-link">Apply</a>
            <a href="contact.html" class="mobile-nav-link">Contact</a>
        `;
        document.body.appendChild(mobileNav);
    }

    if (!document.getElementById('installAppButton')) {
        const installButton = document.createElement('button');
        installButton.id = 'installAppButton';
        installButton.className = 'install-btn';
        installButton.type = 'button';
        installButton.textContent = 'Install App';
        installButton.addEventListener('click', handleInstallPrompt);
        document.body.appendChild(installButton);
    }

    if (!document.getElementById('backButton')) {
        const backButtonElement = document.createElement('button');
        backButtonElement.id = 'backButton';
        backButtonElement.className = 'back-btn';
        backButtonElement.type = 'button';
        backButtonElement.textContent = '← Back';
        backButtonElement.addEventListener('click', () => {
            if (window.history.length > 1) {
                window.history.back();
            } else {
                window.location.href = 'index.html';
            }
        });
        document.body.appendChild(backButtonElement);
    }

    installAppButton = document.getElementById('installAppButton');
    backButton = document.getElementById('backButton');

    document.querySelectorAll('.mobile-nav-link').forEach((link) => {
        if (link.getAttribute('href') === window.location.pathname.split('/').pop() || link.getAttribute('href') === 'index.html' && (window.location.pathname.endsWith('/') || window.location.pathname.endsWith('index.html'))) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
};

const trackMobileActions = () => {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(() => {
            console.log('Location access enabled');
        }, () => {
            console.log('Location permission skipped');
        }, { enableHighAccuracy: false, timeout: 5000 });
    }

    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().catch(() => { });
    }

    const shareData = {
        title: 'Safachatt PG',
        text: 'Explore Safachatt PG rooms, facilities and registration.',
        url: window.location.href
    };

    if (navigator.share) {
        document.querySelectorAll('a[href^="https://wa.me"], .whatsapp-float a').forEach((link) => {
            link.addEventListener('click', async () => {
                try {
                    await navigator.share(shareData);
                } catch (error) {
                    console.log('Share dismissed', error);
                }
            });
        });
    }
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
    return value.startsWith('data:image/') || /\.(jpe?g|png|webp|gif|svg)(?:[?#]|$)/i.test(value);
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

const unlockAdminAccess = async () => {
    const email = adminEmailInput?.value.trim() ?? '';
    const password = adminPasswordInput?.value ?? '';
    if (!firebaseAuth || !email || !password) {
        showToast('Enter your Firebase admin email and password.');
        return;
    }

    try {
        await firebaseAuth.signInWithEmailAndPassword(email, password);
        adminLoginOverlay?.classList.add('hidden');
        document.body.classList.remove('admin-login-hidden');
        loadAdminData();
        showToast('Admin access granted.');
        if (adminPasswordInput) adminPasswordInput.value = '';
    } catch (error) {
        console.error('Firebase admin sign-in failed:', error);
        showToast('Admin sign-in failed. Check your email and password.');
        adminPasswordInput?.focus();
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

const toDateOnlyValue = (value) => {
    if (!value) return '';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return '';
    return parsed.toISOString().split('T')[0];
};

const parseDateValue = (value) => {
    if (!value) return null;
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return null;
    return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
};

const formatDateValue = (value) => {
    const parsed = parseDateValue(value);
    if (!parsed) return '';
    const year = parsed.getFullYear();
    const month = `${parsed.getMonth() + 1}`.padStart(2, '0');
    const day = `${parsed.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const getRecurringDueDate = (data) => {
    const moveInDate = parseDateValue(data?.moveInDate);
    const today = new Date();
    const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    if (!moveInDate) {
        return parseDateValue(data?.rentDueDate);
    }

    const dueDay = moveInDate.getDate();
    const dueDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), dueDay);
    if (dueDate.getMonth() !== currentMonth.getMonth()) {
        dueDate.setDate(0);
    }

    return dueDate;
};

const isActiveResident = (data) => {
    const moveInDate = parseDateValue(data?.moveInDate);
    if (!moveInDate) return false;

    const moveOutDate = parseDateValue(data?.moveOutDate);
    const today = new Date();
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    if (moveOutDate && moveOutDate <= todayDate) return false;
    return true;
};

const getRentStatus = (data) => {
    const paymentReceived = data?.paymentReceived === true || data?.paymentReceived === 'true';
    const dueDate = getRecurringDueDate(data);
    const today = new Date();
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    if (paymentReceived) {
        return { label: 'Paid', className: 'paid' };
    }

    if (dueDate && dueDate < todayDate) {
        return { label: 'Overdue', className: 'overdue' };
    }

    if (dueDate && dueDate.getTime() === todayDate.getTime()) {
        return { label: 'Due Today', className: 'pending' };
    }

    return { label: 'Pending', className: 'pending' };
};

const formatCurrency = (value) => {
    const amount = Number(value);
    if (Number.isNaN(amount)) return '₹0';
    return `₹${amount.toLocaleString('en-IN')}`;
};

const buildWhatsAppUrl = (phone, message) => {
    const normalizedPhone = String(phone || '').replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/91${normalizedPhone}${normalizedPhone.length > 10 ? '' : ''}?text=${encodedMessage}`;
};

const getRentReminderMessage = (data) => {
    const studentName = data?.fullName || 'Student';
    const rent = data?.monthlyRent || data?.rent || 0;
    const amountToPay = data?.amountToPay ?? rent;
    const dueDate = formatDateValue(getRecurringDueDate(data)) || 'Soon';
    return `Hello ${studentName},\n\nThis is a reminder that your PG rent for this month is still pending.\n\nAmount to Pay: ₹${amountToPay}\nDue Date: ${dueDate}\n\nKindly make the payment as soon as possible.\n\nThank you,\nPG Management`;
};

const updateRentPaymentInFirebase = async (entryId, value) => {
    if (!firebaseDatabase || !entryId) return false;
    try {
        const paymentReceived = value === 'true';
        const updates = { paymentReceived };

        await firebaseDatabase.ref(`applications/${entryId}`).update(updates);
        const matchingEntry = adminApplicationEntriesCache.find(([id]) => id === entryId);
        if (matchingEntry) {
            matchingEntry[1] = { ...matchingEntry[1], ...updates };
        }
        showToast(paymentReceived ? 'Payment marked as received.' : 'Payment marked as pending.');
        return true;
    } catch (error) {
        console.error('Error updating rent payment status:', error);
        showToast('Unable to update rent payment status.');
        return false;
    }
};

const updateRentDueDateInFirebase = async (entryId, value) => {
    if (!firebaseDatabase || !entryId) return false;
    try {
        await firebaseDatabase.ref(`applications/${entryId}`).update({ rentDueDate: value || '' });
        showToast('Rent due date updated.');
        return true;
    } catch (error) {
        console.error('Error updating rent due date:', error);
        showToast('Unable to update rent due date.');
        return false;
    }
};

const updateRentAmountInFirebase = async (entryId, value) => {
    if (!firebaseDatabase || !entryId) return false;
    try {
        const parsedValue = Number(value);
        const safeValue = Number.isNaN(parsedValue) ? 0 : parsedValue;
        await firebaseDatabase.ref(`applications/${entryId}`).update({ amountToPay: safeValue });
        const matchingEntry = adminApplicationEntriesCache.find(([id]) => id === entryId);
        if (matchingEntry) {
            matchingEntry[1] = { ...matchingEntry[1], amountToPay: safeValue };
        }
        showToast('Amount updated.');
        return true;
    } catch (error) {
        console.error('Error updating rent amount:', error);
        showToast('Unable to update rent amount.');
        return false;
    }
};

const updateSecurityDepositInFirebase = async (entryId, field, value) => {
    if (!firebaseDatabase || !entryId) return false;
    try {
        const updateValue = field === 'securityDepositReceived'
            ? value === 'true'
            : (Number.isNaN(Number(value)) ? 0 : Number(value));
        const updates = { [field]: updateValue };

        await firebaseDatabase.ref(`applications/${entryId}`).update(updates);
        const matchingEntry = adminApplicationEntriesCache.find(([id]) => id === entryId);
        if (matchingEntry) {
            matchingEntry[1] = { ...matchingEntry[1], ...updates };
        }

        showToast(field === 'securityDepositReceived'
            ? (updateValue ? 'Security deposit marked as received.' : 'Security deposit marked as pending.')
            : 'Security deposit amount updated.');
        return true;
    } catch (error) {
        console.error('Error updating security deposit:', error);
        showToast('Unable to update security deposit.');
        return false;
    }
};

const renderRentDueTable = (entries) => {
    if (!rentDueTableBody) return;

    const activeEntries = entries.filter(([, data]) => isActiveResident(data));
    if (!activeEntries.length) {
        rentDueTableBody.innerHTML = '<tr><td colspan="11">No active rent records found.</td></tr>';
        return;
    }

    const nameQuery = (rentSearchNameInput?.value || '').trim().toLowerCase();

    const filteredEntries = activeEntries.filter(([, data]) => {
        const studentName = String(data?.fullName || '').toLowerCase();
        const status = getRentStatus(data);

        const matchesName = !nameQuery || studentName.includes(nameQuery);
        return matchesName;
    });

    const rows = filteredEntries.map(([id, data]) => {
        const status = getRentStatus(data);
        const paymentReceived = data?.paymentReceived === true || data?.paymentReceived === 'true';
        const dueDate = formatDateValue(getRecurringDueDate(data));
        const amountToPay = data?.amountToPay ?? (data?.monthlyRent || data?.rent || 0);
        const securityDepositReceived = data?.securityDepositReceived === true || data?.securityDepositReceived === 'true';
        const securityDepositAmount = data?.securityDepositAmount ?? 0;
        const photoUrl = data?.passportPhoto;
        const photoCell = photoUrl && photoUrl !== '-'
            ? `<div class="rent-photo-cell"><img src="${sanitizeText(photoUrl)}" alt="${sanitizeText(data?.fullName || 'Student')}" class="rent-photo-preview" /></div>`
            : '<div class="rent-photo-fallback">No photo</div>';
        const whatsappUrl = buildWhatsAppUrl(data?.mobile, getRentReminderMessage(data));

        return `
            <tr class="${status.label === 'Overdue' ? 'rent-overdue-row' : ''}">
                <td>${photoCell}</td>
                <td>${sanitizeText(data?.fullName || '-')}</td>
                <td>${sanitizeText(data?.mobile || '-')}</td>
                <td>${sanitizeText(data?.roomNumber || data?.roomType || '-')}</td>
                <td>${sanitizeText(dueDate || '-')}</td>
                <td>
                    <div class="rent-status-badge ${status.className}">${sanitizeText(status.label)}</div>
                    <select class="rent-payment-select" data-entry-id="${sanitizeText(id)}">
                        <option value="false" ${paymentReceived ? '' : 'selected'}>No</option>
                        <option value="true" ${paymentReceived ? 'selected' : ''}>Yes</option>
                    </select>
                </td>
                <td>
                    <input type="number" class="rent-amount-input" data-entry-id="${sanitizeText(id)}" value="${sanitizeText(amountToPay)}" min="0" step="1" inputmode="numeric" placeholder="0" />
                </td>
                <td>
                    <select class="security-deposit-received-select" data-entry-id="${sanitizeText(id)}">
                        <option value="false" ${securityDepositReceived ? '' : 'selected'}>No</option>
                        <option value="true" ${securityDepositReceived ? 'selected' : ''}>Yes</option>
                    </select>
                </td>
                <td>
                    <input type="number" class="security-deposit-amount-input" data-entry-id="${sanitizeText(id)}" value="${sanitizeText(securityDepositAmount)}" min="0" step="1" inputmode="numeric" placeholder="0" />
                </td>
                <td>
                    <a class="rent-whatsapp-btn" href="${sanitizeText(whatsappUrl)}" target="_blank" rel="noreferrer">WhatsApp</a>
                </td>
                <td>—</td>
            </tr>
        `;
    }).join('');

    rentDueTableBody.innerHTML = rows;
    document.querySelectorAll('.rent-payment-select').forEach((select) => {
        select.addEventListener('change', async (event) => {
            const target = event.currentTarget;
            await updateRentPaymentInFirebase(target.dataset.entryId, target.value);
            renderRentDueTable(adminApplicationEntriesCache);
            updateRentSummary(adminApplicationEntriesCache);
        });
    });

    document.querySelectorAll('.rent-amount-input').forEach((input) => {
        input.addEventListener('change', async (event) => {
            const target = event.currentTarget;
            await updateRentAmountInFirebase(target.dataset.entryId, target.value);
            renderRentDueTable(adminApplicationEntriesCache);
            updateRentSummary(adminApplicationEntriesCache);
        });
    });

    document.querySelectorAll('.security-deposit-received-select').forEach((select) => {
        select.addEventListener('change', async (event) => {
            const target = event.currentTarget;
            await updateSecurityDepositInFirebase(target.dataset.entryId, 'securityDepositReceived', target.value);
            renderRentDueTable(adminApplicationEntriesCache);
        });
    });

    document.querySelectorAll('.security-deposit-amount-input').forEach((input) => {
        input.addEventListener('change', async (event) => {
            const target = event.currentTarget;
            await updateSecurityDepositInFirebase(target.dataset.entryId, 'securityDepositAmount', target.value);
            renderRentDueTable(adminApplicationEntriesCache);
        });
    });
};

const updateRentSummary = (entries) => {
    if (!entries) return;
    const activeEntries = entries.filter(([, data]) => isActiveResident(data));
    const total = activeEntries.length;
    const paid = activeEntries.filter(([, data]) => data?.paymentReceived === true || data?.paymentReceived === 'true').length;
    const pending = total - paid;
    const todayDue = activeEntries.filter(([, data]) => {
        const status = getRentStatus(data);
        return status.label === 'Due Today';
    }).length;
    const overdue = activeEntries.filter(([, data]) => {
        const status = getRentStatus(data);
        return status.label === 'Overdue';
    }).length;
    const totalAmount = activeEntries.reduce((sum, [, data]) => {
        const amount = Number(data?.amountToPay ?? data?.monthlyRent ?? data?.rent ?? 0);
        return sum + (Number.isFinite(amount) ? amount : 0);
    }, 0);

    if (rentSummaryTotal) rentSummaryTotal.textContent = String(total);
    if (rentSummaryPaid) rentSummaryPaid.textContent = String(paid);
    if (rentSummaryPending) rentSummaryPending.textContent = String(pending);
    if (rentSummaryTodayDue) rentSummaryTodayDue.textContent = String(todayDue);
    if (rentSummaryOverdue) rentSummaryOverdue.textContent = String(overdue);
    if (rentSummaryCollection) rentSummaryCollection.textContent = String(totalAmount);
};

const sendReminderToAllPendingStudents = () => {
    const pendingEntries = adminApplicationEntriesCache.filter(([, data]) => {
        const status = getRentStatus(data);
        return isActiveResident(data) && status.label !== 'Paid';
    });

    if (!pendingEntries.length) {
        showToast('No pending students to remind.');
        return;
    }

    pendingEntries.forEach(([, data], index) => {
        const reminderUrl = buildWhatsAppUrl(data?.mobile, getRentReminderMessage(data));
        setTimeout(() => window.open(reminderUrl, '_blank', 'noopener,noreferrer'), index * 700);
    });
    showToast('WhatsApp reminders opened for pending students.');
};

const renderJoiningDatesTable = (entries) => {
    if (!joiningDatesTableBody) return;

    const nameQuery = (joiningDateSearchInput?.value || '').trim().toLowerCase();
    const activeEntries = entries.filter(([, data]) => isActiveResident(data)).filter(([, data]) =>
        String(data?.fullName || '').toLowerCase().includes(nameQuery));

    if (!activeEntries.length) {
        joiningDatesTableBody.innerHTML = '<tr><td colspan="8">No active joining date records found.</td></tr>';
        return;
    }

    joiningDatesTableBody.innerHTML = activeEntries.map(([id, data]) => {
        const status = getRentStatus(data);
        const photoUrl = data?.passportPhoto;
        const photoCell = photoUrl && photoUrl !== '-'
            ? `<div class="rent-photo-cell"><img src="${sanitizeText(photoUrl)}" alt="${sanitizeText(data?.fullName || 'Student')}" class="rent-photo-preview" /></div>`
            : '<div class="rent-photo-fallback">No photo</div>';
        const amount = data?.amountToPay ?? data?.monthlyRent ?? data?.rent ?? 0;
        const whatsappUrl = buildWhatsAppUrl(data?.mobile, getRentReminderMessage(data));

        return `<tr class="${status.label === 'Overdue' ? 'rent-overdue-row' : ''}">
            <td>${photoCell}</td>
            <td>${sanitizeText(data?.fullName || '-')}</td>
            <td>${sanitizeText(data?.mobile || '-')}</td>
            <td>${sanitizeText(formatDateValue(data?.moveInDate) || '-')}</td>
            <td>${formatCurrency(amount)}</td>
            <td>${sanitizeText(formatDateValue(getRecurringDueDate(data)) || '-')}</td>
            <td><span class="rent-status-badge ${status.className}">${sanitizeText(status.label)}</span></td>
            <td><a class="rent-whatsapp-btn" href="${sanitizeText(whatsappUrl)}" target="_blank" rel="noreferrer">WhatsApp</a></td>
        </tr>`;
    }).join('');
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

const updateApplicantDocumentInFirebase = async (entryId, field, file) => {
    if (!firebaseDatabase || !entryId || !file) return false;

    try {
        const documentUrl = await uploadFileToStorage(file, 'applications');
        if (!documentUrl) {
            showToast('Unable to upload the document.');
            return false;
        }

        await firebaseDatabase.ref(`applications/${entryId}`).update({ [field]: documentUrl });

        const matchingEntry = adminApplicationEntriesCache.find(([id]) => id === entryId);
        if (matchingEntry) {
            matchingEntry[1] = { ...matchingEntry[1], [field]: documentUrl };
        }

        showToast('Document uploaded successfully.');
        return true;
    } catch (error) {
        console.error('Error updating applicant document:', error);
        showToast('Unable to upload the document.');
        return false;
    }
};

const attachDocumentUploadHandlers = () => {
    document.querySelectorAll('.admin-document-upload-input').forEach((input) => {
        input.addEventListener('change', async (event) => {
            const target = event.currentTarget;
            const entryId = target.dataset.entryId;
            const field = target.dataset.field;
            const file = target.files?.[0];

            if (!entryId || !field || !file) return;

            const uploaded = await updateApplicantDocumentInFirebase(entryId, field, file);
            if (uploaded) {
                const filteredEntries = filterApplicationEntries(adminApplicationEntriesCache, adminSearchInput?.value || '');
                renderApplicationsTable(filteredEntries);
                updateAdminTotals(filteredEntries, adminReceiptEntriesCache);
            }

            target.value = '';
        });
    });
};

const renderDocumentCell = (value, entryId, label, field, accept) => {
    const previewMarkup = isImageUrl(value) && value !== '-'
        ? `<img src="${sanitizeText(value)}" alt="${sanitizeText(label)}" class="admin-photo-preview admin-passport-preview" />`
        : value !== '-'
            ? `<a href="${sanitizeText(value)}" target="_blank" rel="noreferrer" class="admin-document-link">View uploaded document</a>`
            : '<div class="admin-photo-fallback">No document uploaded</div>';

    return `
        <td>
            <div class="admin-photo-cell">
                ${previewMarkup}
                <label class="admin-photo-upload">
                    <span>${value === '-' ? 'Upload document' : 'Replace document'}</span>
                    <input type="file" accept="${sanitizeText(accept)}" class="admin-document-upload-input" data-entry-id="${sanitizeText(entryId)}" data-field="${sanitizeText(field)}" />
                </label>
            </div>
        </td>
    `;
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
    updateAdminTotals(filteredEntries, adminReceiptEntriesCache);
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
                    if (key === 'passportPhoto') {
                        return renderDocumentCell(value, id, label, key, 'image/*');
                    }
                    if (key === 'aadhaarUpload' || key === 'idCardUpload') {
                        return renderDocumentCell(value, id, label, key, 'image/*,application/pdf');
                    }
                    return `<td>${sanitizeText(value)}</td>`;
                })
                .join('');
            return `<tr><th>${sanitizeText(label)}</th>${cells}</tr>`;
        })
        .join('');

    attachMoveOutDateHandlers();
    attachDocumentUploadHandlers();
};
const getReceiptMonthLabel = (data) => {
    const date = parseDateValue(data?.paymentDate || data?.receiptDate || data?.createdAt);
    return date ? date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : 'Date not available';
};

const filterReceiptEntries = (entries, searchTerm) => {
    const query = String(searchTerm || '').trim().toLowerCase();
    if (!query) return entries;
    return entries.filter(([, data]) =>
        String(data?.tenantName || '').toLowerCase().includes(query) ||
        String(data?.receiptNo || '').toLowerCase().includes(query)
    );
};

const renderReceiptsTable = (entries) => {
    if (!receiptsTableBody) return;
    if (!entries.length) {
        receiptsTableBody.innerHTML = '<tr><td colspan="9">No payment receipts found.</td></tr>';
        return;
    }
    let currentMonth = '';
    receiptsTableBody.innerHTML = entries.map(([id, data]) => {
        const month = getReceiptMonthLabel(data);
        const monthRow = month === currentMonth ? '' : `<tr class="receipt-month-group"><th colspan="9">${sanitizeText(month)}</th></tr>`;
        currentMonth = month;
        const paymentFor = Array.isArray(data.paymentFor) ? data.paymentFor.join(', ') : data.paymentFor;
        const total = Number(data.totalAmount ?? ((Number(data.pgRent) || 0) + (Number(data.securityFee) || 0) + (Number(data.lateFee) || 0)));
        return `${monthRow}<tr>
            <td>${sanitizeText(data.receiptNo || '-')}</td>
            <td>${sanitizeText(data.tenantName || '-')}</td>
            <td>${sanitizeText(data.roomBed || '-')}</td>
            <td>${sanitizeText(paymentFor || '-')}</td>
            <td>${sanitizeText(data.paymentMethod || '-')}</td>
            <td><span class="admin-status-badge ${data.paymentStatus === 'PAID' ? 'paid' : 'pending'}">${sanitizeText(data.paymentStatus || 'PENDING')}</span></td>
            <td>${formatCurrency(total)}</td>
            <td>${sanitizeText(formatDateValue(data.paymentDate || data.receiptDate) || '-')}</td>
            <td>${sanitizeText(data.receivedBy || '-')}</td>
        </tr>`;
    }).join('');
};

const updateAdminTotals = (apps, receipts) => {
    if (adminTotalApplications) adminTotalApplications.textContent = String(apps.length);
    if (adminTotalReceipts) adminTotalReceipts.textContent = String(receipts.length);
};

const loadAdminData = async () => {
    if (!firebaseDatabase) {
        showToast('Firebase not initialized. Admin data cannot load.');
        return;
    }

    try {
        const [appsSnapshot, receiptsSnapshot] = await Promise.all([
            firebaseDatabase.ref('applications').orderByKey().once('value'),
            firebaseDatabase.ref('receipts').orderByKey().once('value')
        ]);

        const appsData = appsSnapshot.val() || {};
        const receiptsData = receiptsSnapshot.val() || {};
        const applicationEntries = Object.entries(appsData).sort(([a, aData], [b, bData]) => {
            const aIsActive = getResidentStatus(aData).label === 'Active';
            const bIsActive = getResidentStatus(bData).label === 'Active';
            if (aIsActive !== bIsActive) return aIsActive ? -1 : 1;
            return Number(a) - Number(b);
        });
        const receiptEntries = Object.entries(receiptsData).sort(([, a], [, b]) => {
            const aDate = new Date(a?.paymentDate || a?.receiptDate || a?.createdAt || 0).getTime();
            const bDate = new Date(b?.paymentDate || b?.receiptDate || b?.createdAt || 0).getTime();
            return bDate - aDate;
        });

        adminApplicationEntriesCache = applicationEntries;
        adminReceiptEntriesCache = receiptEntries;
        const filteredApplicationEntries = filterApplicationEntries(applicationEntries, adminSearchInput?.value || '');
        renderApplicationsTable(filteredApplicationEntries);
        renderReceiptsTable(filterReceiptEntries(receiptEntries, receiptSearchInput?.value));
        updateAdminTotals(filteredApplicationEntries, receiptEntries);
        updateRentSummary(applicationEntries);
        renderRentDueTable(applicationEntries);
        renderJoiningDatesTable(applicationEntries);
    } catch (error) {
        console.error('Error loading admin data:', error);
        if (adminApplicationsTableBody) adminApplicationsTableBody.innerHTML = '<tr><td colspan="9">Failed to load applications.</td></tr>';
        if (receiptsTableBody) receiptsTableBody.innerHTML = '<tr><td colspan="9">Failed to load payment receipts.</td></tr>';
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
    if (!adminApplicationsTableBody && !receiptsTableBody && !adminLoginOverlay) return;
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

    if (receiptSearchInput) {
        receiptSearchInput.addEventListener('input', () => {
            renderReceiptsTable(filterReceiptEntries(adminReceiptEntriesCache, receiptSearchInput.value));
        });
    }

    if (rentSearchNameInput) {
        rentSearchNameInput.addEventListener('input', () => renderRentDueTable(adminApplicationEntriesCache));
    }

    if (joiningDateSearchInput) {
        joiningDateSearchInput.addEventListener('input', () => renderJoiningDatesTable(adminApplicationEntriesCache));
    }

    if (sendReminderToAllButton) {
        sendReminderToAllButton.addEventListener('click', sendReminderToAllPendingStudents);
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
        adminLoginButton.addEventListener('click', () => { window.location.href = 'admin.html'; });
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

const normalizeDuplicateValue = (value) => {
    if (value === null || value === undefined) return '';
    return String(value).toLowerCase().trim().replace(/\s+/g, ' ');
};

const checkForDuplicateApplication = async (candidateData) => {
    if (!firebaseDatabase) return false;

    const candidateName = normalizeDuplicateValue(candidateData.fullName);
    const candidateMobile = normalizeDuplicateValue(String(candidateData.mobile || '').replace(/\D/g, ''));
    const candidateEmail = normalizeDuplicateValue(candidateData.email);

    if (!candidateName || !candidateMobile || !candidateEmail) {
        return false;
    }

    try {
        const snapshot = await firebaseDatabase.ref('applications').once('value');
        const applications = snapshot.val() || {};

        return Object.values(applications).some((existingEntry) => {
            if (!existingEntry) return false;

            const existingName = normalizeDuplicateValue(existingEntry.fullName);
            const existingMobile = normalizeDuplicateValue(String(existingEntry.mobile || '').replace(/\D/g, ''));
            const existingEmail = normalizeDuplicateValue(existingEntry.email);

            return existingName && existingMobile && existingEmail
                && existingName === candidateName
                && existingMobile === candidateMobile
                && existingEmail === candidateEmail;
        });
    } catch (error) {
        console.error('Error checking duplicate application:', error);
        return false;
    }
};

const saveFormToFirebase = async (formElement, collectionName) => {
    if (!firebaseDatabase) {
        console.warn('Firebase database not initialized');
        return { success: false, duplicate: false };
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

        await firebaseAuthReady;
        if (!firebaseAuth?.currentUser) {
            showToast('Unable to connect securely. Please reload and try again.');
            return { success: false, duplicate: false };
        }

        const databaseRef = firebaseDatabase.ref(`${collectionName}/${Date.now()}`);
        const dataToSave = {
            ...processedData,
            submittedAt: timestamp,
            formVersion: '1.0'
        };
        await databaseRef.set(dataToSave);
        return { success: true, duplicate: false };
    } catch (error) {
        console.error('Error saving to Firebase:', error);
        return { success: false, duplicate: false };
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

    const saveResult = await saveFormToFirebase(applicationForm, 'applications');
    const savedToFirebase = saveResult?.success ?? false;
    const isDuplicate = saveResult?.duplicate ?? false;

    setTimeout(() => {
        applicationForm.classList.remove('loading');
        if (isDuplicate) {
            return;
        }

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

        const saveResult = await saveFormToFirebase(contactForm, 'contactMessages');
        if (saveResult?.success) {
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
if (installAppButton) {
    installAppButton.addEventListener('click', handleInstallPrompt);
}
if (backButton) {
    backButton.addEventListener('click', () => {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.location.href = 'index.html';
        }
    });
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
    ensureMobileShell();
    initializeFirebase();
    initAgeCalculation();
    registerServiceWorker();
    trackMobileActions();
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

window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
    if (installAppButton) {
        installAppButton.classList.add('visible');
    }
});

window.addEventListener('appinstalled', () => {
    if (installAppButton) {
        installAppButton.classList.remove('visible');
    }
    showToast('Safachatt PG installed successfully.');
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
