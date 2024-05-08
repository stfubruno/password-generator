const passwordBox = document.getElementById("password-box");
const lengthSlider = document.getElementById("length-slider");
const lengthText = document.getElementById("length-text");
const includeLetters = document.getElementById("include-letters");
const includeNumbers = document.getElementById("include-numbers");
const includeSymbols = document.getElementById("include-symbols");
const generateButton = document.getElementById("generate-button");
const copyButton = document.getElementById("copy-button");

const CHARSETS = {
  letters: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#%^&*()_"
};

let passwordOptions = {
  length: lengthSlider.value,
  charsets: Object.values(CHARSETS),
};

function updateCharset() {
  passwordOptions.charsets = [
    includeLetters.checked && CHARSETS.letters,
    includeNumbers.checked && CHARSETS.numbers,
    includeSymbols.checked && CHARSETS.symbols
  ].filter(Boolean);
}

function validateSelection() {
  if (passwordOptions.charsets.length === 0) {
    alert("Please select at least one character type to include in the password.");
    return false;
  }
  return true;
}

function updateBackground(passwordLength) {
  const background = document.querySelector(".background");
  background.style.backgroundColor = passwordLength < 9 ? "#be4e3a" : "#1C815A";
}

lengthSlider.addEventListener("input", updatePassword);
generateButton.addEventListener("click", updatePassword);
window.addEventListener("DOMContentLoaded", updatePassword);

function generatePassword() {
  updateCharset();

  if (!validateSelection()) {
    return;
  }

  const passwordArray = new Uint32Array(passwordOptions.length);
  crypto.getRandomValues(passwordArray);

  const password = Array.from(passwordArray, (value, index) => {
    const charset = passwordOptions.charsets[index % passwordOptions.charsets.length];
    const charIndex = value % charset.length;
    return charset.charAt(charIndex);
  }).join("");

  passwordBox.textContent = password;
}

function updatePassword() {
  passwordOptions.length = lengthSlider.value;
  lengthText.textContent = `Length: ${passwordOptions.length}`;
  generatePassword();
  updateBackground(passwordOptions.length);
}

const toast = document.querySelector(".toast")
const closeIcon = document.querySelector(".close")
const progress = document.querySelector(".progress");
let timer1, timer2;

copyButton.addEventListener("click", () => {
  navigator.clipboard.writeText(passwordBox.textContent).then(() => {
    toast.classList.add("active");
    progress.classList.add("active");
    timer1 = setTimeout(() => {
      toast.classList.remove("active");
    }, 3000); //1s = 1000 milliseconds
    timer2 = setTimeout(() => {
      progress.classList.remove("active");
    }, 3300);
  });
});


closeIcon.addEventListener("click", () => {
  toast.classList.remove("active");

  setTimeout(() => {
    progress.classList.remove("active");
  }, 300);
  clearTimeout(timer1);
  clearTimeout(timer2);
});

// Initial generation on page load
window.onload = updatePassword;