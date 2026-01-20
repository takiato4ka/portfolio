// активная секция
const links = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("section");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach(sec => {
    const top = window.scrollY;
    const offset = sec.offsetTop - 150;
    if (top >= offset) current = sec.id;
  });

  links.forEach(a => {
    a.classList.remove("active");
    if (a.getAttribute("href") === "#" + current) {
      a.classList.add("active");
    }
  });
});

// форма
document.getElementById("contactForm").addEventListener("submit", e => {
  e.preventDefault();
  alert("Сообщение отправлено!");
});

// === ЗАДАНИЕ 1: КЛИКЕР ===
let score = 0;
let timeLeft = 30;
let timerId = null;
const highScore = localStorage.getItem('clickerHighScore') || 0;

document.getElementById('high-score').textContent = highScore;

const clickBtn = document.getElementById('click-btn');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');

clickBtn.addEventListener('click', () => {
    if (timeLeft > 0) {
        if (!timerId) startTimer();
        score++;
        scoreDisplay.textContent = score;
        // Эффект изменения цвета
        clickBtn.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 50%)`;
    }
});

function startTimer() {
    timerId = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerId);
            clickBtn.disabled = true;
            alert(`Игра окончена! Ваши очки: ${score}`);
            if (score > highScore) {
                localStorage.setItem('clickerHighScore', score);
                document.getElementById('high-score').textContent = score;
            }
        }
    }, 1000);
}

document.getElementById('reset-clicker').addEventListener('click', () => {
    location.reload(); // Простой способ сбросить всё состояние
});

// === ЗАДАНИЕ 2: ГЕНЕРАТОР ПРИКЛЮЧЕНИЙ ===
const heroes = ["Рыцарь", "Маг", "Вор", "Пират", "Киберпанк"];
const locations = ["тёмном лесу", "заброшенном замке", "подводном царстве", "на Марсе"];
const villains = ["драконом", "колдуном", "гоблином", "роботом-убийцей"];

document.getElementById('gen-btn').addEventListener('click', () => {
    const h = heroes[Math.floor(Math.random() * heroes.length)];
    const l = locations[Math.floor(Math.random() * locations.length)];
    const v = villains[Math.floor(Math.random() * villains.length)];
    
    const story = `Ваш персонаж — ${h} находится в ${l} и сражается с ${v}.`;
    document.getElementById('adventure-text').textContent = story;
    
    // Сохранение в историю (localStorage)
    let history = JSON.parse(localStorage.getItem('adventureHistory') || "[]");
    history.push(story);
    localStorage.setItem('adventureHistory', JSON.stringify(history.slice(-3))); // храним последние 3
});

// === ЗАДАНИЕ 3: УГАДАЙ ЧИСЛО ===
let targetNumber = Math.floor(Math.random() * 100) + 1;
let attempts = 10;

const guessBtn = document.getElementById('guess-btn');
const guessInput = document.getElementById('guess-input');
const guessMsg = document.getElementById('guess-message');
const attemptsDisplay = document.getElementById('attempts-left');

guessBtn.addEventListener('click', () => {
    const userGuess = parseInt(guessInput.value);
    
    if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
        guessMsg.textContent = "Введите число от 1 до 100!";
        return;
    }

    attempts--;
    attemptsDisplay.textContent = attempts;

    if (userGuess === targetNumber) {
        guessMsg.textContent = "🎉 ПОБЕДА! Вы угадали!";
        endGuessGame();
    } else if (attempts <= 0) {
        guessMsg.textContent = `Игра окончена. Было загадано: ${targetNumber}`;
        endGuessGame();
    } else {
        guessMsg.textContent = userGuess > targetNumber ? "Меньше!" : "Больше!";
    }
    guessInput.value = "";
});

function endGuessGame() {
    guessBtn.style.display = "none";
    document.getElementById('restart-guess').style.display = "inline-block";
}

document.getElementById('restart-guess').addEventListener('click', () => {
    location.reload();
});