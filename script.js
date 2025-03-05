document.addEventListener("DOMContentLoaded", function() {
    const params = new URLSearchParams(window.location.search);
    let selectedAction = null;

    function getParamValue(key) {
        return params.has(key) ? decodeURIComponent(params.get(key).replace(/\+/g, ' ')) : "Non renseigné";
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
    
    let reprogrammerBtn = document.getElementById("reprogrammerBtn");
    if (reprogrammerBtn) {
        reprogrammerBtn.addEventListener("click", function() {
            selectedAction = "reprogrammer";
            alert("🔄 Action sélectionnée : Reprogrammer. Vous devez maintenant appeler ou envoyer un email pour valider la mise à jour.");
        });
    } else {
        console.error("❌ ERREUR : Le bouton 'Reprogrammer' est introuvable !");
    }
    
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
        updateGoogleSheet();
    });

    document.getElementById("envoyerMailBtn").addEventListener("click", function() {
        if (!selectedAction) {
            alert("Veuillez d'abord choisir une action (Confirmer, Annuler, Reprogrammer).");
            return;
        }
        if (email !== "Non renseigné" && email.includes("@")) {
            let subject = selectedAction === "reprogrammer" ? "Rendez-vous à reprogrammer" : "Rendez-vous GTI Immobilier";
            let body = selectedAction === "reprogrammer" 
                ? "Bonjour,\n\nVotre rendez-vous doit être reprogrammé. Merci de nous contacter pour convenir d'une nouvelle date.\n\nCordialement," 
                : "Bonjour,\n\nJe vous contacte concernant votre rendez-vous.\n\nMerci,";
            let mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            window.open(mailtoLink, "_blank");
            updateGoogleSheet();
        } else {
            alert("📧 Adresse e-mail non valide ou indisponible");
        }
    });
});
