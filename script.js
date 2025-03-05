document.addEventListener("DOMContentLoaded", function() {
    const params = new URLSearchParams(window.location.search);
    let selectedAction = null; // Stocke l'action sélectionnée (confirmer, annuler, reprogrammer)
    let newDate = ""; // Stocke la nouvelle date pour reprogrammation

    function getParamValue(key) {
        return params.has(key) ? decodeURIComponent(params.get(key).replace(/\+/g, ' ')) : "Non renseigné";
    }

    function formatDateForSheet(dateString) {
        let date = new Date(dateString);
        if (isNaN(date.getTime())) return "";
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }

    function updateGoogleSheet() {
        if (!selectedAction) {
            alert("Veuillez d'abord choisir une action (Confirmer, Annuler, Reprogrammer).");
            return;
        }

        let rowParam = params.get("row");
        if (!rowParam) {
            console.error("❌ ERREUR : row est manquant dans l'URL !");
            alert("❌ Erreur : Impossible d'envoyer la modification car row est manquant !");
            return;
        }

        let url = `https://script.google.com/macros/s/AKfycbzpN_4u3vKwkW_7J5paCHIxiaImzXjUJFVe-4ablUsKUefwoWK-PRDYByY12JEz9qsV/exec?action=${selectedAction}&row=${rowParam}`;
        
        if (selectedAction === "modifier" && newDate) {
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
    
    let telephone = getParamValue("telephone");
    let email = getParamValue("email");
    
    document.getElementById("confirmerBtn").addEventListener("click", function() {
        selectedAction = "confirmer";
        alert("✅ Action sélectionnée : Confirmer. Vous devez maintenant appeler ou envoyer un email pour valider la mise à jour.");
    });
    
    document.getElementById("modifierBtn").addEventListener("click", function() {
        document.getElementById("modifierSection").style.display = "block";
    });
    
    document.getElementById("validerModifBtn").addEventListener("click", function() {
        newDate = document.getElementById("nouvelleDate").value;
        if (!newDate) {
            alert("Veuillez entrer une nouvelle date.");
            return;
        }
        selectedAction = "modifier";
        alert("🔄 Action sélectionnée : Reprogrammer. Vous devez maintenant appeler ou envoyer un email pour valider la mise à jour.");
    });
    
    document.getElementById("annulerBtn").addEventListener("click", function() {
        selectedAction = "annuler";
        alert("❌ Action sélectionnée : Annuler. Vous devez maintenant appeler ou envoyer un email pour valider la mise à jour.");
    });

    document.getElementById("appelerBtn").addEventListener("click", function() {
        if (!selectedAction) {
            alert("Veuillez d'abord choisir une action (Confirmer, Annuler, Reprogrammer).");
            return;
        }
        alert(`📞 Composez ce numéro : ${telephone}`);
        updateGoogleSheet(); // Envoie l'action après l'appel
    });

    document.getElementById("envoyerMailBtn").addEventListener("click", function() {
        if (!selectedAction) {
            alert("Veuillez d'abord choisir une action (Confirmer, Annuler, Reprogrammer).");
            return;
        }
        if (email !== "Non renseigné" && email.includes("@")) {
            let mailtoLink = `mailto:${email}?subject=Rendez-vous GTI Immobilier&body=Bonjour,%0A%0AJe vous contacte concernant votre rendez-vous.%0A%0AMerci`;
            window.open(mailtoLink, "_blank");
            updateGoogleSheet(); // Envoie l'action après l'email
        } else {
            alert("📧 Adresse e-mail non valide ou indisponible");
        }
    });
});
