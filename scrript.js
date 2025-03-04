document.addEventListener("DOMContentLoaded", function() {
    const params = new URLSearchParams(window.location.search);
    
    function getParamValue(key) {
        return params.has(key) ? decodeURIComponent(params.get(key)) : "Non renseigné";
    }

    function updateGoogleSheet(action, newDate = "") {
        if (!confirm("Confirmer cette action ?")) return;
        
        let url = `https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?action=${action}&row=${params.get("row")}`;
        if (newDate) url += `&rdv=${encodeURIComponent(newDate)}`;
        
        fetch(url)
            .then(response => response.text())
            .then(result => {
                alert(result);
                location.reload();
            })
            .catch(error => console.error("❌ Erreur :", error));
    }

    document.getElementById("nom").textContent = `👤 Nom : ${getParamValue("nom")}`;
    document.getElementById("prenom").textContent = `🆔 Prénom : ${getParamValue("prenom")}`;
    document.getElementById("rdv").textContent = `📅 Date RDV : ${getParamValue("rdv")}`;
    document.getElementById("statutRDV").textContent = `📆 Statut : ${getParamValue("statutRDV")}`;

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
