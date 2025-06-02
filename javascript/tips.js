/**
 * EcoTracker - Tips System
 * Handles displaying and managing sustainability tips with enhanced features
 */

// Tips data with enhanced information
const tipsList = [
    {
        id: "tip1",
        category: "water",
        title: "Reduce Shower Time",
        shortDescription: "Shortening your shower by just 2 minutes can save up to 40 liters of water each time.",
        longDescription: "The average shower uses about 20 liters of water per minute. By reducing your shower time from 10 to 8 minutes, you can save 40 liters every time you shower. Over a month, that's 1,200 liters saved! This simple habit change requires no investment and yields immediate results for water conservation. Consider using a waterproof timer or playing shorter songs to help keep track of time.",
        difficulty: "easy",
        savingPotential: "high",
        icon: "fa-shower",
        estimatedSavings: "40L per shower",
        timeToImplement: "Immediate"
    },
    {
        id: "tip2",
        category: "water",
        title: "Fix Leaky Faucets",
        shortDescription: "A dripping faucet can waste up to 20 liters of water per day.",
        longDescription: "Even a slow drip from a faucet can waste significant amounts of water over time. A faucet that drips once per second wastes about 20 liters of water per day, which is 7,300 liters per year! Fixing leaks promptly not only saves water but also prevents potential water damage to your home. Most faucet leaks can be fixed by replacing worn washers or O-rings, which is an inexpensive repair that costs less than R50 in parts.",
        difficulty: "medium",
        savingPotential: "medium",
        icon: "fa-wrench",
        estimatedSavings: "20L per day",
        timeToImplement: "1-2 hours"
    },
    {
        id: "tip3",
        category: "energy",
        title: "Switch to LED Bulbs",
        shortDescription: "LED bulbs use up to 90% less energy than incandescent bulbs and last up to 25 times longer.",
        longDescription: "LED light bulbs are one of the most efficient lighting options available today. While they may cost more upfront than traditional incandescent bulbs, they use up to 90% less energy and can last up to 25 times longer. For a bulb that's used 3 hours per day, an LED can last over 20 years! This means fewer replacements and significant energy savings over time. A typical home can save about R2,250 in energy costs per year by replacing incandescent bulbs with LEDs.",
        difficulty: "easy",
        savingPotential: "high",
        icon: "fa-lightbulb",
        estimatedSavings: "90% energy reduction",
        timeToImplement: "15 minutes per bulb"
    },
    {
        id: "tip4",
        category: "energy",
        title: "Unplug Idle Electronics",
        shortDescription: "Electronics on standby can account for up to 10% of your home's energy consumption.",
        longDescription: "Many electronic devices continue to draw power even when they're turned off or in standby mode. This 'phantom' or 'vampire' power consumption can account for up to 10% of your home's electricity use. By unplugging devices when not in use or using power strips that can be switched off, you can eliminate this wasted energy. Consider unplugging chargers, TVs, computers, printers, and kitchen appliances when they're not being used. Smart power strips can automatically cut power to devices in standby mode.",
        difficulty: "easy",
        savingPotential: "medium",
        icon: "fa-plug",
        estimatedSavings: "10% of electricity bill",
        timeToImplement: "Daily habit"
    },
    {
        id: "tip5",
        category: "water",
        title: "Collect Rainwater",
        shortDescription: "Use rainwater for garden irrigation to reduce freshwater consumption.",
        longDescription: "Installing a rain barrel to collect water from your roof's downspouts is an excellent way to reduce your freshwater consumption. This harvested rainwater is perfect for garden irrigation, washing your car, or cleaning outdoor areas. A typical rain barrel holds about 200-300 liters of water, and depending on your climate and the size of your roof, you could collect hundreds or even thousands of liters of free water annually. In South Africa's climate, a 100m² roof can collect about 60,000 liters per year with average rainfall.",
        difficulty: "medium",
        savingPotential: "medium",
        icon: "fa-cloud-rain",
        estimatedSavings: "200-300L per rainfall",
        timeToImplement: "1-2 days setup"
    },
    {
        id: "tip6",
        category: "energy",
        title: "Optimize Your Thermostat",
        shortDescription: "Adjusting your thermostat by just 1°C can reduce energy usage by up to 10%.",
        longDescription: "Small adjustments to your thermostat settings can lead to significant energy savings. In winter, lowering your thermostat by 1°C (or about 2°F) can reduce heating energy consumption by around 10%. Similarly, in summer, raising your cooling temperature by 1°C can save a similar amount. Consider installing a programmable or smart thermostat that can automatically adjust temperatures based on your schedule, optimizing comfort while maximizing efficiency. The ideal temperature range is 18-20°C in winter and 24-26°C in summer.",
        difficulty: "easy",
        savingPotential: "high",
        icon: "fa-temperature-low",
        estimatedSavings: "10% heating/cooling costs",
        timeToImplement: "Immediate"
    },
    {
        id: "tip7",
        category: "general",
        title: "Start Composting",
        shortDescription: "Reduce waste and create nutrient-rich soil for your garden by composting kitchen scraps.",
        longDescription: "Composting kitchen scraps and yard waste diverts material from landfills and creates valuable, nutrient-rich soil for your garden. Food waste in landfills generates methane, a potent greenhouse gas. By composting, you're not only reducing these emissions but also creating a free, sustainable fertilizer that improves soil health. A basic compost bin or pile can process fruit and vegetable scraps, coffee grounds, eggshells, yard trimmings, and more. The average household can divert 30% of their waste through composting.",
        difficulty: "medium",
        savingPotential: "low",
        icon: "fa-recycle",
        estimatedSavings: "30% waste reduction",
        timeToImplement: "Weekly maintenance"
    },
    {
        id: "tip8",
        category: "general",
        title: "Use Reusable Shopping Bags",
        shortDescription: "Replace single-use plastic bags with durable reusable shopping bags.",
        longDescription: "Single-use plastic bags have a significant environmental impact, from production to disposal. They're made from fossil fuels, rarely recycled, and can last for centuries in landfills. By switching to reusable shopping bags, you can prevent hundreds of plastic bags from entering the waste stream each year. Keep reusable bags in your car or by your door to ensure you have them handy when shopping. Many durable bags can hold more weight and are more comfortable to carry than plastic bags. A single reusable bag can replace over 1,000 plastic bags during its lifetime.",
        difficulty: "easy",
        savingPotential: "low",
        icon: "fa-shopping-bag",
        estimatedSavings: "1000+ plastic bags",
        timeToImplement: "Immediate"
    },
    {
        id: "tip9",
        category: "water",
        title: "Install Low-Flow Fixtures",
        shortDescription: "Low-flow showerheads and faucets can reduce water usage by up to 50%.",
        longDescription: "Installing low-flow showerheads, faucets, and toilet fixtures is one of the most effective ways to reduce water consumption without sacrificing performance. Modern low-flow fixtures use advanced technology to maintain water pressure while using significantly less water. A low-flow showerhead uses about 9 liters per minute compared to 19 liters for standard models. Low-flow faucets can reduce usage by 30-50%. These fixtures typically pay for themselves within 1-2 years through water savings.",
        difficulty: "medium",
        savingPotential: "high",
        icon: "fa-faucet",
        estimatedSavings: "50% water usage",
        timeToImplement: "2-4 hours installation"
    },
    {
        id: "tip10",
        category: "energy",
        title: "Use Natural Light",
        shortDescription: "Maximize natural light during the day to reduce electricity usage for lighting.",
        longDescription: "Making the most of natural light can significantly reduce your electricity consumption for lighting during daylight hours. Open curtains and blinds during the day, clean windows regularly to let in maximum light, and consider light-colored paint on walls to reflect more light around rooms. Rearrange workspaces and reading areas near windows. Installing skylights or solar tubes can bring natural light into darker areas of your home. Natural light also has health benefits, including improved mood and better sleep patterns.",
        difficulty: "easy",
        savingPotential: "medium",
        icon: "fa-sun",
        estimatedSavings: "30% lighting costs",
        timeToImplement: "Immediate"
    }
];

// Tips DOM elements cache
const tipsElements = {
    // Initialize with tips page elements
    init: function() {
        this.tipsPage = document.querySelector('.tips-page');
        this.tipsContainer = document.getElementById('tipsContainer');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.tipDetailModal = document.getElementById('tipDetailModal');
        this.tipDetailTitle = document.getElementById('tipDetailTitle');
        this.tipDetailIcon = document.getElementById('tipDetailIcon');
        this.tipDetailDifficulty = document.getElementById('tipDetailDifficulty');
        this.tipDetailSaving = document.getElementById('tipDetailSaving');
        this.tipDetailDescription = document.getElementById('tipDetailDescription');
        this.markTriedBtn = document.getElementById('markTriedBtn');
        this.tipTriedStatus = document.getElementById('tipTriedStatus');
        this.dashboardTips = document.getElementById('dashboardTips');
    }
};

/**
 * Initialize the tips page
 */
function initTipsPage() {
    // Initialize elements cache
    tipsElements.init();
    
    // Show loading state
    if (tipsElements.tipsContainer) {
        tipsElements.tipsContainer.innerHTML = `
            <div class="loading-state">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading tips...</p>
            </div>
        `;
    }
    
    // Display tips after a short delay to allow for DOM updates
    setTimeout(() => {
        displayTips('all');
    }, 300);
    
    // Setup filter buttons
    if (tipsElements.filterButtons) {
        tipsElements.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                tipsElements.filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                displayTips(button.getAttribute('data-category'));
            });
        });
    }
    
    // Set up tip detail modal close functionality
    if (tipsElements.tipDetailModal) {
        const closeBtn = tipsElements.tipDetailModal.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modalSystem.closeModal('tipDetailModal');
            });
        }
    }
    
    // Also initialize dashboard tips if on the dashboard
    const dashboardPage = document.getElementById('dashboardPage');
    if (dashboardPage && dashboardPage.style.display !== 'none') {
        updateDashboardTips();
    }
}

/**
 * Force tips page initialization (ensures proper display)
 */
function forceTipsInitialization() {
    if (!tipsElements.tipsContainer) {
        tipsElements.init();
    }
    
    if (tipsElements.tipsContainer) {
        // Ensure container has proper styles
        tipsElements.tipsContainer.style.display = 'grid';
        tipsElements.tipsContainer.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
        tipsElements.tipsContainer.style.gap = '20px';
        
        // Display tips
        displayTips('all');
    }
}

/**
 * Display tips filtered by category with enhanced animations
 * @param {string} category - Category to filter by ('all' for all categories)
 */
function displayTips(category = 'all') {
    if (!tipsElements.tipsContainer) return;
    
    // Clear container
    domUtils.clearElement(tipsElements.tipsContainer);
    
    // Filter tips by category
    const filteredTips = category === 'all' 
        ? tipsList 
        : tipsList.filter(tip => tip.category === category);
    
    if (filteredTips.length === 0) {
        tipsElements.tipsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-info-circle"></i>
                <h3>No tips available</h3>
                <p>No tips found for this category. Check back later for updates.</p>
            </div>
        `;
        return;
    }
    
    // Create and append tip cards with staggered animation
    filteredTips.forEach((tip, index) => {
        const tipCard = createTipCard(tip);
        
        // Add animation delay for staggered effect
        tipCard.style.opacity = '0';
        tipCard.style.transform = 'translateY(20px)';
        
        tipsElements.tipsContainer.appendChild(tipCard);
        
        // Animate in with delay
        setTimeout(() => {
            tipCard.style.transition = 'all 0.4s ease-out';
            tipCard.style.opacity = '1';
            tipCard.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

/**
 * Create an enhanced tip card element
 * @param {object} tip - The tip data
 * @returns {HTMLElement} - The tip card element
 */
function createTipCard(tip) {
    // Check if user has tried this tip
    const triedTips = getUserTriedTips();
    const hasTried = triedTips.includes(tip.id);
    
    // Get icon color based on category
    let iconColor = 
        tip.category === 'water' ? '#3A9ADB' : 
        tip.category === 'energy' ? '#F7B500' : 
        'var(--accent-color)';
    
    // Create card element
    const tipCardDiv = domUtils.createElement('div', {
        className: `tip-card ${hasTried ? 'tried' : ''}`,
        dataset: { 
            tipId: tip.id,
            category: tip.category,
            difficulty: tip.difficulty 
        },
        style: {
            position: 'relative',
            cursor: 'pointer'
        }
    });
    
    // Add tried badge if applicable
    if (hasTried) {
        const triedBadge = domUtils.createElement('div', {
            className: 'tip-tried-badge',
            title: 'You\'ve tried this tip!'
        }, domUtils.createElement('i', { className: 'fas fa-check' }));
        tipCardDiv.appendChild(triedBadge);
    }
    
    // Create header with icon and difficulty
    const headerDiv = domUtils.createElement('div', {
        className: 'tip-header',
        style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 'var(--space-sm)'
        }
    });
    
    // Create icon element
    const iconDiv = domUtils.createElement('div', {
        className: 'tip-icon',
        style: { color: iconColor }
    }, domUtils.createElement('i', { className: `fas ${tip.icon}` }));
    
    // Create difficulty badge
    const difficultyBadge = domUtils.createElement('div', {
        className: `difficulty-badge difficulty-${tip.difficulty}`,
        style: {
            padding: '2px 8px',
            borderRadius: '12px',
            fontSize: '0.75rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            backgroundColor: tip.difficulty === 'easy' ? '#e8f5e8' : 
                           tip.difficulty === 'medium' ? '#fff3cd' : '#f8d7da',
            color: tip.difficulty === 'easy' ? '#155724' : 
                   tip.difficulty === 'medium' ? '#856404' : '#721c24'
        }
    }, capitalizeFirstLetter(tip.difficulty));
    
    headerDiv.appendChild(iconDiv);
    headerDiv.appendChild(difficultyBadge);
    
    // Create title element
    const titleDiv = domUtils.createElement('div', {
        className: 'tip-title'
    }, tip.title);
    
    // Create description element
    const textDiv = domUtils.createElement('div', {
        className: 'tip-text'
    }, tip.shortDescription);
    
    // Create savings info
    const savingsDiv = domUtils.createElement('div', {
        className: 'tip-savings-info',
        style: {
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 'var(--space-sm)',
            fontSize: '0.8rem',
            color: 'var(--text-light)'
        }
    });
    
    const savingsSpan = domUtils.createElement('span', {
        style: { fontWeight: '600' }
    }, `💰 ${tip.estimatedSavings}`);
    
    const timeSpan = domUtils.createElement('span', {
        style: { fontWeight: '600' }
    }, `⏱️ ${tip.timeToImplement}`);
    
    savingsDiv.appendChild(savingsSpan);
    savingsDiv.appendChild(timeSpan);
    
    // Create button container
    const buttonDiv = domUtils.createElement('div', {
        className: 'tip-actions',
        style: {
            display: 'flex',
            gap: 'var(--space-sm)',
            marginTop: 'var(--space-md)'
        }
    });
    
    const viewButton = domUtils.createElement('button', {
        className: 'btn btn-secondary btn-sm',
        style: { flex: '1' },
        onClick: (e) => {
            e.stopPropagation();
            showTipDetail(tip);
        }
    }, [
        domUtils.createElement('i', { className: 'fas fa-eye' }),
        ' View Details'
    ]);
    
    const tryButton = domUtils.createElement('button', {
        className: hasTried ? 'btn btn-success btn-sm' : 'btn btn-primary btn-sm',
        style: { flex: '1' },
        disabled: hasTried,
        onClick: (e) => {
            e.stopPropagation();
            if (!hasTried) {
                markTipAsTried(tip.id);
            }
        }
    }, hasTried ? [
        domUtils.createElement('i', { className: 'fas fa-check' }),
        ' Tried'
    ] : [
        domUtils.createElement('i', { className: 'fas fa-thumbs-up' }),
        ' Mark as Tried'
    ]);
    
    buttonDiv.appendChild(viewButton);
    buttonDiv.appendChild(tryButton);
    
    // Add all elements to card
    tipCardDiv.appendChild(headerDiv);
    tipCardDiv.appendChild(titleDiv);
    tipCardDiv.appendChild(textDiv);
    tipCardDiv.appendChild(savingsDiv);
    tipCardDiv.appendChild(buttonDiv);
    
    // Add click event to the entire card for quick view
    tipCardDiv.addEventListener('click', () => {
        showTipDetail(tip);
    });
    
    // Add hover effect
    tipCardDiv.addEventListener('mouseenter', () => {
        tipCardDiv.style.transform = 'translateY(-4px)';
    });
    
    tipCardDiv.addEventListener('mouseleave', () => {
        tipCardDiv.style.transform = 'translateY(0)';
    });
    
    return tipCardDiv;
}

/**
 * Show enhanced tip details in modal
 * @param {object} tip - The tip to show details for
 */
function showTipDetail(tip) {
    if (!tipsElements.tipDetailModal) return;
    
    // Set modal title
    if (tipsElements.tipDetailTitle) {
        tipsElements.tipDetailTitle.textContent = tip.title;
    }
    
    // Set icon with appropriate color
    let iconColor = 
        tip.category === 'water' ? '#3A9ADB' : 
        tip.category === 'energy' ? '#F7B500' : 
        'var(--accent-color)';
    
    if (tipsElements.tipDetailIcon) {
        tipsElements.tipDetailIcon.innerHTML = `<i class="fas ${tip.icon}" style="color: ${iconColor}; font-size: 3rem;"></i>`;
    }
    
    // Set difficulty with enhanced styling
    if (tipsElements.tipDetailDifficulty) {
        const difficultyColor = tip.difficulty === 'easy' ? '#28a745' : 
                               tip.difficulty === 'medium' ? '#ffc107' : '#dc3545';
        tipsElements.tipDetailDifficulty.innerHTML = `
            <span class="difficulty-label">Difficulty:</span>
            <span class="difficulty-value" style="color: ${difficultyColor}; font-weight: 700;">
                ${capitalizeFirstLetter(tip.difficulty)}
            </span>
        `;
    }
    
    // Set saving potential with enhanced styling
    if (tipsElements.tipDetailSaving) {
        const savingColor = tip.savingPotential === 'high' ? '#28a745' : 
                           tip.savingPotential === 'medium' ? '#ffc107' : '#17a2b8';
        tipsElements.tipDetailSaving.innerHTML = `
            <span class="saving-label">Potential Impact:</span>
            <span class="saving-value" style="color: ${savingColor}; font-weight: 700;">
                ${capitalizeFirstLetter(tip.savingPotential)}
            </span>
        `;
    }
    
    // Set enhanced description with additional details
    if (tipsElements.tipDetailDescription) {
        tipsElements.tipDetailDescription.innerHTML = `
            <div style="margin-bottom: 1rem;">
                ${tip.longDescription}
            </div>
            <div style="background: var(--background-secondary); padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                <h4 style="margin-bottom: 0.5rem; color: var(--primary-color);">Quick Facts:</h4>
                <ul style="margin: 0; padding-left: 1.2rem;">
                    <li><strong>Estimated Savings:</strong> ${tip.estimatedSavings}</li>
                    <li><strong>Time to Implement:</strong> ${tip.timeToImplement}</li>
                    <li><strong>Category:</strong> ${capitalizeFirstLetter(tip.category)}</li>
                </ul>
            </div>
        `;
    }
    
    // Check if user has tried this tip
    const triedTips = getUserTriedTips();
    const hasTried = triedTips.includes(tip.id);
    
    // Update "Mark as Tried" button status
    if (tipsElements.markTriedBtn && tipsElements.tipTriedStatus) {
        if (hasTried) {
            tipsElements.markTriedBtn.style.display = 'none';
            tipsElements.tipTriedStatus.style.display = 'flex';
        } else {
            tipsElements.markTriedBtn.style.display = 'block';
            tipsElements.tipTriedStatus.style.display = 'none';
            
            // Remove existing event listeners
            const newBtn = tipsElements.markTriedBtn.cloneNode(true);
            tipsElements.markTriedBtn.parentNode.replaceChild(newBtn, tipsElements.markTriedBtn);
            tipsElements.markTriedBtn = newBtn;
            
            // Add new event listener
            tipsElements.markTriedBtn.addEventListener('click', () => {
                markTipAsTried(tip.id);
            });
        }
    }
    
    // Show modal
    modalSystem.openModal('tipDetailModal');
}

/**
 * Mark a tip as tried by the current user with enhanced feedback
 * @param {string} tipId - ID of the tip to mark
 */
function markTipAsTried(tipId) {
    if (!currentUser) {
        notificationSystem.showNotification('Please log in to save tips', 'error');
        return;
    }
    
    // Get current tried tips
    const triedTips = getUserTriedTips();
    
    // If not already tried, add it
    if (!triedTips.includes(tipId)) {
        triedTips.push(tipId);
        localStorage.setItem(`tried_tips_${currentUser.id}`, JSON.stringify(triedTips));
        
        // Update UI in modal
        if (tipsElements.markTriedBtn && tipsElements.tipTriedStatus) {
            tipsElements.markTriedBtn.style.display = 'none';
            tipsElements.tipTriedStatus.style.display = 'flex';
        }
        
        // Refresh tips display with animation
        const activeFilterBtn = document.querySelector('.filter-btn.active');
        if (activeFilterBtn) {
            displayTips(activeFilterBtn.getAttribute('data-category'));
        }
        
        // Update dashboard tips
        updateDashboardTips();
        
        // Check achievements
        if (typeof checkAllAchievements === 'function') {
            setTimeout(() => checkAllAchievements(), 500);
        }
        
        // Show enhanced notification
        const tip = tipsList.find(t => t.id === tipId);
        notificationSystem.showNotification(
            `Great! You've marked "${tip ? tip.title : 'tip'}" as tried! 🌱`,
            'success',
            4000
        );
        
        // Add points or streak tracking here if implemented
        updateTipStats();
    }
}

/**
 * Update tip statistics (for future enhancements)
 */
function updateTipStats() {
    const triedTips = getUserTriedTips();
    const tipStats = {
        totalTried: triedTips.length,
        byCategory: {
            water: triedTips.filter(id => {
                const tip = tipsList.find(t => t.id === id);
                return tip && tip.category === 'water';
            }).length,
            energy: triedTips.filter(id => {
                const tip = tipsList.find(t => t.id === id);
                return tip && tip.category === 'energy';
            }).length,
            general: triedTips.filter(id => {
                const tip = tipsList.find(t => t.id === id);
                return tip && tip.category === 'general';
            }).length
        },
        lastUpdated: new Date().toISOString()
    };
    
    // Store stats for future use
    if (currentUser) {
        localStorage.setItem(`tip_stats_${currentUser.id}`, JSON.stringify(tipStats));
    }
}

/**
 * Get tips marked as tried by the current user
 * @returns {Array} - Array of tip IDs that have been tried
 */
function getUserTriedTips() {
    if (!currentUser) return [];
    return JSON.parse(localStorage.getItem(`tried_tips_${currentUser.id}`)) || [];
}

/**
 * Update the tips shown on the dashboard with smart selection
 */
function updateDashboardTips() {
    // If dashboard tips container doesn't exist, exit
    if (!tipsElements.dashboardTips) return;
    
    // Get user tried tips
    const triedTips = getUserTriedTips();
    
    // Filter out tips the user has already tried
    const availableTips = tipsList.filter(tip => !triedTips.includes(tip.id));
    
    // If no available tips, use all tips but mark them appropriately
    const tipsToShow = availableTips.length > 0 ? availableTips : tipsList;
    
    // Clear container
    domUtils.clearElement(tipsElements.dashboardTips);
    
    // Smart selection: prioritize easy tips and different categories
    const selectedTips = smartTipSelection(tipsToShow, 3);
    
    // Create and append tip cards with animation
    selectedTips.forEach((tip, index) => {
        const tipCard = createSimpleTipCard(tip);
        tipCard.style.opacity = '0';
        tipCard.style.transform = 'translateY(20px)';
        
        tipsElements.dashboardTips.appendChild(tipCard);
        
        // Animate in
        setTimeout(() => {
            tipCard.style.transition = 'all 0.4s ease-out';
            tipCard.style.opacity = '1';
            tipCard.style.transform = 'translateY(0)';
        }, index * 150);
    });
}

/**
 * Smart tip selection algorithm
 * @param {Array} tips - Available tips
 * @param {number} count - Number of tips to select
 * @returns {Array} - Selected tips
 */
function smartTipSelection(tips, count) {
    // Prioritize easy tips
    const easyTips = tips.filter(tip => tip.difficulty === 'easy');
    const mediumTips = tips.filter(tip => tip.difficulty === 'medium');
    const hardTips = tips.filter(tip => tip.difficulty === 'hard');
    
    // Try to get tips from different categories
    const categories = ['water', 'energy', 'general'];
    const selectedTips = [];
    
    // First, try to get one tip from each category (easy ones first)
    categories.forEach(category => {
        if (selectedTips.length < count) {
            const categoryTips = easyTips.filter(tip => tip.category === category);
            if (categoryTips.length > 0) {
                const randomTip = categoryTips[Math.floor(Math.random() * categoryTips.length)];
                selectedTips.push(randomTip);
            }
        }
    });
    
    // Fill remaining slots with random tips (prefer easy)
    const remainingTips = tips.filter(tip => !selectedTips.includes(tip));
    const prioritizedRemaining = [...easyTips, ...mediumTips, ...hardTips]
        .filter(tip => remainingTips.includes(tip));
    
    while (selectedTips.length < count && prioritizedRemaining.length > 0) {
        const randomIndex = Math.floor(Math.random() * prioritizedRemaining.length);
        const tip = prioritizedRemaining.splice(randomIndex, 1)[0];
        if (!selectedTips.includes(tip)) {
            selectedTips.push(tip);
        }
    }
    
    return selectedTips;
}

/**
 * Create a simplified tip card for the dashboard
 * @param {object} tip - The tip data
 * @returns {HTMLElement} - The tip card element
 */
function createSimpleTipCard(tip) {
    // Get icon color based on category
    let iconColor = 
        tip.category === 'water' ? '#3A9ADB' : 
        tip.category === 'energy' ? '#F7B500' : 
        'var(--accent-color)';
    
    // Check if tried
    const triedTips = getUserTriedTips();
    const hasTried = triedTips.includes(tip.id);
    
    // Create card element
    const tipCardDiv = domUtils.createElement('div', {
        className: `tip-card ${hasTried ? 'tried' : ''}`,
        dataset: { tipId: tip.id },
        onClick: () => showTipDetail(tip),
        style: {
            cursor: 'pointer',
            position: 'relative'
        }
    });
    
    // Add tried badge if applicable
    if (hasTried) {
        const triedBadge = domUtils.createElement('div', {
            className: 'tip-tried-badge'
        }, domUtils.createElement('i', { className: 'fas fa-check' }));
        tipCardDiv.appendChild(triedBadge);
    }
    
    // Create icon element
    const iconDiv = domUtils.createElement('div', {
        className: 'tip-icon',
        style: { color: iconColor }
    }, domUtils.createElement('i', { className: `fas ${tip.icon}` }));
    
    // Create title element
    const titleDiv = domUtils.createElement('div', {
        className: 'tip-title'
    }, tip.title);
    
    // Create description element
    const textDiv = domUtils.createElement('div', {
        className: 'tip-text'
    }, tip.shortDescription);
    
    // Create quick action button
    const actionDiv = domUtils.createElement('div', {
        style: { marginTop: 'auto' }
    });
    
    const actionBtn = domUtils.createElement('button', {
        className: hasTried ? 'btn btn-success btn-sm' : 'btn btn-primary btn-sm',
        style: { width: '100%' },
        onClick: (e) => {
            e.stopPropagation();
            if (!hasTried) {
                markTipAsTried(tip.id);
            } else {
                showTipDetail(tip);
            }
        }
    }, hasTried ? '✓ Tried this!' : 'Mark as Tried');
    
    actionDiv.appendChild(actionBtn);
    
    // Add all elements to card
    tipCardDiv.appendChild(iconDiv);
    tipCardDiv.appendChild(titleDiv);
    tipCardDiv.appendChild(textDiv);
    tipCardDiv.appendChild(actionDiv);
    
    return tipCardDiv;
}

/**
 * Search tips functionality
 * @param {string} searchTerm - Search term
 * @returns {Array} - Filtered tips
 */
function searchTips(searchTerm) {
    if (!searchTerm) return tipsList;
    
    const term = searchTerm.toLowerCase();
    return tipsList.filter(tip => 
        tip.title.toLowerCase().includes(term) ||
        tip.shortDescription.toLowerCase().includes(term) ||
        tip.longDescription.toLowerCase().includes(term) ||
        tip.category.toLowerCase().includes(term)
    );
}

/**
 * Get tip statistics for user
 * @returns {Object} - Tip statistics
 */
function getTipStatistics() {
    const triedTips = getUserTriedTips();
    const totalTips = tipsList.length;
    
    return {
        totalTips,
        triedCount: triedTips.length,
        percentage: Math.round((triedTips.length / totalTips) * 100),
        byCategory: {
            water: triedTips.filter(id => {
                const tip = tipsList.find(t => t.id === id);
                return tip && tip.category === 'water';
            }).length,
            energy: triedTips.filter(id => {
                const tip = tipsList.find(t => t.id === id);
                return tip && tip.category === 'energy';
            }).length,
            general: triedTips.filter(id => {
                const tip = tipsList.find(t => t.id === id);
                return tip && tip.category === 'general';
            }).length
        }
    };
}

// Initialize on page load if on tips page
document.addEventListener('DOMContentLoaded', () => {
    // Initialize elements cache
    tipsElements.init();
    
    // If tips page is active, initialize it
    const tipsPage = document.getElementById('tipsPage');
    if (tipsPage && tipsPage.style.display !== 'none') {
        initTipsPage();
    }
    
    // Set up listener for navigation to tips page
    const tipsNavLink = document.querySelector('.nav-link[data-page="tipsPage"]');
    if (tipsNavLink) {
        tipsNavLink.addEventListener('click', () => {
            // Give the DOM time to update before initializing
            setTimeout(forceTipsInitialization, 300);
        });
    }
});