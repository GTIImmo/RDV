document.addEventListener("DOMContentLoaded", function() { 
    const params = new URLSearchParams(window.location.search);
    console.log("🔍 Paramètres URL détectés :", params.toString());
    
    function getParamValue(key) {
        if (!params.has(key)) return "Non renseigné";
        let value = params.get(key);
        try {
            return decodeURIComponent(value.replace(/\+/g, ' '));
        } catch (e) {
            console.error("❌ Erreur de décodage :", e);
            return value;
        }
    }

    function updateGoogleSheet(action, newDate = "") {
        if (!confirm("Confirmer cette action ?")) return;
        
        let url = `https://script.google.com/macros/s/AKfycbzivTJGoBYA8oYyM9WcpKnwhV2Ok-0G2X_WPBZ961y2hds7bLDFw40V4wEknrdUPmxA/exec?action=${action}&row=${params.get("row")}`;
        if (newDate) {
            url += `&rdv=${encodeURIComponent(newDate)}`;
        }
        
        fetch(url)
            .then(response => response.text())
            .then(result => {
                console.log("✅ Réponse du serveur : " + result);
                alert(result);
                location.reload();
            })
            .catch(error => console.error("❌ Erreur :", error));
    }

    document.getElementById("nom").textContent += ` ${getParamValue("nom")}`;
    document.getElementById("prenom").textContent += ` ${getParamValue("prenom")}`;
    document.getElementById("rdv").textContent += ` ${getParamValue("rdv")}`;
    document.getElementById("statutRDV").textContent += ` ${getParamValue("statutRDV")}`;

    document.getElementById("confirmerBtn").addEventListener("click", function() {
        updateGoogleSheet("confirmer");
    });
    
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
    
    document.getElementById("annulerBtn").addEventListener("click", function() {
        updateGoogleSheet("annuler");
    });
});
