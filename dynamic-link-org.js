// ============================================
// Helper Functions (declared outside if block)
// ============================================
var applySmartScriptURL = function(element, afDpValue, baseURL) {
    var afDpDecoded = afDpValue;
    try {
        afDpDecoded = decodeURIComponent(afDpValue);
    } catch (e) {
        // keep original value if malformed URI component
    }

    afDpDecoded = afDpDecoded
    .replace(/&amp;amp;/g, '&')
    .replace(/&amp;/g, '&');

    var DpvalueEncode = encodeURIComponent(afDpDecoded);
 
    var finalURL = baseURL + '&af_dp=' + DpvalueEncode;
    element.href =  finalURL;
    console.log('[SmartScript] Applied:', element.id || 'no-id', '→', afDpValue);
};
 
var extractDeepLink = function(url) {
    if (!url) return null;
    try {
        var parsedURL = new URL(url, window.location.href);
        var uriParam = parsedURL.searchParams.get('URI');
        if (uriParam) {
            return decodeURIComponent(uriParam);
        }
    } catch (e) {
        // fallback to regex parsing for non-standard URLs
    }
    // Pattern 1: URI parameter (e.g., ?URI=scbeasy://...)
    var uriMatch = url.match(/[?&]URI=([^&]+)/);
    if (uriMatch) {
        return decodeURIComponent(uriMatch[1]);
    }
    // Pattern 2: Direct scbeasy:// scheme
    if (url.indexOf('scbeasy://') === 0) {
        return url.split('&')[0];
    }
    // Pattern 3: Direct scb:// scheme
    if (url.indexOf('scb://') === 0) {
        return url.split('&')[0];
    }
    return null;
};
 
// ============================================
// Main Logic
// ============================================
if (AF_SMART_SCRIPT_RESULT) {
    var baseURL = AF_SMART_SCRIPT_RESULT.clickURL;
    baseURL = baseURL.replace(/&af_dp=[^&]*/g, '');
    var processedElements = [];
    // ============================================
    // PRIORITY 1: Known Widget IDs (most reliable)
    // ============================================
    var deeplinkMap = {
        // ----- Header & Navigation -----
        'nav_header': 'scbeasy://',
        'quick_link': 'scbeasy://',
        // ----- Hero Banner -----
        'hero_banner_btn': 'scbeasy://mutualfunds',
        'hero_btn': 'scbeasy://mutualfunds',
        // ----- Anchor Tab -----
        'anchor_tab_btn': 'scbeasy://mutualfunds',
        // ----- App Download -----
        'rte_easy_download_ios': 'scbeasy://',
        'rte_easy_download_google': 'scbeasy://',
        // ----- S&P 500 Funds -----
        'rte_fund_sp500_btn': 'scbeasy://mutualfunds/discover/SCBS&P500',
        'rte_fund_sp500a_btn': 'scbeasy://mutualfunds/discover/SCBS&P500A',
        'rte_fund_ssp500_btn': 'scbeasy://mutualfunds/discover/SCBS&P500',
        'rte_fund_ssp500a_btn': 'scbeasy://mutualfunds/discover/SCBS&P500A',
        // ----- Global & Regional Funds -----
        'rte_fund_worlda_btn': 'scbeasy://mutualfunds/discover/SCBWORLD(A)',
        'rte_fund_gquala_btn': 'scbeasy://mutualfunds/discover/SCBGQUAL(A)',
        'rte_fund_scbgquala_btn': 'scbeasy://mutualfunds/discover/SCBGQUAL(A)',
        'rte_fund_valuea_btn': 'scbeasy://mutualfunds/discover/SCBVALUE(A)',
        // ----- Index Funds -----
        'rte_fund_ndqa_btn': 'scbeasy://mutualfunds/discover/SCBNDQ(A)',
        'rte_fund_nk225_btn': 'scbeasy://mutualfunds/discover/SCBNK225',
        'rte_fund_cha_btn': 'scbeasy://mutualfunds/discover/SCBCHA',
        // ----- Fixed Income Funds -----
        'rte_fund_mcbond_btn': 'scbeasy://mutualfunds/discover/MCBOND',
        'rte_fund_ktwcorp_btn': 'scbeasy://mutualfunds/discover/KT-WCORP',
        // ----- Equity Funds -----
        'rte_fund_usfocusa_btn': 'scbeasy://mutualfunds/discover/SCBUSFOCUS(A)',
        'rte_fund_kfglobfxa_btn': 'scbeasy://mutualfunds/discover/KFGLOBFX-A',
        'rte_fund_kfhtecha_btn': 'scbeasy://mutualfunds/discover/KFHTECH-A',
        // ----- Multi-Asset Funds -----
        'rte_fund_wina_btn': 'scbeasy://mutualfunds/discover/SCBWINA',
        'rte_fund_kgaaa_btn': 'scbeasy://mutualfunds/discover/K-GA-A(A)',
        'rte_fund_meurog_btn': 'scbeasy://mutualfunds/discover/MEURO-G',
        'rte_fund_gmcore_btn': 'scbeasy://mutualfunds/discover/SCBGMCORE(A)',
        // ----- Alternative Asset Funds -----
        'rte_fund_gprop_btn': 'scbeasy://mutualfunds/discover/SCBGPROP',
        'rte_fund_gpropa_btn': 'scbeasy://mutualfunds/discover/SCBGPROPA',
        // ----- Commodity Funds -----
        'rte_fund_gold_btn': 'scbeasy://mutualfunds/discover/SCBGOLD',
        'rte_fund_goldh_btn': 'scbeasy://mutualfunds/discover/SCBGOLDH',
        'rte_fund_oil_btn': 'scbeasy://mutualfunds/discover/SCBOIL'
    };
    // CSS Selectors (if needed)
    var cssSelectorMap = {
        '#digital > li:nth-child(1) > a': 'scbeasy://'
    };
    // Check if element is already processed
    var isProcessed = function(el) {
        for (var i = 0; i < processedElements.length; i++) {
            if (processedElements[i] === el) return true;
        }
        return false;
    };
    // Apply to Widget IDs
    var widgetIds = Object.keys(deeplinkMap);
    for (var i = 0; i < widgetIds.length; i++) {
        var id = widgetIds[i];
        var element = document.getElementById(id);
        if (element) {
            applySmartScriptURL(element, deeplinkMap[id], baseURL);
            processedElements.push(element);
        }
    }
    // Apply to CSS Selectors
    var selectors = Object.keys(cssSelectorMap);
    for (var j = 0; j < selectors.length; j++) {
        var selector = selectors[j];
        var element = document.querySelector(selector);
        if (element && !isProcessed(element)) {
            applySmartScriptURL(element, cssSelectorMap[selector], baseURL);
            processedElements.push(element);
        }
    }
    // ============================================
    // PRIORITY 2: Auto-detect by URL pattern (fallback)
    // ============================================
    var urlPatternSelectors = [
        'a[href*="scbeasy://"]',
        'a[href*="scb://"]',
        'a[href*="easy_app_link.html"]',
        'a[href*="info.scb.co.th/scbeasy"]'
    ];
    for (var k = 0; k < urlPatternSelectors.length; k++) {
        var patternSelector = urlPatternSelectors[k];
        var elements = document.querySelectorAll(patternSelector);
        for (var l = 0; l < elements.length; l++) {
            var el = elements[l];
            if (!isProcessed(el)) {
                var deepLink = extractDeepLink(el.getAttribute('href'));
                if (deepLink) {
                    applySmartScriptURL(el, deepLink, baseURL);
                    processedElements.push(el);
                }
            }
        }
    }
    console.log('[SmartScript] Total links processed:', processedElements.length);
}
