function showNext(currentId, nextId) {
  const pop = document.getElementById("popSound");
  pop.currentTime = 0;
  pop.play();

  const bgMusic = document.getElementById("bgMusic");
  if (currentId === 'hero' && bgMusic.paused) { 
    bgMusic.play().catch(e => console.log("Music play blocked")); 
  }

  const tl = gsap.timeline();
  tl.to(`#${currentId} .glass-card`, { duration: 0.5, opacity: 0, scale: 0.8, y: -50, ease: "power2.in" })
    .set(`#${currentId}`, { display: 'none' })
    .set(`#${nextId}`, { display: 'flex' })
    .fromTo(`#${nextId} .glass-card`, 
      { opacity: 0, scale: 1.2, y: 50 },
      { duration: 0.8, opacity: 1, scale: 1, y: 0, ease: "elastic.out(1, 0.8)" }
    );

  if (nextId === 'letter') { startTypewriter(); }
}

function startTypewriter() {
  new TypeIt("#typewriter", {
    speed: 35,
    waitUntilVisible: true,
    afterComplete: function (instance) {
      gsap.to("#letterNext", { opacity: 1, pointerEvents: "all", duration: 1 });
    }
  })
  .type("I built this website for you just to show you this little gesture of how much I love you and how much I would do for you for the rest of my life.")
  .pause(600)
  .break().break()
  .type("I promise you one thing that I am certain will never change. I am and will always put so much effort into showing you how loved you are.")
  .pause(600)
  .break().break()
  .type("This is a lifelong promise. I want to celebrate our love every single day but that's 'yucky,' so this is a valid excuse! 😉")
  .pause(600)
  .break().break()
  .type("Valentine's Day should be changed to Phoe's and Nusy's Special Day.")
  .pause(600)
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
    div.style.fontSize = Math.random() * 20 + 20 + "px";
    div.style.position = "absolute";
    div.style.bottom = "-5vh";
    div.style.zIndex = "-1";
    heartBg.appendChild(div);

    gsap.to(div, {
      y: "-110vh",
      x: (Math.random() - 0.5) * 200,
      rotation: Math.random() * 360,
      duration: Math.random() * 3 + 4,
      ease: "none",
      onComplete: () => div.remove()
    });
  }, 450);
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

  scale += 0.2;
  gsap.to(yesBtn, { scale: scale, duration: 0.3, ease: "back.out(2)" });
  funnyText.innerText = ["Nice try!", "Too slow!", "Not today!", "Nope!", "Haha!"][Math.floor(Math.random() * 5)];
});

yesBtn.addEventListener("click", () => {
  confetti({ particleCount: 400, spread: 120, origin: { y: 0.6 }, colors: ['#ff5c8a', '#ffafbd', '#ffffff'] });
  showNext('question', 'final');
});