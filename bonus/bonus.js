const API_URL =
  "https://script.google.com/macros/s/AKfycbynJU5d2qqs6s1pyA9vFVQv_-dSvao5lV_K3u5v77EG1qHFvp4fuIKw1J2Zyt4xCW9L6w/exec";
const isRegisterd = localStorage.getItem("Name");
console.log(isRegisterd);
async function loadModal() {
  const response = await fetch("./popup/popup.html");
  const html = await response.text();

   // Parse the HTML text into a DOM object
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlText, 'text/html');

  // Get only the modal div (you can also use querySelector('.modal') if needed)
  const modalDiv = doc.querySelector('.modal');
  if (modalDiv) {
    document.body.appendChild(modalDiv);
  }
}

function postSpinData() {
  fetch(API_URL, {
    method: "POST",
    redirect: "follow",
    body: JSON.stringify({
      name: "Test Post",
      prize: "100% Bonus",
    }),
    headers: {
      "Content-type": "text/plain;charset=utf-8",
    },
  })
    .then((resp) => resp.text())
    .then((data) => {
      console.log(data);
    });
}

function getSpinData() {
  fetch(API_URL)
    .then((resp) => resp.json())
    .then((data) => {
      console.log(data);
    });
}
const sectors = [
  { color: "#B0BEC5", text: "#333333", label: "TryAgain" },
  { color: "#43A047", text: "#333333", label: "50% Bonus" },
  { color: "#42A5F5", text: "#333333", label: "$3 Freeplay" },
  { color: "#1E88E5", text: "#333333", label: "$5 Freeplay" },
  { color: "#B0BEC5", text: "#333333", label: "Try Again" },
  { color: "#FDD835", text: "#333333", label: "100% Bonus" },
  { color: "#FFB300", text: "#333333", label: "10% Bonus" },
  { color: "#FB8C00", text: "#333333", label: "20% Bonus" },
  { color: "#F4511E", text: "#333333", label: "30% Bonus" },
];

const events = {
  listeners: {},
  addListener: function (eventName, fn) {
    this.listeners[eventName] = this.listeners[eventName] || [];
    this.listeners[eventName].push(fn);
  },
  fire: function (eventName, ...args) {
    if (this.listeners[eventName]) {
      for (let fn of this.listeners[eventName]) {
        fn(...args);
      }
    }
  },
};

const rand = (m, M) => Math.random() * (M - m) + m;
const tot = sectors.length;
const spinEl = document.querySelector("#spin");
const ctx = document.querySelector("#wheel").getContext("2d");
const dia = ctx.canvas.width;
const rad = dia / 2;
const PI = Math.PI;
const TAU = 2 * PI;
const arc = TAU / sectors.length;

const friction = 0.991; // 0.995=soft, 0.99=mid, 0.98=hard
let angVel = 0; // Angular velocity
let ang = 0; // Angle in radians

let spinButtonClicked = false;

const getIndex = () => Math.floor(tot - (ang / TAU) * tot) % tot;

function drawSector(sector, i) {
  const ang = arc * i;
  ctx.save();

  // COLOR
  ctx.beginPath();
  ctx.fillStyle = sector.color;
  ctx.moveTo(rad, rad);
  ctx.arc(rad, rad, rad, ang, ang + arc);
  ctx.lineTo(rad, rad);
  ctx.fill();

  // TEXT
  ctx.translate(rad, rad);
  ctx.rotate(ang + arc / 2);
  ctx.textAlign = "right";
  ctx.fillStyle = sector.text;
  ctx.font = "bold 30px 'Lato', sans-serif";
  ctx.fillText(sector.label, rad - 10, 10);
  //

  ctx.restore();
}

function rotate() {
  const sector = sectors[getIndex()];
  ctx.canvas.style.transform = `rotate(${ang - PI / 2}rad)`;

  spinEl.textContent = !angVel ? "SPIN" : sector.label;
  spinEl.style.background = sector.color;
  spinEl.style.color = sector.text;
}

function frame() {
  // Fire an event after the wheel has stopped spinning
  if (!angVel && spinButtonClicked) {
    const finalSector = sectors[getIndex()];
    events.fire("spinEnd", finalSector);
    spinButtonClicked = false; // reset the flag
    return;
  }

  angVel *= friction; // Decrement velocity by friction
  if (angVel < 0.002) angVel = 0; // Bring to stop
  ang += angVel; // Update angle
  ang %= TAU; // Normalize angle
  rotate();
}

function engine() {
  frame();
  requestAnimationFrame(engine);
}

function init() {
  sectors.forEach(drawSector);
  if (isRegisterd === null) {
    loadModal();
  } else {
    rotate(); // Initial rotation
    engine(); // Start engine
    spinEl.addEventListener("click", () => {
      if (!angVel) angVel = rand(0.25, 0.45);
      spinButtonClicked = true;
    });
  }
}

init();

events.addListener("spinEnd", (sector) => {
  console.log(`Woop! You won ${sector.label}`);
});
