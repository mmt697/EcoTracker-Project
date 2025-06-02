/**
 * EcoTracker - Enhanced Achievements System (COMPLETE FIXED VERSION)
 * Complete file with easy-to-get achievements and FIXED duplicate prevention
 * NO MORE INFINITE RECURSION - Stack overflow issues resolved
 */

// Global achievement state tracker for duplicate prevention - FIXED
let achievementProcessing = {
    isChecking: false,
    recentlyUnlocked: new Set(),
    lastCheckTime: 0,
    cooldownPeriod: 1000 // 1 second cooldown between checks
};

// Global flag to prevent multiple simultaneous checks - NEW
let isCheckingAchievements = false;

// Enhanced achievements data with easier unlocks and better descriptions
const achievements = [
    // Quick Start Achievements (Can be unlocked immediately)
    {
        id: "first-login",
        title: "Welcome Aboard!",
        description: "Successfully logged into EcoTracker for the first time. Your sustainability journey begins now!",
        hint: "Just log in to unlock this achievement!",
        category: "special",
        icon: "fa-user-plus",
        points: 10,
        unlockDate: null,
        isUnlocked: false,
        priority: 1,
        checkUnlock: function() {
            return isAuthenticated && currentUser;
        }
    },
    {
        id: "first-water-log",
        title: "Water Tracker",
        description: "Logged your first water usage entry. Every drop counts towards conservation!",
        hint: "Add your first water usage log to get started.",
        category: "water",
        icon: "fa-tint",
        points: 15,
        unlockDate: null,
        isUnlocked: false,
        priority: 2,
        checkUnlock: function() {
            const waterLogs = getUserWaterLogs();
            return waterLogs.length >= 1;
        }
    },
    {
        id: "first-energy-log",
        title: "Energy Monitor",
        description: "Logged your first energy usage entry. Knowledge is the first step to efficiency!",
        hint: "Add your first energy usage log to start monitoring.",
        category: "energy",
        icon: "fa-bolt",
        points: 15,
        unlockDate: null,
        isUnlocked: false,
        priority: 2,
        checkUnlock: function() {
            const energyLogs = getUserEnergyLogs();
            return energyLogs.length >= 1;
        }
    },
    {
        id: "first-tip-tried",
        title: "Tip Explorer",
        description: "Tried your first eco-friendly tip. Small actions lead to big changes!",
        hint: "Visit the tips page and mark a tip as tried.",
        category: "tips",
        icon: "fa-lightbulb",
        points: 20,
        unlockDate: null,
        isUnlocked: false,
        priority: 3,
        checkUnlock: function() {
            const triedTips = getUserTriedTips();
            return triedTips.length >= 1;
        }
    },
    
    // Daily Achievements (Can be unlocked within 1-2 days)
    {
        id: "daily-tracker",
        title: "Daily Tracker",
        description: "Logged both water and energy usage on the same day. Comprehensive tracking leads to better insights!",
        hint: "Track both water and energy in a single day.",
        category: "streak",
        icon: "fa-calendar-day",
        points: 25,
        unlockDate: null,
        isUnlocked: false,
        priority: 4,
        checkUnlock: function() {
            const waterLogs = getUserWaterLogs();
            const energyLogs = getUserEnergyLogs();
            
            if (waterLogs.length === 0 || energyLogs.length === 0) return false;
            
            const waterDates = new Set(waterLogs.map(log => log.date.split('T')[0]));
            const energyDates = new Set(energyLogs.map(log => log.date.split('T')[0]));
            
            // Check if any date has both water and energy logs
            return [...waterDates].some(date => energyDates.has(date));
        }
    },
    {
        id: "three-water-logs",
        title: "Hydration Hero",
        description: "Logged water usage 3 times. You're building a strong foundation for water conservation!",
        hint: "Keep tracking your water usage - 3 entries total.",
        category: "water",
        icon: "fa-tint",
        points: 30,
        unlockDate: null,
        isUnlocked: false,
        priority: 5,
        checkUnlock: function() {
            const waterLogs = getUserWaterLogs();
            return waterLogs.length >= 3;
        }
    },
    {
        id: "three-energy-logs",
        title: "Power Monitor",
        description: "Logged energy usage 3 times. You're on your way to becoming an energy efficiency expert!",
        hint: "Keep tracking your energy usage - 3 entries total.",
        category: "energy",
        icon: "fa-bolt",
        points: 30,
        unlockDate: null,
        isUnlocked: false,
        priority: 5,
        checkUnlock: function() {
            const energyLogs = getUserEnergyLogs();
            return energyLogs.length >= 3;
        }
    },
    {
        id: "settings-customizer",
        title: "Settings Master",
        description: "Customized your settings and saved them. Personalization is key to sustainable habits!",
        hint: "Visit settings and update your daily goals.",
        category: "special",
        icon: "fa-cog",
        points: 15,
        unlockDate: null,
        isUnlocked: false,
        priority: 6,
        checkUnlock: function() {
            // Check if user has saved custom settings
            const savedSettings = JSON.parse(localStorage.getItem(`settings_${currentUser?.id}`));
            return savedSettings !== null;
        }
    },
    {
        id: "two-tips-tried",
        title: "Eco Enthusiast",
        description: "Tried 2 different sustainability tips. You're building a repertoire of green practices!",
        hint: "Explore and try more tips from our collection.",
        category: "tips",
        icon: "fa-leaf",
        points: 35,
        unlockDate: null,
        isUnlocked: false,
        priority: 7,
        checkUnlock: function() {
            const triedTips = getUserTriedTips();
            return triedTips.length >= 2;
        }
    },
    
    // Short-term Achievements (2-3 days of activity)
    {
        id: "two-day-tracker",
        title: "Consistency Starter",
        description: "Tracked usage for 2 consecutive days. Consistency is the foundation of lasting change!",
        hint: "Log either water or energy for 2 days in a row.",
        category: "streak",
        icon: "fa-fire",
        points: 40,
        unlockDate: null,
        isUnlocked: false,
        priority: 8,
        checkUnlock: function() {
            const waterLogs = getUserWaterLogs();
            const energyLogs = getUserEnergyLogs();
            const allLogs = [...waterLogs, ...energyLogs];
            
            if (allLogs.length < 2) return false;
            
            // Get unique dates and sort them
            const dates = [...new Set(allLogs.map(log => log.date.split('T')[0]))].sort();
            
            // Check for consecutive days
            for (let i = 1; i < dates.length; i++) {
                const prevDate = new Date(dates[i-1]);
                const currDate = new Date(dates[i]);
                const diffTime = Math.abs(currDate - prevDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                if (diffDays === 1) {
                    return true; // Found 2 consecutive days
                }
            }
            
            return false;
        }
    },
    {
        id: "water-goal-achiever",
        title: "Water Goal Crusher",
        description: "Stayed below your daily water goal for one day. Efficient water use is a skill worth mastering!",
        hint: "Use less water than your daily goal on any single day.",
        category: "water",
        icon: "fa-trophy",
        points: 50,
        unlockDate: null,
        isUnlocked: false,
        priority: 9,
        checkUnlock: function() {
            const waterLogs = getUserWaterLogs();
            const dailyGoal = settings.waterGoal;
            
            // Group logs by date
            const dailyUsage = {};
            waterLogs.forEach(log => {
                const date = log.date.split('T')[0];
                if (!dailyUsage[date]) {
                    dailyUsage[date] = 0;
                }
                dailyUsage[date] += log.amount;
            });
            
            // Check if any day is below goal
            return Object.values(dailyUsage).some(usage => usage <= dailyGoal);
        }
    },
    {
        id: "energy-goal-achiever",
        title: "Energy Saver",
        description: "Stayed below your daily energy goal for one day. Every kilowatt saved makes a difference!",
        hint: "Use less energy than your daily goal on any single day.",
        category: "energy",
        icon: "fa-trophy",
        points: 50,
        unlockDate: null,
        isUnlocked: false,
        priority: 9,
        checkUnlock: function() {
            const energyLogs = getUserEnergyLogs();
            const dailyGoal = settings.energyGoal;
            
            // Group logs by date
            const dailyUsage = {};
            energyLogs.forEach(log => {
                const date = log.date.split('T')[0];
                if (!dailyUsage[date]) {
                    dailyUsage[date] = 0;
                }
                dailyUsage[date] += log.amount;
            });
            
            // Check if any day is below goal
            return Object.values(dailyUsage).some(usage => usage <= dailyGoal);
        }
    },
    {
        id: "data-explorer",
        title: "Data Explorer",
        description: "Visited the history page and viewed your usage charts. Data visualization helps identify patterns!",
        hint: "Check out your usage history and charts.",
        category: "special",
        icon: "fa-chart-bar",
        points: 25,
        unlockDate: null,
        isUnlocked: false,
        priority: 10,
        checkUnlock: function() {
            // This will be triggered when user visits history page
            return localStorage.getItem(`visited_history_${currentUser?.id}`) === 'true';
        }
    },
    {
        id: "tip-categories-explorer",
        title: "Category Explorer",
        description: "Tried tips from 2 different categories. Diversifying your sustainable practices multiplies the impact!",
        hint: "Try tips from both water and energy categories.",
        category: "tips",
        icon: "fa-compass",
        points: 45,
        unlockDate: null,
        isUnlocked: false,
        priority: 11,
        checkUnlock: function() {
            const triedTips = getUserTriedTips();
            const categories = new Set();
            
            triedTips.forEach(tipId => {
                const tip = findTipById(tipId);
                if (tip) {
                    categories.add(tip.category);
                }
            });
            
            return categories.size >= 2;
        }
    },
    
    // Weekly Achievements (easier than original)
    {
        id: "three-day-warrior",
        title: "Three Day Warrior",
        description: "Tracked usage for 3 different days. You're developing a sustainable tracking habit!",
        hint: "Log your usage on any 3 different days.",
        category: "streak",
        icon: "fa-medal",
        points: 75,
        unlockDate: null,
        isUnlocked: false,
        priority: 12,
        checkUnlock: function() {
            const waterLogs = getUserWaterLogs();
            const energyLogs = getUserEnergyLogs();
            const allLogs = [...waterLogs, ...energyLogs];
            
            const uniqueDates = new Set(allLogs.map(log => log.date.split('T')[0]));
            return uniqueDates.size >= 3;
        }
    },
    {
        id: "multi-category-master",
        title: "Multi-Category Master",
        description: "Tried tips from all 3 categories (water, energy, general). You're a well-rounded sustainability champion!",
        hint: "Explore tips from water, energy, and general categories.",
        category: "tips",
        icon: "fa-star",
        points: 100,
        unlockDate: null,
        isUnlocked: false,
        priority: 13,
        checkUnlock: function() {
            const triedTips = getUserTriedTips();
            const categories = new Set();
            
            triedTips.forEach(tipId => {
                const tip = findTipById(tipId);
                if (tip) {
                    categories.add(tip.category);
                }
            });
            
            return categories.has('water') && categories.has('energy') && categories.has('general');
        }
    },
    
    // Advanced Achievements
    {
        id: "week-long-tracker",
        title: "Week-Long Tracker",
        description: "Tracked usage for 7 different days. You've established a strong tracking routine!",
        hint: "Log your usage on 7 different days.",
        category: "streak",
        icon: "fa-calendar-week",
        points: 125,
        unlockDate: null,
        isUnlocked: false,
        priority: 14,
        checkUnlock: function() {
            const waterLogs = getUserWaterLogs();
            const energyLogs = getUserEnergyLogs();
            const allLogs = [...waterLogs, ...energyLogs];
            
            const uniqueDates = new Set(allLogs.map(log => log.date.split('T')[0]));
            return uniqueDates.size >= 7;
        }
    },
    {
        id: "conservation-champion",
        title: "Conservation Champion",
        description: "Achieved both water and energy goals on the same day. You're mastering the art of conservation!",
        hint: "Meet both your water and energy goals in a single day.",
        category: "special",
        icon: "fa-crown",
        points: 150,
        unlockDate: null,
        isUnlocked: false,
        priority: 15,
        checkUnlock: function() {
            const waterLogs = getUserWaterLogs();
            const energyLogs = getUserEnergyLogs();
            const waterGoal = settings.waterGoal;
            const energyGoal = settings.energyGoal;
            
            // Group logs by date
            const dailyWaterUsage = {};
            const dailyEnergyUsage = {};
            
            waterLogs.forEach(log => {
                const date = log.date.split('T')[0];
                if (!dailyWaterUsage[date]) dailyWaterUsage[date] = 0;
                dailyWaterUsage[date] += log.amount;
            });
            
            energyLogs.forEach(log => {
                const date = log.date.split('T')[0];
                if (!dailyEnergyUsage[date]) dailyEnergyUsage[date] = 0;
                dailyEnergyUsage[date] += log.amount;
            });
            
            // Check if any day meets both goals
            const allDates = new Set([...Object.keys(dailyWaterUsage), ...Object.keys(dailyEnergyUsage)]);
            
            return [...allDates].some(date => {
                const waterUsage = dailyWaterUsage[date] || 0;
                const energyUsage = dailyEnergyUsage[date] || 0;
                return waterUsage <= waterGoal && energyUsage <= energyGoal;
            });
        }
    }
];

/**
 * Find a tip by its ID
 */
function findTipById(tipId) {
    if (typeof tipsList !== 'undefined') {
        return tipsList.find(tip => tip.id === tipId);
    }
    return null;
}

/**
 * Get tips marked as tried by the current user
 */
function getUserTriedTips() {
    if (!currentUser) return [];
    return JSON.parse(localStorage.getItem(`tried_tips_${currentUser.id}`)) || [];
}

// Enhanced achievements DOM elements
const achievementElements = {
    init: function() {
        this.achievementsGrid = document.getElementById('achievementsGrid');
        this.totalAchievements = document.getElementById('totalAchievements');
        this.achievementPoints = document.getElementById('achievementPoints');
        this.nextAchievement = document.getElementById('nextAchievement');
        this.categoryTabs = document.querySelectorAll('.category-tab');
        this.achievementDetailModal = document.getElementById('achievementDetailModal');
        this.achievementModalTitle = document.getElementById('achievementModalTitle');
        this.achievementDetailIcon = document.getElementById('achievementDetailIcon');
        this.achievementDetailDescription = document.getElementById('achievementDetailDescription');
        this.achievementDetailCategory = document.getElementById('achievementDetailCategory');
        this.achievementDetailPoints = document.getElementById('achievementDetailPoints');
        this.achievementDetailStatus = document.getElementById('achievementDetailStatus');
    }
};

/**
 * Enhanced notification system with stronger duplicate prevention
 */
const enhancedNotificationSystem = {
    activeNotifications: new Set(),
    notificationHistory: new Map(), // Track when notifications were last shown
    
    showNotification: function(message, type = 'success', duration = 3000) {
        const notification = document.getElementById('notification');
        const notificationText = document.getElementById('notificationText');
        
        if (!notification || !notificationText) return;
        
        // Clear any existing timeout
        if (notification.timeout) {
            clearTimeout(notification.timeout);
        }
        
        // Set message
        notificationText.textContent = message;
        
        // Set appearance based on type
        notification.className = 'notification';
        
        switch (type) {
            case 'error':
                notification.style.background = 'linear-gradient(135deg, var(--danger-color), #C0392B)';
                break;
            case 'warning':
                notification.style.background = 'linear-gradient(135deg, var(--warning-color), #E67E22)';
                break;
            default:
                notification.style.background = 'linear-gradient(135deg, var(--success-color), #27AE60)';
        }
        
        // Show notification
        notification.classList.add('show');
        
        // Hide after specified duration
        notification.timeout = setTimeout(() => {
            notification.classList.remove('show');
        }, duration);
    },
    
    /**
     * Show achievement unlock notification with enhanced duplicate prevention
     */
    showAchievementNotification: function(achievement) {
        const achievementId = achievement.id;
        const now = Date.now();
        
        // Check if we recently showed this notification (within 10 seconds)
        const lastShown = this.notificationHistory.get(achievementId);
        if (lastShown && (now - lastShown) < 10000) {
            console.log(`🔒 Duplicate achievement notification prevented for: ${achievement.title}`);
            return;
        }
        
        // Prevent duplicate notifications
        if (this.activeNotifications.has(achievementId)) {
            console.log(`🔒 Achievement notification already active for: ${achievement.title}`);
            return;
        }
        
        // Mark as active and record timestamp
        this.activeNotifications.add(achievementId);
        this.notificationHistory.set(achievementId, now);
        
        // Show popup notification
        const popup = document.getElementById('achievementPopup');
        const popupName = document.getElementById('popupName');
        const popupPoints = document.getElementById('popupPoints');
        
        if (popup && popupName && popupPoints) {
            popupName.textContent = achievement.title;
            popupPoints.textContent = `+${achievement.points} points`;
            popup.style.display = 'flex';
            
            // Add entry animation class
            popup.classList.add('achievement-popup-anim');
            
            // Hide after 5 seconds
            setTimeout(() => {
                popup.classList.remove('achievement-popup-anim');
                popup.style.display = 'none';
                this.activeNotifications.delete(achievementId);
            }, 5000);
        }
        
        // Also show regular notification
        this.showNotification(`Achievement Unlocked: ${achievement.title}`, 'success', 4000);
        
        console.log(`🏆 Showed notification for achievement: ${achievement.title}`);
    }
};

/**
 * Initialize the achievements page with enhanced features
 */
function initAchievementsPage() {
    console.log('🏆 Initializing achievements page with enhanced duplicate prevention...');
    
    // Initialize elements
    achievementElements.init();
    
    // Mark that user visited achievements page
    if (currentUser) {
        localStorage.setItem(`visited_achievements_${currentUser.id}`, 'true');
    }
    
    // Load achievements first, then display
    loadUserAchievements();
    
    setTimeout(() => {
        displayAchievements('all');
        updateAchievementsProgress();
    }, 300);
    
    // Setup filter buttons with enhanced interaction
    if (achievementElements.categoryTabs) {
        achievementElements.categoryTabs.forEach(button => {
            button.addEventListener('click', () => {
                achievementElements.categoryTabs.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                displayAchievements(button.getAttribute('data-category'));
            });
        });
    }
    
    // Set up achievement detail modal
    if (achievementElements.achievementDetailModal) {
        const closeBtn = achievementElements.achievementDetailModal.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modalSystem.closeModal('achievementDetailModal');
            });
        }
    }
    
    console.log('✅ Achievements page initialized with duplicate prevention');
}

/**
 * Load achievements with better validation and duplicate prevention
 */
function loadUserAchievements() {
    if (!currentUser) return;
    
    try {
        const userAchievements = JSON.parse(localStorage.getItem(`achievements_${currentUser.id}`)) || [];
        
        achievements.forEach(achievement => {
            const userAchievement = userAchievements.find(a => a.id === achievement.id);
            if (userAchievement && userAchievement.isUnlocked) {
                achievement.isUnlocked = true;
                achievement.unlockDate = userAchievement.unlockDate;
                // Add to recently unlocked to prevent re-unlocking
                achievementProcessing.recentlyUnlocked.add(achievement.id);
            } else {
                achievement.isUnlocked = false;
                achievement.unlockDate = null;
            }
        });
        
        console.log(`📖 Loaded achievements for ${currentUser.name}`);
        
        // Clear the recently unlocked set after a delay
        setTimeout(() => {
            achievementProcessing.recentlyUnlocked.clear();
        }, 2000);
        
    } catch (error) {
        console.error('❌ Error loading achievements:', error);
    }
}

/**
 * Enhanced save function with immediate persistence
 */
function saveUserAchievements() {
    if (!currentUser) return;
    
    const userAchievements = achievements.map(achievement => ({
        id: achievement.id,
        isUnlocked: achievement.isUnlocked,
        unlockDate: achievement.unlockDate
    }));
    
    // Save immediately and synchronously if possible
    try {
        localStorage.setItem(`achievements_${currentUser.id}`, JSON.stringify(userAchievements));
        console.log(`💾 Saved ${userAchievements.filter(a => a.isUnlocked).length} achievements for user`);
    } catch (error) {
        console.error('❌ Error saving achievements:', error);
    }
}

/**
 * FIXED: Safe achievement checking with recursion prevention
 */
function safeCheckAchievements() {
    // Prevent multiple simultaneous checks
    if (isCheckingAchievements) {
        console.log('🔒 Achievement check already in progress, skipping...');
        return false;
    }
    
    try {
        isCheckingAchievements = true;
        const result = checkAllAchievements();
        return result;
    } catch (error) {
        console.error('❌ Error in achievement checking:', error);
        achievementProcessing.isChecking = false; // Reset flag on error
        return false;
    } finally {
        // Always reset the flag, even if there's an error
        isCheckingAchievements = false;
    }
}

/**
 * FIXED: Enhanced achievement checking with STRONG duplicate prevention - NO RECURSION
 */
function checkAllAchievements() {
    if (!currentUser) return false;
    
    // Prevent rapid successive calls
    const now = Date.now();
    if (achievementProcessing.isChecking || 
        (now - achievementProcessing.lastCheckTime < achievementProcessing.cooldownPeriod)) {
        console.log('🔒 Achievement check skipped - too soon or already processing');
        return false;
    }
    
    achievementProcessing.isChecking = true;
    achievementProcessing.lastCheckTime = now;
    
    let newlyUnlocked = false;
    const newAchievements = [];
    
    // Sort by priority to check easier achievements first
    const sortedAchievements = [...achievements].sort((a, b) => (a.priority || 999) - (b.priority || 999));
    
    sortedAchievements.forEach(achievement => {
        // TRIPLE CHECK: not unlocked, not recently processed, and not in processing set
        if (!achievement.isUnlocked && 
            !achievementProcessing.recentlyUnlocked.has(achievement.id)) {
            
            try {
                if (achievement.checkUnlock()) {
                    // Mark as processing immediately to prevent duplicates
                    achievementProcessing.recentlyUnlocked.add(achievement.id);
                    
                    achievement.isUnlocked = true;
                    achievement.unlockDate = new Date().toISOString();
                    newlyUnlocked = true;
                    newAchievements.push(achievement);
                    
                    console.log(`🏆 Achievement unlocked: ${achievement.title}`);
                }
            } catch (error) {
                console.error(`❌ Error checking achievement ${achievement.id}:`, error);
                // Remove from processing set if there was an error
                achievementProcessing.recentlyUnlocked.delete(achievement.id);
            }
        }
    });
    
    if (newlyUnlocked) {
        // Save immediately to prevent race conditions
        saveUserAchievements();
        updateAchievementsProgress();
        
        // Show notifications with delays - NO RECURSIVE CALLS
        newAchievements.forEach((achievement, index) => {
            setTimeout(() => {
                // Double-check before showing notification
                if (achievement.isUnlocked && !enhancedNotificationSystem.activeNotifications.has(achievement.id)) {
                    enhancedNotificationSystem.showAchievementNotification(achievement);
                    
                    // Update achievement display if on achievements page - NO RECURSIVE CALLS
                    const achievementsPage = document.getElementById('achievementsPage');
                    if (achievementsPage && achievementsPage.style.display !== 'none') {
                        setTimeout(() => {
                            updateAchievementsProgress();
                        }, 1000);
                    }
                }
            }, index * 1500); // 1.5 second delay between notifications
        });
        
        // Clear the recently unlocked set after notifications are done
        setTimeout(() => {
            newAchievements.forEach(achievement => {
                achievementProcessing.recentlyUnlocked.delete(achievement.id);
            });
        }, newAchievements.length * 1500 + 2000);
    }
    
    // Reset processing flag
    achievementProcessing.isChecking = false;
    
    return newlyUnlocked;
}

/**
 * Get currently active category
 */
function getActiveCategory() {
    const activeTab = document.querySelector('.category-tab.active');
    return activeTab ? activeTab.getAttribute('data-category') : 'all';
}

/**
 * Display achievements based on category with enhanced animations
 */
function displayAchievements(category = 'all') {
    if (!achievementElements.achievementsGrid) return;
    
    domUtils.clearElement(achievementElements.achievementsGrid);
    
    const filteredAchievements = category === 'all' 
        ? achievements 
        : achievements.filter(achievement => achievement.category === category);
    
    if (filteredAchievements.length === 0) {
        achievementElements.achievementsGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-trophy"></i>
                <h3>No Achievements Found</h3>
                <p>No achievements available for this category.</p>
            </div>
        `;
        return;
    }
    
    // Sort achievements: unlocked first, then by priority/points
    const sortedAchievements = filteredAchievements.sort((a, b) => {
        if (a.isUnlocked && !b.isUnlocked) return -1;
        if (!a.isUnlocked && b.isUnlocked) return 1;
        return (a.priority || 999) - (b.priority || 999);
    });
    
    // Create and append achievement cards with staggered animation
    sortedAchievements.forEach((achievement, index) => {
        const achievementCard = createAchievementCard(achievement);
        
        // Add animation delay for staggered effect
        achievementCard.style.opacity = '0';
        achievementCard.style.transform = 'translateY(20px)';
        
        achievementElements.achievementsGrid.appendChild(achievementCard);
        
        // Animate in with delay
        setTimeout(() => {
            achievementCard.style.transition = 'all 0.4s ease-out';
            achievementCard.style.opacity = '1';
            achievementCard.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    updateAchievementsProgress();
}

/**
 * Create an enhanced achievement card with better visual feedback
 */
function createAchievementCard(achievement) {
    const iconClass = 
        achievement.category === 'water' ? 'water-achievement' : 
        achievement.category === 'energy' ? 'energy-achievement' : 
        achievement.category === 'tips' ? 'tips-achievement' : 
        achievement.category === 'streak' ? 'streak-achievement' : 'special-achievement';
    
    const achievementCardDiv = domUtils.createElement('div', {
        className: `achievement-card ${achievement.isUnlocked ? 'unlocked' : 'locked'}`,
        dataset: { achievementId: achievement.id },
        onClick: () => showAchievementDetail(achievement),
        style: {
            cursor: 'pointer',
            position: 'relative'
        }
    });
    
    // Add unlock/lock indicator
    if (achievement.isUnlocked) {
        const unlockBadge = domUtils.createElement('div', {
            className: 'achievement-unlocked',
            title: 'Achievement Unlocked!'
        }, domUtils.createElement('i', { className: 'fas fa-check' }));
        achievementCardDiv.appendChild(unlockBadge);
    } else {
        const lockIcon = domUtils.createElement('div', {
            className: 'achievement-lock-icon',
            title: 'Achievement Locked'
        }, domUtils.createElement('i', { className: 'fas fa-lock' }));
        achievementCardDiv.appendChild(lockIcon);
    }
    
    const contentDiv = domUtils.createElement('div', { className: 'achievement-content' });
    
    // Enhanced icon container with progress indicator
    const iconContainer = domUtils.createElement('div', { 
        className: 'achievement-icon-container',
        style: { 
            position: 'relative', 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: 'var(--space-md)'
        }
    });
    
    const iconDiv = domUtils.createElement('div', { 
        className: `achievement-icon ${iconClass}`,
        style: {
            fontSize: '2.5rem',
            marginBottom: 'var(--space-sm)'
        }
    }, domUtils.createElement('i', { className: `fas ${achievement.icon}` }));
    
    const pointsBadge = domUtils.createElement('div', {
        className: 'points-badge',
        style: {
            background: achievement.isUnlocked ? 'var(--success-color)' : 'var(--text-light)',
            color: 'white',
            borderRadius: '12px',
            padding: '4px 8px',
            fontSize: '0.75rem',
            fontWeight: 'bold',
            textAlign: 'center'
        }
    }, `${achievement.points} pts`);
    
    iconContainer.appendChild(iconDiv);
    iconContainer.appendChild(pointsBadge);
    
    const titleDiv = domUtils.createElement('div', { 
        className: 'achievement-title',
        style: {
            textAlign: 'center',
            marginBottom: 'var(--space-sm)'
        }
    }, achievement.title);
    
    const hintDiv = domUtils.createElement('div', { 
        className: 'achievement-hint',
        style: {
            textAlign: 'center',
            fontSize: '0.9rem',
            lineHeight: '1.4'
        }
    }, achievement.isUnlocked ? achievement.description : achievement.hint);
    
    contentDiv.appendChild(iconContainer);
    contentDiv.appendChild(titleDiv);
    contentDiv.appendChild(hintDiv);
    
    // Add unlock date if achievement is unlocked
    if (achievement.isUnlocked && achievement.unlockDate) {
        const dateDiv = domUtils.createElement('div', { 
            className: 'achievement-date',
            style: {
                textAlign: 'center',
                marginTop: 'var(--space-sm)',
                fontSize: '0.75rem'
            }
        }, `Unlocked ${formatUtils.formatDate(achievement.unlockDate)}`);
        contentDiv.appendChild(dateDiv);
    }
    
    achievementCardDiv.appendChild(contentDiv);
    
    // Add hover effects
    achievementCardDiv.addEventListener('mouseenter', () => {
        if (!achievement.isUnlocked) {
            achievementCardDiv.style.transform = 'translateY(-4px) scale(1.02)';
        } else {
            achievementCardDiv.style.transform = 'translateY(-6px)';
        }
    });
    
    achievementCardDiv.addEventListener('mouseleave', () => {
        achievementCardDiv.style.transform = 'translateY(0) scale(1)';
    });
    
    return achievementCardDiv;
}

/**
 * Update achievements progress with enhanced stats and animations
 */
function updateAchievementsProgress() {
    const totalAchievements = achievements.length;
    const unlockedAchievements = achievements.filter(a => a.isUnlocked).length;
    const totalPoints = achievements.reduce((sum, a) => a.isUnlocked ? sum + a.points : sum, 0);
    const maxPoints = achievements.reduce((sum, a) => sum + a.points, 0);
    
    // Update total achievements with animation
    if (achievementElements.totalAchievements) {
        achievementElements.totalAchievements.textContent = `${unlockedAchievements}/${totalAchievements}`;
    }
    
    // Update points with animation
    if (achievementElements.achievementPoints) {
        const currentPoints = parseInt(achievementElements.achievementPoints.textContent) || 0;
        if (currentPoints !== totalPoints) {
            animateValue(achievementElements.achievementPoints, currentPoints, totalPoints, 1000);
        }
    }
    
    // Find next easiest achievement with better logic
    const nextAchievement = achievements
        .filter(a => !a.isUnlocked)
        .sort((a, b) => (a.priority || 999) - (b.priority || 999))[0];
    
    if (achievementElements.nextAchievement) {
        if (nextAchievement) {
            achievementElements.nextAchievement.textContent = nextAchievement.title;
            achievementElements.nextAchievement.title = nextAchievement.hint;
        } else {
            achievementElements.nextAchievement.textContent = 'All Unlocked! 🎉';
        }
    }
    
    // Update progress percentage visualization
    updateProgressVisualization(unlockedAchievements, totalAchievements, totalPoints, maxPoints);
}

/**
 * Update progress visualization
 */
function updateProgressVisualization(unlocked, total, points, maxPoints) {
    const percentage = Math.round((unlocked / total) * 100);
    const pointsPercentage = Math.round((points / maxPoints) * 100);
    
    // Create or update progress bars if they exist
    const progressContainers = document.querySelectorAll('.progress-container');
    progressContainers.forEach(container => {
        let progressBar = container.querySelector('.progress-fill');
        if (!progressBar) {
            progressBar = domUtils.createElement('div', {
                className: 'progress-fill',
                style: {
                    height: '100%',
                    backgroundColor: 'var(--primary-color)',
                    borderRadius: 'inherit',
                    transition: 'width 0.8s ease-out'
                }
            });
            container.appendChild(progressBar);
        }
        
        progressBar.style.width = `${percentage}%`;
    });
}

/**
 * Show enhanced achievement details in modal
 */
function showAchievementDetail(achievement) {
    if (!achievementElements.achievementDetailModal) return;
    
    // Set modal title
    if (achievementElements.achievementModalTitle) {
        achievementElements.achievementModalTitle.textContent = achievement.title;
    }
    
    // Set icon with category-specific styling
    if (achievementElements.achievementDetailIcon) {
        const iconClass = 
            achievement.category === 'water' ? 'water-achievement' : 
            achievement.category === 'energy' ? 'energy-achievement' : 
            achievement.category === 'tips' ? 'tips-achievement' : 
            achievement.category === 'streak' ? 'streak-achievement' : 'special-achievement';
        
        achievementElements.achievementDetailIcon.className = `fas ${achievement.icon} ${iconClass}`;
        achievementElements.achievementDetailIcon.style.fontSize = '3rem';
    }
    
    // Set description
    if (achievementElements.achievementDetailDescription) {
        achievementElements.achievementDetailDescription.innerHTML = `
            <p style="margin-bottom: 1rem;">${achievement.description}</p>
            ${!achievement.isUnlocked ? `
                <div style="background: var(--background-secondary); padding: 1rem; border-radius: 8px; border-left: 4px solid var(--primary-color);">
                    <strong>💡 Hint:</strong> ${achievement.hint}
                </div>
            ` : ''}
        `;
    }
    
    // Set category
    if (achievementElements.achievementDetailCategory) {
        achievementElements.achievementDetailCategory.textContent = capitalizeFirstLetter(achievement.category);
    }
    
    // Set points
    if (achievementElements.achievementDetailPoints) {
        achievementElements.achievementDetailPoints.textContent = achievement.points;
    }
    
    // Set status with enhanced styling
    if (achievementElements.achievementDetailStatus) {
        if (achievement.isUnlocked) {
            achievementElements.achievementDetailStatus.innerHTML = `
                <span style="color: var(--success-color); font-weight: bold;">
                    ✅ Unlocked on ${formatUtils.formatDate(achievement.unlockDate)}
                </span>
            `;
        } else {
            achievementElements.achievementDetailStatus.innerHTML = `
                <span style="color: var(--warning-color); font-weight: bold;">
                    🔒 Locked
                </span>
            `;
        }
    }
    
    modalSystem.openModal('achievementDetailModal');
}

/**
 * Get achievement statistics for the user
 */
function getAchievementStatistics() {
    const totalAchievements = achievements.length;
    const unlockedAchievements = achievements.filter(a => a.isUnlocked).length;
    const totalPoints = achievements.reduce((sum, a) => a.isUnlocked ? sum + a.points : sum, 0);
    
    const byCategory = {
        water: achievements.filter(a => a.category === 'water' && a.isUnlocked).length,
        energy: achievements.filter(a => a.category === 'energy' && a.isUnlocked).length,
        tips: achievements.filter(a => a.category === 'tips' && a.isUnlocked).length,
        streak: achievements.filter(a => a.category === 'streak' && a.isUnlocked).length,
        special: achievements.filter(a => a.category === 'special' && a.isUnlocked).length
    };
    
    return {
        total: totalAchievements,
        unlocked: unlockedAchievements,
        percentage: Math.round((unlockedAchievements / totalAchievements) * 100),
        points: totalPoints,
        byCategory,
        lastUnlocked: achievements
            .filter(a => a.isUnlocked && a.unlockDate)
            .sort((a, b) => new Date(b.unlockDate) - new Date(a.unlockDate))[0]
    };
}

/**
 * Utility function to animate values with easing
 */
function animateValue(element, start, end, duration) {
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
        element.textContent = Math.floor(current);
    }, 16);
}

/**
 * FIXED: Debounced achievement checking to prevent rapid calls - NO RECURSION
 */
const debouncedCheckAchievements = (function() {
    let timeout;
    return function() {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            // Call the safe version directly, not recursively
            if (!isCheckingAchievements && currentUser) {
                safeCheckAchievements();
            }
        }, 500); // 500ms debounce
    };
})();

/**
 * FIXED: Optimized achievement check functions - NO RECURSION
 */
function checkAchievementsOnWaterLog() {
    console.log('💧 Checking water-related achievements...');
    // Use timeout to prevent immediate recursion
    setTimeout(() => {
        if (!isCheckingAchievements) {
            debouncedCheckAchievements();
        }
    }, 100);
}

function checkAchievementsOnEnergyLog() {
    console.log('⚡ Checking energy-related achievements...');
    // Use timeout to prevent immediate recursion
    setTimeout(() => {
        if (!isCheckingAchievements) {
            debouncedCheckAchievements();
        }
    }, 100);
}

/**
 * Check specific achievement type (for optimization)
 */
function checkAchievementType(type) {
    const typeAchievements = achievements.filter(a => a.category === type && !a.isUnlocked);
    
    typeAchievements.forEach(achievement => {
        try {
            if (achievement.checkUnlock()) {
                achievement.isUnlocked = true;
                achievement.unlockDate = new Date().toISOString();
                
                saveUserAchievements();
                enhancedNotificationSystem.showAchievementNotification(achievement);
                
                // Update display if on achievements page
                const achievementsPage = document.getElementById('achievementsPage');
                if (achievementsPage && achievementsPage.style.display !== 'none') {
                    setTimeout(() => {
                        updateAchievementsProgress();
                    }, 1000);
                }
            }
        } catch (error) {
            console.error(`Error checking ${type} achievement ${achievement.id}:`, error);
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    const achievementsPage = document.getElementById('achievementsPage');
    if (achievementsPage && achievementsPage.style.display !== 'none') {
        setTimeout(() => initAchievementsPage(), 100);
    }
});

// Clean up any existing intervals on page unload
window.addEventListener('beforeunload', () => {
    achievementProcessing.recentlyUnlocked.clear();
    if (enhancedNotificationSystem) {
        enhancedNotificationSystem.activeNotifications.clear();
    }
});

// FIXED Export functions - Use safe versions
if (typeof window !== 'undefined') {
    window.checkAllAchievements = safeCheckAchievements;  // Use safe version
    window.initAchievementsPage = initAchievementsPage;
    window.checkAchievementsOnWaterLog = checkAchievementsOnWaterLog;
    window.checkAchievementsOnEnergyLog = checkAchievementsOnEnergyLog;
    window.getAchievementStatistics = getAchievementStatistics;
    window.loadUserAchievements = loadUserAchievements;
    window.saveUserAchievements = saveUserAchievements;
    window.notificationSystem = enhancedNotificationSystem;
    
    // Also export the safe checking function
    window.safeCheckAchievements = safeCheckAchievements;
}
