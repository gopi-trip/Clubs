document.addEventListener('DOMContentLoaded', function() {
    // Get all form phases
    const phase1 = document.getElementById('phase1');
    const phase2 = document.getElementById('phase2');
    const phase3 = document.getElementById('phase3');
    
    // Get navigation buttons
    const phase1Next = document.getElementById('phase1Next');
    const phase2Next = document.getElementById('phase2Next');
    const phase2Back = document.getElementById('phase2Back');
    const phase3Back = document.getElementById('phase3Back');
    
    // Get progress elements
    const progressBar = document.getElementById('progressBar');
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const step3 = document.getElementById('step3');
    
    // Get form and error status elements
    const registrationForm = document.getElementById('registrationForm');
    const statusSuccess = document.getElementById('statusSuccess');
    const statusError = document.getElementById('statusError');
    const loadingSpinner = document.getElementById('loadingSpinner');
    
    // Show phase 1 initially
    phase1.classList.add('active');
    
    // Course type and semester relation
    const courseType = document.getElementById('courseType');
    const semester = document.getElementById('semester');
    const semesterLabel = document.querySelector('label[for="semester"]');
    
    courseType.addEventListener('change', function() {
        // Clear existing options except the first one
        while (semester.options.length > 1) {
            semester.remove(1);
        }
        
        // Change label and options based on course type
        if (this.value === 'phd') {
            // Change label to "Year" for PhD
            semesterLabel.textContent = 'Year*';
            semester.options[0].textContent = 'Select your current year';
            
            // Add year options for PhD (typically 1-5 years)
            for (let i = 1; i <= 5; i++) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = i;
                semester.appendChild(option);
            }
        } else {
            // Reset to "Semester" for other courses
            semesterLabel.textContent = 'Semester*';
            semester.options[0].textContent = 'Select your current semester';
            
            // Add appropriate semester options based on course type
            if (this.value === 'btech') {
                for (let i = 1; i <= 8; i++) {
                    const option = document.createElement('option');
                    option.value = i;
                    option.textContent = i;
                    semester.appendChild(option);
                }
            } else if (this.value === 'mtech' || this.value === 'msc') {
                for (let i = 1; i <= 4; i++) {
                    const option = document.createElement('option');
                    option.value = i;
                    option.textContent = i;
                    semester.appendChild(option);
                }
            }
        }
    });
    
    // File upload handling
    const idCardUpload = document.getElementById('idCardUpload');
    const fileChosen = document.getElementById('fileChosen');
    
    idCardUpload.addEventListener('change', function() {
        if (this.files.length > 0) {
            fileChosen.textContent = this.files[0].name;
        } else {
            fileChosen.textContent = 'No file chosen';
        }
    });
    
    // Phase navigation functions
    function goToPhase(phaseNumber) {
        // Hide all phases
        phase1.classList.remove('active');
        phase2.classList.remove('active');
        phase3.classList.remove('active');
        
        // Show the target phase
        if (phaseNumber === 1) {
            phase1.classList.add('active');
            progressBar.style.width = '33.33%';
            step1.classList.add('active');
            step2.classList.remove('active');
            step3.classList.remove('active');
        } else if (phaseNumber === 2) {
            phase2.classList.add('active');
            progressBar.style.width = '66.66%';
            step1.classList.add('active');
            step2.classList.add('active');
            step3.classList.remove('active');
        } else if (phaseNumber === 3) {
            phase3.classList.add('active');
            progressBar.style.width = '100%';
            step1.classList.add('active');
            step2.classList.add('active');
            step3.classList.add('active');
        }
    }
    
    // Phase 1 validation
    function validatePhase1() {
        let isValid = true;
        
        // Validate full name
        const fullName = document.getElementById('fullName');
        const nameError = document.getElementById('nameError');
        if (!fullName.value.trim()) {
            nameError.style.display = 'block';
            isValid = false;
        } else {
            nameError.style.display = 'none';
        }
        
        // Validate email
        const email = document.getElementById('email');
        const emailError = document.getElementById('emailError');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            emailError.style.display = 'block';
            isValid = false;
        } else {
            emailError.style.display = 'none';
        }
        
        // Validate phone
        const phone = document.getElementById('phone');
        const phoneError = document.getElementById('phoneError');
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone.value)) {
            phoneError.style.display = 'block';
            isValid = false;
        } else {
            phoneError.style.display = 'none';
        }
        
        // Validate clubs selection
        const clubCheckboxes = document.querySelectorAll('input[name="clubs"]');
        const clubsError = document.getElementById('clubsError');
        let clubSelected = false;
        
        clubCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                clubSelected = true;
            }
        });
        
        if (!clubSelected) {
            clubsError.style.display = 'block';
            isValid = false;
        } else {
            clubsError.style.display = 'none';
        }
        
        return isValid;
    }
    
    // Phase 2 validation
    function validatePhase2() {
        let isValid = true;
        
        // Validate course type
        const courseType = document.getElementById('courseType');
        const courseTypeError = document.getElementById('courseTypeError');
        if (!courseType.value) {
            courseTypeError.style.display = 'block';
            isValid = false;
        } else {
            courseTypeError.style.display = 'none';
        }
        
        // Validate branch
        const branch = document.getElementById('branch');
        const branchError = document.getElementById('branchError');
        if (!branch.value) {
            branchError.style.display = 'block';
            isValid = false;
        } else {
            branchError.style.display = 'none';
        }
        
        // Validate semester
        const semester = document.getElementById('semester');
        const semesterError = document.getElementById('semesterError');
        if (!semester.value) {
            semesterError.style.display = 'block';
            isValid = false;
        } else {
            semesterError.style.display = 'none';
        }
        
        // Validate enrollment number
        const enrollmentNumber = document.getElementById('enrollmentNumber');
        const enrollmentError = document.getElementById('enrollmentError');
        if (!enrollmentNumber.value.trim()) {
            enrollmentError.style.display = 'block';
            isValid = false;
        } else {
            enrollmentError.style.display = 'none';
        }
        
        return isValid;
    }
    
    // Phase 3 validation
    function validatePhase3() {
        let isValid = true;
        
        // Validate ID card upload
        const idCardUpload = document.getElementById('idCardUpload');
        const idCardError = document.getElementById('idCardError');
        if (!idCardUpload.files.length) {
            idCardError.style.display = 'block';
            isValid = false;
        } else {
            idCardError.style.display = 'none';
        }
        
        // Validate agreement checkbox
        const agreement = document.getElementById('agreement');
        const agreementError = document.getElementById('agreementError');
        if (!agreement.checked) {
            agreementError.style.display = 'block';
            isValid = false;
        } else {
            agreementError.style.display = 'none';
        }
        
        return isValid;
    }
    
    // Navigation button event listeners
    phase1Next.addEventListener('click', function() {
        if (validatePhase1()) {
            goToPhase(2);
        }
    });
    
    phase2Next.addEventListener('click', function() {
        if (validatePhase2()) {
            goToPhase(3);
        }
    });
    
    phase2Back.addEventListener('click', function() {
        goToPhase(1);
    });
    
    phase3Back.addEventListener('click', function() {
        goToPhase(2);
    });
    
    // Form submission handling
   // Form submission handling
registrationForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (validatePhase3()) {
        // Show loading spinner
        loadingSpinner.style.display = 'inline-block';
        
        // Get selected clubs
        const clubsChecked = [];
        document.querySelectorAll('input[name="clubs"]:checked').forEach(checkbox => {
            clubsChecked.push(checkbox.value);
        });
        
        // Prepare data for API
        const requestData = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            enrollmentNumber: document.getElementById('enrollmentNumber').value,
            clubs: clubsChecked
        };
        
        // Make API request
        fetch('/api/join-club', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        })
        .then(response => response.json())
        .then(data => {
            // Hide loading spinner
            loadingSpinner.style.display = 'none';
            
            if (data.success) {
                // Show success message
                statusSuccess.textContent = data.message || 'Your registration has been submitted successfully! Check your email for confirmation.';
                statusSuccess.style.display = 'block';
                
                // Redirect to home page after 3 seconds
                setTimeout(function() {
                    window.location.href = 'index.html';
                }, 3000);
            }
             else {
                // Show error message
                statusError.textContent = data.message || 'An error occurred while processing your request.';
                statusError.style.display = 'block';
            }
        })
        .catch(error => {
            // Hide loading spinner
            loadingSpinner.style.display = 'none';
            
            // Show error message
            statusError.textContent = 'An error occurred while connecting to the server.';
            statusError.style.display = 'block';
            console.error('Error:', error);
        });
    }
});
    
    // Add real-time validation for inputs
    const fullName = document.getElementById('fullName');
    fullName.addEventListener('input', function() {
        const nameError = document.getElementById('nameError');
        if (this.value.trim()) {
            nameError.style.display = 'none';
        }
    });
    
    const email = document.getElementById('email');
    email.addEventListener('input', function() {
        const emailError = document.getElementById('emailError');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(this.value)) {
            emailError.style.display = 'none';
        }
    });
    
    const phone = document.getElementById('phone');
    phone.addEventListener('input', function() {
        const phoneError = document.getElementById('phoneError');
        const phoneRegex = /^\d{10}$/;
        if (phoneRegex.test(this.value)) {
            phoneError.style.display = 'none';
        }
    });
    
    const clubCheckboxes = document.querySelectorAll('input[name="clubs"]');
    clubCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const clubsError = document.getElementById('clubsError');
            let clubSelected = false;
            
            clubCheckboxes.forEach(cb => {
                if (cb.checked) {
                    clubSelected = true;
                }
            });
            
            if (clubSelected) {
                clubsError.style.display = 'none';
            }
        });
    });
});