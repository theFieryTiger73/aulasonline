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

  var ytReadyQ = [];
  function whenYtReady(fn) {
    if (window.YT && window.YT.Player) {
      fn();
      return;
    }
    ytReadyQ.push(fn);
    if (document.getElementById("yt-api")) return;
    var prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = function () {
      if (prev) prev();
      while (ytReadyQ.length) ytReadyQ.shift()();
    };
    var s = document.createElement("script");
    s.id = "yt-api";
    s.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(s);
  }

  function jumpMid(player) {
    if (player._mid) return;
    var dur = player.getDuration();
    if (!dur || dur < 4) return;
    player._mid = true;
    player.seekTo(dur / 2, true);
  }

  document.querySelectorAll(".video__frame[data-video]").forEach(function (btn, i) {
    btn.addEventListener("click", function () {
      if (btn.classList.contains("is-playing")) return;
      var id = btn.getAttribute("data-video");
      if (!id) return;
      var iframe = document.createElement("iframe");
      var frameId = "yt-player-" + i;
      iframe.id = frameId;
      iframe.src = "https://www.youtube.com/embed/" + id + "?autoplay=1&rel=0&enablejsapi=1&modestbranding=1&origin=" + encodeURIComponent(window.location.origin);
      iframe.title = btn.getAttribute("aria-label") || "Aula KAIZEN SPEAK";
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.setAttribute("allowfullscreen", "");
      btn.innerHTML = "";
      btn.appendChild(iframe);
      btn.classList.add("is-playing");
      whenYtReady(function () {
        new window.YT.Player(frameId, {
          events: {
            onReady: function (e) {
              jumpMid(e.target);
              e.target.playVideo();
            },
            onStateChange: function (e) {
              if (e.data === 1) jumpMid(e.target);
            }
          }
        });
      });
    });
  });

  var minEl = document.getElementById("cdMin");
  var secEl = document.getElementById("cdSec");
  if (minEl && secEl) {
    var duration = 5 * 60 * 1000;
    var end = Date.now() + duration;
    function pad(n) {
      return (n < 10 ? "0" : "") + n;
    }
    function tick() {
      var left = end - Date.now();
      if (left <= 0) {
        end = Date.now() + duration;
        left = duration;
      }
      var total = Math.floor(left / 1000);
      minEl.textContent = pad(Math.floor(total / 60));
      secEl.textContent = pad(total % 60);
    }
    tick();
    window.setInterval(tick, 200);
  }

  var proof = document.getElementById("socialProof");
  if (proof) {
    var people = [
      ["Amélia", "Maputo"],
      ["Celso", "Matola"],
      ["Fátima", "Beira"],
      ["João", "Nampula"],
      ["Lúcia", "Quelimane"],
      ["Manuel", "Tete"],
      ["Nádia", "Pemba"],
      ["Paulo", "Xai-Xai"],
      ["Rosa", "Inhambane"],
      ["Sérgio", "Chimoio"],
      ["Teresa", "Lichinga"],
      ["Vicente", "Maxixe"],
      ["Yolanda", "Nacala"],
      ["Hélder", "Gurué"],
      ["Iara", "Moatize"],
      ["Kelvin", "Dondo"],
      ["Esperança", "Angoche"],
      ["Dário", "Cuamba"],
      ["Benedita", "Maputo"],
      ["Castro", "Matola"]
    ];
    var lastIdx = -1;
    var audioCtx = null;

    function unlockAudio() {
      try {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        if (!audioCtx) audioCtx = new AC();
        if (audioCtx.state === "suspended") audioCtx.resume();
      } catch (e) {}
    }

    ["pointerdown", "touchstart", "keydown"].forEach(function (ev) {
      window.addEventListener(ev, unlockAudio, { once: true, passive: true });
    });

    function playDing() {
      try {
        if (!audioCtx) return;
        if (audioCtx.state === "suspended") audioCtx.resume();
        var t = audioCtx.currentTime;
        var osc = audioCtx.createOscillator();
        var gain = audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, t);
        osc.frequency.exponentialRampToValueAtTime(1320, t + 0.09);
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(0.07, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.32);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(t);
        osc.stop(t + 0.34);
      } catch (e) {}
    }

    function showProof() {
      var idx = Math.floor(Math.random() * people.length);
      if (idx === lastIdx) idx = (idx + 1) % people.length;
      lastIdx = idx;
      var item = people[idx];
      proof.innerHTML = '<span class="proof__dot" aria-hidden="true"></span><p><strong>' + item[0] + "</strong>, de " + item[1] + ", acabou de adquirir.</p>";
      proof.classList.add("is-on");
      playDing();
      window.setTimeout(function () {
        proof.classList.remove("is-on");
      }, 4200);
    }

    window.setTimeout(function () {
      showProof();
      window.setInterval(showProof, 9000);
    }, 3500);
  }
})();
