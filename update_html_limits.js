const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// The block to clone
const limitStartIdx = html.indexOf('<div class="glass-card rounded-2xl p-5 space-y-4" id="limits-add-funds-section">');
// Find the closing div of this block. It ends right before "<!-- Trending Carousel / Grid -->" but since we moved the modal, let's just find the exact end index.
let blockEndIdx = html.indexOf('</div>\n                    </div>\n\n                    <!-- Trending Carousel / Grid -->');

if (limitStartIdx > -1 && blockEndIdx > -1) {
    let limitsHTML = html.substring(limitStartIdx, blockEndIdx + 12); // include </div></div>
    
    // Replace IDs to avoid duplicates but keep them targeted by app.js if needed.
    limitsHTML = limitsHTML.replace('id="limits-add-funds-section"', 'id="port-limits-add-funds-section"')
                           .replace('id="lim-avail-margin"', 'id="port-clone-lim-avail-margin"')
                           .replace('id="lim-margin-used"', 'id="port-clone-lim-margin-used"')
                           .replace('id="lim-cash-bal"', 'id="port-clone-lim-cash-bal"')
                           .replace('id="lim-collateral"', 'id="port-clone-lim-collateral"');
                           
    // For the add-funds button, we will replace the ID and add the onclick handler so it works globally
    limitsHTML = limitsHTML.replace('id="add-funds-btn"', 'id="port-add-funds-btn" onclick="document.getElementById(\'add-funds-modal\').style.display=\'flex\'; document.getElementById(\'add-funds-modal\').classList.remove(\'hidden\'); if(typeof lucide !== \'undefined\') lucide.createIcons();"');

    // Insert it into view-portfolio
    const portfolioHeaderEnd = 'Run AI Portfolio Doctor\n                            </button>\n                        </div>\n                    </div>';
    
    if (html.includes(portfolioHeaderEnd)) {
        html = html.replace(portfolioHeaderEnd, portfolioHeaderEnd + '\n\n                    <!-- Portfolio Limits (Cloned from Home) -->\n                    ' + limitsHTML);
        fs.writeFileSync('index.html', html);
        console.log("Cloned limits successfully!");
    } else {
        console.log("Could not find portfolio insertion point");
    }
} else {
    console.log("Could not find limits block");
}
