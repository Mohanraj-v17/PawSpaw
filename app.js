(function () {
  'use strict';

  const savedTheme = localStorage.getItem('pawspaw_theme') || 'light';
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  const SEED_KEY_APPTS = 'pawspaw_appointments';
  const SEED_KEY_PETS = 'pawspaw_pets';
  const SEED_KEY_RECEIPTS = 'pawspaw_receipts';
  const SEED_KEY_SERVICES = 'pawspaw_services';

  const pageCache = new Map();

  function getPetImageByBreed(breed = '', species = '') {
    const b = (breed || '').toLowerCase();
    const s = (species || '').toLowerCase();

    if (b.includes('golden') || b.includes('retriever')) return 'public/golden-2.avif';
    if (b.includes('corgi')) return 'public/bordercollie.avif';
    if (b.includes('beagle')) return 'public/Beagle.avif';
    if (b.includes('pembroke') || b.includes('doodle') || b.includes('bichon')) return 'public/pembroke.avif';
    if (b.includes('pitbull') || b.includes('pug')) return 'public/pitbull.avif';
    if (b.includes('cat') || s.includes('cat') || b.includes('ragdoll') || b.includes('persian')) return 'public/cat.avif';
    if (s.includes('hamster') || b.includes('hamster')) return 'public/hamster-2.jpeg';
    if (b.includes('puppy')) return 'public/pit-2.avif';

    if (s.includes('cat')) return 'public/cat-2.avif';
    return 'public/pit-3.avif';
  }

  function seedInitialDemoData() {
    if (!localStorage.getItem(SEED_KEY_PETS)) {
      const defaultPets = [
        {
          id: 'p-1',
          name: 'Milo',
          species: 'Dog',
          breed: 'Golden Retriever',
          age: '3 Years',
          notes: 'Sensitive skin, loves blueberry facial scrub.',
          image: 'public/gallery-golden.jpg'
        },
        {
          id: 'p-2',
          name: 'Luna',
          species: 'Cat',
          breed: 'Ragdoll',
          age: '2 Years',
          notes: 'Needs calm, low-noise blow drying.',
          image: 'public/gallery-cat.jpg'
        }
      ];
      localStorage.setItem(SEED_KEY_PETS, JSON.stringify(defaultPets));
    }

    if (!localStorage.getItem(SEED_KEY_APPTS)) {
      const defaultAppts = [
        {
          id: 'APT-1082',
          petName: 'Milo',
          petBreed: 'Golden Retriever',
          ownerName: 'Sarah Chen',
          ownerEmail: 'sarah@petfamily.com',
          service: 'Luxury Spa & Hydro-Bath',
          specialist: 'Elena Rostova (Master Groomer)',
          date: '2026-10-18',
          time: '10:30 AM',
          status: 'Confirmed',
          price: '$95.00'
        },
        {
          id: 'APT-1049',
          petName: 'Luna',
          petBreed: 'Ragdoll Cat',
          ownerName: 'Sarah Chen',
          ownerEmail: 'sarah@petfamily.com',
          service: 'Silky Cat Dematting & Trim',
          specialist: 'Marcus Vance (Feline Stylist)',
          date: '2026-09-24',
          time: '02:00 PM',
          status: 'Completed',
          price: '$80.00'
        },
        {
          id: 'APT-1031',
          petName: 'Charlie',
          petBreed: 'Beagle',
          ownerName: 'David Robertson',
          ownerEmail: 'david.r@example.com',
          service: 'Full Scissor & Styling',
          specialist: 'Elena Rostova (Master Groomer)',
          date: '2026-09-12',
          time: '11:00 AM',
          status: 'Confirmed',
          price: '$75.00'
        }
      ];
      localStorage.setItem(SEED_KEY_APPTS, JSON.stringify(defaultAppts));
    }

    if (!localStorage.getItem(SEED_KEY_RECEIPTS)) {
      const defaultReceipts = [
        {
          ref: 'REC-9031',
          date: '2026-09-24',
          service: 'Silky Cat Dematting & Trim',
          petName: 'Luna',
          amount: '$80.00',
          method: 'Visa •••• 4821',
          status: 'Paid'
        },
        {
          ref: 'REC-8842',
          date: '2026-08-11',
          service: 'Full Coat Styling & Pawdicure',
          petName: 'Milo',
          amount: '$115.00',
          method: 'Apple Pay',
          status: 'Paid'
        }
      ];
      localStorage.setItem(SEED_KEY_RECEIPTS, JSON.stringify(defaultReceipts));
    }

    if (!localStorage.getItem(SEED_KEY_SERVICES)) {
      const defaultServices = [
        {
          title: 'Hydro-Bath & Blow Dry',
          price: '$45',
          duration: '60 Mins',
          desc: 'Botanical bath and cage-free hand fluff drying.'
        },
        {
          title: 'Full Scissor & Styling',
          price: '$75',
          duration: '90-120 Mins',
          desc: 'Precision hand scissoring, nail trim, and facial.'
        },
        {
          title: 'Thalasso Mineral Mud Spa',
          price: '$145',
          duration: '120 Mins',
          desc: 'Dead Sea mineral mud wrap and ozone hydrotherapy.'
        }
      ];
      localStorage.setItem(SEED_KEY_SERVICES, JSON.stringify(defaultServices));
    }
  }

  function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'fixed bottom-6 right-6 z-50 flex flex-col space-y-3 pointer-events-none max-w-[90vw]';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const colorClass = type === 'success'
      ? 'bg-emerald-800 text-white border-emerald-700'
      : type === 'error'
        ? 'bg-rose-700 text-white border-rose-600'
        : 'bg-amber-600 text-white border-amber-500';

    toast.className = `pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border text-xs sm:text-sm font-medium transition-all duration-300 transform translate-y-4 opacity-0 ${colorClass}`;
    toast.innerHTML = `
      <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'} text-base"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-4', 'opacity-0');
    });

    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => toast.remove(), 350);
    }, 3500);
  }

  function initTheme() {
    const curTheme = localStorage.getItem('pawspaw_theme') || 'light';
    if (curTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    updateThemeIcon(curTheme);
  }

  function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    const newTheme = isDark ? 'dark' : 'light';
    localStorage.setItem('pawspaw_theme', newTheme);
    updateThemeIcon(newTheme);
    showToast(`Switched to ${newTheme} mode`, 'info');
  }

  function updateThemeIcon(theme) {
    const icons = document.querySelectorAll('.theme-toggle-icon');
    icons.forEach(icon => {
      if (theme === 'dark') {
        icon.className = 'fas fa-sun text-amber-400 theme-toggle-icon';
      } else {
        icon.className = 'fas fa-moon text-emerald-800 theme-toggle-icon';
      }
    });
  }

  function initDirection() {
    const savedDir = localStorage.getItem('pawspaw_direction') || 'ltr';
    document.documentElement.setAttribute('dir', savedDir);
    updateDirectionBadge(savedDir);
  }

  function toggleDirection() {
    const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
    const nextDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', nextDir);
    localStorage.setItem('pawspaw_direction', nextDir);
    updateDirectionBadge(nextDir);
    showToast(`Layout flipped to ${nextDir.toUpperCase()}`, 'info');
  }

  function updateDirectionBadge(dir) {
    const badges = document.querySelectorAll('.dir-toggle-text');
    badges.forEach(b => {
      b.textContent = dir.toUpperCase();
    });
  }

  function closeMobileMenu() {
    const drawer = document.getElementById('mobile-drawer');
    const backdrop = document.getElementById('mobile-drawer-backdrop');
    const mobileBtn = document.getElementById('mobile-menu-btn');
    if (drawer) drawer.classList.add('hidden');
    if (backdrop) backdrop.classList.add('hidden');
    if (mobileBtn) {
      const icon = mobileBtn.querySelector('i');
      if (icon) {
        icon.className = 'fas fa-bars text-sm';
      }
    }
  }

  function toggleMobileMenu() {
    const drawer = document.getElementById('mobile-drawer');
    const backdrop = document.getElementById('mobile-drawer-backdrop');
    const mobileBtn = document.getElementById('mobile-menu-btn');
    if (!drawer || !mobileBtn) return;

    const isOpen = !drawer.classList.contains('hidden');
    const icon = mobileBtn.querySelector('i');

    if (isOpen) {
      drawer.classList.add('hidden');
      if (backdrop) backdrop.classList.add('hidden');
      if (icon) icon.className = 'fas fa-bars text-sm';
    } else {
      drawer.classList.remove('hidden');
      if (backdrop) backdrop.classList.remove('hidden');
      if (icon) icon.className = 'fas fa-xmark text-sm';
    }
  }

  function updateNavbarActiveLinks() {
    let curPage = window.location.pathname.split('/').pop() || 'index.html';
    if (curPage === 'home2.html') curPage = 'home-2.html';
    if (curPage === 'service.html') curPage = 'services.html';

    const isHome = curPage.startsWith('index') || curPage.startsWith('home') || curPage === '';

    const homeBtn = document.querySelector('#navbar-placeholder nav .group > button');
    if (homeBtn) {
      if (isHome) {
        homeBtn.className = 'flex items-center gap-1.5 py-1 text-sm font-bold text-emerald-700 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400 pb-0.5 focus:outline-none transition-all duration-200';
      } else {
        homeBtn.className = 'flex items-center gap-1.5 py-1 text-sm font-bold text-stone-700 dark:text-stone-200 hover:text-emerald-700 dark:hover:text-emerald-400 focus:outline-none transition-all duration-200';
      }
    }

    const navLinks = document.querySelectorAll('#navbar-placeholder a[href]');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      const isMatch = (curPage === href || (curPage === '' && href === 'index.html'));

      if (link.closest('#mobile-drawer')) {
        if (isMatch) {
          link.className = 'py-2 px-3 rounded-xl transition-all flex items-center justify-between bg-emerald-800 dark:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-900/20';
        } else {
          link.className = 'py-2 px-3 rounded-xl transition-all flex items-center justify-between text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800/70 font-medium';
        }
      } else if (!link.querySelector('.fa-paw') && !link.closest('.group') && !link.classList.contains('no-nav-highlight')) {
        if (isMatch) {
          link.className = 'text-emerald-700 dark:text-emerald-400 font-extrabold border-b-2 border-emerald-600 dark:border-emerald-400 pb-0.5';
        } else {
          link.className = 'text-stone-700 dark:text-stone-300 hover:text-emerald-700 dark:hover:text-emerald-400 font-medium transition-colors duration-200 hover:scale-105 inline-block';
        }
      }
    });
  }

  function renderNavbar() {
    const mount = document.getElementById('navbar-placeholder');
    if (!mount) return;

    if (mount.children.length > 0) {
      updateNavbarActiveLinks();
      closeMobileMenu();
      return;
    }

    let curPage = window.location.pathname.split('/').pop() || 'index.html';
    if (curPage === 'home2.html') curPage = 'home-2.html';
    if (curPage === 'service.html') curPage = 'services.html';

    const isLinkActive = (page) => {
      const match = (curPage === page || (curPage === '' && page === 'index.html'));
      return match
        ? 'text-emerald-700 dark:text-emerald-400 font-extrabold border-b-2 border-emerald-600 dark:border-emerald-400 pb-0.5'
        : 'text-stone-700 dark:text-stone-300 hover:text-emerald-700 dark:hover:text-emerald-400 font-medium transition-colors duration-200 hover:scale-105 inline-block';
    };

    const isDropdownActive = (page) => {
      const match = (curPage === page || (curPage === '' && page === 'index.html'));
      return match
        ? 'bg-emerald-50 dark:bg-stone-800 text-emerald-700 dark:text-emerald-400 font-bold'
        : 'text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800/60 font-medium';
    };

    const isMobileActive = (page) => {
      const match = (curPage === page || (curPage === '' && page === 'index.html'));
      return match
        ? 'bg-emerald-800 dark:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-900/20'
        : 'text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800/70 font-medium';
    };

    const isHome = curPage.startsWith('index') || curPage.startsWith('home') || curPage === '';

    mount.innerHTML = `
  <header class="fixed left-0 right-0 z-50 px-2.5 sm:px-6 pointer-events-none" style="position: fixed !important; top: 0.5rem !important; z-index: 99999 !important;">
    <nav class="max-w-7xl mx-auto glass-nav bg-white/95 dark:bg-[#1A2220]/95 backdrop-blur-md rounded-full px-3.5 sm:px-6 py-2 sm:py-2.5 shadow-xl border border-stone-200/80 dark:border-stone-800 flex items-center justify-between pointer-events-auto transition-all">
      
      <a href="index.html" class="flex items-center gap-2.5 group focus:outline-none flex-shrink-0">
  <div class="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-md group-hover:scale-110 group-hover:bg-emerald-500 transition-all duration-300">
    <i class="fas fa-paw text-lg group-hover:rotate-12 transition-transform duration-300"></i>
  </div>
  <div class="flex flex-col">
    <span class="font-extrabold tracking-tight text-xl text-emerald-950 dark:text-white leading-tight group-hover:text-emerald-400 transition-colors">PawSpaw<span class="text-amber-500 dark:text-amber-400">.</span></span>
  </div>
</a>

      <!-- Desktop Links -->
      <div class="hidden lg:flex items-center gap-7 text-sm">
        <div class="relative group">
          <button class="flex items-center gap-1.5 py-1 text-sm font-medium ${isHome ? 'text-emerald-700 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400 pb-0.5' : 'text-stone-700 dark:text-stone-200 hover:text-emerald-700 dark:hover:text-emerald-400'} focus:outline-none transition-all duration-200">
            <span>Home</span>
            <i class="fas fa-chevron-down text-[10px] group-hover:rotate-180 transition-transform duration-300"></i>
          </button>
          
          <div class="absolute start-0 mt-2 w-44 bg-white dark:bg-[#1A2220] rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50 flex flex-col gap-1">
            <a href="index.html" class="flex items-center px-4 py-2 text-xs rounded-xl mx-1.5 transition-all duration-200 hover:translate-x-1 ${isDropdownActive('index.html')}">
              <i class="fas fa-store-alt mr-2.5 text-emerald-600"></i>
              <span>Home 1</span>
            </a>
            <a href="home-2.html" class="flex items-center px-4 py-2 text-xs rounded-xl mx-1.5 transition-all duration-200 hover:translate-x-1 ${isDropdownActive('home-2.html')}">
              <i class="fas fa-gem mr-2.5 text-amber-600"></i>
              <span>Home 2</span>
            </a>
          </div>
        </div>

        <a href="about.html" class="${isLinkActive('about.html')}">About</a>
        <a href="sessions.html" class="${isLinkActive('sessions.html')}">Sessions</a>
        <a href="services.html" class="${isLinkActive('services.html')}">Services</a>
        <a href="pricing.html" class="${isLinkActive('pricing.html')}">Pricing</a>
        <a href="blog.html" class="${isLinkActive('blog.html')}">Blog</a>
        <a href="faq.html" class="${isLinkActive('faq.html')}">FAQ</a>
        <a href="contacts.html" class="${isLinkActive('contacts.html')}">Contacts</a>

        <div class="relative group">
          <button class="flex items-center gap-1.5 py-1 text-stone-700 dark:text-stone-300 hover:text-emerald-700 dark:hover:text-emerald-400 font-bold focus:outline-none transition-all duration-200 hover:scale-105">
            <span>Portals</span>
            <i class="fas fa-shield-cat text-xs text-amber-500"></i>
            <i class="fas fa-chevron-down text-[10px] group-hover:rotate-180 transition-transform duration-300"></i>
          </button>
          <div class="absolute end-0 mt-2 w-52 bg-white dark:bg-[#1A2220] rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50 flex flex-col gap-1">
            <a href="user-dashboard.html" class="flex items-center px-4 py-2 hover:bg-emerald-50 dark:hover:bg-stone-800/80 text-xs font-semibold rounded-xl mx-1.5 transition-all duration-200 hover:translate-x-1">
              <i class="fas fa-user-circle mr-2 text-emerald-600"></i> Pet Owner Portal
            </a>
            <a href="admin-dashboard.html" class="flex items-center px-4 py-2 hover:bg-emerald-50 dark:hover:bg-stone-800/80 text-xs font-semibold rounded-xl mx-1.5 transition-all duration-200 hover:translate-x-1">
              <i class="fas fa-sliders mr-2 text-rose-600"></i> Admin Management
            </a>
          </div>
        </div>
      </div>

      <!-- Controls & Hamburger -->
      <div class="flex items-center gap-2 sm:gap-2.5">
        <button id="rtl-toggle-btn" title="Toggle Direction" class="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 flex items-center justify-center text-xs font-bold hover:bg-stone-200 dark:hover:bg-stone-700 transition">
          <span class="dir-toggle-text">LTR</span>
        </button>

        <button id="theme-toggle-btn" title="Toggle Theme" class="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 flex items-center justify-center hover:bg-stone-200 dark:hover:bg-stone-700 transition">
          <i class="fas fa-moon theme-toggle-icon"></i>
        </button>

        <a href="login.html" class="no-nav-highlight hidden sm:inline-flex items-center text-xs font-bold px-3 py-1.5 rounded-full text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition">
          Sign In
        </a>

        <a href="sessions.html#booking" class="no-nav-highlight hidden md:inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-extrabold bg-gradient-to-r from-emerald-800 to-emerald-700 text-white shadow-md hover:shadow-emerald-900/30 hover:-translate-y-0.5 transition">
          <i class="fas fa-calendar-check text-[11px]"></i>
          <span>Book Appointment</span>
        </a>

        <button id="mobile-menu-btn" aria-label="Toggle Navigation" class="lg:hidden w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-800 dark:text-stone-200 focus:outline-none hover:bg-stone-200 transition">
          <i class="fas fa-bars text-sm"></i>
        </button>
      </div>
    </nav>

    <!-- Mobile Drawer -->
    <div id="mobile-drawer" class="lg:hidden hidden mt-2 mx-auto max-w-sm sm:max-w-md w-full bg-white dark:bg-[#1A2220] backdrop-blur-2xl rounded-3xl p-4 sm:p-5 shadow-2xl border border-stone-200 dark:border-stone-800 transition-all pointer-events-auto max-h-[75vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <div class="flex flex-col space-y-1 text-xs sm:text-sm">
        <div class="text-[10px] uppercase tracking-wider text-emerald-800 dark:text-emerald-400 font-black px-2 py-1">Main Pages</div>
        
        <a href="index.html" class="py-2 px-3 rounded-xl transition-all flex items-center justify-between ${isMobileActive('index.html')}">
          <span>Home 1</span>
          <i class="fas fa-chevron-right text-[10px] opacity-60"></i>
        </a>
        <a href="home-2.html" class="py-2 px-3 rounded-xl transition-all flex items-center justify-between ${isMobileActive('home-2.html')}">
          <span>Home 2</span>
          <i class="fas fa-chevron-right text-[10px] opacity-60"></i>
        </a>
        <a href="about.html" class="py-2 px-3 rounded-xl transition-all flex items-center justify-between ${isMobileActive('about.html')}">
          <span>About</span>
          <i class="fas fa-chevron-right text-[10px] opacity-60"></i>
        </a>
        <a href="sessions.html" class="py-2 px-3 rounded-xl transition-all flex items-center justify-between ${isMobileActive('sessions.html')}">
          <span>Sessions</span>
          <i class="fas fa-chevron-right text-[10px] opacity-60"></i>
        </a>
        <a href="services.html" class="py-2 px-3 rounded-xl transition-all flex items-center justify-between ${isMobileActive('services.html')}">
          <span>Services</span>
          <i class="fas fa-chevron-right text-[10px] opacity-60"></i>
        </a>
        <a href="pricing.html" class="py-2 px-3 rounded-xl transition-all flex items-center justify-between ${isMobileActive('pricing.html')}">
          <span>Pricing</span>
          <i class="fas fa-chevron-right text-[10px] opacity-60"></i>
        </a>
        <a href="blog.html" class="py-2 px-3 rounded-xl transition-all flex items-center justify-between ${isMobileActive('blog.html')}">
          <span>Blog</span>
          <i class="fas fa-chevron-right text-[10px] opacity-60"></i>
        </a>
        <a href="faq.html" class="py-2 px-3 rounded-xl transition-all flex items-center justify-between ${isMobileActive('faq.html')}">
          <span>FAQs</span>
          <i class="fas fa-chevron-right text-[10px] opacity-60"></i>
        </a>
        <a href="contacts.html" class="py-2 px-3 rounded-xl transition-all flex items-center justify-between ${isMobileActive('contacts.html')}">
          <span>Contact</span>
          <i class="fas fa-chevron-right text-[10px] opacity-60"></i>
        </a>

        <hr class="border-stone-200 dark:border-stone-800 my-1">
        <div class="text-[10px] uppercase tracking-wider text-amber-700 dark:text-amber-400 font-black px-2 py-0.5">Member Portals</div>

        <a href="user-dashboard.html" class="py-2 px-3 rounded-xl transition-all flex items-center justify-between ${isMobileActive('user-dashboard.html')}">
          <span>Pet Owner Dashboard</span>
          <i class="fas fa-user-check text-emerald-500"></i>
        </a>
        <a href="admin-dashboard.html" class="py-2 px-3 rounded-xl transition-all flex items-center justify-between ${isMobileActive('admin-dashboard.html')}">
          <span>Admin Management</span>
          <i class="fas fa-lock text-rose-500"></i>
        </a>

        <div class="pt-2 flex gap-2">
          <a href="login.html" class="flex-1 py-2 text-center rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-white font-bold text-xs hover:bg-stone-200 transition">Sign In</a>
          <a href="sessions.html#booking" class="flex-1 py-2 text-center rounded-xl bg-emerald-800 text-white font-bold text-xs hover:bg-emerald-700 transition">Book Now</a>
        </div>
      </div>
    </div>
  </header>
  <div id="mobile-drawer-backdrop" class="fixed inset-0 bg-stone-950/40 backdrop-blur-xs z-40 hidden lg:hidden"></div>
`;

    document.getElementById('theme-toggle-btn')?.addEventListener('click', toggleTheme);
    document.getElementById('rtl-toggle-btn')?.addEventListener('click', toggleDirection);
    document.getElementById('mobile-menu-btn')?.addEventListener('click', toggleMobileMenu);
    document.getElementById('mobile-drawer-backdrop')?.addEventListener('click', closeMobileMenu);

    document.querySelectorAll('#mobile-drawer a').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    updateThemeIcon(localStorage.getItem('pawspaw_theme') || 'light');
    updateDirectionBadge(localStorage.getItem('pawspaw_direction') || 'ltr');
    updateNavbarActiveLinks();
  }

  function renderFooter() {
    const mount = document.getElementById('footer-placeholder');
    if (!mount || mount.children.length > 0) return;

    const currentYear = new Date().getFullYear();

    mount.innerHTML = `
      <footer class="bg-stone-300 dark:bg-stone-800 text-stone-600 dark:text-stone-300 pt-16 pb-12 border-t border-stone-300 dark:border-stone-700 transition-colors">
        <div class="max-w-7xl mx-auto px-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-400 dark:border-stone-700">
            <div class="lg:col-span-2 space-y-4">
             <a href="index.html" class="flex items-center gap-2.5 group focus:outline-none flex-shrink-0">
  <div class="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-md group-hover:scale-110 group-hover:bg-emerald-500 transition-all duration-300">
    <i class="fas fa-paw text-lg group-hover:rotate-12 transition-transform duration-300"></i>
  </div>
  <div class="flex flex-col">
    <span class="font-extrabold tracking-tight text-xl text-emerald-950 dark:text-white leading-tight group-hover:text-emerald-400 transition-colors">PawSpaw<span class="text-amber-500 dark:text-amber-400">.</span></span>
  </div>
</a>
              <p class="text-sm leading-relaxed max-w-sm text-stone-700 dark:text-stone-300">
                Where every dog & cat gets treated like royalty. Organic hydro-massages, gentle breed-specific styling, stress-free environments, and certified holistic grooming.
              </p>
              <div class="flex items-center space-x-3 pt-2">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" class="w-9 h-9 rounded-full bg-stone-200 dark:bg-stone-700 hover:bg-emerald-600 text-stone-700 dark:text-stone-300 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-1">
                  <i class="fab fa-instagram"></i>
                </a>
                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok" class="w-9 h-9 rounded-full bg-stone-200 dark:bg-stone-700 hover:bg-emerald-600 text-stone-700 dark:text-stone-300 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-1">
                  <i class="fab fa-tiktok"></i>
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" class="w-9 h-9 rounded-full bg-stone-200 dark:bg-stone-700 hover:bg-emerald-600 text-stone-700 dark:text-stone-300 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-1">
                  <i class="fab fa-facebook-f"></i>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter / X" class="w-9 h-9 rounded-full bg-stone-200 dark:bg-stone-700 hover:bg-emerald-600 text-stone-700 dark:text-stone-300 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-1">
                  <i class="fab fa-x-twitter"></i>
                </a>
              </div>
            </div>

            <div class="space-y-3">
              <h4 class="text-xs font-black uppercase tracking-widest text-emerald-800 dark:text-emerald-400">Navigation</h4>
              <ul class="space-y-2 text-sm text-stone-700 dark:text-stone-300">
                <li><a href="index.html" class="hover:text-emerald-800 dark:hover:text-amber-400 transition-colors">Home 1 (Classic)</a></li>
                <li><a href="home-2.html" class="hover:text-emerald-800 dark:hover:text-amber-400 transition-colors">Home 2 (VIP Boutique)</a></li>
                <li><a href="about.html" class="hover:text-emerald-800 dark:hover:text-amber-400 transition-colors">About Our Salon</a></li>
                <li><a href="sessions.html" class="hover:text-emerald-800 dark:hover:text-amber-400 transition-colors">Sessions & Groomers</a></li>
                <li><a href="services.html" class="hover:text-emerald-800 dark:hover:text-amber-400 transition-colors">Services & Spa</a></li>
                <li><a href="pricing.html" class="hover:text-emerald-800 dark:hover:text-amber-400 transition-colors">Pricing Packages</a></li>
                <li><a href="blog.html" class="hover:text-emerald-800 dark:hover:text-amber-400 transition-colors">Care Journal</a></li>
                <li><a href="faq.html" class="hover:text-emerald-800 dark:hover:text-amber-400 transition-colors">Help & FAQs</a></li>
                <li><a href="contacts.html" class="hover:text-emerald-800 dark:hover:text-amber-400 transition-colors">Contact Us</a></li>
              </ul>
            </div>

            <div class="space-y-3">
              <h4 class="text-xs font-black uppercase tracking-widest text-emerald-800 dark:text-emerald-400">Treatments</h4>
              <ul class="space-y-2 text-sm text-stone-700 dark:text-stone-300">
                <li class="hover:text-emerald-800 dark:hover:text-white transition-colors cursor-pointer">Hydro-Massage Bathing</li>
                <li class="hover:text-emerald-800 dark:hover:text-white transition-colors cursor-pointer">Breed-Specific Scissor Styling</li>
                <li class="hover:text-emerald-800 dark:hover:text-white transition-colors cursor-pointer">Blueberry Paw & Facial Spa</li>
                <li class="hover:text-emerald-800 dark:hover:text-white transition-colors cursor-pointer">Feline Low-Noise Dematting</li>
                <li class="hover:text-emerald-800 dark:hover:text-white transition-colors cursor-pointer">Ear Canal Hygiene & Pluck</li>
                <li class="hover:text-emerald-800 dark:hover:text-white transition-colors cursor-pointer">Aromatherapy De-shedding</li>
              </ul>
            </div>

            <div class="space-y-4">
              <h4 class="text-xs font-black uppercase tracking-widest text-emerald-800 dark:text-emerald-400">Salon Hours</h4>
              <p class="text-xs text-stone-700 dark:text-stone-300 leading-snug">
                Mon - Sat: 8:00 AM – 7:30 PM<br>
                Sunday: 9:00 AM – 5:00 PM<br>
                <span class="text-amber-600 dark:text-amber-400 font-bold">24/7 Online Booking Active</span>
              </p>
              <div class="pt-2">
                <span class="text-xs font-bold text-stone-900 dark:text-white block mb-1">Join Pet Parent VIP Club</span>
                <form id="footer-newsletter-form" class="flex flex-col gap-2">
                  <input type="email" id="newsletter-email" required placeholder="parent@petlover.com" class="w-full text-xs bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-xl px-3 py-2 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-emerald-500 transition-colors">
                  <button type="submit" class="w-full text-xs font-bold bg-emerald-700 hover:bg-emerald-600 text-white py-2 rounded-xl btn-hover shadow-md">
                    Subscribe for 15% Off
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div class="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-600 dark:text-stone-400 gap-4">
            <p>© ${currentYear} PawSpaw & Co. All rights reserved. Crafted with care for dogs & cats.</p>
            <div class="flex items-center space-x-6">
              <a href="#" class="hover:underline transition-colors">Privacy Policy</a>
              <a href="#" class="hover:underline transition-colors">Terms of Service</a>
              <a href="admin-dashboard.html" class="hover:text-amber-600 dark:hover:text-amber-400 font-mono text-[11px] transition-colors">Staff Terminal</a>
            </div>
          </div>
        </div>
      </footer>
    `;

    document.getElementById('footer-newsletter-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('newsletter-email')?.value;
      if (email) {
        showToast(`Welcome! A 15% discount code has been sent to ${email}`, 'success');
        e.target.reset();
      }
    });
  }

  function prefetchUrl(url) {
    if (!url || pageCache.has(url) || url.startsWith('#') || url.startsWith('http') || url.includes('dashboard') || url.includes('login') || url.includes('register') || url.includes('signup')) return;
    fetch(url)
      .then(res => {
        if (res.ok) return res.text();
        throw new Error();
      })
      .then(html => pageCache.set(url, html))
      .catch(() => { });
  }

  function setupSpaNavigation() {
    document.addEventListener('mouseover', (e) => {
      const link = e.target.closest('a');
      const href = link?.getAttribute('href');
      if (href) prefetchUrl(href);
    }, { passive: true });

    document.addEventListener('touchstart', (e) => {
      const link = e.target.closest('a');
      const href = link?.getAttribute('href');
      if (href) prefetchUrl(href);
    }, { passive: true });

    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href) return;

      closeMobileMenu();

      const curPath = window.location.pathname;
      if (
        curPath.includes('dashboard') || href.includes('dashboard') ||
        curPath.includes('login') || href.includes('login') ||
        curPath.includes('register') || href.includes('register') ||
        curPath.includes('signup') || href.includes('signup') ||
        href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')
      ) {
        return;
      }

      e.preventDefault();
      const currentUrl = curPath.split('/').pop() || 'index.html';
      const targetUrl = href.split('#')[0];
      const targetHash = href.split('#')[1] || '';

      if (currentUrl === targetUrl && !targetHash) return;

      navigateToPage(href);
    });

    window.addEventListener('popstate', () => {
      const p = window.location.pathname;
      if (p.includes('dashboard') || p.includes('login') || p.includes('register') || p.includes('signup')) {
        window.location.reload();
      } else {
        navigateToPage(p.split('/').pop() || 'index.html', false);
      }
    });
  }

  async function navigateToPage(url, pushState = true) {
    closeMobileMenu();

    const mainEl = document.querySelector('main');
    if (mainEl) {
      mainEl.style.willChange = 'opacity';
      mainEl.style.transition = 'opacity 90ms ease-out';
      mainEl.style.opacity = '0.5';
    }

    try {
      let htmlText = pageCache.get(url);
      if (!htmlText) {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Page failed to load');
        htmlText = await response.text();
        pageCache.set(url, htmlText);
      }

      const parser = new DOMParser();
      const newDoc = parser.parseFromString(htmlText, 'text/html');

      const newMain = newDoc.querySelector('main');
      if (newMain && mainEl) {
        mainEl.className = newMain.className;
        mainEl.innerHTML = newMain.innerHTML;
        document.title = newDoc.title || document.title;
      }

      if (pushState) {
        window.history.pushState({}, '', url);
      }

      window.scrollTo({ top: 0, behavior: 'instant' });

      renderNavbar();
      initTheme();

      setupPublicBookingForm();
      initTestimonialSlider();
      setupFaqAccordion();
      setupBlogFeatures();
      setupPasswordToggles();

      const hash = url.split('#')[1];
      if (hash) {
        const targetAnchor = document.getElementById(hash);
        targetAnchor?.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err) {
      window.location.href = url;
    } finally {
      if (mainEl) {
        requestAnimationFrame(() => {
          mainEl.style.opacity = '1';
          setTimeout(() => {
            mainEl.style.willChange = 'auto';
          }, 120);
        });
      }
    }
  }

  function switchTab(targetId) {
    document.querySelectorAll('.tab-pane').forEach(el => el.classList.add('hidden'));
    const activePane = document.getElementById('tab-' + targetId);
    if (activePane) activePane.classList.remove('hidden');

    document.querySelectorAll('.user-tab-btn').forEach(btn => {
      if (btn.getAttribute('data-target') === targetId) {
        btn.className = 'user-tab-btn w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 bg-emerald-800 text-white font-bold shadow-md';
      } else {
        btn.className = 'user-tab-btn w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 hover:translate-x-1 font-semibold';
      }
    });

    const heading = document.getElementById('tab-heading');
    if (heading) {
      const titles = {
        overview: 'Pet Parent Overview',
        pets: 'My Pets & Health Profiles',
        book: 'Book a Grooming Session',
        appointments: 'My Appointment Schedule',
        history: 'Service Records & History',
        receipts: 'Billing Receipts & Invoices',
        notifications: 'Notifications & Alerts',
        profile: 'Personal Profile',
      };
      heading.textContent = titles[targetId] || 'Client Dashboard';
    }

    document.getElementById('user-sidebar')?.classList.add('-translate-x-full');
    document.getElementById('user-sidebar-backdrop')?.classList.add('hidden');
  }

  function renderUserPets() {
    const container = document.getElementById('pets-container');
    if (!container) return;
    const pets = JSON.parse(localStorage.getItem(SEED_KEY_PETS) || '[]');
    container.innerHTML = '';

    pets.forEach((pet, index) => {
      const petImg = pet.image || getPetImageByBreed(pet.breed, pet.species);
      const card = document.createElement('div');
      card.className = 'bg-white dark:bg-[#16201D] p-5 rounded-3xl border border-stone-200 dark:border-stone-800 flex gap-4 items-start shadow-sm card-hover';
      card.innerHTML = `
        <div class="img-zoom-wrapper rounded-2xl w-20 h-20 flex-shrink-0">
          <img src="${petImg}" alt="${pet.name}" class="w-full h-full object-cover">
        </div>
        <div class="flex-1 space-y-1">
          <div class="flex justify-between items-start">
            <h4 class="font-bold text-stone-900 dark:text-white text-base">${pet.name}</h4>
            <button onclick="deletePet(${index})" class="text-stone-400 hover:text-rose-600 text-xs p-1 hover:scale-110 transition-all"><i class="fas fa-trash-can"></i></button>
          </div>
          <p class="text-xs text-amber-600 font-bold">${pet.breed} • ${pet.age}</p>
          <p class="text-[11px] text-stone-500">${pet.notes || 'No special sensitivities noted.'}</p>
        </div>
      `;
      container.appendChild(card);
    });

    const metric = document.getElementById('metric-pet-count');
    if (metric) metric.textContent = pets.length;
  }

  function deletePet(index) {
    if (confirm('Are you sure you want to remove this pet profile?')) {
      const pets = JSON.parse(localStorage.getItem(SEED_KEY_PETS) || '[]');
      pets.splice(index, 1);
      localStorage.setItem(SEED_KEY_PETS, JSON.stringify(pets));
      renderUserPets();
      showToast('Pet profile removed', 'info');
    }
  }

  function renderUserAppointments() {
    const container = document.getElementById('appointments-list-container');
    if (!container) return;
    const appts = JSON.parse(localStorage.getItem(SEED_KEY_APPTS) || '[]');
    container.innerHTML = '';

    appts.forEach((apt, idx) => {
      const card = document.createElement('div');
      card.className = 'bg-white dark:bg-[#16201D] p-5 rounded-3xl border border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm card-hover';
      const badgeColor = apt.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600';

      card.innerHTML = `
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ${badgeColor}">${apt.status}</span>
            <span class="text-xs text-stone-400 font-mono">${apt.id}</span>
          </div>
          <h4 class="font-bold text-stone-900 dark:text-white text-base">${apt.service} • ${apt.petName}</h4>
          <p class="text-xs text-stone-500">${apt.date} at ${apt.time} • Stylist: ${apt.specialist}</p>
        </div>
        <div class="flex gap-2">
          ${apt.status === 'Confirmed' ? `
            <button onclick="cancelUserApt(${idx})" class="px-3.5 py-2 rounded-xl border border-rose-200 text-rose-600 text-xs font-bold hover:bg-rose-50 hover:border-rose-300 hover:scale-105 active:scale-95 transition-all">Cancel</button>
            <button onclick="PawSpaw.showToast('Please call salon to pick a new slot', 'info')" class="px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-xs font-bold hover:bg-stone-200 dark:hover:bg-stone-700 hover:scale-105 active:scale-95 transition-all">Reschedule</button>
          ` : '<span class="text-xs text-stone-400 font-bold">Past Session</span>'}
        </div>
      `;
      container.appendChild(card);
    });
  }

  function cancelUserApt(index) {
    if (confirm('Cancel this appointment?')) {
      const appts = JSON.parse(localStorage.getItem(SEED_KEY_APPTS) || '[]');
      appts[index].status = 'Cancelled';
      localStorage.setItem(SEED_KEY_APPTS, JSON.stringify(appts));
      renderUserAppointments();
      showToast('Appointment marked as Cancelled', 'info');
    }
  }

  function renderUserReceipts() {
    const container = document.getElementById('receipts-list-container');
    if (!container) return;
    const receipts = JSON.parse(localStorage.getItem(SEED_KEY_RECEIPTS) || '[]');
    container.innerHTML = '';

    receipts.forEach(rec => {
      const item = document.createElement('div');
      item.className = 'bg-white dark:bg-[#16201D] p-3 sm:p-4 rounded-2xl border border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3 text-xs shadow-sm card-hover';
      item.innerHTML = `
        <div class="min-w-0 flex-1 space-y-0.5">
          <div class="flex items-center gap-1.5">
            <span class="font-bold font-mono text-stone-900 dark:text-white text-xs">${rec.ref}</span>
            <span class="px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[9px] font-bold">Paid</span>
          </div>
          <p class="text-stone-600 dark:text-stone-300 font-medium text-[11px] sm:text-xs truncate">${rec.service} (${rec.petName})</p>
          <p class="text-stone-400 text-[10px] font-mono">${rec.date}</p>
        </div>
        <div class="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <span class="font-black text-emerald-800 dark:text-emerald-400 text-xs sm:text-sm whitespace-nowrap">${rec.amount}</span>
          <button onclick="openReceiptModal('${rec.ref}', '${rec.date}', '${rec.service}', '${rec.petName}', '${rec.amount}')" class="whitespace-nowrap px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-emerald-800 hover:text-white text-stone-800 dark:text-stone-200 font-bold text-[10px] sm:text-xs transition-all shadow-sm flex items-center gap-1">
            <i class="fas fa-receipt text-[10px]"></i>
            <span>View & Print</span>
          </button>
        </div>
      `;
      container.appendChild(item);
    });
  }

  function openReceiptModal(ref, date, service, pet, amount) {
    const refEl = document.getElementById('rec-modal-ref');
    const dateEl = document.getElementById('rec-modal-date');
    const servEl = document.getElementById('rec-modal-service');
    const petEl = document.getElementById('rec-modal-pet');
    const amtEl = document.getElementById('rec-modal-amount');
    const modal = document.getElementById('receipt-modal');

    if (refEl) refEl.textContent = ref;
    if (dateEl) dateEl.textContent = date;
    if (servEl) servEl.textContent = service;
    if (petEl) petEl.textContent = pet;
    if (amtEl) amtEl.textContent = amount;

    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
  }

  function closeReceiptModal() {
    const modal = document.getElementById('receipt-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  }

  function openAddPetModal() {
    const modal = document.getElementById('add-pet-modal');
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
  }

  function closeAddPetModal() {
    const modal = document.getElementById('add-pet-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  }

  function openLogoutModal() {
    const modal = document.getElementById('logout-modal');
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
  }

  function closeLogoutModal() {
    const modal = document.getElementById('logout-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  }

  function confirmLogout() {
    localStorage.removeItem('pawspaw_auth_user');
    window.location.href = 'login.html';
  }

  function clearNotifications() {
    const box = document.getElementById('notifications-box');
    if (box) box.innerHTML = '<p class="text-xs text-stone-400">No active alerts.</p>';
    showToast('Notifications cleared', 'info');
  }

  function initUserDashboardListeners() {
    const addPetForm = document.getElementById('add-pet-form');
    if (addPetForm && addPetForm.dataset.bound !== 'true') {
      addPetForm.dataset.bound = 'true';
      addPetForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.getElementById('new-pet-name')?.value.trim();
        const species = document.getElementById('new-pet-species')?.value;
        const breed = document.getElementById('new-pet-breed')?.value.trim();
        const age = document.getElementById('new-pet-age')?.value.trim() || '1 Year';
        const notes = document.getElementById('new-pet-notes')?.value.trim();

        if (!name || !breed) return;

        const pets = JSON.parse(localStorage.getItem(SEED_KEY_PETS) || '[]');
        pets.push({
          id: 'p-' + Date.now(),
          name,
          species,
          breed,
          age,
          notes,
          image: getPetImageByBreed(breed, species)
        });
        localStorage.setItem(SEED_KEY_PETS, JSON.stringify(pets));
        renderUserPets();
        closeAddPetModal();
        this.reset();
        showToast(`Saved profile for ${name}!`, 'success');
      });
    }

    const bookingForm = document.getElementById('dash-booking-form');
    if (bookingForm && bookingForm.dataset.bound !== 'true') {
      bookingForm.dataset.bound = 'true';
      bookingForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const petName = document.getElementById('dash-book-pet')?.value;
        const service = document.getElementById('dash-book-service')?.value;
        const specialist = document.getElementById('dash-book-specialist')?.value;
        const date = document.getElementById('dash-book-date')?.value;
        const time = document.getElementById('dash-book-time')?.value;

        if (!date || !time) {
          showToast('Please select a date and time slot.', 'error');
          return;
        }

        const newApt = {
          id: 'APT-' + Math.floor(1000 + Math.random() * 9000),
          petName,
          service,
          specialist,
          date,
          time,
          status: 'Confirmed'
        };

        const existing = JSON.parse(localStorage.getItem(SEED_KEY_APPTS) || '[]');
        existing.unshift(newApt);
        localStorage.setItem(SEED_KEY_APPTS, JSON.stringify(existing));
        showToast(`Booking scheduled for ${petName}!`, 'success');
        this.reset();
        renderUserAppointments();
        switchTab('appointments');
      });
    }

    const sbToggle = document.getElementById('user-sidebar-toggle');
    if (sbToggle && sbToggle.dataset.bound !== 'true') {
      sbToggle.dataset.bound = 'true';
      sbToggle.addEventListener('click', () => {
        document.getElementById('user-sidebar')?.classList.remove('-translate-x-full');
        document.getElementById('user-sidebar-backdrop')?.classList.remove('hidden');
      });
    }

    const sbClose = document.getElementById('user-sidebar-close');
    if (sbClose && sbClose.dataset.bound !== 'true') {
      sbClose.dataset.bound = 'true';
      sbClose.addEventListener('click', () => {
        document.getElementById('user-sidebar')?.classList.add('-translate-x-full');
        document.getElementById('user-sidebar-backdrop')?.classList.add('hidden');
      });
    }

    const sbBackdrop = document.getElementById('user-sidebar-backdrop');
    if (sbBackdrop && sbBackdrop.dataset.bound !== 'true') {
      sbBackdrop.dataset.bound = 'true';
      sbBackdrop.addEventListener('click', () => {
        document.getElementById('user-sidebar')?.classList.add('-translate-x-full');
        document.getElementById('user-sidebar-backdrop')?.classList.add('hidden');
      });
    }
  }

  function switchAdminTab(target) {
    document.querySelectorAll('.admin-pane').forEach(el => el.classList.add('hidden'));
    const active = document.getElementById('admin-tab-' + target);
    if (active) active.classList.remove('hidden');

    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
      if (btn.getAttribute('data-target') === target) {
        btn.className = 'admin-tab-btn w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 bg-emerald-800 text-white font-bold shadow-md';
      } else {
        btn.className = 'admin-tab-btn w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 hover:translate-x-1 font-semibold';
      }
    });

    const heading = document.getElementById('admin-tab-heading');
    if (heading) {
      const titles = {
        overview: 'Salon Operations Overview',
        appointments: 'Appointment Master Log',
        customers: 'Customer Accounts',
        pets: 'Pet Directory',
        services: 'Grooming Services Management',
        stylists: 'Stylists & Staff Directory',
        payments: 'Financial Ledger',
        reviews: 'Customer Reviews Moderation',
        reports: 'Revenue & Volume Reports',
        settings: 'Salon Operational Rules'
      };
      heading.textContent = titles[target] || 'Admin Console';
    }

    document.getElementById('admin-sidebar')?.classList.add('-translate-x-full');
    document.getElementById('admin-sidebar-backdrop')?.classList.add('hidden');
  }

  function renderAdminAppointments() {
    const tbody = document.getElementById('admin-appts-tbody');
    const cardsContainer = document.getElementById('admin-appts-cards');
    if (!tbody && !cardsContainer) return;

    const rawAppts = localStorage.getItem(SEED_KEY_APPTS);
    const appts = rawAppts ? JSON.parse(rawAppts) : [
      { id: 'APT-1082', petName: 'Milo', service: 'Luxury Spa & Hydro-Bath', specialist: 'Elena Rostova', date: '2026-10-18', time: '10:30 AM', status: 'Confirmed' },
      { id: 'APT-1049', petName: 'Luna', service: 'Silky Cat Dematting & Trim', specialist: 'Marcus Vance', date: '2026-09-24', time: '02:00 PM', status: 'Completed' },
      { id: 'APT-1031', petName: 'Charlie', service: 'Full Coat Scissor Cut', specialist: 'Elena Rostova', date: '2026-09-12', time: '11:00 AM', status: 'Confirmed' }
    ];

    const searchInput = document.getElementById('admin-apt-search');
    const filterInput = document.getElementById('admin-status-filter');
    const searchQuery = (searchInput?.value || '').toLowerCase().trim();
    const statusFilter = filterInput?.value || 'all';

    if (tbody) tbody.innerHTML = '';
    if (cardsContainer) cardsContainer.innerHTML = '';

    appts.forEach((apt, idx) => {
      const pet = String(apt?.petName || 'Pet');
      const refId = String(apt?.id || 'APT-000');
      const status = apt?.status || 'Confirmed';

      if (statusFilter !== 'all' && status !== statusFilter) return;
      if (searchQuery && !pet.toLowerCase().includes(searchQuery) && !refId.toLowerCase().includes(searchQuery)) return;

      const badgeColor = status === 'Confirmed'
        ? 'bg-emerald-100 text-emerald-800'
        : status === 'Completed'
          ? 'bg-blue-100 text-blue-800'
          : 'bg-rose-100 text-rose-800';

      if (tbody) {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors';
        tr.innerHTML = `
          <td class="p-4 font-mono font-bold text-stone-900 dark:text-white">${refId}</td>
          <td class="p-4 font-bold">${pet}</td>
          <td class="p-4">${apt.service || 'Grooming'}</td>
          <td class="p-4">${apt.specialist || 'Specialist'}</td>
          <td class="p-4 font-mono text-[11px]">${apt.date || ''} • ${apt.time || ''}</td>
          <td class="p-4"><span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ${badgeColor}">${status}</span></td>
          <td class="p-4 text-right space-x-2">
            ${status === 'Confirmed' ? `
              <button onclick="adminMarkComplete(${idx})" class="text-emerald-700 hover:text-emerald-800 font-bold hover:underline transition">Done</button>
              <button onclick="adminCancelApt(${idx})" class="text-rose-600 hover:text-rose-700 font-bold hover:underline transition">Cancel</button>
            ` : '<span class="text-stone-400">Archived</span>'}
          </td>
        `;
        tbody.appendChild(tr);
      }

      if (cardsContainer) {
        const card = document.createElement('div');
        card.className = 'bg-white dark:bg-[#16201D] p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-2.5';
        card.innerHTML = `
          <div class="flex items-center justify-between">
            <span class="font-mono font-bold text-xs text-stone-900 dark:text-white">${refId}</span>
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ${badgeColor}">${status}</span>
          </div>
          <div>
            <h4 class="font-bold text-sm text-stone-900 dark:text-white">${pet} • ${apt.service || 'Service'}</h4>
            <p class="text-[11px] text-stone-500">Stylist: ${apt.specialist || 'Specialist'}</p>
            <p class="text-[10px] text-stone-400 font-mono mt-0.5">${apt.date || ''} at ${apt.time || ''}</p>
          </div>
          ${status === 'Confirmed' ? `
            <div class="flex gap-2 pt-2 border-t border-stone-100 dark:border-stone-800/80">
              <button onclick="adminMarkComplete(${idx})" class="flex-1 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold text-xs hover:bg-emerald-100 transition">
                Mark Done
              </button>
              <button onclick="adminCancelApt(${idx})" class="flex-1 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 font-bold text-xs hover:bg-rose-100 transition">
                Cancel
              </button>
            </div>
          ` : ''}
        `;
        cardsContainer.appendChild(card);
      }
    });
  }

  function adminMarkComplete(index) {
    const appts = JSON.parse(localStorage.getItem(SEED_KEY_APPTS) || '[]');
    appts[index].status = 'Completed';
    localStorage.setItem(SEED_KEY_APPTS, JSON.stringify(appts));
    renderAdminAppointments();
    showToast('Appointment updated to Completed', 'success');
  }

  function adminCancelApt(index) {
    const appts = JSON.parse(localStorage.getItem(SEED_KEY_APPTS) || '[]');
    appts[index].status = 'Cancelled';
    localStorage.setItem(SEED_KEY_APPTS, JSON.stringify(appts));
    renderAdminAppointments();
    showToast('Appointment marked as Cancelled', 'info');
  }

  function renderAdminPets() {
    const tbody = document.getElementById('admin-pets-tbody');
    const cardsContainer = document.getElementById('admin-pets-cards');
    if (!tbody && !cardsContainer) return;

    const pets = JSON.parse(localStorage.getItem(SEED_KEY_PETS) || '[]');
    if (tbody) tbody.innerHTML = '';
    if (cardsContainer) cardsContainer.innerHTML = '';

    pets.forEach(p => {
      if (tbody) {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors duration-150';
        tr.innerHTML = `
          <td class="p-4 font-bold text-stone-900 dark:text-white">${p.name}</td>
          <td class="p-4">Sarah Chen</td>
          <td class="p-4">${p.breed} (${p.species})</td>
          <td class="p-4 text-stone-500">${p.notes || 'Normal skin.'}</td>
        `;
        tbody.appendChild(tr);
      }

      if (cardsContainer) {
        const card = document.createElement('div');
        card.className = 'bg-white dark:bg-[#16201D] p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-1.5';
        card.innerHTML = `
          <div class="flex items-center justify-between">
            <h4 class="font-bold text-sm text-stone-900 dark:text-white">${p.name}</h4>
            <span class="text-xs font-bold text-amber-600">${p.breed}</span>
          </div>
          <p class="text-xs text-stone-500">Owner: Sarah Chen • <span class="capitalize">${p.species}</span></p>
          <p class="text-[11px] text-stone-400 pt-1 border-t border-stone-100 dark:border-stone-800/80">${p.notes || 'No special sensitivities noted.'}</p>
        `;
        cardsContainer.appendChild(card);
      }
    });
  }

  function renderAdminPayments() {
    const tbody = document.getElementById('admin-payments-tbody');
    const cardsContainer = document.getElementById('admin-payments-cards');
    if (!tbody && !cardsContainer) return;

    const receipts = JSON.parse(localStorage.getItem(SEED_KEY_RECEIPTS) || '[]');
    if (tbody) tbody.innerHTML = '';
    if (cardsContainer) cardsContainer.innerHTML = '';

    receipts.forEach(r => {
      if (tbody) {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors duration-150';
        tr.innerHTML = `
          <td class="p-4 font-mono font-bold text-stone-900 dark:text-white">${r.ref}</td>
          <td class="p-4 font-mono text-[11px]">${r.date}</td>
          <td class="p-4 font-bold">Sarah Chen</td>
          <td class="p-4">${r.service}</td>
          <td class="p-4 font-bold text-emerald-700 dark:text-emerald-400">${r.amount}</td>
          <td class="p-4"><span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">Paid</span></td>
        `;
        tbody.appendChild(tr);
      }

      if (cardsContainer) {
        const card = document.createElement('div');
        card.className = 'bg-white dark:bg-[#16201D] p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm flex items-center justify-between gap-3 text-xs';
        card.innerHTML = `
          <div class="space-y-0.5 min-w-0">
            <div class="flex items-center gap-2">
              <span class="font-mono font-bold text-stone-900 dark:text-white text-xs">${r.ref}</span>
              <span class="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold">Paid</span>
            </div>
            <p class="font-medium text-stone-700 dark:text-stone-300 truncate">${r.service}</p>
            <p class="text-[10px] text-stone-400 font-mono">${r.date} • Sarah Chen</p>
          </div>
          <div class="text-right flex-shrink-0">
            <span class="font-black text-sm text-emerald-700 dark:text-emerald-400">${r.amount}</span>
          </div>
        `;
        cardsContainer.appendChild(card);
      }
    });
  }

  function renderAdminServices() {
    const grid = document.getElementById('admin-services-grid');
    if (!grid) return;
    const services = JSON.parse(localStorage.getItem(SEED_KEY_SERVICES) || '[]');
    grid.innerHTML = '';

    services.forEach(s => {
      const card = document.createElement('div');
      card.className = 'bg-white dark:bg-[#16201D] p-5 rounded-3xl border border-stone-200 dark:border-stone-800 space-y-2 shadow-sm card-hover';
      card.innerHTML = `
        <div class="flex justify-between items-start">
          <h4 class="font-bold text-stone-900 dark:text-white">${s.title}</h4>
          <span class="font-black text-emerald-700 dark:text-emerald-400">${s.price}</span>
        </div>
        <p class="text-stone-400 text-[11px]">${s.duration}</p>
        <p class="text-xs text-stone-500">${s.desc}</p>
      `;
      grid.appendChild(card);
    });
  }

  function openAddServiceModal() {
    const modal = document.getElementById('add-service-modal');
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
  }

  function closeAddServiceModal() {
    const modal = document.getElementById('add-service-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  }

  function initAdminDashboardListeners() {
    const servForm = document.getElementById('add-service-form');
    if (servForm && servForm.dataset.bound !== 'true') {
      servForm.dataset.bound = 'true';
      servForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const title = document.getElementById('new-serv-title')?.value.trim();
        const price = document.getElementById('new-serv-price')?.value.trim();
        const duration = document.getElementById('new-serv-duration')?.value.trim() || '60 Mins';
        const desc = document.getElementById('new-serv-desc')?.value.trim();

        if (!title || !price) return;

        const services = JSON.parse(localStorage.getItem(SEED_KEY_SERVICES) || '[]');
        services.push({ title, price, duration, desc });
        localStorage.setItem(SEED_KEY_SERVICES, JSON.stringify(services));
        renderAdminServices();
        closeAddServiceModal();
        this.reset();
        showToast(`Service "${title}" added to salon menu!`, 'success');
      });
    }

    const aptSearch = document.getElementById('admin-apt-search');
    if (aptSearch && aptSearch.dataset.bound !== 'true') {
      aptSearch.dataset.bound = 'true';
      aptSearch.addEventListener('input', renderAdminAppointments);
    }

    const dropBtn = document.getElementById('status-dropdown-btn');
    const dropMenu = document.getElementById('status-dropdown-menu');
    const chevron = document.getElementById('status-chevron');
    const filterInput = document.getElementById('admin-status-filter');
    const labelSpan = document.getElementById('selected-status-label');

    if (dropBtn && dropMenu && dropBtn.dataset.bound !== 'true') {
      dropBtn.dataset.bound = 'true';
      dropBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropMenu.classList.toggle('hidden');
        chevron?.classList.toggle('rotate-180');
      });

      document.querySelectorAll('.status-option').forEach(opt => {
        opt.addEventListener('click', () => {
          const val = opt.getAttribute('data-val');
          if (filterInput) filterInput.value = val;
          if (labelSpan) labelSpan.textContent = opt.textContent;
          dropMenu.classList.add('hidden');
          chevron?.classList.remove('rotate-180');
          renderAdminAppointments();
        });
      });

      document.addEventListener('click', () => {
        dropMenu.classList.add('hidden');
        chevron?.classList.remove('rotate-180');
      });
    }

    const admToggle = document.getElementById('admin-sidebar-toggle');
    if (admToggle && admToggle.dataset.bound !== 'true') {
      admToggle.dataset.bound = 'true';
      admToggle.addEventListener('click', () => {
        document.getElementById('admin-sidebar')?.classList.remove('-translate-x-full');
        document.getElementById('admin-sidebar-backdrop')?.classList.remove('hidden');
      });
    }

    const admClose = document.getElementById('admin-sidebar-close');
    if (admClose && admClose.dataset.bound !== 'true') {
      admClose.dataset.bound = 'true';
      admClose.addEventListener('click', () => {
        document.getElementById('admin-sidebar')?.classList.add('-translate-x-full');
        document.getElementById('admin-sidebar-backdrop')?.classList.add('hidden');
      });
    }

    const admBackdrop = document.getElementById('admin-sidebar-backdrop');
    if (admBackdrop && admBackdrop.dataset.bound !== 'true') {
      admBackdrop.dataset.bound = 'true';
      admBackdrop.addEventListener('click', () => {
        document.getElementById('admin-sidebar')?.classList.add('-translate-x-full');
        document.getElementById('admin-sidebar-backdrop')?.classList.add('hidden');
      });
    }
  }

  function setupPublicBookingForm() {
    const bookingForm = document.getElementById('appointment-booking-form');
    if (!bookingForm || bookingForm.dataset.bound === 'true') return;
    bookingForm.dataset.bound = 'true';

    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const ownerName = document.getElementById('book-owner-name')?.value.trim();
      const ownerEmail = document.getElementById('book-owner-email')?.value.trim();
      const petName = document.getElementById('book-pet-name')?.value.trim();
      const petBreed = document.getElementById('book-pet-breed')?.value.trim() || 'Mixed Breed';
      const service = document.getElementById('book-service')?.value;
      const specialist = document.getElementById('book-specialist')?.value || 'First Available Specialist';
      const date = document.getElementById('book-date')?.value;
      const time = document.getElementById('book-time')?.value;

      if (!ownerName || !ownerEmail || !petName || !service || !date || !time) {
        showToast('Please fill all required appointment fields.', 'error');
        return;
      }

      const newApt = {
        id: 'APT-' + Math.floor(1000 + Math.random() * 9000),
        petName,
        petBreed,
        ownerName,
        ownerEmail,
        service,
        specialist,
        date,
        time,
        status: 'Confirmed',
        price: '$85.00'
      };

      const existing = JSON.parse(localStorage.getItem(SEED_KEY_APPTS) || '[]');
      existing.unshift(newApt);
      localStorage.setItem(SEED_KEY_APPTS, JSON.stringify(existing));

      showToast(`Booking Successful! Ref #${newApt.id} registered for ${petName}`, 'success');
      bookingForm.reset();

      const confMsg = document.getElementById('booking-confirmation-msg');
      if (confMsg) {
        confMsg.classList.remove('hidden');
        confMsg.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  function initTestimonialSlider() {
    const slider = document.getElementById('testimonial-slider');
    const prevBtn = document.getElementById('testi-prev');
    const nextBtn = document.getElementById('testi-next');
    if (!slider || !prevBtn || !nextBtn || slider.dataset.bound === 'true') return;
    slider.dataset.bound = 'true';

    let currentIndex = 0;
    const cards = slider.querySelectorAll('.testimonial-slide');
    if (!cards.length) return;

    function showSlide(index) {
      cards.forEach((card, i) => {
        card.classList.toggle('hidden', i !== index);
      });
    }

    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex === 0) ? cards.length - 1 : currentIndex - 1;
      showSlide(currentIndex);
    });

    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex === cards.length - 1) ? 0 : currentIndex + 1;
      showSlide(currentIndex);
    });

    showSlide(0);
  }

  function setupFaqAccordion() {
    const accordions = document.querySelectorAll('.faq-accordion-item');
    if (!accordions.length) return;

    accordions.forEach(item => {
      if (item.dataset.bound === 'true') return;
      item.dataset.bound = 'true';

      const btn = item.querySelector('.faq-question-btn');
      const ans = item.querySelector('.faq-answer-content');
      const icon = item.querySelector('.faq-chevron');

      if (!btn || !ans) return;

      btn.addEventListener('click', () => {
        const isOpen = !ans.classList.contains('hidden');
        accordions.forEach(other => {
          const otherAns = other.querySelector('.faq-answer-content');
          const otherIcon = other.querySelector('.faq-chevron');
          if (otherAns) otherAns.classList.add('hidden');
          if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
        });

        if (!isOpen) {
          ans.classList.remove('hidden');
          if (icon) icon.style.transform = 'rotate(180deg)';
        }
      });
    });

    const searchInput = document.getElementById('faq-search-input');
    if (searchInput && searchInput.dataset.bound !== 'true') {
      searchInput.dataset.bound = 'true';
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        let matches = 0;

        accordions.forEach(item => {
          const text = item.textContent.toLowerCase();
          if (text.includes(query)) {
            item.classList.remove('hidden');
            matches++;
          } else {
            item.classList.add('hidden');
          }
        });

        const noResults = document.getElementById('faq-no-results');
        if (noResults) {
          noResults.classList.toggle('hidden', matches > 0);
        }
      });
    }
  }

  function setupBlogFeatures() {
    const filterButtons = document.querySelectorAll('.blog-filter-btn');
    const articles = document.querySelectorAll('.blog-card-item');

    if (filterButtons.length && articles.length) {
      filterButtons.forEach(btn => {
        if (btn.dataset.bound === 'true') return;
        btn.dataset.bound = 'true';

        btn.addEventListener('click', () => {
          filterButtons.forEach(b => {
            b.classList.remove('bg-emerald-800', 'text-white', 'shadow-md');
            b.classList.add('bg-stone-100', 'dark:bg-stone-800', 'text-stone-700', 'dark:text-stone-300');
          });
          btn.classList.add('bg-emerald-800', 'text-white', 'shadow-md');
          btn.classList.remove('bg-stone-100', 'dark:bg-stone-800', 'text-stone-700', 'dark:text-stone-300');

          const category = btn.getAttribute('data-category');
          articles.forEach(card => {
            if (category === 'all' || card.getAttribute('data-category') === category) {
              card.classList.remove('hidden');
            } else {
              card.classList.add('hidden');
            }
          });
        });
      });
    }

    const readBtns = document.querySelectorAll('.blog-read-btn');
    const modal = document.getElementById('blog-read-modal');
    const closeBtn = document.getElementById('close-blog-modal');
    if (readBtns.length && modal && closeBtn) {
      readBtns.forEach(btn => {
        if (btn.dataset.bound === 'true') return;
        btn.dataset.bound = 'true';

        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const title = btn.getAttribute('data-title') || 'Pet Care Guide';
          const content = btn.getAttribute('data-content') || 'Full detailed care instructions...';
          document.getElementById('modal-blog-title').textContent = title;
          document.getElementById('modal-blog-body').textContent = content;
          modal.classList.remove('hidden');
          modal.classList.add('flex');
        });
      });

      if (closeBtn.dataset.bound !== 'true') {
        closeBtn.dataset.bound = 'true';
        closeBtn.addEventListener('click', () => {
          modal.classList.add('hidden');
          modal.classList.remove('flex');
        });
      }
    }
  }

  function setupPasswordToggles() {
    const toggles = document.querySelectorAll('.password-toggle-trigger');
    toggles.forEach(trigger => {
      if (trigger.dataset.bound === 'true') return;
      trigger.dataset.bound = 'true';

      trigger.addEventListener('click', () => {
        const input = trigger.parentElement.querySelector('input');
        if (!input) return;
        const icon = trigger.querySelector('i');
        if (input.type === 'password') {
          input.type = 'text';
          if (icon) icon.className = 'fas fa-eye-slash text-stone-400';
        } else {
          input.type = 'password';
          if (icon) icon.className = 'fas fa-eye text-stone-400';
        }
      });
    });
  }

  window.PawSpaw = {
    showToast,
    toggleTheme,
    toggleDirection
  };

  window.switchTab = switchTab;
  window.deletePet = deletePet;
  window.cancelUserApt = cancelUserApt;
  window.openReceiptModal = openReceiptModal;
  window.closeReceiptModal = closeReceiptModal;
  window.openAddPetModal = openAddPetModal;
  window.closeAddPetModal = closeAddPetModal;
  window.openLogoutModal = openLogoutModal;
  window.closeLogoutModal = closeLogoutModal;
  window.confirmLogout = confirmLogout;
  window.clearNotifications = clearNotifications;

  window.switchAdminTab = switchAdminTab;
  window.adminMarkComplete = adminMarkComplete;
  window.adminCancelApt = adminCancelApt;
  window.openAddServiceModal = openAddServiceModal;
  window.closeAddServiceModal = closeAddServiceModal;
  window.renderAdminAppointments = renderAdminAppointments;
  window.renderAdminPets = renderAdminPets;
  window.renderAdminPayments = renderAdminPayments;
  window.renderAdminServices = renderAdminServices;

  document.addEventListener('DOMContentLoaded', () => {
    seedInitialDemoData();
    initTheme();
    initDirection();
    renderNavbar();
    renderFooter();

    renderUserPets();
    renderUserAppointments();
    renderUserReceipts();
    initUserDashboardListeners();

    renderAdminAppointments();
    renderAdminPets();
    renderAdminPayments();
    renderAdminServices();
    initAdminDashboardListeners();

    setupPublicBookingForm();
    initTestimonialSlider();
    setupFaqAccordion();
    setupBlogFeatures();
    setupPasswordToggles();
    setupSpaNavigation();
  });

})();