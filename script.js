function doGet(e) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Leads Cityscan");
    var logSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Log");

    if (!logSheet) {
        logSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("Log");
        logSheet.appendRow(["Horodatage", "Paramètres reçus", "Nouvelle Date", "Action", "Statut"]);
    }

    logSheet.appendRow([new Date(), "📌 Script doGet(e) exécuté", JSON.stringify(e.parameter), "", ""]);

    var idEmailParam = e.parameter.id_email;
    if (!idEmailParam) {
        logSheet.appendRow([new Date(), "❌ Erreur : ID Email non fourni", JSON.stringify(e.parameter), "", ""]);
        return ContentService.createTextOutput("❌ Erreur : ID Email non fourni").setMimeType(ContentService.MimeType.TEXT);
    }

    var allData = sheet.getDataRange().getValues();
    var header = allData[0];
    var idEmailColIndex = header.indexOf("ID Email");

    if (idEmailColIndex === -1) {
        logSheet.appendRow([new Date(), "❌ Erreur : Colonne ID Email introuvable", JSON.stringify(e.parameter), "", ""]);
        return ContentService.createTextOutput("❌ Erreur : Colonne ID Email introuvable").setMimeType(ContentService.MimeType.TEXT);
    }

    var rowIndex = -1;
    for (var i = 1; i < allData.length; i++) {
        if (allData[i][idEmailColIndex].toString().trim() === idEmailParam.trim()) {
            rowIndex = i + 1;
            break;
        }
    }

    if (rowIndex === -1) {
        logSheet.appendRow([new Date(), "❌ Erreur : ID Email non trouvé", idEmailParam, "", ""]);
        return ContentService.createTextOutput(`❌ Erreur : ID Email non trouvé (${idEmailParam})`).setMimeType(ContentService.MimeType.TEXT);
    }

    var statutColumnIndex = header.indexOf("Statut RDV");
    if (statutColumnIndex === -1) {
        logSheet.appendRow([new Date(), "❌ Erreur : Colonne 'Statut RDV' introuvable", JSON.stringify(e.parameter), "", ""]);
        return ContentService.createTextOutput("❌ Erreur : Colonne 'Statut RDV' introuvable").setMimeType(ContentService.MimeType.TEXT);
    }

    var statut = "";
    var newDate = e.parameter.rdv ? decodeURIComponent(e.parameter.rdv) : "";

    logSheet.appendRow([new Date(), "📥 Reçu `rdv`", newDate, e.parameter.action, "Avant enregistrement"]);

    if (e.parameter.action === "confirmer") {
        statut = "Confirmé";
    } else if (e.parameter.action === "annuler") {
        statut = "Annulé";
    }

    if (statut) {
        sheet.getRange(rowIndex, statutColumnIndex + 1).setValue(statut);
        logSheet.appendRow([new Date(), "✅ Statut mis à jour", newDate, e.parameter.action, statut]);
        return ContentService.createTextOutput(`✅ Statut mis à jour : ${statut}, Nouvelle Date : ${newDate || 'Aucune'}`).setMimeType(ContentService.MimeType.TEXT);
    }

    logSheet.appendRow([new Date(), "❌ Erreur : Action inconnue", JSON.stringify(e.parameter), "", ""]);
    return ContentService.createTextOutput("❌ Action inconnue ou colonne introuvable").setMimeType(ContentService.MimeType.TEXT);
}
