document.addEventListener("DOMContentLoaded", function() {
    const params = new URLSearchParams(window.location.search);

    function getParamValue(key) {
        return params.has(key) ? decodeURIComponent(params.get(key).replace(/\+/g, ' ')) : "Non renseigné";
    }

    function formatPhoneNumber(number) {
        if (!number || number === "Non renseigné") return "Non renseigné";
        let cleaned = number.replace(/[^0-9]/g, ""); // Supprime tout sauf les chiffres
        if (cleaned.length === 9) {
            return "0" + cleaned; // Ajoute un "0" devant si nécessaire
        }
        return cleaned.length === 10 ? cleaned : "Non renseigné"; // Vérifie si c'est un vrai numéro FR
    }

    function formatDateForSheet(dateString) {
        let date = new Date(dateString);
        if (isNaN(date.getTime())) return "";
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }

    function updateGoogleSheet(action, newDate = "") {
        if (!confirm("Confirmer cette action ?")) return;

        let rowParam = params.get("row");
        if (!rowParam) {
            alert("❌ Erreur : Impossible d'envoyer la modification !");
            return;
        }

        let url = `https://script.google.com/macros/s/AKfycbzpN_4u3vKwkW_7J5paCHIxiaImzXjUJFVe-4ablUsKUefwoWK-PRDYByY12JEz9qsV/exec?action=${action}&row=${rowParam}`;

        if (newDate) {
            let formattedDate = formatDateForSheet(newDate);
            url += `&rdv=${encodeURIComponent(formattedDate)}`;
        }

        console.log("📡 URL envoyée : " + url);

        fetch(url)
            .then(response => response.text())
            .then(result => {
                console.log("✅ Réponse du serveur : " + result);
                alert(result);
                location.reload();
            })
            .catch(error => console.error("❌ Erreur : ", error));
    }

    document.getElementById("nom").textContent += ` ${getParamValue("nom")}`;
    document.getElementById("prenom").textContent += ` ${getParamValue("prenom")}`;
    document.getElementById("rdv").textContent += ` ${getParamValue("rdv")}`;
    document.getElementById("statutRDV").textContent += ` ${getParamValue("statutRDV")}`;

    // Affichage du numéro de téléphone correctement formaté
    let telephone = formatPhoneNumber(getParamValue("telephone"));
    let email = getParamValue("email");

    if (telephone !== "Non renseigné") {
        document.getElementById("telephone").style.display = "block";
        document.getElementById("phoneNumber").textContent = telephone;
    }

    if (email !== "Non renseigné") {
        document.getElementById("email").style.display = "block";
        document.getElementById("emailAddress").textContent = email;
    }

    // Boutons de gestion
    document.getElementById("confirmerBtn").addEventListener("click", function() {
        updateGoogleSheet("confirmer");
    });

    document.getElementById("annulerBtn").addEventListener("click", function() {
        updateGoogleSheet("annuler");
    });

    // Si besoin d'un bouton "Modifier RDV"
    document.getElementById("modifierBtn").addEventListener("click", function() {
        document.getElementById("modifierSection").style.display = "block";
    });

    document.getElementById("validerModifBtn").addEventListener("click", function() {
        let nouvelleDate = document.getElementById("nouvelleDate").value;
        if (!nouvelleDate) {
            alert("Veuillez entrer une nouvelle date.");
            return;
        }
        updateGoogleSheet("modifier", nouvelleDate);
    });
});
