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
                    deleteIcon.onclick = function() { deleteImage(work.id, container); };
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
        if(response.ok) {
            containerElement.remove();
            alert("Travail supprimé avec succès");
        } else {
            response.text().then(text => alert(text));
        }
    })
    .catch(error => console.error('Erreur:', error));
}
