document.addEventListener('DOMContentLoaded', () => {
    // 1. МЕНЮ
    const gamesBtn = document.getElementById('gamesBtn');
    const gamesMenu = document.getElementById('gamesMenu');
    if(gamesBtn) {
        gamesBtn.onclick = (e) => { e.stopPropagation(); gamesMenu.classList.toggle('active'); };
    }
    window.onclick = () => gamesMenu.classList.remove('active');

    // 2. КЛИКЕР
    let score = 0; let clickLeft = 30; let clickInt;
    const hs = localStorage.getItem('cScore') || 0;
    if(document.getElementById('high-score')) document.getElementById('high-score').textContent = hs;
    if(document.getElementById('click-btn')) {
        document.getElementById('click-btn').onclick = () => {
            if(clickLeft <= 0) return;
            if(!clickInt) {
                clickInt = setInterval(() => {
                    clickLeft--;
                    document.getElementById('timer-val').textContent = clickLeft;
                    if(clickLeft <= 0) { clearInterval(clickInt); alert("Время вышло! Счет: " + score); if(score > hs) localStorage.setItem('cScore', score); }
                }, 1000);
            }
            score++; document.getElementById('score').textContent = score;
        };
    }
    if(document.getElementById('reset-clicker')) document.getElementById('reset-clicker').onclick = () => location.reload();

    // 3. РЕАКЦИЯ 
    let rHits = 0, rTime = 0, rStart, rLeft = 30, rInterval;
    const rTarget = document.getElementById('react-target');
    if(document.getElementById('start-react')) {
        document.getElementById('start-react').onclick = function() {
            this.disabled = true; rHits = 0; rLeft = 30;
            rInterval = setInterval(() => { rLeft--; if(rLeft <= 0) { clearInterval(rInterval); rTarget.style.display='none'; alert("Конец!"); this.disabled = false; } }, 1000);
            spawn();
        };
    }
    function spawn() {
        const area = document.getElementById('react-area');
        if(!area || !rTarget) return;
        rTarget.style.left = Math.random()*(area.clientWidth-60)+'px';
        rTarget.style.top = Math.random()*(area.clientHeight-40)+'px';
        rTarget.style.display='block'; rStart = Date.now();
    }
    if(rTarget) {
        rTarget.onclick = () => { rTime += (Date.now()-rStart); rHits++; document.getElementById('react-score').textContent = rHits; document.getElementById('react-avg').textContent = Math.round(rTime/rHits); rTarget.style.display='none'; setTimeout(spawn, 1000); };
    }

    // 4. КРЕСТИКИ
    let tBoard = ["","","","","","","","",""], tCur = "X", tActive = true;
    document.querySelectorAll('.cell').forEach(c => c.onclick = function() {
        const i = this.dataset.index; if(tBoard[i] || !tActive) return;
        tBoard[i] = tCur; this.textContent = tCur;
        if(checkWin()) { alert(tCur + " ПОБЕДИЛ!"); tActive = false; }
        else { tCur = tCur === "X" ? "O" : "X"; document.getElementById('ttt-status').textContent = "Ход: " + tCur; }
    });
    function checkWin() {
        const w = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
        return w.some(s => tBoard[s[0]] && tBoard[s[0]] === tBoard[s[1]] && tBoard[s[0]] === tBoard[s[2]]);
    }
    if(document.getElementById('reset-ttt')) document.getElementById('reset-ttt').onclick = () => location.reload();

    // 5. ЛАБИРИНТ
    const maze = [0,1,0,0,0,0,0,0,0,0, 0,1,0,1,1,1,1,1,1,0, 0,1,0,0,0,0,0,0,1,0, 0,1,1,1,1,1,1,0,1,0, 0,0,0,0,0,0,1,0,1,0, 1,1,1,1,1,0,1,0,1,0, 0,0,0,0,1,0,1,0,0,0, 0,1,1,0,1,0,1,1,1,0, 0,0,1,0,0,0,0,0,1,0, 1,0,0,0,1,1,1,0,0,2];
    let p = 0, mInt, mTime = 0;
    function draw() {
        const mC = document.getElementById('maze-container'); if(!mC) return;
        mC.innerHTML = '';
        maze.forEach((t, i) => {
            const d = document.createElement('div'); d.className = 'maze-cell' + (t===1?' maze-wall':t===2?' maze-exit':'');
            if(i === p) d.classList.add('maze-player'); mC.appendChild(d);
        });
    }
    window.addEventListener('keydown', (e) => {
        let n = p;
        if(e.key === "ArrowUp") n -= 10; if(e.key === "ArrowDown") n += 10;
        if(e.key === "ArrowLeft") n -= 1; if(e.key === "ArrowRight") n += 1;
        if(n >= 0 && n < 100 && maze[n] !== 1) {
            if(!mInt) mInt = setInterval(() => { mTime++; if(document.getElementById('maze-timer')) document.getElementById('maze-timer').textContent = mTime; }, 1000);
            p = n; draw(); if(maze[p] === 2) { clearInterval(mInt); alert("Вышли!"); location.reload(); }
        }
    });
    draw();

    // 6. ПРИКЛЮЧЕНИЯ
    if(document.getElementById('gen-btn')) {
        document.getElementById('gen-btn').onclick = () => {
            const h = ["Рыцарь", "Маг", "Вор"][Math.floor(Math.random()*3)];
            const l = ["лес", "замок", "пещеру"][Math.floor(Math.random()*3)];
            document.getElementById('adventure-text').textContent = `${h} пошел в ${l}.`;
        };
    }
    let target = Math.floor(Math.random()*100)+1;
    if(document.getElementById('guess-btn')) {
        document.getElementById('guess-btn').onclick = () => {
            const v = document.getElementById('guess-input').value;
            document.getElementById('guess-message').textContent = v == target ? "Угадал!" : v > target ? "Меньше" : "Больше";
        };
    }

    // --- ЛОГИКА RPG ---
    let rpg = JSON.parse(localStorage.getItem('rpg_v3')) || { lvl: 1, xp: 0, habits: [], dailies: [], quests: [] };

    const save = () => localStorage.setItem('rpg_v3', JSON.stringify(rpg));

    const updateUI = () => {
        const need = rpg.lvl * 100;
        document.getElementById('rpg-lvl').textContent = rpg.lvl;
        document.getElementById('rpg-xp-cur').textContent = rpg.xp;
        document.getElementById('rpg-xp-need').textContent = need;
        document.getElementById('rpg-xp-fill').style.width = (rpg.xp / need * 100) + "%";

        renderItems('rpg-habits-list', rpg.habits, 'habit');
        renderItems('rpg-dailies-list', rpg.dailies, 'daily');
        renderItems('rpg-quests-list', rpg.quests, 'quest');
        save();
    };

    function renderItems(id, list, type) {
        const cont = document.getElementById(id); if(!cont) return;
        cont.innerHTML = '';
        list.forEach((t, i) => {
            const div = document.createElement('div');
            div.style = "background:white; color:black; padding:10px; border:3px solid black; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center; box-shadow:4px 4px 0 black;";
            
            let btns = '';
            if(type === 'habit') {
                btns = `<div>
                    <button onclick="modifyXP(${t.xp})" style="background:var(--yellow); border:2px solid black; cursor:pointer;"><b>+</b></button>
                    <button onclick="modifyXP(-${t.xp})" style="background:var(--red); border:2px solid black; cursor:pointer;"><b>-</b></button>
                    <button onclick="removeItem('${type}', ${i})" style="background:black; color:white; border:2px solid black; cursor:pointer;">✖</button>
                </div>`;
            } else {
                btns = `<div>
                    ${!t.done ? `<button onclick="finishItem('${type}', ${i})" style="background:var(--yellow); border:2px solid black; cursor:pointer;">✔</button>` : ''}
                    <button onclick="removeItem('${type}', ${i})" style="background:black; color:white; border:2px solid black; cursor:pointer;">✖</button>
                </div>`;
            }

            div.innerHTML = `<div><span style="display:block; font-weight:800;">${t.text}</span><small>${t.xp} XP</small></div>${btns}`;
            if(t.done) div.style.opacity = "0.5";
            cont.appendChild(div);
        });
    }

    window.modifyXP = (amt) => {
        rpg.xp += amt;
        if(rpg.xp < 0) rpg.xp = 0;
        while(rpg.xp >= rpg.lvl * 100) {
            rpg.xp -= rpg.lvl * 100;
            rpg.lvl++;
            alert("НОВЫЙ УРОВЕНЬ: " + rpg.lvl);
        }
        updateUI();
    };

    window.finishItem = (type, i) => {
        let list = type === 'daily' ? rpg.dailies : rpg.quests;
        if(list[i].done) return;
        list[i].done = true;
        modifyXP(list[i].xp);
    };

    window.removeItem = (type, i) => {
        if(type === 'habit') rpg.habits.splice(i, 1);
        else if(type === 'daily') rpg.dailies.splice(i, 1);
        else rpg.quests.splice(i, 1);
        updateUI();
    };

    const addBtn = document.getElementById('rpg-add-btn');
    if(addBtn) {
        addBtn.onclick = () => {
            const text = document.getElementById('rpg-task-in').value;
            const type = document.getElementById('rpg-type-in').value;
            const xp = parseInt(document.getElementById('rpg-diff-in').value);
            if(!text) return;

            const item = { text, xp, done: false };
            if(type === 'habit') rpg.habits.push(item);
            else if(type === 'daily') rpg.dailies.push(item);
            else if(type === 'quest') rpg.quests.push(item);

            document.getElementById('rpg-task-in').value = '';
            updateUI();
        };
    }

    const resetBtn = document.getElementById('rpg-reset-btn');
    if(resetBtn) {
        resetBtn.onclick = () => {
            if(confirm("Сбросить всё?")) {
                rpg = { lvl: 1, xp: 0, habits: [], dailies: [], quests: [] };
                updateUI();
            }
        };
    }

    updateUI();
});
