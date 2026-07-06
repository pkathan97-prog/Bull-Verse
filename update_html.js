const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Move Modal
const modalStartStr = '<!-- Add Funds Modal -->';
const modalEndStr = '</div>\n\n                    <!-- Trending Carousel / Grid -->';
let modalStartIdx = html.indexOf(modalStartStr);
let modalEndIdx = html.indexOf(modalEndStr);

if (modalStartIdx > -1 && modalEndIdx > -1) {
    const modalHTML = html.substring(modalStartIdx, modalEndIdx + 6); // include '</div>'
    // Remove from old location
    html = html.substring(0, modalStartIdx) + html.substring(modalEndIdx + 6);
    // Add before closing body
    html = html.replace('</body>', '\n' + modalHTML + '\n</body>');
    console.log("Moved modal");
} else {
    console.log("Could not find modal markers");
}

// 2. Clone Limits section into Portfolio
const limitsMatch = html.match(/<div class="glass-card rounded-2xl p-5 mt-6 mb-8 border border-white\/5 space-y-4">[\s\S]*?<\/div>\n                    <\/div>/);
if (limitsMatch) {
    let limitsHTML = limitsMatch[0];
    limitsHTML = limitsHTML.replace('id="lim-avail-margin"', 'id="port-lim-avail-margin"')
                           .replace('id="lim-margin-used"', 'id="port-lim-margin-used"')
                           .replace('id="lim-cash-bal"', 'id="port-lim-cash-bal"')
                           .replace('id="lim-collateral"', 'id="port-lim-collateral"')
                           .replace('id="add-funds-btn"', 'onclick="document.getElementById(\'add-funds-modal\').style.display=\'flex\'; document.getElementById(\'add-funds-modal\').classList.remove(\'hidden\'); if(typeof lucide !== \'undefined\') lucide.createIcons();"');

    const portfolioHeaderEnd = 'Run AI Portfolio Doctor\n                            </button>\n                        </div>\n                    </div>';
    html = html.replace(portfolioHeaderEnd, portfolioHeaderEnd + '\n\n                    <!-- Portfolio Limits (Cloned from Home) -->\n                    ' + limitsHTML);
    console.log("Cloned limits");
} else {
    console.log("Could not find limits block");
}

fs.writeFileSync('index.html', html);
console.log("Done");
