document.addEventListener("DOMContentLoaded", function() {
    console.log("📢 Début de l'exécution du script...");

    const params = new URLSearchParams(window.location.search);

    function getParamValue(key) {
        return params.has(key) ? decodeURIComponent(params.get(key).replace(/\+/g, ' ')) : "Non renseigné";
    }

    function formatPhoneNumber(number) {
        if (!number || number === "Non renseigné") return "Non renseigné";
        let cleaned = number.replace(/[^0-9]/g, "");
        return cleaned.length === 9 ? "0" + cleaned : cleaned.length === 10 ? cleaned : "Non renseigné";
    }

    function safeGetElement(id) {
        let elem = document.getElementById(id);
        console.log(`🔎 Vérification de ${id} :`, elem ? "✅ Trouvé" : "❌ Introuvable");
        return elem;
    }

    function updateGoogleSheet(action) {
        if (!confirm("Confirmer cette action ?")) return;

        let idEmailParam = getParamValue("id_email");
        console.log("🔍 ID Email envoyé :", idEmailParam);

        if (!idEmailParam) {
            alert("❌ Erreur : Impossible d'envoyer la modification !");
            return;
        }

        let url = `https://script.google.com/macros/s/AKfycbzpN_4u3vKwkW_7J5paCHIxiaImzXjUJFVe-4ablUsKUefwoWK-PRDYByY12JEz9qsV/exec?action=${action}&id_email=${idEmailParam}`;

        console.log("📡 URL envoyée :", url);

        fetch(url)
            .then(response => response.text())
            .then(result => {
                console.log("✅ Réponse reçue :", result);
                alert(result);
                location.reload();
            })
            .catch(error => console.error("❌ Erreur Fetch :", error));
    }

    let prenom = getParamValue("prenom");
    let nom = getParamValue("nom");
    let rdvDate = getParamValue("rdv");
    let telephone = formatPhoneNumber(getParamValue("telephone"));
    let email = getParamValue("email");

    let nomElement = safeGetElement("nom");
    let prenomElement = safeGetElement("prenom");
    let rdvElement = safeGetElement("rdv");
    let statutElement = safeGetElement("statutRDV");

    if (nomElement) nomElement.textContent += ` ${nom}`;
    if (prenomElement) prenomElement.textContent += ` ${prenom}`;
    if (rdvElement) rdvElement.textContent += ` ${rdvDate}`;
    if (statutElement) statutElement.textContent += ` ${getParamValue("statutRDV")}`;

    if (telephone !== "Non renseigné") {
        let telElement = safeGetElement("telephone");
        let phoneNumberElement = safeGetElement("phoneNumber");
        if (telElement) telElement.style.display = "block";
        if (phoneNumberElement) phoneNumberElement.textContent = telephone;
    }

    if (email !== "Non renseigné") {
        let emailElement = safeGetElement("email");
        let emailAddressElement = safeGetElement("emailAddress");
        if (emailElement) emailElement.style.display = "block";
        if (emailAddressElement) emailAddressElement.textContent = email;
    }

    let appelerBtn = safeGetElement("appelerBtn");
    if (appelerBtn) {
        appelerBtn.addEventListener("click", function() {
            console.log("✅ Bouton APPELER cliqué !");
        });
    }

    let confirmerBtn = safeGetElement("confirmerBtn");
    if (confirmerBtn) {
        confirmerBtn.addEventListener("click", function() {
            console.log("✅ Bouton CONFIRMER cliqué !");
            updateGoogleSheet("confirmer");
        });
    }

    let annulerBtn = safeGetElement("annulerBtn");
    if (annulerBtn) {
        annulerBtn.addEventListener("click", function() {
            console.log("✅ Bouton ANNULER cliqué !");
            updateGoogleSheet("annuler");
        });
    }
});
