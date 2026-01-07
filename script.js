document.addEventListener("DOMContentLoaded", () => {
    // --- 1. Snowfall Logic (თავიდან გაჩერებულია) ---
    const snowContainer = document.getElementById("snow-container");
    const snowSymbol = "•";
    let snowInterval = null; // ეს ცვლადი აკონტროლებს თოვას

    function createSnowflake() {
        const snowflake = document.createElement("div");
        snowflake.classList.add("snowflake");
        snowflake.textContent = snowSymbol;

        snowflake.style.left = Math.random() * 100 + "vw";
        const size = Math.random() * 10 + 5;
        snowflake.style.fontSize = size + "px";
        snowflake.style.opacity = Math.random() * 0.4 + 0.1;

        const duration = Math.random() * 10 + 5;
        snowflake.style.animationDuration = duration + "s";

        if (size < 8) {
            snowflake.style.filter = "blur(1px)";
        }

        snowContainer.appendChild(snowflake);

        setTimeout(() => {
            snowflake.remove();
        }, duration * 1000);
    }

    // --- 2. Key Press "Easter Egg" ---
    document.addEventListener("keydown", (event) => {
        // ვამოწმებთ, დააჭირა თუ არა მომხმარებელმა "S" ღილაკს (დიდს ან პატარას)
        if (event.key === "s" || event.key === "S") {
            if (snowInterval) {
                // თუ უკვე თოვს -> გავაჩეროთ
                clearInterval(snowInterval);
                snowInterval = null;
                console.log("Snow stopped"); // კონსოლში რომ დაინახო
            } else {
                // თუ არ თოვს -> დავიწყოთ
                snowInterval = setInterval(createSnowflake, 100);
                console.log("Let it snow!"); // კონსოლში რომ დაინახო
            }
        }
    });

    // --- 3. Accordion Logic (უცვლელი) ---
    const triggers = document.querySelectorAll(".message.analysis");

    triggers.forEach((trigger) => {
        trigger.addEventListener("click", () => {
            trigger.classList.toggle("active");
            const wrapper = trigger.closest(".content-wrapper");
            const panel = wrapper.querySelector(".analysis-panel");

            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        });
    });
});

const panels = [
    document.getElementById("panel-1"),
    document.getElementById("panel-2"),
    document.getElementById("panel-3"),
    document.getElementById("panel-4"),
    document.getElementById("panel-5"),
];

const audio = document.getElementById("bgm");
const hint = document.getElementById("hint");

window.addEventListener("scroll", () => {
    const scrollPercent =
        window.scrollY / (document.body.offsetHeight - window.innerHeight);

    const redIntensity = Math.floor(scrollPercent * 100);
    document.body.style.setProperty("--bg-red", `rgb(${redIntensity}, 0, 0)`);

    if (scrollPercent > 0.01 && audio.paused) {
        audio
            .play()
            .catch((e) =>
                console.log("Audio play blocked until user interaction")
            );
        hint.style.opacity = "0";
    }

    const step = 1 / panels.length;

    panels.forEach((panel, index) => {
        const start = index * step;
        const end = (index + 1) * step;

        if (scrollPercent >= start && scrollPercent <= end) {
            const localProgress = (scrollPercent - start) / step;

            panel.style.opacity = Math.min(localProgress * 4, 1);

            let currentScale = 1.1 - localProgress * 0.1;
            panel.style.transform = `scale(${currentScale})`;

            if (index === panels.length - 1 && localProgress > 0.05) {
                panel.classList.add("shake-active");
            } else {
                panel.classList.remove("shake-active");
            }

            if (localProgress > 0.8 && index !== panels.length - 1) {
                panel.style.opacity = 1 - (localProgress - 0.8) * 5;
            }
        } else {
            panel.style.opacity = "0";
            panel.classList.remove("shake-active");
        }
    });
});
