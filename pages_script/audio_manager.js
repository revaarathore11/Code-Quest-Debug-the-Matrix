export const bgMusic = new Audio("./assets/audio/ambient.mp3");

bgMusic.volume = 0.4;
bgMusic.loop = true;
bgMusic.preload = "auto";

window.addEventListener("load", () => {
    bgMusic.play().catch(() => {
        document.addEventListener("click", () => bgMusic.play(), { once: true });
    });
});