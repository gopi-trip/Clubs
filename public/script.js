document.addEventListener('DOMContentLoaded', function() {
    // Modal elements
    const joinClubBtn = document.getElementById('joinClubBtn');
    const joinClubModal = document.getElementById('joinClubModal');
    const closeBtn = document.querySelector('.close-btn');
    const joinClubForm = document.getElementById('joinClubForm');
    
    // Status message elements
    const statusSuccess = document.getElementById('statusSuccess');
    const statusError = document.getElementById('statusError');
    const loadingSpinner = document.getElementById('loadingSpinner');
    
    // Error message elements
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const phoneError = document.getElementById('phoneError');
    const enrollmentError = document.getElementById('enrollmentError');
    const clubsError = document.getElementById('clubsError');
    
    // Form input elements
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const enrollmentInput = document.getElementById('enrollmentNumber');
    const clubCheckboxes = document.querySelectorAll('input[name="clubs"]');
    
    // NEW: Setup dropdown functionality
    const dropdownButtons = document.querySelectorAll('.dropbtn');
    
    dropdownButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Toggle the dropdown content visibility
            const dropdownContent = this.nextElementSibling;
            
            // Close all other open dropdowns first
            document.querySelectorAll('.dropdown-content').forEach(content => {
                if (content !== dropdownContent) {
                    content.classList.remove('show');
                }
            });
            
            // Toggle the current dropdown
            dropdownContent.classList.toggle('show');
        });
    });
    
    // Close dropdowns when clicking elsewhere on the page
    window.addEventListener('click', function(e) {
        if (!e.target.matches('.dropbtn')) {
            document.querySelectorAll('.dropdown-content').forEach(content => {
                if (content.classList.contains('show')) {
                    content.classList.remove('show');
                }
            });
        }
    });
    
    // Redirect to registration page when "Join a Club" button is clicked
    joinClubBtn.addEventListener('click', function(e) {
        window.location.href = './registration.html';
    });
    
    // Close modal when close button is clicked
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            joinClubModal.style.display = 'none';
            resetForm();
        });
    }
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function(e) {
        if (e.target === joinClubModal) {
            joinClubModal.style.display = 'none';
            resetForm();
        }
    });
    
    // Form submission handling
    if (joinClubForm) {
        joinClubForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Reset error messages
            hideAllErrors();
            
            // Validate form
            if (validateForm()) {
                submitForm();
            }
        });
    }
    
    // Form validation function
    function validateForm() {
        let isValid = true;
        
        // Validate full name
        if (!fullNameInput.value.trim()) {
            showError(nameError);
            isValid = false;
        }
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
            showError(emailError);
            isValid = false;
        }
        
        // Validate phone number
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phoneInput.value)) {
            showError(phoneError);
            isValid = false;
        }
        
        // Validate enrollment number
        if (!enrollmentInput.value.trim()) {
            showError(enrollmentError);
            isValid = false;
        }
        
        // Validate at least one club is selected
        let clubSelected = false;
        clubCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                clubSelected = true;
            }
        });
        
        if (!clubSelected) {
            showError(clubsError);
            isValid = false;
        }
        
        return isValid;
    }
    
    // Form submission function
    // Form submission function
function submitForm() {
    // Show loading spinner
    loadingSpinner.style.display = 'block';
    
    // Create FormData object for file upload
    const formData = new FormData();
    formData.append('fullName', fullNameInput.value);
    formData.append('email', emailInput.value);
    formData.append('phoneNumber', phoneInput.value);
    formData.append('enrollmentNumber', enrollmentInput.value);
    
    // Get the ID card file
    const idCardInput = document.getElementById('idCardInput');
    if (idCardInput && idCardInput.files.length > 0) {
        formData.append('idCard', idCardInput.files[0]);
    }
    
    // Get course details
    const courseTypeInput = document.getElementById('courseType');
    const semesterInput = document.getElementById('semester');
    const yearInput = document.getElementById('year');
    
    formData.append('courseType', courseTypeInput.value);
    formData.append('semester', semesterInput.value);
    formData.append('year', yearInput.value);
    
    // Get selected clubs
    Array.from(clubCheckboxes)
        .filter(checkbox => checkbox.checked)
        .forEach(checkbox => {
            formData.append('clubs', checkbox.value);
        });
    
    // Make API call
    fetch('/api/v1/users/register', {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header, it will be set automatically with boundary parameter
    })
    .then(async response => {
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || 'Registration failed');
        }
        return response.json();
    })
    .then(data => {
        // Hide loading spinner
        loadingSpinner.style.display = 'none';
        
        // Show success message
        statusSuccess.textContent = 'Your application has been submitted successfully!';
        statusSuccess.style.display = 'block';
        
        // Reset form after successful submission
        joinClubForm.reset();
        
        // Hide success message after 5 seconds
        setTimeout(function() {
            statusSuccess.style.display = 'none';
            joinClubModal.style.display = 'none';
        }, 5000);
    })
    .catch(error => {
        // Hide loading spinner
        loadingSpinner.style.display = 'none';
        
        // Show error message
        statusError.textContent = error.message;
        statusError.style.display = 'block';
        
        // Hide error message after 5 seconds
        setTimeout(function() {
            statusError.style.display = 'none';
        }, 5000);
    });
}
    
    // Helper functions for error handling
    function showError(errorElement) {
        errorElement.style.display = 'block';
    }
    
    function hideError(errorElement) {
        errorElement.style.display = 'none';
    }
    
    function hideAllErrors() {
        if (nameError) nameError.style.display = 'none';
        if (emailError) emailError.style.display = 'none';
        if (phoneError) phoneError.style.display = 'none';
        if (enrollmentError) enrollmentError.style.display = 'none';
        if (clubsError) clubsError.style.display = 'none';
        if (statusError) statusError.style.display = 'none';
        if (statusSuccess) statusSuccess.style.display = 'none';
    }
    
    function resetForm() {
        if (joinClubForm) joinClubForm.reset();
        hideAllErrors();
        if (loadingSpinner) loadingSpinner.style.display = 'none';
    }
    
    // Add input event listeners for real-time validation
    if (fullNameInput) {
        fullNameInput.addEventListener('input', () => {
            if (fullNameInput.value.trim()) {
                hideError(nameError);
            }
        });
    }
    
    if (emailInput) {
        emailInput.addEventListener('input', () => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailRegex.test(emailInput.value)) {
                hideError(emailError);
            }
        });
    }
    
    if (phoneInput) {
        phoneInput.addEventListener('input', () => {
            const phoneRegex = /^\d{10}$/;
            if (phoneRegex.test(phoneInput.value)) {
                hideError(phoneError);
            }
        });
    }
    
    if (enrollmentInput) {
        enrollmentInput.addEventListener('input', () => {
            if (enrollmentInput.value.trim()) {
                hideError(enrollmentError);
            }
        });
    }
    
    if (clubCheckboxes.length > 0) {
        clubCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                let clubSelected = false;
                clubCheckboxes.forEach(cb => {
                    if (cb.checked) {
                        clubSelected = true;
                    }
                });
                
                if (clubSelected) {
                    hideError(clubsError);
                }
            });
        });
    }

    // Gallery elements
    const galleryTrack = document.querySelector('.gallery-track');
    const slides = document.querySelectorAll('.gallery-slide');
    const indicators = document.querySelectorAll('.gallery-indicator');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    // Check if gallery elements exist before setting up functionality
    if (galleryTrack && slides.length > 0) {
        let currentSlide = 0;
        const slideCount = slides.length;
        
        // Function to update gallery position
        function updateGallery() {
            // Move the track
            galleryTrack.style.transform = `translateX(-${currentSlide * 100 / slideCount}%)`;
            
            // Update indicators
            document.querySelectorAll('.indicator').forEach((indicator, index) => {
                if (index === currentSlide) {
                    indicator.classList.add('active');
                } else {
                    indicator.classList.remove('active');
                }
            });
        }
        
        // Event listeners for controls
        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                currentSlide = (currentSlide - 1 + slideCount) % slideCount;
                updateGallery();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                currentSlide = (currentSlide + 1) % slideCount;
                updateGallery();
            });
        }
        
        // Add click events to indicators
        document.querySelectorAll('.indicator').forEach((indicator, index) => {
            indicator.addEventListener('click', function() {
                currentSlide = index;
                updateGallery();
            });
        });
        
        // Auto-advance slides every 5 seconds
        let slideInterval = setInterval(function() {
            currentSlide = (currentSlide + 1) % slideCount;
            updateGallery();
        }, 5000);
        
        // Pause auto-advance on mouse hover
        if (galleryTrack) {
            galleryTrack.addEventListener('mouseenter', function() {
                clearInterval(slideInterval);
            });
            
            // Resume auto-advance when mouse leaves
            galleryTrack.addEventListener('mouseleave', function() {
                slideInterval = setInterval(function() {
                    currentSlide = (currentSlide + 1) % slideCount;
                    updateGallery();
                }, 5000);
            });
        }
        
        // Initialize gallery
        updateGallery();
    }
});