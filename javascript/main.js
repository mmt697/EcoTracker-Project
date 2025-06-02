/**
 * EcoTracker - Enhanced Main Application (COMPLETE FIXED VERSION)
 * Core functionality with unified period management and FIXED CSS-based charts
 * FIXED: Chart connectivity, improved dashboard integration, enhanced tips system
 */

// Global Period Management System (SINGLE SOURCE OF TRUTH)
const globalPeriodManager = {
    currentPeriod: 7,
    
    setPeriod: function(days) {
        this.currentPeriod = parseInt(days);
        localStorage.setItem('global_tracking_period', this.currentPeriod.toString());
        
        // Update all components that depend on the period
        this.updateAllComponents();
        
        // Trigger custom event for components to listen to
        document.dispatchEvent(new CustomEvent('periodChanged', { 
            detail: { period: this.currentPeriod } 
        }));
    },
    
    getPeriod: function() {
        return this.currentPeriod;
    },
    
    loadPeriod: function() {
        const savedPeriod = localStorage.getItem('global_tracking_period');
        if (savedPeriod) {
            this.currentPeriod = parseInt(savedPeriod);
        }
        return this.currentPeriod;
    },
    
    updateAllComponents: function() {
        // Update settings tracking period
        settings.trackingPeriod = this.currentPeriod;
        
        // Update dashboard
        if (typeof updateDashboard === 'function') {
            updateDashboard();
        }
        
        // Update history page if active - FIXED: Use proper function names
        if (typeof updateHistoryData === 'function') {
            const historyPage = document.getElementById('historyPage');
            if (historyPage && historyPage.style.display !== 'none') {
                updateHistoryData();
                
                // Re-render FIXED CSS charts
                setTimeout(() => {
                    if (typeof renderFixedPieChart === 'function') {
                        renderFixedPieChart();
                    }
                    if (typeof renderFixedLineChart === 'function') {
                        renderFixedLineChart();
                    }
                }, 100);
            }
        }
        
        // Update all period display texts
        this.updatePeriodDisplays();
    },
    
    updatePeriodDisplays: function() {
        const displays = [
            document.getElementById('periodText'),
            document.getElementById('historyPeriodText'),
            document.getElementById('pieChartPeriodDisplay')
        ];
        
        displays.forEach(display => {
            if (display) {
                display.textContent = `Last ${this.currentPeriod} days`;
            }
        });
        
        // Update global period selector
        const globalPeriodSelect = document.getElementById('globalPeriodSelect');
        if (globalPeriodSelect) {
            globalPeriodSelect.value = this.currentPeriod.toString();
        }
    }
};

// State objects
let isAuthenticated = false;
let currentUser = null;
let users = [];
let waterLogs = [];
let energyLogs = [];
let settings = {
    trackingPeriod: 7,
    waterGoal: 150,
    energyGoal: 10,
    currency: 'R'
};

// Dashboard tips cycling system
let dashboardTipsState = {
    currentTipIndex: 0,
    displayedTips: [],
    rotationInterval: null
};

// DOM elements cache for better performance
const domElements = {
    init: function() {
        // Containers & pages
        this.dashboardContainer = document.querySelector('.dashboard-container');
        this.authPages = document.querySelector('.auth-pages');
        this.pages = document.querySelectorAll('.page-container');

        // Authentication
        this.signedInElements = document.querySelectorAll('.signed-in');
        this.signedOutElements = document.querySelectorAll('.signed-out');
        this.loginPage = document.getElementById('loginPage');
        this.registerPage = document.getElementById('registerPage');
        this.loginForm = document.getElementById('loginForm');
        this.registerForm = document.getElementById('registerForm');
        this.loginEmail = document.getElementById('loginEmail');
        this.loginPassword = document.getElementById('loginPassword');
        this.registerName = document.getElementById('registerName');
        this.registerEmail = document.getElementById('registerEmail');
        this.registerPassword = document.getElementById('registerPassword');
        this.registerConfirmPassword = document.getElementById('registerConfirmPassword');
        this.switchToRegister = document.getElementById('switchToRegister');
        this.switchToLogin = document.getElementById('switchToLogin');
        this.showLoginBtn = document.getElementById('showLoginBtn');
        this.showRegisterBtn = document.getElementById('showRegisterBtn');
        this.logoutBtn = document.getElementById('logoutBtn');
        this.settingsBtn = document.getElementById('settingsBtn');

        // Mobile navigation
        this.mobileMenuToggle = document.getElementById('mobileMenuToggle');
        this.mainNav = document.getElementById('mainNav');

        // Dashboard
        this.greetingText = document.getElementById('greetingText');
        this.currentDate = document.getElementById('currentDate');
        this.periodText = document.getElementById('periodText');
        this.waterUsage = document.getElementById('waterUsage');
        this.energyUsage = document.getElementById('energyUsage');
        this.savingsAmount = document.getElementById('savingsAmount');
        this.waterProgressCircle = document.getElementById('waterProgressCircle');
        this.energyProgressCircle = document.getElementById('energyProgressCircle');
        this.savingsProgressCircle = document.getElementById('savingsProgressCircle');
        this.waterTarget = document.getElementById('waterTarget');
        this.energyTarget = document.getElementById('energyTarget');
        this.waterEmptyState = document.getElementById('waterEmptyState');
        this.energyEmptyState = document.getElementById('energyEmptyState');
        this.savingsEmptyState = document.getElementById('savingsEmptyState');

        // Global period selector
        this.globalPeriodSelect = document.getElementById('globalPeriodSelect');

        // Dashboard tips
        this.dashboardTips = document.getElementById('dashboardTips');

        // Forms & buttons
        this.logWaterBtn = document.getElementById('logWaterBtn');
        this.logEnergyBtn = document.getElementById('logEnergyBtn');
        this.addWaterBtn = document.getElementById('addWaterBtn');
        this.addEnergyBtn = document.getElementById('addEnergyBtn');
        this.viewSavingsBtn = document.getElementById('viewSavingsBtn');
        this.waterForm = document.getElementById('waterForm');
        this.energyForm = document.getElementById('energyForm');
        this.settingsForm = document.getElementById('settingsForm');
        this.waterAmount = document.getElementById('waterAmount');
        this.waterDate = document.getElementById('waterDate');
        this.waterNotes = document.getElementById('waterNotes');
        this.energyAmount = document.getElementById('energyAmount');
        this.energyDate = document.getElementById('energyDate');
        this.energyNotes = document.getElementById('energyNotes');
        this.waterGoal = document.getElementById('waterGoal');
        this.energyGoal = document.getElementById('energyGoal');
        this.currencySelect = document.getElementById('currencySelect');

        // Navigation
        this.navLinks = document.querySelectorAll('.nav-link');
        
        // Submit buttons for loading states
        this.loginSubmitBtn = document.getElementById('loginSubmitBtn');
        this.registerSubmitBtn = document.getElementById('registerSubmitBtn');
        this.waterSubmitBtn = document.getElementById('waterSubmitBtn');
        this.energySubmitBtn = document.getElementById('energySubmitBtn');
    }
};

/**
 * Enhanced form validation with visual feedback
 */
const enhancedValidation = {
    showError: function(elementId, message) {
        const element = document.getElementById(elementId);
        const errorElement = document.getElementById(elementId + 'Error');
        
        if (element) {
            element.classList.add('error');
        }
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    },
    
    clearError: function(elementId) {
        const element = document.getElementById(elementId);
        const errorElement = document.getElementById(elementId + 'Error');
        
        if (element) {
            element.classList.remove('error');
        }
        
        if (errorElement) {
            errorElement.classList.remove('show');
        }
    },
    
    clearAllErrors: function(formId) {
        const form = document.getElementById(formId);
        if (form) {
            const errorMessages = form.querySelectorAll('.error-message');
            const errorInputs = form.querySelectorAll('.error');
            
            errorMessages.forEach(msg => msg.classList.remove('show'));
            errorInputs.forEach(input => input.classList.remove('error'));
        }
    }
};

/**
 * Enhanced button loading states
 */
const buttonLoading = {
    show: function(buttonId) {
        const button = document.getElementById(buttonId);
        if (button) {
            const text = button.querySelector('.btn-text');
            const spinner = button.querySelector('.btn-spinner');
            
            if (text) text.style.display = 'none';
            if (spinner) spinner.style.display = 'inline-block';
            button.disabled = true;
        }
    },
    
    hide: function(buttonId) {
        const button = document.getElementById(buttonId);
        if (button) {
            const text = button.querySelector('.btn-text');
            const spinner = button.querySelector('.btn-spinner');
            
            if (text) text.style.display = 'inline';
            if (spinner) spinner.style.display = 'none';
            button.disabled = false;
        }
    }
};

/**
 * Load data from localStorage
 */
function loadLocalStorageData() {
    users = JSON.parse(localStorage.getItem('users')) || [];
    waterLogs = JSON.parse(localStorage.getItem('waterLogs')) || [];
    energyLogs = JSON.parse(localStorage.getItem('energyLogs')) || [];
    
    settings = JSON.parse(localStorage.getItem('settings')) || {
        trackingPeriod: 7,
        waterGoal: 150,
        energyGoal: 10,
        currency: 'R'
    };
    
    // Load global period
    globalPeriodManager.loadPeriod();
    settings.trackingPeriod = globalPeriodManager.getPeriod();
    
    checkAuthState();
}

/**
 * Check if user is already authenticated
 */
function checkAuthState() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        isAuthenticated = true;
        return true;
    }
    return false;
}

/**
 * Update UI based on authentication state
 */
function updateAuthUI() {
    if (isAuthenticated) {
        domElements.signedInElements.forEach(el => el.style.display = 'flex');
        domElements.signedOutElements.forEach(el => el.style.display = 'none');
        domElements.dashboardContainer.style.display = 'block';
        domElements.authPages.style.display = 'none';
        updateGreeting();
        loadUserData();
    } else {
        domElements.signedInElements.forEach(el => el.style.display = 'none');
        domElements.signedOutElements.forEach(el => el.style.display = 'flex');
        domElements.dashboardContainer.style.display = 'none';
        domElements.authPages.style.display = 'block';
    }
}

/**
 * Enhanced user registration with better validation
 */
function registerUser(name, email, password) {
    enhancedValidation.clearAllErrors('registerForm');
    
    let hasErrors = false;
    
    if (!formValidation.validateRequired(name)) {
        enhancedValidation.showError('registerName', 'Please enter your full name');
        hasErrors = true;
    }
    
    if (!formValidation.validateEmail(email)) {
        enhancedValidation.showError('registerEmail', 'Please enter a valid email address');
        hasErrors = true;
    }
    
    if (!formValidation.validatePassword(password)) {
        enhancedValidation.showError('registerPassword', 'Password must be at least 6 characters long');
        hasErrors = true;
    }
    
    if (users.find(user => user.email === email)) {
        enhancedValidation.showError('registerEmail', 'This email is already registered');
        hasErrors = true;
    }
    
    if (hasErrors) {
        return false;
    }

    const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password: authUtils.hashPassword(password),
        dateJoined: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    return newUser;
}

/**
 * Enhanced user login with better validation
 */
function loginUser(email, password) {
    enhancedValidation.clearAllErrors('loginForm');
    
    let hasErrors = false;
    
    if (!formValidation.validateEmail(email)) {
        enhancedValidation.showError('loginEmail', 'Please enter a valid email address');
        hasErrors = true;
    }
    
    if (!formValidation.validateRequired(password)) {
        enhancedValidation.showError('loginPassword', 'Please enter your password');
        hasErrors = true;
    }
    
    if (hasErrors) {
        return false;
    }
    
    const user = users.find(user => user.email === email);
    if (!user) {
        enhancedValidation.showError('loginEmail', 'No account found with this email');
        return false;
    }
    
    if (!authUtils.verifyPassword(password, user.password)) {
        enhancedValidation.showError('loginPassword', 'Incorrect password');
        return false;
    }
    
    const userForStorage = { ...user };
    delete userForStorage.password;
    
    currentUser = userForStorage;
    localStorage.setItem('currentUser', JSON.stringify(userForStorage));
    isAuthenticated = true;
    
    return true;
}

/**
 * Enhanced logout with proper cleanup
 */
function logoutUser() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    isAuthenticated = false;
    
    // Clear dashboard tips rotation
    clearDashboardTipsRotation();
    
    if (typeof dataCache !== 'undefined') {
        dataCache.clearCache();
    }
    updateAuthUI();
    
    domElements.pages.forEach(page => {
        page.style.display = 'none';
    });
    
    domElements.authPages.style.display = 'block';
    domElements.loginPage.style.display = 'block';
    domElements.registerPage.style.display = 'none';
    
    // Close mobile menu if open
    if (domElements.mainNav) {
        domElements.mainNav.classList.remove('active');
    }
    
    notificationSystem.showNotification('Logged out successfully');
}

/**
 * FIXED: Page navigation with proper CSS chart integration
 */
function showPage(pageId) {
    console.log(`🔄 Navigating to page: ${pageId}`);
    
    domElements.pages.forEach(page => {
        page.style.display = 'none';
    });

    if (!isAuthenticated) {
        domElements.authPages.style.display = 'block';
        return;
    }

    const activePage = document.getElementById(pageId);
    if (activePage) {
        activePage.style.display = 'block';
        
        // Initialize page-specific functionality with FIXED chart integration
        switch (pageId) {
            case 'historyPage':
                console.log('📊 Initializing history page with FIXED CSS charts...');
                if (typeof initHistoryPage === 'function') {
                    setTimeout(() => initHistoryPage(), 100);
                }
                break;
            case 'tipsPage':
                if (typeof initTipsPage === 'function') {
                    setTimeout(() => initTipsPage(), 100);
                }
                break;
            case 'achievementsPage':
                if (typeof initAchievementsPage === 'function') {
                    setTimeout(() => initAchievementsPage(), 100);
                }
                break;
            case 'dashboardPage':
                // Ensure dashboard is updated when navigating back
                setTimeout(() => {
                    updateDashboard();
                    initDashboardTips();
                }, 100);
                break;
        }
    }

    // Update navigation active states
    domElements.navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageId) {
            link.classList.add('active');
        }
    });
    
    // Close mobile menu after navigation
    if (domElements.mainNav) {
        domElements.mainNav.classList.remove('active');
    }
}

/**
 * Enhanced greeting with better formatting
 */
function updateGreeting() {
    if (!currentUser || !domElements.greetingText) return;
    
    const now = new Date();
    const hour = now.getHours();
    let greeting = "Good ";
    
    if (hour < 12) {
        greeting += "morning";
    } else if (hour < 18) {
        greeting += "afternoon";
    } else {
        greeting += "evening";
    }
    
    domElements.greetingText.textContent = `${greeting}, ${currentUser.name}!`;
    
    if (domElements.currentDate) {
        domElements.currentDate.textContent = formatUtils.formatDate(now, 'long');
    }
}

/**
 * Enhanced water log addition with validation and tip rotation
 */
function addWaterLog(amount, date, notes = '') {
    if (!currentUser) return null;
    
    if (!formValidation.validateNumber(amount, 0)) {
        enhancedValidation.showError('waterAmount', 'Please enter a valid water amount');
        return null;
    }
    
    enhancedValidation.clearError('waterAmount');
    
    const log = {
        id: Date.now().toString(),
        userId: currentUser.id,
        amount: parseFloat(amount),
        date: date,
        notes: notes,
        timestamp: new Date().toISOString()
    };

    waterLogs.push(log);
    localStorage.setItem('waterLogs', JSON.stringify(waterLogs));
    
    if (typeof dataCache !== 'undefined') {
        dataCache.waterLogs = null;
    }
    updateDashboard();
    
    // Rotate dashboard tips after log
    rotateDashboardTips();
    
    if (typeof checkAllAchievements === 'function') {
        checkAllAchievements();
    }
    
    document.dispatchEvent(new CustomEvent('logAdded', { detail: { type: 'water', log } }));
    notificationSystem.showNotification('Water usage logged successfully');
    
    return log;
}

/**
 * Enhanced energy log addition with validation and tip rotation
 */
function addEnergyLog(amount, date, notes = '') {
    if (!currentUser) return null;
    
    if (!formValidation.validateNumber(amount, 0)) {
        enhancedValidation.showError('energyAmount', 'Please enter a valid energy amount');
        return null;
    }
    
    enhancedValidation.clearError('energyAmount');
    
    const log = {
        id: Date.now().toString(),
        userId: currentUser.id,
        amount: parseFloat(amount),
        date: date,
        notes: notes,
        timestamp: new Date().toISOString()
    };

    energyLogs.push(log);
    localStorage.setItem('energyLogs', JSON.stringify(energyLogs));
    
    if (typeof dataCache !== 'undefined') {
        dataCache.energyLogs = null;
    }
    updateDashboard();
    
    // Rotate dashboard tips after log
    rotateDashboardTips();
    
    if (typeof checkAllAchievements === 'function') {
        checkAllAchievements();
    }
    
    document.dispatchEvent(new CustomEvent('logAdded', { detail: { type: 'energy', log } }));
    notificationSystem.showNotification('Energy usage logged successfully');
    
    return log;
}

/**
 * Get user logs with caching
 */
function getUserWaterLogs() {
    if (!currentUser) return [];
    
    if (typeof dataCache !== 'undefined' && dataCache.waterLogs) {
        return dataCache.waterLogs;
    }
    
    const userLogs = waterLogs.filter(log => log.userId === currentUser.id);
    if (typeof dataCache !== 'undefined') {
        dataCache.waterLogs = userLogs;
    }
    return userLogs;
}

function getUserEnergyLogs() {
    if (!currentUser) return [];
    
    if (typeof dataCache !== 'undefined' && dataCache.energyLogs) {
        return dataCache.energyLogs;
    }
    
    const userLogs = energyLogs.filter(log => log.userId === currentUser.id);
    if (typeof dataCache !== 'undefined') {
        dataCache.energyLogs = userLogs;
    }
    return userLogs;
}

/**
 * Get recent logs utility
 */
function getRecentLogs(logs, days) {
    const now = new Date();
    const cutoff = new Date(now);
    cutoff.setDate(now.getDate() - days);
    
    return logs.filter(log => new Date(log.date) >= cutoff);
}

/**
 * Calculate total usage
 */
function calculateTotalUsage(logs) {
    return logs.reduce((total, log) => total + log.amount, 0);
}

/**
 * Enhanced savings calculation
 */
function calculateSavings(waterUsage, energyUsage) {
    const waterCost = waterUsage * 0.02; // R0.02 per liter
    const energyCost = energyUsage * 2.50; // R2.50 per kWh
    
    // Calculate potential savings (assuming 15% efficiency improvement)
    const potentialWaterSavings = waterUsage * 0.15 * 0.02;
    const potentialEnergySavings = energyUsage * 0.15 * 2.50;
    
    return potentialWaterSavings + potentialEnergySavings;
}
/**
 * EcoTracker - Main Application (Part 2 - Dashboard Tips + Remaining Functions)
 * Continuing from Part 1, these are the dashboard tips system and remaining utility functions
 */

/**
 * ENHANCED DASHBOARD TIPS SYSTEM
 */
function initDashboardTips() {
    if (!currentUser || !domElements.dashboardTips) return;
    
    // Clear any existing rotation
    clearDashboardTipsRotation();
    
    // Get fresh tips selection
    updateDashboardTips();
    
    // Start automatic rotation every 30 seconds
    dashboardTipsState.rotationInterval = setInterval(() => {
        rotateDashboardTips();
    }, 30000);
}

function updateDashboardTips() {
    if (!currentUser || !domElements.dashboardTips) return;
    
    // Get tips based on user's tried tips
    const triedTips = typeof getUserTriedTips === 'function' ? getUserTriedTips() : [];
    const availableTips = typeof tipsList !== 'undefined' ? 
        tipsList.filter(tip => !triedTips.includes(tip.id)) : [];
    
    // If no untried tips, show all tips
    const tipsToShow = availableTips.length > 0 ? availableTips : 
        (typeof tipsList !== 'undefined' ? tipsList : []);
    
    if (tipsToShow.length === 0) {
        domElements.dashboardTips.innerHTML = `
            <div class="tip-card">
                <div class="tip-icon"><i class="fas fa-lightbulb tip-icon"></i></div>
                <div class="tip-title">Keep Going!</div>
                <div class="tip-text">You're doing great with your sustainability journey!</div>
            </div>
        `;
        return;
    }
    
    // Smart selection of 3 tips
    dashboardTipsState.displayedTips = smartTipSelection(tipsToShow, 3);
    dashboardTipsState.currentTipIndex = 0;
    
    renderDashboardTips();
}

function smartTipSelection(tips, count) {
    if (tips.length <= count) return tips;
    
    // Prioritize different categories and easy difficulty
    const categories = ['water', 'energy', 'general'];
    const selectedTips = [];
    
    // Try to get one tip from each category (easy ones first)
    categories.forEach(category => {
        if (selectedTips.length < count) {
            const categoryTips = tips.filter(tip => 
                tip.category === category && 
                tip.difficulty === 'easy' &&
                !selectedTips.includes(tip)
            );
            
            if (categoryTips.length > 0) {
                const randomTip = categoryTips[Math.floor(Math.random() * categoryTips.length)];
                selectedTips.push(randomTip);
            }
        }
    });
    
    // Fill remaining slots
    while (selectedTips.length < count && selectedTips.length < tips.length) {
        const remainingTips = tips.filter(tip => !selectedTips.includes(tip));
        if (remainingTips.length === 0) break;
        
        const randomTip = remainingTips[Math.floor(Math.random() * remainingTips.length)];
        selectedTips.push(randomTip);
    }
    
    return selectedTips;
}

function renderDashboardTips() {
    if (!domElements.dashboardTips || dashboardTipsState.displayedTips.length === 0) return;
    
    domElements.dashboardTips.innerHTML = '';
    
    dashboardTipsState.displayedTips.forEach((tip, index) => {
        const tipCard = createDashboardTipCard(tip, index);
        domElements.dashboardTips.appendChild(tipCard);
    });
    
    // Add cycling indicators if more than one tip
    if (dashboardTipsState.displayedTips.length > 1) {
        addTipCyclingIndicators();
    }
}

function createDashboardTipCard(tip, index) {
    const iconColor = 
        tip.category === 'water' ? '#3498db' : 
        tip.category === 'energy' ? '#f39c12' : 
        '#27ae60';
    
    const triedTips = typeof getUserTriedTips === 'function' ? getUserTriedTips() : [];
    const hasTried = triedTips.includes(tip.id);
    
    const tipCard = document.createElement('div');
    tipCard.className = `tip-card dashboard-tip ${hasTried ? 'tried' : ''}`;
    tipCard.dataset.tipIndex = index;
    
    tipCard.innerHTML = `
        ${hasTried ? '<div class="tip-tried-badge"><i class="fas fa-check"></i></div>' : ''}
        <div class="tip-icon" style="color: ${iconColor};">
            <i class="fas ${tip.icon}"></i>
        </div>
        <div class="tip-title">${tip.title}</div>
        <div class="tip-text">${tip.shortDescription}</div>
        <div class="tip-actions">
            <button class="btn btn-secondary btn-sm" onclick="showTipDetail('${tip.id}')">
                <i class="fas fa-eye"></i> Learn More
            </button>
            ${!hasTried ? `
                <button class="btn btn-primary btn-sm" onclick="markTipAsTried('${tip.id}')">
                    <i class="fas fa-thumbs-up"></i> Try This
                </button>
            ` : `
                <button class="btn btn-success btn-sm" disabled>
                    <i class="fas fa-check"></i> Tried
                </button>
            `}
        </div>
    `;
    
    // Add click handler for full tip detail
    tipCard.addEventListener('click', (e) => {
        if (!e.target.closest('.tip-actions')) {
            if (typeof showTipDetail === 'function') {
                showTipDetail(tip);
            }
        }
    });
    
    return tipCard;
}

function addTipCyclingIndicators() {
    const indicatorsContainer = document.createElement('div');
    indicatorsContainer.className = 'tip-cycling-indicators';
    indicatorsContainer.innerHTML = `
        <div class="cycling-dots">
            ${dashboardTipsState.displayedTips.map((_, index) => 
                `<div class="cycling-dot ${index === dashboardTipsState.currentTipIndex ? 'active' : ''}" 
                      data-index="${index}"></div>`
            ).join('')}
        </div>
        <div class="cycling-controls">
            <button class="cycling-btn" onclick="cycleTipsPrevious()">
                <i class="fas fa-chevron-left"></i>
            </button>
            <button class="cycling-btn" onclick="cycleTipsNext()">
                <i class="fas fa-chevron-right"></i>
            </button>
        </div>
    `;
    
    domElements.dashboardTips.appendChild(indicatorsContainer);
    
    // Add click handlers for dots
    indicatorsContainer.querySelectorAll('.cycling-dot').forEach(dot => {
        dot.addEventListener('click', () => {
            const targetIndex = parseInt(dot.dataset.index);
            showTipAtIndex(targetIndex);
        });
    });
}

function rotateDashboardTips() {
    if (dashboardTipsState.displayedTips.length <= 1) return;
    
    dashboardTipsState.currentTipIndex = 
        (dashboardTipsState.currentTipIndex + 1) % dashboardTipsState.displayedTips.length;
    
    showTipAtIndex(dashboardTipsState.currentTipIndex);
}

function cycleTipsNext() {
    rotateDashboardTips();
}

function cycleTipsPrevious() {
    if (dashboardTipsState.displayedTips.length <= 1) return;
    
    dashboardTipsState.currentTipIndex = 
        dashboardTipsState.currentTipIndex === 0 ? 
        dashboardTipsState.displayedTips.length - 1 : 
        dashboardTipsState.currentTipIndex - 1;
    
    showTipAtIndex(dashboardTipsState.currentTipIndex);
}

function showTipAtIndex(index) {
    const tipCards = domElements.dashboardTips.querySelectorAll('.dashboard-tip');
    const dots = domElements.dashboardTips.querySelectorAll('.cycling-dot');
    
    // Hide all tips
    tipCards.forEach(card => {
        card.style.display = 'none';
    });
    
    // Show selected tip
    if (tipCards[index]) {
        tipCards[index].style.display = 'flex';
    }
    
    // Update dots
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
    
    dashboardTipsState.currentTipIndex = index;
}

function clearDashboardTipsRotation() {
    if (dashboardTipsState.rotationInterval) {
        clearInterval(dashboardTipsState.rotationInterval);
        dashboardTipsState.rotationInterval = null;
    }
}

// Global functions for tip interaction
window.showTipDetail = function(tipOrId) {
    if (typeof tipOrId === 'string') {
        // Find tip by ID
        if (typeof tipsList !== 'undefined') {
            const tip = tipsList.find(t => t.id === tipOrId);
            if (tip && typeof showTipDetail === 'function') {
                showTipDetail(tip);
            }
        }
    } else if (typeof showTipDetail === 'function') {
        showTipDetail(tipOrId);
    }
};

window.markTipAsTried = function(tipId) {
    if (typeof markTipAsTried === 'function') {
        markTipAsTried(tipId);
        // Refresh dashboard tips after marking
        setTimeout(() => updateDashboardTips(), 500);
    }
};

window.cycleTipsNext = cycleTipsNext;
window.cycleTipsPrevious = cycleTipsPrevious;

/**
 * Enhanced dashboard update with proper circle initialization
 */
function updateDashboard() {
    if (!isAuthenticated) return;
    
    const userWaterLogs = getUserWaterLogs();
    const userEnergyLogs = getUserEnergyLogs();
    const currentPeriod = globalPeriodManager.getPeriod();
    const recentWaterLogs = getRecentLogs(userWaterLogs, currentPeriod);
    const recentEnergyLogs = getRecentLogs(userEnergyLogs, currentPeriod);
    
    const totalWaterUsage = calculateTotalUsage(recentWaterLogs);
    const totalEnergyUsage = calculateTotalUsage(recentEnergyLogs);
    const savings = calculateSavings(totalWaterUsage, totalEnergyUsage);
    
    // Water card updates
    if (recentWaterLogs.length > 0) {
        if (domElements.waterEmptyState) domElements.waterEmptyState.style.display = 'none';
        const waterCircleContainer = domElements.waterEmptyState?.parentElement.querySelector('.circle-progress');
        if (waterCircleContainer) waterCircleContainer.style.display = 'block';
        
        if (domElements.waterUsage) {
            animateValue(domElements.waterUsage, 0, Math.round(totalWaterUsage), 1000);
        }
        
        if (domElements.waterProgressCircle) {
            updateProgressCircleWithColor(
                domElements.waterProgressCircle, 
                totalWaterUsage, 
                settings.waterGoal * currentPeriod
            );
        }
    } else {
        if (domElements.waterEmptyState) domElements.waterEmptyState.style.display = 'block';
        const waterCircleContainer = domElements.waterEmptyState?.parentElement.querySelector('.circle-progress');
        if (waterCircleContainer) waterCircleContainer.style.display = 'none';
    }
    
    // Energy card updates
    if (recentEnergyLogs.length > 0) {
        if (domElements.energyEmptyState) domElements.energyEmptyState.style.display = 'none';
        const energyCircleContainer = domElements.energyEmptyState?.parentElement.querySelector('.circle-progress');
        if (energyCircleContainer) energyCircleContainer.style.display = 'block';
        
        if (domElements.energyUsage) {
            animateValue(domElements.energyUsage, 0, totalEnergyUsage, 1000, 1);
        }
        
        if (domElements.energyProgressCircle) {
            updateProgressCircleWithColor(
                domElements.energyProgressCircle, 
                totalEnergyUsage, 
                settings.energyGoal * currentPeriod
            );
        }
    } else {
        if (domElements.energyEmptyState) domElements.energyEmptyState.style.display = 'block';
        const energyCircleContainer = domElements.energyEmptyState?.parentElement.querySelector('.circle-progress');
        if (energyCircleContainer) energyCircleContainer.style.display = 'none';
    }
    
    // Savings card updates
    if (recentWaterLogs.length > 0 || recentEnergyLogs.length > 0) {
        if (domElements.savingsEmptyState) domElements.savingsEmptyState.style.display = 'none';
        const savingsCircleContainer = domElements.savingsEmptyState?.parentElement.querySelector('.circle-progress');
        if (savingsCircleContainer) savingsCircleContainer.style.display = 'block';
        
        if (domElements.savingsAmount) {
            const currentValue = parseFloat(domElements.savingsAmount.textContent.replace(/[R,]/g, '')) || 0;
            animateValue(domElements.savingsAmount, currentValue, savings, 1000, 2, settings.currency);
        }
        
        if (domElements.savingsProgressCircle) {
            const maxSavings = 100; // Arbitrary max for progress display
            updateProgressCircleWithColor(domElements.savingsProgressCircle, Math.min(savings * 2, maxSavings), maxSavings);
        }
    } else {
        if (domElements.savingsEmptyState) domElements.savingsEmptyState.style.display = 'block';
        const savingsCircleContainer = domElements.savingsEmptyState?.parentElement.querySelector('.circle-progress');
        if (savingsCircleContainer) savingsCircleContainer.style.display = 'none';
    }
    
    // Update targets and period text
    if (domElements.waterTarget) {
        domElements.waterTarget.textContent = `Target: ${settings.waterGoal}L/day`;
    }
    if (domElements.energyTarget) {
        domElements.energyTarget.textContent = `Target: ${settings.energyGoal}kWh/day`;
    }
    
    // Update period display
    globalPeriodManager.updatePeriodDisplays();
    
    // Update dashboard tips if they exist
    if (domElements.dashboardTips && isAuthenticated) {
        updateDashboardTips();
    }
}

/**
 * Animate numeric values for better UX
 */
function animateValue(element, start, end, duration, decimals = 0, prefix = '') {
    if (!element) return;
    
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        
        const displayValue = prefix ? 
            `${prefix}${current.toFixed(decimals)}` : 
            current.toFixed(decimals);
        element.textContent = displayValue;
    }, 16);
}

/**
 * Enhanced progress circle with proper initialization
 */
function updateProgressCircleWithColor(circle, value, max) {
    if (!circle) return;
    
    const radius = parseFloat(circle.getAttribute('r'));
    const circumference = 2 * Math.PI * radius;
    
    let percentage = Math.min((value / max) * 100, 100);
    const offset = circumference - (percentage / 100) * circumference;
    
    // Initialize the circle properly
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = offset;
    
    // Clear existing classes
    circle.classList.remove('progress-low', 'progress-medium', 'progress-high', 'water-progress', 'energy-progress');
    
    const circleId = circle.getAttribute('id');
    
    if (circleId === 'waterProgressCircle') {
        circle.classList.add('water-progress');
    } else if (circleId === 'energyProgressCircle') {
        circle.classList.add('energy-progress');
    } else if (circleId === 'savingsProgressCircle') {
        if (percentage < 33) {
            circle.classList.add('progress-low');
        } else if (percentage < 66) {
            circle.classList.add('progress-medium');
        } else {
            circle.classList.add('progress-high');
        }
    }
    
    circle.style.transition = 'stroke-dashoffset 0.8s ease-in-out, stroke 0.3s ease-in-out';
}

/**
 * Initialize progress circles properly
 */
function initializeProgressCircles() {
    const circles = [domElements.waterProgressCircle, domElements.energyProgressCircle, domElements.savingsProgressCircle];
    circles.forEach(circle => {
        if (circle) {
            const radius = parseFloat(circle.getAttribute('r'));
            const circumference = 2 * Math.PI * radius;
            circle.style.strokeDasharray = `${circumference} ${circumference}`;
            circle.style.strokeDashoffset = circumference; // Start fully empty
        }
    });
}

/**
 * Show savings detail modal
 */
function showSavingsDetail() {
    const userWaterLogs = getUserWaterLogs();
    const userEnergyLogs = getUserEnergyLogs();
    const currentPeriod = globalPeriodManager.getPeriod();
    const recentWaterLogs = getRecentLogs(userWaterLogs, currentPeriod);
    const recentEnergyLogs = getRecentLogs(userEnergyLogs, currentPeriod);
    
    const totalWaterUsage = calculateTotalUsage(recentWaterLogs);
    const totalEnergyUsage = calculateTotalUsage(recentEnergyLogs);
    
    const waterCost = totalWaterUsage * 0.02;
    const energyCost = totalEnergyUsage * 2.50;
    const totalCost = waterCost + energyCost;
    
    const potentialWaterSavings = totalWaterUsage * 0.15 * 0.02;
    const potentialEnergySavings = totalEnergyUsage * 0.15 * 2.50;
    const totalSavings = potentialWaterSavings + potentialEnergySavings;
    
    const breakdownHTML = `
        <div style="margin-bottom: 20px;">
            <h4 style="color: var(--primary-color); margin-bottom: 15px;">Current Usage Costs (${currentPeriod} days)</h4>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>Water (${totalWaterUsage.toFixed(1)}L):</span>
                <strong>${settings.currency}${waterCost.toFixed(2)}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>Energy (${totalEnergyUsage.toFixed(1)}kWh):</span>
                <strong>${settings.currency}${energyCost.toFixed(2)}</strong>
            </div>
            <hr style="margin: 10px 0; border: 1px solid var(--light-color);">
            <div style="display: flex; justify-content: space-between; font-size: 1.1em;">
                <span><strong>Total Cost:</strong></span>
                <strong style="color: var(--danger-color);">${settings.currency}${totalCost.toFixed(2)}</strong>
            </div>
        </div>
        
        <div style="margin-bottom: 20px;">
            <h4 style="color: var(--success-color); margin-bottom: 15px;">Potential Monthly Savings</h4>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>Water efficiency (15%):</span>
                <strong>${settings.currency}${(potentialWaterSavings * 4).toFixed(2)}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>Energy efficiency (15%):</span>
                <strong>${settings.currency}${(potentialEnergySavings * 4).toFixed(2)}</strong>
            </div>
            <hr style="margin: 10px 0; border: 1px solid var(--light-color);">
            <div style="display: flex; justify-content: space-between; font-size: 1.2em;">
                <span><strong>Total Potential Savings:</strong></span>
                <strong style="color: var(--success-color);">${settings.currency}${(totalSavings * 4).toFixed(2)}/month</strong>
            </div>
        </div>
        
        <div style="background: var(--background-secondary); padding: 15px; border-radius: 8px;">
            <p style="margin: 0; font-size: 0.9em; color: var(--text-light);">
                <i class="fas fa-info-circle" style="margin-right: 5px;"></i>
                Savings calculated based on 15% efficiency improvements through sustainable practices.
                Rates: Water R0.02/L, Energy R2.50/kWh (South African averages).
            </p>
        </div>
    `;
    
    const savingsBreakdown = document.getElementById('savingsBreakdown');
    if (savingsBreakdown) {
        savingsBreakdown.innerHTML = breakdownHTML;
    }
    
    modalSystem.openModal('savingsDetailModal');
}

/**
 * Load user-specific settings and data
 */
function loadUserData() {
    if (!currentUser) return;
    
    const userSettings = JSON.parse(localStorage.getItem(`settings_${currentUser.id}`));
    if (userSettings) {
        settings = userSettings;
        // Sync with global period
        globalPeriodManager.setPeriod(settings.trackingPeriod);
    }
    
    if (!settings.currency) {
        settings.currency = 'R';
    }
    
    // Update settings form
    if (domElements.waterGoal) domElements.waterGoal.value = settings.waterGoal;
    if (domElements.energyGoal) domElements.energyGoal.value = settings.energyGoal;
    if (domElements.currencySelect) domElements.currencySelect.value = settings.currency;
    
    // Update global period selector
    if (domElements.globalPeriodSelect) {
        domElements.globalPeriodSelect.value = globalPeriodManager.getPeriod().toString();
    }
    
    updateDashboard();
    
    // Initialize dashboard tips
    initDashboardTips();
}

/**
 * Enhanced settings save with validation
 */
function saveSettings() {
    if (!formValidation.validateNumber(domElements.waterGoal.value, 0)) {
        notificationSystem.showNotification('Please enter a valid water goal', 'error');
        return false;
    }
    
    if (!formValidation.validateNumber(domElements.energyGoal.value, 0)) {
        notificationSystem.showNotification('Please enter a valid energy goal', 'error');
        return false;
    }
    
    settings.waterGoal = parseFloat(domElements.waterGoal.value);
    settings.energyGoal = parseFloat(domElements.energyGoal.value);
    settings.currency = domElements.currencySelect.value;
    settings.trackingPeriod = globalPeriodManager.getPeriod();
    
    localStorage.setItem('settings', JSON.stringify(settings));
    if (currentUser) {
        localStorage.setItem(`settings_${currentUser.id}`, JSON.stringify(settings));
    }
    
    updateDashboard();
    notificationSystem.showNotification('Settings saved successfully');
    return true;
}

/**
 * EcoTracker - Main Application (Part 3 - Event Listeners + Initialization)
 * Final part with event listeners setup and application initialization
 */

/**
 * Enhanced event listeners setup
 */
function setupEventListeners() {
    // Mobile menu toggle
    if (domElements.mobileMenuToggle && domElements.mainNav) {
        domElements.mobileMenuToggle.addEventListener('click', () => {
            domElements.mainNav.classList.toggle('active');
        });
    }
    
    // Global period selector
    if (domElements.globalPeriodSelect) {
        domElements.globalPeriodSelect.addEventListener('change', (e) => {
            globalPeriodManager.setPeriod(e.target.value);
        });
    }
    
    // Navigation links
    domElements.navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = link.getAttribute('data-page');
            showPage(pageId);
        });
    });
    
    // Auth form switching
    if (domElements.showLoginBtn) {
        domElements.showLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            domElements.loginPage.style.display = 'block';
            domElements.registerPage.style.display = 'none';
        });
    }
    
    if (domElements.showRegisterBtn) {
        domElements.showRegisterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            domElements.loginPage.style.display = 'none';
            domElements.registerPage.style.display = 'block';
        });
    }
    
    if (domElements.switchToRegister) {
        domElements.switchToRegister.addEventListener('click', (e) => {
            e.preventDefault();
            domElements.loginPage.style.display = 'none';
            domElements.registerPage.style.display = 'block';
        });
    }
    
    if (domElements.switchToLogin) {
        domElements.switchToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            domElements.registerPage.style.display = 'none';
            domElements.loginPage.style.display = 'block';
        });
    }
    
    // Fixed logout button
    if (domElements.logoutBtn) {
        domElements.logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            logoutUser();
        });
    }
    
    // Fixed settings button
    if (domElements.settingsBtn) {
        domElements.settingsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            modalSystem.openModal('settingsModal');
        });
    }
    
    // Dashboard buttons
    if (domElements.logWaterBtn) {
        domElements.logWaterBtn.addEventListener('click', () => {
            modalSystem.openModal('waterModal');
        });
    }
    
    if (domElements.logEnergyBtn) {
        domElements.logEnergyBtn.addEventListener('click', () => {
            modalSystem.openModal('energyModal');
        });
    }
    
    if (domElements.addWaterBtn) {
        domElements.addWaterBtn.addEventListener('click', () => {
            modalSystem.openModal('waterModal');
        });
    }
    
    if (domElements.addEnergyBtn) {
        domElements.addEnergyBtn.addEventListener('click', () => {
            modalSystem.openModal('energyModal');
        });
    }
    
    // Fixed savings detail button
    if (domElements.viewSavingsBtn) {
        domElements.viewSavingsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showSavingsDetail();
        });
    }
    
    // Enhanced form submissions
    if (domElements.loginForm) {
        domElements.loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            buttonLoading.show('loginSubmitBtn');
            
            // Simulate network delay for better UX
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const email = domElements.loginEmail.value;
            const password = domElements.loginPassword.value;
            
            if (loginUser(email, password)) {
                notificationSystem.showNotification('Welcome back!');
                updateAuthUI();
                showPage('dashboardPage');
            }
            
            buttonLoading.hide('loginSubmitBtn');
        });
    }
    
    if (domElements.registerForm) {
        domElements.registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            buttonLoading.show('registerSubmitBtn');
            
            const name = domElements.registerName.value;
            const email = domElements.registerEmail.value;
            const password = domElements.registerPassword.value;
            const confirmPassword = domElements.registerConfirmPassword.value;
            
            if (password !== confirmPassword) {
                enhancedValidation.showError('registerConfirmPassword', 'Passwords do not match');
                buttonLoading.hide('registerSubmitBtn');
                return;
            }
            
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 800));
            
            const user = registerUser(name, email, password);
            if (user) {
                notificationSystem.showNotification('Account created successfully!');
                if (loginUser(email, password)) {
                    updateAuthUI();
                    showPage('dashboardPage');
                }
            }
            
            buttonLoading.hide('registerSubmitBtn');
        });
    }
    
    if (domElements.waterForm) {
        domElements.waterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            buttonLoading.show('waterSubmitBtn');
            
            const amount = domElements.waterAmount.value;
            const date = domElements.waterDate.value;
            const notes = domElements.waterNotes.value;
            
            await new Promise(resolve => setTimeout(resolve, 300));
            
            if (addWaterLog(amount, date, notes)) {
                modalSystem.closeModal('waterModal');
                domElements.waterForm.reset();
                domElements.waterDate.value = new Date().toISOString().split('T')[0];
            }
            
            buttonLoading.hide('waterSubmitBtn');
        });
    }
    
    if (domElements.energyForm) {
        domElements.energyForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            buttonLoading.show('energySubmitBtn');
            
            const amount = domElements.energyAmount.value;
            const date = domElements.energyDate.value;
            const notes = domElements.energyNotes.value;
            
            await new Promise(resolve => setTimeout(resolve, 300));
            
            if (addEnergyLog(amount, date, notes)) {
                modalSystem.closeModal('energyModal');
                domElements.energyForm.reset();
                domElements.energyDate.value = new Date().toISOString().split('T')[0];
            }
            
            buttonLoading.hide('energySubmitBtn');
        });
    }
    
    if (domElements.settingsForm) {
        domElements.settingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (saveSettings()) {
                modalSystem.closeModal('settingsModal');
            }
        });
    }
    
    // Clear form errors on input
    ['loginEmail', 'loginPassword', 'registerName', 'registerEmail', 'registerPassword', 'registerConfirmPassword', 'waterAmount', 'energyAmount'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', () => {
                enhancedValidation.clearError(id);
            });
        }
    });
    
    // Listen for period changes from other components
    document.addEventListener('periodChanged', (e) => {
        settings.trackingPeriod = e.detail.period;
        if (currentUser) {
            localStorage.setItem(`settings_${currentUser.id}`, JSON.stringify(settings));
        }
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (domElements.mainNav && domElements.mainNav.classList.contains('active')) {
            if (!domElements.mainNav.contains(e.target) && !domElements.mobileMenuToggle.contains(e.target)) {
                domElements.mainNav.classList.remove('active');
            }
        }
    });
}

/**
 * Initialize the application (COMPLETE FIXED VERSION)
 */
function initApp() {
    try {
        console.log('🚀 Initializing EcoTracker application with FIXED CSS charts...');
        
        // Initialize DOM elements cache
        domElements.init();
        
        // Initialize modals
        modalSystem.initializeModals();
        
        // Load data from localStorage
        loadLocalStorageData();
        
        // Setup event listeners
        setupEventListeners();
        
        // Check authentication state
        if (checkAuthState()) {
            updateAuthUI();
            showPage('dashboardPage');
        } else {
            updateAuthUI();
        }

        // Set today's date for form inputs
        const today = new Date().toISOString().split('T')[0];
        if (domElements.waterDate) domElements.waterDate.value = today;
        if (domElements.energyDate) domElements.energyDate.value = today;

        // Initialize circle progress properly
        initializeProgressCircles();

        // Show the default page
        showPage('dashboardPage');
        
        // Hide loading overlay
        if (typeof loadingSystem !== 'undefined') {
            loadingSystem.showGlobalLoader(false);
        }
        
        console.log('✅ EcoTracker initialized successfully with FIXED CSS charts');
        
    } catch (error) {
        console.error('❌ Error initializing app:', error);
        notificationSystem.showNotification('Error starting application. Please refresh the page.', 'error');
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM Content Loaded');
    initApp();
});

// Handle any uncaught errors
window.addEventListener('error', (event) => {
    console.error('❌ Uncaught error:', event.error);
    notificationSystem.showNotification('An unexpected error occurred.', 'error');
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('❌ Unhandled promise rejection:', event.reason);
    notificationSystem.showNotification('An unexpected error occurred.', 'error');
    event.preventDefault();
});

// Export essential functions to global scope for compatibility
if (typeof window !== 'undefined') {
    // Global period management
    window.globalPeriodManager = globalPeriodManager;
    
    // Authentication functions
    window.loginUser = loginUser;
    window.registerUser = registerUser;
    window.logoutUser = logoutUser;
    window.isAuthenticated = () => isAuthenticated;
    window.getCurrentUser = () => currentUser;
    
    // Data management functions
    window.addWaterLog = addWaterLog;
    window.addEnergyLog = addEnergyLog;
    window.getUserWaterLogs = getUserWaterLogs;
    window.getUserEnergyLogs = getUserEnergyLogs;
    
    // UI functions
    window.updateDashboard = updateDashboard;
    window.showPage = showPage;
    window.updateGreeting = updateGreeting;
    
    // Settings functions
    window.saveSettings = saveSettings;
    window.loadUserData = loadUserData;
    
    // Dashboard tips functions
    window.initDashboardTips = initDashboardTips;
    window.updateDashboardTips = updateDashboardTips;
    window.rotateDashboardTips = rotateDashboardTips;
    
    // Utility functions
    window.animateValue = animateValue;
    window.updateProgressCircleWithColor = updateProgressCircleWithColor;
    window.calculateSavings = calculateSavings;
    window.showSavingsDetail = showSavingsDetail;
    
    // State access
    window.getSettings = () => settings;
    window.getWaterLogs = () => waterLogs;
    window.getEnergyLogs = () => energyLogs;
    
    // FIXED: Chart integration functions
    window.renderDashboardCharts = function() {
        // This function can be called to re-render dashboard elements
        updateDashboard();
    };
    
    console.log('✅ Global functions exported successfully');
}