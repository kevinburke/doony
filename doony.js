

jQuery(function($) {

    var colors = [
        '#4ecdc4', // a bright green blue
        '#8fbe00', // lime yellow
        '#C02942', // a red
        '#d95b43', // orange
        '#542437', // purple
        '#556270', // a slate color
    ];

    var getSubdomain = function(domain) {
        var parts = domain.split(".");
        if (parts.length <= 2) {
            return parts.join(".");
        } else {
            return parts.slice(0, -2).join(".");
        }
    };

    var hashCode = function(string) {
        var hash = 0, i, char;
        if (string.length == 0) return hash;
        for (i = 0, l = string.length; i < l; i++) {
            char  = string.charCodeAt(i);
            hash  = ((hash<<5)-hash)+char;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    };

    var doonyTitleLink = $("#top-panel a").first();
    var domain = getSubdomain(window.location.hostname);
    console.log(hashCode(domain));
    var color = colors[Math.abs(hashCode(domain)) % colors.length - 1];
    doonyTitleLink.html("<div id='doony-title'>" + domain + "</div>");

    console.log(color);
    $("#top-panel").css('background-color', color);

    $(".task").each(function() {
        $("a img", $(this)).remove();
        $(this).html(function(idx, oldHtml) {
            var replaced = oldHtml.replace(/&nbsp;/g, "", "g");
            return replaced;
        });
    });
});
