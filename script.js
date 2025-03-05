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

    function updateGoogleSheet(action) {
        if (!confirm("Confirmer cette action ?")) return;
        
        let url = `https://script.google.com/macros/s/AKfycbzpN_4u3vKwkW_7J5paCHIxiaImzXjUJFVe-4ablUsKUefwoWK-PRDYByY12JEz9qsV/exec?action=${action}&row=${params.get("row")}`;
        
        fetch(url)
            .then(response => response.text())
            .then(result => {
                console.log("✅ Réponse du serveur : " + result);
                alert(result);
                location.reload();
            })
            .catch(error => console.error("❌ Erreur :", error));
    }
    function formatPhoneNumber(number) {
        if (number === "Non renseigné" || number.length === 0) return "Non renseigné";
        return number.length === 9 ? "0" + number : number; // Ajoute le 0 devant si le numéro est à 9 chiffres
    }
    console.log("📌 Mise à jour des éléments HTML avec les valeurs récupérées :");
    document.getElementById("nom").textContent += ` ${getParamValue("nom")}`;
    document.getElementById("prenom").textContent += ` ${getParamValue("prenom")}`;
    document.getElementById("rdv").textContent += ` ${getParamValue("rdv")}`;
    document.getElementById("statutRDV").textContent += ` ${getParamValue("statutRDV")}`;

    // Gestion des événements des boutons
    document.getElementById("confirmerBtn").addEventListener("click", function() {
        updateGoogleSheet("confirmer");
    });

    document.getElementById("annulerBtn").addEventListener("click", function() {
        updateGoogleSheet("annuler");
    });

    document.getElementById("appelerBtn").addEventListener("click", function() {
        const phoneNumber = getParamValue("telephone");  // Récupération du numéro depuis l'URL
        if (phoneNumber === "Non renseigné") {
            alert("📵 Aucun numéro de téléphone disponible !");
            return;
        }
        console.log("📞 Appel vers :", phoneNumber);
        window.location.href = `tel:${phoneNumber}`;  // Ouvre l'application d'appel
    });

});
