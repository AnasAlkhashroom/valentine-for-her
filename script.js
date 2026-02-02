document.addEventListener('DOMContentLoaded', () => {
  VanillaTilt.init(document.querySelectorAll(".polaroid"), {
      max: 10,
      speed: 400,
      scale: 1.1,
      glare: true,
      "max-glare": 0.2,
  });
});

function openLightbox(imgSrc, caption) {
  const lightbox = document.getElementById("lightbox");
  const img = document.getElementById("lightboxImg");
  const text = document.getElementById("lightboxText");
  
  img.src = imgSrc;
  text.innerText = caption;
  lightbox.style.display = "flex";
  
  gsap.fromTo(".lightbox-content", 
      { scale: 0.5, opacity: 0 }, 
      { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
  );
}

function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  gsap.to(".lightbox-content", {
      scale: 0.5, opacity: 0, duration: 0.3, ease: "power2.in",
      onComplete: () => { lightbox.style.display = "none"; }
  });
}

function showNext(currentId, nextId) {
  const pop = document.getElementById("popSound");
  pop.currentTime = 0;
  pop.play();

  const bgMusic = document.getElementById("bgMusic");
  if (currentId === 'hero' && bgMusic.paused) { 
      bgMusic.play().catch(() => console.log("Music play blocked")); 
  }

  const tl = gsap.timeline();
  tl.to(`#${currentId} .glass-card`, {
      duration: 0.6, opacity: 0, scale: 0.9, y: -30, ease: "power2.inOut"
  })
  .set(`#${currentId}`, { display: 'none' })
  .set(`#${nextId}`, { display: 'flex' })
  .fromTo(`#${nextId} .glass-card`, 
      { opacity: 0, scale: 1.1, y: 30 },
      { duration: 0.8, opacity: 1, scale: 1, y: 0, ease: "back.out(1.7)" }
  );

  if (nextId === 'letter') { startTypewriter(); }
}

function startTypewriter() {
  new TypeIt("#typewriter", {
      speed: 30,
      waitUntilVisible: true,
      afterComplete: function (instance) {
          gsap.to("#letterNext", { opacity: 1, pointerEvents: "all", duration: 1 });
      }
  })
  .type("I built this website for you just to show you this little gesture of how much I love you and how much I would do for you for the rest of my life.")
  .pause(800)
  .break().break()
  .type("I promise you one thing that I am certain will never change. I am and will always put so much effort into showing you how loved you are. And make you feel like the little princess that you are.")
  .pause(800)
  .break().break()
  .type("This is a lifelong promise. I want to celebrate our love every single day but that's 'yucky,' so this is a valid excuse! 😉")
  .pause(800)
  .break().break()
  .type("Valentine's Day should be changed to Phoe's and Nusy's Special Day.")
  .pause(800)
  .break().break()
  .type("I love you to the sun and back because the moon is too close.")
  .go();
}

function createHearts() {
  const heartBg = document.getElementById("heartBg");
  const emojis = ["❤️", "💖", "💕", "✨"];
  setInterval(() => {
      const div = document.createElement("div");
      div.className = "heart";
      div.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
      div.style.left = Math.random() * 100 + "vw";
      div.style.fontSize = (Math.random() * 20 + 20) + "px";
      div.style.position = "absolute";
      div.style.bottom = "-5vh";
      div.style.zIndex = "-1";
      heartBg.appendChild(div);

      gsap.to(div, {
          y: "-110vh",
          x: (Math.random() - 0.5) * 300,
          rotation: Math.random() * 360,
          duration: Math.random() * 4 + 5,
          ease: "none",
          onComplete: () => div.remove()
      });
  }, 500);
}
createHearts();

const noBtn = document.getElementById("no");
const yesBtn = document.getElementById("yes");
const funnyText = document.getElementById("funnyText");
let scale = 1;

noBtn.addEventListener("mouseover", () => {
  const container = document.getElementById("container");
  const maxX = container.clientWidth - noBtn.clientWidth;
  const maxY = container.clientHeight - noBtn.clientHeight;

  gsap.to(noBtn, {
      x: Math.random() * maxX - (container.clientWidth / 2) + (noBtn.clientWidth / 2),
      y: Math.random() * maxY - (container.clientHeight / 2) + (noBtn.clientHeight / 2),
      duration: 0.2,
      ease: "power2.out"
  });

  scale += 0.25;
  gsap.to(yesBtn, { scale: scale, duration: 0.3, ease: "back.out(2)" });
  funnyText.innerText = ["Nice try!", "Too slow!", "Not today!", "Nope!", "Haha!"][Math.floor(Math.random() * 5)];
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