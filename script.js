// script.js — Ultra Smooth Animation + Reservation Backend Connection

(function () {
  "use strict";

  // =====================================================
  // CANVAS ANIMATION (UNCHANGED)
  // =====================================================

  const canvas = document.getElementById("heroCanvas");

  if (canvas) {
    const ctx = canvas.getContext("2d", { alpha: false });

    const BLOB_COUNT = 3;
    const FPS = 24;
    const SPEED = 0.08;
    const BASE_COLOR = "#fcf7f0";

    const COLORS = [
      "rgba(198,161,91,0.35)",
      "rgba(196,138,60,0.30)",
      "rgba(106,74,58,0.25)",
      "rgba(235,201,156,0.40)",
      "rgba(47,75,60,0.20)"
    ];

    let blobs = [];
    let width, height;
    let lastFrame = 0;
    const frameTime = 1000 / FPS;
    let animActive = true;

    const heroSection = document.getElementById('hero');
    const observer = new IntersectionObserver((entries) => {
      animActive = entries[0].isIntersecting;
    }, { threshold: 0.1 });

    if (heroSection) observer.observe(heroSection);

    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

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

    function animate(timestamp) {
      if (animActive && timestamp - lastFrame >= frameTime) {
        update();
        draw();
        lastFrame = timestamp;
      }
      requestAnimationFrame(animate);
    }

    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resizeCanvas();
        createBlobs();
      }, 150);
    });

    resizeCanvas();
    createBlobs();
    requestAnimationFrame(animate);
  }

  // =====================================================
  // MOBILE MENU
  // =====================================================

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

  // =====================================================
  // RESERVATION FORM → RENDER BACKEND
  // =====================================================

  const form = document.getElementById("reservationForm");
  const messageBox = document.getElementById("formMessage");

  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const data = {
        name: form.name.value,
        email: form.email.value,
        phone: form.phone.value,
        date: form.date.value,
        time: form.time.value,
        guests: form.guests.value,
        message: form.message.value
      };

      try {
        const response = await fetch(
          "https://circa-lagos-reservers.onrender.com/reservations",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
          }
        );

        const result = await response.json();

        if (response.ok) {
          showMessage("Reservation sent successfully ✅", "success");
          form.reset();
        } else {
          showMessage("Something went wrong ❌", "error");
        }

      } catch (error) {
        console.error(error);
        showMessage("Server not responding ❌", "error");
      }
    });
  }

  function showMessage(text, type) {
    if (!messageBox) return;

    messageBox.textContent = text;
    messageBox.style.display = "block";
    messageBox.style.color = type === "success" ? "green" : "red";

    setTimeout(() => {
      messageBox.style.display = "none";
    }, 5000);
  }

})();
