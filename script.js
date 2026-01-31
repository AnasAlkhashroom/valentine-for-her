// GSAP Transition Logic
function showNext(currentId, nextId) {
  const pop = document.getElementById("popSound");
  pop.currentTime = 0;
  pop.play();

  const bgMusic = document.getElementById("bgMusic");
  if (currentId === 'hero' && bgMusic.paused) { bgMusic.play(); }

  const tl = gsap.timeline();
  
  tl.to(`#${currentId} .glass-card`, {
    duration: 0.5, opacity: 0, scale: 0.8, y: -50, ease: "power2.in"
  })
  .set(`#${currentId}`, { display: 'none' })
  .set(`#${nextId}`, { display: 'flex' })
  .fromTo(`#${nextId} .glass-card`, 
    { opacity: 0, scale: 1.2, y: 50 },
    { duration: 0.8, opacity: 1, scale: 1, y: 0, ease: "elastic.out(1, 0.8)" }
  );

  if (nextId === 'letter') { startTypewriter(); }
}

// Typing Effect for Letter
function startTypewriter() {
  new TypeIt("#typewriter", {
    speed: 50,
    waitUntilVisible: true,
    afterComplete: function (instance) {
      gsap.to("#letterNext", { opacity: 1, pointerEvents: "all", duration: 1 });
    }
  })
  .type("My dearest PhoePhoe,")
  .pause(1000)
  .break()
  .type("I build things with code, but you build things in my heart. ❤️")
  .pause(1000)
  .break()
  .type("Every moment with you is like my favorite line of code—perfect.")
  .pause(700)
  .type(".. mostly. 😉")
  .break()
  .type("I love you more than words can type.")
  .go();
}

// Floating Hearts
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

// Advanced "No" Button Logic
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
  
  const jokes = ["Nice try!", "Too slow!", "Not today!", "Click the pink one!"];
  funnyText.innerText = jokes[Math.floor(Math.random() * jokes.length)];
});

// Final Confetti
yesBtn.addEventListener("click", () => {
  confetti({ particleCount: 400, spread: 120, origin: { y: 0.6 } });
  showNext('question', 'final');
});