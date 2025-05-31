const API_URL =
  "https://script.google.com/macros/s/AKfycbynJU5d2qqs6s1pyA9vFVQv_-dSvao5lV_K3u5v77EG1qHFvp4fuIKw1J2Zyt4xCW9L6w/exec";

// Check if user is registered
function isUserRegistered() {
  const name = localStorage.getItem("Name");
  return name;
}

function postSpinData() {
  fetch(API_URL, {
    method: "POST",
    redirect: "follow",
    body: JSON.stringify({
      name: localStorage.getItem("Name") || "Test Post",
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

// Modal management functions
function showModal() {
  const modal = document.getElementById("registrationModal");
  if (modal) {
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    document.body.classList.remove("spinner-visible");
  }
}

function hideModal() {
  const modal = document.getElementById("registrationModal");
  if (modal) {
    modal.classList.add("hidden");
    setTimeout(() => {
      document.body.classList.add("spinner-visible");
      document.body.style.overflow = "auto";
    }, 400);
  }
}

// Victory popup functions
function showVictoryPopup(prize) {
  // Create victory popup if it doesn't exist
  let victoryPopup = document.getElementById("victoryPopup");
  if (!victoryPopup) {
    victoryPopup = document.createElement("div");
    victoryPopup.id = "victoryPopup";
    victoryPopup.innerHTML = `
      <div class="victory-backdrop" style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
      ">
        <div class="victory-content" style="
          background: linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF6347 100%);
          border-radius: 20px;
          padding: 40px;
          text-align: center;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          transform: scale(0.5);
          transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          border: 5px solid #FFD700;
          position: relative;
          overflow: hidden;
        ">
          <div class="confetti" style="
            position: absolute;
            top: -10px;
            left: -10px;
            right: -10px;
            bottom: -10px;
            background: 
              radial-gradient(circle at 20% 50%, #FF69B4 2px, transparent 2px),
              radial-gradient(circle at 80% 20%, #00BFFF 2px, transparent 2px),
              radial-gradient(circle at 40% 80%, #32CD32 2px, transparent 2px),
              radial-gradient(circle at 90% 70%, #FFD700 2px, transparent 2px);
            background-size: 30px 30px;
            animation: confettiFloat 3s infinite ease-in-out;
            opacity: 0.7;
          "></div>
          <div style="position: relative; z-index: 1;">
            <h1 style="
              font-size: 48px;
              color: #FFF;
              margin: 0 0 20px 0;
              text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.5);
              font-family: 'Poppins', Arial, sans-serif;
              animation: glow 2s infinite alternate;
            ">🎉 CONGRATULATIONS! 🎉</h1>
            <div style="
              font-size: 36px;
              color: #FFF;
              margin: 20px 0;
              font-weight: bold;
              text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
              font-family: 'Poppins', Arial, sans-serif;
            ">You Won:</div>
            <div id="prizeText" style="
              font-size: 42px;
              color: #FFD700;
              font-weight: bold;
              margin: 20px 0;
              text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.7);
              background: linear-gradient(45deg, #FFD700, #FFA500);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              font-family: 'Poppins', Arial, sans-serif;
            ">${prize}</div>
            <button id="claimPrize" style="
              background: linear-gradient(135deg, #32CD32 0%, #228B22 100%);
              color: #FFF;
              border: none;
              padding: 15px 30px;
              font-size: 20px;
              font-weight: bold;
              border-radius: 50px;
              cursor: pointer;
              margin-top: 20px;
              box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
              transition: all 0.3s ease;
              font-family: 'Poppins', Arial, sans-serif;
            ">🎁 Claim Prize</button>
          </div>
        </div>
      </div>
      <style>
        @keyframes glow {
          from { text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.5), 0 0 20px #FFD700; }
          to { text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.5), 0 0 30px #FFA500; }
        }
        @keyframes confettiFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
        }
        #claimPrize:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
        }
      </style>
    `;
    document.body.appendChild(victoryPopup);
  } else {
    document.getElementById("prizeText").textContent = prize;
  }

  // Show popup with animation
  setTimeout(() => {
    victoryPopup.querySelector(".victory-backdrop").style.opacity = "1";
    victoryPopup.querySelector(".victory-content").style.transform = "scale(1)";
  }, 100);

  // Add close functionality
  const claimButton = document.getElementById("claimPrize");
  claimButton.onclick = () => hideVictoryPopup();

  victoryPopup.querySelector(".victory-backdrop").onclick = (e) => {
    if (e.target === victoryPopup.querySelector(".victory-backdrop")) {
      hideVictoryPopup();
    }
  };
}

function hideVictoryPopup() {
  const victoryPopup = document.getElementById("victoryPopup");
  if (victoryPopup) {
    const backdrop = victoryPopup.querySelector(".victory-backdrop");
    const content = victoryPopup.querySelector(".victory-content");

    backdrop.style.opacity = "0";
    content.style.transform = "scale(0.5)";

    setTimeout(() => {
      victoryPopup.remove();
    }, 500);
  }
}

// Victory popup functions
function showVictoryPopup(prize) {
  // Create victory popup if it doesn't exist
  let victoryPopup = document.getElementById("victoryPopup");
  if (!victoryPopup) {
    victoryPopup = document.createElement("div");
    victoryPopup.id = "victoryPopup";
    victoryPopup.innerHTML = `
      <div class="victory-backdrop" style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
      ">
        <div class="victory-content" style="
          background: linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF6347 100%);
          border-radius: 20px;
          padding: 40px;
          text-align: center;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          transform: scale(0.5);
          transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          border: 5px solid #FFD700;
          position: relative;
          overflow: hidden;
        ">
          <div class="confetti" style="
            position: absolute;
            top: -10px;
            left: -10px;
            right: -10px;
            bottom: -10px;
            background: 
              radial-gradient(circle at 20% 50%, #FF69B4 2px, transparent 2px),
              radial-gradient(circle at 80% 20%, #00BFFF 2px, transparent 2px),
              radial-gradient(circle at 40% 80%, #32CD32 2px, transparent 2px),
              radial-gradient(circle at 90% 70%, #FFD700 2px, transparent 2px);
            background-size: 30px 30px;
            animation: confettiFloat 3s infinite ease-in-out;
            opacity: 0.7;
          "></div>
          <div style="position: relative; z-index: 1;">
            <h1 style="
              font-size: 48px;
              color: #FFF;
              margin: 0 0 20px 0;
              text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.5);
              font-family: 'Arial Black', Arial, sans-serif;
              animation: glow 2s infinite alternate;
            ">🎉 CONGRATULATIONS! 🎉</h1>
            <div style="
              font-size: 36px;
              color: #FFF;
              margin: 20px 0;
              font-weight: bold;
              text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
              font-family: 'Arial', sans-serif;
            ">You Won:</div>
            <div id="prizeText" style="
              font-size: 42px;
              color: #FFD700;
              font-weight: bold;
              margin: 20px 0;
              text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.7);
              background: linear-gradient(45deg, #FFD700, #FFA500);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              font-family: 'Arial Black', Arial, sans-serif;
            ">${prize}</div>
            <button id="claimPrize" style="
              background: linear-gradient(135deg, #32CD32 0%, #228B22 100%);
              color: #FFF;
              border: none;
              padding: 15px 30px;
              font-size: 20px;
              font-weight: bold;
              border-radius: 50px;
              cursor: pointer;
              margin-top: 20px;
              box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
              transition: all 0.3s ease;
              font-family: 'Arial', sans-serif;
            ">🎁 Claim Prize</button>
          </div>
        </div>
      </div>
      <style>
        @keyframes glow {
          from { text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.5), 0 0 20px #FFD700; }
          to { text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.5), 0 0 30px #FFA500; }
        }
        @keyframes confettiFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
        }
        #claimPrize:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
        }
      </style>
    `;
    document.body.appendChild(victoryPopup);
  } else {
    document.getElementById("prizeText").textContent = prize;
  }

  // Show popup with animation
  setTimeout(() => {
    victoryPopup.querySelector(".victory-backdrop").style.opacity = "1";
    victoryPopup.querySelector(".victory-content").style.transform = "scale(1)";
  }, 100);

  // Add close functionality
  const claimButton = document.getElementById("claimPrize");
  claimButton.onclick = () => hideVictoryPopup();

  victoryPopup.querySelector(".victory-backdrop").onclick = (e) => {
    if (e.target === victoryPopup.querySelector(".victory-backdrop")) {
      hideVictoryPopup();
    }
  };
}

function hideVictoryPopup() {
  const victoryPopup = document.getElementById("victoryPopup");
  if (victoryPopup) {
    const backdrop = victoryPopup.querySelector(".victory-backdrop");
    const content = victoryPopup.querySelector(".victory-content");

    backdrop.style.opacity = "0";
    content.style.transform = "scale(0.5)";

    setTimeout(() => {
      victoryPopup.remove();
    }, 500);
  }
}

// Handle registration form submission
function handleRegistration() {
  const form = document.getElementById("spinForm");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");

  if (form && nameInput) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = nameInput.value.trim();

      if (name) {
        // Store in localStorage
        localStorage.setItem("Name", name);

        // Show success message
        const submitBtn = document.querySelector(".submit-btn");
        if (submitBtn) {
          submitBtn.innerHTML = "✓ Registration Complete!";
          submitBtn.style.background =
            "linear-gradient(135deg, #10b981 0%, #059669 100%)";
        }

        // Hide modal and show spinner
        setTimeout(() => {
          hideModal();
          initializeSpinner();
        }, 1500);
      }
    });
  }
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

// Draw pointer
function drawPointer() {
  // Find or create pointer element
  let pointer = document.getElementById("wheelPointer");
  if (!pointer) {
    pointer = document.createElement("div");
    pointer.id = "wheelPointer";
    pointer.style.cssText = `
      position: absolute;
      top: -20px;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 25px solid transparent;
      border-right: 25px solid transparent;
      border-top: 50px solid #FF4444;
      z-index: 1000;
      filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4));
    `;

    // Add pointer to wheel container
    const wheelContainer = document.querySelector("#spin_the_wheel");
    if (wheelContainer) {
      wheelContainer.style.position = "relative";
      wheelContainer.appendChild(pointer);
    }
  }
}

function rotate() {
  const sector = sectors[getIndex()];
  ctx.canvas.style.transform = `rotate(${ang - PI / 2}rad)`;

  // Enhanced spin button styling
  if (!angVel) {
    spinEl.innerHTML = `
      <div style="
        font-size: 32px;
        font-weight: bold;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        letter-spacing: 2px;
        font-family: 'Poppins', Arial, sans-serif;
        margin-bottom: 5px;
      ">🎰 SPIN 🎰</div>
      <div style="
        font-size: 16px;
        opacity: 0.9;
        font-family: 'Poppins', Arial, sans-serif;
        font-weight: 600;
      ">Click to Win!</div>
    `;
    spinEl.style.background =
      "linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 50%, #45B7D1 100%)";
    spinEl.style.color = "#FFF";
    spinEl.style.border = "6px solid #FFF";
    spinEl.style.boxShadow =
      "0 12px 25px rgba(0, 0, 0, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.2)";
  } else {
    spinEl.innerHTML = `
      <div style="
        font-size: 28px;
        font-weight: bold;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        font-family: 'Poppins', Arial, sans-serif;
        text-align: center;
        line-height: 1.2;
      ">${sector.label}</div>
    `;
    spinEl.style.background = `linear-gradient(135deg, ${sector.color} 0%, ${sector.color}CC 100%)`;
    spinEl.style.color = sector.text;
    spinEl.style.border = "6px solid #FFF";
    spinEl.style.boxShadow =
      "0 12px 25px rgba(0, 0, 0, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.2)";
  }

  // Make the center button bigger
  spinEl.style.width = "180px";
  spinEl.style.height = "180px";
  spinEl.style.borderRadius = "50%";
  spinEl.style.display = "flex";
  spinEl.style.flexDirection = "column";
  spinEl.style.justifyContent = "center";
  spinEl.style.alignItems = "center";
  spinEl.style.cursor = angVel ? "default" : "pointer";
  spinEl.style.transition = "all 0.3s ease";
  spinEl.style.position = "absolute";
  spinEl.style.top = "50%";
  spinEl.style.left = "50%";
  spinEl.style.transform = "translate(-50%, -50%)";
  spinEl.style.zIndex = "1000";

  // Hover effect for spin button
  if (!angVel) {
    spinEl.onmouseenter = () => {
      spinEl.style.transform = "translate(-50%, -50%) scale(1.1)";
      spinEl.style.boxShadow =
        "0 16px 30px rgba(0, 0, 0, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.3)";
    };
    spinEl.onmouseleave = () => {
      spinEl.style.transform = "translate(-50%, -50%) scale(1)";
      spinEl.style.boxShadow =
        "0 12px 25px rgba(0, 0, 0, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.2)";
    };
  } else {
    spinEl.onmouseenter = null;
    spinEl.onmouseleave = null;
  }
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

// Initialize spinner functionality
function initializeSpinner() {
  drawPointer(); // Draw the pointer
  rotate(); // Initial rotation
  engine(); // Start engine
  spinEl.addEventListener("click", () => {
    if (!angVel) angVel = rand(0.25, 0.45);
    spinButtonClicked = true;
  });
}

function init() {
  sectors.forEach(drawSector);
  console.log("Here");
  // Check if user is registered
  if (!isUserRegistered()) {
    // Show modal and keep spinner hidden
    showModal();
    handleRegistration();

    // Set up modal close handlers
    const closeBtn = document.getElementById("closeModal");
    const backdrop = document.querySelector(".modal-backdrop");

    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        console.log("Clicked");
        // Only close if user is registered
        if (isUserRegistered()) {
          hideModal();
          initializeSpinner();
        }
      });
    }

    if (backdrop) {
      backdrop.addEventListener("click", () => {
        // Only close if user is registered
        if (isUserRegistered()) {
          hideModal();
          initializeSpinner();
        }
      });
    }
  } else {
    // User is already registered, show spinner immediately
    hideModal();
    initializeSpinner();
  }
}

init();

events.addListener("spinEnd", (sector) => {
  console.log(`Woop! You won ${sector.label}`);
  // Show victory popup
  setTimeout(() => {
    showVictoryPopup(sector.label);
  }, 1000); // Delay to let wheel fully stop

  // Post spin data with user's name
  postSpinData();
});
