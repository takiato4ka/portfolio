document.addEventListener('DOMContentLoaded', () => {
    // 1. ВЫПАДАЮЩЕЕ МЕНЮ
    const gamesBtn = document.getElementById('gamesBtn');
    const gamesMenu = document.getElementById('gamesMenu');

    gamesBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        gamesMenu.classList.toggle('active');
    });

    window.addEventListener('click', () => {
        gamesMenu.classList.remove('active');
    });

    // 2. ПОДСВЕТКА НАВИГАЦИИ
    const links = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("section");

    window.addEventListener("scroll", () => {
        let current = "";
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 150) current = sec.id;
        });
        links.forEach(a => {
            a.classList.remove("active");
            if (a.getAttribute("href") === "#" + current) a.classList.add("active");
        });
    });

    // 3. ЗАДАНИЕ 1: КЛИКЕР
    let score = 0;
    let timeLeft = 30;
    let timerId = null;
    const highScore = localStorage.getItem('clickerRecord') || 0;
    document.getElementById('high-score').textContent = highScore;

    const clickBtn = document.getElementById('click-btn');
    clickBtn.addEventListener('click', () => {
        if (timeLeft > 0) {
            if (!timerId) startTimer();
            score++;
            document.getElementById('score').textContent = score;
            clickBtn.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 50%)`;
        }
    });

    function startTimer() {
        timerId = setInterval(() => {
            timeLeft--;
            document.getElementById('timer').textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timerId);
                clickBtn.disabled = true;
                alert(`Игра окончена! Очки: ${score}`);
                if (score > highScore) {
                    localStorage.setItem('clickerRecord', score);
                    document.getElementById('high-score').textContent = score;
                }
            }
        }, 1000);
    }

    document.getElementById('reset-clicker').onclick = () => location.reload();

    // 4. ЗАДАНИЕ 2: ГЕНЕРАТОР ПРИКЛЮЧЕНИЙ
    const heroes = ["Рыцарь", "Маг", "Вор", "Пират"];
    const locations = ["тёмном лесу", "замке", "подземелье"];
    const villains = ["драконом", "гоблином", "магом"];

    document.getElementById('gen-btn').onclick = () => {
        const h = heroes[Math.floor(Math.random()*heroes.length)];
        const l = locations[Math.floor(Math.random()*locations.length)];
        const v = villains[Math.floor(Math.random()*villains.length)];
        const story = `Ваш персонаж — ${h} находится в ${l} и сражается с ${v}.`;
        document.getElementById('adventure-text').textContent = story;
        localStorage.setItem('lastStory', story);
    };

    // 5. ЗАДАНИЕ 3: УГАДАЙ ЧИСЛО
    let target = Math.floor(Math.random() * 100) + 1;
    let attempts = 10;
    const guessBtn = document.getElementById('guess-btn');

    guessBtn.onclick = () => {
        const input = document.getElementById('guess-input');
        const val = parseInt(input.value);
        if (isNaN(val)) return;

        attempts--;
        document.getElementById('attempts-left').textContent = attempts;

        const msg = document.getElementById('guess-message');
        if (val === target) {
            msg.textContent = "🎉 УГАДАЛ!";
            guessBtn.style.display = "none";
            document.getElementById('restart-guess').style.display = "block";
        } else if (attempts <= 0) {
            msg.textContent = `Провал! Число: ${target}`;
            guessBtn.style.display = "none";
            document.getElementById('restart-guess').style.display = "block";
        } else {
            msg.textContent = val > target ? "Меньше!" : "Больше!";
        }
        input.value = "";
    };

    document.getElementById('restart-guess').onclick = () => location.reload();
});
