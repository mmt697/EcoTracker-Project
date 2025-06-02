/**
 * EcoTracker - Utility Functions (COMPLETE FIXED VERSION)
 * Shared functionality used across multiple parts of the application
 * UPDATED: Enhanced CSS chart utilities and improved boundary control
 */

// Application cache for better performance
const dataCache = {
    waterLogs: null,
    energyLogs: null,
    userSettings: null,
    userData: null,
    clearCache: function() {
        this.waterLogs = null;
        this.energyLogs = null;
        this.userSettings = null;
        this.userData = null;
    }
};

// Modal management system
const modalSystem = {
    /**
     * Open a modal dialog
     * @param {string} modalId - The ID of the modal to open
     */
    openModal: function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            document.body.classList.add('modal-open');
            
            // Add escape key listener
            this.handleEscapeKey = (e) => {
                if (e.key === 'Escape') {
                    this.closeModal(modalId);
                }
            };
            document.addEventListener('keydown', this.handleEscapeKey);
        }
    },
    
    /**
     * Close a modal dialog
     * @param {string} modalId - The ID of the modal to close
     */
    closeModal: function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.classList.remove('modal-open');
            
            // Remove escape key listener
            if (this.handleEscapeKey) {
                document.removeEventListener('keydown', this.handleEscapeKey);
                this.handleEscapeKey = null;
            }
        }
    },
    
    /**
     * Set up modal event listeners
     */
    initializeModals: function() {
        // Close buttons inside modals
        document.querySelectorAll('.close-btn, .close-modal').forEach(button => {
            button.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) {
                    this.closeModal(modal.id);
                }
            });
        });
        
        // Close modal when clicking outside content
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });
        
        // Prevent closing when clicking inside content
        document.querySelectorAll('.modal-content').forEach(content => {
            content.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        });
    }
};

// Enhanced notification system
const notificationSystem = {
    activeNotifications: new Set(),
    
    /**
     * Show a notification message
     * @param {string} message - The message to display
     * @param {string} type - The notification type (success, error, warning)
     * @param {number} duration - How long to show the notification (ms)
     */
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
     * Show achievement unlock notification
     * @param {object} achievement - The achievement that was unlocked
     */
    showAchievementNotification: function(achievement) {
        // Prevent duplicate notifications
        if (this.activeNotifications.has(achievement.id)) {
            return;
        }
        
        this.activeNotifications.add(achievement.id);
        
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
                this.activeNotifications.delete(achievement.id);
            }, 5000);
        }
        
        // Also show regular notification
        this.showNotification(`Achievement Unlocked: ${achievement.title}`, 'success', 4000);
    }
};

// Form validation utilities
const formValidation = {
    /**
     * Validate a numeric input
     * @param {string|number} value - The value to validate
     * @param {number} min - Minimum acceptable value
     * @param {number} max - Maximum acceptable value (optional)
     * @returns {boolean} Whether the value is valid
     */
    validateNumber: function(value, min = 0, max = null) {
        const num = parseFloat(value);
        if (isNaN(num)) return false;
        if (num < min) return false;
        if (max !== null && num > max) return false;
        return true;
    },
    
    /**
     * Validate an email address
     * @param {string} email - The email to validate
     * @returns {boolean} Whether the email is valid
     */
    validateEmail: function(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    /**
     * Validate a required field
     * @param {string} value - The value to check
     * @returns {boolean} Whether the value is non-empty
     */
    validateRequired: function(value) {
        return value !== null && value !== undefined && value.trim() !== '';
    },
    
    /**
     * Validate password strength
     * @param {string} password - The password to validate
     * @returns {boolean} Whether the password meets requirements
     */
    validatePassword: function(password) {
        // Require at least 6 characters
        return password.length >= 6;
    },
    
    /**
     * Check if passwords match
     * @param {string} password - The original password
     * @param {string} confirmPassword - The confirmation password
     * @returns {boolean} Whether the passwords match
     */
    validatePasswordMatch: function(password, confirmPassword) {
        return password === confirmPassword;
    },
    
    /**
     * Validate date input
     * @param {string} dateString - The date string to validate
     * @returns {boolean} Whether the date is valid
     */
    validateDate: function(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        
        // Check if date is valid and not in the future
        return !isNaN(date.getTime()) && date <= today;
    }
};

// Enhanced loading indicator system
const loadingSystem = {
    loadingElements: new Map(),
    
    /**
     * Show or hide the main loading overlay
     * @param {boolean} isLoading - Whether to show the loading indicator
     */
    showGlobalLoader: function(isLoading) {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.display = isLoading ? 'flex' : 'none';
        }
    },
    
    /**
     * Show or hide a loading indicator on a specific element
     * @param {string} elementId - The ID of the element to show loading on
     * @param {boolean} isLoading - Whether to show the loading indicator
     */
    showElementLoader: function(elementId, isLoading) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        if (isLoading) {
            // Store original content if not already stored
            if (!this.loadingElements.has(elementId)) {
                this.loadingElements.set(elementId, element.innerHTML);
            }
            element.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            element.disabled = true;
        } else {
            // Restore original content
            const originalContent = this.loadingElements.get(elementId);
            if (originalContent) {
                element.innerHTML = originalContent;
                this.loadingElements.delete(elementId);
            }
            element.disabled = false;
        }
    },
    
    /**
     * Show loading state for a specific card content
     * @param {string} cardId - The ID of the card
     * @param {boolean} isLoading - Whether to show loading
     */
    showCardLoader: function(cardId, isLoading) {
        const card = document.getElementById(cardId);
        if (!card) return;
        
        const content = card.querySelector('.card-content');
        if (!content) return;
        
        if (isLoading) {
            if (!this.loadingElements.has(cardId)) {
                this.loadingElements.set(cardId, content.innerHTML);
            }
            content.innerHTML = `
                <div class="loading-state">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>Loading...</p>
                </div>
            `;
        } else {
            const originalContent = this.loadingElements.get(cardId);
            if (originalContent) {
                content.innerHTML = originalContent;
                this.loadingElements.delete(cardId);
            }
        }
    }
};

// Enhanced date and number formatting utilities
const formatUtils = {
    /**
     * Format a date for display
     * @param {Date|string} date - The date to format
     * @param {string} format - Format to use ('short', 'medium', 'long')
     * @returns {string} Formatted date string
     */
    formatDate: function(date, format = 'medium') {
        const dateObj = date instanceof Date ? date : new Date(date);
        
        if (isNaN(dateObj.getTime())) {
            return 'Invalid date';
        }
        
        let options;
        switch (format) {
            case 'short':
                options = { month: 'short', day: 'numeric' };
                break;
            case 'long':
                options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                break;
            case 'medium':
            default:
                options = { year: 'numeric', month: 'short', day: 'numeric' };
        }
        
        return dateObj.toLocaleDateString('en-US', options);
    },
    
    /**
     * Format a relative date (e.g., "2 days ago")
     * @param {Date|string} date - The date to format
     * @returns {string} Relative date string
     */
    formatRelativeDate: function(date) {
        const dateObj = date instanceof Date ? date : new Date(date);
        const now = new Date();
        const diffTime = Math.abs(now - dateObj);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
        return this.formatDate(date);
    },
    
    /**
     * Format a number with proper units
     * @param {number} value - The value to format
     * @param {string} unit - The unit (L, kWh, etc)
     * @param {number} decimals - Number of decimal places
     * @returns {string} Formatted number with unit
     */
    formatNumber: function(value, unit, decimals = 1) {
        return `${parseFloat(value).toFixed(decimals)}${unit}`;
    },
    
    /**
     * Format a currency value
     * @param {number} value - The value to format
     * @param {string} currencySymbol - The currency symbol
     * @returns {string} Formatted currency value
     */
    formatCurrency: function(value, currencySymbol = 'R') {
        return `${currencySymbol}${parseFloat(value).toFixed(2)}`;
    },
    
    /**
     * Format a large number with K/M suffixes
     * @param {number} value - The value to format
     * @param {number} decimals - Number of decimal places
     * @returns {string} Formatted number
     */
    formatLargeNumber: function(value, decimals = 1) {
        if (value >= 1000000) {
            return (value / 1000000).toFixed(decimals) + 'M';
        }
        if (value >= 1000) {
            return (value / 1000).toFixed(decimals) + 'K';
        }
        return value.toFixed(decimals);
    }
};

// Enhanced data import/export utilities

// Enhanced data import/export utilities
const dataUtils = {
    /**
     * Export data as JSON
     * @param {Object} data - The data to export
     * @param {string} filename - Optional filename
     */
    exportAsJSON: function(data, filename = 'ecotracker-data.json') {
        try {
            // Create JSON string with proper formatting
            const jsonString = JSON.stringify(data, null, 2);
            
            // Create download link
            this.downloadFile(jsonString, filename, 'application/json');
            
            return true;
        } catch (error) {
            console.error('Error exporting JSON:', error);
            notificationSystem.showNotification('Error exporting data as JSON', 'error');
            return false;
        }
    },
    
    /**
     * Export data as CSV
     * @param {Array} data - Array of objects to export
     * @param {string} filename - Name of the file to download
     */
    exportAsCSV: function(data, filename = 'ecotracker-data.csv') {
        if (!data || !data.length) {
            notificationSystem.showNotification('No data to export', 'warning');
            return false;
        }
        
        try {
            // Get headers from first object
            const headers = Object.keys(data[0]);
            
            // Create CSV rows
            const csvRows = [];
            
            // Add header row
            csvRows.push(headers.join(','));
            
            // Add data rows
            data.forEach(item => {
                const values = headers.map(header => {
                    let value = item[header];
                    
                    // Handle different data types
                    if (value === null || value === undefined) {
                        value = '';
                    }
                    
                    // Handle commas and quotes in values
                    if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
                        value = `"${value.replace(/"/g, '""')}"`;
                    }
                    
                    return value;
                });
                csvRows.push(values.join(','));
            });
            
            // Combine into CSV string
            const csvString = csvRows.join('\n');
            
            // Create download link
            this.downloadFile(csvString, filename, 'text/csv');
            
            return true;
        } catch (error) {
            console.error('Error exporting CSV:', error);
            notificationSystem.showNotification('Error exporting data as CSV', 'error');
            return false;
        }
    },
    
    /**
     * Helper to create and trigger a download
     * @param {string} content - The file content
     * @param {string} filename - The filename
     * @param {string} mimeType - The MIME type
     */
    downloadFile: function(content, filename, mimeType) {
        try {
            const blob = new Blob([content], { type: mimeType });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading file:', error);
            notificationSystem.showNotification('Error downloading file', 'error');
        }
    },
    
    /**
     * Import data from file
     * @param {File} file - The file to import
     * @param {Function} callback - Callback function to handle the data
     */
    importFromFile: function(file, callback) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                let data;
                
                if (file.type === 'application/json' || file.name.endsWith('.json')) {
                    data = JSON.parse(e.target.result);
                } else if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
                    // Simple CSV parsing - for complex CSV, use Papa Parse
                    const lines = e.target.result.split('\n');
                    const headers = lines[0].split(',');
                    data = lines.slice(1).filter(line => line.trim()).map(line => {
                        const values = line.split(',');
                        const obj = {};
                        headers.forEach((header, index) => {
                            obj[header.trim()] = values[index] ? values[index].trim() : '';
                        });
                        return obj;
                    });
                }
                
                if (callback) {
                    callback(data);
                }
            } catch (error) {
                console.error('Error parsing file:', error);
                notificationSystem.showNotification('Error parsing file. Please check the format.', 'error');
            }
        };
        
        reader.onerror = function() {
            notificationSystem.showNotification('Error reading file', 'error');
        };
        
        reader.readAsText(file);
    }
};

// Enhanced DOM utility functions
const domUtils = {
    /**
     * Create an element with attributes and children
     * @param {string} tagName - Element tag name
     * @param {Object} attributes - Element attributes
     * @param {Array|string|Node} children - Child elements/content
     * @returns {HTMLElement} The created element
     */
    createElement: function(tagName, attributes = {}, children = []) {
        const element = document.createElement(tagName);
        
        // Set attributes
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'style' && typeof value === 'object') {
                Object.entries(value).forEach(([prop, val]) => {
                    element.style[prop] = val;
                });
            } else if (key === 'className') {
                element.className = value;
            } else if (key === 'dataset' && typeof value === 'object') {
                Object.entries(value).forEach(([dataKey, dataVal]) => {
                    element.dataset[dataKey] = dataVal;
                });
            } else if (key.startsWith('on') && typeof value === 'function') {
                // For event handlers
                const eventName = key.substring(2).toLowerCase();
                element.addEventListener(eventName, value);
            } else {
                element.setAttribute(key, value);
            }
        });
        
        // Add children
        if (children) {
            if (Array.isArray(children)) {
                children.forEach(child => {
                    if (child) {
                        if (typeof child === 'string') {
                            element.appendChild(document.createTextNode(child));
                        } else {
                            element.appendChild(child);
                        }
                    }
                });
            } else if (typeof children === 'string') {
                element.textContent = children;
            } else if (children instanceof Node) {
                element.appendChild(children);
            }
        }
        
        return element;
    },
    
    /**
     * Clear all children from an element
     * @param {string|HTMLElement} element - Element ID or reference
     */
    clearElement: function(element) {
        const el = typeof element === 'string' ? document.getElementById(element) : element;
        if (el) {
            while (el.firstChild) {
                el.removeChild(el.firstChild);
            }
        }
    },
    
    /**
     * Show or hide an element with animation
     * @param {string|HTMLElement} element - Element ID or reference
     * @param {boolean} show - Whether to show or hide
     * @param {string} animationType - Type of animation ('fade', 'slide')
     */
    toggleElement: function(element, show, animationType = 'fade') {
        const el = typeof element === 'string' ? document.getElementById(element) : element;
        if (!el) return;
        
        if (show) {
            el.style.display = 'block';
            if (animationType === 'fade') {
                el.style.opacity = '0';
                el.style.transition = 'opacity 0.3s ease';
                setTimeout(() => el.style.opacity = '1', 10);
            }
        } else {
            if (animationType === 'fade') {
                el.style.transition = 'opacity 0.3s ease';
                el.style.opacity = '0';
                setTimeout(() => el.style.display = 'none', 300);
            } else {
                el.style.display = 'none';
            }
        }
    },
    
    /**
     * Get element position relative to viewport
     * @param {HTMLElement} element - The element
     * @returns {Object} Position object with top, left, width, height
     */
    getElementPosition: function(element) {
        const rect = element.getBoundingClientRect();
        return {
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width,
            height: rect.height
        };
    }
};

// Authentication utility (enhanced security)
const authUtils = {
    /**
     * Hash a password using a simple hash function
     * Note: In production, use proper cryptographic libraries
     * @param {string} password - The password to hash
     * @returns {string} Hashed password
     */
    hashPassword: function(password) {
        // Simple hash for demonstration - use bcrypt or similar in production
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash.toString(16);
    },
    
    /**
     * Check if a password matches a stored hash
     * @param {string} password - The password to check
     * @param {string} hashedPassword - The stored password hash
     * @returns {boolean} Whether the password matches
     */
    verifyPassword: function(password, hashedPassword) {
        const hash = this.hashPassword(password);
        return hash === hashedPassword;
    },
    
    /**
     * Generate a random session token
     * @returns {string} Random token
     */
    generateToken: function() {
        return Math.random().toString(36).substring(2) + Date.now().toString(36);
    },
    
    /**
     * Check if user session is valid
     * @returns {boolean} Whether session is valid
     */
    isSessionValid: function() {
        const user = localStorage.getItem('currentUser');
        const loginTime = localStorage.getItem('loginTime');
        
        if (!user || !loginTime) return false;
        
        // Check if session is older than 24 hours
        const now = Date.now();
        const sessionAge = now - parseInt(loginTime);
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours
        
        return sessionAge < maxAge;
    }
};

// Utility functions for calculations
const calculationUtils = {
    /**
     * Calculate percentage
     * @param {number} value - Current value
     * @param {number} total - Total value
     * @returns {number} Percentage
     */
    calculatePercentage: function(value, total) {
        if (total === 0) return 0;
        return Math.min((value / total) * 100, 100);
    },
    
    /**
     * Calculate average from array of numbers
     * @param {Array} numbers - Array of numbers
     * @returns {number} Average
     */
    calculateAverage: function(numbers) {
        if (!numbers.length) return 0;
        const sum = numbers.reduce((acc, num) => acc + parseFloat(num), 0);
        return sum / numbers.length;
    },
    
    /**
     * Calculate trend between two values
     * @param {number} current - Current value
     * @param {number} previous - Previous value
     * @returns {Object} Trend object with direction and percentage
     */
    calculateTrend: function(current, previous) {
        if (previous === 0) {
            return { direction: 'neutral', percentage: 0 };
        }
        
        const change = ((current - previous) / previous) * 100;
        return {
            direction: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral',
            percentage: Math.abs(change)
        };
    }
};

// Performance utilities
const performanceUtils = {
    /**
     * Debounce function calls
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    /**
     * Throttle function calls
     * @param {Function} func - Function to throttle
     * @param {number} limit - Time limit in milliseconds
     * @returns {Function} Throttled function
     */
    throttle: function(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// ENHANCED CSS Chart Utilities (FIXED VERSION)
const cssChartUtils = {
    /**
     * Create CSS-based pie chart with improved boundary control
     * @param {Array} data - Data array with values
     * @param {Array} colors - Color array
     * @param {HTMLElement} container - Container element
     */
    createPieChart: function(data, colors, container) {
        const total = data.reduce((sum, value) => sum + value, 0);
        if (total === 0) return;
        
        // Clear container and add overflow control
        container.innerHTML = '';
        container.style.overflow = 'hidden';
        
        let currentAngle = 0;
        const segments = data.map((value, index) => {
            const percentage = (value / total) * 100;
            const angle = Math.max(0, Math.min(360, (value / total) * 360)); // Clamp angle
            const segment = {
                startAngle: currentAngle,
                endAngle: currentAngle + angle,
                percentage,
                color: colors[index] || '#ccc'
            };
            currentAngle += angle;
            return segment;
        });
        
        // Create improved conic gradient with boundary protection
        const gradientStops = [];
        segments.forEach(segment => {
            if (segment.endAngle > segment.startAngle) {
                gradientStops.push(`${segment.color} ${segment.startAngle}deg ${segment.endAngle}deg`);
            }
        });
        
        const pieChart = document.createElement('div');
        pieChart.className = 'css-pie-chart';
        pieChart.style.background = `conic-gradient(${gradientStops.join(', ')})`;
        pieChart.style.margin = '0 auto';
        
        container.appendChild(pieChart);
        return pieChart;
    },
    
    /**
     * Update CSS progress circle with enhanced boundary control
     * @param {HTMLElement} circle - SVG circle element
     * @param {number} percentage - Progress percentage (0-100)
     */
    updateProgressCircle: function(circle, percentage) {
        if (!circle) return;
        
        // Clamp percentage to valid range
        const clampedPercentage = Math.max(0, Math.min(100, percentage));
        
        const radius = parseFloat(circle.getAttribute('r'));
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (clampedPercentage / 100) * circumference;
        
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = offset;
        circle.style.transition = 'stroke-dashoffset 0.5s ease-in-out';
    },
    
    /**
     * Animate chart elements with improved performance
     * @param {HTMLElement} container - Chart container
     * @param {string} animationType - Type of animation
     */
    animateChart: function(container, animationType = 'slideIn') {
        if (!container) return;
        
        container.style.opacity = '0';
        container.style.transform = 'translateY(20px)';
        
        // Use requestAnimationFrame for better performance
        requestAnimationFrame(() => {
            container.style.transition = 'all 0.5s ease-out';
            container.style.opacity = '1';
            container.style.transform = 'translateY(0)';
        });
    },
    
    /**
     * Create CSS line chart with enhanced boundary control
     * @param {Array} data - Chart data points
     * @param {HTMLElement} container - Container element
     * @param {Object} options - Chart options
     */
    createLineChart: function(data, container, options = {}) {
        if (!data || data.length === 0) return;
        
        // Clear container and set overflow control
        container.innerHTML = '';
        container.style.overflow = 'hidden';
        container.style.position = 'relative';
        
        const maxValue = Math.max(...data, 1);
        const padding = maxValue * 0.1; // 10% padding
        const paddedMaxValue = maxValue + padding;
        
        // Create chart structure with proper boundaries
        const chartWrapper = document.createElement('div');
        chartWrapper.style.cssText = `
            width: 100%;
            height: 100%;
            position: relative;
            overflow: hidden;
            padding: 20px;
            box-sizing: border-box;
        `;
        
        const dataContainer = document.createElement('div');
        dataContainer.style.cssText = `
            position: absolute;
            top: 20px;
            left: 50px;
            right: 20px;
            bottom: 40px;
            overflow: hidden;
            clip-path: inset(0);
        `;
        
        // Create line elements with proper boundary control
        data.forEach((value, index) => {
            const percentage = Math.max(0, Math.min(100, (value / paddedMaxValue) * 100));
            const leftPosition = Math.max(0, Math.min(100, (index / Math.max(1, data.length - 1)) * 100));
            
            // Create data point
            const point = document.createElement('div');
            point.style.cssText = `
                position: absolute;
                width: 8px;
                height: 8px;
                background: white;
                border: 3px solid ${options.color || 'var(--primary-color)'};
                border-radius: 50%;
                left: ${leftPosition}%;
                bottom: ${percentage}%;
                transform: translate(-50%, -50%);
                z-index: 10;
            `;
            
            dataContainer.appendChild(point);
            
            // Create line segment to next point
            if (index < data.length - 1) {
                const nextValue = data[index + 1];
                const nextPercentage = Math.max(0, Math.min(100, (nextValue / paddedMaxValue) * 100));
                const nextLeftPosition = Math.max(0, Math.min(100, ((index + 1) / Math.max(1, data.length - 1)) * 100));
                
                const deltaX = nextLeftPosition - leftPosition;
                const deltaY = nextPercentage - percentage;
                
                if (deltaX > 0 && !isNaN(deltaX) && !isNaN(deltaY)) {
                    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
                    
                    const line = document.createElement('div');
                    line.style.cssText = `
                        position: absolute;
                        left: ${leftPosition}%;
                        bottom: ${percentage}%;
                        width: ${distance}%;
                        height: 2px;
                        background: ${options.color || 'var(--primary-color)'};
                        transform: rotate(${angle}deg);
                        transform-origin: left center;
                        border-radius: 1px;
                    `;
                    
                    dataContainer.appendChild(line);
                }
            }
        });
        
        chartWrapper.appendChild(dataContainer);
        container.appendChild(chartWrapper);
        
        return chartWrapper;
    },
    
    /**
     * Create CSS bar chart with enhanced boundary control
     * @param {Array} data - Chart data
     * @param {HTMLElement} container - Container element
     * @param {Object} options - Chart options
     */
    createBarChart: function(data, container, options = {}) {
        if (!data || data.length === 0) return;
        
        // Clear container and set overflow control
        container.innerHTML = '';
        container.style.overflow = 'hidden';
        container.style.display = 'flex';
        container.style.alignItems = 'flex-end';
        container.style.padding = '20px';
        container.style.gap = '10px';
        
        const maxValue = Math.max(...data, 1);
        
        data.forEach((value, index) => {
            const percentage = Math.max(0, Math.min(100, (value / maxValue) * 100));
            
            const bar = document.createElement('div');
            bar.style.cssText = `
                flex: 1;
                height: ${percentage}%;
                background: ${options.color || 'var(--primary-color)'};
                border-radius: 4px 4px 0 0;
                transition: all 0.3s ease;
                position: relative;
                min-height: 2px;
                max-height: 100%;
            `;
            
            // Add value label
            const label = document.createElement('div');
            label.style.cssText = `
                position: absolute;
                top: -25px;
                left: 50%;
                transform: translateX(-50%);
                font-size: 12px;
                font-weight: 600;
                white-space: nowrap;
            `;
            label.textContent = value.toFixed(1);
            
            bar.appendChild(label);
            container.appendChild(bar);
        });
        
        return container;
    }
};

// Helper function to capitalize first letter
function capitalizeFirstLetter(string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Helper function to generate unique ID
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Helper function to check if device is mobile
function isMobileDevice() {
    return window.innerWidth <= 768;
}

// Helper function to format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Enhanced CSS Chart specific utilities with boundary fixes
function createCSSLineChart(data, container, options = {}) {
    return cssChartUtils.createLineChart(data, container, options);
}

function createCSSBarChart(data, container, options = {}) {
    return cssChartUtils.createBarChart(data, container, options);
}

// Coordinate validation utilities for charts
const chartCoordinateUtils = {
    /**
     * Clamp a value between min and max
     * @param {number} value - Value to clamp
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} Clamped value
     */
    clamp: function(value, min, max) {
        return Math.max(min, Math.min(max, value));
    },
    
    /**
     * Validate and clamp percentage values
     * @param {number} percentage - Percentage to validate
     * @returns {number} Valid percentage (0-100)
     */
    validatePercentage: function(percentage) {
        if (isNaN(percentage)) return 0;
        return this.clamp(percentage, 0, 100);
    },
    
    /**
     * Validate chart data array
     * @param {Array} data - Data array to validate
     * @returns {Array} Validated data array
     */
    validateChartData: function(data) {
        if (!Array.isArray(data)) return [];
        return data.filter(value => !isNaN(value) && isFinite(value)).map(value => Math.max(0, value));
    },
    
    /**
     * Calculate safe positions for chart elements
     * @param {number} value - Data value
     * @param {number} maxValue - Maximum value in dataset
     * @param {number} index - Element index
     * @param {number} total - Total number of elements
     * @returns {Object} Safe position coordinates
     */
    calculateSafePosition: function(value, maxValue, index, total) {
        const percentage = this.validatePercentage(maxValue > 0 ? (value / maxValue) * 100 : 0);
        const leftPosition = this.validatePercentage((index / Math.max(1, total - 1)) * 100);
        
        return {
            x: leftPosition,
            y: percentage,
            isValid: !isNaN(percentage) && !isNaN(leftPosition)
        };
    }
};

// Export chart utilities for global access
if (typeof window !== 'undefined') {
    window.cssChartUtils = cssChartUtils;
    window.chartCoordinateUtils = chartCoordinateUtils;
    window.createCSSLineChart = createCSSLineChart;
    window.createCSSBarChart = createCSSBarChart;
}
