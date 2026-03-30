// Fireworks Display Application

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Configuration
let config = {
    autoMode: false,
    frequency: 5,
    explosionType: 'random',
    volume: 0.5,
    gravity: 0.15,
    friction: 0.99
};

// Arrays to store fireworks and particles
let fireworks = [];
let particles = [];

// Audio context for sound effects
let audioContext;
let masterGain;

// Initialize audio
function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        masterGain = audioContext.createGain();
        masterGain.connect(audioContext.destination);
        masterGain.gain.value = config.volume;
    }
}

// Generate launch sound
function playLaunchSound() {
    if (!audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(masterGain);
    
    oscillator.frequency.setValueAtTime(100, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

// Generate explosion sound based on firework size
function playExplosionSound(size = 'medium') {
    if (!audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();
    const noiseGain = audioContext.createGain();
    
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(masterGain);
    
    let duration, startFreq, endFreq, volume, filterFreq;
    
    if (size === 'small') {
        // Small pop sound
        duration = 0.15;
        startFreq = 300;
        endFreq = 100;
        volume = 0.25;
        filterFreq = 1500;
        oscillator.type = 'sine';
    } else if (size === 'large') {
        // Large BOOM sound
        duration = 0.6;
        startFreq = 150;
        endFreq = 30;
        volume = 0.7;
        filterFreq = 3000;
        oscillator.type = 'sawtooth';
        
        // Add noise for extra impact
        const bufferSize = audioContext.sampleRate * duration;
        const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        const noise = audioContext.createBufferSource();
        noise.buffer = noiseBuffer;
        noise.connect(noiseGain);
        noiseGain.connect(masterGain);
        noiseGain.gain.setValueAtTime(0.15, audioContext.currentTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        noise.start(audioContext.currentTime);
        noise.stop(audioContext.currentTime + duration);
    } else {
        // Medium bang sound
        duration = 0.3;
        startFreq = 220;
        endFreq = 60;
        volume = 0.4;
        filterFreq = 2000;
        oscillator.type = 'sawtooth';
    }
    
    oscillator.frequency.setValueAtTime(startFreq, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(endFreq, audioContext.currentTime + duration);
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(filterFreq, audioContext.currentTime);
    filter.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + duration);
    
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}

// Firework class
class Firework {
    constructor(x, y, targetX, targetY, type, size = null) {
        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.type = type;
        
        // Determine firework size (10% large, 30% small, 60% medium)
        if (!size) {
            const rand = Math.random();
            if (rand < 0.1) {
                this.size = 'large';
            } else if (rand < 0.4) {
                this.size = 'small';
            } else {
                this.size = 'medium';
            }
        } else {
            this.size = size;
        }
        
        // Calculate initial velocity for ballistic arc
        const dx = targetX - x;
        const dy = targetY - y;
        
        // Adjust velocity based on size
        let baseVelocity;
        if (this.size === 'large') {
            baseVelocity = -18; // Highest
        } else if (this.size === 'small') {
            baseVelocity = -12; // Lowest
        } else {
            baseVelocity = -16; // Medium
        }
        
        this.vy = baseVelocity - Math.random() * 2;
        
        // Horizontal velocity to reach target X position
        const timeToTarget = Math.abs(this.vy / config.gravity);
        this.vx = dx / timeToTarget;
        
        this.trail = [];
        this.exploded = false;
        this.hue = Math.random() * 360;
        this.peakReached = false;
    }
    
    update() {
        // Apply gravity for realistic ballistic motion
        this.vy += config.gravity;
        
        // Update position
        this.x += this.vx;
        this.y += this.vy;
        
        // Add trail
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > 15) {
            this.trail.shift();
        }
        
        // Check if reached peak of arc (velocity becomes positive = falling)
        if (!this.peakReached && this.vy >= 0) {
            this.peakReached = true;
        }
        
        // Explode at or near peak of arc
        if (this.peakReached && this.vy >= -0.5) {
            this.explode();
            return false;
        }
        
        // Also explode if goes off screen
        if (this.y < 0 || this.y > canvas.height || this.x < 0 || this.x > canvas.width) {
            return false;
        }
        
        return true;
    }
    
    draw() {
        // Draw trail
        if (this.trail.length > 0) {
            ctx.beginPath();
            ctx.moveTo(this.trail[0].x, this.trail[0].y);
            
            for (let i = 1; i < this.trail.length; i++) {
                ctx.lineTo(this.trail[i].x, this.trail[i].y);
            }
            
            ctx.strokeStyle = `hsl(${this.hue}, 100%, 60%)`;
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        // Draw firework
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${this.hue}, 100%, 70%)`;
        ctx.fill();
    }
    
    explode() {
        if (this.exploded) return;
        this.exploded = true;
        
        const explosionType = this.type === 'random'
            ? ['burst', 'ring', 'heart', 'star', 'willow', 'palm'][Math.floor(Math.random() * 6)]
            : this.type;
        
        // Hearts always get the large boom sound
        const soundSize = explosionType === 'heart' ? 'large' : this.size;
        playExplosionSound(soundSize);
        
        switch (explosionType) {
            case 'burst':
                this.createBurst();
                break;
            case 'ring':
                this.createRing();
                break;
            case 'heart':
                this.createHeart();
                break;
            case 'star':
                this.createStar();
                break;
            case 'willow':
                this.createWillow();
                break;
            case 'palm':
                this.createPalm();
                break;
        }
    }
    
    createBurst() {
        const sizeMultiplier = this.size === 'large' ? 2 : this.size === 'small' ? 0.6 : 1;
        const particleCount = Math.floor((100 + Math.random() * 50) * sizeMultiplier);
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const speed = (2 + Math.random() * 4) * (this.size === 'large' ? 1.3 : this.size === 'small' ? 0.7 : 1);
            particles.push(new Particle(
                this.x, this.y,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed,
                this.hue
            ));
        }
    }
    
    createRing() {
        const sizeMultiplier = this.size === 'large' ? 1.5 : this.size === 'small' ? 0.7 : 1;
        const particleCount = Math.floor(80 * sizeMultiplier);
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const speed = (3 + Math.random() * 2) * (this.size === 'large' ? 1.3 : this.size === 'small' ? 0.7 : 1);
            particles.push(new Particle(
                this.x, this.y,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed,
                this.hue,
                'ring'
            ));
        }
    }
    
    createHeart() {
        const sizeMultiplier = this.size === 'large' ? 1.5 : this.size === 'small' ? 0.7 : 1;
        const particleCount = Math.floor(100 * sizeMultiplier);
        for (let i = 0; i < particleCount; i++) {
            const t = (i / particleCount) * Math.PI * 2;
            const x = 16 * Math.pow(Math.sin(t), 3);
            const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
            
            const speed = 0.3 * (this.size === 'large' ? 1.3 : this.size === 'small' ? 0.7 : 1);
            particles.push(new Particle(
                this.x, this.y,
                x * speed,
                y * speed,
                0, // Red hue for heart
                'heart'
            ));
        }
    }
    
    createStar() {
        const points = 5;
        const sizeMultiplier = this.size === 'large' ? 1.5 : this.size === 'small' ? 0.7 : 1;
        const particleCount = Math.floor(100 * sizeMultiplier);
        
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const pointAngle = (Math.PI * 2 / points);
            const baseRadius = (i % (particleCount / points) < (particleCount / points / 2)) ? 3 : 1.5;
            const radius = baseRadius * (this.size === 'large' ? 1.3 : this.size === 'small' ? 0.7 : 1);
            
            particles.push(new Particle(
                this.x, this.y,
                Math.cos(angle) * radius,
                Math.sin(angle) * radius,
                45, // Gold hue for star
                'star'
            ));
        }
    }
    
    createWillow() {
        const sizeMultiplier = this.size === 'large' ? 1.5 : this.size === 'small' ? 0.7 : 1;
        const particleCount = Math.floor(120 * sizeMultiplier);
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const speed = (1 + Math.random() * 2) * (this.size === 'large' ? 1.3 : this.size === 'small' ? 0.7 : 1);
            particles.push(new Particle(
                this.x, this.y,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed + 1, // Extra downward velocity
                this.hue,
                'willow'
            ));
        }
    }
    
    createPalm() {
        const sizeMultiplier = this.size === 'large' ? 1.5 : this.size === 'small' ? 0.7 : 1;
        const branches = Math.floor(8 * sizeMultiplier);
        const particlesPerBranch = Math.floor(15 * sizeMultiplier);
        
        for (let i = 0; i < branches; i++) {
            const angle = (Math.PI * 2 * i) / branches;
            
            for (let j = 0; j < particlesPerBranch; j++) {
                const speed = (2 + (j / particlesPerBranch) * 3) * (this.size === 'large' ? 1.3 : this.size === 'small' ? 0.7 : 1);
                particles.push(new Particle(
                    this.x, this.y,
                    Math.cos(angle) * speed,
                    Math.sin(angle) * speed,
                    this.hue,
                    'palm'
                ));
            }
        }
    }
}

// Particle class
class Particle {
    constructor(x, y, vx, vy, hue, type = 'normal') {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.hue = hue;
        this.type = type;
        this.alpha = 1;
        this.decay = 0.015 + Math.random() * 0.01;
        this.size = 2 + Math.random() * 2;
        this.gravity = type === 'willow' ? 0.08 : 0.05;
    }
    
    update() {
        this.vx *= config.friction;
        this.vy *= config.friction;
        this.vy += this.gravity;
        
        this.x += this.vx;
        this.y += this.vy;
        
        this.alpha -= this.decay;
        
        return this.alpha > 0;
    }
    
    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${this.hue}, 100%, 60%)`;
        ctx.fill();
        
        // Add glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = `hsl(${this.hue}, 100%, 60%)`;
        ctx.fill();
        
        ctx.restore();
    }
}

// Launch a firework
function launchFirework() {
    initAudio();
    playLaunchSound();
    
    const startX = Math.random() * canvas.width;
    const startY = canvas.height;
    const targetX = canvas.width * 0.2 + Math.random() * canvas.width * 0.6;
    const targetY = canvas.height * 0.1 + Math.random() * canvas.height * 0.4; // Explode in upper 50% of screen
    
    fireworks.push(new Firework(startX, startY, targetX, targetY, config.explosionType));
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Create fade effect
    ctx.fillStyle = 'rgba(0, 4, 40, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw fireworks
    fireworks = fireworks.filter(firework => {
        firework.draw();
        return firework.update();
    });
    
    // Update and draw particles
    particles = particles.filter(particle => {
        particle.draw();
        return particle.update();
    });
    
    // Auto mode
    if (config.autoMode && Math.random() < config.frequency / 100) {
        launchFirework();
    }
}

// Event listeners
document.getElementById('launchBtn').addEventListener('click', launchFirework);

document.getElementById('autoBtn').addEventListener('click', function() {
    config.autoMode = !config.autoMode;
    this.classList.toggle('active');
    this.textContent = config.autoMode ? '⏸️ Stop Auto' : '⚡ Auto Mode';
});

document.getElementById('clearBtn').addEventListener('click', function() {
    particles = [];
    fireworks = [];
});

document.getElementById('frequency').addEventListener('input', function() {
    config.frequency = parseInt(this.value);
    document.getElementById('freqValue').textContent = this.value;
});

document.getElementById('explosionType').addEventListener('change', function() {
    config.explosionType = this.value;
});

document.getElementById('volume').addEventListener('input', function() {
    config.volume = parseInt(this.value) / 100;
    document.getElementById('volumeValue').textContent = this.value + '%';
    if (masterGain) {
        masterGain.gain.value = config.volume;
    }
});

// Handle window resize
window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Click to launch
canvas.addEventListener('click', function(e) {
    initAudio();
    playLaunchSound();
    
    const startX = e.clientX;
    const startY = canvas.height;
    const targetX = e.clientX;
    const targetY = e.clientY;
    
    fireworks.push(new Firework(startX, startY, targetX, targetY, config.explosionType));
});

// Start animation
animate();

// Made with Bob
