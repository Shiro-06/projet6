document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('myModal');
    const editProjectButton = document.getElementById('editProject');
    const closeButton = document.querySelector('.close');
    const workImagesContainer = document.getElementById('workImagesContainer');

    editProjectButton.addEventListener('click', function () {
        // Efface le contenu précédent de la modale
        workImagesContainer.innerHTML = '';

        // Effectue la requête AJAX pour récupérer les travaux
        fetch('http://localhost:5678/api/works')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des travaux');
                }
                return response.json();
            })
            .then(works => {
                // Affiche les images des travaux dans la modale
                works.forEach(work => {
                    const container = document.createElement('div');
                    container.className = 'image-container';

                    const imageElement = document.createElement('img');
                    imageElement.src = work.imageUrl;
                    container.appendChild(imageElement);

                    const deleteIcon = document.createElement('i');
                    deleteIcon.className = 'fa fa-solid fa-trash-can delete-icon';
                    deleteIcon.onclick = function () { deleteImage(work.id, container); };
                    container.appendChild(deleteIcon);

                    workImagesContainer.appendChild(container);
                });

                modal.style.display = 'block';
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des travaux:', error.message);
            });
    });

    closeButton.addEventListener('click', function () {
        // Ferme la modale
        modal.style.display = 'none';
    });

    // Ferme la modale si l'utilisateur clique en dehors de la modale
    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

function deleteImage(workId, containerElement) {
    // Récupérer le token depuis le localStorage
    const token = localStorage.getItem('authToken');
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
            if (response.ok) {
                containerElement.remove();
                alert("Travail supprimé avec succès");
            } else {
                response.text().then(text => alert(text));
            }
        })
        .catch(error => console.error('Erreur:', error));
}

// Gérer l'Ouverture et la Fermeture des Modales
document.getElementById('modaleBtn').addEventListener('click', function () {
    document.getElementById('myModal').style.display = 'none';
    document.getElementById('newProjectModal').style.display = 'block';
    // Charger les catégories ici si nécessaire
});

document.querySelector('.back-arrow').addEventListener('click', function () {
    document.getElementById('newProjectModal').style.display = 'none';
    document.getElementById('myModal').style.display = 'block';
});
document.getElementById('newProjectForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    // Ajoutez ici la logique d'envoi de la requête POST à votre API
});

document.addEventListener('DOMContentLoaded', function () {
    // ...autres codes...

    const newProjectModal = document.getElementById('newProjectModal');
    const closeNewModalButton = document.querySelector('.close-new-modal');

    // Fermer newProjectModal quand on clique sur la croix
    closeNewModalButton.addEventListener('click', function () {
        newProjectModal.style.display = 'none';
    });

    // Fermer newProjectModal quand on clique en dehors de la modale
    window.addEventListener('click', function (event) {
        if (event.target === newProjectModal) {
            newProjectModal.style.display = 'none';
        }
    });
});

// Prévisualisation de l'Image uploadé
document.getElementById('imageUpload').addEventListener('change', function (event) {
    const [file] = event.target.files;
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('imagePreviewContainer');
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('modaleBtn').addEventListener('click', function () {
    // Affiche la nouvelle modale
    document.getElementById('newProjectModal').style.display = 'block';

    // Appel AJAX pour charger les catégories
    fetch('http://localhost:5678/api/categories')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des catégories');
            }
            return response.json();
        })
        .then(categories => {
            const select = document.getElementById('projectCategory');
            select.innerHTML = ''; // Efface les options précédentes

            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                select.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des catégories:', error.message);
        });
});

document.getElementById('imageUpload').addEventListener('change', function (event) {
    const imageContainer = document.getElementById('imagePreviewContainer');
    const files = event.target.files;

    if (files && files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
            imageContainer.innerHTML = ''; // Effacer le contenu précédent
            const img = new Image();
            img.className = 'image-preview'; // Appliquer la classe CSS
            img.src = e.target.result;
            imageContainer.appendChild(img);
        };

        reader.readAsDataURL(files[0]);
    }
});

document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('addPhotoBtn').addEventListener('click', function (event) {
        event.preventDefault();
 
        const fileInput = document.getElementById('imageUpload');
        const titleInput = document.getElementById('projectTitle');
        const categorySelect = document.getElementById('projectCategory');
        const file = fileInput.files[0];

        // Vérifier si le titre est rempli
        alert(123)
        if (!titleInput.value.trim()) {
            alert("Veuillez remplir le champ du titre.");
            return;
        }
        // Vérifier si une catégorie est sélectionnée
        if (!categorySelect.value) {
            alert("Veuillez sélectionner une catégorie.");
            return;
        }

        // Vérifier si un fichier est sélectionné
        if (!file) {
            alert("Veuillez sélectionner un fichier.");
            return;
        }

        // Vérifier le format du fichier
        if (file.type == 'image/jpeg' && file.type == 'image/png') {
            alert("Le fichier doit être au format jpg ou png.");
            return;
        }

        // Vérifier la taille du fichier (4 Mo = 4 * 1024 * 1024 octets)
        if (file.size < 4 * 1024 * 1024) {
            alert("Le fichier ne doit pas dépasser 4 Mo.");
            return;
        }
        // Récupérer le token depuis le localStorage
        const token = localStorage.getItem('authToken');
        if (!token) {
            alert("Vous n'êtes pas autorisé à effectuer cette action");
            return;
        }

        // Préparation de l'envoi du formulaire
        const formData = new FormData();
        formData.append('image', file);
        formData.append('title', titleInput.value);
        formData.append('category', categorySelect.value);

        // Envoi de la requête POST avec le token
        fetch('http://localhost:5678/api/works', {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error(`Erreur lors de l'envoi du formulaire.`);
            })
            .then(data => {

            })
            .catch(error => {
                console.error('Erreur:', error);
                alert(error.message);
            });
    })
});