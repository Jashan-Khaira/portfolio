/* Portfolio interactions: blog rendering, nav, reveal-on-scroll, counters. */
(function () {
  "use strict";

  var MEDIUM_PROFILE = "https://medium.com/@jashankhaira52";

  /* ---------- Mobile nav ---------- */
  var toggle = document.getElementById("nav-toggle");
  var links = document.getElementById("nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") links.classList.remove("open");
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("visible");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- Animated stat counters ---------- */
  var counters = document.querySelectorAll(".stat-num[data-count]");
  function animateCounter(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var suffix = el.getAttribute("data-suffix") || "";
    var dur = 1200, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      requestAnimationFrame(step);
    } else {
      el.textContent = target + suffix;
    }
  }
  if ("IntersectionObserver" in window && counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { animateCounter(en.target); cio.unobserve(en.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Blog posts ---------- */
  function formatDate(iso) {
    var d = new Date(iso + "T12:00:00");
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function renderPosts(posts) {
    var grid = document.getElementById("posts-grid");
    if (!grid) return;
    if (!posts || !posts.length) {
      grid.innerHTML = '<p class="posts-empty">New labs are on the way — check back soon.</p>';
      return;
    }
    var html = posts.map(function (p) {
      var url = p.url || MEDIUM_PROFILE;
      var img = p.image
        ? '<div class="post-thumb"><img src="' + esc(p.image) + '" alt="' + esc(p.title) + '" loading="lazy"></div>'
        : "";
      return (
        '<a class="post-card reveal visible" href="' + esc(url) + '" target="_blank" rel="noopener">' +
          img +
          '<div class="post-body">' +
            '<p class="post-date">' + esc(formatDate(p.date)) + '</p>' +
            "<h3>" + esc(p.title) + "</h3>" +
            "<p>" + esc(p.description) + "</p>" +
            '<span class="post-more">Read on Medium →</span>' +
          "</div>" +
        "</a>"
      );
    }).join("");
    grid.innerHTML = html;
  }

  fetch("posts.json", { cache: "no-store" })
    .then(function (r) { if (!r.ok) throw new Error("no posts"); return r.json(); })
    .then(function (posts) {
      posts.sort(function (a, b) { return b.date.localeCompare(a.date); });
      renderPosts(posts);
    })
    .catch(function () { renderPosts([]); });
})();
