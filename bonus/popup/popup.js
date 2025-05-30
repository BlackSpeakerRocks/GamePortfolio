// modal.js
var isRegistered = localStorage.getItem("Name");
document.addEventListener("DOMContentLoaded", function () {
  console.log(isRegistered);
  if (isRegistered === null) {
    console.log("Why am i here? ");
    const openButtons = document.querySelectorAll(".open-modal");
    const modal = document.querySelector(".modal");
    const closeButtons = document.querySelectorAll(".close-modal");

    const form = document.getElementById("spinForm");
    const input = document.getElementById("name");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = input.value.trim();
      console.log(name);

      if (name === "") {
        alert("Please enter your name");
      } else if (name.length > 20) {
        alert("Name cannot be loger than 20 characters");
      } else {
        console.log("here");
        register(name);
        closeButtons.forEach((btn) => {
          btn.addEventListener("click", () => {
            isRegistered = localStorage.getItem("Name");
            if (isRegistered !== null) {
              modal.classList.remove("visible");
            } else {
              alert("Register First");
            }
          });
        });
      }
    });

    function register(name) {
      console.log("Resitered Mr. name");
      localStorage.setItem("Name", name);
    }
  } else {
    const modal = document.querySelector(".modal");
    modal.classList.remove("visible");
  }
});
