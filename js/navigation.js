// Mobile menu and dropdown functionality
document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  
  // Toggle mobile menu
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function(e) {
      e.preventDefault();
      this.classList.toggle('active');
      nav.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });
  }
  
  // Dropdown functionality for mobile
  const dropdownToggles = document.querySelectorAll('.dropdown > .dropbtn');
  
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      if (window.innerWidth <= 992) {
        e.preventDefault();
        const dropdown = this.parentElement;
        dropdown.classList.toggle('active');
      }
    });
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.nav') && !e.target.closest('.menu-toggle')) {
      if (window.innerWidth <= 992) {
        nav?.classList.remove('active');
        menuToggle?.classList.remove('active');
        document.body.classList.remove('menu-open');
      }
    }
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.dropdown')) {
      document.querySelectorAll('.dropdown').forEach(dropdown => {
        dropdown.classList.remove('active');
      });
    }
  });
  
  // Close menu when clicking on a nav link (for single page navigation)
  const navLinks = document.querySelectorAll('.nav-list a:not(.dropbtn)');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (window.innerWidth <= 992) {
        nav?.classList.remove('active');
        menuToggle?.classList.remove('active');
        document.body.classList.remove('menu-open');
      }
    });
  });
  
  // Update active link based on current page
  updateActiveLink();
});

// Update active navigation link based on current URL
function updateActiveLink() {
  const currentLocation = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-list a');
  
  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    
    // Remove active class from all links
    link.classList.remove('active');
    
    // Add active class to current page link
    if ((linkHref === currentLocation) || 
        (currentLocation === '' && linkHref === 'index.html') ||
        (linkHref !== '#' && currentLocation.includes(linkHref))) {
      link.classList.add('active');
      
      // If this is a dropdown item, also mark the parent dropdown as active
      const parentDropdown = link.closest('.dropdown');
      if (parentDropdown) {
        parentDropdown.querySelector('.dropbtn')?.classList.add('active');
      }
    }
  });
}

// Cart functionality has been removed
