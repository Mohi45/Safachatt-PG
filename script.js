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
            storageBucket: "safachattpg.firebasestorage.app",
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
        if (age >= 18 && age <= 60) {
            ageField.value = age;
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
        data[key] = value instanceof File ? value.name : value;
    });
    return data;
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
        const databaseRef = firebaseDatabase.ref(`${collectionName}/${Date.now()}`);
        const dataToSave = {
            ...formData,
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

    // Get form data and save to Firebase
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
