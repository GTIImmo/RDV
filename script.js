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

        let idEmailParam = params.get("idEmail");

        if (!idEmailParam) {
            alert("❌ Erreur : Impossible d'envoyer la modification !");
            return;
        }

        // URL du script Google Apps Script avec sécurisation (ID Email uniquement)
        let url = `https://script.google.com/macros/s/AKfycbzpN_4u3vKwkW_7J5paCHIxiaImzXjUJFVe-4ablUsKUefwoWK-PRDYByY12JEz9qsV/exec?action=${action}&idEmail=${encodeURIComponent(idEmailParam)}`;
        fetch(url)
            .then(response => response.text())
            .then(result => {
                alert(result);
                location.reload();
            })
            .catch(error => console.error("❌ Erreur : ", error));
    }

    // Récupération et affichage des informations du lead
    let prenom = getParamValue("prenom");
    let nom = getParamValue("nom");
    let rdvDate = getParamValue("rdv");
    let telephone = formatPhoneNumber(getParamValue("telephone"));
    let email = getParamValue("email");

    document.getElementById("nom").textContent += ` ${nom}`;
    document.getElementById("prenom").textContent += ` ${prenom}`;
    document.getElementById("rdv").textContent += ` ${rdvDate}`;
    document.getElementById("statutRDV").textContent += ` ${getParamValue("statutRDV")}`;

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

    // Gestion de la confirmation et annulation du RDV avec vérification par ID Email
    document.getElementById("confirmerBtn").addEventListener("click", function() {
        updateGoogleSheet("confirmer");
    });

    document.getElementById("annulerBtn").addEventListener("click", function() {
        updateGoogleSheet("annuler");
    });

    // Gestion de l'affichage du menu déroulant et des boutons de la boîte modale
    const emailModal = document.getElementById("emailModal");
    const emailOptions = document.getElementById("emailOptions");
    const fermerModal = document.getElementById("fermerModal");

    document.getElementById("envoyerMailBtn").addEventListener("click", function() {
        if (email !== "Non renseigné") {
            emailModal.style.display = "flex";
            emailOptions.style.display = "block";
        } else {
            alert("📧 Adresse e-mail non disponible");
        }
    });

    fermerModal.addEventListener("click", function() {
        emailModal.style.display = "none";
        emailOptions.style.display = "none";
    });

    document.getElementById("envoyerMailFinal").addEventListener("click", function() {
        let emailType = document.getElementById("emailType").value;
        let subject, body;

        if (emailType === "confirmation") {
            subject = `Confirmation de votre rendez-vous - ${prenom}`;
            body = `Bonjour ${prenom},\n\nNous confirmons votre rendez-vous prévu le ${rdvDate}.\n\n📍 Lieu : [Adresse ou lien visio]\n\nÀ bientôt !\nGTI Immobilier`;
        } else if (emailType === "annulation") {
            subject = `Annulation de votre rendez-vous - ${prenom}`;
            body = `Bonjour ${prenom},\n\nVotre rendez-vous prévu le ${rdvDate} a été annulé.\n\nSi vous souhaitez reprogrammer, contactez-nous.\n\nCordialement,\nGTI Immobilier`;
        } else {
            subject = `Reprogrammons votre rendez-vous - ${prenom}`;
            body = `Bonjour ${prenom},\n\nVotre rendez-vous initialement prévu le ${rdvDate} ne pourra pas avoir lieu.\n\nContactez-nous pour fixer une nouvelle date.\n\nCordialement,\nGTI Immobilier`;
        }

        let gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(gmailLink, "_blank");

        emailModal.style.display = "none";
        emailOptions.style.display = "none";
    });
});
