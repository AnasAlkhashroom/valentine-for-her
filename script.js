// Section order for progress & back
const SECTION_ORDER = ['hero', 'letter', 'gallery', 'question', 'final'];
let currentSectionId = 'hero';

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  VanillaTilt.init(document.querySelectorAll(".polaroid, .m-item"), {
      max: 10, speed: 400, scale: 1.05, glare: true, "max-glare": 0.2,
  });
  updateCounter();
  buildProgressDots();
  updateNavUI();
});

// Milestone Logic with Animated Count-up
function updateCounter() {
  const now = new Date();
  const milestones = {
      textDate: new Date("2022-11-26"),
      meetDate: new Date("2022-12-16"),
      kissDate: new Date("2023-03-04"),
      togetherDate: new Date("2023-05-18")
  };

  for (const [id, date] of Object.entries(milestones)) {
      const diff = now - date;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const element = document.getElementById(id);
      if (element) {
          gsap.fromTo(element, { innerText: 0 }, {
              innerText: days,
              duration: 2.5,
              snap: { innerText: 1 },
              ease: "power2.out"
          });
      }
  }
}

// Reasons Jar
const reasons = [
  "The way you make me feel like a little prince.",
  "Your beautiful smile that fixes my worst days.",
  "The way you handle my 'yucky' jokes so well.",
  "How you are my best friend and lover all in one.",
  "The effort you put into us every single day.",
  "Just the way you are, Phoe. You're perfect.",
  "The little princess energy you have 24/7."
];

function showReason() {
  const text = document.getElementById("reasonText");
  const randomReason = reasons[Math.floor(Math.random() * reasons.length)];
  gsap.to(text, { opacity: 0, y: 10, duration: 0.3, onComplete: () => {
      text.innerText = randomReason;
      gsap.to(text, { opacity: 1, y: 0, duration: 0.3 });
  }});
}

// Sparkle Trail — throttled so it stays smooth
let lastSparkle = 0;
document.addEventListener("mousemove", (e) => {
  const now = Date.now();
  if (now - lastSparkle < 120 || Math.random() > 0.08) return;
  lastSparkle = now;
  const h = document.createElement("div");
  h.innerHTML = "💖";
  h.style.cssText = "position:fixed;left:" + e.clientX + "px;top:" + e.clientY + "px;font-size:12px;pointer-events:none;z-index:5000;";
  document.body.appendChild(h);
  gsap.to(h, { y: -60, x: (Math.random() - 0.5) * 60, opacity: 0, duration: 1.2, onComplete: () => h.remove() });
});

// Progress dots & back button
function buildProgressDots() {
  const container = document.getElementById("progressDots");
  if (!container) return;
  SECTION_ORDER.forEach((id, i) => {
    const dot = document.createElement("span");
    dot.className = "dot" + (id === currentSectionId ? " active" : "");
    dot.setAttribute("data-section", id);
    dot.setAttribute("aria-label", `Section ${i + 1}`);
    dot.onclick = () => { if (i < SECTION_ORDER.indexOf(currentSectionId)) goToSection(id); };
    container.appendChild(dot);
  });
}

function updateNavUI() {
  const idx = SECTION_ORDER.indexOf(currentSectionId);
  const backBtn = document.getElementById("backBtn");
  if (backBtn) {
    backBtn.classList.toggle("hidden", idx <= 0);
  }
  document.querySelectorAll("#progressDots .dot").forEach((dot, i) => {
    dot.classList.toggle("active", SECTION_ORDER[i] === currentSectionId);
  });
}

function goToSection(id) {
  if (id === currentSectionId) return;
  const toIdx = SECTION_ORDER.indexOf(id);
  const fromIdx = SECTION_ORDER.indexOf(currentSectionId);
  if (toIdx >= fromIdx) return; // dots only jump back
  document.getElementById(currentSectionId).style.display = "none";
  document.getElementById(id).style.display = "flex";
  currentSectionId = id;
  updateNavUI();
}

function goBack() {
  const idx = SECTION_ORDER.indexOf(currentSectionId);
  if (idx <= 0) return;
  const prevId = SECTION_ORDER[idx - 1];
  const prevSection = document.getElementById(prevId);
  const prevCard = prevSection ? prevSection.querySelector(".glass-card") : null;
  document.getElementById(currentSectionId).style.display = "none";
  prevSection.style.display = "flex";
  currentSectionId = prevId;
  updateNavUI();
  // Reset content so it's visible (GSAP may have left opacity 0 from leaving)
  if (prevCard) gsap.set(prevCard, { opacity: 1, scale: 1, y: 0 });
}

// Lightbox
function openLightbox(imgSrc, caption) {
  const lightbox = document.getElementById("lightbox");
  document.getElementById("lightboxImg").src = imgSrc;
  document.getElementById("lightboxText").innerText = caption;
  lightbox.style.display = "flex";
  document.body.classList.add("lightbox-open");
  gsap.fromTo(".lightbox-content", { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" });
  document.addEventListener("keydown", lightboxEscape);
}

function lightboxEscape(e) {
  if (e.key === "Escape") { closeLightbox(); document.removeEventListener("keydown", lightboxEscape); }
}

function closeLightbox() {
  document.removeEventListener("keydown", lightboxEscape);
  document.body.classList.remove("lightbox-open");
  gsap.to(".lightbox-content", { scale: 0.5, opacity: 0, duration: 0.3, onComplete: () => { document.getElementById("lightbox").style.display = "none"; } });
}

// Navigation — animate main card for smoother transition
function showNext(currentId, nextId) {
  currentSectionId = nextId;
  updateNavUI();
  try { document.getElementById("popSound").play(); } catch (_) {}
  const bgMusic = document.getElementById("bgMusic");
  if (currentId === 'hero' && bgMusic.paused) try { bgMusic.play(); } catch (_) {}

  const currentCard = document.querySelector(`#${currentId} .glass-card`);
  const nextSection = document.getElementById(nextId);
  const nextCard = nextSection ? nextSection.querySelector(".glass-card") : null;

  const tl = gsap.timeline();
  tl.to(currentCard || `#${currentId}`, { duration: 0.6, opacity: 0, scale: 0.9, y: -30, ease: "power2.inOut" })
    .set(`#${currentId}`, { display: "none" })
    .set(`#${nextId}`, { display: "flex" })
    .fromTo(nextCard || `#${nextId}`, { opacity: 0, scale: 1.1, y: 30 }, {
      duration: 0.8, opacity: 1, scale: 1, y: 0, ease: "back.out(1.7)",
      onComplete: () => { if (nextId === "letter") startTypewriter(); }
    });
}

function startTypewriter() {
  const el = document.getElementById("typewriter");
  if (!el) return;
  el.innerHTML = "";
  new TypeIt("#typewriter", {
    speed: 28,
    waitUntilVisible: true,
    afterComplete: () => {
      gsap.to("#letterNext", { opacity: 1, pointerEvents: "all", duration: 0.5 });
    }
  })
  .type("I built this website for you just to show you this little gesture of how much I love you and how much I would do for you for the rest of my life. I am in love with you and the moment that you walked into my life (slid into my dm's) is the moment that my whole life brightened up. Life suddenly has purpose and something to look forward for and that was to talk to you and see you. Spending time with you made me the man I am today. Your love to me saved me in so many different ways, it saved my soul.")
  .pause(400).break().break()
  .type("I promise you one thing that I am certain will never change. I am and will always put so much effort into showing you how loved you are. You are my princess and the love of my life. This is a lifelong promise and I want to celebrate our love every single day but that's 'yucky,' so this is a valid excuse!")
  .pause(400).break().break()
  .type("Valentine's Day should be changed to Phoe's and Nusy's Special Day. You are my first and last valentine that I want to have. You make life so much more enjoyable and my main goal in life is to make my dream come true and it is living with you for the rest of my life.")
  .pause(400).break().break()
  .type("May all our dreams come true. I love you to the sun and back because the moon is too close.")
  .go();
}

function createHearts() {
  setInterval(() => {
      const div = document.createElement("div");
      div.className = "heart"; div.innerHTML = ["❤️", "💖", "💕", "✨"][Math.floor(Math.random() * 4)];
      div.style.left = Math.random() * 100 + "vw"; div.style.position = "absolute"; div.style.bottom = "-5vh";
      document.getElementById("heartBg").appendChild(div);
      gsap.to(div, { y: "-110vh", x: (Math.random() - 0.5) * 300, rotation: Math.random() * 360, duration: Math.random() * 4 + 5, onComplete: () => div.remove() });
  }, 500);
}
createHearts();

function toggleMusic() {
  const music = document.getElementById("bgMusic");
  const icon = document.getElementById("musicIcon");
  if (music.paused) { music.play(); icon.innerText = "❤️"; } 
  else { music.pause(); icon.innerText = "🎵"; }
}

const noBtn = document.getElementById("no");
const yesBtn = document.getElementById("yes");
let scale = 1;

noBtn.addEventListener("mouseover", () => {
  const container = document.getElementById("container");
  const maxX = container.clientWidth - noBtn.clientWidth;
  const maxY = container.clientHeight - noBtn.clientHeight;
  gsap.to(noBtn, { x: Math.random() * maxX - (container.clientWidth / 2), y: Math.random() * maxY - (container.clientHeight / 2), duration: 0.2 });
  scale += 0.25;
  gsap.to(yesBtn, { scale: scale, duration: 0.3 });
});

yesBtn.addEventListener("click", () => {
  const duration = 5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
  const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) return clearInterval(interval);
    const particleCount = 50 * (timeLeft / duration);
    confetti(Object.assign({}, defaults, { particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 } }));
  }, 250);
  showNext('question', 'final');
});