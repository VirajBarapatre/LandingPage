// main.js
document.addEventListener("DOMContentLoaded", () => {
    // =========================
    // 1. Smooth scroll for nav links
    // =========================
    const navLinks = document.querySelectorAll(
      '.navbar-nav .nav-link[href^="#"]'
    );
  
    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetSelector = link.getAttribute("href");
        const target = document.querySelector(targetSelector);
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      });
    });
  
    window.scrollToSection = function (selector) {
      const el = document.querySelector(selector);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    };
  
    // =========================
    // 2. Back-to-top button
    // =========================
    const backToTopBtn = document.getElementById("backToTop");
  
    function updateBackToTop() {
      if (window.scrollY > 260) {
        backToTopBtn.style.display = "flex";
      } else {
        backToTopBtn.style.display = "none";
      }
    }
  
    if(backToTopBtn) {
        updateBackToTop();
        window.addEventListener("scroll", updateBackToTop);
  
        backToTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }
  
    // =========================
    // 3. Dynamic year in footer
    // =========================
    const yearSpan = document.getElementById("year");
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
    }
  
    // =========================
    // 4. Reading progress bar
    // =========================
    const progressBar = document.createElement("div");
    const progressFill = document.createElement("div");
  
    progressBar.style.position = "fixed";
    progressBar.style.top = "0";
    progressBar.style.left = "0";
    progressBar.style.width = "100%";
    progressBar.style.height = "4px";
    progressBar.style.background = "rgba(0,0,0,0.04)";
    progressBar.style.zIndex = "9999";
  
    progressFill.style.height = "100%";
    progressFill.style.width = "0";
    progressFill.style.background = "#176b3b"; // matches primary color
    progressFill.style.transition = "width 0.15s ease-out";
  
    progressBar.appendChild(progressFill);
    document.body.appendChild(progressBar);
  
    function updateProgressBar() {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop || document.body.scrollTop;
      const scrollHeight = doc.scrollHeight - doc.clientHeight;
  
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      progressFill.style.width = progress + "%";
    }
  
    updateProgressBar();
    window.addEventListener("scroll", updateProgressBar);
    window.addEventListener("resize", updateProgressBar);
  
    // =========================
    // 5. Scroll spy
    // =========================
    const sections = document.querySelectorAll("section[id]");
    const sectionIdToNavLink = {};
  
    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        const id = href.slice(1);
        sectionIdToNavLink[id] = link;
      }
    });
  
    let activeId = null;
  
    function handleScrollSpy() {
      let bestId = null;
      let smallestOffset = Infinity;
      const scrollY = window.scrollY;
  
      sections.forEach((section) => {
        const rectTop = section.getBoundingClientRect().top + scrollY;
        const offset = Math.abs(rectTop - scrollY - 140);
        if (offset < smallestOffset) {
          smallestOffset = offset;
          bestId = section.id;
        }
      });
  
      if (bestId && bestId !== activeId) {
        navLinks.forEach((link) => link.classList.remove("active"));
        const newActive = sectionIdToNavLink[bestId];
        if (newActive) newActive.classList.add("active");
        activeId = bestId;
      }
    }
  
    handleScrollSpy();
    window.addEventListener("scroll", handleScrollSpy);
    window.addEventListener("resize", handleScrollSpy);
  
    // =========================
    // 6. Keyboard shortcuts
    // =========================
    const shortcutMap = [
      "#about",   // 1
      "#flow",    // 2
      "#court",   // 3
      "#skills",  // 4
      "#players", // 5
      "#physics", // 6
      "#glossary",// 7
      "#faq",     // 8
      "#start"    // 9
    ];
  
    document.addEventListener("keydown", (e) => {
      const tag = (e.target.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea") return;
  
      const num = parseInt(e.key, 10);
      if (!isNaN(num) && num >= 1 && num <= shortcutMap.length) {
        const selector = shortcutMap[num - 1];
        const target = document.querySelector(selector);
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      }
    });

    // =========================
    // 7. Interactive Scoreboard
    // =========================
    let scoreA = 0;
    let scoreB = 0;
    
    // 0=Love, 1=15, 2=30, 3=40
    const pointsMap = ["0", "15", "30", "40"];

    function updateScoreBoard() {
        const elA = document.getElementById("scoreA");
        const elB = document.getElementById("scoreB");
        const info = document.getElementById("scoreInfo");

        if(!elA || !elB) return;

        // Normal game
        if (scoreA <= 3 && scoreB <= 3 && !(scoreA === 3 && scoreB === 3)) {
            elA.textContent = pointsMap[scoreA];
            elB.textContent = pointsMap[scoreB];
            info.textContent = "Keep playing!";
        } 
        // Deuce
        else if (scoreA === 3 && scoreB === 3) {
            elA.textContent = "40";
            elB.textContent = "40";
            info.textContent = "Deuce! (Need 2 in a row to win)";
        }
        // Advantage A
        else if (scoreA > 3 && scoreA === scoreB + 1) {
            elA.textContent = "Ad";
            elB.textContent = "40";
            info.textContent = "Advantage Player A";
        }
        // Advantage B
        else if (scoreB > 3 && scoreB === scoreA + 1) {
            elA.textContent = "40";
            elB.textContent = "Ad";
            info.textContent = "Advantage Player B";
        }
        // Game A
        else if (scoreA > 3 && scoreA >= scoreB + 2) {
            elA.textContent = "Game";
            elB.textContent = "-";
            info.textContent = "Game to Player A! (Resetting in 3s...)";
            disableBtns(true);
            setTimeout(resetGame, 3000);
        }
        // Game B
        else if (scoreB > 3 && scoreB >= scoreA + 2) {
            elA.textContent = "-";
            elB.textContent = "Game";
            info.textContent = "Game to Player B! (Resetting in 3s...)";
            disableBtns(true);
            setTimeout(resetGame, 3000);
        }
        // Back to Deuce from Ad
        else if (scoreA === scoreB && scoreA >= 3) {
            elA.textContent = "40";
            elB.textContent = "40";
            info.textContent = "Back to Deuce!";
        }
    }

    function resetGame() {
        scoreA = 0;
        scoreB = 0;
        disableBtns(false);
        updateScoreBoard();
        document.getElementById("scoreInfo").textContent = "New Game Started (0-0)";
    }

    function disableBtns(bool) {
        document.getElementById("btnPointA").disabled = bool;
        document.getElementById("btnPointB").disabled = bool;
    }

    const btnA = document.getElementById("btnPointA");
    const btnB = document.getElementById("btnPointB");
    const btnReset = document.getElementById("btnResetScore");

    if (btnA && btnB && btnReset) {
        btnA.addEventListener("click", () => { scoreA++; updateScoreBoard(); });
        btnB.addEventListener("click", () => { scoreB++; updateScoreBoard(); });
        btnReset.addEventListener("click", resetGame);
    }

    // =========================
    // 8. Interactive Court Map
    // =========================
    const courtZones = document.querySelectorAll(".zone");
    const tooltip = document.getElementById("courtTooltip");

    courtZones.forEach(zone => {
        zone.addEventListener("mouseenter", () => {
            const text = zone.getAttribute("data-info");
            if(tooltip) tooltip.textContent = text;
        });
        zone.addEventListener("mouseleave", () => {
            if(tooltip) tooltip.textContent = "Hover over the court lines to see what they are!";
        });
    });

    // =========================
    // 9. Simple Quiz
    // =========================
    const quizData = [
        {
            q: "1. What is the score '40-40' called?",
            options: ["Tie-break", "Match Point", "Deuce", "Love-all"],
            a: 2 // Index of correct
        },
        {
            q: "2. If you serve the ball and it hits the net but lands in the correct box, what happens?",
            options: ["You lose the point", "You redo the serve (Let)", "You win the point", "It is a fault"],
            a: 1
        },
        {
            q: "3. How many bounces are allowed before you must hit the ball?",
            options: ["One", "Two", "Three", "Zero (must volley)"],
            a: 0
        }
    ];

    const quizBox = document.getElementById("quizBox");
    
    if (quizBox) {
        let currentQ = 0;
        
        function renderQuestion() {
            if (currentQ >= quizData.length) {
                quizBox.innerHTML = `
                    <div class="text-center py-4">
                        <h4><i class="fa-solid fa-medal text-warning"></i> Quiz Complete!</h4>
                        <p>You are ready to hit the courts.</p>
                        <button class="btn btn-primary-custom" onclick="location.reload()">Restart Page</button>
                    </div>`;
                return;
            }

            const data = quizData[currentQ];
            quizBox.innerHTML = `
                <h6 class="mb-3">${data.q}</h6>
                <div class="d-flex flex-column gap-2">
                    ${data.options.map((opt, i) => `
                        <button class="quiz-option" onclick="checkAnswer(${i})">${opt}</button>
                    `).join('')}
                </div>
                <div id="qFeedback" class="quiz-feedback text-center"></div>
            `;
        }

        window.checkAnswer = function(selectedIndex) {
            const data = quizData[currentQ];
            const feedback = document.getElementById("qFeedback");
            const btns = document.querySelectorAll(".quiz-option");

            // Lock buttons
            btns.forEach(b => b.disabled = true);

            if (selectedIndex === data.a) {
                btns[selectedIndex].classList.add("correct");
                feedback.innerHTML = `<span class="text-success">Correct!</span> Next question coming...`;
                setTimeout(() => {
                    currentQ++;
                    renderQuestion();
                }, 1500);
            } else {
                btns[selectedIndex].classList.add("incorrect");
                btns[data.a].classList.add("correct"); // show right one
                feedback.innerHTML = `<span class="text-danger">Oops!</span> Moving on...`;
                setTimeout(() => {
                    currentQ++;
                    renderQuestion();
                }, 2000);
            }
        };

        renderQuestion();
    }
  });