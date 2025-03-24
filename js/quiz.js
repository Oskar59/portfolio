/**
 * Quiz Technique SISR
 * Module qui permet d'intégrer un quiz technique sur les connaissances SISR
 * Accessible via une commande secrète dans le terminal ou via un bouton caché
 */

// Définition des questions du quiz
const quizQuestions = [
    {
        question: "Quelle commande permet d'afficher la table de routage sous Linux ?",
        options: ["route", "netstat -r", "ip route", "Toutes les réponses ci-dessus"],
        correctAnswer: 3,
        explanation: "Sous Linux, les commandes 'route', 'netstat -r' et 'ip route' permettent toutes d'afficher la table de routage, avec des formats légèrement différents."
    },
    {
        question: "Quel protocole est utilisé pour la résolution d'adresses IP en adresses MAC ?",
        options: ["DNS", "ARP", "DHCP", "SMTP"],
        correctAnswer: 1,
        explanation: "ARP (Address Resolution Protocol) est utilisé pour résoudre une adresse IP en adresse MAC correspondante sur un réseau local."
    },
    {
        question: "Quel port est traditionnellement utilisé par le protocole HTTPS ?",
        options: ["21", "22", "80", "443"],
        correctAnswer: 3,
        explanation: "Le port 443 est le port standard pour HTTPS (HTTP Secure)."
    },
    {
        question: "Quelle technologie permet d'isoler des réseaux locaux au sein d'un même commutateur ?",
        options: ["NAT", "VPN", "VLAN", "DMZ"],
        correctAnswer: 2,
        explanation: "Les VLAN (Virtual Local Area Network) permettent de segmenter un réseau physique en plusieurs réseaux logiques isolés."
    },
    {
        question: "Qu'est-ce que le RAID 5 ?",
        options: ["Miroir de disques", "Division des données sans parité", "Division avec parité distribuée", "Concaténation de disques"],
        correctAnswer: 2,
        explanation: "RAID 5 utilise une division des données avec parité distribuée, offrant une tolérance à la panne d'un disque."
    },
    {
        question: "Quel outil est principalement utilisé pour analyser le trafic réseau en temps réel ?",
        options: ["Nmap", "Wireshark", "Metasploit", "John the Ripper"],
        correctAnswer: 1,
        explanation: "Wireshark est un analyseur de protocole réseau qui permet de capturer et d'examiner le trafic réseau en temps réel."
    },
    {
        question: "Quelle est la principale différence entre un hub et un switch ?",
        options: ["Le prix", "Le nombre de ports", "La manière de transmettre les données", "La vitesse de transmission"],
        correctAnswer: 2,
        explanation: "Un hub diffuse les données à tous les périphériques connectés (broadcast), tandis qu'un switch envoie les données uniquement au périphérique destinataire (unicast)."
    },
    {
        question: "Qu'est-ce qu'une attaque par déni de service (DoS) ?",
        options: ["Tentative de voler des données sensibles", "Tentative de s'introduire dans un système", "Tentative de rendre un service indisponible", "Tentative de modifier des données"],
        correctAnswer: 2,
        explanation: "Une attaque par déni de service vise à rendre un service, un site web ou une ressource réseau indisponible en l'inondant de trafic ou en exploitant des vulnérabilités."
    },
    {
        question: "Quelle technologie est utilisée pour sécuriser la communication entre deux réseaux via Internet ?",
        options: ["VPN", "DNS", "DHCP", "FTP"],
        correctAnswer: 0,
        explanation: "Un VPN (Virtual Private Network) permet de créer une connexion sécurisée entre deux réseaux à travers Internet."
    },
    {
        question: "Quel modèle OSI gère le routage des paquets ?",
        options: ["Couche 1 (Physique)", "Couche 2 (Liaison de données)", "Couche 3 (Réseau)", "Couche 4 (Transport)"],
        correctAnswer: 2,
        explanation: "La couche 3 (Réseau) du modèle OSI est responsable du routage des paquets de données entre les réseaux."
    }
];

/**
 * Initialise et affiche le quiz technique
 */
function startTechQuiz() {
    // Créer l'élément modal pour le quiz
    const quizModal = document.createElement('div');
    quizModal.className = 'quiz-modal';
    quizModal.innerHTML = `
        <div class="quiz-container">
            <div class="quiz-header">
                <div class="controls">
                    <span class="control red"></span>
                    <span class="control yellow"></span>
                    <span class="control green"></span>
                </div>
                <div class="title">Quiz Technique SISR</div>
                <div class="close-btn">&times;</div>
            </div>
            <div class="quiz-content">
                <div class="quiz-intro">
                    <h2>Testez vos connaissances en SISR</h2>
                    <p>Ce quiz comporte ${quizQuestions.length} questions sur les réseaux, la sécurité et l'administration système.</p>
                    <p>Chaque bonne réponse vaut 1 point. Voyons combien vous pouvez en obtenir !</p>
                    <button class="start-quiz-btn">Commencer le Quiz</button>
                </div>
                <div class="quiz-question-container" style="display: none;">
                    <div class="question-counter">Question <span class="current-question">1</span>/${quizQuestions.length}</div>
                    <div class="question-text"></div>
                    <div class="options-container"></div>
                    <div class="explanation" style="display: none;"></div>
                    <div class="quiz-navigation">
                        <button class="submit-answer-btn">Valider la réponse</button>
                        <button class="next-question-btn" style="display: none;">Question suivante</button>
                    </div>
                </div>
                <div class="quiz-results" style="display: none;">
                    <h2>Résultats du Quiz</h2>
                    <div class="score-display">
                        <div class="score-circle">
                            <span class="score-value">0</span>/${quizQuestions.length}
                        </div>
                        <div class="score-message"></div>
                    </div>
                    <div class="ascii-trophy">
<pre>
       ___________
      '._==_==_=_.'
      .-\\:      /-.
     | (|:.     |) |
      '-|:.     |-'
        \\::.    /
         '::. .'
           ) (
         _.' '._
</pre>
                    </div>
                    <button class="restart-quiz-btn">Refaire le Quiz</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(quizModal);
    
    // Gérer la fermeture du quiz
    const closeBtn = quizModal.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        quizModal.remove();
    });
    
    // Échap pour fermer le quiz
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && document.querySelector('.quiz-modal')) {
            quizModal.remove();
        }
    });
    
    // Variables pour suivre l'état du quiz
    let currentQuestion = 0;
    let score = 0;
    let selectedOption = -1;
    
    // Éléments du DOM
    const introSection = quizModal.querySelector('.quiz-intro');
    const questionSection = quizModal.querySelector('.quiz-question-container');
    const resultsSection = quizModal.querySelector('.quiz-results');
    const questionText = quizModal.querySelector('.question-text');
    const optionsContainer = quizModal.querySelector('.options-container');
    const currentQuestionSpan = quizModal.querySelector('.current-question');
    const submitBtn = quizModal.querySelector('.submit-answer-btn');
    const nextBtn = quizModal.querySelector('.next-question-btn');
    const explanation = quizModal.querySelector('.explanation');
    
    // Démarrer le quiz
    quizModal.querySelector('.start-quiz-btn').addEventListener('click', () => {
        introSection.style.display = 'none';
        questionSection.style.display = 'block';
        loadQuestion(currentQuestion);
    });
    
    // Charger une question
    function loadQuestion(index) {
        // Réinitialiser l'état
        selectedOption = -1;
        explanation.style.display = 'none';
        submitBtn.style.display = 'block';
        nextBtn.style.display = 'none';
        
        // Mettre à jour le compteur de questions
        currentQuestionSpan.textContent = index + 1;
        
        // Afficher la question
        const question = quizQuestions[index];
        questionText.textContent = question.question;
        
        // Afficher les options
        optionsContainer.innerHTML = '';
        question.options.forEach((option, i) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.innerHTML = `
                <input type="radio" name="quiz-option" id="option-${i}" value="${i}">
                <label for="option-${i}">${option}</label>
            `;
            optionsContainer.appendChild(optionElement);
            
            // Ajouter un gestionnaire d'événements pour la sélection d'option
            optionElement.querySelector('input').addEventListener('change', (e) => {
                selectedOption = parseInt(e.target.value);
            });
        });
    }
    
    // Vérifier la réponse
    submitBtn.addEventListener('click', () => {
        if (selectedOption === -1) {
            alert('Veuillez sélectionner une réponse');
            return;
        }
        
        const correctAnswer = quizQuestions[currentQuestion].correctAnswer;
        const options = optionsContainer.querySelectorAll('.option');
        
        // Désactiver les options
        options.forEach(option => {
            const input = option.querySelector('input');
            input.disabled = true;
        });
        
        // Mettre en évidence la réponse correcte et incorrecte
        options[correctAnswer].classList.add('correct');
        if (selectedOption !== correctAnswer) {
            options[selectedOption].classList.add('incorrect');
        } else {
            score++;
        }
        
        // Afficher l'explication
        explanation.textContent = quizQuestions[currentQuestion].explanation;
        explanation.style.display = 'block';
        
        // Cacher le bouton de soumission et afficher le bouton suivant
        submitBtn.style.display = 'none';
        nextBtn.style.display = 'block';
    });
    
    // Passer à la question suivante
    nextBtn.addEventListener('click', () => {
        currentQuestion++;
        
        if (currentQuestion < quizQuestions.length) {
            // Charger la question suivante
            loadQuestion(currentQuestion);
        } else {
            // Afficher les résultats
            questionSection.style.display = 'none';
            resultsSection.style.display = 'block';
            
            // Mettre à jour le score
            const scoreValue = resultsSection.querySelector('.score-value');
            scoreValue.textContent = score;
            
            // Afficher un message en fonction du score
            const scoreMessage = resultsSection.querySelector('.score-message');
            const percentage = (score / quizQuestions.length) * 100;
            
            if (percentage >= 90) {
                scoreMessage.textContent = "Excellent ! Vous êtes un expert en SISR !";
            } else if (percentage >= 70) {
                scoreMessage.textContent = "Très bien ! Vous avez de solides connaissances en SISR.";
            } else if (percentage >= 50) {
                scoreMessage.textContent = "Bien ! Continuez d'approfondir vos connaissances.";
            } else {
                scoreMessage.textContent = "Continuez à apprendre ! La pratique fait la perfection.";
            }
        }
    });
    
    // Redémarrer le quiz
    quizModal.querySelector('.restart-quiz-btn').addEventListener('click', () => {
        currentQuestion = 0;
        score = 0;
        resultsSection.style.display = 'none';
        questionSection.style.display = 'block';
        loadQuestion(currentQuestion);
    });
}

// Exposer la fonction globalement pour l'utiliser depuis d'autres fichiers
window.startTechQuiz = startTechQuiz; 