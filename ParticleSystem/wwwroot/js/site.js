const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
const particleCount = 200;
const gravity = 0.02;
const repulsionStrength = 10.0;
const attractionStrength = 0.78;
let mousePos = { x: canvas.width / 2, y: canvas.height / 2 };
let repulsionMode = false; // false for attraction, true for repulsion

// Particle class
class Particle {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = Math.random() * 2 - 1;
        this.vy = Math.random() * 2 - 1;
    }

    // Draw the particle on the canvas
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

        // Change color based on proximity to mouse
        const dx = mousePos.x - this.x;
        const dy = mousePos.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
            ctx.fillStyle = 'rgba(0, 255, 0, 0.8)'; // Green near the mouse
        } else {
            ctx.fillStyle = 'rgba(0, 150, 255, 0.8)'; // Default blue color
        }

        ctx.fill();
        ctx.closePath();
    }

    // Update the particle's position
    update() {
        const dx = mousePos.x - this.x;
        const dy = mousePos.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Apply attraction or repulsion based on mouse position
        if (distance < 150) {
            const force = (repulsionMode ? -1 * repulsionStrength : attractionStrength) / distance;
            this.vx += dx * force;
            this.vy += dy * force;
        }

        // Apply gravity
        this.vy += gravity;

        // Update position
        this.x += this.vx;
        this.y += this.vy;

        // Handle boundaries
        if (this.x - this.radius < 0 || this.x + this.radius > canvas.width) {
            this.vx *= -1;
        }
        if (this.y - this.radius < 0 || this.y + this.radius > canvas.height) {
            this.vy *= -1;
        }

        this.draw();
    }
}

// Initialize particles
function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        const radius = Math.random() * 5 + 2;
        const x = Math.random() * (canvas.width - 2 * radius) + radius;
        const y = Math.random() * (canvas.height - 2 * radius) + radius;
        particles.push(new Particle(x, y, radius));
    }
}

// Animation loop
function animate() {
    ctx.fillStyle = 'rgba(30, 30, 30, 0.2)'; // Slightly transparent black
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => particle.update());
    requestAnimationFrame(animate);
}

// Track mouse position
canvas.addEventListener('mousemove', (e) => {
    mousePos.x = e.offsetX;
    mousePos.y = e.offsetY;
});

// Toggle attraction and repulsion modes on click
canvas.addEventListener('click', () => {
    repulsionMode = !repulsionMode;
    const modeText = repulsionMode ? "Repulsion" : "Attraction";
    document.getElementById('modeText').innerText = `Mode: ${modeText}`;
});

// Start the animation
initParticles();
animate();
