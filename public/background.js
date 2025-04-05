// Enhanced background.js with mouse interaction
document.addEventListener('DOMContentLoaded', function() {
    // Create canvas element for the background animation
    const canvas = document.createElement('canvas');
    canvas.id = 'background-canvas';
    
    // Style the canvas to be fixed in the background
    Object.assign(canvas.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        zIndex: '-1',
        pointerEvents: 'none'
    });
    
    // Insert the canvas as the first element in the body
    document.body.insertBefore(canvas, document.body.firstChild);
    
    // Initialize the canvas and context
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions to match window
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    // Call resize on init and when window is resized
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Mouse position tracking
    let mouse = {
        x: null,
        y: null,
        radius: 150
    };
    
    window.addEventListener('mousemove', function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
    });
    
    // Particle class
    class Particle {
        constructor() {
            this.reset();
            // Initial position distributed across the screen
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
        }
        
        reset() {
            // Spawn particles from edges sometimes for a better flow
            if (Math.random() > 0.5) {
                // Spawn from edges
                const side = Math.floor(Math.random() * 4);
                switch(side) {
                    case 0: // top
                        this.x = Math.random() * canvas.width;
                        this.y = 0;
                        break;
                    case 1: // right
                        this.x = canvas.width;
                        this.y = Math.random() * canvas.height;
                        break;
                    case 2: // bottom
                        this.x = Math.random() * canvas.width;
                        this.y = canvas.height;
                        break;
                    case 3: // left
                        this.x = 0;
                        this.y = Math.random() * canvas.height;
                        break;
                }
            } else {
                // Spawn randomly
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
            }
            
            this.baseSize = Math.random() * 5 + 1;
            this.size = this.baseSize;
            this.baseSpeedX = (Math.random() - 0.5) * 2;
            this.baseSpeedY = (Math.random() - 0.5) * 2;
            this.speedX = this.baseSpeedX;
            this.speedY = this.baseSpeedY;
            this.color = this.getColor();
            this.opacity = Math.random() * 0.5 + 0.2;
            
            // Add slight variance to each particle
            this.oscillationSpeed = Math.random() * 0.05;
            this.oscillationAmplitude = Math.random() * 0.5;
            this.timeOffset = Math.random() * 100;
        }
        
        getColor() {
            // NIT Manipur theme colors
            const colors = [
                '#FF5964', // primary-color
                '#003366', // secondary-color
                '#004488', // secondary-light
                '#ff6600'  // accent-color
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }
        
        update() {
            // Mouse interaction - particles are attracted to the mouse position
            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouse.radius) {
                    // Particles within the mouse radius are affected
                    const force = (mouse.radius - distance) / mouse.radius;
                    const directionX = dx / distance || 0;
                    const directionY = dy / distance || 0;
                    
                    // Apply force to the particle
                    this.speedX += directionX * force * 0.5;
                    this.speedY += directionY * force * 0.5;
                    
                    // Particles grow slightly when near the mouse
                    this.size = this.baseSize * (1 + force * 0.5);
                } else {
                    // Gradually return to base speed and size
                    this.speedX = this.speedX * 0.98 + this.baseSpeedX * 0.02;
                    this.speedY = this.speedY * 0.98 + this.baseSpeedY * 0.02;
                    this.size = this.size * 0.95 + this.baseSize * 0.05;
                }
            }
            
            // Add slight oscillation for organic movement
            this.speedX += Math.sin(Date.now() * this.oscillationSpeed + this.timeOffset) * this.oscillationAmplitude * 0.01;
            this.speedY += Math.cos(Date.now() * this.oscillationSpeed + this.timeOffset) * this.oscillationAmplitude * 0.01;
            
            // Apply speed limits
            this.speedX = Math.max(-3, Math.min(3, this.speedX));
            this.speedY = Math.max(-3, Math.min(3, this.speedY));
            
            // Update position
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Reset if particle goes off screen with some margin
            const margin = 50;
            if (this.x < -margin || this.x > canvas.width + margin || 
                this.y < -margin || this.y > canvas.height + margin) {
                this.reset();
            }
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }
    
    // Initialize particles array
    const particles = [];
    const particleCount = Math.min(120, Math.floor(window.innerWidth / 15)); 
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    // Connect particles with lines if they're close enough
    function connectParticles() {
        const maxDistance = 150;
        
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxDistance) {
                    // Calculate opacity based on distance
                    const opacity = 1 - (distance / maxDistance);
                    
                    ctx.beginPath();
                    // Use gradient for connection lines
                    const gradient = ctx.createLinearGradient(
                        particles[i].x, particles[i].y, 
                        particles[j].x, particles[j].y
                    );
                    gradient.addColorStop(0, particles[i].color.replace(')', `, ${opacity * 0.2})`).replace('rgb', 'rgba'));
                    gradient.addColorStop(1, particles[j].color.replace(')', `, ${opacity * 0.2})`).replace('rgb', 'rgba'));
                    
                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = Math.min(particles[i].size, particles[j].size) * 0.2;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    // Animation loop
    function animate() {
        // Clear canvas with semi-transparent background for trail effect
        ctx.fillStyle = 'rgba(245, 245, 245, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw all particles
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        
        // Connect particles with lines
        connectParticles();
        
        // Continue animation loop
        requestAnimationFrame(animate);
    }
    
    // Start animation
    animate();
    
    // Reset mouse position when mouse leaves window
    window.addEventListener('mouseout', function() {
        mouse.x = null;
        mouse.y = null;
    });
});