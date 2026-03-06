/* =========================================
   Srushti Gangadhar Surpur | Portfolio JS
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

    // ---------- Navbar Scroll Effect ----------
    const navbar = document.querySelector('.navbar');
    const handleScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // ---------- Mobile Navigation ----------
    const navToggle = document.querySelector('.nav-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const navOverlay = document.querySelector('.nav-overlay');

    const toggleMobileNav = () => {
        navToggle.classList.toggle('active');
        mobileNav.classList.toggle('open');
        navOverlay.classList.toggle('visible');
        document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    };

    navToggle.addEventListener('click', toggleMobileNav);
    navOverlay.addEventListener('click', toggleMobileNav);

    // Close mobile nav on link click
    mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (mobileNav.classList.contains('open')) toggleMobileNav();
        });
    });

    // ---------- Scroll Reveal ----------
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });
    revealElements.forEach(el => revealObserver.observe(el));

    // ---------- Active Nav Link ----------
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav a');
    const activeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-80px 0px -50% 0px'
    });
    sections.forEach(sec => activeObserver.observe(sec));

    // ---------- Publication Loading ----------
    const loadPublications = async () => {
        const pubList = document.getElementById('pub-list');
        const pubCountEl = document.getElementById('pub-count');
        const citeCountEl = document.getElementById('cite-count');

        try {
            const res = await fetch('data/publications.json');
            const pubs = await res.json();

            let totalCitations = 0;
            pubList.innerHTML = '';

            pubs.forEach(pub => {
                totalCitations += pub.citations || 0;
                const card = document.createElement('div');
                card.className = 'pub-card reveal';
                card.innerHTML = `
          <a href="${pub.link}" class="pub-card-title" target="_blank" rel="noopener">${pub.title}</a>
          <p class="pub-card-authors">${pub.authors.join(', ')}</p>
          <div class="pub-card-meta">
            <span class="pub-venue">${pub.venue}</span>
            <span class="pub-year">${pub.year}</span>
            ${pub.citations > 0 ? `<span class="pub-citations">Cited by ${pub.citations}</span>` : ''}
          </div>
        `;
                pubList.appendChild(card);

                // Observe for reveal
                revealObserver.observe(card);
            });

            pubCountEl.textContent = pubs.length;
            citeCountEl.textContent = totalCitations;
        } catch (err) {
            console.warn('Could not load publications:', err);
        }
    };
    loadPublications();

    // ---------- Moments Filter (Milestone, Conference, Activity, Life) ----------
    const filterPills = document.querySelectorAll('.filter-pill');
    const momentCards = document.querySelectorAll('.moment-card');

    filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
            const category = pill.dataset.filter;

            filterPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            momentCards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = '';
                    card.style.animation = 'fadeInCard 0.4s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // ---------- Smooth Scroll for anchor links ----------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ---------- Staggered reveal for grids ----------
    const staggerContainers = document.querySelectorAll('.profiles-grid, .moments-grid');
    staggerContainers.forEach(container => {
        const children = container.children;
        Array.from(children).forEach((child, i) => {
            child.style.transitionDelay = `${i * 0.08}s`;
        });
    });

    // ---------- Typed tagline effect ----------
    const taglineEl = document.querySelector('.hero-tagline');
    if (taglineEl) {
        const phrases = [
            'Curious. Ambitious. Open to Collaborate.',
            'Exploring AI for 6G Networks.',
            'Moving Towards the Future of Telecommunications.',
            'Marie Curie Fellow · Researcher.'
        ];
        let phraseIdx = 0;
        let charIdx = 0;
        let isDeleting = false;
        let typingSpeed = 50;

        const type = () => {
            const current = phrases[phraseIdx];

            if (isDeleting) {
                taglineEl.textContent = current.substring(0, charIdx - 1);
                charIdx--;
                typingSpeed = 30;
            } else {
                taglineEl.textContent = current.substring(0, charIdx + 1);
                charIdx++;
                typingSpeed = 55;
            }

            if (!isDeleting && charIdx === current.length) {
                typingSpeed = 2200;
                isDeleting = true;
            } else if (isDeleting && charIdx === 0) {
                isDeleting = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
                typingSpeed = 400;
            }

            setTimeout(type, typingSpeed);
        };

        // Start after a short delay
        setTimeout(type, 1000);
    }

});

// Fade in card animation
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInCard {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);
