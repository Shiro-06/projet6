document.addEventListener('DOMContentLoaded', function () {
    const buttonContainer = document.getElementById('buttonContainer');
    const galleryContainer = document.querySelector('.gallery');
    let selectedButton = null; // Ajouter une variable pour stocker le bouton sélectionné
    let works = []; // Ajouter une variable pour stocker les éléments récupérés

    // Fonction pour ajouter la classe btnSelected au bouton actif
    function setButtonSelected(button) {
        // Supprimer la classe du bouton précédemment sélectionné
        if (selectedButton) {
            selectedButton.classList.remove('btnSelected');
        }

        // Ajouter la classe au bouton actif
        button.classList.add('btnSelected');
        // Mettre à jour le bouton sélectionné
        selectedButton = button;
    }

    // Fonction pour afficher les éléments dans la galerie
    function displayGallery(elements) {
        galleryContainer.innerHTML = ''; // Effacer le contenu précédent

        elements.forEach(element => {
            const figure = document.createElement('figure');
            const img = document.createElement('img');
            const figcaption = document.createElement('figcaption');

            img.src = element.imageUrl;
            img.alt = element.title;
            figcaption.textContent = element.title;

            figure.appendChild(img);
            figure.appendChild(figcaption);
            galleryContainer.appendChild(figure);
        });
    }

    // Fonction pour gérer le clic sur un bouton de catégorie
    function fetchCategories(categoryId) {
        // Filtrer les éléments par catégorie
        const filteredElements = works.filter(element => element.category.id === categoryId);
        // Afficher les éléments filtrés
        displayGallery(filteredElements);
    }

    // Fonction pour récupérer les éléments depuis l'API
    function fetchData(apiUrl) {
        return fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erreur HTTP! Statut: ${response.status}`);
                }
                return response.json();
            })
            .catch(error => {
                console.error(`Erreur lors de la récupération des données depuis l'API: ${error.message}`);
            });
    }

    // Fonction pour créer et ajouter des boutons de catégorie
    function createCategoryButtons(categories) {
        // Ajouter le bouton "Tous" en premier
        const tousButton = document.createElement('button');
        tousButton.textContent = 'Tous';
        tousButton.addEventListener('click', function () {
            setButtonSelected(tousButton);
            displayGallery(works);
        });
        tousButton.classList.add('category-button'); // Ajouter la classe au bouton
        buttonContainer.appendChild(tousButton);

        // Créer les boutons avec des noms spécifiques
        categories.forEach(category => {
            const button = document.createElement('button');
            button.textContent = category.name;
            button.addEventListener('click', function () {
                setButtonSelected(button);
                fetchCategories(category.id);
            });
            button.classList.add('category-button'); // Ajouter la classe au bouton
            buttonContainer.appendChild(button);
        });
    }

    // Fonction pour initialiser la page
    function initializePage() {
        fetchData('http://localhost:5678/api/categories')
            .then(categories => {
                createCategoryButtons(categories);
            })
            .then(() => {
                // Appeler fetchGallery une fois que les boutons sont créés
                return fetchData('http://localhost:5678/api/works');
            })
            .then(data => {
                // Stocker les éléments dans la variable globale works
                works = data;
                // Utiliser les données récupérées pour afficher les éléments
                displayGallery(works);
            });
    }

    // Appeler la fonction pour initialiser la page
    initializePage();
});
