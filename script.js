function updateGoogleSheet(action, newDate = "") {
    if (!confirm("Confirmer cette action ?")) return;

    let rowParam = params.get("row");
    if (!rowParam) {
        console.error("❌ ERREUR : row est manquant dans l'URL !");
        alert("❌ Erreur : Impossible d'envoyer la modification car row est manquant !");
        return;
    }

    let url = `https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?action=${action}&row=${rowParam}`;
    
    if (newDate) {
        let formattedDate = formatDateForSheet(newDate);
        url += `&rdv=${encodeURIComponent(formattedDate)}`;
    }

    console.log("📡 URL envoyée : " + url); // Ajoute un log pour voir si `rdv` est bien envoyé

    fetch(url)
        .then(response => response.text())
        .then(result => {
            console.log("✅ Réponse du serveur : " + result);
            alert(result);
            location.reload();
        })
        .catch(error => console.error("❌ Erreur : ", error));
}
