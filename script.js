document.addEventListener("DOMContentLoaded", function() {
    const params = new URLSearchParams(window.location.search);

    function getParamValue(key) {
        return params.has(key) ? document.addEventListener("DOMContentLoaded", function() {
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

        let url = `https://script.google.com/macros/s/AKfycbwIEE9aQJIZgI8zslInIt_5ZZz1wl_IANeb2GNuXszLjB-a9WRWQFkT0AiAbzH6eXaH/exec?action=${action}&row=${rowParam}`;
        
        if (newDate) {
            let formattedDate = formatDateForSheet(newDate);
            url += `&RDV=${encodeURIComponent(formattedDate)}`;
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
    
    function formatPhoneNumber(number) {
        if (!number || number === "Non renseigné") return "Non renseigné";
        let cleaned = number.replace(/[^0-9]/g, "");
        if (cleaned.length === 9) {
            return "0" + cleaned; // Ajouter un zéro devant si le numéro fait 9 chiffres
        }
        return cleaned;
    }
    
    let telephone = formatPhoneNumber(getParamValue("telephone"));
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
});(params.get(key).replace(/\+/g, ' ')) : "Non renseigné";
    }

    function formatPhoneNumber(number) {
        if (number === "Non renseigné" || number.length === 0) return "Non renseigné";
        return number.length === 9 ? "0" + number : number; // Ajoute le 0 devant si le numéro est à 9 chiffres
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
