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

    // Récupération et affichage des informations du lead
    document.getElementById("nom").textContent += ` ${getParamValue("nom")}`;
    document.getElementById("prenom").textContent += ` ${getParamValue("prenom")}`;
    document.getElementById("rdv").textContent += ` ${getParamValue("rdv")}`;
    document.getElementById("statutRDV").textContent += ` ${getParamValue("statutRDV")}`;

    let telephone = formatPhoneNumber(getParamValue("telephone"));
    let email = getParamValue("email");

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

    // Gestion de la confirmation et annulation du RDV
    document.getElementById("confirmerBtn").addEventListener("click", function() {
        updateGoogleSheet("confirmer");
    });

    document.getElementById("annulerBtn").addEventListener("click", function() {
        updateGoogleSheet("annuler");
    });

    // Gestion de l'envoi d'e-mail avec sélection du modèle
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
        subject = "Confirmation de votre rendez-vous d'estimation";
        body = "Bonjour [Prénom],\n\nNous vous confirmons votre rendez-vous pour l'estimation de votre bien immobilier.\n\n" +
               "📅 Date et heure : [Date du RDV]\n📍 Lieu : [Adresse ou lien visio si applicable]\n\n" +
               "Lors de cet échange, nous affinerons votre estimation en fonction des spécificités de votre bien et des tendances actuelles du marché.\n\n" +
               "Si vous avez des documents utiles (plan, acte de propriété, diagnostics...), n’hésitez pas à les préparer.\n\n" +
               "📞 Besoin de nous contacter ? Vous pouvez nous joindre au [Numéro de téléphone de l’agence].\n\n" +
               "À très bientôt !\nGTI Immobilier";
    } else if (emailType === "annulation") {
        subject = "Annulation de votre rendez-vous d'estimation";
        body = "Bonjour [Prénom],\n\nNous vous informons que votre rendez-vous d'estimation prévu le [Date du RDV] a été annulé.\n\n" +
               "Si vous souhaitez reprogrammer une nouvelle date, nous restons à votre disposition pour convenir d’un nouveau créneau.\n\n" +
               "📅 Proposer un nouvel horaire ? Répondez simplement à cet e-mail ou contactez-nous directement au [Numéro de téléphone de l’agence].\n\n" +
               "Nous restons à votre écoute pour toute question.\n\nCordialement,\nGTI Immobilier";
    } else {
        subject = "Reprogrammons ensemble votre rendez-vous d’estimation";
        body = "Bonjour [Prénom],\n\nNous revenons vers vous concernant votre demande d'estimation immobilière.\n\n" +
               "Votre rendez-vous initialement prévu le [Date du RDV] ne pourra pas avoir lieu à cette date.\n" +
               "Nous souhaitons échanger avec vous afin de **trouver ensemble un créneau qui vous convient**.\n\n" +
               "📞 Pour convenir d’une nouvelle date, contactez-nous :\n" +
               "- Par téléphone : [Numéro de l’agence]\n" +
               "- Par e-mail : [Adresse e-mail de l’agence]\n\n" +
               "Nous restons à votre disposition pour toute question et nous serions ravis d’échanger avec vous prochainement.\n\n" +
               "Cordialement,\nGTI Immobilier";
    }

    let mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
        window.location.href = mailtoLink;
    } else {
        let gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(gmailLink, "_blank");
    }

    emailModal.style.display = "none";
});

