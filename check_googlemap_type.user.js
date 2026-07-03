// ==UserScript==
// @name         Google Maps iframe checker
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Sprawdza, czy strona zawiera iframe z Google Maps
// @author       bkmiecik
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let lastState = null;
    let timeout = null;

    function check() {
        const iframes = document.querySelectorAll("iframe");

        let found = false;
        let matches = [];

        for (const f of iframes) {
            const src = f.src || "";
            if (/google\.[^/]*\/maps|maps\.google/i.test(src)) {
                found = true;
                matches.push(src);
            }
        }

        const state = found ? "FOUND" : "NOT_FOUND";

        // ⛔ log tylko jak zmienił się stan
        if (state !== lastState) {
            lastState = state;

            if (found) {
                console.log("✅ Google Maps iframe wykryty", matches);
            } else {
                console.log("❌ Brak Google Maps iframe");
            }
        }
    }

    function debouncedCheck() {
        clearTimeout(timeout);
        timeout = setTimeout(check, 300);
    }

    check();

    const obs = new MutationObserver(debouncedCheck);
    obs.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();