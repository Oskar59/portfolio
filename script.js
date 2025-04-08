document.addEventListener('DOMContentLoaded', () => {
    // Créer l'effet "Matrix" en arrière-plan avec debouncing pour de meilleures performances
    const matrixEffect = debounce(createMatrixEffect, 100);
    matrixEffect();
    
    // Ajouter des événements pour les boutons
    setupButtonEvents();
    
    // Ajouter le détecteur de code Konami pour le terminal secret
    setupKonamiCode();

    // Gestion du thème
    const themeToggle = document.getElementById('theme-toggle');
    const icon = themeToggle.querySelector('i');

    // Vérifier si un thème est déjà sauvegardé
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateIcon(savedTheme);
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateIcon(newTheme);
    });

    function updateIcon(theme) {
        icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
});

/**
 * Fonction pour limiter l'exécution d'une fonction (debounce)
 * @param {Function} func - La fonction à exécuter
 * @param {number} wait - Le temps d'attente en millisecondes
 * @returns {Function} - La fonction avec debounce
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Crée l'effet d'arrière-plan "Matrix"
 */
function createMatrixEffect() {
    // Vérifier si l'élément existe déjà pour éviter les doublons
    if (document.querySelector('.matrix-bg')) return;
    
    // Créer l'élément div pour l'arrière-plan
    const matrixBg = document.createElement('div');
    matrixBg.className = 'matrix-bg';
    document.body.insertBefore(matrixBg, document.body.firstChild);
    
    // Caractères utilisés pour l'effet matrix
    const chars = '01あいうえおかきくけこさしすせそたちつてとなにぬねの';
    
    // Nombre de caractères à afficher (optimisé selon la taille de l'écran)
    const numChars = Math.min(50, Math.floor(window.innerWidth / 20));
    
    // Fragment de document pour améliorer les performances
    const fragment = document.createDocumentFragment();
    
    // Créer les caractères qui tombent
    for (let i = 0; i < numChars; i++) {
        const fallingChar = document.createElement('div');
        fallingChar.className = 'falling-character';
        fallingChar.style.left = `${Math.random() * 100}%`;
        fallingChar.style.animationDuration = `${Math.random() * 10 + 5}s`;
        fallingChar.style.animationDelay = `${Math.random() * 5}s`;
        fallingChar.textContent = chars.charAt(Math.floor(Math.random() * chars.length));
        
        // Ajouter au fragment
        fragment.appendChild(fallingChar);
    }
    
    // Ajouter le fragment au DOM (opération unique pour de meilleures performances)
    matrixBg.appendChild(fragment);
    
    // Utiliser requestAnimationFrame pour de meilleures performances
    let lastTime = 0;
    const charElements = matrixBg.querySelectorAll('.falling-character');
    
    function updateChars(timestamp) {
        // Limiter à 1 mise à jour par seconde
        if (timestamp - lastTime > 1000) {
            lastTime = timestamp;
            
            charElements.forEach(element => {
                // 20% de chance de changer le caractère
                if (Math.random() < 0.2) {
                    element.textContent = chars.charAt(Math.floor(Math.random() * chars.length));
                }
            });
        }
        
        requestAnimationFrame(updateChars);
    }
    
    requestAnimationFrame(updateChars);
}

/**
 * Configure les événements des boutons
 */
function setupButtonEvents() {
    const buttons = document.querySelectorAll('.button');
    
    buttons.forEach(button => {
        // Ajouter une animation de clic
        button.addEventListener('click', function(e) {
            // Temporairement empêcher la navigation
            e.preventDefault();
            
            // Stocker this dans une constante pour éviter des problèmes de contexte
            const btn = this;
            
            // Ajouter un effet de pulsation
            btn.classList.add('pulse');
            
            // Récupérer l'URL cible
            const targetUrl = btn.getAttribute('href');
            
            // Naviguer vers la page après un court délai pour permettre à l'animation de se produire
            setTimeout(() => {
                btn.classList.remove('pulse');
                window.location.href = targetUrl;
            }, 300);
        });
        
        // Amélioration de l'accessibilité pour la navigation au clavier
        button.addEventListener('keydown', function(e) {
            // Si la touche Entrée est pressée
            if (e.key === 'Enter' || e.keyCode === 13) {
                // Simuler un clic
                this.click();
            }
        });
    });
}

/**
 * Configure le code Konami pour activer le mode terminal secret
 * Séquence: ↑ ↑ ↓ ↓ ← → ← → B A
 */
function setupKonamiCode() {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    
    document.addEventListener('keydown', function(e) {
        // Obtenir la touche appropriée
        const key = e.key;
        const requiredKey = konamiCode[konamiIndex];
        
        // Vérifier si la touche est correcte
        if (key.toLowerCase() === requiredKey.toLowerCase()) {
            konamiIndex++;
            
            // Si le code complet est entré, activer le terminal secret
            if (konamiIndex === konamiCode.length) {
                activateSecretTerminal();
                konamiIndex = 0;
            }
        } else {
            // Réinitialiser la séquence si la mauvaise touche est pressée
            konamiIndex = 0;
        }
    });
}

/**
 * Active le terminal secret avec des commandes interactives
 */
function activateSecretTerminal() {
    // Créer et ajouter l'élément du terminal au DOM
    const terminal = document.createElement('div');
    terminal.className = 'secret-terminal';
    terminal.innerHTML = `
        <div class="terminal-header">
            <div class="controls">
                <span class="control red"></span>
                <span class="control yellow"></span>
                <span class="control green"></span>
            </div>
            <div class="title">Terminal Secret</div>
            <div class="close-btn">&times;</div>
        </div>
        <div class="terminal-content">
            <div class="terminal-output">
                <p>Bienvenue dans le terminal secret !</p>
                <p>Commandes disponibles :</p>
                <ul>
                    <li><code>help</code> - Affiche l'aide</li>
                    <li><code>about</code> - Informations sur moi</li>
                    <li><code>skills</code> - Mes compétences cachées</li>
                    <li><code>projects</code> - Voir mes projets secrets</li>
                    <li><code>contact</code> - Comment me contacter</li>
                    <li><code>matrix [color]</code> - Change la couleur de la matrice</li>
                    <li><code>ascii</code> - Affiche de l'art ASCII</li>
                    <li><code>clear</code> - Efface le terminal</li>
                    <li><code>exit</code> - Ferme le terminal</li>
                </ul>
            </div>
            <div class="terminal-input-container">
                <span class="prompt">visiteur@portfolio:~$</span>
                <input type="text" class="terminal-input" autofocus>
            </div>
        </div>
    `;
    
    document.body.appendChild(terminal);
    
    // Focus sur l'input du terminal
    const input = terminal.querySelector('.terminal-input');
    input.focus();
    
    // Gérer la fermeture du terminal
    const closeBtn = terminal.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        terminal.remove();
    });
    
    // Escape pour fermer le terminal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && document.querySelector('.secret-terminal')) {
            terminal.remove();
        }
    });
    
    // Gérer les commandes du terminal
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const command = input.value.trim().toLowerCase();
            const output = terminal.querySelector('.terminal-output');
            
            // Ajouter la commande tapée à l'output
            const commandLine = document.createElement('div');
            commandLine.className = 'command-line';
            commandLine.innerHTML = `<span class="prompt">visiteur@portfolio:~$</span> <span class="entered-command">${command}</span>`;
            output.appendChild(commandLine);
            
            // Traiter les différentes commandes
            processCommand(command, output);
            
            // Effacer l'input et défiler vers le bas
            input.value = '';
            terminal.querySelector('.terminal-content').scrollTop = terminal.querySelector('.terminal-content').scrollHeight;
        }
    });
}

/**
 * Traite les commandes entrées dans le terminal secret
 * @param {string} command - La commande entrée
 * @param {HTMLElement} output - L'élément de sortie du terminal
 */
function processCommand(command, output) {
    const commandArgs = command.split(' ');
    const mainCommand = commandArgs[0];
    
    switch (mainCommand) {
        case 'help':
            appendToTerminal(output, `
                <p>Liste des commandes :</p>
                <ul>
                    <li><code>help</code> - Affiche cette aide</li>
                    <li><code>about</code> - Informations sur moi</li>
                    <li><code>skills</code> - Mes compétences cachées</li>
                    <li><code>projects</code> - Voir mes projets secrets</li>
                    <li><code>contact</code> - Comment me contacter</li>
                    <li><code>matrix [color]</code> - Change la couleur de la matrice (green, blue, red, purple)</li>
                    <li><code>ascii</code> - Affiche de l'art ASCII</li>
                    <li><code>quiz</code> - Lancer un quiz technique SISR</li>
                    <li><code>sudo apt-get skills</code> - Révèle des compétences super secrètes</li>
                    <li><code>ping passion</code> - Découvre mes passions cachées</li>
                    <li><code>clear</code> - Efface le terminal</li>
                    <li><code>exit</code> - Ferme le terminal</li>
                </ul>
            `);
            break;
            
        case 'about':
            appendToTerminal(output, `
                <div class="secret-info">
                    <p>🕵️ <strong>Information confidentielle</strong> 🕵️</p>
                    <p>Je me forme actuellement en cybersécurité et infrastructure réseau, avec une curiosité grandissante pour les technologies Linux et les solutions open-source.</p>
                    <p>Mes domaines d'apprentissage incluent l'analyse des vulnérabilités, la protection des données et l'optimisation des infrastructures.</p>
                    <p>Dans une vie future, je serai peut-être hacker éthique pour une grande agence de renseignement... mais pour l'instant, je m'entraîne sur des CTF et des labs virtuels! 😉</p>
                </div>
            `);
            break;
            
        case 'skills':
            appendToTerminal(output, `
                <div class="secret-skills">
                    <p>🔐 <strong>Compétences techniques avancées</strong> 🔐</p>
                    <ul>
                        <li>Débugger du code avec des larmes de développeur</li>
                        <li>Transformer le café en code fonctionnel</li>
                        <li>Expliquer à ma grand-mère comment installer Windows</li>
                        <li>Réparer des imprimantes par télékinésie</li>
                        <li>Retrouver des mots de passe en lisant dans les pensées</li>
                        <li>Faire croire aux clients que "ça va être rapide"</li>
                        <li>Survivre à des réunions qui auraient pu être des emails</li>
                    </ul>
                </div>
            `);
            break;
            
        case 'projects':
            appendToTerminal(output, `
                <div class="secret-projects">
                    <p>🔒 <strong>Projets confidentiels</strong> 🔒</p>
                    <ul>
                        <li><strong>CaféScript</strong> - Intelligence artificielle qui transforme le niveau de caféine dans mon sang en lignes de code fonctionnelles</li>
                        <li><strong>BugWhisperer</strong> - Dispositif qui me permet de communiquer télépathiquement avec les bugs pour leur demander de partir gentiment</li>
                        <li><strong>SocksLocator 3000</strong> - Système révolutionnaire pour retrouver les chaussettes perdues dans la machine à laver (taux de réussite: 12%)</li>
                        <li><strong>Anti-Réunion</strong> - Extension de calendrier qui simule automatiquement des problèmes de connexion lors des réunions inutiles</li>
                    </ul>
                    <p><em>Ces projets ne sont pas mentionnés dans mon portfolio public car ils sont trop avancés pour la technologie actuelle</em></p>
                </div>
            `);
            break;
            
        case 'contact':
            appendToTerminal(output, `
                <div class="secret-contact">
                    <p>📡 <strong>Canaux de communication sécurisés</strong> 📡</p>
                    <p>Pour les discussions sensibles : <a href="https://signal.org/" target="_blank">Signal</a> ou <a href="https://www.torproject.org/" target="_blank">Session</a></p>
                    <p>Clé PGP disponible sur demande pour communications chiffrées</p>
                    <p>Je suis également disponible sur les réseaux mentionnés dans ma page Contact</p>
                </div>
            `);
            break;
            
        case 'matrix':
            if (commandArgs.length > 1) {
                const color = commandArgs[1].toLowerCase();
                changeMatrixColor(color);
                appendToTerminal(output, `<p>Couleur de la matrice changée en ${color}</p>`);
            } else {
                appendToTerminal(output, `<p>Veuillez spécifier une couleur: matrix green/blue/red/purple</p>`);
            }
            break;
            
        case 'ascii':
            appendToTerminal(output, `
                <pre class="ascii-art">
 ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠁⠀⠀⠀⠀⠀⠀⢀⣀⣀⣀⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢊⢵⠿⣛⠽
⠀⠀⠈⠲⣄⠀⠀⢀⠀⠀⠀⠀⠀⠀⠀⠀⢠⠀⠀⠀⠀⠀⠀⣠⣴⣾⠛⠉⠉⠉⣩⠟⠋⠉⠛⠷⣶⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠀⠀
⠀⠀⠀⠀⠀⠙⠦⣀⠙⠦⡀⠀⠀⠀⠀⢠⠋⠀⡰⠃⠀⣠⣾⣿⣿⣁⣀⣠⢴⡾⠳⣄⡀⠀⢀⡤⠞⠛⣿⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠈⠑⠀⠀⠀⠀⠀⢀⠏⠀⣰⠁⢀⣾⣿⣿⣿⠋⠉⠁⢀⡞⠀⠀⠀⢉⡿⠻⣄⢀⠀⠘⣿⣷⡀⠀⠀⠀⠀⠀⠀⠰⠶
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⠃⠀⣾⣿⣿⣿⣿⠀⢀⣠⣾⣄⠀⠀⣠⠟⠀⠀⠙⣎⣷⣄⠙⣾⣷⡀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⡇⠀⣸⣿⣿⣿⣽⣿⡋⠉⢹⡇⠈⠉⣿⢿⣄⠀⠀⣠⣼⣿⣿⣯⠉⣿⣧⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠁⠀⡿⠉⢿⣿⣿⣿⣇⣠⣾⣄⣀⣼⠃⠀⢙⣷⣿⠿⠋⠁⠘⣿⣆⢷⣿⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡇⠀⠀⠹⣿⣿⣿⢁⣿⠀⣽⠋⢻⣾⡿⠋⠁⠀⠀⠀⠀⢻⣿⣹⣿⡇⠀⢠⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡇⠀⠀⠀⠹⣿⣿⣿⣟⣿⢷⣴⡿⠋⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⠃⠀⣸⢀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡇⠀⠀⠀⠀⠹⣿⣿⣿⣿⡿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⡿⠀⠀⡇⢸⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣇⠀⠀⠀⠀⣼⣿⣿⣿⣿⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣿⣿⣿⠃⠀⢸⠁⡏⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣄⠀⢀⣼⣿⣿⡿⢿⣿⣻⣦⠀⠀⠀⠀⠀⠀⠀⢀⣼⣿⣿⡏⠀⠀⠃⡼⠃⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣷⣿⣿⣿⣿⢷⣾⣿⣯⠻⣷⣄⡀⠀⠀⢀⣠⣾⣿⣿⡿⠀⠀⠀⠀⠀⠀⠀⠤⣄
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⣿⣿⣷⣿⣿⣧⣷⣼⣿⣿⣶⠛⠻⣿⣷⣾⣿⣿⡿⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀⠈⠑
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣿⣿⣿⣿⣿⡑⠿⠉⡏⠈⢻⣄⣠⠞⠻⢯⣅⣼⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣿⣿⣿⣿⡟⣿⣿⣷⡶⠞⠻⣇⠀⢀⣠⣿⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣿⣿⣿⣏⣉⠈⣿⠀⣀⣤⣽⣷⣾⣿⣿⣿⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⢀⣀⣤⣤⣤⣤⣤⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⣠⣿⣿⣯⣏⣙⢻⣿⣿⣯⣶⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⠀⠀
⢛⣩⣥⣿⣷⣶⣮⣽⣿⣶⣶⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡢⣙⠦
⠟⠉⠉⠀⢀⣽⣦⣶⡟⠛⠋⠙⣿⣩⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠟⢛⣿⣿⡿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠪⡓
⠤⠤⢶⡞⠉⠁⠀⠈⣹⣷⡖⠋⠉⠉⣉⣿⠿⣿⡛⣻⣿⣟⠃⠈⣿⣿⣿⡶⠶⣤⣾⣿⡟⢠⡟⣿⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈
⠀⠀⣾⡀⠀⣠⠶⠛⠉⠉⠉⣳⣴⣞⡁⠀⢰⡿⣿⣿⡄⢿⣆⡀⢨⡏⠁⠀⠀⣿⣿⡿⠓⢾⡟⠛⢿⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⣿⣷⣟⠁⠀⠀⠀⣠⠞⠉⠀⠀⠉⢳⣸⣿⣯⡿⢻⢮⣿⣿⡾⠶⠶⠤⣄⡈⢻⡛⠀⠈⢷⡀⠘⣟⢿⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⢸⡟⠉⠙⠻⣆⣠⠞⠁⠀⠀⠀⠀⢀⣼⢿⣯⡿⣿⣿⣷⡛⣿⣇⠀⠀⠀⠀⠙⢿⣷⠶⠖⠺⣷⣤⣿⣦⣹⣷⣀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⣼⠁⢀⣀⣠⡿⠿⠷⢶⣤⣀⣀⣠⡿⠁⠈⢿⣷⣏⢹⠿⣿⣯⣿⣦⣤⣤⣄⡀⠀⣿⠀⠀⠀⠈⢷⡀⠉⢿⣏⢿⣿⣾⣿⣿⣶⣶⣤⡀
                              
                </pre>
                <p>Portfolio d'un futur expert en cybersécurité 👨‍💻</p>
            `);
            break;
            
        case 'sudo':
            if (command === 'sudo apt-get skills') {
                appendToTerminal(output, `
                    <div class="super-secret">
                        <p>🔥 <strong>COMPÉTENCES SUPER SECRÈTES DÉBLOQUÉES</strong> 🔥</p>
                        <ul class="hacker-skills">
                            <li>Maîtrise de la blockchain et smart contracts <span class="skill-level">████████░░ 80%</span></li>
                            <li>Reverse engineering de malwares <span class="skill-level">███████░░░ 70%</span></li>
                            <li>CTF - Top 50 TryHackMe <span class="skill-level">█████████░ 90%</span></li>
                            <li>Développement de scripts d'automatisation post-exploitation <span class="skill-level">████████░░ 80%</span></li>
                        </ul>
                        <p class="achievement">🏆 Félicitations, vous avez trouvé une commande cachée! 🎮</p>
                        <div class="matrix-animation">
                            <pre class="matrix-code">01001000 01100001 01100011 01101011 01100101 01110010</pre>
                            <p class="glitch-text" data-text="NIVEAU HACKER: DÉBLOQUÉ">NIVEAU HACKER: DÉBLOQUÉ</p>
                        </div>
                        <p class="easter-egg">🥚 Essayez 'sudo rm -rf /' pour plus de surprises... (ou peut-être pas 😈)</p>
                    </div>
                `);
            } else {
                appendToTerminal(output, `<p class="error">Permission denied: Vous n'avez pas les privilèges suffisants</p>`);
            }
            break;
            
        case 'ping':
            if (command === 'ping passion') {
                appendToTerminal(output, `
                    <div class="ping-result">
                        <p>PING passions.secret (127.0.0.1): 56 data bytes</p>
                        <p>64 bytes from 127.0.0.1: icmp_seq=0 ttl=64 time=0.023 ms</p>
                        <p>64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.021 ms</p>
                        <p>--- passions.secret ping statistics ---</p>
                        <p>2 packets transmitted, 2 packets received, 0.0% packet loss</p>
                        <div class="passion-reveal">
                            <p>🕸️ <strong>Passions secrètes révélées</strong> 🏃‍♂️</p>
                            <ul>
                                <li>Fan inconditionnel de Spider-Man (avec le trait d'union, respect de la syntaxe!)</li>
                                <li>Coureur passionné - Semi-marathon en 1h37 (plus rapide que mon PC quand j'exécute Windows Update)</li>
                                <li>Joueur de padel redoutable (meilleur contrôle qu'avec une souris gaming)</li>
                                <li>Capable de déboguer mon code plus vite que Peter Parker ne lance ses toiles</li>
                                <li>Le seul développeur qui fait des backups de ses backups... des backups</li>
                            </ul>
                        </div>
                    </div>
                `);
            } else {
                appendToTerminal(output, `<p>ping: cannot resolve ${commandArgs[1]}: Unknown host</p>`);
            }
            break;
            
        case 'clear':
            output.innerHTML = '';
            break;
            
        case 'exit':
            document.querySelector('.secret-terminal').remove();
            break;
            
        case 'quiz':
            appendToTerminal(output, `<p>Lancement du quiz technique SISR...</p>`);
            // Vérifier si le script est chargé
            if (typeof startTechQuiz === 'function') {
                startTechQuiz();
            } else {
                // Si le script n'est pas chargé, on le charge dynamiquement
                const script = document.createElement('script');
                script.src = 'js/quiz.js';
                script.onload = function() {
                    startTechQuiz();
                };
                document.head.appendChild(script);
            }
            break;
            
        default:
            appendToTerminal(output, `<p class="error">Commande non reconnue: ${command}</p><p>Tapez 'help' pour voir la liste des commandes disponibles</p>`);
    }
}

/**
 * Ajoute du contenu HTML au terminal
 * @param {HTMLElement} output - L'élément de sortie du terminal
 * @param {string} html - Le contenu HTML à ajouter
 */
function appendToTerminal(output, html) {
    const responseElement = document.createElement('div');
    responseElement.className = 'terminal-response';
    responseElement.innerHTML = html;
    output.appendChild(responseElement);
}

/**
 * Change la couleur de l'effet matrice
 * @param {string} color - La couleur à appliquer
 */
function changeMatrixColor(color) {
    const matrixChars = document.querySelectorAll('.falling-character');
    let rgbaColor;
    
    switch (color) {
        case 'green':
            rgbaColor = 'rgba(60, 255, 151, 0.3)';
            break;
        case 'blue':
            rgbaColor = 'rgba(60, 151, 255, 0.3)';
            break;
        case 'red':
            rgbaColor = 'rgba(255, 60, 60, 0.3)';
            break;
        case 'purple':
            rgbaColor = 'rgba(151, 60, 255, 0.3)';
            break;
        default:
            rgbaColor = 'rgba(60, 255, 151, 0.3)';
    }
    
    matrixChars.forEach(char => {
        char.style.color = rgbaColor;
    });
} 