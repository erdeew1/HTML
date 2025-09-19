'use strict';

const navbar = document.querySelector("[data-navbar]");
const navbarLinks = document.querySelectorAll("[data-nav-link]");
const navbarToggler = document.querySelector("[data-nav-toggler]");
const header = document.querySelector(".navbar");
let lastScrollY = window.scrollY;

// 💡 Toggle Navbar with Animation
navbarToggler.addEventListener("click", function () {
    navbar.classList.toggle("active");
    this.classList.toggle("active");

    // Add blur effect when navbar is open
    if (navbar.classList.contains("active")) {
        document.body.style.overflow = "hidden"; // Disable scroll when menu is open
        navbar.style.backdropFilter = "blur(10px)";
        navbar.style.transition = "all 0.4s ease-in-out";
    } else {
        document.body.style.overflow = "auto";
        navbar.style.backdropFilter = "none";
    }
});

// 💡 Close Navbar on Link Click & Highlight Active Section
navbarLinks.forEach(link => {
    link.addEventListener("click", function () {
        navbar.classList.remove("active");
        navbarToggler.classList.remove("active");
        document.body.style.overflow = "auto"; // Enable scroll when menu closes

        // Remove 'active' class from all links
        navbarLinks.forEach(link => link.classList.remove("active-link"));

        // Add 'active' class to clicked link
        this.classList.add("active-link");
    });
});

// 💡 Hide Navbar on Scroll Down & Show on Scroll Up
window.addEventListener("scroll", () => {
    if (window.scrollY > lastScrollY && window.scrollY > 100) {
        header.style.transform = "translateY(-100%)"; // Hide navbar
    } else {
        header.style.transform = "translateY(0)"; // Show navbar
    }
    lastScrollY = window.scrollY;
});

// 💡 Smooth Scroll to Sections
navbarLinks.forEach(link => {
    link.addEventListener("click", (event) => {
        event.preventDefault();
        const sectionId = link.getAttribute("href").substring(1);
        const section = document.getElementById(sectionId);

        if (section) {
            window.scrollTo({
                top: section.offsetTop - 80,
                behavior: "smooth"
            });
        }
    });
});
