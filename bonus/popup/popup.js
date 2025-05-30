// modal.js (exported version)
function initializeModal() {
  const isRegistered = localStorage.getItem("Name");
  console.log(isRegistered);

  const modal = document.querySelector(".modal");

  if (isRegistered === null) {
    console.log("Why am I here? ");
    const openButtons = document.querySelectorAll(".open-modal");
    const closeButtons = document.querySelectorAll(".close-modal");
    const form = document.getElementById("spinForm");
    const input = document.getElementById("name");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = input.value.trim();

      if (name === "") {
        alert("Please enter your name");
      } else if (name.length > 20) {
        alert("Name cannot be longer than 20 characters");
      } else {
        register(name);
        closeButtons.forEach((btn) => {
          btn.addEventListener("click", () => {
            if (localStorage.getItem("Name") !== null) {
              modal.classList.remove("visible");
            } else {
              alert("Register First");
            }
          });
        });
      }
    });

    function register(name) {
      localStorage.setItem("Name", name);
    }
  } else {
    modal.classList.remove("visible");
  }
}
