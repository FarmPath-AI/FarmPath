console.log("🌱 AgroGuide AI initialized successfully!");

// Add a subtle scroll effect to the navigation bar
const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
  if (window.scrollY > 20) {
    navbar.style.boxShadow = "0 5px 25px rgba(0,0,0,0.05)";
  } else {
    navbar.style.boxShadow = "none";
  }
});

// Simple entrance animation
document.addEventListener("DOMContentLoaded", () => {
  console.log("Welcome to AgroGuide AI 🚜");
});
