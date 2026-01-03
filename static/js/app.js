// Global variables
let currentResults = null;
let currentSearchData = null;

// DOM elements
const searchForm = document.getElementById('searchForm');
const loadingSpinner = document.getElementById('loadingSpinner');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');
const resultsSection = document.getElementById('resultsSection');
const resultsBody = document.getElementById('resultsBody');
const resultsStats = document.getElementById('resultsStats');
const generateReportBtn = document.getElementById('generateReportBtn');

// Event listeners
searchForm.addEventListener('submit', handleSearch);
generateReportBtn.addEventListener('submit', handleGenerateReport);

// Handle search form submission
async function handleSearch(event) {
    event.preventDefault();
    
    const folderPath = document.getElementById('folderPath').value.trim();
    const searchStrings = document.getElementById('searchStrings').value.trim();
    
    // Hide previous messages and results
    hideElement(errorMessage);
    hideElement(successMessage);
    hideElement(resultsSection);
    showElement(loadingSpinner);
    generateReportBtn.disabled = true;
    
    try {
        const response = await fetch('/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                folder_path: folderPath,
                search_strings: searchStrings
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Search failed');
        }
        
        // Store current search data
        currentResults = data.results;
        currentSearchData = {
            folder_path: folderPath,
            search_strings: searchStrings
        };
        
        // Display results
        displayResults(data);
        generateReportBtn.disabled = false;
        
    } catch (error) {
        showError(error.message);
    } finally {
        hideElement(loadingSpinner);
    }
}

// Display search results
function displayResults(data) {
    // Clear previous results
    resultsBody.innerHTML = '';
    
    if (data.results.length === 0) {
        resultsBody.innerHTML = `
            <tr>
                <td colspan="3" style="text-align: center; padding: 30px; color: var(--text-secondary);">
                    No matches found. Try different search strings or folder path.
                </td>
            </tr>
        `;
    } else {
        data.results.forEach(result => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${escapeHtml(result.file_name)}</td>
                <td>${escapeHtml(result.string)}</td>
                <td>${result.count}</td>
            `;
            resultsBody.appendChild(row);
        });
    }
    
    // Update stats
    const totalCount = data.results.reduce((sum, r) => sum + r.count, 0);
    resultsStats.innerHTML = `
        <strong>${data.total_matches}</strong> matches found | 
        <strong>${totalCount}</strong> total occurrences
    `;
    
    showElement(resultsSection);
    
    // Smooth scroll to results
    setTimeout(() => {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

// Handle report generation
async function handleGenerateReport() {
    if (!currentSearchData) {
        showError('No search data available. Please perform a search first.');
        return;
    }
    
    hideElement(errorMessage);
    hideElement(successMessage);
    showElement(loadingSpinner);
    
    try {
        const response = await fetch('/generate-report', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(currentSearchData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Report generation failed');
        }
        
        showSuccess(`Report generated successfully: ${data.filename}`);
        
    } catch (error) {
        showError(error.message);
    } finally {
        hideElement(loadingSpinner);
    }
}

// Utility functions
function showElement(element) {
    element.classList.remove('hidden');
}

function hideElement(element) {
    element.classList.add('hidden');
}

function showError(message) {
    errorMessage.textContent = '⚠️ Error: ' + message;
    showElement(errorMessage);
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
        hideElement(errorMessage);
    }, 10000);
}

function showSuccess(message) {
    successMessage.textContent = '✓ ' + message;
    showElement(successMessage);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        hideElement(successMessage);
    }, 5000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add click event to generate report button
generateReportBtn.addEventListener('click', handleGenerateReport);
