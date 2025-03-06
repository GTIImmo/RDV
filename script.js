document.addEventListener("DOMContentLoaded", function() {
    const params = new URLSearchParams(window.location.search);

    function getParamValue(key) {
        return params.has(key) ? decodeURIComponent(params.get(key).replace(/\+/g, ' ')) : "Non renseigné";
    }

    function formatPhoneNumber(number) {
        if (!number || number === "Non renseigné") return "Non renseigné";
        let cleaned = number.replace(/[^0-9]/g, "");
        return cleaned.length === 9 ? "0" + cleaned : cleaned.length === 10 ? cleaned : "Non renseigné";
    }

    function updateGoogleSheet(action) {
        if (!confirm("Confirmer cette action ?")) return;

        let rowParam = params.get("row");
        if (!rowParam) {
            alert("❌ Erreur : Impossible d'envoyer la modification !");
            return;
        }

        let url = `https://script.google.com/macros/s/AKfycbzpN_4u3vKwkW_7J5paCHIxiaImzXjUJFVe-4ablUsKUefwoWK-PRDYByY12JEz9qsV/exec?action=${action}&row=${rowParam}`;

        fetch(url)
            .then(response => response.text())
            .then(result => {
                alert(result);
                location.reload();
            })
            .catch(error => console.error("❌ Erreur : ", error));
    }

    // Récupération des informations du lead
    document.getElementById("nom").textContent += ` ${getParamValue("nom")}`;
    document.getElementById("prenom").textContent += ` ${getParamValue("prenom")}`;
    document.getElementById("rdv").textContent += ` ${getParamValue("rdv")}`;
    document.getElementById("statutRDV").textContent += ` ${getParamValue("statutRDV")}`;

    let telephone = formatPhoneNumber(getParamValue("telephone"));
    let email = getParamValue("email");

    // Affichage du téléphone et email si disponibles
    if (telephone !== "Non renseigné") {
        document.getElementById("telephone").style.display = "block";
        document.getElementById("phoneNumber").textContent = telephone;
    }

    if (email !== "Non renseigné") {
        document.getElementById("email").style.display = "block";
        document.getElementById("emailAddress").textContent = email;
    }

    // Gestion de l'appel
    document.getElementById("appelerBtn").addEventListener("click", function() {
        if (telephone !== "Non renseigné") {
            if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
                window.location.href = `tel:${telephone}`;
            } else {
                alert(`📞 Composez ce numéro : ${telephone}`);
            }
        } else {
            alert("📵 Numéro de téléphone non disponible");
        }
    });

    // Gestion des confirmations et annulations
    document.getElementById("confirmerBtn").addEventListener("click", function() {
        updateGoogleSheet("confirmer");
    });

    document.getElementById("annulerBtn").addEventListener("click", function() {
        updateGoogleSheet("annuler");
    });

    // Gestion de l'envoi d'email avec modèles
    const emailModal = document.getElementById("emailModal");
    const fermerModal = document.getElementById("fermerModal");

    document.getElementById("envoyerMailBtn").addEventListener("click", function() {
        if (email !== "Non renseigné") {
            emailModal.style.display = "flex";
        } else {
            alert("📧 Adresse e-mail non disponible");
        }
    });

    fermerModal.addEventListener("click", function() {
        emailModal.style.display = "none";
    });

    document.getElementById("envoyerMailFinal").addEventListener("click", function() {
        let emailType = document.getElementById("emailType").value;
        let subject, body;

        if (emailType === "confirmation") {
            subject = "Confirmation de votre rendez-vous";
            body = "Bonjour,\n\nNous confirmons votre rendez-vous pour l'estimation de votre bien immobilier. Nous restons à votre disposition pour toute information complémentaire.\n\nCordialement,\nGTI Immobilier";
        } else if (emailType === "annulation") {
            subject = "Annulation de votre rendez-vous";
            body = "Bonjour,\n\nNous vous informons que votre rendez-vous pour l'estimation de votre bien immobilier a été annulé. N'hésitez pas à nous contacter pour en fixer un autre.\n\nCordialement,\nGTI Immobilier";
        } else {
            subject = "Reprogrammation de votre rendez-vous";
            body = "Bonjour,\n\nNous vous proposons de reprogrammer votre rendez-vous pour l'estimation de votre bien immobilier. Veuillez nous indiquer votre disponibilité.\n\nCordialement,\nGTI Immobilier";
        }

        let mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoLink;
        emailModal.style.display = "none";
    });
});
