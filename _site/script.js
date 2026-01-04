/* ============================================
   VINTELER - Interactive Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavigation();
    initMobileMenu();
    initScrollAnimations();
    initContactForm();
    initGalleryHover();
    initZonesAccordion();
    initServiceModals();
    initMobileServicesAccordion();
    initZonesPicker(); // DRY: Externalized from index.html
    initMobileZonesPicker();
});

/* ============================================
   Navigation Scroll Effect
   ============================================ */

function initNavigation() {
    const nav = document.getElementById('nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add/remove scrolled class
        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                const navHeight = nav.offsetHeight;
                const targetPosition = target.offsetTop - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                document.querySelector('.nav-links')?.classList.remove('active');
            }
        });
    });
}

/* ============================================
   Mobile Menu Toggle
   ============================================ */

function initMobileMenu() {
    const toggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (toggle && navLinks) {
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            toggle.classList.toggle('active');
        });

        // Close menu when clicking on a nav link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                toggle.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                toggle.classList.remove('active');
            }
        });
    }
}

/* ============================================
   Scroll Animations
   ============================================ */

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Elements to animate
    const animateElements = document.querySelectorAll(
        '.service-card, .about-content, .about-images, .gallery-item, ' +
        '.zone-region, .trust-card, .contact-info, .contact-form-wrapper, ' +
        '.value-item, .guarantee-item'
    );

    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index % 6 * 0.1}s, transform 0.6s ease ${index % 6 * 0.1}s`;
        observer.observe(el);
    });

    // Add CSS for animated state
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

/* ============================================
   Contact Form Handling
   ============================================ */

function initContactForm() {
    const form = document.getElementById('contactForm');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            // Loading state
            submitBtn.innerHTML = `
                <svg class="spinner" viewBox="0 0 24 24" width="20" height="20">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" stroke-dasharray="60" stroke-linecap="round">
                        <animate attributeName="stroke-dashoffset" values="0;-120" dur="1.5s" repeatCount="indefinite"/>
                        <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/>
                    </circle>
                </svg>
                Envoi en cours...
            `;
            submitBtn.disabled = true;

            // Simulate form submission (replace with actual endpoint)
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Success state
            submitBtn.innerHTML = `
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                </svg>
                Message envoyé !
            `;
            submitBtn.style.background = '#4CAF50';

            // Reset form after delay
            setTimeout(() => {
                form.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);
        });

        // Real-time validation feedback
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                if (input.required && !input.value.trim()) {
                    input.style.borderColor = '#c45c3e';
                } else {
                    input.style.borderColor = '';
                }
            });

            input.addEventListener('input', () => {
                input.style.borderColor = '';
            });
        });
    }
}

/* ============================================
   Gallery Hover Effects
   ============================================ */

function initGalleryHover() {
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            // Add slight rotation for dynamic feel
            const rotation = (Math.random() - 0.5) * 2;
            item.style.transform = `translateY(-8px) rotate(${rotation}deg)`;
        });

        item.addEventListener('mouseleave', () => {
            item.style.transform = '';
        });
    });
}

/* ============================================
   Zones Accordion
   ============================================ */

function initZonesAccordion() {
    const accordions = document.querySelectorAll('.zone-accordion');

    if (!accordions.length) return;

    accordions.forEach(accordion => {
        const header = accordion.querySelector('.zone-accordion-header');

        if (!header) return;

        header.addEventListener('click', () => {
            // Close other accordions (optional - for single open mode)
            accordions.forEach(other => {
                if (other !== accordion && other.classList.contains('open')) {
                    other.classList.remove('open');
                }
            });

            // Toggle current accordion
            accordion.classList.toggle('open');
        });
    });
}

/* ============================================
   Phone Number Click Tracking
   ============================================ */

document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', () => {
        // Track phone clicks (integrate with analytics)
        console.log('Phone click tracked:', link.href);

        // Could send to Google Analytics:
        // gtag('event', 'click', { event_category: 'contact', event_label: 'phone' });
    });
});

/* ============================================
   Lazy Load Images (for future real images)
   ============================================ */

function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

/* ============================================
   Service Tags Interaction
   ============================================ */

document.querySelectorAll('.service-tag').forEach(tag => {
    tag.addEventListener('click', () => {
        // Scroll to contact form with pre-selected service
        const contactSection = document.getElementById('contact');
        const serviceSelect = document.getElementById('service');

        if (contactSection && serviceSelect) {
            // Map tag text to select option
            const tagText = tag.textContent.toLowerCase();
            const options = serviceSelect.options;

            for (let i = 0; i < options.length; i++) {
                if (options[i].text.toLowerCase().includes(tagText) ||
                    tagText.includes(options[i].value)) {
                    serviceSelect.selectedIndex = i;
                    break;
                }
            }

            // Scroll to contact
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

/* ============================================
   Parallax Effect for Hero (subtle)
   ============================================ */

let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.hero-bg');

            if (hero && scrolled < window.innerHeight) {
                hero.style.transform = `translateY(${scrolled * 0.3}px)`;
            }

            ticking = false;
        });

        ticking = true;
    }
});

/* ============================================
   Service Modals
   ============================================ */

function initServiceModals() {
    const modalOverlay = document.getElementById('serviceModal');
    const modalContent = document.getElementById('modalContent');
    const modalClose = modalOverlay?.querySelector('.modal-close');
    const serviceCards = document.querySelectorAll('.service-card[data-service]');

    if (!modalOverlay || !modalContent || !serviceCards.length) return;

    // Open modal when clicking service card
    serviceCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't open modal if clicking a link inside the card
            if (e.target.closest('a')) return;

            const serviceId = card.dataset.service;
            const template = document.getElementById(`modal-${serviceId}`);

            if (template) {
                // Clone template content into modal
                modalContent.innerHTML = '';
                modalContent.appendChild(template.content.cloneNode(true));

                // Open modal
                modalOverlay.classList.add('active');
                document.body.classList.add('modal-open');

                // Setup quote button to close modal and scroll to contact
                const quoteBtn = modalContent.querySelector('.modal-quote-btn');
                if (quoteBtn) {
                    quoteBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        closeModal();
                        setTimeout(() => {
                            const contactSection = document.getElementById('contact');
                            if (contactSection) {
                                contactSection.scrollIntoView({ behavior: 'smooth' });
                            }
                        }, 350);
                    });
                }
            }
        });
    });

    // Close modal function
    function closeModal() {
        modalOverlay.classList.remove('active');
        document.body.classList.remove('modal-open');
    }

    // Close on X button click
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    // Close on overlay click (outside modal)
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });
}

/* ============================================
   Mobile Services More Accordion
   ============================================ */

function initMobileServicesAccordion() {
    const servicesMore = document.getElementById('servicesMore');
    if (!servicesMore) return;

    const header = servicesMore.querySelector('.services-more-header');
    if (!header) return;

    // Only enable accordion behavior on mobile
    const isMobile = () => window.innerWidth <= 768;

    header.addEventListener('click', () => {
        if (!isMobile()) return;

        servicesMore.classList.toggle('open');
        const isOpen = servicesMore.classList.contains('open');
        header.setAttribute('aria-expanded', isOpen);
    });

    // Reset state on resize (if going from mobile to desktop)
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (!isMobile()) {
                servicesMore.classList.remove('open');
                header.setAttribute('aria-expanded', 'false');
            }
        }, 100);
    });
}

/* ============================================
   Zones Picker - Service & City Selection
   DRY: Externalized from index.html inline script
   ============================================ */

function initZonesPicker() {
    // Load cities data from embedded JSON
    const citiesDataEl = document.getElementById('cities-data');
    if (!citiesDataEl) return;

    let cities;
    try {
        cities = JSON.parse(citiesDataEl.textContent);
    } catch (e) {
        console.error('Failed to parse cities data:', e);
        return;
    }

    // Service Picker Elements
    const picker = document.getElementById('servicePicker');
    const trigger = document.getElementById('servicePickerTrigger');
    const panel = document.getElementById('servicePickerPanel');
    const cityPicker = document.getElementById('cityPicker');
    const cityInput = document.getElementById('zone-city-input');
    const suggestions = document.getElementById('city-suggestions');
    const ctaBox = document.getElementById('zones-cta-box');
    const devisBtn = document.getElementById('zones-devis-btn');
    const serviceNameEl = document.getElementById('zones-service-name');
    const cityNameEl = document.getElementById('zones-city-name');

    if (!picker || !trigger || !panel) return;

    let selectedService = null;
    let selectedCity = null;

    // Open/close panel
    function openPanel() {
        trigger.classList.add('active');
        panel.classList.add('active');
    }

    function closePanel() {
        trigger.classList.remove('active');
        panel.classList.remove('active');
        panel.querySelectorAll('.picker-category.open').forEach(cat => cat.classList.remove('open'));
    }

    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        panel.classList.contains('active') ? closePanel() : openPanel();
    });

    // Category accordion
    panel.querySelectorAll('.picker-category-header').forEach(header => {
        header.addEventListener('click', (e) => {
            e.stopPropagation();
            const category = header.closest('.picker-category');
            panel.querySelectorAll('.picker-category.open').forEach(cat => {
                if (cat !== category) cat.classList.remove('open');
            });
            category.classList.toggle('open');
        });
    });

    // Service selection
    panel.querySelectorAll('.picker-service').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            selectedService = { slug: btn.dataset.slug, name: btn.dataset.name };
            trigger.querySelector('.picker-label').textContent = selectedService.name;
            trigger.classList.add('selected');
            closePanel();
            cityPicker.classList.add('active');
            setTimeout(() => cityInput.focus(), 300);
            updateCTA();
        });
    });

    // Close panel on outside click
    document.addEventListener('click', (e) => {
        if (!picker.contains(e.target)) closePanel();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && panel.classList.contains('active')) closePanel();
    });

    // City autocomplete
    function filterCities(query) {
        if (!query || query.length < 2) return [];
        const q = query.toLowerCase();
        return cities.filter(city =>
            city.name.toLowerCase().includes(q) ||
            city.postalCodes.some(pc => pc.toString().startsWith(q))
        ).slice(0, 8);
    }

    function showSuggestions(filtered) {
        if (filtered.length === 0) {
            suggestions.innerHTML = '';
            suggestions.classList.remove('active');
            return;
        }
        suggestions.innerHTML = filtered.map(city =>
            `<div class="suggestion-item" data-id="${city.id}" data-name="${city.name}">
                <span class="suggestion-name">${city.name}</span>
                <span class="suggestion-region">${city.region}</span>
                <span class="suggestion-postal">${city.postalCodes.join(', ')}</span>
            </div>`
        ).join('');
        suggestions.classList.add('active');
    }

    function updateCTA() {
        if (selectedService && selectedCity) {
            serviceNameEl.textContent = selectedService.name;
            cityNameEl.textContent = selectedCity.name;
            devisBtn.href = '/' + selectedService.slug + '-' + selectedCity.id + '/#contact';
            ctaBox.classList.add('active');
        } else {
            ctaBox.classList.remove('active');
        }
    }

    cityInput.addEventListener('input', function() {
        showSuggestions(filterCities(this.value));
        selectedCity = null;
        updateCTA();
    });

    cityInput.addEventListener('focus', function() {
        if (this.value.length >= 2) showSuggestions(filterCities(this.value));
    });

    suggestions.addEventListener('click', function(e) {
        const item = e.target.closest('.suggestion-item');
        if (item) {
            selectedCity = cities.find(c => c.id === item.dataset.id);
            cityInput.value = item.dataset.name;
            suggestions.classList.remove('active');
            updateCTA();
        }
    });

    document.addEventListener('click', function(e) {
        if (!e.target.closest('.city-input-wrap') && !e.target.closest('.city-suggestions')) {
            suggestions.classList.remove('active');
        }
    });
}

/* ============================================
   Mobile Zones Picker - Fullscreen UX
   ============================================ */

function initMobileZonesPicker() {
    const zonesSection = document.getElementById('zones');
    const servicePicker = document.getElementById('servicePicker');
    const servicePickerTrigger = document.getElementById('servicePickerTrigger');
    const cityPicker = document.getElementById('cityPicker');
    const cityInput = document.getElementById('zone-city-input');

    if (!zonesSection || !servicePicker) return;

    const isMobile = () => window.innerWidth <= 768;

    // Service picker - fullscreen on mobile
    servicePickerTrigger?.addEventListener('click', () => {
        if (isMobile()) {
            zonesSection.classList.add('mobile-fullscreen');
            document.body.classList.add('zones-fullscreen-open');
        }
    });

    // City input - fullscreen on mobile
    cityInput?.addEventListener('focus', () => {
        if (isMobile()) {
            zonesSection.classList.add('mobile-fullscreen');
            document.body.classList.add('zones-fullscreen-open');
        }
    });

    // Close fullscreen when service is selected
    document.querySelectorAll('.picker-service').forEach(btn => {
        btn.addEventListener('click', () => {
            if (isMobile()) {
                setTimeout(() => {
                    zonesSection.classList.remove('mobile-fullscreen');
                    document.body.classList.remove('zones-fullscreen-open');
                }, 300);
            }
        });
    });

    // Close fullscreen when city is selected
    document.getElementById('city-suggestions')?.addEventListener('click', (e) => {
        if (e.target.closest('.suggestion-item') && isMobile()) {
            setTimeout(() => {
                zonesSection.classList.remove('mobile-fullscreen');
                document.body.classList.remove('zones-fullscreen-open');
            }, 300);
        }
    });

    // Add close button for mobile fullscreen
    const closeBtn = document.createElement('button');
    closeBtn.className = 'zones-fullscreen-close';
    closeBtn.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>';
    closeBtn.addEventListener('click', () => {
        zonesSection.classList.remove('mobile-fullscreen');
        document.body.classList.remove('zones-fullscreen-open');
    });
    zonesSection.insertBefore(closeBtn, zonesSection.firstChild);
}

