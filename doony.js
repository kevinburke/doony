

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

    var isJobPage = function(path) {
        return path.match(/^\/job\/.*?\//) !== null;
    }

    var doonyTitleLink = $("#top-panel a").first();
    var domain = getSubdomain(window.location.hostname);
    doonyTitleLink.html("<div id='doony-title'>" + domain + "</div>");

    var color = colors[Math.abs(hashCode(domain)) % colors.length];
    $("#top-panel").css('background-color', color);

    // Remove icons from the left hand menu and strip nbsp's
    $(".task").each(function() {
        $("a img", $(this)).remove();
        $(this).html(function(idx, oldHtml) {
            var replaced = oldHtml.replace(/&nbsp;/g, "", "g");
            return replaced;
        });
    });

    if (isJobPage(window.location.pathname)) {
        $("#main-panel h1").first().css('display', 'inline-block');
        $("#main-panel h1").after("<button class='btn btn-primary doony-build'>Build Now</button>");
    }
});
