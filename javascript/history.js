/**
 * EcoTracker - History Page (IMPROVED with Bar Charts)
 * Part 1: Core functions and setup
 */

// Chart instances are now CSS-based bar charts
let currentCharts = {
    usageChart: null,
    pieChart: null
};

// Initialization tracking
let historyPageInitialized = false;

// Current view state
let historyState = {
    currentTab: 'water',
    chartType: 'water',
    waterLogs: [],
    energyLogs: [],
    waterFilters: {
        search: '',
        sort: 'date-desc'
    },
    energyFilters: {
        search: '',
        sort: 'date-desc'
    },
    period: {
        startDate: null,
        endDate: new Date(),
        days: 7
    }
};

// IMPROVED CHART CONFIGURATION for Bar Charts
const chartConfig = {
    margins: {
        top: 20,
        right: 20,
        bottom: 50,
        left: 60
    },
    maxPointsToShow: 14, // Better for bar charts
    animationDuration: 800,
    tooltipDelay: 100,
    barWidth: 40,
    barGap: 8
};

// History DOM elements cache
const historyElements = {
    init: function() {
        console.log('🔧 Initializing history elements...');
        
        // Chart containers
        this.usageChartContainer = document.getElementById('usageChartContainer');
        this.pieChartContainer = document.getElementById('pieChartContainer');
        this.pieChartLegend = document.getElementById('pieChartLegend');
        
        // Period controls
        this.historyCurrentDate = document.getElementById('historyCurrentDate');
        this.historyPeriodText = document.getElementById('historyPeriodText');
        this.pieChartPeriodDisplay = document.getElementById('pieChartPeriodDisplay');
        this.prevPeriodBtn = document.getElementById('prevPeriodBtn');
        this.nextPeriodBtn = document.getElementById('nextPeriodBtn');
        
        // Data tables
        this.waterLogsTableBody = document.getElementById('waterLogsTableBody');
        this.energyLogsTableBody = document.getElementById('energyLogsTableBody');
        this.waterLogsEmptyState = document.getElementById('waterLogsEmptyState');
        this.energyLogsEmptyState = document.getElementById('energyLogsEmptyState');
        
        // Filters
        this.waterSearchInput = document.getElementById('waterSearchInput');
        this.energySearchInput = document.getElementById('energySearchInput');
        this.waterSortSelect = document.getElementById('waterSortSelect');
        this.energySortSelect = document.getElementById('energySortSelect');
        
        // Action buttons
        this.historyAddWaterBtn = document.getElementById('historyAddWaterBtn');
        this.historyAddEnergyBtn = document.getElementById('historyAddEnergyBtn');
        this.exportCSVBtn = document.getElementById('exportCSVBtn');
        this.exportJSONBtn = document.getElementById('exportJSONBtn');
        
        // Chart controls
        this.chartToggleBtns = document.querySelectorAll('.chart-toggle-btn');
        this.tabs = document.querySelectorAll('.tabs .tab');
        this.tabContents = document.querySelectorAll('.tab-content');
        
        console.log('✅ History elements initialized');
        return true;
    }
};

/**
 * Initialize history page
 */
function initHistoryPage() {
    console.log('🚀 Initializing history page with IMPROVED Bar Charts...');
    
    if (historyPageInitialized) {
        console.log('ℹ️ History page already initialized, updating data...');
        updateHistoryData();
        setTimeout(() => {
            renderImprovedBarChart();
            renderFixedPieChart();
        }, 100);
        return;
    }
    
    // Mark that user visited history page (for achievement)
    if (typeof currentUser !== 'undefined' && currentUser) {
        localStorage.setItem(`visited_history_${currentUser.id}`, 'true');
        console.log('✅ History page visit recorded for achievements');
    }
    
    // Initialize elements cache
    if (!historyElements.init()) {
        console.warn('⚠️ Some DOM elements missing, retrying in 500ms...');
        setTimeout(() => {
            historyPageInitialized = false;
            initHistoryPage();
        }, 500);
        return;
    }
    
    // Setup page components
    setupHistoryPage();
}

/**
 * Setup history page components
 */
function setupHistoryPage() {
    console.log('🔧 Setting up history page components...');
    
    try {
        // Sync with global period if available
        if (typeof globalPeriodManager !== 'undefined') {
            historyState.period.days = globalPeriodManager.getPeriod();
            console.log('✅ Synced with global period manager:', historyState.period.days);
        } else if (typeof settings !== 'undefined') {
            historyState.period.days = settings.trackingPeriod || 7;
            console.log('✅ Used settings tracking period:', historyState.period.days);
        }
        
        // Initialize components
        updateHistoryDates();
        updatePeriodText();
        setupExportButtons();
        setupHistoryEventListeners();
        
        // Setup event listeners for automatic updates
        document.removeEventListener('logAdded', updateHistoryDataAndCharts);
        document.addEventListener('logAdded', updateHistoryDataAndCharts);
        
        document.removeEventListener('periodChanged', handleGlobalPeriodChange);
        document.addEventListener('periodChanged', handleGlobalPeriodChange);
        
        // Load data and render charts
        console.log('📊 Loading data and rendering IMPROVED Bar Charts...');
        setTimeout(() => {
            updateHistoryData();
            setTimeout(() => {
                renderFixedPieChart();
                setTimeout(() => {
                    renderImprovedBarChart();
                    historyPageInitialized = true;
                    console.log('✅ History page fully initialized with IMPROVED Bar Charts');
                }, 150);
            }, 100);
        }, 200);
        
    } catch (error) {
        console.error('❌ Error setting up history page:', error);
        showEmptyChartState(historyElements.usageChartContainer, 'Error loading charts. Please refresh the page.', 'bar');
    }
}

/**
 * Update history data and refresh charts (called after new logs are added)
 */
function updateHistoryDataAndCharts() {
    console.log('📊 Updating history data and charts after new log...');
    updateHistoryData();
    setTimeout(() => {
        renderFixedPieChart();
        renderImprovedBarChart();
    }, 100);
}

/**
 * IMPROVED: Create a clean bar chart instead of complex line chart
 */
function renderImprovedBarChart() {
    console.log('📊 Rendering improved bar chart...');
    
    if (!historyElements.usageChartContainer) {
        console.error('❌ Usage chart container not found');
        return;
    }
    
    const chartData = prepareBarChartData();
    if (!chartData || !chartData.labels.length) {
        console.log('ℹ️ No data for usage chart');
        showEmptyChartState(historyElements.usageChartContainer, 'Add some usage data to see your trends here.', 'bar');
        return;
    }
    
    // Clear container
    historyElements.usageChartContainer.innerHTML = '';
    
    // Create bar chart
    const chartHTML = createCleanBarChart(chartData);
    historyElements.usageChartContainer.innerHTML = chartHTML;
    
    // Add animations
    setTimeout(() => {
        animateBarChart();
    }, 100);
    
    console.log('✅ Improved bar chart rendered successfully');
}

/**
 * Prepare data specifically for bar chart
 */
function prepareBarChartData() {
    console.log('📊 Preparing bar chart data...');
    
    const dateLabels = [];
    const waterData = [];
    const energyData = [];
    
    // Create date range (limit to reasonable number of bars)
    const startDate = new Date(historyState.period.startDate);
    const endDate = new Date(historyState.period.endDate);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        console.error('❌ Invalid date range');
        return null;
    }
    
    const currentDate = new Date(startDate);
    const maxDays = Math.min(historyState.period.days, 14); // Limit to 14 days for better readability
    let dayCount = 0;
    
    while (currentDate <= endDate && dayCount < maxDays) {
        const dateStr = currentDate.toISOString().split('T')[0];
        dateLabels.push(dateStr);
        waterData.push(0);
        energyData.push(0);
        currentDate.setDate(currentDate.getDate() + 1);
        dayCount++;
    }
    
    // Fill in actual values
    historyState.waterLogs?.forEach(log => {
        if (log && typeof log.amount === 'number' && !isNaN(log.amount)) {
            const dateIndex = dateLabels.indexOf(log.date);
            if (dateIndex !== -1) {
                waterData[dateIndex] += Math.max(0, log.amount);
            }
        }
    });
    
    historyState.energyLogs?.forEach(log => {
        if (log && typeof log.amount === 'number' && !isNaN(log.amount)) {
            const dateIndex = dateLabels.indexOf(log.date);
            if (dateIndex !== -1) {
                energyData[dateIndex] += Math.max(0, log.amount);
            }
        }
    });
    
    // Format labels
    const formattedLabels = dateLabels.map(date => {
        const d = new Date(date);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    
    const chartData = {
        labels: formattedLabels,
        dates: dateLabels,
        waterData: waterData.map(val => Math.round(val * 10) / 10),
        energyData: energyData.map(val => Math.round(val * 10) / 10)
    };
    
    console.log('📊 Bar chart data prepared:', { 
        labels: chartData.labels.length, 
        waterTotal: waterData.reduce((a, b) => a + b, 0),
        energyTotal: energyData.reduce((a, b) => a + b, 0)
    });
    
    return chartData;
}
/**
 * EcoTracker - History Page (IMPROVED with Bar Charts)
 * Part 2: Bar chart creation and rendering functions
 */

/**
 * Create clean, responsive bar chart HTML with SIDE-BY-SIDE bars for combined view
 */
function createCleanBarChart(chartData) {
    const maxWater = Math.max(...chartData.waterData, 1);
    const maxEnergy = Math.max(...chartData.energyData, 1);
    const maxValue = Math.max(maxWater, maxEnergy);
    
    // Determine which datasets to show
    const showWater = historyState.chartType === 'water' || historyState.chartType === 'combined';
    const showEnergy = historyState.chartType === 'energy' || historyState.chartType === 'combined';
    
    // Create chart HTML
    let chartHTML = `
        <div class="bar-chart-container" style="
            width: 100%;
            height: 350px;
            background: white;
            border-radius: 12px;
            padding: 20px;
            display: flex;
            flex-direction: column;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        ">
            <!-- Chart Title -->
            <div class="chart-title" style="
                text-align: center;
                margin-bottom: 20px;
                font-size: 18px;
                font-weight: 600;
                color: var(--text-color);
            ">
                ${getChartTitle()}
            </div>
            
            <!-- Chart Area -->
            <div class="chart-area" style="
                flex: 1;
                display: flex;
                align-items: flex-end;
                justify-content: center;
                gap: ${chartData.labels.length > 10 ? '8px' : '12px'};
                padding: 20px 10px 40px 50px;
                position: relative;
            ">
                <!-- Y-Axis -->
                <div class="y-axis" style="
                    position: absolute;
                    left: 0;
                    top: 20px;
                    bottom: 40px;
                    width: 40px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    font-size: 12px;
                    color: var(--text-light);
                    text-align: right;
                    padding-right: 8px;
                ">
                    ${createYAxisLabels(maxValue)}
                </div>
                
                <!-- Bars -->
                ${createBars(chartData, maxValue, showWater, showEnergy)}
            </div>
            
            <!-- X-Axis Labels -->
            <div class="x-axis" style="
                display: flex;
                justify-content: center;
                gap: ${chartData.labels.length > 10 ? '8px' : '12px'};
                padding: 0 10px 0 50px;
                font-size: 12px;
                color: var(--text-light);
            ">
                ${chartData.labels.map(label => `
                    <div style="
                        flex: 1;
                        text-align: center;
                        ${chartData.labels.length > 10 ? 'font-size: 10px;' : ''}
                    ">${label}</div>
                `).join('')}
            </div>
        </div>
        
        <!-- Chart Legend -->
        <div class="chart-legend" style="
            display: flex;
            justify-content: center;
            gap: 24px;
            margin-top: 16px;
            padding: 16px;
            background: var(--background-secondary);
            border-radius: 8px;
        ">
            ${showWater ? `
                <div class="legend-item" style="display: flex; align-items: center; gap: 8px;">
                    <div style="width: 16px; height: 16px; background: var(--water-color); border-radius: 4px;"></div>
                    <span style="font-size: 14px; font-weight: 600;">Water (L)</span>
                </div>
            ` : ''}
            ${showEnergy ? `
                <div class="legend-item" style="display: flex; align-items: center; gap: 8px;">
                    <div style="width: 16px; height: 16px; background: var(--energy-color); border-radius: 4px;"></div>
                    <span style="font-size: 14px; font-weight: 600;">Energy (kWh)</span>
                </div>
            ` : ''}
        </div>
    `;
    
    return chartHTML;
}

/**
 * Get appropriate chart title
 */
function getChartTitle() {
    switch (historyState.chartType) {
        case 'water':
            return '💧 Water Usage Over Time';
        case 'energy':
            return '⚡ Energy Usage Over Time';
        case 'combined':
            return '📊 Water & Energy Usage Over Time';
        default:
            return '📈 Usage Over Time';
    }
}

/**
 * Create Y-axis labels
 */
function createYAxisLabels(maxValue) {
    const steps = 5;
    const stepValue = maxValue / steps;
    let labels = '';
    
    for (let i = steps; i >= 0; i--) {
        const value = stepValue * i;
        const displayValue = value < 10 ? value.toFixed(1) : Math.round(value);
        labels += `<div>${displayValue}</div>`;
    }
    
    return labels;
}

/**
 * Create bar elements - IMPROVED with side-by-side bars for combined view
 */
function createBars(chartData, maxValue, showWater, showEnergy) {
    let barsHTML = '';
    
    chartData.labels.forEach((label, index) => {
        const waterValue = chartData.waterData[index] || 0;
        const energyValue = chartData.energyData[index] || 0;
        
        // Calculate heights as percentages
        const waterHeight = maxValue > 0 ? (waterValue / maxValue) * 100 : 0;
        const energyHeight = maxValue > 0 ? (energyValue / maxValue) * 100 : 0;
        
        if (historyState.chartType === 'combined') {
            // SIDE-BY-SIDE bars for combined view (cleaner look)
            barsHTML += `
                <div class="bar-group" style="
                    flex: 1;
                    display: flex;
                    align-items: flex-end;
                    justify-content: center;
                    gap: 2px;
                    height: 100%;
                    position: relative;
                ">
                    <!-- Water Bar -->
                    ${waterValue > 0 ? `
                        <div class="bar water-bar" style="
                            width: 48%;
                            max-width: 18px;
                            height: ${Math.max(waterHeight, 2)}%;
                            background: linear-gradient(180deg, var(--water-color) 0%, rgba(52, 152, 219, 0.8) 100%);
                            border-radius: 3px 3px 0 0;
                            cursor: pointer;
                            transition: all 0.2s ease;
                            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                            opacity: 0;
                            transform: scaleY(0);
                            transform-origin: bottom;
                            border: 1px solid rgba(52, 152, 219, 0.3);
                        "
                        data-value="${waterValue}"
                        data-unit="L"
                        data-date="${chartData.dates[index]}"
                        data-type="water"
                        onmouseover="showBarTooltip(this, '${label}', ${waterValue}, 0, 'water')"
                        onmouseout="hideBarTooltip()">
                        </div>
                    ` : `<div style="width: 48%; max-width: 18px;"></div>`}
                    
                    <!-- Energy Bar -->
                    ${energyValue > 0 ? `
                        <div class="bar energy-bar" style="
                            width: 48%;
                            max-width: 18px;
                            height: ${Math.max(energyHeight, 2)}%;
                            background: linear-gradient(180deg, var(--energy-color) 0%, rgba(241, 196, 15, 0.8) 100%);
                            border-radius: 3px 3px 0 0;
                            cursor: pointer;
                            transition: all 0.2s ease;
                            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                            opacity: 0;
                            transform: scaleY(0);
                            transform-origin: bottom;
                            border: 1px solid rgba(241, 196, 15, 0.3);
                        "
                        data-value="${energyValue}"
                        data-unit="kWh"
                        data-date="${chartData.dates[index]}"
                        data-type="energy"
                        onmouseover="showBarTooltip(this, '${label}', 0, ${energyValue}, 'energy')"
                        onmouseout="hideBarTooltip()">
                        </div>
                    ` : `<div style="width: 48%; max-width: 18px;"></div>`}
                </div>
            `;
        } else {
            // Single bars for individual views
            const value = showWater ? waterValue : energyValue;
            const height = showWater ? waterHeight : energyHeight;
            const color = showWater ? 'var(--water-color)' : 'var(--energy-color)';
            const gradientColor = showWater ? 'rgba(52, 152, 219, 0.8)' : 'rgba(241, 196, 15, 0.8)';
            const borderColor = showWater ? 'rgba(52, 152, 219, 0.3)' : 'rgba(241, 196, 15, 0.3)';
            const unit = showWater ? 'L' : 'kWh';
            const type = showWater ? 'water' : 'energy';
            
            barsHTML += `
                <div class="bar-group" style="
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    height: 100%;
                ">
                    <div class="bar" style="
                        width: 100%;
                        max-width: 32px;
                        height: ${Math.max(height, 2)}%;
                        background: linear-gradient(180deg, ${color} 0%, ${gradientColor} 100%);
                        border-radius: 4px 4px 0 0;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                        opacity: 0;
                        transform: scaleY(0);
                        transform-origin: bottom;
                        border: 1px solid ${borderColor};
                        margin-top: auto;
                    "
                    data-value="${value}"
                    data-unit="${unit}"
                    data-date="${chartData.dates[index]}"
                    data-type="${type}"
                    onmouseover="showBarTooltip(this, '${label}', ${showWater ? value : 0}, ${showEnergy ? value : 0}, '${type}')"
                    onmouseout="hideBarTooltip()">
                    </div>
                </div>
            `;
        }
    });
    
    return barsHTML;
}

/**
 * Animate bars with staggered effect
 */
function animateBarChart() {
    const bars = document.querySelectorAll('.bar, .water-bar, .energy-bar');
    
    bars.forEach((bar, index) => {
        setTimeout(() => {
            bar.style.opacity = '1';
            bar.style.transform = 'scaleY(1)';
        }, index * 80);
        
        // Add hover effects
        bar.addEventListener('mouseenter', function() {
            this.style.transform = 'scaleY(1) translateY(-2px)';
            this.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
            this.style.zIndex = '10';
        });
        
        bar.addEventListener('mouseleave', function() {
            this.style.transform = 'scaleY(1) translateY(0)';
            this.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
            this.style.zIndex = '1';
        });
    });
}

/**
 * Show tooltip for bars - IMPROVED with better formatting
 */
function showBarTooltip(element, label, waterValue, energyValue, type) {
    let tooltip = document.querySelector('.bar-tooltip');
    
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.className = 'bar-tooltip';
        tooltip.style.cssText = `
            position: absolute;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 10px 12px;
            border-radius: 8px;
            font-size: 12px;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s ease;
            z-index: 1000;
            white-space: nowrap;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            font-family: 'Inter', sans-serif;
            line-height: 1.4;
        `;
        document.body.appendChild(tooltip);
    }
    
    // Create tooltip content based on chart type
    let content = `<div style="font-weight: 600; margin-bottom: 4px;">${label}</div>`;
    
    if (historyState.chartType === 'combined') {
        if (type === 'water' && waterValue > 0) {
            content += `<div style="color: #5DADE2;">💧 Water: ${waterValue.toFixed(1)}L</div>`;
        } else if (type === 'energy' && energyValue > 0) {
            content += `<div style="color: #F7DC6F;">⚡ Energy: ${energyValue.toFixed(1)}kWh</div>`;
        }
    } else {
        if (waterValue > 0) {
            content += `<div style="color: #5DADE2;">💧 Water: ${waterValue.toFixed(1)}L</div>`;
        }
        if (energyValue > 0) {
            content += `<div style="color: #F7DC6F;">⚡ Energy: ${energyValue.toFixed(1)}kWh</div>`;
        }
        if (waterValue === 0 && energyValue === 0) {
            content += '<div style="color: #BDC3C7;">No usage recorded</div>';
        }
    }
    
    tooltip.innerHTML = content;
    tooltip.style.opacity = '1';
    
    // Position tooltip
    const rect = element.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    
    let left = rect.left + rect.width / 2 - tooltipRect.width / 2;
    let top = rect.top - tooltipRect.height - 10;
    
    // Keep within viewport
    left = Math.max(10, Math.min(left, window.innerWidth - tooltipRect.width - 10));
    top = Math.max(10, top);
    
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
}

/**
 * Hide tooltip
 */
function hideBarTooltip() {
    const tooltip = document.querySelector('.bar-tooltip');
    if (tooltip) {
        tooltip.style.opacity = '0';
    }
}

/**
 * REPLACE the old renderFixedLineChart function with bar chart
 */
function renderFixedLineChart() {
    // Use improved bar chart instead of complex line chart
    renderImprovedBarChart();
}

// Add these global functions for tooltip functionality
window.showBarTooltip = showBarTooltip;
window.hideBarTooltip = hideBarTooltip;

/**
 * EcoTracker - History Page (IMPROVED with Bar Charts)
 * Part 3: Utility functions, event handlers, and pie chart
 */

/**
 * FIXED CSS PIE CHART (keeping original pie chart implementation)
 */
function renderFixedPieChart() {
    console.log('🥧 Rendering pie chart...');
    
    if (!historyElements.pieChartContainer) {
        console.error('❌ Pie chart container not found');
        return;
    }
    
    const totalWater = historyState.waterLogs?.reduce((sum, log) => sum + (log.amount || 0), 0) || 0;
    const totalEnergy = historyState.energyLogs?.reduce((sum, log) => sum + (log.amount || 0), 0) || 0;
    const total = totalWater + totalEnergy;
    
    console.log(`🥧 Pie chart data: Water=${totalWater}, Energy=${totalEnergy}, Total=${total}`);
    
    // Clear container
    historyElements.pieChartContainer.innerHTML = '';
    
    // Check if there's data to show
    if (total === 0) {
        console.log('ℹ️ No data for pie chart');
        updateFixedPieChartLegend(0, 0);
        showEmptyChartState(historyElements.pieChartContainer, 'Add usage data to see your consumption breakdown.', 'pie');
        return;
    }
    
    // Calculate angles with precision
    const waterAngle = (totalWater / total) * 360;
    const energyAngle = (totalEnergy / total) * 360;
    
    // Create pie chart container
    const pieWrapper = document.createElement('div');
    pieWrapper.style.cssText = `
        position: relative;
        width: 180px;
        height: 180px;
        margin: 0 auto;
        overflow: hidden;
        border-radius: 50%;
    `;
    
    // Create CSS pie chart with proper gradient
    const pieChart = document.createElement('div');
    pieChart.className = 'css-pie-chart';
    pieChart.style.cssText = `
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: conic-gradient(
            var(--water-color) 0deg ${waterAngle}deg,
            var(--energy-color) ${waterAngle}deg 360deg
        );
        position: relative;
        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    `;
    
    // Add center content
    const centerContent = document.createElement('div');
    centerContent.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        width: 90px;
        height: 90px;
        border-radius: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 2;
        box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
    `;
    
    centerContent.innerHTML = `
        <div style="font-size: 1.25rem; font-weight: 700; color: var(--text-color); line-height: 1;">
            ${total.toFixed(1)}
        </div>
        <div style="font-size: 0.75rem; color: var(--text-light); text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px;">
            Total Usage
        </div>
    `;
    
    pieChart.appendChild(centerContent);
    pieWrapper.appendChild(pieChart);
    historyElements.pieChartContainer.appendChild(pieWrapper);
    
    // Update legend
    updateFixedPieChartLegend(totalWater, totalEnergy);
    
    console.log('✅ Pie chart rendered successfully');
}

/**
 * Update fixed pie chart legend
 */
function updateFixedPieChartLegend(totalWater, totalEnergy) {
    if (!historyElements.pieChartLegend) return;
    
    const total = totalWater + totalEnergy;
    const waterPercentage = total > 0 ? ((totalWater / total) * 100).toFixed(1) : 0;
    const energyPercentage = total > 0 ? ((totalEnergy / total) * 100).toFixed(1) : 0;
    
    historyElements.pieChartLegend.innerHTML = `
        <div style="display: flex; justify-content: center; gap: 32px; flex-wrap: wrap;">
            <div style="display: flex; align-items: center; gap: 12px; background: white; padding: 12px 16px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
                <div style="width: 16px; height: 16px; background-color: var(--water-color); border-radius: 4px; border: 1px solid rgba(0, 0, 0, 0.1);"></div>
                <div>
                    <div style="font-size: 14px; font-weight: 600; color: var(--text-color);">💧 Water Usage</div>
                    <div style="font-size: 12px; color: var(--text-light);">${totalWater.toFixed(1)}L (${waterPercentage}%)</div>
                </div>
            </div>
            <div style="display: flex; align-items: center; gap: 12px; background: white; padding: 12px 16px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
                <div style="width: 16px; height: 16px; background-color: var(--energy-color); border-radius: 4px; border: 1px solid rgba(0, 0, 0, 0.1);"></div>
                <div>
                    <div style="font-size: 14px; font-weight: 600; color: var(--text-color);">⚡ Energy Usage</div>
                    <div style="font-size: 12px; color: var(--text-light);">${totalEnergy.toFixed(1)}kWh (${energyPercentage}%)</div>
                </div>
            </div>
        </div>
        <div style="text-align: center; margin-top: 16px; font-size: 14px; font-weight: 600; color: var(--primary-color);">
            📅 Total Usage Period: ${historyState.period.days} days
        </div>
    `;
}

/**
 * Show appropriate empty state for charts
 */
function showEmptyChartState(container, message, chartType) {
    if (!container) return;
    
    const iconMap = {
        'line': 'fa-chart-line',
        'pie': 'fa-chart-pie',
        'bar': 'fa-chart-bar'
    };
    
    const icon = iconMap[chartType] || 'fa-chart-bar';
    
    container.innerHTML = `
        <div class="empty-chart-state" style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 300px;
            color: var(--text-light);
            padding: 48px;
            text-align: center;
            background: var(--background-secondary);
            border-radius: 12px;
            border: 2px dashed var(--light-color);
        ">
            <i class="fas ${icon}" style="font-size: 4rem; margin-bottom: 24px; opacity: 0.4; color: var(--primary-color);"></i>
            <h3 style="font-size: 20px; margin-bottom: 12px; color: var(--text-color); font-weight: 600;">No Chart Data</h3>
            <p style="margin: 0 0 24px; line-height: 1.5; max-width: 350px;">${message}</p>
            <button onclick="location.reload()" class="btn btn-secondary" style="display: flex; align-items: center; gap: 8px;">
                <i class="fas fa-refresh"></i> Refresh
            </button>
        </div>
    `;
}

/**
 * Handle global period change and update charts
 */
function handleGlobalPeriodChange(event) {
    console.log('📅 Global period changed:', event?.detail?.period);
    if (event && event.detail && event.detail.period) {
        historyState.period.days = event.detail.period;
        updateHistoryDates();
        updatePeriodText();
        updateHistoryData();
        
        // Update charts with a slight delay to ensure data is ready
        setTimeout(() => {
            renderFixedPieChart();
            renderImprovedBarChart();
        }, 150);
    }
}

/**
 * Set up event listeners for the history page
 */
function setupHistoryEventListeners() {
    console.log('🎧 Setting up event listeners...');
    
    // Period navigation buttons
    if (historyElements.prevPeriodBtn) {
        historyElements.prevPeriodBtn.addEventListener('click', movePeriodBackward);
    }
    
    if (historyElements.nextPeriodBtn) {
        historyElements.nextPeriodBtn.addEventListener('click', movePeriodForward);
    }
    
    // Search filters with debounce
    if (historyElements.waterSearchInput) {
        const searchHandler = () => {
            historyState.waterFilters.search = historyElements.waterSearchInput.value;
            renderWaterLogs();
        };
        
        if (typeof performanceUtils !== 'undefined' && performanceUtils.debounce) {
            historyElements.waterSearchInput.addEventListener('input', performanceUtils.debounce(searchHandler, 300));
        } else {
            historyElements.waterSearchInput.addEventListener('input', searchHandler);
        }
    }
    
    if (historyElements.energySearchInput) {
        const searchHandler = () => {
            historyState.energyFilters.search = historyElements.energySearchInput.value;
            renderEnergyLogs();
        };
        
        if (typeof performanceUtils !== 'undefined' && performanceUtils.debounce) {
            historyElements.energySearchInput.addEventListener('input', performanceUtils.debounce(searchHandler, 300));
        } else {
            historyElements.energySearchInput.addEventListener('input', searchHandler);
        }
    }
    
    // Sort filters
    if (historyElements.waterSortSelect) {
        historyElements.waterSortSelect.addEventListener('change', () => {
            historyState.waterFilters.sort = historyElements.waterSortSelect.value;
            renderWaterLogs();
        });
    }
    
    if (historyElements.energySortSelect) {
        historyElements.energySortSelect.addEventListener('change', () => {
            historyState.energyFilters.sort = historyElements.energySortSelect.value;
            renderEnergyLogs();
        });
    }
    
    // Add log buttons
    if (historyElements.historyAddWaterBtn) {
        historyElements.historyAddWaterBtn.addEventListener('click', () => {
            if (typeof modalSystem !== 'undefined') {
                modalSystem.openModal('waterModal');
            }
        });
    }
    
    if (historyElements.historyAddEnergyBtn) {
        historyElements.historyAddEnergyBtn.addEventListener('click', () => {
            if (typeof modalSystem !== 'undefined') {
                modalSystem.openModal('energyModal');
            }
        });
    }
    
    // Tab switching
    if (historyElements.tabs) {
        historyElements.tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.getAttribute('data-tab');
                historyElements.tabs.forEach(t => t.classList.remove('active'));
                historyElements.tabContents.forEach(tc => tc.classList.remove('active'));
                
                tab.classList.add('active');
                const tabContent = document.getElementById(`${tabName}TabContent`);
                if (tabContent) {
                    tabContent.classList.add('active');
                }
                historyState.currentTab = tabName;
            });
        });
    }
    
    // Chart toggle buttons with improved handling
    if (historyElements.chartToggleBtns) {
        historyElements.chartToggleBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const chartType = btn.getAttribute('data-type');
                historyElements.chartToggleBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                historyState.chartType = chartType;
                
                // Update chart immediately
                setTimeout(() => renderImprovedBarChart(), 100);
            });
        });
    }
    
    console.log('✅ Event listeners configured');
}

/**
 * Set up export buttons
 */
function setupExportButtons() {
    if (historyElements.exportCSVBtn) {
        historyElements.exportCSVBtn.addEventListener('click', exportDataAsCSV);
    }
    
    if (historyElements.exportJSONBtn) {
        historyElements.exportJSONBtn.addEventListener('click', exportDataAsJSON);
    }
}

/**
 * Export usage data as CSV
 */
function exportDataAsCSV() {
    if (typeof isAuthenticated === 'undefined' || !isAuthenticated) {
        if (typeof notificationSystem !== 'undefined') {
            notificationSystem.showNotification('Please log in to export data', 'error');
        }
        return;
    }
    
    try {
        if (typeof loadingSystem !== 'undefined') {
            loadingSystem.showElementLoader('exportCSVBtn', true);
        }
        
        const waterLogs = typeof getUserWaterLogs === 'function' ? getUserWaterLogs() : [];
        const energyLogs = typeof getUserEnergyLogs === 'function' ? getUserEnergyLogs() : [];
        
        const waterLogsForExport = waterLogs.map(log => ({
            type: 'water',
            date: typeof formatUtils !== 'undefined' ? formatUtils.formatDate(log.date) : log.date,
            amount: log.amount,
            unit: 'liters',
            notes: log.notes || '',
            timestamp: log.timestamp
        }));
        
        const energyLogsForExport = energyLogs.map(log => ({
            type: 'energy',
            date: typeof formatUtils !== 'undefined' ? formatUtils.formatDate(log.date) : log.date,
            amount: log.amount,
            unit: 'kWh',
            notes: log.notes || '',
            timestamp: log.timestamp
        }));
        
        const allLogs = [...waterLogsForExport, ...energyLogsForExport];
        
        if (allLogs.length > 0) {
            if (typeof dataUtils !== 'undefined') {
                dataUtils.exportAsCSV(allLogs, 'ecotracker-usage-logs.csv');
            }
            if (typeof notificationSystem !== 'undefined') {
                notificationSystem.showNotification('Data exported successfully as CSV');
            }
        } else {
            if (typeof notificationSystem !== 'undefined') {
                notificationSystem.showNotification('No data available to export', 'warning');
            }
        }
    } catch (error) {
        console.error('Error exporting data as CSV:', error);
        if (typeof notificationSystem !== 'undefined') {
            notificationSystem.showNotification('Error exporting data. Please try again.', 'error');
        }
    } finally {
        if (typeof loadingSystem !== 'undefined') {
            loadingSystem.showElementLoader('exportCSVBtn', false);
        }
    }
}

/**
 * Export usage data as JSON
 */
function exportDataAsJSON() {
    if (typeof isAuthenticated === 'undefined' || !isAuthenticated) {
        if (typeof notificationSystem !== 'undefined') {
            notificationSystem.showNotification('Please log in to export data', 'error');
        }
        return;
    }
    
    try {
        if (typeof loadingSystem !== 'undefined') {
            loadingSystem.showElementLoader('exportJSONBtn', true);
        }
        
        const data = {
            user: typeof currentUser !== 'undefined' ? {
                name: currentUser.name,
                email: currentUser.email,
                dateJoined: currentUser.dateJoined
            } : {},
            settings: typeof settings !== 'undefined' ? settings : {},
            waterLogs: typeof getUserWaterLogs === 'function' ? getUserWaterLogs() : [],
            energyLogs: typeof getUserEnergyLogs === 'function' ? getUserEnergyLogs() : [],
            exportDate: new Date().toISOString(),
            period: {
                days: historyState.period.days,
                startDate: historyState.period.startDate,
                endDate: historyState.period.endDate
            }
        };
        
        if (typeof dataUtils !== 'undefined') {
            dataUtils.exportAsJSON(data);
        }
        if (typeof notificationSystem !== 'undefined') {
            notificationSystem.showNotification('Data exported successfully as JSON');
        }
    } catch (error) {
        console.error('Error exporting data as JSON:', error);
        if (typeof notificationSystem !== 'undefined') {
            notificationSystem.showNotification('Error exporting data. Please try again.', 'error');
        }
    } finally {
        if (typeof loadingSystem !== 'undefined') {
            loadingSystem.showElementLoader('exportJSONBtn', false);
        }
    }
}

/**
 * Update history dates based on current period
 */
function updateHistoryDates() {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - historyState.period.days);
    
    historyState.period.startDate = startDate;
    historyState.period.endDate = endDate;
    
    if (historyElements.historyCurrentDate) {
        const dateString = typeof formatUtils !== 'undefined' ? 
            formatUtils.formatDate(endDate, 'long') : 
            endDate.toLocaleDateString();
        historyElements.historyCurrentDate.textContent = dateString;
    }
}

/**
 * Update period text display
 */
function updatePeriodText() {
    const periodText = `Last ${historyState.period.days} days`;
    
    if (historyElements.historyPeriodText) {
        historyElements.historyPeriodText.textContent = periodText;
    }
    
    if (historyElements.pieChartPeriodDisplay) {
        historyElements.pieChartPeriodDisplay.textContent = periodText;
    }
}

/**
 * Move period backward in time
 */
function movePeriodBackward() {
    const newEndDate = new Date(historyState.period.startDate);
    const newStartDate = new Date(newEndDate);
    newStartDate.setDate(newEndDate.getDate() - historyState.period.days);
    
    historyState.period.startDate = newStartDate;
    historyState.period.endDate = newEndDate;
    
    if (historyElements.historyCurrentDate) {
        const dateString = typeof formatUtils !== 'undefined' ? 
            formatUtils.formatDate(newEndDate, 'long') : 
            newEndDate.toLocaleDateString();
        historyElements.historyCurrentDate.textContent = dateString;
    }
    
    updateHistoryData();
    setTimeout(() => {
        renderFixedPieChart();
        renderImprovedBarChart();
    }, 100);
}

/**
 * Move period forward in time
 */
function movePeriodForward() {
    const today = new Date();
    if (historyState.period.endDate >= today) {
        updateHistoryDates();
        updateHistoryData();
        setTimeout(() => {
            renderFixedPieChart();
            renderImprovedBarChart();
        }, 100);
        return;
    }
    
    const newStartDate = new Date(historyState.period.endDate);
    const newEndDate = new Date(newStartDate);
    newEndDate.setDate(newStartDate.getDate() + historyState.period.days);
    
    if (newEndDate > today) {
        newEndDate.setTime(today.getTime());
    }
    
    historyState.period.startDate = newStartDate;
    historyState.period.endDate = newEndDate;
    
    if (historyElements.historyCurrentDate) {
        const dateString = typeof formatUtils !== 'undefined' ? 
            formatUtils.formatDate(newEndDate, 'long') : 
            newEndDate.toLocaleDateString();
        historyElements.historyCurrentDate.textContent = dateString;
    }
    
    updateHistoryData();
    setTimeout(() => {
        renderFixedPieChart();
        renderImprovedBarChart();
    }, 100);
}

/**
 * Load logs for the selected period and update charts
 */
function updateHistoryData() {
    console.log('📊 Updating history data...');
    
    if (typeof currentUser === 'undefined' || !currentUser) {
        console.log('ℹ️ No user logged in, skipping data update');
        return;
    }
    
    const allWaterLogs = typeof getUserWaterLogs === 'function' ? getUserWaterLogs() : [];
    const allEnergyLogs = typeof getUserEnergyLogs === 'function' ? getUserEnergyLogs() : [];
    
    console.log(`📊 Raw logs: ${allWaterLogs.length} water, ${allEnergyLogs.length} energy`);
    
    // Filter by date range
    historyState.waterLogs = allWaterLogs.filter(log => {
        const logDate = new Date(log.date);
        return logDate >= historyState.period.startDate && logDate <= historyState.period.endDate;
    });
    
    historyState.energyLogs = allEnergyLogs.filter(log => {
        const logDate = new Date(log.date);
        return logDate >= historyState.period.startDate && logDate <= historyState.period.endDate;
    });
    
    console.log(`📊 Filtered logs: ${historyState.waterLogs.length} water, ${historyState.energyLogs.length} energy`);
    
    // Render logs and charts
    renderWaterLogs();
    renderEnergyLogs();
    
    // Render charts with delay to ensure data is ready
    setTimeout(() => {
        renderImprovedBarChart();
    }, 50);
}

/**
 * Filter and sort logs based on search and sort criteria
 */
function filterAndSortLogs(logs, filters) {
    let filteredLogs = logs;
    
    if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredLogs = logs.filter(log => 
            (log.notes && log.notes.toLowerCase().includes(searchTerm)) ||
            (log.date && log.date.includes(searchTerm)) ||
            (log.amount && log.amount.toString().includes(searchTerm))
        );
    }
    
    return filteredLogs.sort((a, b) => {
        switch(filters.sort) {
            case 'date-desc':
                return new Date(b.date) - new Date(a.date);
            case 'date-asc':
                return new Date(a.date) - new Date(b.date);
            case 'amount-desc':
                return b.amount - a.amount;
            case 'amount-asc':
                return a.amount - b.amount;
            default:
                return new Date(b.date) - new Date(a.date);
        }
    });
}

/**
 * Render water logs table
 */
function renderWaterLogs() {
    const filteredLogs = filterAndSortLogs(historyState.waterLogs, historyState.waterFilters);
    
    if (historyElements.waterLogsTableBody) {
        if (typeof domUtils !== 'undefined') {
            domUtils.clearElement(historyElements.waterLogsTableBody);
        } else {
            historyElements.waterLogsTableBody.innerHTML = '';
        }
    }
    
    if (filteredLogs.length === 0) {
        if (historyElements.waterLogsEmptyState) {
            historyElements.waterLogsEmptyState.style.display = 'flex';
        }
        if (historyElements.waterLogsTableBody?.parentElement) {
            historyElements.waterLogsTableBody.parentElement.style.display = 'none';
        }
        return;
    }
    
    if (historyElements.waterLogsEmptyState) {
        historyElements.waterLogsEmptyState.style.display = 'none';
    }
    if (historyElements.waterLogsTableBody?.parentElement) {
        historyElements.waterLogsTableBody.parentElement.style.display = 'block';
    }
    
    const fragment = document.createDocumentFragment();
    
    filteredLogs.forEach(log => {
        const row = document.createElement('tr');
        const logDate = new Date(log.date);
        const dateString = typeof formatUtils !== 'undefined' ? 
            formatUtils.formatDate(logDate) : 
            logDate.toLocaleDateString();
        
        row.innerHTML = `
            <td>${dateString}</td>
            <td>${log.amount.toFixed(1)}</td>
            <td>${log.notes || '-'}</td>
            <td>
                <button class="btn-icon edit-log-btn" data-id="${log.id}" data-type="water" title="Edit log">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        `;
        
        fragment.appendChild(row);
    });
    
    if (historyElements.waterLogsTableBody) {
        historyElements.waterLogsTableBody.appendChild(fragment);
    }
    
    document.querySelectorAll('#waterLogsTableBody .edit-log-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const logId = btn.getAttribute('data-id');
            const logType = btn.getAttribute('data-type');
            openEditLogModal(logId, logType);
        });
    });
}

/**
 * Render energy logs table
 */
function renderEnergyLogs() {
    const filteredLogs = filterAndSortLogs(historyState.energyLogs, historyState.energyFilters);
    
    if (historyElements.energyLogsTableBody) {
        if (typeof domUtils !== 'undefined') {
            domUtils.clearElement(historyElements.energyLogsTableBody);
        } else {
            historyElements.energyLogsTableBody.innerHTML = '';
        }
    }
    
    if (filteredLogs.length === 0) {
        if (historyElements.energyLogsEmptyState) {
            historyElements.energyLogsEmptyState.style.display = 'flex';
        }
        if (historyElements.energyLogsTableBody?.parentElement) {
            historyElements.energyLogsTableBody.parentElement.style.display = 'none';
        }
        return;
    }
    
    if (historyElements.energyLogsEmptyState) {
        historyElements.energyLogsEmptyState.style.display = 'none';
    }
    if (historyElements.energyLogsTableBody?.parentElement) {
        historyElements.energyLogsTableBody.parentElement.style.display = 'block';
    }
    
    const fragment = document.createDocumentFragment();
    
    filteredLogs.forEach(log => {
        const row = document.createElement('tr');
        const logDate = new Date(log.date);
        const dateString = typeof formatUtils !== 'undefined' ? 
            formatUtils.formatDate(logDate) : 
            logDate.toLocaleDateString();
        
        row.innerHTML = `
            <td>${dateString}</td>
            <td>${log.amount.toFixed(1)}</td>
            <td>${log.notes || '-'}</td>
            <td>
                <button class="btn-icon edit-log-btn" data-id="${log.id}" data-type="energy" title="Edit log">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        `;
        
        fragment.appendChild(row);
    });
    
    if (historyElements.energyLogsTableBody) {
        historyElements.energyLogsTableBody.appendChild(fragment);
    }
    
    document.querySelectorAll('#energyLogsTableBody .edit-log-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const logId = btn.getAttribute('data-id');
            const logType = btn.getAttribute('data-type');
            openEditLogModal(logId, logType);
        });
    });
}

// Event listeners - IMPORTANT: Keep existing functions that handle log editing
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM loaded, checking history page...');
    
    const historyPage = document.getElementById('historyPage');
    if (historyPage && historyPage.style.display !== 'none') {
        console.log('📊 History page is visible on DOM load');
        
        setTimeout(() => {
            historyPageInitialized = false;
            initHistoryPage();
        }, 300);
    } else {
        console.log('ℹ️ History page not visible on DOM load');
    }
});

// Export functions for use in other modules
if (typeof window !== 'undefined') {
    window.initHistoryPage = initHistoryPage;
    window.updateHistoryData = updateHistoryData;
    window.renderImprovedBarChart = renderImprovedBarChart;
    window.renderFixedPieChart = renderFixedPieChart;
    window.historyState = historyState;
    window.updateHistoryDataAndCharts = updateHistoryDataAndCharts;
    
    // IMPROVED: Bar Charts rendering functions
    window.renderCSSCharts = function() {
        renderFixedPieChart();
        renderImprovedBarChart();
    };
    
    // Legacy function names for compatibility
    window.renderCSSChart = renderImprovedBarChart;
    window.renderCSSPieChart = renderFixedPieChart;
    window.renderFixedLineChart = renderImprovedBarChart; // Replace line chart with bar chart
}