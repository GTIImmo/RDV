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

        let url = `https://script.google.com/macros/s/AKfycbzivTJGoBYA8oYyM9WcpKnwhV2Ok-0G2X_WPBZ961y2hds7bLDFw40V4wEknrdUPmxA/exec?action=${action}&row=${rowParam}`;

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
        let subject = emailType === "confirmation" ? "Confirmation de votre rendez-vous" : emailType === "annulation" ? "Annulation de votre rendez-vous" : "Reprogrammation de votre rendez-vous";
        let body = `Bonjour,\n\nNous vous informons que ${subject.toLowerCase()}.\n\nCordialement,\nGTI Immobilier`;

        window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        emailModal.style.display = "none";
    });
});
