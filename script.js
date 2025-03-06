/* 🌟 Fond général */
body {
    font-family: Arial, sans-serif;
    background-color: #F4F4F4;
    color: #222222;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}

/* 🌟 Bandeau du haut anthracite */
.header {
    background-color: #222222;
    text-align: center;
    padding: 15px 0;
}

/* 🏠 Logo Agrandi */
.logo {
    max-width: 200px;
}

/* 📋 Conteneur principal */
.container {
    max-width: 700px;
    background-color: white;
    margin: 20px auto;
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
    text-align: center;
}

/* 🔹 Boutons d'action modernisés */
.actions {
    display: flex;
    justify-content: center;
    gap: 15px;
    flex-wrap: wrap;
    margin: 20px 0;
}

/* Style général des boutons */
.btn {
    font-size: 18px;
    padding: 12px 20px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    transition: 0.3s ease-in-out;
    box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

/* Effet au survol */
.btn:hover {
    transform: scale(1.05);
    box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.3);
}

/* 📞 Bouton Appeler */
.btn-call {
    background-color: #FF5733;
    color: white;
    flex: 1;
    min-width: 160px;
}

.btn-call:hover {
    background-color: #C70039;
}

/* 📧 Bouton Envoyer un mail */
.btn-email {
    background-color: #FFC300;
    color: black;
    flex: 1;
    min-width: 160px;
}

.btn-email:hover {
    background-color: #DAA520;
}

/* ✅ Oui / Non avec couleurs flash */
.btn-yes {
    background-color: #00C853;
    color: white;
    width: 100px;
}

.btn-no {
    background-color: #FF1744;
    color: white;
    width: 100px;
}

/* 📧 Boîte modale */
.modal {
    display: none;
    position: fixed;
    z-index: 1000;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-width: 400px;
    background: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.3);
}

/* 📱 Responsive */
@media screen and (max-width: 600px) {
    .actions {
        flex-direction: column;
        align-items: center;
    }
}
