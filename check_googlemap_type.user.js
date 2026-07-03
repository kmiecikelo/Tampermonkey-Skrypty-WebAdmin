// ==UserScript==
// @name         Google Maps iframe checker
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Sprawdza, czy strona zawiera iframe z Google Maps
// @author       bkmiecik
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    function createBox() {
        const box = document.createElement("div");
        box.id = "gm-detector-box";
        box.style.cssText = `
            position: fixed;
            bottom: 10px;
            right: 10px;
            z-index: 999999;
            padding: 10px 12px;
            font-size: 13px;
            font-family: Arial, sans-serif;
            background: rgba(0,0,0,0.85);
            color: white;
            border-radius: 6px;
            max-width: 280px;
        `;
        document.body.appendChild(box);
        return box;
    }

    const box = createBox();

    function log(message, data) {
        console.log(message, data || "");
    }

    function setStatus(text, ok, details = null) {
        box.textContent = text;
        box.style.border = ok ? "1px solid #2ecc71" : "1px solid #e74c3c";

        log(text, details);
    }

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

        if (found) {
            setStatus("✅ Google Maps iframe wykryty", true, matches);
        } else {
            setStatus("❌ Brak Google Maps iframe", false, iframes.length);
        }
    }

    check();

    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { childList: true, subtree: true });
})();