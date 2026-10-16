const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const themeToggle = document.getElementById("themeToggle");

/* ---------- Mobile navigation ---------- */
function setMenu(open) {
    navLinks.classList.toggle("open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.textContent = open ? "✕" : "☰";
}

menuToggle.addEventListener("click", function () {
    setMenu(!navLinks.classList.contains("open"));
});

navLinks.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
        setMenu(false);
    });
});

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        setMenu(false);
    }
});

/* ---------- Dark / light mode (remembered between visits) ---------- */
function applyTheme(dark) {
    document.body.classList.toggle("dark", dark);
    themeToggle.textContent = dark ? "☀️" : "☾";
    themeToggle.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
}

let savedTheme = null;
try {
    savedTheme = localStorage.getItem("theme");
} catch (error) {
    savedTheme = null;
}

const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
applyTheme(savedTheme ? savedTheme === "dark" : prefersDark);

themeToggle.addEventListener("click", function () {
    const dark = !document.body.classList.contains("dark");
    applyTheme(dark);
    try {
        localStorage.setItem("theme", dark ? "dark" : "light");
    } catch (error) {
        /* storage unavailable, theme just won't be remembered */
    }
});

/* ---------- Highlight the nav link of the section in view ---------- */
const sections = document.querySelectorAll("main section[id]");
const navAnchors = navLinks.querySelectorAll("a");

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                navAnchors.forEach(function (link) {
                    link.classList.toggle(
                        "active",
                        link.getAttribute("href") === "#" + entry.target.id
                    );
                });
            }
        });
    }, { rootMargin: "-40% 0px -55% 0px" });

    sections.forEach(function (section) {
        observer.observe(section);
    });
}

/* ---------- Project filters ---------- */
const filterButtons = document.querySelectorAll(".filter-button");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        const filter = button.dataset.filter;

        filterButtons.forEach(function (item) {
            const isActive = item === button;
            item.classList.toggle("active", isActive);
            item.setAttribute("aria-pressed", String(isActive));
        });

        projectCards.forEach(function (card) {
            card.hidden = filter !== "all" && card.dataset.category !== filter;
        });
    });
});

/* ---------- Contact form validation ---------- */
const contactForm = document.getElementById("contactForm");
const formFeedback = document.getElementById("formFeedback");

function displayError(field, errorId, message) {
    document.getElementById(errorId).textContent = message;
    field.classList.toggle("invalid", message !== "");
    field.setAttribute("aria-invalid", String(message !== ""));
}

contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const message = document.getElementById("message");

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let firstInvalid = null;

    displayError(name, "nameError", "");
    displayError(email, "emailError", "");
    displayError(message, "messageError", "");
    formFeedback.textContent = "";

    if (name.value.trim().length < 2) {
        displayError(name, "nameError", "Please enter at least 2 characters for your name.");
        firstInvalid = firstInvalid || name;
    }

    if (!emailPattern.test(email.value.trim())) {
        displayError(email, "emailError", "Please enter a valid email address.");
        firstInvalid = firstInvalid || email;
    }

    if (message.value.trim().length < 10) {
        displayError(message, "messageError", "Your message must contain at least 10 characters.");
        firstInvalid = firstInvalid || message;
    }

    if (firstInvalid) {
        formFeedback.textContent = "Please correct the highlighted fields.";
        firstInvalid.focus();
        return;
    }

    formFeedback.textContent = "Validation successful! This demo does not send messages.";
    contactForm.reset();
});

/* Clear errors while the user types */
[
    ["name", "nameError"],
    ["email", "emailError"],
    ["message", "messageError"]
].forEach(function (item) {
    const field = document.getElementById(item[0]);

    field.addEventListener("input", function () {
        displayError(field, item[1], "");
        formFeedback.textContent = "";
    });
});

/* ---------- Footer year ---------- */
document.getElementById("year").textContent = new Date().getFullYear();
