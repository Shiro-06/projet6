document.addEventListener('DOMContentLoaded', function () {
    // Sélection des éléments du DOM
    const modal = document.getElementById('myModal');
    const newProjectModal = document.getElementById('newProjectModal');
    const editProjectButton = document.getElementById('editProject');
    const closeButton = document.querySelector('.close');
    const closeNewModalButton = document.querySelector('.close-new-modal');
    const workImagesContainer = document.getElementById('workImagesContainer');
    const fileInput = document.getElementById('imageUpload');
    const titleInput = document.getElementById('projectTitle');
    const categorySelect = document.getElementById('projectCategory');
    const addPhotoBtn = document.getElementById('addPhotoBtn');
    const newProjectForm = document.getElementById('newProjectForm');
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    const backArrow = document.querySelector('.back-arrow');

    // Fonction pour récupérer le token d'authentification
    function getAuthToken() {
        return localStorage.getItem('authToken');
    }

    document.getElementById('editProject').addEventListener('click', function() {
        let modal = document.getElementById('myModal');
        modal.style.display = "block";
    });
    
    // Fonction pour charger les catégories
    function loadCategories() {
        fetch('http://localhost:5678/api/categories')
            .then(response => response.json())
            .then(categories => {
                const select = categorySelect;
                select.innerHTML = ''; // Efface les options précédentes
                categories.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.id;
                    option.textContent = category.name;
                    select.appendChild(option);
                });
            })
            .catch(error => console.error('Erreur:', error));
    }

    // Gestionnaire d'événements pour le retour à la modale précédente
    backArrow.addEventListener('click', function () {
        // Fermer la modale actuelle
        closeModal(newProjectModal);

        // Ouvrir la modale précédente (si nécessaire)
        modal.style.display = 'block';
    });

    // Gestion de l'ouverture de la modale de projet
    document.getElementById('modaleBtn').addEventListener('click', function () {
        newProjectModal.style.display = 'block';
        loadCategories();
    });

    // Gestion de la fermeture des modales
    function closeModal(modalElement) {
        modalElement.style.display = 'none';

        // Vérifiez si la modale fermée est newProjectModal
        if (modalElement === newProjectModal) {
            // Fermez également la fenêtre principale des modales
            modal.style.display = 'none';
        }
    }

    closeButton.addEventListener('click', () => closeModal(modal));
    closeNewModalButton.addEventListener('click', () => closeModal(newProjectModal));
    window.addEventListener('click', function (event) {
        if (event.target === modal) closeModal(modal);
        if (event.target === newProjectModal) closeModal(newProjectModal);
    });

    // Affichage des images de projet
    editProjectButton.addEventListener('click', function () {
        workImagesContainer.innerHTML = '';
        fetch('http://localhost:5678/api/works')
            .then(response => response.json())
            .then(works => {
                works.forEach(work => {
                    const container = document.createElement('div');
                    container.className = 'image-container';
                    container.innerHTML = `
                        <img src="${work.imageUrl}">
                        <i class="fa fa-solid fa-trash-can delete-icon" data-work-id="${work.id}"></i>
                    `;
                    workImagesContainer.appendChild(container);
                });
                modal.style.display = 'block';
            })
            .catch(error => console.error('Erreur:', error));
    });

    workImagesContainer.addEventListener('click', function (event) {
        if (event.target.classList.contains('delete-icon')) {
            const workId = event.target.getAttribute('data-work-id');
            deleteImage(workId, event.target.parentElement);
        }
    });


    // Prévisualisation de l'image uploadée
    fileInput.addEventListener('change', function (event) {
        const [file] = event.target.files;
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                imagePreviewContainer.innerHTML = `<img class='image-preview' src='${e.target.result}'>`;
            };
            reader.readAsDataURL(file);
        }
    });

    newProjectForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const selectedPic = fileInput.files[0];
        const selectedDesc = titleInput.value.trim();
        const selectedCat = categorySelect.value;

        if (!selectedDesc) {
            alert("Veuillez entrer un titre pour le projet.");
            return;
        }

        if (!selectedPic) {
            alert("Veuillez télécharger une photo.");
            return;
        }

        const validImageTypes = ['image/jpeg', 'image/png'];
        if (!validImageTypes.includes(selectedPic.type)) {
            alert("Le fichier doit être au format JPG ou PNG.");
            return;
        }

        if (selectedPic.size > 4 * 1024 * 1024) {
            alert("La taille du fichier ne doit pas dépasser 4 Mo.");
            return;
        }

        const formData = new FormData();
        formData.append("image", selectedPic);
        formData.append("title", selectedDesc);
        formData.append("category", selectedCat);

        // Débogage : Afficher le contenu de formData
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        // Envoi de la requête
        fetch('http://localhost:5678/api/works', {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        })
            .then(response => {
                if (!response.ok) throw new Error("Erreur lors de l'envoi du formulaire");
                return response.json();
            })
            .then(data => {
                closeModal(newProjectModal);
            })
            .catch(error => {
                console.error('Erreur:', error);
                alert(error.message);
            });
    });

    const token = getAuthToken();
    if (!token) {
        alert("Vous n'êtes pas autorisé à effectuer cette action");
        return;
    }

    // Validation du formulaire
    // Désactivez le bouton par défaut
    addPhotoBtn.disabled = true;
    addPhotoBtn.classList.remove('btnSelected');

    const checkConditionsAndApplyClass = () => {
        const isImageSelected = fileInput.files && fileInput.files.length > 0;
        const isTitleEntered = titleInput.value.trim() !== '';
        const isCategorySelected = categorySelect.value !== '';

        const allConditionsMet = isImageSelected && isTitleEntered && isCategorySelected;

        // Activez ou désactivez le bouton en fonction des conditions
        addPhotoBtn.disabled = !allConditionsMet;

        // Ajoutez ou retirez la classe btnSelected en fonction des conditions
        if (allConditionsMet) {
            addPhotoBtn.classList.add('btnSelected');
        } else {
            addPhotoBtn.classList.remove('btnSelected');
        }
    };

    fileInput.addEventListener('change', checkConditionsAndApplyClass);
    titleInput.addEventListener('input', checkConditionsAndApplyClass);
    categorySelect.addEventListener('change', checkConditionsAndApplyClass);

    // Exécutez initialement la vérification pour le cas où les valeurs sont déjà remplies
    checkConditionsAndApplyClass();

    // Fonction pour supprimer une image
    function deleteImage(workId, containerElement) {
        const token = getAuthToken();
        if (!token) {
            alert("Vous n'êtes pas autorisé à effectuer cette action");
            return;
        }

        fetch(`http://localhost:5678/api/works/${workId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                if (!response.ok) return response.text().then(text => Promise.reject(text));
                containerElement.remove();
                alert("Travail supprimé avec succès");
            })
            .catch(error => {
                console.error('Erreur:', error);
                alert(error);
            });
    }
});
