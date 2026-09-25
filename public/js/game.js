const closeModalButton = document.querySelector(".close");
const modal = document.getElementById("modal");
const modalMessage = document.getElementById("modal-message");
const confirmButton = document.getElementById("confirm");
const cancelButton = document.getElementById("cancel");

const imgsMascotte = [
    "./img/mascote/mascottes-01.png",
    "./img/mascote/mascottes-02.png",
    "./img/mascote/mascottes-03.png",
    "./img/mascote/mascottes-04.png",
    "./img/mascote/mascottes-05.png",
    "./img/mascote/mascottes-01.png",
    "./img/mascote/mascottes-02.png",
    "./img/mascote/mascottes-03.png",
    "./img/mascote/mascottes-04.png",
    "./img/mascote/mascottes-05.png"
];

let selectedPair = null; 
let players = [];


document.getElementById('playerForm').addEventListener('submit', function (e) {
    e.preventDefault();

    players = [];
    const inputs = document.querySelectorAll('#playerForm input[type="text"]');
    inputs.forEach(input => {
        players.push(input.value);
    });

    if (players.length < 4) {
        alert('Minimum 4 players required!');
        return;
    }
    setRole(); 
    displayPlayers(); 
    console.log(players)
    startGame();
});

function addPlayer() {
    const form = document.getElementById('playerForm');
    const inputContainer = form.querySelector('.input');

    const playerCount = inputContainer.querySelectorAll('input').length;

    if (playerCount < 10) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Player ${playerCount + 1}`;
        input.required = true;

        inputContainer.appendChild(input);
    } else {
        alert('Max 10 players allowed!');
    }
}





function setRole() {
    const playerCount = players.length;
    let roles = [];

    if (playerCount >= 4 && playerCount <= 6) {
        roles.push('Anomaly'); 
    } else if (playerCount >= 7 && playerCount <= 10) {
        roles.push('Anomaly', 'Glitch', 'Glitch');
    } 

    while (roles.length < playerCount) {
        roles.push('Employee');
    }

    roles = roles.sort(() => Math.random() - 0.5);

    let availableImages = [...imgsMascotte];

    players = players.map((playerName, index) => {
        const role = roles[index];

        const randomIndex = Math.floor(Math.random() * availableImages.length);
        const image = availableImages.splice(randomIndex, 1)[0]; 

        return { name: playerName, role: role, etat: 'inGame', image: image };
    });

    mixPlayers(); 
}

function mixPlayers() {
    for (let i = players.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [players[i], players[j]] = [players[j], players[i]];
    }
}


function displayPlayers() {
    const setupDiv = document.getElementById('setup');
    const gameDiv = document.getElementById('game');

    setupDiv.style.display = 'none';

    gameDiv.innerHTML = '<h2>Players</h2><ul>';
    players.forEach(player => {
        gameDiv.innerHTML += `<li>${player.name} - ${player.role}</li>`;
    });
    gameDiv.innerHTML += '</ul>';
}

async function startGame() {
    try {
        const response = await fetch(`${API_URL}/words/random`);
        selectedPair = await response.json();
    } catch (error) {
        alert("Impossible de contacter l'API, vérifiez que le back est lancé.");
        return;
    }
    showPlayerWord();

}


function showPlayerWord() {
    const gameDiv = document.getElementById('game');
    let currentIndex = 0; 

    function displayCurrentPlayer() {
        if (currentIndex < players.length) {
            const player = players[currentIndex];
            let index =0;
            const wordGlich = selectedPair.pair.split(' / ')[1]; 
            const definitionGlich = selectedPair.definitions[1]; 
            const wordEmployee = selectedPair.pair.split(' / ')[0]; 
            const definitionEmployee = selectedPair.definitions[0]; 

            if (player.role === 'Glitch') {
                word = `Your word is:&nbsp; <span style="color: var(--orange);"> ${wordGlich}</span>`; 
                definition = `Definition : ${definitionGlich}`; 
            } else if (player.role === 'Anomaly') {
                word = 'You are an anomaly, you&nbsp;<span style="color: var(--orange);"> dont have word</span>';
                definition = null;
            } else {
                word = `Your word is:&nbsp; <span style="color: var(--orange);"> ${wordEmployee}</span>`; 
                definition = `Definition : ${definitionEmployee}`; 
            }

                const gameDiv = document.getElementById('game');
            gameDiv.innerHTML = `
            <div id="setup">
                <div id="playerTurn">
                    <h1><b>${player.name}</b>'s Turn</h1>
                    <p style="margin-top: -55px;">(click on the button to display your word,<br> CAUTION your word must remain secret)</p>
                    <button id="showWord" class="gameBtn">SHOW WORD</button>
                    <div class="wordGroup"> 
                        <h3 id="wordDisplay"></h3>
                        <h3 id="definitionDisplay"></h3>
                    </div>
                    <button id="nextPlayer" class="gameBtn" style="display:none;">Next Player</button>
                </div
            </div>
            `;

                document.getElementById('showWord').addEventListener('click', () => {
                    document.getElementById('wordDisplay').innerHTML = word;
                    
                    if (definition) { 
                        document.getElementById('definitionDisplay').innerText = `${definition}`;
                        document.getElementById('definitionDisplay').style.display = 'block';
                    } else {
                        document.getElementById('definitionDisplay').style.display = 'none';
                    }
        
                    document.getElementById('showWord').style.display = 'none'; 
                    document.getElementById('nextPlayer').style.display = 'block';
            });

            document.getElementById('nextPlayer').addEventListener('click', () => {
                currentIndex++;
                displayCurrentPlayer(); 
            });
        } else {
            const firstPlayer = players[0];
            gameDiv.innerHTML = `
                <div id="setup">
                    <div id="orderPlayer"> 
                        <h1>Order of rounds</h1>
                        <p style="margin-top: -55px;">(Here is the order of players for the game)</p>
                        <div id="playerOrder" style="display: flex; flex-wrap: wrap; gap: 20px; justify-content: center;"></div>
                        <button id="startGameButton" class="gameBtn">START THE GAME</button>
                    </div>
                </div>
            `;

            const playerOrder = document.getElementById('playerOrder');
            players.forEach((player, index) => {
                const ordinal = getOrdinal(index + 1); 
                const randomImage = imgsMascotte[Math.floor(Math.random() * imgsMascotte.length)];
                const div = document.createElement('div');
                div.className = 'card-player';
                div.innerHTML = `
                    <div class="turn">
                        <p style="color: var(--blue); font-size: large;">${ordinal}</p>
                    </div>
                    <div class="img">
                        <img src="${player.image}" alt="Mascot">
                    </div>
                    <h2>${player.name}</h2>
                `;
                playerOrder.appendChild(div);
            });


            document.getElementById('startGameButton').addEventListener('click', () => {
                currentIndex = 0; 
                selectPlayerToKill();
            });
        }
    }

    displayCurrentPlayer();
}

function getOrdinal(number) {
    if (number === 1) return '1er';
    else if (number === 2) return '2nd';
    else if (number === 3) return '3rd';
    return `${number}th`;
}

function selectPlayerToKill() {
    const gameDiv = document.getElementById('game');
    
    gameDiv.innerHTML = `
        <div id="setup">
            <div id="selectPlayerToKill">
                <h1>Select a Player to Kill</h1>
                <p style="margin-top: -55px;">Debate and kill the suspect!</p>
                <div id="playerKillList" style="display: flex; flex-wrap: wrap; gap: 20px; justify-content: center;"></div>
                <button id="killButton" class="gameBtn" disabled>Confirm Kill</button>
            </div>
        </div>
    `;
    
    const playerKillList = document.getElementById('playerKillList');
    let selectedPlayerIndex = null;

    players.forEach((player, index) => {
        if (player.etat === 'inGame') {
            const div = document.createElement('div');
            div.className = 'card-player';
            div.innerHTML = `
                <div class="turn">
                    <p style="color: var(--blue); font-size: large;">${getOrdinal(index + 1)}</p>
                </div>
                <div class="img">
                    <img src="${player.image}" alt="Mascot">
                </div>
                <h2>${player.name}</h2>
            `;

            div.addEventListener('click', () => {
                const previouslySelected = document.querySelector('.card-player.selected');
                if (previouslySelected) {
                    previouslySelected.classList.remove('selected');
                }
                div.classList.add('selected');
                selectedPlayerIndex = index;
                document.getElementById('killButton').disabled = false;
            });

            playerKillList.appendChild(div);
        }
    });

    const killButton = document.getElementById('killButton');
    killButton.addEventListener('click', () => {
        if (selectedPlayerIndex !== null) {
            eliminatePlayer(selectedPlayerIndex);
        }
    });
}


function createPlayerCard(player, ordinal, image, onClick) {
    const div = document.createElement('div');
    div.className = 'card-player';
    div.innerHTML = `
        <div class="turn">
            <p style="color: var(--blue); font-size: large;">${ordinal}</p>
        </div>
        <div class="img">
            <img src="${image}" alt="Mascot">
        </div>
        <h2>${player.name}</h2>
    `;

    if (onClick) {
        div.addEventListener('click', onClick);
    }

    return div;
}


function eliminatePlayer(index) {
    console.log(`Eliminating player at index: ${index}`);
    const eliminatedPlayer = players[index];
    eliminatedPlayer.etat = 'eliminated';
    console.log(players);

    const gameDiv = document.getElementById('game');
    gameDiv.innerHTML = `
        <div id="setup">
            <div id="playerEliminated"> 
                <h1>Player Eliminated</h1>
                <h4 style="color:var(--beige)"><span style="color: var(--orange);"><strong>${eliminatedPlayer.name}</strong></span> has been eliminated and was <span style="color: var(--orange);"><strong><strong>${eliminatedPlayer.role}</strong></span>.</h4>
                <button id="continueGame" class="gameBtn">Continue</button>
            </div
        </div>
    `;

    document.getElementById('continueGame').addEventListener('click', () => {
        checkAnomalyDeath(eliminatedPlayer);
        checkGameFinished();
    });
}


function checkGameFinished() {
    const remainingPlayers = players.filter(player => player.etat === 'inGame');
    
    const anomaly = remainingPlayers.filter(player => player.role === 'Anomaly').length;
    const glitches = remainingPlayers.filter(player => player.role === 'Glitch').length;
    const employees = remainingPlayers.filter(player => player.role === 'Employee').length;
 
    if (employees === 0) {
        winAnomalyGlich();
    } else if (anomaly === 0 && glitches === 0) {
        checkAnomalyDeath();
    } else {
        selectPlayerToKill();
    }
}

function checkAnomalyDeath(eliminatedPlayer) {
    if (eliminatedPlayer.role === 'Anomaly') {
        const gameDiv = document.getElementById('game');

        gameDiv.innerHTML = 
            `  <div id="setup">
                <div id="playerForm">  
                    <h1>The Anomaly was found!</h1>
                    <p>He can guess the Word of the employees</p>
                    <form id="anomalyForm">
                        <label for="anomalyGuess"><h4 style="margin:0px; color:var(--beige);">What was the word?</h4></label>
                        <input type="text" id="anomalyGuess" placeholder="Enter your guess" required>
                        <button class="gameBtn" type="submit">Confirm</button>
                    </form>
                </div>
            </div>
        `;

        document.getElementById('anomalyForm').addEventListener('submit', (e) => {
            e.preventDefault(); 

            const guessValue = document.getElementById('anomalyGuess').value.trim();

            if (guessValue === selectedPair.pair.split(' / ')[0]) {
                winAnomaly();
            } else {
                winEmployees(); 
            }
        });
    } else {
        checkGameFinished();
    }
}


function winAnomaly() {
    const gameDiv = document.getElementById('game');

    gameDiv.innerHTML = 
        `  
    <div id="setup">
        <div id="winAnomaly">  
            <h1 class="winTitle">FINISHED</h1>
            <h2 class="winTitle">Anomaly Win !</h2>
            <div class="winBtn">
                <button id="back" class="gameBtn">Back to the site</button>
                <button id="replay" class="gameBtn">REPLAY</button>
            </div>
        </div>
    </div>
    `;

    document.getElementById('back').addEventListener('click', () => {
        window.location.href = 'http://anomaly.alwaysdata.net/';
    });

    document.getElementById('replay').addEventListener('click', () => {
        window.location.reload();
    });
}

function winEmployees() {
    const gameDiv = document.getElementById('game');

    gameDiv.innerHTML = 
        `  
        <div id="setup">
            <div id="winAnomaly">  
                <h1 class="winTitle">FINISHED</h1>
                <h2 class="winTitle">Employees Win !</h2>
                <div class="winBtn">
                    <button id="back" class="gameBtn">Back to the site</button>
                    <button id="replay" class="gameBtn">REPLAY</button>
                </div>
            </div>
        </div>
    `;

    document.getElementById('back').addEventListener('click', () => {
        window.location.href = 'http://anomaly.alwaysdata.net/';
    });

    document.getElementById('replay').addEventListener('click', () => {
        window.location.reload();
    });
}

function winAnomalyGlich() {
    const gameDiv = document.getElementById('game');

    gameDiv.innerHTML = 
        `
        <div id="setup">
            <div id="winAnomaly">  
                <h1 class="winTitle">FINISHED</h1>
                <h2 class="winTitle">Anomaly and Glichs Win !</h2>
                <div class="winBtn">
                    <button id="back" class="gameBtn">Back to the site</button>
                    <button id="replay" class="gameBtn">REPLAY</button>
                </div>
            </div>
        </div>
    `;

    document.getElementById('back').addEventListener('click', () => {
        window.location.href = 'http://anomaly.alwaysdata.net/';
    });

    document.getElementById('replay').addEventListener('click', () => {
        window.location.reload();
    });
}

//Animation fondu
const gameDiv = document.getElementById('game');

const observer = new MutationObserver(() => {
    const setupDiv = gameDiv.querySelector('#setup');

    if (setupDiv && !setupDiv.classList.contains('fade-in')) {
        setupDiv.classList.add('fade-in');

        requestAnimationFrame(() => {
            setupDiv.classList.add('show');
        });
    }
});

observer.observe(gameDiv, { childList: true, subtree: true });

const initialSetup = gameDiv.querySelector('#setup');
if (initialSetup && !initialSetup.classList.contains('fade-in')) {
    initialSetup.classList.add('fade-in');
    requestAnimationFrame(() => {
        initialSetup.classList.add('show');
    });
}



