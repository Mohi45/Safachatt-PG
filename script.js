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
const contactMessagesTableBody = document.getElementById('contactMessagesTableBody');
const expensesTableBody = document.getElementById('expensesTableBody');
const adminTotalApplications = document.getElementById('adminTotalApplications');
const adminActiveStudents = document.getElementById('adminActiveStudents');
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
const receiptMonthFilter = document.getElementById('receiptMonthFilter');
const receiptMonthTotal = document.getElementById('receiptMonthTotal');
const receiptYearTotal = document.getElementById('receiptYearTotal');
const receiptSelectedMonthTotal = document.getElementById('receiptSelectedMonthTotal');
const contactMessageSearchInput = document.getElementById('contactMessageSearch');
const rentSearchNameInput = document.getElementById('rentSearchName');
const rentDueTableBody = document.getElementById('rentDueTableBody');
const sendReminderToAllButton = document.getElementById('sendReminderToAll');
const rentSummaryTotal = document.getElementById('rentSummaryTotal');
const rentSummaryPaid = document.getElementById('rentSummaryPaid');
const rentSummaryPending = document.getElementById('rentSummaryPending');
const rentSummaryTodayDue = document.getElementById('rentSummaryTodayDue');
const rentSummaryOverdue = document.getElementById('rentSummaryOverdue');
const rentSummaryCollection = document.getElementById('rentSummaryCollection');
const expenseForm = document.getElementById('expenseForm');
const expenseIdInput = document.getElementById('expenseId');
const expenseTitleInput = document.getElementById('expenseTitle');
const expenseAmountInput = document.getElementById('expenseAmount');
const expenseCategoryInput = document.getElementById('expenseCategory');
const expenseDateInput = document.getElementById('expenseDate');
const expensePaymentMethodInput = document.getElementById('expensePaymentMethod');
const expenseNoteInput = document.getElementById('expenseNote');
const expenseSubmitButton = document.getElementById('expenseSubmit');
const expenseCancelEditButton = document.getElementById('expenseCancelEdit');
const expenseSearchInput = document.getElementById('expenseSearch');
const expenseMonthFilter = document.getElementById('expenseMonthFilter');
const expenseCategoryFilter = document.getElementById('expenseCategoryFilter');
const exportExpensesButton = document.getElementById('exportExpenses');
const addMilkExpensesButton = document.getElementById('addMilkExpenses');
const expenseTotal = document.getElementById('expenseTotal');
const expenseMonthTotal = document.getElementById('expenseMonthTotal');
const expenseMonthLabel = document.getElementById('expenseMonthLabel');
const expenseYearTotal = document.getElementById('expenseYearTotal');
const expenseCount = document.getElementById('expenseCount');
const expenseComparisonLabel = document.getElementById('expenseComparisonLabel');
const expenseReceivedTotal = document.getElementById('expenseReceivedTotal');
const expenseComparedTotal = document.getElementById('expenseComparedTotal');
const expenseBalanceTotal = document.getElementById('expenseBalanceTotal');
let adminApplicationEntriesCache = [];
let adminReceiptEntriesCache = [];
let adminContactMessageEntriesCache = [];
let adminExpenseEntriesCache = [];
let adminDashboardAccessGranted = false;
let kitchenItemEntriesCache = [];
let kitchenTransactionEntriesCache = [];
let kitchenMovementItemId = '';
let kitchenMovementType = '';
let kitchenMovementSubmitting = false;

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

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-menu a, .mobile-nav-link').forEach((link) => {
        const isCurrentPage = link.getAttribute('href') === currentPage ||
            (currentPage === 'index.html' && link.getAttribute('href') === 'index.html');
        link.classList.toggle('active', isCurrentPage);
        if (isCurrentPage) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
    });

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
    const email = adminEmailInput?.value.trim().toLowerCase() ?? '';
    const password = adminPasswordInput?.value ?? '';
    if (!firebaseAuth || !email || !password) {
        showToast('Enter your Firebase admin email and password.');
        return;
    }

    try {
        await firebaseAuth.signInWithEmailAndPassword(email, password);
        const tokenResult = await firebaseAuth.currentUser.getIdTokenResult(true);
        if (tokenResult?.claims?.admin !== true) {
            await firebaseAuth.signOut();
            showToast('This Firebase account is not marked as an admin. Run the set-admin command, then sign in again.');
            return;
        }
        grantAdminDashboardAccess();
        showToast('Admin access granted.');
        if (adminPasswordInput) adminPasswordInput.value = '';
    } catch (error) {
        console.error('Firebase admin sign-in failed:', error);
        const message = error?.code === 'auth/invalid-credential'
            ? 'Invalid admin email or password. Verify the Firebase user and Email/Password sign-in provider.'
            : error?.code === 'auth/operation-not-allowed'
                ? 'Email/Password sign-in is disabled in Firebase Authentication.'
                : error?.code === 'PERMISSION_DENIED'
                    ? 'Firebase rules denied access. Deploy database.rules.json and sign in again.'
                    : 'Admin sign-in failed. Check your Firebase configuration and credentials.';
        showToast(message);
        adminPasswordInput?.focus();
    }
};

const grantAdminDashboardAccess = () => {
    if (adminDashboardAccessGranted) return;
    adminDashboardAccessGranted = true;
    adminLoginOverlay?.classList.add('hidden');
    document.body.classList.remove('admin-login-hidden');
    loadAdminData();
};

const requireAdminLogin = () => {
    adminDashboardAccessGranted = false;
    document.body.classList.add('admin-login-hidden');
    adminLoginOverlay?.classList.remove('hidden');
};

const checkAdminAccess = () => {
    if (!adminLoginOverlay) return;

    requireAdminLogin();

    if (!firebaseAuth) return;

    firebaseAuth.onAuthStateChanged(async (currentUser) => {
        if (!currentUser || currentUser.isAnonymous) {
            requireAdminLogin();
            return;
        }

        try {
            const tokenResult = await currentUser.getIdTokenResult(true);
            if (tokenResult?.claims?.admin === true) {
                grantAdminDashboardAccess();
            } else {
                requireAdminLogin();
            }
        } catch (error) {
            console.error('Unable to verify Firebase admin access:', error);
            requireAdminLogin();
            showToast('Unable to verify admin access. Please sign in again.');
        }
    });
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

const getLateFeeDetails = (data) => {
    const amountToPay = Number(data?.amountToPay ?? data?.monthlyRent ?? data?.rent ?? 0);
    const dueDate = getRecurringDueDate(data);
    const paymentReceived = data?.paymentReceived === true || data?.paymentReceived === 'true';

    if (paymentReceived || !dueDate) {
        return { daysLate: 0, lateFee: 0, totalDue: Number.isFinite(amountToPay) ? amountToPay : 0 };
    }

    const today = new Date();
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const normalizedDueDate = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
    const differenceInDays = Math.max(0, Math.ceil((todayDate.getTime() - normalizedDueDate.getTime()) / 86400000));
    const gracePeriodDays = 3;
    const lateFeeDays = Math.max(0, differenceInDays - (gracePeriodDays - 1));
    const lateFee = lateFeeDays * 100;
    const totalDue = Number.isFinite(amountToPay) ? amountToPay + lateFee : lateFee;

    return { daysLate: differenceInDays, lateFee, totalDue };
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
    const amountToPay = Number(data?.amountToPay ?? rent ?? 0);
    const dueDate = formatDateValue(getRecurringDueDate(data)) || 'Soon';
    const lateFeeDetails = getLateFeeDetails(data);
    const lateFeeText = lateFeeDetails.lateFee > 0
        ? `\nLate Fee: ₹${lateFeeDetails.lateFee} (₹100/day after 3 days of due date)\nTotal Due: ₹${lateFeeDetails.totalDue}`
        : `\nLate Fee: ₹0\nTotal Due: ₹${amountToPay}`;
    const securityWarning = lateFeeDetails.lateFee > 0
        ? '\nIf the late fee is not paid, it will be deducted from your security deposit.\n'
        : '';

    return `Hello ${studentName},\n\nThis is a reminder that your PG rent for this month is still pending.\n\nAmount to Pay: ₹${amountToPay}\nDue Date: ${dueDate}${lateFeeText}${securityWarning}\nKindly make the payment as soon as possible.\n\nThank you,\nSafachatt PG Management`;
};

const updateRentPaymentInFirebase = async (entryId, value) => {
    if (!firebaseDatabase || !entryId) return false;
    try {
        const paymentReceived = value === 'true';
        const applicationRef = firebaseDatabase.ref(`applications/${entryId}`);
        let updatedData = null;
        let feeDeductedNow = 0;

        // Apply the payment and any late-fee deduction in one transaction so
        // repeated clicks cannot deduct the same month's fee more than once.
        const transactionResult = await applicationRef.transaction((currentData) => {
            if (!currentData) return currentData;
            const updates = { ...currentData, paymentReceived };

            if (paymentReceived && currentData.paymentReceived !== true && currentData.paymentReceived !== 'true') {
                const dueDate = getRecurringDueDate(currentData);
                const dueDateKey = dueDate ? formatDateValue(dueDate) : '';
                const lateFee = getLateFeeDetails({ ...currentData, paymentReceived: false }).lateFee;
                const alreadyDeducted = dueDateKey
                    && currentData.lateFeeDeductedForDueDate === dueDateKey;

                if (lateFee > 0 && !alreadyDeducted) {
                    const securityBalance = Math.max(0, getSecurityFee(currentData));
                    const deducted = Math.min(securityBalance, lateFee);
                    feeDeductedNow = deducted;
                    updates.securityFee = securityBalance - deducted;
                    updates.lateFeeDeducted = deducted;
                    updates.lateFeeDeductedAt = new Date().toISOString();
                    updates.lateFeeDeductedForDueDate = dueDateKey;
                }
            }

            return updates;
        }, undefined, false);
        if (transactionResult.committed) updatedData = transactionResult.snapshot.val();

        if (!updatedData) throw new Error('Rent payment update was not committed.');
        const matchingEntry = adminApplicationEntriesCache.find(([id]) => id === entryId);
        if (matchingEntry) {
            matchingEntry[1] = updatedData;
        }
        showToast(paymentReceived
            ? (feeDeductedNow > 0 ? `Payment marked received. ₹${feeDeductedNow} late fee deducted from security.` : 'Payment marked as received.')
            : 'Payment marked as pending.');
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

const getSecurityFee = (data) => Number(data?.securityFee ?? data?.securityDeposit ?? data?.security ?? data?.deposit ?? 0) || 0;

const updateRentSecurityInFirebase = async (entryId, value) => {
    if (!firebaseDatabase || !entryId) return false;
    try {
        const parsedValue = Number(value);
        const safeValue = Number.isNaN(parsedValue) ? 0 : parsedValue;
        const updates = { securityFee: safeValue };
        await firebaseDatabase.ref(`applications/${entryId}`).update(updates);
        const matchingEntry = adminApplicationEntriesCache.find(([id]) => id === entryId);
        if (matchingEntry) {
            matchingEntry[1] = { ...matchingEntry[1], ...updates };
        }
        showToast('Security amount updated.');
        return true;
    } catch (error) {
        console.error('Error updating security amount:', error);
        showToast('Unable to update security amount.');
        return false;
    }
};

const renderRentDueTable = (entries) => {
    if (!rentDueTableBody) return;

    const activeEntries = entries.filter(([, data]) => isActiveResident(data));
    if (!activeEntries.length) {
        rentDueTableBody.innerHTML = '<tr><td colspan="8">No active rent records found.</td></tr>';
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
        const amountToPay = Number(data?.amountToPay ?? (data?.monthlyRent || data?.rent || 0));
        const securityFee = getSecurityFee(data);
        const lateFeeDetails = getLateFeeDetails(data);
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
                <td>
                    ${sanitizeText(dueDate || '-')}
                    ${lateFeeDetails.lateFee > 0 ? `<div class="rent-late-fee-note">Late fee: ₹${lateFeeDetails.lateFee}</div>` : ''}
                </td>
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
                    <input type="number" class="rent-security-input" data-entry-id="${sanitizeText(id)}" value="${sanitizeText(securityFee)}" min="0" step="1" inputmode="numeric" placeholder="0" />
                </td>
                <td>
                    <a class="rent-whatsapp-btn" href="${sanitizeText(whatsappUrl)}" target="_blank" rel="noreferrer">WhatsApp</a>
                </td>
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

    document.querySelectorAll('.rent-security-input').forEach((input) => {
        input.addEventListener('change', async (event) => {
            const target = event.currentTarget;
            await updateRentSecurityInFirebase(target.dataset.entryId, target.value);
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
    const totalReceivedAmount = activeEntries.reduce((sum, [, data]) => {
        const paymentReceived = data?.paymentReceived === true || data?.paymentReceived === 'true';
        const receivedAmount = Number(data?.totalReceived ?? data?.receivedAmount ?? data?.amountReceived);
        const amountToPay = Number(data?.amountToPay ?? data?.monthlyRent ?? data?.rent ?? 0);
        const amount = Number.isFinite(receivedAmount) && receivedAmount >= 0
            ? receivedAmount
            : paymentReceived ? amountToPay : 0;
        return sum + amount;
    }, 0);

    if (rentSummaryTotal) rentSummaryTotal.textContent = String(total);
    if (rentSummaryPaid) rentSummaryPaid.textContent = String(paid);
    if (rentSummaryPending) rentSummaryPending.textContent = String(pending);
    if (rentSummaryTodayDue) rentSummaryTodayDue.textContent = String(todayDue);
    if (rentSummaryOverdue) rentSummaryOverdue.textContent = String(overdue);
    if (rentSummaryCollection) rentSummaryCollection.textContent = formatCurrency(totalReceivedAmount);
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
                updateAdminTotals();
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
        <div class="admin-photo-cell">
            ${previewMarkup}
            <label class="admin-photo-upload">
                <span>${value === '-' ? 'Upload' : 'Replace'}</span>
                <input type="file" accept="${sanitizeText(accept)}" class="admin-document-upload-input" data-entry-id="${sanitizeText(entryId)}" data-field="${sanitizeText(field)}" />
            </label>
        </div>
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
    updateAdminTotals();
};

const renderApplicationsTable = (entries) => {
    if (!adminApplicationsTableBody) return;
    if (!entries.length) {
        adminApplicationsTableBody.innerHTML = '<tr><td colspan="8" class="admin-table-empty">No applicants match your search.</td></tr>';
        return;
    }

    const details = [
        ['Father', 'fatherName'], ['Mother', 'motherName'], ['Date of birth', 'dob'],
        ['Age', 'age'], ['Alternate number', 'alternateNumber'], ['Aadhaar number', 'aadhaar'],
        ['Address', 'address'], ['Application status', 'status'], ['Institution', 'institution'],
        ['Course / role', 'position'], ['Food preference', 'foodPref'],
        ['Emergency contact', 'emergencyContact'], ['Medical conditions', 'medicalConditions']
    ];

    adminApplicationsTableBody.innerHTML = entries.map(([id, data]) => {
        const name = data?.fullName || 'Unnamed applicant';
        const moveOutDate = data?.moveOutDate || '';
        const status = getResidentStatus(data);
        const detailRows = details.map(([label, key]) => `
            <div class="applicant-detail"><span>${sanitizeText(label)}</span><strong>${sanitizeText(data?.[key] || '-')}</strong></div>
        `).join('');

        return `<tr>
            <td><div class="applicant-name"><strong>${sanitizeText(name)}</strong><span>Move in ${sanitizeText(formatDateValue(data?.moveInDate) || '-')}</span></div></td>
            <td><div class="applicant-contact"><a href="mailto:${sanitizeText(data?.email || '')}">${sanitizeText(data?.email || '-')}</a><a href="tel:${sanitizeText(data?.mobile || '')}">${sanitizeText(data?.mobile || '-')}</a></div></td>
            <td><input type="date" class="admin-move-out-date" data-entry-id="${sanitizeText(id)}" value="${sanitizeText(moveOutDate)}" aria-label="Move out date for ${sanitizeText(name)}" /></td>
            <td><span class="admin-status-badge ${status.className}">${sanitizeText(status.label)}</span></td>
            <td>${renderDocumentCell(data?.passportPhoto || '-', id, 'Applicant photo', 'passportPhoto', 'image/*')}</td>
            <td>${renderDocumentCell(data?.aadhaarUpload || '-', id, 'Aadhaar document', 'aadhaarUpload', 'image/*,application/pdf')}</td>
            <td>${renderDocumentCell(data?.idCardUpload || '-', id, 'ID card', 'idCardUpload', 'image/*,application/pdf')}</td>
            <td><details class="admin-details applicant-details"><summary>View details</summary><div class="applicant-details-grid">${detailRows}</div></details></td>
        </tr>`;
    }).join('');

    attachMoveOutDateHandlers();
    attachDocumentUploadHandlers();
};
const getReceiptMonthLabel = (data) => {
    const date = parseDateValue(data?.paymentDate || data?.receiptDate || data?.createdAt);
    return date ? date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : 'Date not available';
};

const getReceiptDate = (data) => parseDateValue(data?.paymentDate || data?.receiptDate || data?.createdAt);
const getReceiptAmount = (data) => {
    const amount = Number(data?.totalReceived ?? data?.totalAmount ?? data?.amountDue ?? 0);
    return Number.isFinite(amount) ? amount : 0;
};
const getReceiptMonthKey = (date) => date ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}` : '';
const updateReceiptTotals = (entries) => {
    const now = new Date();
    const currentMonthKey = getReceiptMonthKey(now);
    const currentYear = now.getFullYear();
    const selectedMonthKey = receiptMonthFilter?.value || currentMonthKey;
    const monthTotal = entries.reduce((sum, [, data]) => {
        const date = getReceiptDate(data);
        return getReceiptMonthKey(date) === currentMonthKey ? sum + getReceiptAmount(data) : sum;
    }, 0);
    const yearTotal = entries.reduce((sum, [, data]) => {
        const date = getReceiptDate(data);
        return date?.getFullYear() === currentYear ? sum + getReceiptAmount(data) : sum;
    }, 0);
    const selectedMonthTotal = entries.reduce((sum, [, data]) => {
        return getReceiptMonthKey(getReceiptDate(data)) === selectedMonthKey ? sum + getReceiptAmount(data) : sum;
    }, 0);

    if (receiptMonthTotal) receiptMonthTotal.textContent = formatCurrency(monthTotal);
    if (receiptYearTotal) receiptYearTotal.textContent = formatCurrency(yearTotal);
    if (receiptSelectedMonthTotal) receiptSelectedMonthTotal.textContent = formatCurrency(selectedMonthTotal);
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
    updateReceiptTotals(adminReceiptEntriesCache);
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
        const total = Number(data.totalReceived ?? data.totalAmount ?? data.amountDue ?? ((Number(data.pgRent) || 0) + (Number(data.securityFee) || 0) + (Number(data.lateFee) || 0)));
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

const filterContactMessageEntries = (entries, searchTerm) => {
    const query = String(searchTerm || '').trim().toLowerCase();
    if (!query) return entries;
    return entries.filter(([, data]) => [
        data?.contactName,
        data?.contactEmail,
        data?.contactPhone,
        data?.contactMessage
    ].some((value) => String(value || '').toLowerCase().includes(query)));
};

const renderContactMessagesTable = (entries) => {
    if (!contactMessagesTableBody) return;
    if (!entries.length) {
        contactMessagesTableBody.innerHTML = '<tr><td colspan="5">No contact messages found.</td></tr>';
        return;
    }

    contactMessagesTableBody.innerHTML = entries.map(([, data]) => `
        <tr>
            <td>${sanitizeText(data?.contactName || '-')}</td>
            <td><a href="mailto:${sanitizeText(data?.contactEmail || '')}">${sanitizeText(data?.contactEmail || '-')}</a></td>
            <td><a href="tel:${sanitizeText(data?.contactPhone || '')}">${sanitizeText(data?.contactPhone || '-')}</a></td>
            <td class="contact-message-cell">${sanitizeText(data?.contactMessage || '-')}</td>
            <td>${formatSubmittedAt(data?.submittedAt)}</td>
        </tr>
    `).join('');
};

const getExpenseAmount = (data) => {
    const amount = Number(data?.amount || 0);
    return Number.isFinite(amount) ? amount : 0;
};

const getExpenseDate = (data) => parseDateValue(data?.date || data?.createdAt);
const getExpenseMonthKey = (date) => date ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}` : '';

const getFilteredExpenseEntries = () => {
    const query = String(expenseSearchInput?.value || '').trim().toLowerCase();
    const month = expenseMonthFilter?.value || '';
    const category = expenseCategoryFilter?.value || '';
    return adminExpenseEntriesCache.filter(([, data]) => {
        const date = getExpenseDate(data);
        const searchable = [data?.title, data?.category, data?.paymentMethod, data?.note]
            .map((value) => String(value || '').toLowerCase()).join(' ');
        return (!query || searchable.includes(query)) &&
            (!month || getExpenseMonthKey(date) === month) &&
            (!category || data?.category === category);
    });
};

const updateExpenseTotals = (entries) => {
    const now = new Date();
    const selectedMonthKey = expenseMonthFilter?.value || getExpenseMonthKey(now);
    const [selectedYear, selectedMonth] = selectedMonthKey.split('-').map(Number);
    const selectedMonthDate = selectedYear && selectedMonth ? new Date(selectedYear, selectedMonth - 1, 1) : now;
    const year = now.getFullYear();
    const allTotal = adminExpenseEntriesCache.reduce((sum, [, data]) => sum + getExpenseAmount(data), 0);
    const monthTotal = adminExpenseEntriesCache.reduce((sum, [, data]) => getExpenseMonthKey(getExpenseDate(data)) === selectedMonthKey ? sum + getExpenseAmount(data) : sum, 0);
    const yearTotal = adminExpenseEntriesCache.reduce((sum, [, data]) => getExpenseDate(data)?.getFullYear() === year ? sum + getExpenseAmount(data) : sum, 0);
    const receivedTotal = adminReceiptEntriesCache.reduce((sum, [, data]) => getReceiptMonthKey(getReceiptDate(data)) === selectedMonthKey ? sum + getReceiptAmount(data) : sum, 0);
    const balance = receivedTotal - monthTotal;
    if (expenseTotal) expenseTotal.textContent = formatCurrency(allTotal);
    if (expenseMonthTotal) expenseMonthTotal.textContent = formatCurrency(monthTotal);
    if (expenseMonthLabel) {
        expenseMonthLabel.textContent = `Total for ${selectedMonthDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}`;
    }
    if (expenseYearTotal) expenseYearTotal.textContent = formatCurrency(yearTotal);
    if (expenseCount) expenseCount.textContent = String(entries.length);
    if (expenseComparisonLabel) {
        expenseComparisonLabel.textContent = `${selectedMonthDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })} comparison`;
    }
    if (expenseReceivedTotal) expenseReceivedTotal.textContent = formatCurrency(receivedTotal);
    if (expenseComparedTotal) expenseComparedTotal.textContent = formatCurrency(monthTotal);
    if (expenseBalanceTotal) {
        expenseBalanceTotal.textContent = `${balance >= 0 ? 'Balance' : 'Shortfall'} ${formatCurrency(Math.abs(balance))}`;
        expenseBalanceTotal.className = balance >= 0 ? 'expense-balance-positive' : 'expense-balance-negative';
    }
};

const renderExpensesTable = (entries) => {
    if (!expensesTableBody) return;
    updateExpenseTotals(entries);
    if (!entries.length) {
        expensesTableBody.innerHTML = '<tr><td colspan="7">No expenses match the current filters.</td></tr>';
        return;
    }
    expensesTableBody.innerHTML = entries.map(([id, data]) => `
        <tr>
            <td>${sanitizeText(formatDateValue(data?.date) || '-')}</td>
            <td><strong>${sanitizeText(data?.title || '-')}</strong></td>
            <td>${sanitizeText(data?.category || '-')}</td>
            <td>${sanitizeText(data?.paymentMethod || '-')}</td>
            <td class="expense-note-cell">${sanitizeText(data?.note || '-')}</td>
            <td><strong>${formatCurrency(getExpenseAmount(data))}</strong></td>
            <td class="expense-actions"><button type="button" class="expense-action-button" data-expense-edit="${sanitizeText(id)}">Edit</button><button type="button" class="expense-action-button danger" data-expense-delete="${sanitizeText(id)}">Delete</button></td>
        </tr>
    `).join('');
};

const resetExpenseForm = () => {
    expenseForm?.reset();
    if (expenseIdInput) expenseIdInput.value = '';
    if (expenseDateInput) expenseDateInput.value = new Date().toISOString().slice(0, 10);
    if (expenseSubmitButton) expenseSubmitButton.textContent = 'Save expense';
    expenseCancelEditButton?.classList.add('hidden');
};

const editExpense = (entryId) => {
    const entry = adminExpenseEntriesCache.find(([id]) => id === entryId);
    if (!entry) return;
    const [, data] = entry;
    if (expenseIdInput) expenseIdInput.value = entryId;
    if (expenseTitleInput) expenseTitleInput.value = data.title || '';
    if (expenseAmountInput) expenseAmountInput.value = data.amount || '';
    if (expenseCategoryInput) expenseCategoryInput.value = data.category || '';
    if (expenseDateInput) expenseDateInput.value = data.date || '';
    if (expensePaymentMethodInput) expensePaymentMethodInput.value = data.paymentMethod || 'Cash';
    if (expenseNoteInput) expenseNoteInput.value = data.note || '';
    if (expenseSubmitButton) expenseSubmitButton.textContent = 'Update expense';
    expenseCancelEditButton?.classList.remove('hidden');
    expenseTitleInput?.focus();
};

const saveExpense = async (event) => {
    event.preventDefault();
    if (!firebaseDatabase || !expenseForm?.reportValidity()) return;
    const amount = Number(expenseAmountInput?.value);
    if (!Number.isFinite(amount) || amount <= 0) {
        showToast('Enter an expense amount greater than zero.');
        return;
    }
    const entryId = expenseIdInput?.value;
    const data = {
        title: expenseTitleInput.value.trim(),
        amount,
        category: expenseCategoryInput.value,
        date: expenseDateInput.value,
        paymentMethod: expensePaymentMethodInput.value,
        note: expenseNoteInput.value.trim(),
        updatedAt: new Date().toISOString()
    };
    try {
        const expenseRef = entryId ? firebaseDatabase.ref(`expenses/${entryId}`) : firebaseDatabase.ref('expenses').push();
        if (!entryId) data.createdAt = data.updatedAt;
        await expenseRef.set(data);
        resetExpenseForm();
        await loadAdminData();
        showToast(entryId ? 'Expense updated.' : 'Expense saved.');
    } catch (error) {
        console.error('Error saving expense:', error);
        const message = error?.code === 'PERMISSION_DENIED'
            ? 'Expense blocked by Firebase rules. Deploy database.rules.json, then refresh the page.'
            : 'Unable to save expense.';
        showToast(message);
    }
};

const deleteExpense = async (entryId) => {
    if (!firebaseDatabase || !firebaseAuth?.currentUser || !window.confirm('Delete this expense? This action cannot be undone.')) return;
    const adminUser = firebaseAuth.currentUser;
    const password = window.prompt(`Enter the password for ${adminUser.email} to delete this expense:`);
    if (!password) {
        showToast('Expense deletion cancelled.');
        return;
    }

    try {
        const credential = firebase.auth.EmailAuthProvider.credential(adminUser.email, password);
        await adminUser.reauthenticateWithCredential(credential);
        await firebaseDatabase.ref(`expenses/${entryId}`).remove();
        await loadAdminData();
        showToast('Expense deleted.');
    } catch (error) {
        console.error('Error deleting expense:', error);
        const message = error?.code === 'auth/invalid-credential' || error?.code === 'auth/wrong-password'
            ? 'Incorrect admin password. Expense was not deleted.'
            : error?.code === 'PERMISSION_DENIED'
                ? 'Expense deletion blocked by Firebase rules.'
                : 'Unable to delete expense.';
        showToast(message);
    }
};

const addDailyMilkExpenses = async () => {
    if (!firebaseDatabase || !firebaseAuth?.currentUser) return;
    const formatLocalDate = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const startDate = new Date(2026, 7, 10);
    const today = new Date();
    const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const existingMilkDates = new Set(adminExpenseEntriesCache
        .filter(([, data]) => data?.title === 'Milk' && data?.amount === 120)
        .map(([, data]) => data.date));
    const entriesToAdd = [];

    for (const date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
        const dateValue = formatLocalDate(date);
        if (!existingMilkDates.has(dateValue)) entriesToAdd.push(dateValue);
    }

    if (!entriesToAdd.length) {
        showToast('Daily milk entries are already up to date.');
        return;
    }
    if (!window.confirm(`Add ${entriesToAdd.length} milk entries at ₹120 each from 10 Aug 2026?`)) return;

    try {
        const writes = entriesToAdd.map((dateValue) => {
            const expenseRef = firebaseDatabase.ref('expenses').push();
            return expenseRef.set({
                title: 'Milk',
                amount: 120,
                category: 'Food & Kitchen',
                date: dateValue,
                paymentMethod: 'Cash',
                note: 'Daily milk expense',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
        });
        await Promise.all(writes);
        await loadAdminData();
        showToast(`${entriesToAdd.length} daily milk entries added.`);
    } catch (error) {
        console.error('Error adding daily milk expenses:', error);
        showToast(error?.code === 'PERMISSION_DENIED'
            ? 'Milk entries blocked by Firebase rules. Deploy database.rules.json.'
            : 'Unable to add daily milk expenses.');
    }
};

const exportExpenses = () => {
    const entries = getFilteredExpenseEntries();
    if (!entries.length) {
        showToast('There are no expenses to export.');
        return;
    }
    const escapeCsv = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;
    const rows = [['Date', 'Title', 'Category', 'Payment method', 'Note', 'Amount'], ...entries.map(([, data]) => [data.date, data.title, data.category, data.paymentMethod, data.note, getExpenseAmount(data)])];
    const csv = rows.map((row) => row.map(escapeCsv).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `safachatt-expenses-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
};

const kitchenItemForm = document.getElementById('kitchenItemForm');
const kitchenItemIdInput = document.getElementById('kitchenItemId');
const kitchenItemNameInput = document.getElementById('kitchenItemName');
const kitchenItemUnitInput = document.getElementById('kitchenItemUnit');
const kitchenItemInitialStockInput = document.getElementById('kitchenItemInitialStock');
const kitchenItemMinimumInput = document.getElementById('kitchenItemMinimum');
const kitchenItemSubmitButton = document.getElementById('kitchenItemSubmit');
const kitchenCancelEditButton = document.getElementById('kitchenCancelEdit');
const kitchenInitialStockGroup = document.getElementById('kitchenInitialStockGroup');
const kitchenInventoryBody = document.getElementById('kitchenInventoryBody');
const kitchenAttentionList = document.getElementById('kitchenAttentionList');
const kitchenStatusFilter = document.getElementById('kitchenStatusFilter');
const kitchenSearchInput = document.getElementById('kitchenSearch');
const kitchenHistoryBody = document.getElementById('kitchenHistoryBody');
const kitchenHistorySearchInput = document.getElementById('kitchenHistorySearch');
const kitchenHistoryTypeInput = document.getElementById('kitchenHistoryType');
const kitchenHistoryFromInput = document.getElementById('kitchenHistoryFrom');
const kitchenHistoryToInput = document.getElementById('kitchenHistoryTo');
const kitchenMovementModal = document.getElementById('kitchenMovementModal');
const kitchenMovementForm = document.getElementById('kitchenMovementForm');
const kitchenMovementTitle = document.getElementById('kitchenMovementTitle');
const kitchenMovementDescription = document.getElementById('kitchenMovementDescription');
const kitchenMovementItemInput = document.getElementById('kitchenMovementItem');
const kitchenMovementQuantityInput = document.getElementById('kitchenMovementQuantity');
const kitchenMovementUnitInput = document.getElementById('kitchenMovementUnit');
const kitchenMovementDateInput = document.getElementById('kitchenMovementDate');
const kitchenMovementReasonLabel = document.getElementById('kitchenMovementReasonLabel');
const kitchenMovementReasonInput = document.getElementById('kitchenMovementReason');
const kitchenMovementSubmitButton = document.getElementById('kitchenMovementSubmit');

const isKitchenPermissionDenied = (error) =>
    String(error?.code || error?.message || '').toLowerCase().includes('permission_denied');

const showKitchenPermissionError = () => {
    showToast('Firebase denied kitchen access. Publish the latest database.rules.json in Realtime Database → Rules, then refresh.');
};

const getKitchenItemStock = (item) => {
    const stock = Number(item?.stock);
    return Number.isFinite(stock) && stock >= 0 ? stock : 0;
};

const getKitchenItemStatus = (item) => {
    const stock = getKitchenItemStock(item);
    if (stock === 0) return { label: 'Out of Stock', className: 'out' };
    if (stock <= Number(item?.minimumStock || 0)) return { label: 'Low Stock', className: 'low' };
    return { label: 'Available', className: 'available' };
};

const formatKitchenQuantity = (quantity) => Number(quantity || 0).toLocaleString('en-IN', {
    maximumFractionDigits: 3
});

const getKitchenItemEntries = () => kitchenItemEntriesCache;

const getFilteredKitchenItemEntries = () => {
    const query = String(kitchenSearchInput?.value || '').trim().toLowerCase();
    const status = kitchenStatusFilter?.value || '';
    return getKitchenItemEntries().filter(([, item]) => {
        const itemStatus = getKitchenItemStatus(item);
        const searchable = [item?.name, item?.unit].map((value) => String(value || '').toLowerCase()).join(' ');
        return (!query || searchable.includes(query)) &&
            (!status || itemStatus.className === status);
    });
};

const getFilteredKitchenTransactionEntries = () => {
    const query = String(kitchenHistorySearchInput?.value || '').trim().toLowerCase();
    const type = kitchenHistoryTypeInput?.value || '';
    const from = kitchenHistoryFromInput?.value || '';
    const to = kitchenHistoryToInput?.value || '';
    return kitchenTransactionEntriesCache.filter(([, transaction]) => {
        const itemName = String(transaction?.itemName || '').toLowerCase();
        const parsedDate = new Date(transaction?.timestamp || '');
        const date = Number.isNaN(parsedDate.getTime()) ? '' :
            `${parsedDate.getFullYear()}-${String(parsedDate.getMonth() + 1).padStart(2, '0')}-${String(parsedDate.getDate()).padStart(2, '0')}`;
        return (!query || itemName.includes(query)) &&
            (!type || transaction?.type === type) &&
            (!from || date >= from) &&
            (!to || date <= to);
    });
};

const renderKitchenSummary = () => {
    const items = getKitchenItemEntries().map(([, item]) => item);
    const lowStock = items.filter((item) => getKitchenItemStatus(item).className === 'low');
    const outOfStock = items.filter((item) => getKitchenItemStatus(item).className === 'out');
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const recentTransactions = kitchenTransactionEntriesCache
        .map(([, transaction]) => transaction)
        .filter((transaction) => {
            const timestamp = new Date(transaction?.timestamp || '').getTime();
            return Number.isFinite(timestamp) && timestamp >= thirtyDaysAgo;
        });
    const added = recentTransactions.filter((transaction) => transaction.type === 'Added')
        .reduce((sum, transaction) => sum + Number(transaction.quantity || 0), 0);
    const deducted = recentTransactions.filter((transaction) => transaction.type === 'Subtracted')
        .reduce((sum, transaction) => sum + Number(transaction.quantity || 0), 0);
    const setValue = (id, value) => {
        const element = document.getElementById(id);
        if (element) element.textContent = String(value);
    };

    setValue('kitchenTotalItems', items.length);
    setValue('kitchenTotalStock', formatKitchenQuantity(items.reduce((sum, item) => sum + getKitchenItemStock(item), 0)));
    setValue('kitchenLowStock', lowStock.length);
    setValue('kitchenOutOfStock', outOfStock.length);
    setValue('kitchenRecentAdded', formatKitchenQuantity(added));
    setValue('kitchenRecentDeducted', formatKitchenQuantity(deducted));
    setValue('kitchenAttentionCount', `${lowStock.length + outOfStock.length} item${lowStock.length + outOfStock.length === 1 ? '' : 's'}`);

    if (!kitchenAttentionList) return;
    const attentionItems = [...outOfStock, ...lowStock]
        .sort((a, b) => getKitchenItemStock(a) - getKitchenItemStock(b));
    kitchenAttentionList.innerHTML = attentionItems.length
        ? attentionItems.map((item) => {
            const itemStatus = getKitchenItemStatus(item);
            return `<div class="kitchen-attention-item">
                <span class="kitchen-status-badge ${itemStatus.className}">${itemStatus.label}</span>
                <strong>${sanitizeText(item.name || 'Unnamed item')}</strong>
                <span>${formatKitchenQuantity(getKitchenItemStock(item))} ${sanitizeText(item.unit || '')} available</span>
                <span>Minimum ${formatKitchenQuantity(item.minimumStock)} ${sanitizeText(item.unit || '')}</span>
            </div>`;
        }).join('')
        : '<p class="kitchen-empty">No items need replenishment.</p>';
};

const renderKitchenInventory = () => {
    if (!kitchenInventoryBody) return;
    const entries = getFilteredKitchenItemEntries()
        .sort(([, a], [, b]) => String(a?.name || '').localeCompare(String(b?.name || '')));
    if (!entries.length) {
        kitchenInventoryBody.innerHTML = '<tr><td colspan="7" class="admin-table-empty">No inventory items match these filters.</td></tr>';
        return;
    }
    kitchenInventoryBody.innerHTML = entries.map(([id, item]) => {
        const status = getKitchenItemStatus(item);
        return `<tr>
            <td><strong>${sanitizeText(item?.name || '-')}</strong></td>
            <td><strong>${formatKitchenQuantity(getKitchenItemStock(item))}</strong></td>
            <td>${sanitizeText(item?.unit || '-')}</td>
            <td>${formatKitchenQuantity(item?.minimumStock)}</td>
            <td><span class="kitchen-status-badge ${status.className}">${status.label}</span></td>
            <td>${sanitizeText(formatSubmittedAt(item?.updatedAt))}</td>
            <td class="kitchen-row-actions">
                <button type="button" class="kitchen-action-button" data-kitchen-add="${sanitizeText(id)}">Add stock</button>
                <button type="button" class="kitchen-action-button" data-kitchen-subtract="${sanitizeText(id)}">Subtract</button>
                <button type="button" class="kitchen-action-button" data-kitchen-edit="${sanitizeText(id)}">Edit</button>
                <button type="button" class="kitchen-action-button danger" data-kitchen-delete="${sanitizeText(id)}">Delete</button>
            </td>
        </tr>`;
    }).join('');
};

const renderKitchenHistory = () => {
    if (!kitchenHistoryBody) return;
    const entries = getFilteredKitchenTransactionEntries()
        .sort(([, a], [, b]) => new Date(b?.timestamp || 0) - new Date(a?.timestamp || 0));
    if (!entries.length) {
        kitchenHistoryBody.innerHTML = '<tr><td colspan="8" class="admin-table-empty">No stock movements match these filters.</td></tr>';
        return;
    }
    kitchenHistoryBody.innerHTML = entries.map(([, transaction]) => {
        const quantity = Number(transaction?.quantity || 0);
        const change = transaction?.type === 'Subtracted' ? `−${formatKitchenQuantity(quantity)}` : `+${formatKitchenQuantity(quantity)}`;
        return `<tr>
            <td>${sanitizeText(formatSubmittedAt(transaction?.timestamp))}</td>
            <td><strong>${sanitizeText(transaction?.itemName || '-')}</strong></td>
            <td><span class="kitchen-status-badge ${transaction?.type === 'Subtracted' ? 'out' : transaction?.type === 'Adjustment' ? 'low' : 'available'}">${sanitizeText(transaction?.type || '-')}</span></td>
            <td>${formatKitchenQuantity(transaction?.previousQuantity)} ${sanitizeText(transaction?.unit || '')}</td>
            <td>${change} ${sanitizeText(transaction?.unit || '')}</td>
            <td><strong>${formatKitchenQuantity(transaction?.balance)} ${sanitizeText(transaction?.unit || '')}</strong></td>
            <td>${sanitizeText(transaction?.reason || '-')}</td>
            <td>${sanitizeText(transaction?.admin || '-')}</td>
        </tr>`;
    }).join('');
};

const renderKitchenManagement = () => {
    renderKitchenSummary();
    renderKitchenInventory();
    renderKitchenHistory();
};

const resetKitchenItemForm = () => {
    kitchenItemForm?.reset();
    if (kitchenItemIdInput) kitchenItemIdInput.value = '';
    kitchenItemUnitInput?.querySelectorAll('[data-existing-unit]').forEach((option) => option.remove());
    if (kitchenItemInitialStockInput) kitchenItemInitialStockInput.value = '0';
    if (kitchenItemMinimumInput) kitchenItemMinimumInput.value = '0';
    if (kitchenItemSubmitButton) kitchenItemSubmitButton.textContent = 'Add inventory item';
    kitchenInitialStockGroup?.classList.remove('hidden');
    kitchenCancelEditButton?.classList.add('hidden');
};

const editKitchenItem = (itemId) => {
    const entry = kitchenItemEntriesCache.find(([id]) => id === itemId);
    if (!entry) return;
    const [, item] = entry;
    kitchenItemIdInput.value = itemId;
    kitchenItemNameInput.value = item.name || '';
    const existingUnit = String(item.unit || '');
    if (existingUnit && !Array.from(kitchenItemUnitInput.options).some((option) => option.value === existingUnit)) {
        const option = document.createElement('option');
        option.value = existingUnit;
        option.textContent = existingUnit;
        option.dataset.existingUnit = 'true';
        kitchenItemUnitInput.append(option);
    }
    kitchenItemUnitInput.value = existingUnit;
    kitchenItemMinimumInput.value = String(item.minimumStock ?? 0);
    kitchenItemSubmitButton.textContent = 'Update inventory item';
    kitchenInitialStockGroup.classList.add('hidden');
    kitchenCancelEditButton.classList.remove('hidden');
    kitchenItemNameInput.focus();
};

const isKitchenDuplicateName = (items, name, exceptId) => Object.entries(items || {}).some(([id, item]) =>
    id !== exceptId && String(item?.name || '').trim().toLocaleLowerCase() === name.toLocaleLowerCase());

const saveKitchenItem = async (event) => {
    event.preventDefault();
    if (!firebaseDatabase || !firebaseAuth?.currentUser || !kitchenItemForm?.reportValidity() || kitchenMovementSubmitting) return;
    const name = kitchenItemNameInput.value.trim();
    const unit = kitchenItemUnitInput.value.trim();
    const minimumStock = Number(Number(kitchenItemMinimumInput.value).toFixed(3));
    const isEditing = Boolean(kitchenItemIdInput.value);
    const initialStock = isEditing ? 0 : Number(Number(kitchenItemInitialStockInput.value).toFixed(3));
    if (!name || !unit || !Number.isFinite(minimumStock) || minimumStock < 0 ||
        !Number.isFinite(initialStock) || initialStock < 0) {
        showToast('Enter valid item details and non-negative stock quantities.');
        return;
    }
    const itemId = kitchenItemIdInput.value || firebaseDatabase.ref('kitchenManagement/items').push().key;
    const transactionId = !isEditing && initialStock > 0 ? firebaseDatabase.ref('kitchenManagement/transactions').push().key : '';
    const now = new Date().toISOString();
    const adminUser = firebaseAuth.currentUser;
    const itemData = { name, unit, minimumStock, updatedAt: now };
    kitchenMovementSubmitting = true;
    kitchenItemSubmitButton.disabled = true;
    kitchenItemCancelButtonState(true);
    try {
        const result = await firebaseDatabase.ref('kitchenManagement').transaction((currentData) => {
            const data = currentData || { items: {}, transactions: {} };
            data.items = data.items || {};
            data.transactions = data.transactions || {};
            if (isKitchenDuplicateName(data.items, name, itemId)) return;
            if (isEditing) {
                if (!data.items[itemId]) return;
                data.items[itemId] = { ...data.items[itemId], ...itemData };
            } else {
                if (data.items[itemId]) return;
                data.items[itemId] = {
                    ...itemData,
                    stock: initialStock,
                    createdAt: now
                };
                if (transactionId) {
                    data.transactions[transactionId] = {
                        itemId,
                        itemName: name,
                        type: 'Adjustment',
                        previousQuantity: 0,
                        quantity: initialStock,
                        balance: initialStock,
                        unit,
                        timestamp: now,
                        reason: 'Starting inventory',
                        admin: adminUser.email || adminUser.uid
                    };
                }
            }
            return data;
        }, undefined, false);
        if (!result.committed) {
            showToast('Inventory was not saved. Check for a duplicate name or refresh and try again.');
            return;
        }
        resetKitchenItemForm();
        await loadAdminData();
        showToast(isEditing ? 'Inventory item updated.' : 'Inventory item added.');
    } catch (error) {
        console.error('Error saving kitchen inventory item:', error);
        if (isKitchenPermissionDenied(error)) showKitchenPermissionError();
        else showToast('Unable to save the inventory item.');
    } finally {
        kitchenMovementSubmitting = false;
        kitchenItemCancelButtonState(false);
    }
};

const kitchenItemCancelButtonState = (disabled) => {
    if (kitchenItemSubmitButton) kitchenItemSubmitButton.disabled = disabled;
    if (kitchenCancelEditButton) kitchenCancelEditButton.disabled = disabled;
};

const deleteKitchenItem = async (itemId) => {
    const entry = kitchenItemEntriesCache.find(([id]) => id === itemId);
    if (!firebaseDatabase || !firebaseAuth?.currentUser || !entry) return;
    const [, item] = entry;
    if (!window.confirm(`Delete ${item.name}? Historical stock transactions will be retained.`)) return;
    try {
        const result = await firebaseDatabase.ref('kitchenManagement').transaction((currentData) => {
            if (!currentData?.items?.[itemId]) return;
            delete currentData.items[itemId];
            return currentData;
        }, undefined, false);
        if (!result.committed) {
            showToast('Inventory item was not deleted. Refresh and try again.');
            return;
        }
        await loadAdminData();
        showToast('Inventory item deleted. Transaction history was retained.');
    } catch (error) {
        console.error('Error deleting kitchen inventory item:', error);
        if (isKitchenPermissionDenied(error)) showKitchenPermissionError();
        else showToast('Unable to delete the inventory item.');
    }
};

const openKitchenMovementModal = (itemId, type) => {
    if (kitchenMovementSubmitting) return;
    const entry = kitchenItemEntriesCache.find(([id]) => id === itemId);
    if (!entry) return;
    const [, item] = entry;
    kitchenMovementItemId = itemId;
    kitchenMovementType = type;
    kitchenMovementForm.reset();
    kitchenMovementItemInput.value = item.name || '';
    kitchenMovementUnitInput.value = item.unit || '';
    kitchenMovementDateInput.value = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    kitchenMovementTitle.textContent = type === 'Added' ? 'Add stock' : 'Subtract stock';
    kitchenMovementDescription.textContent = type === 'Added'
        ? 'Record new stock received for this item.'
        : 'Record consumption, wastage, or another stock deduction.';
    kitchenMovementReasonLabel.textContent = type === 'Added' ? 'Remarks' : 'Reason *';
    kitchenMovementReasonInput.required = type === 'Subtracted';
    kitchenMovementReasonInput.placeholder = type === 'Added' ? 'Optional remarks' : 'e.g. Daily kitchen consumption';
    kitchenMovementQuantityInput.max = type === 'Subtracted' ? String(getKitchenItemStock(item)) : '';
    kitchenMovementSubmitButton.textContent = type === 'Added' ? 'Add stock' : 'Subtract stock';
    kitchenMovementModal.classList.add('open');
    kitchenMovementModal.setAttribute('aria-hidden', 'false');
    kitchenMovementQuantityInput.focus();
};

const closeKitchenMovementModal = (force = false) => {
    if (kitchenMovementSubmitting && !force) return;
    kitchenMovementModal?.classList.remove('open');
    kitchenMovementModal?.setAttribute('aria-hidden', 'true');
    kitchenMovementItemId = '';
    kitchenMovementType = '';
};

const saveKitchenMovement = async (event) => {
    event.preventDefault();
    if (!firebaseDatabase || !firebaseAuth?.currentUser || !kitchenMovementForm?.reportValidity() || kitchenMovementSubmitting) return;
    const quantity = Number(Number(kitchenMovementQuantityInput.value).toFixed(3));
    const selectedDate = new Date(kitchenMovementDateInput.value);
    const reason = kitchenMovementReasonInput.value.trim();
    if (!Number.isFinite(quantity) || quantity <= 0 || !Number.isFinite(selectedDate.getTime()) ||
        (kitchenMovementType === 'Subtracted' && !reason)) {
        showToast('Enter a valid quantity, date, and deduction reason.');
        return;
    }
    const movementId = firebaseDatabase.ref('kitchenManagement/transactions').push().key;
    const now = new Date().toISOString();
    const timestamp = selectedDate.toISOString();
    const adminUser = firebaseAuth.currentUser;
    const itemId = kitchenMovementItemId;
    const movementType = kitchenMovementType;
    const itemName = kitchenMovementItemInput.value;
    let failureReason = '';
    kitchenMovementSubmitting = true;
    kitchenMovementSubmitButton.disabled = true;
    try {
        const result = await firebaseDatabase.ref('kitchenManagement').transaction((currentData) => {
            const data = currentData || { items: {}, transactions: {} };
            data.items = data.items || {};
            data.transactions = data.transactions || {};
            const item = data.items[itemId];
            if (!item) {
                failureReason = 'The inventory item no longer exists. Refresh and try again.';
                return;
            }
            const previousQuantity = Number(getKitchenItemStock(item).toFixed(3));
            if (movementType === 'Subtracted' && quantity > previousQuantity) {
                failureReason = `Not enough stock. Only ${formatKitchenQuantity(previousQuantity)} ${item.unit || ''} is available.`;
                return;
            }
            const balance = Number((movementType === 'Added' ? previousQuantity + quantity : previousQuantity - quantity).toFixed(3));
            if (!Number.isFinite(balance) || balance < 0) {
                failureReason = 'This movement would make stock negative.';
                return;
            }
            item.stock = balance;
            item.updatedAt = now;
            data.transactions[movementId] = {
                itemId,
                itemName: item.name || itemName,
                type: movementType,
                previousQuantity,
                quantity,
                balance,
                unit: item.unit || '',
                timestamp,
                reason,
                admin: adminUser.email || adminUser.uid
            };
            return data;
        }, undefined, false);
        if (!result.committed) {
            showToast(failureReason || 'Stock was not updated. Refresh and try again.');
            return;
        }
        closeKitchenMovementModal(true);
        await loadAdminData();
        showToast(movementType === 'Added' ? 'Stock added and recorded.' : 'Stock deducted and recorded.');
    } catch (error) {
        console.error('Error saving kitchen stock movement:', error);
        if (isKitchenPermissionDenied(error)) showKitchenPermissionError();
        else showToast('Unable to save the stock movement.');
    } finally {
        kitchenMovementSubmitting = false;
        kitchenMovementSubmitButton.disabled = false;
    }
};

const loadKitchenData = (snapshot) => {
    const data = snapshot?.val() || {};
    kitchenItemEntriesCache = Object.entries(data.items || {});
    kitchenTransactionEntriesCache = Object.entries(data.transactions || {});
    renderKitchenManagement();
};

const updateAdminTotals = () => {
    const allStudents = adminApplicationEntriesCache;
    const activeStudents = allStudents.filter(([, data]) => isActiveResident(data));

    if (adminTotalApplications) adminTotalApplications.textContent = String(allStudents.length);
    if (adminActiveStudents) adminActiveStudents.textContent = String(activeStudents.length);
};

const loadAdminData = async () => {
    if (!firebaseDatabase) {
        showToast('Firebase not initialized. Admin data cannot load.');
        return;
    }

    try {
        const [appsSnapshot, receiptsSnapshot, contactMessagesSnapshot, expensesSnapshot] = await Promise.all([
            firebaseDatabase.ref('applications').orderByKey().once('value'),
            firebaseDatabase.ref('receipts').orderByKey().once('value'),
            firebaseDatabase.ref('contactMessages').orderByKey().once('value'),
            firebaseDatabase.ref('expenses').orderByKey().once('value')
        ]);

        const appsData = appsSnapshot.val() || {};
        const receiptsData = receiptsSnapshot.val() || {};
        const contactMessagesData = contactMessagesSnapshot.val() || {};
        const expensesData = expensesSnapshot.val() || {};
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
        const contactMessageEntries = Object.entries(contactMessagesData).sort(([, a], [, b]) => {
            return new Date(b?.submittedAt || 0).getTime() - new Date(a?.submittedAt || 0).getTime();
        });
        const expenseEntries = Object.entries(expensesData).sort(([, a], [, b]) => {
            return (getExpenseDate(b)?.getTime() || 0) - (getExpenseDate(a)?.getTime() || 0);
        });

        adminApplicationEntriesCache = applicationEntries;
        adminReceiptEntriesCache = receiptEntries;
        adminContactMessageEntriesCache = contactMessageEntries;
        adminExpenseEntriesCache = expenseEntries;
        try {
            const kitchenSnapshot = await firebaseDatabase.ref('kitchenManagement').once('value');
            loadKitchenData(kitchenSnapshot);
        } catch (error) {
            console.error('Error loading kitchen inventory:', error);
            if (kitchenInventoryBody) kitchenInventoryBody.innerHTML = '<tr><td colspan="7">Failed to load kitchen inventory.</td></tr>';
            if (kitchenHistoryBody) kitchenHistoryBody.innerHTML = '<tr><td colspan="8">Failed to load stock history.</td></tr>';
            if (isKitchenPermissionDenied(error)) showKitchenPermissionError();
            else showToast('Unable to load kitchen data.');
        }
        const filteredApplicationEntries = filterApplicationEntries(applicationEntries, adminSearchInput?.value || '');
        renderApplicationsTable(filteredApplicationEntries);
        renderReceiptsTable(filterReceiptEntries(receiptEntries, receiptSearchInput?.value));
        renderContactMessagesTable(filterContactMessageEntries(contactMessageEntries, contactMessageSearchInput?.value));
        renderExpensesTable(getFilteredExpenseEntries());
        updateAdminTotals();
        updateRentSummary(applicationEntries);
        renderRentDueTable(applicationEntries);
    } catch (error) {
        console.error('Error loading admin data:', error);
        if (adminApplicationsTableBody) adminApplicationsTableBody.innerHTML = '<tr><td colspan="8" class="admin-table-empty">Failed to load applications.</td></tr>';
        if (receiptsTableBody) receiptsTableBody.innerHTML = '<tr><td colspan="9">Failed to load payment receipts.</td></tr>';
        if (contactMessagesTableBody) contactMessagesTableBody.innerHTML = '<tr><td colspan="5">Failed to load contact messages.</td></tr>';
        if (expensesTableBody) expensesTableBody.innerHTML = '<tr><td colspan="7">Failed to load expenses.</td></tr>';
        if (kitchenInventoryBody) kitchenInventoryBody.innerHTML = '<tr><td colspan="7">Failed to load kitchen inventory.</td></tr>';
        if (kitchenHistoryBody) kitchenHistoryBody.innerHTML = '<tr><td colspan="8">Failed to load stock history.</td></tr>';
        showToast('Unable to load admin dashboard data.');
    }
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

    if (receiptMonthFilter) {
        receiptMonthFilter.value = new Date().toISOString().slice(0, 7);
        receiptMonthFilter.addEventListener('change', () => updateReceiptTotals(adminReceiptEntriesCache));
    }

    if (contactMessageSearchInput) {
        contactMessageSearchInput.addEventListener('input', () => {
            renderContactMessagesTable(filterContactMessageEntries(adminContactMessageEntriesCache, contactMessageSearchInput.value));
        });
    }

    if (rentSearchNameInput) {
        rentSearchNameInput.addEventListener('input', () => renderRentDueTable(adminApplicationEntriesCache));
    }

    if (expenseDateInput && !expenseDateInput.value) expenseDateInput.value = new Date().toISOString().slice(0, 10);
    expenseForm?.addEventListener('submit', saveExpense);
    expenseCancelEditButton?.addEventListener('click', resetExpenseForm);
    [expenseSearchInput, expenseMonthFilter, expenseCategoryFilter].forEach((input) => {
        input?.addEventListener('input', () => renderExpensesTable(getFilteredExpenseEntries()));
        input?.addEventListener('change', () => renderExpensesTable(getFilteredExpenseEntries()));
    });
    exportExpensesButton?.addEventListener('click', exportExpenses);
    addMilkExpensesButton?.addEventListener('click', addDailyMilkExpenses);
    expensesTableBody?.addEventListener('click', (event) => {
        const editButton = event.target.closest('[data-expense-edit]');
        const deleteButton = event.target.closest('[data-expense-delete]');
        if (editButton) editExpense(editButton.dataset.expenseEdit);
        if (deleteButton) deleteExpense(deleteButton.dataset.expenseDelete);
    });

    kitchenItemForm?.addEventListener('submit', saveKitchenItem);
    kitchenCancelEditButton?.addEventListener('click', resetKitchenItemForm);
    [kitchenSearchInput, kitchenStatusFilter].forEach((input) => {
        input?.addEventListener('input', renderKitchenInventory);
        input?.addEventListener('change', renderKitchenInventory);
    });
    [kitchenHistorySearchInput, kitchenHistoryTypeInput, kitchenHistoryFromInput, kitchenHistoryToInput].forEach((input) => {
        input?.addEventListener('input', renderKitchenHistory);
        input?.addEventListener('change', renderKitchenHistory);
    });
    kitchenInventoryBody?.addEventListener('click', (event) => {
        const addButton = event.target.closest('[data-kitchen-add]');
        const subtractButton = event.target.closest('[data-kitchen-subtract]');
        const editButton = event.target.closest('[data-kitchen-edit]');
        const deleteButton = event.target.closest('[data-kitchen-delete]');
        if (addButton) openKitchenMovementModal(addButton.dataset.kitchenAdd, 'Added');
        if (subtractButton) openKitchenMovementModal(subtractButton.dataset.kitchenSubtract, 'Subtracted');
        if (editButton) editKitchenItem(editButton.dataset.kitchenEdit);
        if (deleteButton) deleteKitchenItem(deleteButton.dataset.kitchenDelete);
    });
    kitchenMovementForm?.addEventListener('submit', saveKitchenMovement);
    document.getElementById('kitchenMovementClose')?.addEventListener('click', closeKitchenMovementModal);
    document.getElementById('kitchenMovementCancel')?.addEventListener('click', closeKitchenMovementModal);
    kitchenMovementModal?.addEventListener('click', (event) => {
        if (event.target === kitchenMovementModal) closeKitchenMovementModal();
    });

    if (sendReminderToAllButton) {
        sendReminderToAllButton.addEventListener('click', sendReminderToAllPendingStudents);
    }

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
        closeKitchenMovementModal();
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
