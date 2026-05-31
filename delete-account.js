document.addEventListener('DOMContentLoaded', function() {
    initializeDeletePage();
    initializeMobileMenu();
});

function initializeDeletePage() {
    const emailBtn = document.getElementById('emailBtn');
    const openEmailBtn = document.getElementById('openEmailBtn');

    // Handle email button clicks
    if (emailBtn) {
        emailBtn.addEventListener('click', openGmailCompose);
    }

    if (openEmailBtn) {
        openEmailBtn.addEventListener('click', openGmailCompose);
    }

    // Add scroll animations
    animateOnScroll();
}

function openGmailCompose() {
    const subject = encodeURIComponent('Delete My FITNICE Account');
    const body = encodeURIComponent(`Hello FITNICE Support Team,

I am requesting the deletion of my FITNICE account.

Account Details:
- Email: [Please enter your registered email address here]
- Username: [Please enter your username if you have one]

I understand that this action will permanently remove all my data including:
- All workout history and progress data
- Meal plans and nutrition logs
- AI coaching preferences and history
- Personal settings and achievements
- Account information and login credentials

Please process this request and confirm when my account has been successfully deleted.

Thank you for your assistance.

Best regards,
[Your Name]`);

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=tectra.ai@gmail.com&su=${subject}&body=${body}`;
    
    // Add loading state to button
    const btn = document.getElementById('openEmailBtn');
    if (btn) {
        btn.classList.add('loading');
        btn.innerHTML = `
            <div class="loading-spinner"></div>
            Opening Gmail...
        `;
    }

    // Open Gmail
    window.open(gmailUrl, '_blank');

    // Reset button after delay
    setTimeout(() => {
        if (btn) {
            btn.classList.remove('loading');
            btn.innerHTML = `
                <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,5.11 21.1,4 20,4Z"/>
                </svg>
                Open Gmail & Send Request
            `;
        }
        showMessage('Gmail opened successfully! Please complete and send the email to request account deletion.', 'success');
    }, 2000);
}

function initializeMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const mobilePanel = document.getElementById('mobilePanel');

    if (menuToggle && mobilePanel) {
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
}

function animateOnScroll() {
    const elements = document.querySelectorAll('.delete-content > div');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(element);
    });
}

function showMessage(text, type = 'info') {
    // Create message container if it doesn't exist
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
