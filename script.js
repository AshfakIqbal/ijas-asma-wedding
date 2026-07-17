(() => {
  "use strict";

  const weddingTime = new Date("2026-08-23T12:30:00+05:30").getTime();

  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");
  const messageEl = document.getElementById("countdownMessage");

  function pad(value, length = 2) {
    return String(value).padStart(length, "0");
  }

  function updateCountdown() {
    const difference = weddingTime - Date.now();

    if (difference <= 0) {
      daysEl.textContent = "000";
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      secondsEl.textContent = "00";
      messageEl.textContent = "Today is our special day!";
      return;
    }

    const totalSeconds = Math.floor(difference / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    daysEl.textContent = pad(days, 3);
    hoursEl.textContent = pad(hours);
    minutesEl.textContent = pad(minutes);
    secondsEl.textContent = pad(seconds);
  }

  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  // Add to Calendar
  const calendarButton = document.getElementById("calendarButton");
  calendarButton.addEventListener("click", () => {
    const calendarFile = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Inkspire Prints//Wedding Invitation//EN",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      "UID:ijas-asma-wedding-20260823@inkspireprints.lk",
      "DTSTAMP:20260715T000000Z",
      "DTSTART;TZID=Asia/Colombo:20260823T123000",
      "DTEND;TZID=Asia/Colombo:20260823T160000",
      "SUMMARY:Ijas Nazeer & Asma Hassan Wedding",
      "LOCATION:Eden Park\\, 93/A/1 Nuwara Eliya Road\\, Gampola\\, Sri Lanka",
      "DESCRIPTION:Wedding celebration of Ijas Nazeer and Asma Hassan.",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([calendarFile], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Ijas-and-Asma-Wedding.ics";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  });

  // Gift-wrap opener and background music
  const giftOpener = document.getElementById("giftOpener");
  const unwrapButton = document.getElementById("unwrapButton");
  const audio = document.getElementById("backgroundMusic");
  const musicControl = document.getElementById("musicControl");
  const musicLabel = document.getElementById("musicLabel");
  audio.volume = 0.28;

  function setMusicUi(isPlaying, needsInteraction = false) {
    musicControl.classList.toggle("is-muted", !isPlaying);
    musicControl.classList.toggle("needs-interaction", needsInteraction);
    musicControl.setAttribute("aria-pressed", String(!isPlaying));
    musicControl.setAttribute("aria-label", isPlaying ? "Mute background music" : "Play background music");
    musicLabel.textContent = needsInteraction ? "Tap for Music" : (isPlaying ? "Music On" : "Music Off");
  }

  async function startMusic() {
    try {
      await audio.play();
      setMusicUi(true, false);
      return true;
    } catch (error) {
      setMusicUi(false, true);
      return false;
    }
  }

  function createUnwrapBurst() {
    const palette = [
      ["#fff5ef", "#cb7f8d"],
      ["#f6d8dd", "#73192b"],
      ["#fff7ee", "#d7aa57"],
      ["#edd0c8", "#9a4558"]
    ];

    for (let i = 0; i < 24; i += 1) {
      const petal = document.createElement("span");
      const colors = palette[Math.floor(Math.random() * palette.length)];
      const angle = (Math.PI * 2 * i) / 24 + (Math.random() - 0.5) * 0.35;
      const distance = 130 + Math.random() * Math.min(window.innerWidth, window.innerHeight) * 0.42;

      petal.className = "unwrap-burst-petal";
      petal.style.setProperty("--burst-size", `${10 + Math.random() * 18}px`);
      petal.style.setProperty("--burst-a", colors[0]);
      petal.style.setProperty("--burst-b", colors[1]);
      petal.style.setProperty("--burst-x", `${Math.cos(angle) * distance}px`);
      petal.style.setProperty("--burst-y", `${Math.sin(angle) * distance}px`);
      petal.style.setProperty("--burst-rotate", `${300 + Math.random() * 720}deg`);

      document.body.appendChild(petal);
      window.setTimeout(() => petal.remove(), 1250);
    }
  }

  let isUnwrapping = false;

  async function unwrapInvitation() {
    if (isUnwrapping) return;
    isUnwrapping = true;
    unwrapButton.disabled = true;

    // This direct click-triggered play call satisfies mobile browser audio rules.
    audio.currentTime = 0;
    startMusic();

    createUnwrapBurst();
    giftOpener.classList.add("is-unwrapping");

    window.setTimeout(() => {
      document.body.classList.remove("invitation-locked");
      giftOpener.classList.add("is-finishing");
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }, 1150);

    window.setTimeout(() => {
      giftOpener.hidden = true;
    }, 1650);
  }

  unwrapButton.addEventListener("click", (event) => {
    event.stopPropagation();
    unwrapInvitation();
  });

  giftOpener.addEventListener("click", unwrapInvitation);

  setMusicUi(false, false);

  musicControl.addEventListener("click", async (event) => {
    event.stopPropagation();

    if (audio.paused) {
      const played = await startMusic();
      if (!played) {
        setMusicUi(false, true);
      }
    } else {
      audio.pause();
      setMusicUi(false, false);
    }
  });

  // 3D floating petals
  const petalScene = document.getElementById("petalScene");
  const palette = [
    ["#fff7f2", "#dca8aa"],
    ["#f9e5de", "#b85f72"],
    ["#f2cbd1", "#7d2438"],
    ["#fffaf5", "#ddb07a"],
    ["#ead4c9", "#9a5261"]
  ];

  const petalCount = window.innerWidth < 600 ? 15 : 25;

  for (let i = 0; i < petalCount; i += 1) {
    const petal = document.createElement("span");
    petal.className = "petal";

    const colors = palette[Math.floor(Math.random() * palette.length)];
    const size = 13 + Math.random() * 25;
    const depth = -180 + Math.random() * 360;
    const baseDrift = -50 + Math.random() * 100;

    petal.style.setProperty("--left", `${Math.random() * 100}%`);
    petal.style.setProperty("--size", `${size}px`);
    petal.style.setProperty("--duration", `${11 + Math.random() * 15}s`);
    petal.style.setProperty("--delay", `${-Math.random() * 22}s`);
    petal.style.setProperty("--opacity", `${0.32 + Math.random() * 0.55}`);
    petal.style.setProperty("--blur", `${Math.max(0, (180 - Math.abs(depth)) / 180) * 0.7}px`);
    petal.style.setProperty("--depth", `${depth}px`);
    petal.style.setProperty("--start-rotate", `${Math.random() * 360}deg`);
    petal.style.setProperty("--drift-a", `${baseDrift + (-30 + Math.random() * 60)}px`);
    petal.style.setProperty("--drift-b", `${baseDrift + (-75 + Math.random() * 150)}px`);
    petal.style.setProperty("--drift-c", `${baseDrift + (-55 + Math.random() * 110)}px`);
    petal.style.setProperty("--drift-d", `${baseDrift + (-90 + Math.random() * 180)}px`);
    petal.style.setProperty("--petal-a", colors[0]);
    petal.style.setProperty("--petal-b", colors[1]);

    petalScene.appendChild(petal);
  }

  // Scroll reveal
  const revealElements = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach((element) => observer.observe(element));
})();
