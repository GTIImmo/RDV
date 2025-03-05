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
        
        let url = https://script.google.com/macros/s/AKfycbzpN_4u3vKwkW_7J5paCHIxiaImzXjUJFVe-4ablUsKUefwoWK-PRDYByY12JEz9qsV/exec?action=${action}&row=${params.get("row")}`;    
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
    
    document.getElementById("annulerBtn").addEventListener("click", function() {
        updateGoogleSheet("annuler");
    });
});
