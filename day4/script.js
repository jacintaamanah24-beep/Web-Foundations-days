const noteText = document.querySelector("#note-text");
const charCount = document.querySelector("#char-count");
const wordCount = document.querySelector("#word-count");
const clearBtn = document.querySelector("#clear-btn");
const themeToggle = document.querySelector("#theme-toggle");

const DRAFT_KEY = "quicknotes-draft";
const THEME_KEY = "quicknotes-theme";

function updateCounts() {
    const text = noteText.value;

    // Character count
    const characters = text.length;
    charCount.textContent = `${characters} / 200 characters`;

    // Word count
    const trimmedText = text.trim();
    const words = trimmedText === ""
        ? 0
        : trimmedText.split(/\s+/).length;

    wordCount.textContent = `${words} words`;

    // Character warnings
    charCount.classList.remove("warning");
    charCount.classList.remove("over");

    if (characters > 200) {
        charCount.classList.add("over");
    } else if (characters > 180) {
        charCount.classList.add("warning");
    }

    // Save draft
    localStorage.setItem(DRAFT_KEY, text);
}

function clearNote() {
    noteText.value = "";

    charCount.textContent = "0 / 200 characters";
    wordCount.textContent = "0 words";

    charCount.classList.remove("warning", "over");

    localStorage.removeItem(DRAFT_KEY);

    noteText.focus();
}

function loadDraft() {
    const savedDraft = localStorage.getItem(DRAFT_KEY);

    if (savedDraft !== null) {
        noteText.value = savedDraft;
    }

    updateCounts();
}

function updateThemeButton() {
    if (document.body.classList.contains("dark")) {
        themeToggle.textContent = "Light mode";
    } else {
        themeToggle.textContent = "Dark mode";
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);

    if (savedTheme === "dark") {
        document.body.classList.add("dark");
    }

    updateThemeButton();
}

function toggleTheme() {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        localStorage.setItem(THEME_KEY, "dark");
    } else {
        localStorage.setItem(THEME_KEY, "light");
    }

    updateThemeButton();
}

// Count characters and words whenever the user types
noteText.addEventListener("input", updateCounts);

// Clear button
clearBtn.addEventListener("click", clearNote);

// Escape key clears the textarea
noteText.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        clearNote();
    }
});

// Theme toggle
themeToggle.addEventListener("click", toggleTheme);

// Restore saved data when the page loads
loadDraft();
loadTheme();