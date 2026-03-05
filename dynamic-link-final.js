var applySmartScriptURL = function (a, b, c) {
    var d = decodeURIComponent(b);
    d = d
        .replace(/&amp;amp;/g, "%26")
        .replace(/&amp;/g, "%26")
        .replace(/:\/\//g, "%3A%2F%2F")
        .replace(/\//g, "%2F")
        .replace(/\(/g, "%2528")
        .replace(/\)/g, "%2529");
    c = c + "&af_dp=" + d;
    a.href = c;
    console.log("[SmartScript] Applied:", a.id || "no-id", "→", b);
},
extractDeepLink = function (a) {
    if (!a) return null;
    var b = a.match(/URI=([^&]+)/);
    return b
        ? decodeURIComponent(b[1])
        : a.indexOf("scbeasy://") === 0 || a.indexOf("scb://") === 0
            ? a.split("&")[0]
            : null;
};

if (AF_SMART_SCRIPT_RESULT) {
    var baseURL = AF_SMART_SCRIPT_RESULT.clickURL;
    baseURL = baseURL.replace(/&af_dp=[^&]*/g, "");

    for (
        var processedElements = [],
            deeplinkMap = {
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
            },
            cssSelectorMap = {
                "#digital > li:nth-child(1) > a": "scbeasy://"
            },
            isProcessed = function (a) {
                for (var b = 0; b < processedElements.length; b++) {
                    if (processedElements[b] === a) return true;
                }
                return false;
            },
            widgetIds = Object.keys(deeplinkMap),
            i = 0;
        i < widgetIds.length;
        i++
    ) {
        var id = widgetIds[i],
            element = document.getElementById(id);
        if (element) {
            applySmartScriptURL(element, deeplinkMap[id], baseURL);
            processedElements.push(element);
        }
    }

    for (var selectors = Object.keys(cssSelectorMap), j = 0; j < selectors.length; j++) {
        var selector = selectors[j];
        element = document.querySelector(selector);
        if (element && !isProcessed(element)) {
            applySmartScriptURL(element, cssSelectorMap[selector], baseURL);
            processedElements.push(element);
        }
    }

    for (
        var urlPatternSelectors = [
                'a[href*="scbeasy://"]',
                'a[href*="scb://"]',
                'a[href*="easy_app_link.html"]',
                'a[href*="info.scb.co.th/scbeasy"]'
            ],
            k = 0;
        k < urlPatternSelectors.length;
        k++
    ) {
        for (
            var patternSelector = urlPatternSelectors[k],
                elements = document.querySelectorAll(patternSelector),
                l = 0;
            l < elements.length;
            l++
        ) {
            var el = elements[l];
            if (!isProcessed(el)) {
                var deepLink = extractDeepLink(el.getAttribute("href"));
                if (deepLink) {
                    applySmartScriptURL(el, deepLink, baseURL);
                    processedElements.push(el);
                }
            }
        }
    }

    console.log("[SmartScript] Total links processed:", processedElements.length);
}
