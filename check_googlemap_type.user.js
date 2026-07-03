// ==UserScript==
// @name         Google Maps iframe checker
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Sprawdza, czy strona zawiera iframe z Google Maps
// @author       bkmiecik
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    function isGoogleMaps(src) {
        return /google\.[^/]*\/maps|maps\.google|google\.[^/]*\/maps\/embed/i.test(src);
    }

    function check() {
        const iframes = document.querySelectorAll("iframe");

        console.log("IFRAMES:", iframes.length);

        let found = false;

        iframes.forEach(f => {
            console.log("SRC:", f.src);

            if (f.src && isGoogleMaps(f.src)) {
                console.log("✅ GOOGLE MAPS FOUND:", f);
                found = true;
            }
        });

        if (!found) {
            console.log("❌ brak Google Maps iframe");
        }
    }

    // pierwsze sprawdzenie
    check();

    // obserwuj dynamiczne zmiany
    const obs = new MutationObserver(() => check());
    obs.observe(document.documentElement, { childList: true, subtree: true });

})();