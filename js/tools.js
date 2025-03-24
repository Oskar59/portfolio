/**
 * Script pour la gestion des modales d'outils (SIGMA et OMEGA)
 */
document.addEventListener('DOMContentLoaded', function() {
    // Configuration des outils
    const toolsConfig = {
        'sigma': {
            title: 'SIGMA (GLPI adapté)',
            description: 'SIGMA est une adaptation de GLPI (Gestionnaire Libre de Parc Informatique) utilisée par la DGFIP pour la gestion et le suivi du parc informatique. Cet outil permet l\'inventaire du matériel, le suivi des interventions et la gestion des actifs informatiques de l\'ensemble des centres des Finances Publiques.',
            imagePath: '../img/sigma.png'
        },
        'omega': {
            title: 'OMEGA (Plateforme de support)',
            description: 'OMEGA est la plateforme de ticketing et de gestion des incidents utilisée par la DGFIP. Elle permet de centraliser les demandes d\'assistance des utilisateurs, d\'assigner les tickets aux techniciens, et de suivre la résolution des problèmes. Cette interface facilite la communication entre les utilisateurs et l\'équipe informatique.',
            imagePath: '../img/omega.png'
        }
    };

    // Références aux éléments du DOM
    const modal = document.getElementById('tool-modal');
    const closeBtn = document.querySelector('.close-modal');
    const toolImage = document.getElementById('tool-image');
    const toolTitle = document.getElementById('tool-title');
    const toolText = document.getElementById('tool-text');
    const toolMentions = document.querySelectorAll('.tool-mention');

    // Fonction pour afficher la modale
    function showModal(toolName) {
        if (!toolsConfig[toolName]) return;
        
        const tool = toolsConfig[toolName];
        
        // Mettre à jour le contenu de la modale
        toolImage.src = tool.imagePath;
        toolImage.alt = `Capture d'écran de ${tool.title}`;
        toolTitle.textContent = tool.title;
        toolText.textContent = tool.description;
        
        // Afficher la modale avec animation
        modal.style.display = 'block';
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
    }

    // Fonction pour fermer la modale
    function closeModal() {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300); // Attendre la fin de l'animation (300ms)
    }

    // Ajouter les écouteurs d'événements
    toolMentions.forEach(mention => {
        const toolName = mention.getAttribute('data-tool');
        
        mention.addEventListener('click', (e) => {
            e.preventDefault();
            showModal(toolName);
        });
    });

    // Fermer la modale avec le bouton de fermeture
    closeBtn.addEventListener('click', closeModal);

    // Fermer la modale en cliquant en dehors du contenu
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Fermer la modale avec la touche Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}); 