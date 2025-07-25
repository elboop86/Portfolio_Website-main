// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Toggle icon navbar
    const menuIcon = document.querySelector('#menu-icon');
    const navbar = document.querySelector('.navbar');

    if (menuIcon && navbar) {
        menuIcon.addEventListener('click', () => {
            menuIcon.classList.toggle('bx-x');
            navbar.classList.toggle('active');
        });
    }

    // Scroll sections and navigation
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('header nav a');
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');

    // Throttle function for better performance
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // Scroll handler
    const handleScroll = throttle(() => {
        const scrollY = window.scrollY;
        
        // Update active navigation links and animate sections
        sections.forEach(sec => {
            const top = scrollY;
            const offset = sec.offsetTop - 150;
            const height = sec.offsetHeight;
            const id = sec.getAttribute('id');

            if (top >= offset && top < offset + height) {
                // Active navbar links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });
                
                const activeLink = document.querySelector(`header nav a[href*="${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }

                // Active sections for animation on scroll
                sec.classList.add('show-animate');
            }
        });

        // Sticky header
        if (header) {
            header.classList.toggle('sticky', scrollY > 100);
        }

        // Remove toggle icon and navbar when scrolling
        if (menuIcon && navbar) {
            menuIcon.classList.remove('bx-x');
            navbar.classList.remove('active');
        }

        // Animation footer on scroll
        if (footer) {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            footer.classList.toggle('show-animate', 
                windowHeight + scrollTop >= documentHeight - 100
            );
        }
    }, 16); // ~60fps

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 100;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu after clicking
                if (menuIcon && navbar) {
                    menuIcon.classList.remove('bx-x');
                    navbar.classList.remove('active');
                }
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (menuIcon && navbar && 
            !menuIcon.contains(e.target) && 
            !navbar.contains(e.target) && 
            navbar.classList.contains('active')) {
            menuIcon.classList.remove('bx-x');
            navbar.classList.remove('active');
        }
    });

    // Form validation and submission
    const contactForm = document.querySelector('.contact form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const nombre = formData.get('nombre');
            const email = formData.get('email');
            const telefono = formData.get('telefono');
            const asunto = formData.get('asunto');
            const mensaje = formData.get('mensaje');
            
            // Basic validation
            if (!nombre || !email || !mensaje) {
                showNotification('Por favor, completa todos los campos obligatorios.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Por favor, introduce un email válido.', 'error');
                return;
            }
            
            // Create mailto link with form data
            const mailtoLink = `mailto:javi86medina@hotmail.com?subject=${encodeURIComponent(asunto || 'Contacto desde portfolio')}&body=${encodeURIComponent(
                `Nombre: ${nombre}\nEmail: ${email}\nTeléfono: ${telefono || 'No proporcionado'}\n\nMensaje:\n${mensaje}`
            )}`;
            
            window.location.href = mailtoLink;
            showNotification('Abriendo cliente de email...', 'success');
            
            // Reset form
            contactForm.reset();
        });
    }

    // Email validation function
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '5px',
            color: 'white',
            fontSize: '14px',
            zIndex: '9999',
            opacity: '0',
            transform: 'translateX(100%)',
            transition: 'all 0.3s ease',
            backgroundColor: type === 'error' ? '#e74c3c' : 
                           type === 'success' ? '#27ae60' : '#3498db'
        });
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Typing animation for home section
    const textAnimate = document.querySelector('.text-animate h2');
    if (textAnimate) {
        const text = textAnimate.textContent;
        textAnimate.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                textAnimate.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        // Start typing animation after page load
        setTimeout(typeWriter, 2000);
    }

    // Skills progress bar animation
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };

    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBars = entry.target.querySelectorAll('.progress .bar span');
                progressBars.forEach((bar, index) => {
                    setTimeout(() => {
                        bar.style.width = bar.parentElement.parentElement.querySelector('h4 span').textContent;
                    }, index * 200);
                });
            }
        });
    }, observerOptions);

    const skillsSection = document.querySelector('.skills');
    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }

    // Lazy loading for images
    const images = document.querySelectorAll('img');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        imageObserver.observe(img);
    });

    // Initialize animations on page load
    const homeSection = document.querySelector('.home');
    if (homeSection) {
        homeSection.classList.add('show-animate');
    }

    // Handle resize events
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Close mobile menu on resize
            if (window.innerWidth > 768 && menuIcon && navbar) {
                menuIcon.classList.remove('bx-x');
                navbar.classList.remove('active');
            }
        }, 250);
    });

    // Keyboard navigation support
    document.addEventListener('keydown', (e) => {
        // ESC key closes mobile menu
        if (e.key === 'Escape' && navbar && navbar.classList.contains('active')) {
            menuIcon.classList.remove('bx-x');
            navbar.classList.remove('active');
        }
    });

    // Performance optimization: Preload critical resources
    const preloadLinks = [
        'css/style2.css',
        'img/foto.png',
        'img/logo.jpg'
    ];

    preloadLinks.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = href;
        link.as = href.endsWith('.css') ? 'style' : 'image';
        document.head.appendChild(link);
    });

    console.log('Portfolio initialized successfully! 🚀');
});