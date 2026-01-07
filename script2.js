const panels = [
    document.getElementById("panel-11"),
    document.getElementById("panel-12"),
    document.getElementById("panel-13"),
    document.getElementById("panel-14"),
    document.getElementById("panel-15"),
];
const audio = document.getElementById("bgmm");
const hint = document.getElementById("hint2");

window.addEventListener("scroll", () => {
    const scrollPercent =
        window.scrollY / (document.body.offsetHeight - window.innerHeight);

    // Apply color to the GREEN channel: rgb(0, intensity, 0)
    const greenIntensity = Math.floor(scrollPercent * 100);
    document.body.style.setProperty(
        "--bg-green",
        `rgb(0, ${greenIntensity}, 0)`
    );

    // Audio Playback
    if (scrollPercent > 0.01 && audio.paused) {
        audio
            .play()
            .catch((e) => console.log("Audio blocked: waiting for user click"));
        hint.style.opacity = "0";
    }

    const step = 1 / panels.length;

    panels.forEach((panel, index) => {
        const start = index * step;
        const end = (index + 1) * step;

        if (scrollPercent >= start && scrollPercent <= end) {
            const localProgress = (scrollPercent - start) / step;

            // Fade in logic
            panel.style.opacity = Math.min(localProgress * 4, 1);

            // Subtle zoom logic
            let currentScale = 1.1 - localProgress * 0.1;
            panel.style.transform = `scale(${currentScale})`;

            // Shake logic for the final panel
            if (index === panels.length - 1 && localProgress > 0.05) {
                panel.classList.add("shake-active");
            } else {
                panel.classList.remove("shake-active");
            }

            // Fade out logic for transitions
            if (localProgress > 0.8 && index !== panels.length - 1) {
                panel.style.opacity = 1 - (localProgress - 0.8) * 5;
            }
        } else {
            panel.style.opacity = "0";
            panel.classList.remove("shake-active");
        }
    });
});
