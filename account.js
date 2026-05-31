// Account Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeAccountPage();
    initializeDeleteModal();
    initializeEmailSupport();
    initializeMobileMenu();
});

function initializeAccountPage() {
    // Add smooth scroll reveal animations
    const cards = document.querySelectorAll('.account-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
}

function initializeDeleteModal() {
    const deleteBtn = document.getElementById('instantDeleteBtn');
    const modal = document.getElementById('deleteModal');
    const closeModal = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelDelete');
    const confirmBtn = document.getElementById('confirmDelete');
    const confirmInput = document.getElementById('confirmText');
    const errorDiv = document.getElementById('confirmError');

    if (!deleteBtn || !modal) return;

    // Open modal
    deleteBtn.addEventListener('click', () => {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        confirmInput.focus();
    });

    // Close modal
    function closeDeleteModal() {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
        confirmInput.value = '';
        confirmBtn.disabled = true;
        confirmBtn.classList.remove('loading');
        errorDiv.textContent = '';
    }

    closeModal.addEventListener('click', closeDeleteModal);
    cancelBtn.addEventListener('click', closeDeleteModal);

    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeDeleteModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeDeleteModal();
        }
    });

    // Validate confirmation input
    confirmInput.addEventListener('input', () => {
        const value = confirmInput.value.trim();
        const expectedText = 'DELETE MY ACCOUNT';
        
        if (value === expectedText) {
            confirmBtn.disabled = false;
            confirmBtn.classList.add('enabled');
            errorDiv.textContent = '';
            confirmInput.classList.remove('error');
        } else {
            confirmBtn.disabled = true;
            confirmBtn.classList.remove('enabled');
            if (value.length > 0) {
                errorDiv.textContent = 'Please type exactly: "DELETE MY ACCOUNT"';
                confirmInput.classList.add('error');
            } else {
                errorDiv.textContent = '';
                confirmInput.classList.remove('error');
            }
        }
    });

    // Handle account deletion
    confirmBtn.addEventListener('click', async () => {
        if (confirmBtn.disabled) return;

        confirmBtn.classList.add('loading');
        confirmBtn.disabled = true;

        try {
            // Simulate API call
            await simulateAccountDeletion();
            
            // Show success message
            showMessage('Account deleted successfully. You will be redirected shortly.', 'success');
            
            // Close modal and redirect
            setTimeout(() => {
                closeDeleteModal();
                window.location.href = 'index.html';
            }, 2000);

        } catch (error) {
            showMessage('Failed to delete account. Please try again or contact support.', 'error');
            confirmBtn.classList.remove('loading');
            confirmBtn.disabled = false;
        }
    });
}

function initializeEmailSupport() {
    const emailBtn = document.getElementById('emailSupportBtn');
    
    if (!emailBtn) return;
    
    emailBtn.addEventListener('click', () => {
        const subject = encodeURIComponent('Delete My FITNICE Account');
        const body = encodeURIComponent(`Hello FITNICE Support Team,

I would like to request the deletion of my FITNICE account.

Account Details:
- Email: [Your registered email address]
- Username: [Your username if applicable]

I understand that this action will permanently remove all my data including:
- Workout history and progress
- Meal plans and nutrition logs
- AI coaching preferences
- Personal settings and achievements

Please process this request and confirm when my account has been deleted.

Thank you,
[Your Name]`);

        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=tectra.ai@gmail.com&su=${subject}&body=${body}`;
        
        // Add button loading state
        emailBtn.classList.add('loading');
        emailBtn.innerHTML = `
            <div class="loading-spinner"></div>
            Opening Gmail...
        `;

        // Open Gmail
        window.open(gmailUrl, '_blank');

        // Reset button after a delay
        setTimeout(() => {
            emailBtn.classList.remove('loading');
            emailBtn.innerHTML = `
                <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,5.11 21.1,4 20,4Z"/>
                </svg>
                Email Support for Deletion
            `;
            showMessage('Gmail opened! Please send the pre-filled email to request account deletion.', 'success');
        }, 2000);
    });
}

function initializeMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const mobilePanel = document.getElementById('mobilePanel');

    if (!menuToggle || !mobilePanel) return;

    menuToggle.addEventListener('click', () => {
        mobilePanel.classList.toggle('open');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !mobilePanel.contains(e.target)) {
            mobilePanel.classList.remove('open');
        }
    });
}

async function simulateAccountDeletion() {
    // Simulate API call delay
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate random success/failure for demo
            if (Math.random() > 0.1) { // 90% success rate
                resolve();
            } else {
                reject(new Error('Deletion failed'));
            }
        }, 3000);
    });
}

function showMessage(text, type = 'info') {
    let container = document.getElementById('messageContainer');
    
    if (!container) {
        container = document.createElement('div');
        container.id = 'messageContainer';
        container.className = 'message-container';
        document.body.appendChild(container);
    }
    
    const message = document.createElement('div');
    message.className = `message ${type}`;
    
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
    message.innerHTML = `
        <span class="message-icon">${icon}</span>
        <span class="message-text">${text}</span>
        <button class="message-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    container.appendChild(message);
    
    // Trigger show animation
    setTimeout(() => message.classList.add('show'), 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (message.parentElement) {
            message.classList.remove('show');
            setTimeout(() => message.remove(), 300);
        }
    }, 5000);
}
