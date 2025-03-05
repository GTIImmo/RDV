document.addEventListener("DOMContentLoaded", function() {
    const params = new URLSearchParams(window.location.search);

    function getParamValue(key) {
        return params.has(key) ? decodeURIComponent(params.get(key).replace(/\+/g, ' ')) : "Non renseigné";
    }

    function formatDateForSheet(dateString) {
        let date = new Date(dateString);
        if (isNaN(date.getTime())) return "";
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }

    function updateGoogleSheet(action, newDate = "") {
        if (!confirm("Confirmer cette action ?")) return;

        let rowParam = params.get("row");
        if (!rowParam) {
            console.error("❌ ERREUR : row est manquant dans l'URL !");
            alert("❌ Erreur : Impossible d'envoyer la modification car row est manquant !");
            return;
        }

        let url = `https://script.google.com/macros/s/AKfycbzivTJGoBYA8oYyM9WcpKnwhV2Ok-0G2X_WPBZ961y2hds7bLDFw40V4wEknrdUPmxA/exec?action=${action}&row=${rowParam}`;
        
        if (action === "modifier") {
    if (newDate) {  // Vérifier que la nouvelle date est bien reçue
        try {
            let formattedDate = new Date(newDate);
            if (!isNaN(formattedDate.getTime())) {
                let formattedForSheet = Utilities.formatDate(formattedDate, Session.getScriptTimeZone(), "dd.MM.yyyy HH:mm");
                
                Logger.log("📌 Nouvelle date formatée pour affichage : " + formattedForSheet);

                // Mise à jour du statut avec la date reprogrammée
                let statutColumnIndex = header.indexOf("Statut RDV");
                if (statutColumnIndex !== -1) {
                    let statutFinal = `Reprogrammer ${formattedForSheet}`;
                    sheet.getRange(rowIndex, statutColumnIndex + 1).setValue(statutFinal);
                    Logger.log("✅ Statut mis à jour avec succès : " + statutFinal);
                } else {
                    Logger.log("❌ Erreur : Colonne Statut RDV introuvable.");
                }
            } else {
                Logger.log("❌ Erreur : Date invalide reçue.");
            }
        } catch (error) {
            logSheet.appendRow([new Date(), JSON.stringify(e.parameter), "Erreur format date", action, ""]);
            return ContentService.createTextOutput("❌ Erreur : Format de date invalide").setMimeType(ContentService.MimeType.TEXT);
        }
    }
}


    document.getElementById("nom").textContent += ` ${getParamValue("nom")}`;
    document.getElementById("prenom").textContent += ` ${getParamValue("prenom")}`;
    document.getElementById("rdv").textContent += ` ${getParamValue("rdv")}`;
    document.getElementById("statutRDV").textContent += ` ${getParamValue("statutRDV")}`;
    
    let telephone = getParamValue("telephone");
    let email = getParamValue("email");
    let phoneElement = document.getElementById("telephone");
    let phoneNumberElement = document.getElementById("phoneNumber");
    let emailElement = document.getElementById("email");
    let emailAddressElement = document.getElementById("emailAddress");
    
    document.getElementById("confirmerBtn").addEventListener("click", function() {
        updateGoogleSheet("confirmer");
    });
    
    document.getElementById("modifierBtn").addEventListener("click", function() {
        document.getElementById("modifierSection").style.display = "block";
    });
    
    document.getElementById("validerModifBtn").addEventListener("click", function() {
        let nouvelleDate = document.getElementById("nouvelleDate").value;
        console.log("Nouvelle date saisie :", nouvelleDate);
        if (!nouvelleDate) {
            alert("Veuillez entrer une nouvelle date.");
            return;
        }
        updateGoogleSheet("modifier", nouvelleDate);
    });
    
    document.getElementById("annulerBtn").addEventListener("click", function() {
        updateGoogleSheet("annuler");
    });

    document.getElementById("appelerBtn").addEventListener("click", function() {
        if (telephone !== "Non renseigné") {
            phoneElement.style.display = "block";
            phoneNumberElement.textContent = telephone;
            if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
                window.location.href = `tel:${telephone}`;
            } else {
                alert(`📞 Composez ce numéro : ${telephone}`);
            }
        } else {
            alert("📵 Numéro de téléphone non disponible");
        }
    });

    document.getElementById("envoyerMailBtn").addEventListener("click", function() {
        if (email !== "Non renseigné") {
            emailElement.style.display = "block";
            emailAddressElement.textContent = email;
            let mailtoLink = `mailto:${email}?subject=Rendez-vous GTI Immobilier`;
            window.location.href = mailtoLink;
        } else {
            alert("📧 Adresse e-mail non disponible");
        }
    });
});
