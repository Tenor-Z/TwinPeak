// DOM Elements
const loginContainer = document.getElementById('login-container');
const dashboardContainer = document.getElementById('dashboard-container');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const errorMessage = document.getElementById('error-message');
const logoutBtn = document.getElementById('logout-btn');
const employeeForm = document.getElementById('employee-form');
const employeeTableBody = document.getElementById('employee-table-body');
const searchInput = document.getElementById('search-input');
const employeeCount = document.getElementById('employee-count');
const emptyState = document.getElementById('empty-state');
const emptyStateMessage = document.getElementById('empty-state-message');
const employeeTableContainer = document.getElementById('employee-table-container');
const deleteModal = document.getElementById('delete-modal');
const deleteMessage = document.getElementById('delete-message');
const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
const toast = document.getElementById('toast');
const toastTitle = document.getElementById('toast-title');
const toastMessage = document.getElementById('toast-message');
const toastClose = document.getElementById('toast-close');
const formTabBtn = document.getElementById('form-tab-btn');
const formTitle = document.getElementById('form-title');
const formDescription = document.getElementById('form-description');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const currentYearElement = document.getElementById('current-year');
const settingsTabBtn = document.getElementById('settings-tab-btn');
const settingsHeaderBtn = document.getElementById('settings-header-btn');
const exportBtn = document.getElementById('export-btn');
const backupEmployeeCount = document.getElementById('backup-employee-count');
const backupDate = document.getElementById('backup-date');
const credentialsForm = document.getElementById('credentials-form');

// Form fields
const employeeIdField = document.getElementById('employee-id');
const nameField = document.getElementById('name');
const emailField = document.getElementById('email');
const phoneField = document.getElementById('phone');
const jobField = document.getElementById('job');
const addressField = document.getElementById('address');
const cityField = document.getElementById('city');

// Credentials form fields
const currentPasswordField = document.getElementById('current-password');
const newUsernameField = document.getElementById('new-username');
const newPasswordField = document.getElementById('new-password');
const confirmPasswordField = document.getElementById('confirm-password');

// Form error elements
const nameError = document.getElementById('name-error');
const emailError = document.getElementById('email-error');
const phoneError = document.getElementById('phone-error');
const jobError = document.getElementById('job-error');
const addressError = document.getElementById('address-error');
const cityError = document.getElementById('city-error');

// Credentials form error elements
const currentPasswordError = document.getElementById('current-password-error');
const newUsernameError = document.getElementById('new-username-error');
const newPasswordError = document.getElementById('new-password-error');
const confirmPasswordError = document.getElementById('confirm-password-error');

// State
let employees = [];
let currentEmployeeId = null;
let employeeToDelete = null;
let credentials = {
    username: 'admin',
    password: 'admin'
};
let lastBackupDate = null;

// Initialize the application
function init() {
    // Load employees from localStorage
    loadEmployees();
    
    // Load credentials from localStorage
    loadCredentials();
    
    // Set up event listeners
    setupEventListeners();
    
    // Update UI
    updateEmployeeTable();
    updateBackupInfo();
    
    // Set current year in footer
    currentYearElement.textContent = new Date().getFullYear();
}

// Load employees from localStorage
function loadEmployees() {
    const storedEmployees = localStorage.getItem('employees');
    if (storedEmployees) {
        try {
            employees = JSON.parse(storedEmployees);
        } catch (error) {
            console.error('Failed to parse employees from localStorage:', error);
            showToast('Error', 'Failed to load employee data', 'error');
        }
    }
}

// Load credentials from localStorage
function loadCredentials() {
    const storedCredentials = localStorage.getItem('credentials');
    if (storedCredentials) {
        try {
            credentials = JSON.parse(storedCredentials);
        } catch (error) {
            console.error('Failed to parse credentials from localStorage:', error);
        }
    }
    
    // Load last backup date
    const storedBackupDate = localStorage.getItem('lastBackupDate');
    if (storedBackupDate) {
        lastBackupDate = new Date(storedBackupDate);
    }
}

// Save employees to localStorage
function saveEmployees() {
    localStorage.setItem('employees', JSON.stringify(employees));
}

// Save credentials to localStorage
function saveCredentials() {
    localStorage.setItem('credentials', JSON.stringify(credentials));
}

// Set up event listeners
function setupEventListeners() {
    // Login form submission
    loginForm.addEventListener('submit', handleLogin);
    
    // Logout button
    logoutBtn.addEventListener('click', handleLogout);
    
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
    
    // Settings header button
    settingsHeaderBtn.addEventListener('click', () => {
        switchTab('settings');
    });
    
    // Employee form submission
    employeeForm.addEventListener('submit', handleEmployeeFormSubmit);
    
    // Cancel button
    cancelBtn.addEventListener('click', resetForm);
    
    // Search input
    searchInput.addEventListener('input', updateEmployeeTable);
    
    // Delete modal buttons
    cancelDeleteBtn.addEventListener('click', () => {
        deleteModal.classList.remove('active');
    });
    
    confirmDeleteBtn.addEventListener('click', confirmDeleteEmployee);
    
    // Toast close button
    toastClose.addEventListener('click', () => {
        toast.classList.remove('active');
    });
    
    // Export button
    exportBtn.addEventListener('click', exportToCSV);
    
    // Credentials form submission
    credentialsForm.addEventListener('submit', handleCredentialsFormSubmit);
}

// Handle login form submission
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Simple validation
    if (!username || !password) {
        showLoginError('Please enter both username and password');
        return;
    }
    
    // Check credentials
    if (username === credentials.username && password === credentials.password) {
        // Hide login container and show dashboard
        loginContainer.style.display = 'none';
        dashboardContainer.style.display = 'block';
        
        // Clear login form
        loginForm.reset();
        hideLoginError();
    } else {
        showLoginError('Invalid username or password');
    }
}

// Handle logout
function handleLogout() {
    // Hide dashboard and show login container
    dashboardContainer.style.display = 'none';
    loginContainer.style.display = 'flex';
    
    // Clear any error messages
    hideLoginError();
}

// Show login error
function showLoginError(message) {
    loginError.style.display = 'flex';
    errorMessage.textContent = message;
}

// Hide login error
function hideLoginError() {
    loginError.style.display = 'none';
    errorMessage.textContent = '';
}

// Switch between tabs
function switchTab(tabId) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        if (btn.getAttribute('data-tab') === tabId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        if (content.id === `${tabId}-tab`) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });
    
    // Update backup info when switching to settings tab
    if (tabId === 'settings') {
        updateBackupInfo();
    }
}

// Handle employee form submission
function handleEmployeeFormSubmit(e) {
    e.preventDefault();
    
    // Clear previous errors
    clearFormErrors();
    
    // Get form values
    const employee = {
        name: nameField.value.trim(),
        email: emailField.value.trim(),
        phone: phoneField.value.trim(),
        job: jobField.value.trim(),
        address: addressField.value.trim(),
        city: cityField.value.trim()
    };
    
    // Validate form
    if (!validateEmployeeForm(employee)) {
        return;
    }
    
    if (currentEmployeeId) {
        // Update existing employee
        updateEmployee(currentEmployeeId, employee);
        showToast('Success', 'Employee updated successfully');
    } else {
        // Add new employee
        addEmployee(employee);
        showToast('Success', 'Employee added successfully');
    }
    
    // Reset form and switch to employees tab
    resetForm();
    switchTab('employees');
}

// Handle credentials form submission
function handleCredentialsFormSubmit(e) {
    e.preventDefault();
    
    // Clear previous errors
    clearCredentialsFormErrors();
    
    // Get form values
    const currentPassword = currentPasswordField.value;
    const newUsername = newUsernameField.value.trim();
    const newPassword = newPasswordField.value;
    const confirmPassword = confirmPasswordField.value;
    
    // Validate current password
    if (currentPassword !== credentials.password) {
        currentPasswordError.textContent = 'Current password is incorrect';
        return;
    }
    
    // Validate new username
    if (!newUsername || newUsername.length < 3) {
        newUsernameError.textContent = 'Username must be at least 3 characters';
        return;
    }
    
    // Validate new password
    if (!newPassword || newPassword.length < 4) {
        newPasswordError.textContent = 'Password must be at least 4 characters';
        return;
    }
    
    // Validate password confirmation
    if (newPassword !== confirmPassword) {
        confirmPasswordError.textContent = 'Passwords do not match';
        return;
    }
    
    // Update credentials
    credentials = {
        username: newUsername,
        password: newPassword
    };
    
    // Save to localStorage
    saveCredentials();
    
    // Reset form
    credentialsForm.reset();
    
    // Show success message
    showToast('Success', 'Login credentials updated successfully');
}

// Clear credentials form errors
function clearCredentialsFormErrors() {
    currentPasswordError.textContent = '';
    newUsernameError.textContent = '';
    newPasswordError.textContent = '';
    confirmPasswordError.textContent = '';
}

// Validate employee form
function validateEmployeeForm(employee) {
    let isValid = true;
    
    // Name validation
    if (!employee.name || employee.name.length < 2) {
        nameError.textContent = 'Name must be at least 2 characters';
        isValid = false;
    }
    
    // Email validation
    if (!employee.email || !isValidEmail(employee.email)) {
        emailError.textContent = 'Please enter a valid email address';
        isValid = false;
    }
    
    // Phone validation
    if (!employee.phone || !isValidPhone(employee.phone)) {
        phoneError.textContent = 'Phone number must be between 10-14 digits';
        isValid = false;
    }
    
    // Job validation
    if (!employee.job || employee.job.length < 2) {
        jobError.textContent = 'Job title must be at least 2 characters';
        isValid = false;
    }
    
    // Address validation
    if (!employee.address || employee.address.length < 5) {
        addressError.textContent = 'Address must be at least 5 characters';
        isValid = false;
    }
    
    // City validation
    if (!employee.city || employee.city.length < 2) {
        cityError.textContent = 'City must be at least 2 characters';
        isValid = false;
    }
    
    return isValid;
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone validation helper
function isValidPhone(phone) {
    const phoneRegex = /^\d{10,14}$/;
    return phoneRegex.test(phone);
}

// Clear form errors
function clearFormErrors() {
    nameError.textContent = '';
    emailError.textContent = '';
    phoneError.textContent = '';
    jobError.textContent = '';
    addressError.textContent = '';
    cityError.textContent = '';
}

// Add a new employee
function addEmployee(employee) {
    // Generate a unique ID
    const id = generateId();
    
    // Check if phone number already exists
    const phoneExists = employees.some(emp => emp.phone === employee.phone);
    if (phoneExists) {
        showToast('Error', 'An employee with this phone number already exists', 'error');
        phoneError.textContent = 'Phone number already exists';
        return false;
    }
    
    // Add employee to array
    employees.push({
        id,
        ...employee
    });
    
    // Save to localStorage
    saveEmployees();
    
    // Update UI
    updateEmployeeTable();
    
    return true;
}

// Update an existing employee
function updateEmployee(id, updatedEmployee) {
    // Find the employee index
    const index = employees.findIndex(emp => emp.id === id);
    
    if (index !== -1) {
        // Check if phone number already exists (excluding the current employee)
        const phoneExists = employees.some(emp => emp.phone === updatedEmployee.phone && emp.id !== id);
        if (phoneExists) {
            showToast('Error', 'An employee with this phone number already exists', 'error');
            phoneError.textContent = 'Phone number already exists';
            return false;
        }
        
        // Update the employee
        employees[index] = {
            ...employees[index],
            ...updatedEmployee
        };
        
        // Save to localStorage
        saveEmployees();
        
        // Update UI
        updateEmployeeTable();
        
        return true;
    }
    
    return false;
}

// Delete an employee
function deleteEmployee(id) {
    // Find the employee index
    const index = employees.findIndex(emp => emp.id === id);
    
    if (index !== -1) {
        // Remove the employee
        employees.splice(index, 1);
        
        // Save to localStorage
        saveEmployees();
        
        // Update UI
        updateEmployeeTable();
        
        return true;
    }
    
    return false;
}

// Show delete confirmation modal
function showDeleteConfirmation(employee) {
    employeeToDelete = employee;
    deleteMessage.textContent = `Are you sure you want to delete ${employee.name}? This action cannot be undone.`;
    deleteModal.classList.add('active');
}

// Confirm employee deletion
function confirmDeleteEmployee() {
    if (employeeToDelete) {
        deleteEmployee(employeeToDelete.id);
        showToast('Success', 'Employee deleted successfully');
        deleteModal.classList.remove('active');
        employeeToDelete = null;
    }
}

// Edit an employee
function editEmployee(id) {
    // Find the employee
    const employee = employees.find(emp => emp.id === id);
    
    if (employee) {
        // Set current employee ID
        currentEmployeeId = id;
        
        // Fill form fields
        employeeIdField.value = id;
        nameField.value = employee.name;
        emailField.value = employee.email;
        phoneField.value = employee.phone;
        jobField.value = employee.job;
        addressField.value = employee.address;
        cityField.value = employee.city;
        
        // Update form title and button
        formTitle.textContent = 'Edit Employee';
        formDescription.textContent = 'Update employee information';
        submitBtn.textContent = 'Update Employee';
        formTabBtn.textContent = 'Edit Employee';
        
        // Switch to form tab
        switchTab('form');
    }
}

// Reset the form
function resetForm() {
    // Clear form fields
    employeeForm.reset();
    employeeIdField.value = '';
    
    // Clear current employee ID
    currentEmployeeId = null;
    
    // Reset form title and button
    formTitle.textContent = 'Add New Employee';
    formDescription.textContent = 'Enter details to add a new employee';
    submitBtn.textContent = 'Add Employee';
    formTabBtn.textContent = 'Add Employee';
    
    // Clear form errors
    clearFormErrors();
    
    // Switch to employees tab
    switchTab('employees');
}

// Update the employee table
function updateEmployeeTable() {
    const searchTerm = searchInput.value.toLowerCase();
    
    // Filter employees based on search term
    const filteredEmployees = employees.filter(employee => {
        return (
            employee.name.toLowerCase().includes(searchTerm) ||
            employee.email.toLowerCase().includes(searchTerm) ||
            employee.job.toLowerCase().includes(searchTerm) ||
            employee.phone.includes(searchTerm)
        );
    });
    
    // Update employee count
    employeeCount.textContent = `${filteredEmployees.length} ${filteredEmployees.length === 1 ? 'employee' : 'employees'}`;
    
    // Clear table body
    employeeTableBody.innerHTML = '';
    
    // Show empty state if no employees
    if (filteredEmployees.length === 0) {
        emptyState.style.display = 'flex';
        emptyStateMessage.textContent = searchTerm 
            ? 'No employees match your search criteria' 
            : 'Add your first employee to get started';
    } else {
        emptyState.style.display = 'none';
        
        // Add employees to table
        filteredEmployees.forEach(employee => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${employee.name}</td>
                <td class="hide-mobile">${employee.email}</td>
                <td>${employee.phone}</td>
                <td class="hide-mobile">${employee.job}</td>
                <td class="hide-mobile">${employee.address}</td>
                <td class="hide-mobile">${employee.city}</td>
                <td>
                    <div class="table-actions">
                        <button class="action-btn edit" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" title="Delete">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </td>
            `;
            
            // Add event listeners to action buttons
            const editBtn = row.querySelector('.edit');
            const deleteBtn = row.querySelector('.delete');
            
            editBtn.addEventListener('click', () => editEmployee(employee.id));
            deleteBtn.addEventListener('click', () => showDeleteConfirmation(employee));
            
            employeeTableBody.appendChild(row);
        });
    }
}

// Update backup info
function updateBackupInfo() {
    backupEmployeeCount.textContent = employees.length;
    
    if (lastBackupDate) {
        backupDate.textContent = formatDate(lastBackupDate);
    } else {
        backupDate.textContent = 'Never';
    }
}

// Format date
function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

// Export employees to CSV
function exportToCSV() {
    if (employees.length === 0) {
        showToast('Error', 'No employees to export', 'error');
        return;
    }
    
    // CSV header
    let csvContent = 'Name,Email,Phone,Job,Address,City\n';
    
    // Add employee data
    employees.forEach(employee => {
        // Escape commas in fields
        const escapedName = `"${employee.name.replace(/"/g, '""')}"`;
        const escapedEmail = `"${employee.email.replace(/"/g, '""')}"`;
        const escapedJob = `"${employee.job.replace(/"/g, '""')}"`;
        const escapedAddress = `"${employee.address.replace(/"/g, '""')}"`;
        const escapedCity = `"${employee.city.replace(/"/g, '""')}"`;
        
        csvContent += `${escapedName},${escapedEmail},${employee.phone},${escapedJob},${escapedAddress},${escapedCity}\n`;
    });
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // Set link properties
    link.setAttribute('href', url);
    link.setAttribute('download', `twinpeak_employees_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.display = 'none';
    
    // Add link to document, click it, and remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Update last backup date
    lastBackupDate = new Date();
    localStorage.setItem('lastBackupDate', lastBackupDate.toISOString());
    
    // Update backup info
    updateBackupInfo();
    
    // Show success message
    showToast('Success', 'Employee data exported successfully');
}

// Show toast notification
function showToast(title, message, type = 'success') {
    toastTitle.textContent = title;
    toastMessage.textContent = message;
    
    // Set icon based on type
    const icon = toast.querySelector('.toast-icon i');
    if (type === 'success') {
        icon.className = 'fas fa-check-circle';
        icon.style.color = 'var(--success)';
    } else if (type === 'error') {
        icon.className = 'fas fa-exclamation-circle';
        icon.style.color = 'var(--destructive)';
    }
    
    // Show toast
    toast.classList.add('active');
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('active');
    }, 3000);
}

// Generate a unique ID
function generateId() {
    return Math.random().toString(36).substring(2, 9);
}

// Initialize the application
document.addEventListener('DOMContentLoaded', init);