// ==UserScript==
// @name         GA Tag & Index Status Checker
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Wyświetla tagi Google Analytics (UA-, G-, GTM-) oraz status indeksowania strony (index/noindex)
// @author       bkmiecik
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    window.addEventListener('load', () => {
        const footer = document.querySelector('footer');

        const footerText = (footer?.innerText || '').toLowerCase();

        if (
            !footer ||
            !(
                footerText.includes('wenet') ||
                footerText.includes('csgroup.pl') ||
                footerText.includes('pkt.pl')
            )
        ) return;

        const html = document.documentElement.innerHTML;

        // Szukanie tagów analitycznych
        const regex = /(UA-\d{4,}-\d+|GTM-\w+|G-\w+)/g;
        const matches = [...html.matchAll(regex)].map(m => m[0]);
        const unikalneTagi = [...new Set(matches)];

        // Sprawdzanie meta name="robots"
        let indeksowanie = 'brak tagu — domyślnie: index, follow';
        const robotsMeta = document.querySelector('meta[name="robots"]');

        if (robotsMeta && robotsMeta.content) {
            const content = robotsMeta.content.toLowerCase();
            if (content.includes('noindex')) {
                indeksowanie = 'noindex';
            } else {
                indeksowanie = 'index';
            }
        }

        // Tworzenie kontenera
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '100px';
        container.style.left = '-220px';
        container.style.width = '240px';
        container.style.backgroundColor = '#1a1a1a';
        container.style.color = '#00ff88';
        container.style.padding = '10px';
        container.style.borderRight = '2px solid #00ff88';
        container.style.fontSize = '13px';
        container.style.fontFamily = 'monospace';
        container.style.zIndex = '99999';
        container.style.boxShadow = '2px 2px 5px rgba(0,0,0,0.3)';
        container.style.maxHeight = '90vh';
        container.style.overflowY = 'auto';
        container.style.transition = 'left 0.3s ease';

        // Wysuwanie przy najechaniu
        container.addEventListener('mouseenter', () => {
            container.style.left = '0px';
        });

        container.addEventListener('mouseleave', () => {
            container.style.left = '-220px';
        });

        // Tytuł
        const title = document.createElement('div');
        title.textContent = '🔍 Tagi analityczne';
        title.style.fontWeight = 'bold';
        title.style.marginBottom = '6px';
        container.appendChild(title);

        // Tagi
        if (unikalneTagi.length > 0) {
            unikalneTagi.forEach(tag => {
                const p = document.createElement('div');
                p.textContent = tag;
                container.appendChild(p);
            });
        } else {
            const p = document.createElement('div');
            p.textContent = 'Brak tagów';
            container.appendChild(p);
        }

        // Separator
        const divider = document.createElement('hr');
        divider.style.borderColor = '#00ff88';
        container.appendChild(divider);

        // Index info
        const indexInfo = document.createElement('div');
        const ikona = indeksowanie.includes('noindex') ? '🚫' : '✅';
        indexInfo.innerHTML = `${ikona} <b>Index status:</b><br>${indeksowanie}`;
        container.appendChild(indexInfo);

        document.body.appendChild(container);
    });
})();
