document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const loginLink = document.getElementById('loginLink');
    const editionBar = document.querySelector('.editionBar');
    const editProject = document.getElementById('editProject');

    // Vérifier si l'utilisateur est connecté en fonction du token dans le stockage local
    const isLoggedIn = localStorage.getItem('authToken') !== null;

    // Mettre à jour le lien et la visibilité de editionBar en fonction de l'état de connexion
    updateUI();

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Envoyer les données du formulaire au serveur
        fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur dans l’identifiant ou le mot de passe');
                }
                return response.json();
            })
            .then(data => {
                localStorage.setItem('authToken', data.token);
                updateUI(); // Mettre à jour le lien et la visibilité de editionBar après la connexion
                window.location.href = 'index.html';
            })
            .catch(error => {
                console.error('Erreur de connexion:', error.message);
                alert(error.message);
            });
    });

    // Fonction pour mettre à jour le lien et la visibilité de editionBar en fonction de l'état de connexion
    function updateUI() {
        if (editionBar) {
            if (isLoggedIn) {
                // Utilisateur connecté, afficher editionBar
                editionBar.style.display = 'flex';
                // Afficher l'élément avec l'id #editProject s'il existe
                if (editProject) {
                    editProject.style.display = 'flex';
                }
                // Changer le texte du lien et définir un gestionnaire de clic pour la déconnexion
                loginLink.textContent = 'logout';
                loginLink.addEventListener('click', logout);
            } else {
                // Utilisateur non connecté, masquer editionBar et l'élément avec l'id #editProject s'il existe
                editionBar.style.display = 'none';
                if (editProject) {
                    editProject.style.display = 'none';
                }
                // Changer le texte du lien et définir un gestionnaire de clic pour la redirection vers la page de connexion
                loginLink.textContent = 'login';
                loginLink.addEventListener('click', redirectToLogin);
            }
        } else {
            console.error('Erreur: editionBar est null.');
        }
    }

    // Fonction pour déconnecter l'utilisateur
    function logout() {
        localStorage.removeItem('authToken'); // Supprimer le token du stockage local
        updateUI(); // Mettre à jour le lien et la visibilité de editionBar après la déconnexion
        // Autres actions de déconnexion si nécessaire
    }

    // Fonction pour rediriger vers la page de connexion
    function redirectToLogin() {
        window.location.href = 'login.html';
    }
});
