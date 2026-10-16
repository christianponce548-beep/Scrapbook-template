const keyPosition = document.getElementById("keyPosition");
const lock = document.getElementById("lock");
const keyScreen = document.getElementById("keyScreen");
const unlockButton = document.getElementById("unlockButton");

const bookScreen = document.getElementById("bookScreen");
const bookButton = document.getElementById("bookButton");
const book = bookButton.querySelector(".book");
const bookPrompt = document.getElementById("bookPrompt");
const transitionStatus = document.getElementById("transitionStatus");

let isUnlocking = false;
let isOpening = false;

function unlockAlbum() {
    if (isUnlocking) return;

    isUnlocking = true;
    keyPosition.disabled = true;
    unlockButton.disabled = true;
    keyPosition.classList.add("unlocking");
    lock.classList.add("unlocking");
    keyScreen.classList.add("leaving");
    transitionStatus.textContent = "Unlocking your memory album.";

    window.setTimeout(() => {
        keyScreen.classList.add("hidden");
        keyScreen.setAttribute("aria-hidden", "true");
        bookScreen.classList.remove("hidden");
        bookScreen.setAttribute("aria-hidden", "false");
        transitionStatus.textContent = "Your album is ready to open.";
        bookButton.focus({ preventScroll: true });
    }, 1250);
}

keyPosition.addEventListener("click", unlockAlbum);
unlockButton.addEventListener("click", unlockAlbum);

bookButton.addEventListener("click", () => {
    if (isOpening) return;

    isOpening = true;
    bookButton.classList.add("opening");
    book.classList.add("open");
    bookButton.disabled = true;
    bookPrompt.innerHTML = "Opening your album <span aria-hidden=\"true\">✦</span>";
    transitionStatus.textContent = "Opening your album.";

    // Website.html is the existing memory-book page in this folder.
    window.setTimeout(() => {
        window.location.href = "Website.html";
    }, 1400);
});
