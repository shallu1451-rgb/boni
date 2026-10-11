// Script for Baibhav Collections - Shipping & Delivery Policy Page

document.addEventListener('DOMContentLoaded', () => {
  // 1. PIN Code Checker Logic
  initPincodeChecker();

  // 2. FAQ Accordion Logic
  initAccordion();

  // 3. Sidebar Active Nav & Smooth Scrolling
  initSidebarScrollSpy();
});

/**
 * PIN Code Serviceability Checker
 * Provides real-time feedback for Indian Pincodes
 */
function initPincodeChecker() {
  const form = document.getElementById('pincodeForm');
  const input = document.getElementById('pincodeInput');
  const resultDiv = document.getElementById('pincodeResult');

  if (!form || !input || !resultDiv) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const pin = input.value.trim();

    // Reset previous states
    resultDiv.className = 'pincode-result';
    resultDiv.style.display = 'none';

    // Basic 6-digit Indian PIN code check
    const pinRegex = /^[1-9][0-9]{5}$/;

    if (!pinRegex.test(pin)) {
      resultDiv.className = 'pincode-result non-serviceable';
      resultDiv.innerHTML = `<strong>Invalid PIN Code:</strong> Please enter a valid 6-digit Indian postal code (e.g., 110001, 400001, 700001, 560001).`;
      resultDiv.style.display = 'block';
      return;
    }

    // Determine estimated days based on first digit (regional estimate)
    // 1: Delhi/North, 2: UP/Uttarakhand, 3: Rajasthan/Gujarat, 4: Maharashtra/Goa/MP/CG
    // 5: AP/Telangana/Karnataka, 6: TN/Kerala, 7: East (WB/Odisha/NE), 8: Bihar/Jharkhand
    let estDays = '3 - 5 Business Days';
    let zoneName = 'Standard Zone';
    const firstDigit = pin.charAt(0);

    if (['1', '2'].includes(firstDigit)) {
      estDays = '2 - 4 Business Days';
      zoneName = 'Northern Express Zone';
    } else if (['4', '5'].includes(firstDigit)) {
      estDays = '3 - 5 Business Days';
      zoneName = 'Central & Western Hub';
    } else if (['6', '7', '8'].includes(firstDigit)) {
      estDays = '4 - 6 Business Days';
      zoneName = 'Southern & Eastern Zone';
    }

    // High altitude / Remote regions check
    const isRemote = pin.startsWith('19') || pin.startsWith('79'); // J&K / parts of NE

    if (isRemote) {
      resultDiv.className = 'pincode-result serviceable';
      resultDiv.innerHTML = `
        <strong>Serviceable (Special Air Transit):</strong> PIN Code <strong>${pin}</strong> is covered via Air Express!
        <br>Estimated delivery timeline: <strong>5 - 7 Business Days</strong>. Both Prepaid & COD available.
      `;
    } else {
      resultDiv.className = 'pincode-result serviceable';
      resultDiv.innerHTML = `
        <strong>Great News! Delivery Available:</strong> PIN Code <strong>${pin}</strong> (${zoneName}) is fully serviceable.
        <br>Estimated Delivery: <strong>${estDays}</strong> &bull; Cash on Delivery (COD) &amp; Prepaid Available &bull; <strong>Extra 5% OFF</strong> on Prepaid orders.
      `;
    }

    resultDiv.style.display = 'block';
  });
}

/**
 * Accordion Expand/Collapse Functionality
 */
function initAccordion() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach((header) => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const body = item.querySelector('.accordion-body');
      const isActive = item.classList.contains('active');

      // Close all other items (optional single-open behavior)
      document.querySelectorAll('.accordion-item').forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherBody = otherItem.querySelector('.accordion-body');
          if (otherBody) otherBody.style.maxHeight = null;
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
        body.style.maxHeight = null;
      } else {
        item.classList.add('active');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });
}

/**
 * ScrollSpy & Sticky Sidebar Navigation
 */
function initSidebarScrollSpy() {
  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  const sections = document.querySelectorAll('.policy-card');

  if (sidebarLinks.length === 0 || sections.length === 0) return;

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 140;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    if (currentId) {
      sidebarLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

/**
 * Quick Add To Cart Toast Notification
 */
function handleAddToCart(productName) {
  // Remove existing toast if any
  const existing = document.querySelector('.cart-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'cart-toast';
  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c29d59" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
    <div>
      <strong>Added to Bag!</strong><br>
      <span style="font-size: 0.8125rem; opacity: 0.85;">${productName}</span>
    </div>
  `;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 400);
  }, 3200);
}

