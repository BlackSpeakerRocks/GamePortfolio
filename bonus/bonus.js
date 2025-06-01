const API_URL =
  "https://script.google.com/macros/s/AKfycbw9MjzkCNNFeTLDv9Y3th6ibJu4C6Nf2kXxWIUMNl8Z4jwB8zFZa47fyvVAdTA9QAsWew/exec";

// Initialize audio elements
const spinSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3');
const winSound = new Audio('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3');

// Configure audio elements
spinSound.volume = 0.5;
winSound.volume = 0.7;

// Function to play spin sound with fade out
function playSpinSound() {
    spinSound.currentTime = 0;
    spinSound.play();
    
    // Start fading out when the wheel starts slowing down
    setTimeout(() => {
        const fadeInterval = setInterval(() => {
            if (spinSound.volume > 0.05) {
                spinSound.volume -= 0.05;
            } else {
                clearInterval(fadeInterval);
                spinSound.pause();
                spinSound.volume = 0.5; // Reset volume for next spin
            }
        }, 200);
    }, 2000);
}

// Function to play win sound
function playWinSound() {
    winSound.currentTime = 0;
    winSound.play();
}

// Check if user is registered
function isUserRegistered() {
  const name = localStorage.getItem("Name");
  return name;
}

function postSpinData(prize) {
  console.log(localStorage.getItem("Username"));
  fetch(API_URL, {
    method: "POST",
    redirect: "follow",
    body: JSON.stringify({
      name: localStorage.getItem("Name") || "Test Post",
      prize: prize || "Failed to get bonus",
      timestamp: new Date().getTime(),
      userid: localStorage.getItem("Username") || "TestUserName",
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
  const leaderboardList = document.querySelector('.leaderboard-list');
  const loadingElement = document.querySelector('.leaderboard-loading');
  
  // Show loading state
  loadingElement.style.display = 'flex';
  leaderboardList.style.display = 'none';

  fetch(API_URL)
    .then((resp) => resp.json())
    .then((data) => {
      console.log("Leaderboard data:", data);
      // Update leaderboard display with API data
      leaderboardList.innerHTML = ''; // Clear existing entries
      
      if (Array.isArray(data) && data.length > 1) {
        // Skip first row (headers) and reverse the data to show most recent first
        const entries = data.slice(1).reverse();
        // Take only top 5 results from the reversed data
        entries.slice(0, 5).forEach((entry, index) => {
          const date = new Date(entry[2]);
          const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
          
          const li = document.createElement('li');
          li.className = 'leaderboard-item';
          li.innerHTML = `
            <div class="leaderboard-rank">${index + 1}</div>
            <div class="leaderboard-info">
              <div class="leaderboard-name">${entry[0]}</div>
              <div class="leaderboard-prize">${entry[1]}</div>
              <div class="leaderboard-date">${formattedDate}</div>
            </div>
          `;
          leaderboardList.appendChild(li);
        });
      } else {
        // Show empty state with emoji
        leaderboardList.innerHTML = `
          <li class="leaderboard-item" style="
            width: 100%; 
            text-align: center; 
            background: rgba(255, 255, 255, 0.15);
            padding: 30px;
            flex-direction: column;
            gap: 15px;
          ">
            <div style="font-size: 48px;">🎰</div>
            <div style="
              color: #FF6B6B;
              font-size: 1.2rem;
              font-weight: 600;
            ">Be the first winner!</div>
            <div style="
              color: rgba(255, 255, 255, 0.8);
              font-size: 0.9rem;
            ">Spin the wheel to get on the leaderboard</div>
          </li>
        `;
      }

      // Hide loading state and show content with fade effect
      loadingElement.style.opacity = '0';
      setTimeout(() => {
        loadingElement.style.display = 'none';
        leaderboardList.style.display = 'flex';
        // Trigger reflow
        void leaderboardList.offsetWidth;
        leaderboardList.style.opacity = '1';
      }, 300);
    })
    .catch(error => {
      console.error('Error fetching leaderboard data:', error);
      // Hide loading state and show error message
      loadingElement.style.display = 'none';
      leaderboardList.style.display = 'flex';
      leaderboardList.innerHTML = `
        <li class="leaderboard-item" style="
          width: 100%; 
          text-align: center; 
          background: rgba(255, 255, 255, 0.15);
          padding: 30px;
          flex-direction: column;
          gap: 15px;
        ">
          <div style="font-size: 48px;">😕</div>
          <div style="
            color: #FF6B6B;
            font-size: 1.2rem;
            font-weight: 600;
          ">Unable to load leaderboard data</div>
          <div style="
            color: rgba(255, 255, 255, 0.8);
            font-size: 0.9rem;
          ">Please try again later</div>
        </li>
      `;
    });
}

function getNextSpinTime() {
    const lastSpinTime = localStorage.getItem('lastSpinTime');
    if (!lastSpinTime) {
        // If no last spin time, return current time to allow immediate spin
        return new Date();
    }
    const nextSpinTime = new Date(parseInt(lastSpinTime));
    nextSpinTime.setHours(nextSpinTime.getHours() + 24);
    return nextSpinTime;
}

function updateTimer() {
    const now = new Date();
    const nextSpin = getNextSpinTime();
    
    if (now >= nextSpin) {
        console.log("Timer complete, enabling spin button");
        if (existingTimer) {
            existingTimer.remove();
        }
        if (spinEl) {
            spinEl.style.removeProperty('pointer-events');
            spinEl.style.removeProperty('opacity');
            spinEl.style.cursor = 'pointer';
            spinEl.innerHTML = `
                <div style="
                    font-size: 32px;
                    font-weight: bold;
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
                    letter-spacing: 2px;
                    font-family: 'Poppins', Arial, sans-serif;
                    margin-bottom: 5px;
                    pointer-events: none;
                ">🎰 SPIN 🎰</div>
                <div style="
                    font-size: 16px;
                    opacity: 0.9;
                    font-family: 'Poppins', Arial, sans-serif;
                    font-weight: 600;
                    pointer-events: none;
                ">Click to Win!</div>
            `;
            spinEl.style.background = "linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 50%, #45B7D1 100%)";
            spinEl.style.transform = "translate(-50%, -50%) scale(1)";
        }
        return;
    }

    let timerElement = document.getElementById('next-spin-timer');
    
    // Create timer element if it doesn't exist
    if (!timerElement) {
        console.log("Creating timer element");
        timerElement = document.createElement('div');
        timerElement.id = 'next-spin-timer';
        timerElement.style.cssText = `
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            padding: 15px 30px;
            border-radius: 20px;
            color: white;
            font-size: 1.2rem;
            font-weight: 600;
            text-align: center;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            z-index: 1000;
            display: block;
        `;
        const spinWheel = document.getElementById('spin_the_wheel');
        if (spinWheel) {
            spinWheel.appendChild(timerElement);
            console.log("Timer element added to DOM");
        } else {
            console.error("Could not find spin_the_wheel element");
        }
    }

    const diff = nextSpin - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (timerElement) {
        timerElement.innerHTML = `Next spin available in: <span style="color: #FF6B6B; font-weight: 700; margin-left: 8px;">${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}</span>`;
        timerElement.style.display = 'block';
    }
    
    // Only disable the button if the timer is still running
    if (diff > 0) {
        if (spinEl) {
            // Make button less visible and show it's disabled
            spinEl.style.pointerEvents = 'none';
            spinEl.style.opacity = '0.3';
            spinEl.style.cursor = 'not-allowed';
            spinEl.style.transform = 'translate(-50%, -50%) scale(0.95)';
            spinEl.style.background = 'linear-gradient(135deg, #808080 0%, #A0A0A0 100%)';
            spinEl.innerHTML = `
                <div style="
                    font-size: 24px;
                    font-weight: bold;
                    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
                    letter-spacing: 1px;
                    font-family: 'Poppins', Arial, sans-serif;
                    margin-bottom: 5px;
                    color: rgba(255, 255, 255, 0.7);
                    pointer-events: none;
                ">⏳ WAIT ⏳</div>
                <div style="
                    font-size: 14px;
                    opacity: 0.7;
                    font-family: 'Poppins', Arial, sans-serif;
                    font-weight: 500;
                    color: rgba(255, 255, 255, 0.7);
                    pointer-events: none;
                ">Next spin soon</div>
            `;
        }
        requestAnimationFrame(updateTimer);
    } else {
        // Enable the button when timer is done
        if (spinEl) {
            spinEl.style.removeProperty('pointer-events');
            spinEl.style.removeProperty('opacity');
            spinEl.style.cursor = 'pointer';
            spinEl.style.transform = 'translate(-50%, -50%) scale(1)';
            spinEl.style.background = 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 50%, #45B7D1 100%)';
        }
        if (timerElement) {
            timerElement.style.display = 'none';
            timerElement.remove();
        }
    }
}

function checkSpinAvailability() {
    const now = new Date();
    const nextSpin = getNextSpinTime();
    if (now < nextSpin) {
        updateTimer();
        return false;
    }
    return true;
}

function initializeSpinner() {
    console.log("Initializing spinner...");
    rotate(); // Initial rotation
    engine(); // Start engine
    
    // Ensure spin button is properly set up
    if (!spinEl) {
        console.error("Spin button element not found!");
        return;
    }

    // Check if spin is available immediately
    if (!checkSpinAvailability()) {
        console.log("Spin not available on initialization");
        return;
    }

    // Make sure spin button is visible and clickable by default
    spinEl.style.removeProperty('pointer-events');
    spinEl.style.removeProperty('opacity');
    spinEl.style.cursor = 'pointer';
    
    console.log("Spin button initialized:", {
        pointerEvents: spinEl.style.pointerEvents,
        opacity: spinEl.style.opacity,
        cursor: spinEl.style.cursor
    });

    // Add click handler
    spinEl.addEventListener("click", () => {
        console.log("Spin button clicked");
        if (!checkSpinAvailability()) {
            console.log("Spin not available yet");
            return;
        }
        
        if (!angVel) {
            angVel = rand(0.25, 0.45);
            spinButtonClicked = true;
            playSpinSound(); // Play spin sound when wheel starts spinning
        }
    });
}

function getMySpinData(userId) {
    if (!userId) {
        console.log("No userId provided, enabling spin button");
        if (spinEl) {
            spinEl.style.removeProperty('pointer-events');
            spinEl.style.removeProperty('opacity');
            spinEl.style.cursor = 'pointer';
        }
        return;
    }
    
    console.log("Fetching spin data for user:", userId);
    const url = `${API_URL}?action=getById&userid=${encodeURIComponent(localStorage.getItem("Username"))}`;
    fetch(url)
        .then((resp) => resp.json())
        .then((data) => {
            console.log("Spin data by id:", data);
            if (data && data.length > 1 && data[1] && data[1][2]) {
                const lastSpinTime = new Date(data[1][2]).getTime();
                localStorage.setItem("lastSpinTime", lastSpinTime.toString());
                
                // Check if we need to show the timer
                const now = new Date().getTime();
                const nextSpin = new Date(lastSpinTime);
                nextSpin.setHours(nextSpin.getHours() + 24);
                
                console.log("Current time:", new Date(now));
                console.log("Next spin time:", nextSpin);
                
                if (now >= nextSpin.getTime()) {
                    console.log("Spin time passed, enabling button");
                    if (spinEl) {
                        spinEl.style.removeProperty('pointer-events');
                        spinEl.style.removeProperty('opacity');
                        spinEl.style.cursor = 'pointer';
                    }
                } else {
                    console.log("Spin time not passed, starting timer");
                    // Start the timer immediately and ensure it continues
                    updateTimer();
                    // Set an interval to keep updating the timer
                    const timerInterval = setInterval(() => {
                        const currentTime = new Date().getTime();
                        if (currentTime >= nextSpin.getTime()) {
                            clearInterval(timerInterval);
                            if (spinEl) {
                                spinEl.style.removeProperty('pointer-events');
                                spinEl.style.removeProperty('opacity');
                                spinEl.style.cursor = 'pointer';
                            }
                            const existingTimer = document.getElementById('next-spin-timer');
                            if (existingTimer) {
                                existingTimer.remove();
                            }
                        } else {
                            updateTimer();
                        }
                    }, 1000);
                }
            } else {
                console.log("No valid spin data, enabling button");
                if (spinEl) {
                    spinEl.style.removeProperty('pointer-events');
                    spinEl.style.removeProperty('opacity');
                    spinEl.style.cursor = 'pointer';
                }
            }
        })
        .catch(error => {
            console.error('Error fetching spin data:', error);
            if (spinEl) {
                spinEl.style.removeProperty('pointer-events');
                spinEl.style.removeProperty('opacity');
                spinEl.style.cursor = 'pointer';
            }
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
  // Only allow hiding if user is registered
  if (!isUserRegistered()) {
    return;
  }
  
  const modal = document.getElementById("registrationModal");
  if (modal) {
    modal.classList.add("hidden");
    setTimeout(() => {
      document.body.classList.add("spinner-visible");
      document.body.style.overflow = "auto";
    }, 400);
  }
}

function generateUsername(name) {
  // Get first 3 letters of the name and convert to uppercase
  const firstThree = name.substring(0, 3).toUpperCase();
  
  // Generate random number between 100-999 (to ensure 3 digits)
  const randomNum = Math.floor(Math.random() * 900) + 100;
  
  // Combine letters and numbers
  return `${firstThree}${randomNum}`;
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

// Handle registration form submission
function handleRegistration() {
  const form = document.getElementById("spinForm");
  const nameInput = document.getElementById("name");
  const closeButton = document.getElementById("closeModal");
  const backdrop = document.querySelector(".modal-backdrop");

  // Disable close button initially
  if (closeButton) {
    closeButton.style.opacity = "0.5";
    closeButton.style.cursor = "not-allowed";
  }

  // Prevent backdrop click from closing
  if (backdrop) {
    backdrop.onclick = null;
  }

  if (form && nameInput) {
    // Add input validation
    nameInput.addEventListener("input", function() {
      const name = this.value.trim();
      const feedback = this.parentNode.querySelector(".feedback");
      const submitBtn = document.querySelector(".submit-btn");
      
      if (name.length < 2) {
        feedback.textContent = "Name must be at least 2 characters long";
        feedback.style.color = "#ef4444";
        submitBtn.disabled = true;
        submitBtn.style.opacity = "0.5";
        submitBtn.style.cursor = "not-allowed";
      } else {
        feedback.textContent = "";
        submitBtn.disabled = false;
        submitBtn.style.opacity = "1";
        submitBtn.style.cursor = "pointer";
      }
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = nameInput.value.trim();
      const feedback = nameInput.parentNode.querySelector(".feedback");

      if (name.length < 2) {
        feedback.textContent = "Name must be at least 2 characters long";
        feedback.style.color = "#ef4444";
        return;
      }

      // Store in localStorage
      localStorage.setItem("Name", name);
      localStorage.setItem("Username", generateUsername(name));
      // Show success message
      const submitBtn = document.querySelector(".submit-btn");
      if (submitBtn) {
        submitBtn.innerHTML = "✓ Registration Complete!";
        submitBtn.style.background = "linear-gradient(135deg, #10b981 0%, #059669 100%)";
        submitBtn.disabled = true;
      }

      // Hide modal and show spinner after delay
      setTimeout(() => {
        hideModal();
        initializeSpinner();
      }, 1500);
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
        pointer-events: none;
      ">🎰 SPIN 🎰</div>
      <div style="
        font-size: 16px;
        opacity: 0.9;
        font-family: 'Poppins', Arial, sans-serif;
        font-weight: 600;
        pointer-events: none;
      ">Click to Win!</div>
    `;
    spinEl.style.background = "linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 50%, #45B7D1 100%)";
    spinEl.style.color = "#FFF";
    spinEl.style.border = "6px solid #FFF";
    spinEl.style.boxShadow = "0 12px 25px rgba(0, 0, 0, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.2)";
    spinEl.style.cursor = "pointer";
  } else {
    spinEl.innerHTML = `
      <div style="
        font-size: 28px;
        font-weight: bold;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        font-family: 'Poppins', Arial, sans-serif;
        text-align: center;
        line-height: 1.2;
        pointer-events: none;
      ">${sector.label}</div>
    `;
    spinEl.style.background = `linear-gradient(135deg, ${sector.color} 0%, ${sector.color}CC 100%)`;
    spinEl.style.color = sector.text;
    spinEl.style.border = "6px solid #FFF";
    spinEl.style.boxShadow = "0 12px 25px rgba(0, 0, 0, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.2)";
    spinEl.style.cursor = "default";
  }

  // Make the center button bigger and ensure it's clickable
  spinEl.style.width = "180px";
  spinEl.style.height = "180px";
  spinEl.style.borderRadius = "50%";
  spinEl.style.display = "flex";
  spinEl.style.flexDirection = "column";
  spinEl.style.justifyContent = "center";
  spinEl.style.alignItems = "center";
  spinEl.style.transition = "all 0.3s ease";
  spinEl.style.position = "absolute";
  spinEl.style.top = "50%";
  spinEl.style.left = "50%";
  spinEl.style.transform = "translate(-50%, -50%)";
  spinEl.style.zIndex = "2";

  // Hover effect for spin button
  if (!angVel) {
    spinEl.onmouseenter = () => {
      spinEl.style.transform = "translate(-50%, -50%) scale(1.1)";
      spinEl.style.boxShadow = "0 16px 30px rgba(0, 0, 0, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.3)";
    };
    spinEl.onmouseleave = () => {
      spinEl.style.transform = "translate(-50%, -50%) scale(1)";
      spinEl.style.boxShadow = "0 12px 25px rgba(0, 0, 0, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.2)";
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

// Modify the updateLeaderboard function to only handle new entries
function updateLeaderboard(newEntry) {
    if (newEntry) {
        // After adding new entry, refresh the leaderboard
        getSpinData();
    }
}

// Update spinEnd event listener
events.addListener("spinEnd", (sector) => {
    console.log(`Woop! You won ${sector.label}`);
    
    // Stop spin sound if it's still playing
    spinSound.pause();
    spinSound.currentTime = 0;
    spinSound.volume = 0.5; // Reset volume
    
    // Play win sound
    playWinSound();
    
    // Store the current time as last spin time
    localStorage.setItem('lastSpinTime', new Date().getTime().toString());
    
    // Show victory popup
    setTimeout(() => {
        showVictoryPopup(sector.label);
    }, 1000);

    // Start the timer
    updateTimer();

    // Post spin data with user's name
    postSpinData(sector.label);
    
    // Update Top Winners list
    setTimeout(() => {
        getSpinData();
    }, 1500); // Give some time for the server to process the new spin data
});

// Update init function to ensure proper initialization order
function init() {
    sectors.forEach(drawSector);
    // Get initial leaderboard data
    getSpinData();
    
    // Check if user is registered
    if (!isUserRegistered()) {
        // Show modal and keep spinner hidden
        showModal();
        handleRegistration();

        // Disable Escape key
        document.addEventListener("keydown", function(e) {
            if (e.key === "Escape" && !isUserRegistered()) {
                e.preventDefault();
                return false;
            }
        });
    } else {
        // User is already registered
        hideModal();
        document.body.classList.add('spinner-visible');
        
        // First initialize the spinner
        initializeSpinner();
        
        // Then check for previous spin data
        // This ensures the button is clickable by default until we confirm they need to wait
        const userId = localStorage.getItem("Username");
        if (userId) {
            getMySpinData(userId);
        } else {
            // If no userId, make sure the button is clickable
            if (spinEl) {
                spinEl.style.removeProperty('pointer-events');
                spinEl.style.removeProperty('opacity');
                spinEl.style.cursor = 'pointer';
            }
        }
    }
}

init();

document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('registrationModal');
    const form = document.getElementById('spinForm');
    const inputs = document.querySelectorAll('.form-control');
    const spinnerContainer = document.getElementById('spin_the_wheel');

    // Initially hide spinner until registration is complete
    document.body.classList.remove('spinner-visible');

    // Prevent any closing attempts
    window.addEventListener('click', function(e) {
        if (!isUserRegistered()) {
            e.stopPropagation();
        }
    }, true);

    // Prevent right-click
    window.addEventListener('contextmenu', function(e) {
        if (!isUserRegistered()) {
            e.preventDefault();
        }
    });

    // Prevent keyboard shortcuts
    window.addEventListener('keydown', function(e) {
        if (!isUserRegistered()) {
            // Prevent common closing shortcuts
            if (e.key === 'Escape' || 
                (e.key === 'w' && (e.ctrlKey || e.metaKey)) || 
                (e.key === 'F4' && e.altKey)) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        }
    }, true);

    // Form submission
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Simple validation
        let isValid = true;
        inputs.forEach(input => {
            const feedback = input.parentNode.querySelector('.feedback');
            if (!input.value.trim()) {
                feedback.textContent = 'This field is required';
                input.style.borderColor = '#ef4444';
                isValid = false;
            } else {
                feedback.textContent = '';
                input.style.borderColor = '#10b981';
            }
        });

        if (isValid) {
            // Store user data
            const userData = {
                name: document.getElementById('name').value,
            };
            localStorage.setItem('Name', userData.name);
            const username = userData.name.toLowerCase().replace(/\s+/g, '');

            console.log('User registered:', userData);

            // Show success state
            const submitBtn = document.querySelector('.submit-btn');
            submitBtn.innerHTML = '✓ Registration Complete!';
            submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';

            // Only now allow modal to close and show spinner
            setTimeout(() => {
                modal.classList.add('hidden');
                document.body.classList.add('spinner-visible');
                document.body.style.overflow = 'auto';
                initializeSpinner();
            }, 1500);
        }
    });

    // Input focus effects
    inputs.forEach(input => {
        input.addEventListener('focus', function () {
            this.parentNode.style.transform = 'translateY(-2px)';
        });

        input.addEventListener('blur', function () {
            this.parentNode.style.transform = 'translateY(0)';
        });

        // Clear validation on input
        input.addEventListener('input', function () {
            const feedback = this.parentNode.querySelector('.feedback');
            feedback.textContent = '';
            this.style.borderColor = '#e5e7eb';
        });
    });

    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
});
