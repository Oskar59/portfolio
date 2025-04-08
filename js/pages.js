/**
 * Portfolio - Pages JavaScript
 * Script optimisé pour les pages internes du portfolio
 */

document.addEventListener('DOMContentLoaded', () => {
    // Créer l'effet "Matrix" en arrière-plan (comme sur la page d'accueil)
    createMatrixEffect();
    
    // Ajouter des animations pour les éléments de la page
    animatePageElements();
    
    // Ajouter un effet de frappe pour les lignes de commande
    typeCommandLines();
    
    // Configurer le formulaire de contact si présent
    setupContactForm();
    
    // Gérer les images manquantes dans le CV
    handleMissingProfileImage();
    
    // Gérer les erreurs de chargement du logo de l'entreprise
    handleMissingCompanyLogo();

    // Gestion des onglets de la page Alternance
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    function switchTab(tabId) {
        // Mise à jour des boutons
        tabButtons.forEach(button => {
            button.classList.remove('active');
            if (button.getAttribute('data-tab') === tabId) {
                button.classList.add('active');
            }
        });

        // Mise à jour des contenus
        tabContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === tabId) {
                content.classList.add('active');
            }
        });
    }

    // Ajout des écouteurs d'événements sur les boutons
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    // Activation de l'onglet par défaut
    const defaultTab = document.querySelector('.tab-button.active').getAttribute('data-tab');
    switchTab(defaultTab);
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
    // Vérifier si l'élément existe déjà (pour éviter les doublons)
    if (document.querySelector('.matrix-bg')) return;
    
    // Créer l'élément div pour l'arrière-plan
    const matrixBg = document.createElement('div');
    matrixBg.className = 'matrix-bg';
    document.body.insertBefore(matrixBg, document.body.firstChild);
    
    // Caractères utilisés pour l'effet matrix
    const chars = '01あいうえおかきくけこさしすせそたちつてとなにぬねの';
    
    // Nombre de caractères à afficher (moins que sur la page d'accueil pour ne pas surcharger)
    // Adapte le nombre de caractères en fonction de la taille de l'écran
    const numChars = Math.min(30, Math.floor(window.innerWidth / 25));
    
    // Utilisation d'un fragment de document pour optimiser les performances
    const fragment = document.createDocumentFragment();
    
    // Créer les caractères qui tombent
    for (let i = 0; i < numChars; i++) {
        const fallingChar = document.createElement('div');
        fallingChar.className = 'falling-character';
        fallingChar.style.left = `${Math.random() * 100}%`;
        fallingChar.style.animationDuration = `${Math.random() * 10 + 5}s`;
        fallingChar.style.animationDelay = `${Math.random() * 5}s`;
        fallingChar.textContent = chars.charAt(Math.floor(Math.random() * chars.length));
        
        // Ajouter au fragment du document
        fragment.appendChild(fallingChar);
    }
    
    // Ajouter le fragment au DOM (une seule opération de rendu)
    matrixBg.appendChild(fragment);
    
    // Utiliser requestAnimationFrame pour des animations plus fluides
    let lastTime = 0;
    const charElements = matrixBg.querySelectorAll('.falling-character');
    
    function updateChars(timestamp) {
        // Limiter à 1 mise à jour par seconde
        if (timestamp - lastTime > 1000) {
            lastTime = timestamp;
            
            charElements.forEach(element => {
                // 10% de chance de changer le caractère (moins fréquent que sur la page d'accueil)
                if (Math.random() < 0.1) {
                    element.textContent = chars.charAt(Math.floor(Math.random() * chars.length));
                }
            });
        }
        
        requestAnimationFrame(updateChars);
    }
    
    requestAnimationFrame(updateChars);
}

/**
 * Ajoute des animations aux éléments de la page
 */
function animatePageElements() {
    // Utiliser l'Intersection Observer API pour optimiser les animations
    // Cela permet de n'animer que les éléments visibles à l'écran
    
    // Liste des sélecteurs d'éléments à animer
    const elementsToAnimate = [
        '.content-container',
        '.profile-picture',
        '.text-block',
        '.skills-block',
        '.interests-block',
        '.cv-section',
        '.timeline-item',
        '.company-details',
        '.mission-card',
        '.project-card',
        '.contact-info',
        '.social-links',
        '.contact-form',
        '.button-container'
    ];
    
    // Créer l'observateur d'intersection
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Ajouter un délai en fonction de l'ordre dans le DOM
                const index = Array.from(document.querySelectorAll(elementsToAnimate.join(', '))).indexOf(entry.target);
                const delay = 100 + (index * 50);
                
                // Appliquer l'animation avec un délai
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, delay);
                
                // Arrêter d'observer cet élément une fois animé
                observer.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Préparer et observer tous les éléments
    document.querySelectorAll(elementsToAnimate.join(', ')).forEach(el => {
        // Initialiser les styles pour l'animation
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        // Observer l'élément
        observer.observe(el);
    });
}

/**
 * Effet de frappe pour les lignes de commande
 */
function typeCommandLines() {
    // Trouver toutes les lignes de commande (sauf celles qui ont un curseur clignotant)
    const commandLines = document.querySelectorAll('.terminal-line .command:not(.blink)');
    
    // Utiliser un délai progressif pour chaque ligne
    commandLines.forEach((commandElement, index) => {
        const originalText = commandElement.textContent;
        commandElement.textContent = '';
        
        // Délai avant de commencer à taper
        const startDelay = 300 + (index * 700);
        
        // Fonction récursive pour simuler la frappe
        function typeText(text, element, speed, i = 0) {
            if (i < text.length) {
                setTimeout(() => {
                    element.textContent += text.charAt(i);
                    typeText(text, element, speed, i + 1);
                }, speed);
            }
        }
        
        // Commencer à taper après le délai initial
        setTimeout(() => {
            typeText(originalText, commandElement, 40);
        }, startDelay);
    });
}

/**
 * Configure le formulaire de contact
 */
function setupContactForm() {
    // Vérifier si le formulaire de contact existe
    const contactForm = document.getElementById('messageForm');
    if (!contactForm) return;
    
    // Sécuriser le formulaire - empêcher soumissions multiples
    let formSubmitted = false;
    
    // Ajouter un gestionnaire d'événement pour la soumission du formulaire
    contactForm.addEventListener('submit', function(e) {
        // Empêcher les soumissions multiples
        if (formSubmitted) {
            e.preventDefault();
            return false;
        }
        
        // Marquer comme soumis pour éviter les doubles soumissions
        formSubmitted = true;
        
        // Désactiver le bouton de soumission
        const submitButton = contactForm.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi...';
        }
        
        // Permettre à la soumission de continuer normalement
        return true;
    });
    
    // Vérifier si le formulaire a été soumis avec succès en analysant l'URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('sent') === 'success') {
        // Cacher le formulaire et afficher le message de succès
        contactForm.style.display = 'none';
        const formResponse = document.getElementById('formResponse');
        if (formResponse) {
            formResponse.classList.remove('hidden');
            
            // Ajouter un effet de frappe pour le message de succès
            const command = formResponse.querySelector('.command');
            if (command) {
                command.textContent = '';
                typeTextWithDelay(command, './message_sent.sh', 50);
            }
            
            // Animation ASCII art
            const asciiArt = formResponse.querySelector('.ascii-success');
            if (asciiArt) {
                asciiArt.style.opacity = '0';
                setTimeout(() => {
                    asciiArt.style.transition = 'opacity 1s ease';
                    asciiArt.style.opacity = '1';
                }, 1000);
            }
        }
        
        // Supprimer le paramètre de l'URL sans recharger la page
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
    }
    
    // Fonction pour taper du texte lettre par lettre avec un délai
    function typeTextWithDelay(element, text, speed, i = 0) {
        if (i < text.length) {
            setTimeout(() => {
                element.textContent += text.charAt(i);
                typeTextWithDelay(element, text, speed, i + 1);
            }, speed);
        }
    }
}

/**
 * Gère les images manquantes dans le CV et crée un placeholder dynamique si nécessaire
 */
function handleMissingProfileImage() {
    const profileImg = document.querySelector('.photo-frame img');
    if (!profileImg) return;
    
    // Si l'image ne se charge pas correctement, on crée un placeholder avec les initiales
    profileImg.addEventListener('error', function() {
        const photoFrame = this.parentElement;
        
        // Supprimer l'image qui n'a pas pu se charger
        this.remove();
        
        // Créer un placeholder avec les initiales
        const placeholder = document.createElement('div');
        placeholder.className = 'profile-placeholder';
        placeholder.innerHTML = 'OD'; // Initiales d'Oskar Doutreligne
        
        // Ajouter le placeholder au cadre photo
        photoFrame.appendChild(placeholder);
        
        // Ajouter du style au placeholder
        placeholder.style.display = 'flex';
        placeholder.style.alignItems = 'center';
        placeholder.style.justifyContent = 'center';
        placeholder.style.width = '100%';
        placeholder.style.height = '100%';
        placeholder.style.backgroundColor = '#1a1a1a';
        placeholder.style.color = '#3CFF97';
        placeholder.style.fontSize = '3rem';
        placeholder.style.fontWeight = 'bold';
        placeholder.style.textShadow = '0 0 10px rgba(60, 255, 151, 0.8)';
    });
}

/**
 * Gère les erreurs de chargement du logo de l'entreprise
 */
function handleMissingCompanyLogo() {
    const companyLogo = document.querySelector('.company-logo-img');
    if (!companyLogo) return;
    
    // Si l'image du logo ne se charge pas correctement, remplacer par une icône
    companyLogo.addEventListener('error', function() {
        const logoContainer = this.parentElement;
        
        // Supprimer l'image qui n'a pas pu se charger
        this.remove();
        
        // Créer une icône en remplacement
        const iconElement = document.createElement('i');
        iconElement.className = 'fas fa-landmark';
        iconElement.style.fontSize = '3rem';
        iconElement.style.color = '#3CFF97';
        iconElement.setAttribute('aria-hidden', 'true');
        
        // Ajouter l'icône au conteneur du logo
        logoContainer.appendChild(iconElement);
        
        // Message dans la console pour le débogage
        console.log('Logo d\'entreprise non trouvé, icône de remplacement affichée à la place.');
    });
} 