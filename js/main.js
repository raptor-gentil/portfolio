(() => {
    const clock = document.getElementById("clock");
    const date = document.getElementById("date");
    const uptime = document.getElementById("uptime");
    const audio = document.getElementById("audio");
    const playBtn = document.getElementById("play-btn");
    const progress = document.getElementById("progress");
    const volume = document.getElementById("volume");
    const muteBtn = document.getElementById("mute-btn");
    const time = document.getElementById("time");

    function updateClock() {
        const now = new Date();
        if (clock) {
            clock.textContent = now.toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            });
        }
        if (date) {
            date.textContent = now.toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            });
        }
    }

    const start = Date.now();
    function updateUptime() {
        if (!uptime) return;
        const elapsed = Math.floor((Date.now() - start) / 1000);
        const h = String(Math.floor(elapsed / 3600)).padStart(2, "0");
        const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, "0");
        const s = String(elapsed % 60).padStart(2, "0");
        uptime.textContent = `UPTIME ${h}:${m}:${s}`;
    }

    updateClock();
    updateUptime();
    setInterval(updateClock, 1000);
    setInterval(updateUptime, 1000);

    const heroCard = document.querySelector(".hero-card");
    const background = document.querySelector(".background-system");

    if (heroCard && window.matchMedia("(pointer:fine)").matches) {
        document.addEventListener("mousemove", (event) => {
            const x = (event.clientX / window.innerWidth - 0.5);
            const y = (event.clientY / window.innerHeight - 0.5);

            heroCard.style.transform =
                `rotate(${x * 2.5}deg) translate(${x * 5}px, ${y * 5}px)`;

            if (background) {
                background.style.transform =
                    `translate(${x * -8}px, ${y * -8}px)`;
            }
        });
    }

    document.querySelectorAll(".filter").forEach(button => {
        button.addEventListener("click", () => {
            document.querySelectorAll(".filter").forEach(item => item.classList.remove("active"));
            button.classList.add("active");

            const filter = button.dataset.filter;
            document.querySelectorAll(".all-projects .project").forEach(project => {
                const visible = filter === "all" || project.dataset.category === filter;
                project.classList.toggle("hidden", !visible);
            });
        });
    });

    const revealItems = document.querySelectorAll(".project, .skill, .detail-section, .detail-content");
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0)";
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08 });

        revealItems.forEach((item, index) => {
            item.style.opacity = "0";
            item.style.transform = "translateY(14px)";
            item.style.transition = `opacity .55s ease ${Math.min(index * 40, 240)}ms, transform .55s ease ${Math.min(index * 40, 240)}ms`;
            observer.observe(item);
        });
    }


    playBtn.addEventListener("click", () => {
        if (audio.paused) {
            audio.play();
            playBtn.textContent = "Ⅱ";
        } else {
            audio.pause();
            playBtn.textContent = "▶";
        }
    });

    audio.addEventListener("timeupdate", () => {
        if (!audio.duration) return;

        progress.value = (audio.currentTime / audio.duration) * 100;

        time.textContent =
            formatTime(audio.currentTime) +
            " / " +
            formatTime(audio.duration);
    });

    progress.addEventListener("input", () => {
        audio.currentTime =
            (progress.value / 100) * audio.duration;
    });

    volume.addEventListener("input", () => {
        audio.volume = volume.value / 100;
    });

    muteBtn.addEventListener("click", () => {
        audio.muted = !audio.muted;

        muteBtn.textContent = audio.muted ? "🔇" : "🔊";
    });

    audio.addEventListener("ended", () => {
        playBtn.textContent = "▶";
        progress.value = 0;
    });

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);

        return (
            String(minutes).padStart(2, "0") +
            ":" +
            String(secs).padStart(2, "0")
        );
    }
})();