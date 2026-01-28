document.addEventListener('DOMContentLoaded', () => {
    // 1. МЕНЮ
    const gamesBtn = document.getElementById('gamesBtn');
    const gamesMenu = document.getElementById('gamesMenu');
    gamesBtn.onclick = (e) => { e.stopPropagation(); gamesMenu.classList.toggle('active'); };
    window.onclick = () => gamesMenu.classList.remove('active');

    // 2. КЛИКЕР
    let score = 0;
    let clickLeft = 30;
    let clickInt;
    const hs = localStorage.getItem('cScore') || 0;
    document.getElementById('high-score').textContent = hs;

    document.getElementById('click-btn').onclick = () => {
        if(clickLeft <= 0) return;
        if(!clickInt) {
            clickInt = setInterval(() => {
                clickLeft--;
                document.getElementById('timer-val').textContent = clickLeft;
                if(clickLeft <= 0) { clearInterval(clickInt); alert("Время вышло! Счет: " + score); if(score > hs) localStorage.setItem('cScore', score); }
            }, 1000);
        }
        score++;
        document.getElementById('score').textContent = score;
    };
    document.getElementById('reset-clicker').onclick = () => location.reload();

    // 3. РЕАКЦИЯ
    let rHits = 0, rTime = 0, rStart, rLeft = 30, rInterval;
    const rTarget = document.getElementById('react-target');
    document.getElementById('start-react').onclick = function() {
        this.disabled = true; rHits = 0; rTime = 0; rLeft = 30;
        rInterval = setInterval(() => {
            rLeft--;
            if(rLeft <= 0) { clearInterval(rInterval); rTarget.style.display='none'; alert("Конец игры!"); this.disabled = false; }
        }, 1000);
        spawn();
    };
    function spawn() {
        const area = document.getElementById('react-area');
        rTarget.style.left = Math.random()*(area.clientWidth-60)+'px';
        rTarget.style.top = Math.random()*(area.clientHeight-40)+'px';
        rTarget.style.display='block'; rStart = Date.now();
    }
    rTarget.onclick = () => {
        rTime += (Date.now()-rStart); rHits++;
        document.getElementById('react-score').textContent = rHits;
        document.getElementById('react-avg').textContent = Math.round(rTime/rHits);
        rTarget.style.display='none'; setTimeout(spawn, Math.random()*2000+500);
    };

    // 4. КРЕСТИКИ
    let tBoard = ["","","","","","","","",""], tCur = "X", tActive = true;
    document.querySelectorAll('.cell').forEach(c => c.onclick = function() {
        const i = this.dataset.index;
        if(tBoard[i] || !tActive) return;
        tBoard[i] = tCur; this.textContent = tCur;
        if(checkWin()) { alert(tCur + " ПОБЕДИЛ!"); tActive = false; }
        else tCur = tCur === "X" ? "O" : "X";
        document.getElementById('ttt-status').textContent = "Ход: " + tCur;
    });
    function checkWin() {
        const w = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
        return w.some(s => tBoard[s[0]] && tBoard[s[0]] === tBoard[s[1]] && tBoard[s[0]] === tBoard[s[2]]);
    }
    document.getElementById('reset-ttt').onclick = () => location.reload();

    // 5. ЛАБИРИНТ
    const maze = [
        0,1,0,0,0,0,0,0,0,0,
        0,1,0,1,1,1,1,1,1,0,
        0,1,0,0,0,0,0,0,1,0,
        0,1,1,1,1,1,1,0,1,0,
        0,0,0,0,0,0,1,0,1,0,
        1,1,1,1,1,0,1,0,1,0,
        0,0,0,0,1,0,1,0,0,0,
        0,1,1,0,1,0,1,1,1,0,
        0,0,1,0,0,0,0,0,1,0,
        1,0,0,0,1,1,1,0,0,2
    ];
    let p = 0, mTime = 0, mInt;
    const mC = document.getElementById('maze-container');
    function draw() {
        mC.innerHTML = '';
        maze.forEach((t, i) => {
            const div = document.createElement('div');
            div.className = 'maze-cell' + (t===1?' maze-wall':t===2?' maze-exit':'');
            if(i === p) div.classList.add('maze-player');
            mC.appendChild(div);
        });
    }
    window.onkeydown = (e) => {
        let n = p;
        if(e.key === "ArrowUp") n -= 10;
        if(e.key === "ArrowDown") n += 10;
        if(e.key === "ArrowLeft") n -= 1;
        if(e.key === "ArrowRight") n += 1;
        if(n >= 0 && n < 100 && maze[n] !== 1) {
            if(!mInt) mInt = setInterval(() => { mTime++; document.getElementById('maze-timer').textContent = mTime; }, 1000);
            p = n; draw();
            if(maze[p] === 2) { clearInterval(mInt); alert("Вы вышли!"); location.reload(); }
        }
    };
    draw();

    // 6. ПРИКЛЮЧЕНИЯ И ЧИСЛО
    document.getElementById('gen-btn').onclick = () => {
        const h = ["Рыцарь", "Маг", "Вор"][Math.floor(Math.random()*3)];
        const l = ["лес", "замок", "пещеру"][Math.floor(Math.random()*3)];
        document.getElementById('adventure-text').textContent = `${h} отправился в ${l}.`;
    };
    let target = Math.floor(Math.random()*100)+1;
    document.getElementById('guess-btn').onclick = () => {
        const v = document.getElementById('guess-input').value;
        document.getElementById('guess-message').textContent = v == target ? "Угадал!" : v > target ? "Меньше" : "Больше";
    };
});
