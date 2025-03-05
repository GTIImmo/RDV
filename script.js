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

    function updateGoogleSheet(action, newDate = "") {
        if (!confirm("Confirmer cette action ?")) return;
        
        let url = `https://script.google.com/macros/s/AKfycbzpN_4u3vKwkW_7J5paCHIxiaImzXjUJFVe-4ablUsKUefwoWK-PRDYByY12JEz9qsV/exec?action=${action}&row=${params.get("row")}`;
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
    
    let telephone = formatPhoneNumber(getParamValue("telephone"));
    let email = getParamValue("email");
    let phoneElement = document.getElementById("telephone");
    let phoneNumberElement = document.getElementById("phoneNumber");
    let emailElement = document.getElementById("email");
    let emailAddressElement = document.getElementById("emailAddress");

    // Boutons de gestion Google Sheets
    document.getElementById("confirmerBtn").addEventListener("click", function() {
        updateGoogleSheet("confirmer");
    });

    document.getElementById("annulerBtn").addEventListener("click", function() {
        updateGoogleSheet("annuler");
    });

    // Bouton "Appeler"
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

    // Bouton "Envoyer Email"
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
