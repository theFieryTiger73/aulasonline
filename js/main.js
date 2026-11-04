(function () {
  document.documentElement.classList.add("js");

  var progress = document.getElementById("scrollProgress");
  var sticky = document.getElementById("stickyCta");
  var offer = document.getElementById("oferta");
  var reveals = document.querySelectorAll(".reveal");

  function revealAll() {
    reveals.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  function onScroll() {
    var doc = document.documentElement;
    var max = doc.scrollHeight - doc.clientHeight;
    var pct = max > 0 ? (doc.scrollTop / max) * 100 : 0;
    if (progress) progress.style.width = pct + "%";

    if (sticky && offer) {
      var show = window.scrollY > 520;
      sticky.classList.toggle("is-visible", show);
      sticky.setAttribute("aria-hidden", show ? "false" : "true");
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.01, rootMargin: "80px 0px 80px 0px" });

    reveals.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealAll();
  }

  window.setTimeout(revealAll, 600);

  document.querySelectorAll(".video__frame[data-video]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (btn.classList.contains("is-playing")) return;
      var id = btn.getAttribute("data-video");
      if (!id) return;
      var iframe = document.createElement("iframe");
      iframe.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0";
      iframe.title = btn.getAttribute("aria-label") || "Aula KAIZEN SPEAK";
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.setAttribute("allowfullscreen", "");
      btn.innerHTML = "";
      btn.appendChild(iframe);
      btn.classList.add("is-playing");
    });
  });
})();
