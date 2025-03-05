document.addEventListener("DOMContentLoaded", function() {
    const params = new URLSearchParams(window.location.search);

    function getParamValue(key) {
        return params.has(key) ? decodeURIComponent(params.get(key).replace(/\+/g, ' ')) : "Non renseigné";
    }

    function formatDateForSheet(dateString) {
        let date = new Date(dateString);
        if (isNaN(date.getTime())) return "";
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }

    function formatPhoneNumber(phone) {
        if (phone.length === 9) {
            return '0' + phone;
        }
        return phone;
    }

    function updateGoogleSheet(action, newDate = "") {
        if (!confirm("Confirmer cette action ?")) return;

        let rowParam = params.get("row");
        if (!rowParam) {
            console.error("❌ ERREUR : row est manquant dans l'URL !");
            alert("❌ Erreur : Impossible d'envoyer la modification car row est manquant !");
            return;
        }

        let url = `https://script.google.com/macros/s/AKfycbzivTJGoBYA8oYyM9WcpKnwhV2Ok-0G2X_WPBZ961y2hds7bLDFw40V4wEknrdUPmxA/exec/exec?action=${action}&row=${rowParam}`;
        
        if (newDate) {
            let formattedDate = formatDateForSheet(newDate);
            url += `&rdv=${encodeURIComponent(formattedDate)}`;
        }

        console.log("📡 URL envoyée : " + url);

        fetch(url)
            .then(response => response.text())
            .then(result => {
                console.log("✅ Réponse du serveur : " + result);
                alert(result);
                document.getElementById("notificationSection").style.display = "block";
            })
            .catch(error => console.error("❌ Erreur : ", error));
    }

    document.getElementById("nom").textContent += ` ${getParamValue("nom")}`;
    document.getElementById("prenom").textContent += ` ${getParamValue("prenom")}`;
    document.getElementById("rdv").textContent += ` ${getParamValue("rdv")}`;
    document.getElementById("statutRDV").textContent += ` ${getParamValue("statutRDV")}`;
    
    let numeroLead = formatPhoneNumber(getParamValue("telephone"));
    let emailLead = getParamValue("email");
    let nomLead = getParamValue("nom");
    let prenomLead = getParamValue("prenom");
    let dateRdv = getParamValue("rdv");

    function sendEmail() {
        let subject = "";
        let body = "";
        
        if (statutAction === "confirmer") {
            subject = `Confirmation de votre rendez-vous`;
            body = `Bonjour ${prenomLead},%0D%0A%0D%0AJe vous confirme votre rendez-vous prévu le ${dateRdv}.%0D%0A%0D%0AÀ très bientôt,%0D%0AL'équipe GTI Immobilier`;
        } else if (statutAction === "modifier") {
            subject = `Reprogrammation de votre rendez-vous`;
            body = `Bonjour ${prenomLead},%0D%0A%0D%0AVotre rendez-vous a été reprogrammé. Nous reviendrons vers vous pour une nouvelle date.%0D%0A%0D%0ACordialement,%0D%0AL'équipe GTI Immobilier`;
        } else if (statutAction === "annuler") {
            subject = `Annulation de votre rendez-vous`;
            body = `Bonjour ${prenomLead},%0D%0A%0D%0ANous sommes désolés de vous informer que votre rendez-vous du ${dateRdv} a été annulé.%0D%0A%0D%0AN'hésitez pas à nous recontacter pour fixer un autre rendez-vous.%0D%0A%0D%0ACordialement,%0D%0AL'équipe GTI Immobilier`;
        }
        
        window.location.href = `mailto:${emailLead}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }

    function callLead() {
        if (/Mobi|Android/i.test(navigator.userAgent)) {
            window.location.href = `tel:${numeroLead}`;
        } else {
            alert(`📞 Numéro du lead : ${numeroLead}`);
        }
    }

    document.getElementById("confirmerBtn").addEventListener("click", function() {
        updateGoogleSheet("confirmer");
    });
    
    document.getElementById("modifierBtn").addEventListener("click", function() {
        updateGoogleSheet("modifier");
    });
    
    document.getElementById("annulerBtn").addEventListener("click", function() {
        updateGoogleSheet("annuler");
    });
    
    document.getElementById("emailBtn").addEventListener("click", sendEmail);
    document.getElementById("appelerBtn").addEventListener("click", callLead);
});
