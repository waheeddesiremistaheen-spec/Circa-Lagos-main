// script.js — Ultra Smooth, Pauses When Out of View, Zero Lag
// Standalone client-side animation & mobile menu – no server dependencies.

(function () {
  "use strict";

  // ---------- CANVAS ANIMATION ----------
  const canvas = document.getElementById("heroCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: false });

  // ===== CONFIG =====
  const BLOB_COUNT = 3;
  const FPS = 24;
  const SPEED = 0.08;
  const BASE_COLOR = "#fcf7f0";

  const COLORS = [
    "rgba(198,161,91,0.35)",   // gold
    "rgba(196,138,60,0.30)",   // amber
    "rgba(106,74,58,0.25)",    // brown
    "rgba(235,201,156,0.40)",  // warm yellow
    "rgba(47,75,60,0.20)"      // green
  ];

  let blobs = [];
  let width, height;
  let lastFrame = 0;
  const frameTime = 1000 / FPS;
  let animActive = true;

  // ===== Pause animation when hero is out of view =====
  const heroSection = document.getElementById('hero');
  const observer = new IntersectionObserver((entries) => {
    animActive = entries[0].isIntersecting;
  }, { threshold: 0.1 });
  if (heroSection) observer.observe(heroSection);

  // ===== Resize Canvas =====
  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  // ===== Create Blobs =====
  function createBlobs() {
    blobs = [];
    for (let i = 0; i < BLOB_COUNT; i++) {
      blobs.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * SPEED,
        vy: (Math.random() - 0.5) * SPEED,
        radius: 200 + Math.random() * 180,
        color: COLORS[Math.floor(Math.random() * COLORS.length)]
      });
    }
  }

  // ===== Update Movement =====
  function update() {
    for (let b of blobs) {
      b.x += b.vx;
      b.y += b.vy;

      if (b.x < -300) b.x = width + 300;
      if (b.x > width + 300) b.x = -300;
      if (b.y < -300) b.y = height + 300;
      if (b.y > height + 300) b.y = -300;
    }
  }

  // ===== Draw Background =====
  function draw() {
    ctx.fillStyle = BASE_COLOR;
    ctx.fillRect(0, 0, width, height);

    for (let b of blobs) {
      const gradient = ctx.createRadialGradient(
        b.x, b.y, 0,
        b.x, b.y, b.radius
      );

      gradient.addColorStop(0, b.color);
      gradient.addColorStop(1, "transparent");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // ===== Animation Loop =====
  function animate(timestamp) {
    if (animActive && timestamp - lastFrame >= frameTime) {
      update();
      draw();
      lastFrame = timestamp;
    }
    requestAnimationFrame(animate);
  }

  // ===== Debounced Resize =====
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resizeCanvas();
      createBlobs();
    }, 150);
  });

  // ===== Initialize Canvas =====
  function initCanvas() {
    resizeCanvas();
    createBlobs();
    requestAnimationFrame(animate);
  }

  initCanvas();

  // ---------- MOBILE MENU TOGGLE ----------
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-links a');

  if (mobileMenuBtn && navbar) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navbar.classList.contains('nav-open');
      navbar.classList.toggle('nav-open');
      mobileMenuBtn.setAttribute('aria-expanded', !isOpen);
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navbar.classList.remove('nav-open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && navbar.classList.contains('nav-open')) {
        navbar.classList.remove('nav-open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }
})();