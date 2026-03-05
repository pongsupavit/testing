// ============================================
// Helper Functions
// ============================================
var normalizeDeepLink = function (value) {
    if (!value) return value;

    var decoded = value;
    try {
        decoded = decodeURIComponent(value);
    } catch (e) {
        // keep original if malformed
    }

    return decoded
        .replace(/&amp;amp;/g, "&")
        .replace(/&amp;/g, "&");
};

var encodeAfDpValue = function (value) {
    return encodeURIComponent(value)
        .replace(/%28/g, "%2528")
        .replace(/%29/g, "%2529");
};

var applySmartScriptURL = function (element, afDpValue, baseURL) {
    var normalizedValue = normalizeDeepLink(afDpValue);
    var encodedValue = encodeAfDpValue(normalizedValue);
    var finalURL = baseURL + "&af_dp=" + encodedValue;

    element.href = finalURL;
    console.log("[SmartScript] Applied:", element.id || "no-id", "->", afDpValue);
};

var extractDeepLink = function (url) {
    if (!url) return null;

    try {
        var parsedURL = new URL(url, window.location.href);
        var uriParam = parsedURL.searchParams.get("URI");
        if (uriParam) return normalizeDeepLink(uriParam);
    } catch (e) {
        // fallback to regex parsing
    }

    var uriMatch = url.match(/[?&]URI=([^&]+)/);
    if (uriMatch) return normalizeDeepLink(uriMatch[1]);

    if (url.indexOf("scbeasy://") === 0 || url.indexOf("scb://") === 0) {
        return normalizeDeepLink(url.split("&")[0]);
    }

    return null;
};

// ============================================
// Main Logic
// ============================================
if (AF_SMART_SCRIPT_RESULT) {
    var baseURL = AF_SMART_SCRIPT_RESULT.clickURL;
    baseURL = baseURL.replace(/&af_dp=[^&]*/g, "");

    var processedElements = [];

    var deeplinkMap = {
        nav_header: "scbeasy://",
        quick_link: "scbeasy://",
        hero_banner_btn: "scbeasy://mutualfunds",
        hero_btn: "scbeasy://mutualfunds",
        anchor_tab_btn: "scbeasy://mutualfunds",
        rte_easy_download_ios: "scbeasy://",
        rte_easy_download_google: "scbeasy://",
        rte_fund_sp500_btn: "scbeasy://mutualfunds/discover/SCBS%26P500",
        rte_fund_sp500a_btn: "scbeasy://mutualfunds/discover/SCBS%26P500A",
        rte_fund_ssp500_btn: "scbeasy://mutualfunds/discover/SCBS%26P500",
        rte_fund_ssp500a_btn: "scbeasy://mutualfunds/discover/SCBS%26P500A",
        rte_fund_worlda_btn: "scbeasy://mutualfunds/discover/SCBWORLD(A)",
        rte_fund_gquala_btn: "scbeasy://mutualfunds/discover/SCBGQUAL(A)",
        rte_fund_scbgquala_btn: "scbeasy://mutualfunds/discover/SCBGQUAL(A)",
        rte_fund_valuea_btn: "scbeasy://mutualfunds/discover/SCBVALUE(A)",
        rte_fund_ndqa_btn: "scbeasy://mutualfunds/discover/SCBNDQ(A)",
        rte_fund_nk225_btn: "scbeasy://mutualfunds/discover/SCBNK225",
        rte_fund_cha_btn: "scbeasy://mutualfunds/discover/SCBCHA",
        rte_fund_mcbond_btn: "scbeasy://mutualfunds/discover/MCBOND",
        rte_fund_ktwcorp_btn: "scbeasy://mutualfunds/discover/KT-WCORP",
        rte_fund_usfocusa_btn: "scbeasy://mutualfunds/discover/SCBUSFOCUS(A)",
        rte_fund_kfglobfxa_btn: "scbeasy://mutualfunds/discover/KFGLOBFX-A",
        rte_fund_kfhtecha_btn: "scbeasy://mutualfunds/discover/KFHTECH-A",
        rte_fund_wina_btn: "scbeasy://mutualfunds/discover/SCBWINA",
        rte_fund_kgaaa_btn: "scbeasy://mutualfunds/discover/K-GA-A(A)",
        rte_fund_meurog_btn: "scbeasy://mutualfunds/discover/MEURO-G",
        rte_fund_gmcore_btn: "scbeasy://mutualfunds/discover/SCBGMCORE(A)",
        rte_fund_gprop_btn: "scbeasy://mutualfunds/discover/SCBGPROP",
        rte_fund_gpropa_btn: "scbeasy://mutualfunds/discover/SCBGPROPA",
        rte_fund_gold_btn: "scbeasy://mutualfunds/discover/SCBGOLD",
        rte_fund_goldh_btn: "scbeasy://mutualfunds/discover/SCBGOLDH",
        rte_fund_oil_btn: "scbeasy://mutualfunds/discover/SCBOIL"
    };

    var cssSelectorMap = {
        "#digital > li:nth-child(1) > a": "scbeasy://"
    };

    var isProcessed = function (element) {
        for (var i = 0; i < processedElements.length; i++) {
            if (processedElements[i] === element) return true;
        }
        return false;
    };

    var widgetIds = Object.keys(deeplinkMap);
    for (var j = 0; j < widgetIds.length; j++) {
        var id = widgetIds[j];
        var byIdElement = document.getElementById(id);
        if (byIdElement) {
            applySmartScriptURL(byIdElement, deeplinkMap[id], baseURL);
            processedElements.push(byIdElement);
        }
    }

    var selectors = Object.keys(cssSelectorMap);
    for (var k = 0; k < selectors.length; k++) {
        var selector = selectors[k];
        var bySelectorElement = document.querySelector(selector);
        if (bySelectorElement && !isProcessed(bySelectorElement)) {
            applySmartScriptURL(bySelectorElement, cssSelectorMap[selector], baseURL);
            processedElements.push(bySelectorElement);
        }
    }

    var urlPatternSelectors = [
        'a[href*="scbeasy://"]',
        'a[href*="scb://"]',
        'a[href*="easy_app_link.html"]',
        'a[href*="info.scb.co.th/scbeasy"]'
    ];

    for (var l = 0; l < urlPatternSelectors.length; l++) {
        var patternSelector = urlPatternSelectors[l];
        var elements = document.querySelectorAll(patternSelector);

        for (var m = 0; m < elements.length; m++) {
            var element = elements[m];
            if (isProcessed(element)) continue;

            var deepLink = extractDeepLink(element.getAttribute("href"));
            if (deepLink) {
                applySmartScriptURL(element, deepLink, baseURL);
                processedElements.push(element);
            }
        }
    }

    console.log("[SmartScript] Total links processed:", processedElements.length);
}
