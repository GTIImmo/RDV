<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestion des RDV - GTI Immobilier</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <header>
        <div class="header">
            <img src="https://www.gti-immobilier.fr/application/files/5617/3617/2343/GTI-Logos-Grisblanc.png" alt="GTI Immobilier" class="logo">
        </div>
    </header>

    <div class="container">
        <!-- 📢 Introduction -->
        <div class="info-container">
            <h2 class="intro-title">📢 Un futur vendeur a besoin de vous !</h2>

            <p class="intro-text">
                Ce rendez-vous a été pris suite à une <span class="highlight">demande d'estimation en ligne</span>.
            </p>

            <p class="intro-text">
                Après quelques échanges, nous lui avons proposé d’affiner son projet.
            </p>
        </div>

        <!-- 📋 Infos du lead en deux colonnes -->
        <div class="lead-info">
            <div class="lead-column">
                <p id="nom">👤 <strong>Nom :</strong> </p>
                <p id="prenom">🆔 <strong>Prénom :</strong> </p>
                <p id="rdv">📅 <strong>Date de RDV :</strong> </p>
            </div>
            <div class="lead-column">
                <p id="statutRDV">📆 <strong>Statut :</strong> </p>
                <p id="telephone" style="display: none;">📞 <strong>Téléphone :</strong> <span id="phoneNumber"></span></p>
                <p id="email" style="display: none;">📧 <strong>Email :</strong> <span id="emailAddress"></span></p>
            </div>
        </div>

        <!-- 🚀 Phrase clé sous les données du lead -->
        <p class="action-message">
            🚀 <strong>C'est le moment d'agir !</strong> Contactez-le rapidement pour 
            <span class="highlight">confirmer</span>, <span class="highlight">ajuster</span> ou <span class="highlight">reprogrammer</span> son rendez-vous.
        </p>

        <!-- 🔹 Boutons d'action avec un bon espacement et effets -->
        <div class="actions">
            <button id="appelerBtn" class="btn btn-call">📞 Appeler</button>
            <button id="envoyerMailBtn" class="btn btn-email">📧 Envoyer un mail</button>
        </div>

        <!-- 📧 Boîte de dialogue pour l'envoi de mail (Cachée au départ) -->
        <div id="emailModal" class="modal hidden">
            <div class="modal-content">
                <h2>✉ Sélectionnez un modèle d'e-mail</h2>
                <select id="emailType">
                    <option value="confirmation">✅ Confirmer le RDV</option>
                    <option value="annulation">❌ Annuler le RDV</option>
                    <option value="reprogrammation">🔄 Reprogrammer le RDV</option>
                </select>
                <button id="envoyerMailFinal" class="btn btn-success">📩 Envoyer</button>
                <button id="fermerModal" class="btn btn-danger">❌ Fermer</button>
            </div>
        </div>

        <!-- ❓ Question avec choix Oui/Non bien espacés -->
        <div class="question-rdv">
            <span>Avez-vous convenu d’un rendez-vous avec ce lead ?</span>
            <button id="confirmerBtn" class="btn btn-yes">✅ Oui</button>
            <button id="annulerBtn" class="btn btn-no">❌ Non</button>
        </div>

    </div>

    <script src="script.js"></script>
</body>
</html>
