// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  const menuOverlay = document.getElementById('menuOverlay');
  
  // Toggle mobile menu
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      toggleMenu();
    });
  }
  
  // Close menu when clicking on overlay
  if (menuOverlay) {
    menuOverlay.addEventListener('click', function() {
      closeMenu();
    });
  }
  
  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    if (mainNav?.classList.contains('active') && 
        !e.target.closest('.main-nav') && 
        !e.target.closest('.menu-toggle')) {
      closeMenu();
    }
  });
  
  // Close menu when clicking on a nav link
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      closeMenu();
    });
  });
  
  // Update active link based on current page
  updateActiveLink();
  
  // Close menu when window is resized to desktop
  window.addEventListener('resize', function() {
    if (window.innerWidth > 992) {
      closeMenu();
    }
  });
});

// Toggle menu function
function toggleMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  const body = document.body;
  
  if (menuToggle && mainNav) {
    menuToggle.classList.toggle('active');
    mainNav.classList.toggle('active');
    body.classList.toggle('menu-open');
    
    // Toggle aria-expanded attribute
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
    menuToggle.setAttribute('aria-expanded', !isExpanded);
    
    // Toggle overflow on body
    if (body.classList.contains('menu-open')) {
      body.style.overflow = 'hidden';
    } else {
      body.style.overflow = '';
    }
  }
}

// Close menu function
function closeMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  const body = document.body;
  
  if (menuToggle && mainNav) {
    menuToggle.classList.remove('active');
    mainNav.classList.remove('active');
    body.classList.remove('menu-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    body.style.overflow = '';
  }
}

// Update active navigation link based on current URL
function updateActiveLink() {
  const currentLocation = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    
    // Remove active class from all links
    link.classList.remove('active');
    link.removeAttribute('aria-current');
    
    // Add active class to current page link
    if ((linkHref === currentLocation) || 
        (currentLocation === '' && linkHref === 'index.html') ||
        (linkHref !== '#' && currentLocation.includes(linkHref))) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
}
