const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const navbar = document.getElementById('navbar');
const scrollTop = document.getElementById('scrollTop');
const contactForm = document.getElementById('contactForm');
const themeToggle = document.getElementById('themeToggle');
const langToggle = document.getElementById('langToggle');

let currentLang = 'en';
let currentTheme = 'light';

const savedTheme = localStorage.getItem('theme') || 'light';
const savedLang = localStorage.getItem('lang') || 'en';

document.documentElement.setAttribute('data-theme', savedTheme);
currentTheme = savedTheme;

if (savedLang === 'ar') {
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'ar');
    currentLang = 'ar';
    updateLanguage();
}

// Typing Animation
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Particle Animation
class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.opacity = Math.random() * 0.5 + 0.2;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x > this.canvas.width) this.x = 0;
        if (this.x < 0) this.x = this.canvas.width;
        if (this.y > this.canvas.height) this.y = 0;
        if (this.y < 0) this.y = this.canvas.height;
    }
    
    draw(ctx) {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 100;
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(canvas));
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw(ctx);
        });
        
        // Draw connections
        particles.forEach((p1, i) => {
            particles.slice(i + 1).forEach(p2 => {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 * (1 - distance / 100)})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}


themeToggle.addEventListener('click', () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
});

langToggle.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    
    if (currentLang === 'ar') {
        document.documentElement.setAttribute('dir', 'rtl');
        document.documentElement.setAttribute('lang', 'ar');
    } else {
        document.documentElement.setAttribute('dir', 'ltr');
        document.documentElement.setAttribute('lang', 'en');
    }
    
    localStorage.setItem('lang', currentLang);
    updateLanguage();
});

function updateLanguage() {
    document.querySelectorAll('[data-en]').forEach(element => {
        const enText = element.getAttribute('data-en');
        const arText = element.getAttribute('data-ar');
        element.textContent = currentLang === 'en' ? enText : arText;
    });
    
    document.querySelectorAll('[data-placeholder-en]').forEach(element => {
        const enText = element.getAttribute('data-placeholder-en');
        const arText = element.getAttribute('data-placeholder-ar');
        element.placeholder = currentLang === 'en' ? enText : arText;
    });
}

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 70,
                behavior: 'smooth'
            });
            navMenu.classList.remove('active');
        }
    });
});

let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
                scrollTop.classList.add('visible');
            } else {
                navbar.classList.remove('scrolled');
                scrollTop.classList.remove('visible');
            }
            ticking = false;
        });
        ticking = true;
    }
});

scrollTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = currentLang === 'en' 
        ? 'Thank you for your message! I will get back to you soon.' 
        : 'شكرا لرسالتك! سأعود إليك قريبا.';
    alert(message);
    contactForm.reset();
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            if (entry.target.classList.contains('skill')) {
                const progressBar = entry.target.querySelector('.skill-progress');
                if (progressBar) {
                    const progress = progressBar.getAttribute('data-progress');
                    progressBar.style.width = progress + '%';
                }
            }
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.project-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease';
    observer.observe(card);
});

document.querySelectorAll('.social-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.8s ease';
    observer.observe(card);
});

document.querySelectorAll('.skill').forEach(skill => {
    observer.observe(skill);
});

document.addEventListener('DOMContentLoaded', () => {
    const logo = document.querySelector('.logo');
    logo.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Initialize particle animation
    initParticles();
    
    // Typing animation for hero title
    const heroTitle = document.getElementById('heroTitle');
    if (heroTitle) {
        setTimeout(() => {
            typeWriter(heroTitle, 'ANEXX', 150);
        }, 500);
    }
    
    // Social Card Click to Expand Effect
    const socialCards = document.querySelectorAll('.social-card');
    let activeCard = null;
    
    socialCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't trigger if clicking on a link
            if (e.target.tagName === 'A' || e.target.closest('a')) {
                return;
            }
            
            // Add ripple effect
            card.classList.add('clicked');
            setTimeout(() => {
                card.classList.remove('clicked');
            }, 600);
            
            // If this card is already active, deactivate it
            if (activeCard === card) {
                card.classList.remove('active');
                activeCard = null;
            } else {
                // Deactivate previous card
                if (activeCard) {
                    activeCard.classList.remove('active');
                }
                // Activate this card
                card.classList.add('active');
                activeCard = card;
            }
        });
    });
    
    
    document.addEventListener('click', (e) => {
        if (activeCard && !e.target.closest('.social-card')) {
            activeCard.classList.remove('active');
            activeCard = null;
        }
    });
});

const loaderBar = document.getElementById("loader-bar");

let loadProgress = 0;

const fakeLoad = setInterval(() => {
    loadProgress += Math.random() * 20;
    if (loadProgress >= 100) {
        loadProgress = 100;
        clearInterval(fakeLoad);
        setTimeout(() => {
            loaderBar.style.opacity = "0";
        }, 300);
    }
    loaderBar.style.width = loadProgress + "%";
}, 200);
const revealElements = document.querySelectorAll(
    ".project-card, .social-card, .skill, section h2"
);

revealElements.forEach(el => el.classList.add("reveal"));

const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }
    });
}, { threshold: 0.15 });

revealElements.forEach(el => revealObserver.observe(el));
  
document.addEventListener("DOMContentLoaded", () => {
    const dot = document.querySelector(".cursor-dot");
    const outline = document.querySelector(".cursor-outline");

    let mouseX = 0;
    let mouseY = 0;

    let outlineX = 0;
    let outlineY = 0;

    window.addEventListener("mousemove", e => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        dot.style.left = mouseX + "px";
        dot.style.top = mouseY + "px";
    });

    function animate() {
        outlineX += (mouseX - outlineX) * 0.12;
        outlineY += (mouseY - outlineY) * 0.12;

        outline.style.left = outlineX + "px";
        outline.style.top = outlineY + "px";

        requestAnimationFrame(animate);
    }

    animate();
});


window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    setTimeout(() => {
        loader.style.opacity = "0";
        setTimeout(() => loader.style.display = "none", 500);
    }, 800);
});


document.querySelectorAll(".project-card").forEach(card => {
    card.addEventListener("mousemove", e => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--x", e.clientX - rect.left + "px");
        card.style.setProperty("--y", e.clientY - rect.top + "px");
    });
});

const particles = document.querySelectorAll(".particle");

particles.forEach(p => {
    let x = Math.random() * 2 - 1;
    let y = Math.random() * 2 - 1;

    setInterval(() => {
        p.style.transform = `translate(${x}px, ${y}px)`;
        x += Math.random() * 2 - 1;
        y += Math.random() * 2 - 1;
    }, 100);
});






