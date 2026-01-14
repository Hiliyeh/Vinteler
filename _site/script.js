/* ============================================
   VINTELER - Interactive Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initDynamicYears(); // Update years on all pages
    initNavigation();
    initMobileMenu();
    initScrollAnimations();
    initContactForm();
    initMobileServicesAccordion();
    initZonesPicker(); // DRY: Externalized from index.html
    initZonesPickerInternal(); // Variant for internal service pages
    initZonesPickerUniversal(); // Universal component for all pages
    initMobileZonesPicker();
    initHeroPremium(); // Premium hero animations
});

/* ============================================
   Dynamic Years - Auto-update since 2014
   ============================================ */

// Calculate years since founding (2014)
function getYearsSinceFounding() {
    const foundingYear = 2014;
    const currentYear = new Date().getFullYear();
    return currentYear - foundingYear;
}

function initDynamicYears() {
    const yearsExperience = getYearsSinceFounding();

    // Update all elements with dynamic years class (format: "12+")
    document.querySelectorAll('.dynamic-years').forEach(el => {
        el.textContent = yearsExperience + '+';
    });

    // Update nav badge (format: "+12 ans")
    document.querySelectorAll('.dynamic-years-badge').forEach(el => {
        el.textContent = '+' + yearsExperience + ' ans';
    });

    // Update text spans (format: "+12")
    document.querySelectorAll('.dynamic-years-text').forEach(el => {
        el.textContent = '+' + yearsExperience;
    });
}

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

    // Check URL parameter for pre-selected service
    const urlParams = new URLSearchParams(window.location.search);
    const preSelectedSlug = urlParams.get('service');

    if (preSelectedSlug) {
        // Find the service button with matching slug
        const serviceBtn = panel.querySelector(`.picker-service[data-slug="${preSelectedSlug}"]`);
        if (serviceBtn) {
            // Simulate selection
            selectedService = { slug: serviceBtn.dataset.slug, name: serviceBtn.dataset.name };
            trigger.querySelector('.picker-label').textContent = selectedService.name;
            trigger.classList.add('selected');
            cityPicker.classList.add('active');
            // Focus on city input after a short delay
            setTimeout(() => cityInput.focus(), 500);
        }
    }

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
            // Scroll CTA into view on mobile after animation
            if (window.innerWidth <= 768) {
                setTimeout(() => {
                    ctaBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 450);
            }
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

    // Close fullscreen when city is selected - but keep it open longer to show CTA
    document.getElementById('city-suggestions')?.addEventListener('click', (e) => {
        if (e.target.closest('.suggestion-item') && isMobile()) {
            // Don't close fullscreen - let user see the CTA buttons
            // User can close manually with close button or by clicking a CTA
        }
    });

    // Close fullscreen when CTA button is clicked
    document.querySelectorAll('.zones-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (isMobile()) {
                zonesSection.classList.remove('mobile-fullscreen');
                document.body.classList.remove('zones-fullscreen-open');
            }
        });
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

/* ============================================
   Hero Premium - Trust Animations
   ============================================ */

function initHeroPremium() {
    const heroPremium = document.querySelector('.hero-premium');
    if (!heroPremium) return;

    // Update stat card with experience years (dynamic)
    const yearsExperience = getYearsSinceFounding();
    const experienceCard = document.querySelector('.stat-card[data-experience]');
    if (experienceCard) {
        experienceCard.dataset.count = yearsExperience;
    }

    // Animate stat counters
    const statCards = document.querySelectorAll('.stat-card');

    const animateCounter = (element, target, suffix = '') => {
        const countElement = element.querySelector('.stat-card__count');
        if (!countElement) return;

        const duration = 2000;
        const startTime = performance.now();
        const startValue = 0;

        // Easing function for smooth animation
        const easeOutQuart = t => 1 - Math.pow(1 - t, 4);

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutQuart(progress);
            const currentValue = Math.round(startValue + (target - startValue) * easedProgress);

            countElement.textContent = currentValue;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                countElement.textContent = target;
            }
        };

        requestAnimationFrame(updateCounter);
    };

    // Intersection Observer for stat cards
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                const target = parseInt(card.dataset.count, 10);

                // Start counter animation
                setTimeout(() => {
                    animateCounter(card, target);
                    card.classList.add('animated');
                }, 200);

                statsObserver.unobserve(card);
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '0px'
    });

    statCards.forEach(card => {
        statsObserver.observe(card);
    });

    // Parallax effect for floating elements (subtle)
    const floats = document.querySelectorAll('.hero-premium__float');

    if (floats.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollY = window.pageYOffset;
                    const heroHeight = heroPremium.offsetHeight;

                    if (scrollY < heroHeight) {
                        const progress = scrollY / heroHeight;

                        floats.forEach((float, index) => {
                            const speed = 0.1 + (index * 0.05);
                            const yOffset = scrollY * speed;
                            float.style.transform = `translateY(${yOffset}px)`;
                        });
                    }

                    ticking = false;
                });

                ticking = true;
            }
        });
    }

    // CTA button ripple effect
    const primaryBtn = document.querySelector('.btn-premium--primary');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.className = 'btn-ripple';

            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${e.clientX - rect.left - size/2}px;
                top: ${e.clientY - rect.top - size/2}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: rippleEffect 0.6s ease-out;
                pointer-events: none;
            `;

            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    }
}

/* ============================================
   Zones Picker Internal - For Service Pages
   Pre-selects current service, allows city change
   ============================================ */

function initZonesPickerInternal() {
    // Load cities data (try internal first, then fallback)
    const citiesDataEl = document.getElementById('cities-data-internal') || document.getElementById('cities-data');
    if (!citiesDataEl) return;

    let cities;
    try {
        cities = JSON.parse(citiesDataEl.textContent);
    } catch (e) {
        console.error('Failed to parse cities data:', e);
        return;
    }

    // Elements with -internal suffix
    const picker = document.getElementById('servicePickerInternal');
    const trigger = document.getElementById('servicePickerTriggerInternal');
    const panel = document.getElementById('servicePickerPanelInternal');
    const cityPicker = document.getElementById('cityPickerInternal');
    const cityInput = document.getElementById('zone-city-input-internal');
    const suggestions = document.getElementById('city-suggestions-internal');
    const ctaBox = document.getElementById('zones-cta-box-internal');
    const devisBtn = document.getElementById('zones-devis-btn-internal');
    const serviceNameEl = document.getElementById('zones-service-name-internal');
    const cityNameEl = document.getElementById('zones-city-name-internal');

    if (!picker || !trigger || !panel || !cityInput) return;

    // Pre-selected values from data attributes
    let selectedService = {
        slug: trigger.dataset.preselectedSlug,
        name: trigger.dataset.preselectedName
    };
    let selectedCity = null;
    const currentCityId = cityInput.dataset.currentCityId;
    const currentCityName = cityInput.dataset.currentCity;

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

            // Update service name in CTA
            if (serviceNameEl) serviceNameEl.textContent = selectedService.name;

            // Reset city selection when service changes
            selectedCity = null;
            cityInput.value = '';
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
        suggestions.innerHTML = filtered.map(city => {
            const isCurrent = city.id === currentCityId;
            return `<div class="suggestion-item${isCurrent ? ' suggestion-current' : ''}" data-id="${city.id}" data-name="${city.name}">
                <span class="suggestion-name">${city.name}</span>
                <span class="suggestion-region">${city.region}</span>
                ${isCurrent ? '<span class="suggestion-current-badge">actuelle</span>' : `<span class="suggestion-postal">${city.postalCodes.slice(0, 2).join(', ')}</span>`}
            </div>`;
        }).join('');
        suggestions.classList.add('active');
    }

    function updateCTA() {
        if (selectedService && selectedCity) {
            // Only show CTA if it's a different page
            const isSamePage = selectedCity.id === currentCityId &&
                               selectedService.slug === trigger.dataset.preselectedSlug;

            if (isSamePage) {
                ctaBox.classList.remove('active');
                return;
            }

            serviceNameEl.textContent = selectedService.name;
            cityNameEl.textContent = selectedCity.name;
            devisBtn.href = '/' + selectedService.slug + '-' + selectedCity.id + '/';
            ctaBox.classList.add('active');

            // Scroll CTA into view on mobile
            if (window.innerWidth <= 768) {
                setTimeout(() => {
                    ctaBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 450);
            }
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
        if (this.value.length >= 2) {
            showSuggestions(filterCities(this.value));
        }
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
        if (!e.target.closest('#cityPickerInternal')) {
            suggestions.classList.remove('active');
        }
    });
}

/* ============================================
   Zones Picker Universal - ONE Component for All Pages
   Adapts behavior based on context:
   - Homepage/Services: Full picker (service + city)
   - Service landing: Service pre-selected, city input shown
   - Service+City pages: Service pre-selected, quick city links only
   ============================================ */

function initZonesPickerUniversal() {
    // Load cities data
    const citiesDataEl = document.getElementById('cities-data-univ');
    if (!citiesDataEl) return;

    let cities;
    try {
        cities = JSON.parse(citiesDataEl.textContent);
    } catch (e) {
        console.error('Failed to parse cities data:', e);
        return;
    }

    // Core elements
    const section = document.getElementById('zones-universal');
    const trigger = document.getElementById('servicePickerTriggerUniv');
    const panel = document.getElementById('servicePickerPanelUniv');
    const closeBtn = document.getElementById('pickerPanelCloseUniv');
    const cityInput = document.getElementById('zone-city-input-univ');
    const suggestions = document.getElementById('city-suggestions-univ');
    const ctaBox = document.getElementById('zones-cta-box-univ');
    const devisBtn = document.getElementById('zones-devis-btn-univ');
    const serviceNameEl = document.getElementById('zones-service-name-univ');
    const cityNameEl = document.getElementById('zones-city-name-univ');

    if (!section || !panel) return;

    // Check if service is pre-selected (from data attributes on trigger)
    const preselectedSlug = trigger?.dataset.preselectedSlug;
    const preselectedName = trigger?.dataset.preselectedName;

    let selectedService = preselectedSlug ? { slug: preselectedSlug, name: preselectedName } : null;
    let selectedCity = null;

    // Open/close panel functions
    function openPanel() {
        panel.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closePanel() {
        panel.classList.remove('active');
        document.body.style.overflow = '';
        panel.querySelectorAll('.picker-category.open').forEach(cat => cat.classList.remove('open'));
    }

    // Service picker trigger click
    if (trigger) {
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            openPanel();
        });
    }

    // Close button click
    if (closeBtn) {
        closeBtn.addEventListener('click', closePanel);
    }

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

            // Update trigger text if it has picker-label
            const pickerLabel = trigger?.querySelector('.picker-label');
            if (pickerLabel) {
                pickerLabel.textContent = selectedService.name;
                trigger.classList.add('selected');
            } else if (trigger) {
                // For compact design, update badge text
                const firstText = trigger.childNodes[0];
                if (firstText && firstText.nodeType === Node.TEXT_NODE) {
                    firstText.textContent = selectedService.name + ' ';
                }
            }

            // Remove "current" badge from all services
            panel.querySelectorAll('.picker-service').forEach(s => s.classList.remove('current'));
            btn.classList.add('current');

            closePanel();

            // Focus city input if available
            if (cityInput) {
                setTimeout(() => cityInput.focus(), 300);
            }

            updateCTA();
        });
    });

    // Close panel on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && panel.classList.contains('active')) closePanel();
    });

    // City autocomplete
    if (cityInput && suggestions) {
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
                    <span class="suggestion-postal">${city.postalCodes.slice(0, 2).join(', ')}</span>
                </div>`
            ).join('');
            suggestions.classList.add('active');
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
            if (!e.target.closest('.zones-input-group') && !e.target.closest('.city-picker')) {
                suggestions.classList.remove('active');
            }
        });
    }

    // Quick city links (for homepage with service selected)
    document.querySelectorAll('#zones-universal .quick-city-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const cityId = this.dataset.cityId;
            const cityName = this.dataset.cityName;

            if (selectedService) {
                window.location.href = '/' + selectedService.slug + '-' + cityId + '/';
            } else {
                selectedCity = { id: cityId, name: cityName };
                if (cityNameEl) cityNameEl.textContent = cityName;
                openPanel();
            }
        });
    });

    // Update CTA box
    function updateCTA() {
        if (selectedService && selectedCity) {
            if (serviceNameEl) serviceNameEl.textContent = selectedService.name;
            if (cityNameEl) cityNameEl.textContent = selectedCity.name;
            if (devisBtn) devisBtn.href = '/' + selectedService.slug + '-' + selectedCity.id + '/';
            ctaBox.classList.add('active');

            // Scroll CTA into view on mobile
            if (window.innerWidth <= 768) {
                setTimeout(() => {
                    ctaBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 450);
            }
        } else {
            ctaBox.classList.remove('active');
        }
    }
}

// Add ripple keyframes dynamically
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes rippleEffect {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(styleSheet);

