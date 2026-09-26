/* Gallery: renders photos from photos.json, lightbox viewer. */
(function () {
  "use strict";

  var gallery = document.getElementById("gallery");
  var empty = document.getElementById("empty");
  var count = document.getElementById("count");
  var photos = [];
  var current = 0;

  var lightbox = document.getElementById("lightbox");
  var lbImg = document.getElementById("lb-img");
  var lbCap = document.getElementById("lb-cap");

  function render() {
    gallery.innerHTML = "";
    if (!photos.length) {
      empty.hidden = false;
      count.textContent = "";
      return;
    }
    empty.hidden = true;
    count.textContent = photos.length + (photos.length === 1 ? " photo" : " photos");
    photos.forEach(function (p, i) {
      var fig = document.createElement("figure");
      var img = document.createElement("img");
      img.src = p.src;
      img.alt = p.caption || ("Gallery illustration " + (i + 1));
      img.loading = "lazy";
      var cap = document.createElement("figcaption");
      cap.textContent = p.caption || "";
      fig.appendChild(img);
      fig.appendChild(cap);
      fig.addEventListener("click", function () { open(i); });
      gallery.appendChild(fig);
    });
  }

  function open(i) {
    current = i;
    show();
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  }
  function close() {
    lightbox.hidden = true;
    document.body.style.overflow = "";
  }
  function show() {
    var p = photos[current];
    lbImg.src = p.src;
    lbImg.alt = p.caption || ("Gallery illustration " + (current + 1));
    lbCap.textContent = p.caption || "";
  }
  function step(d) {
    current = (current + d + photos.length) % photos.length;
    show();
  }

  document.querySelector(".lb-close").addEventListener("click", close);
  document.querySelector(".lb-prev").addEventListener("click", function (e) { e.stopPropagation(); step(-1); });
  document.querySelector(".lb-next").addEventListener("click", function (e) { e.stopPropagation(); step(1); });
  lightbox.addEventListener("click", function (e) { if (e.target === lightbox) close(); });
  document.addEventListener("keydown", function (e) {
    if (lightbox.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });

  document.getElementById("year").textContent = new Date().getFullYear();

  fetch("photos.json")
    .then(function (r) { return r.ok ? r.json() : []; })
    .then(function (data) { photos = Array.isArray(data) ? data : []; render(); })
    .catch(function () { photos = []; render(); });
})();
