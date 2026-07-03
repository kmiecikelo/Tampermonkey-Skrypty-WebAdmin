// ==UserScript==
// @name         Google Maps iframe checker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Sprawdza, czy strona zawiera iframe z Google Maps
// @author       bkmiecik
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    function checkGoogleMapsIframe() {
        const iframes = document.querySelectorAll('iframe');

        let found = false;

        iframes.forEach(iframe => {
            const src = iframe.src || "";

            if (
                src.includes("google.com/maps") ||
                src.includes("maps.google.com") ||
                src.includes("google.com/maps/embed")
            ) {
                console.log("✅ Znaleziono iframe Google Maps:", iframe);
                found = true;
            }
        });

        if (!found) {
            console.log("❌ Brak iframe Google Maps.");
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", checkGoogleMapsIframe);
    } else {
        checkGoogleMapsIframe();
    }
})();