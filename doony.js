jQuery(function($) {
    var doonyTitleLink = $("#top-panel a").first();
    doonyTitleLink.html("<div id='doony-title'>build.corp.twilio.com</div>");

    $(".task").each(function() {
        $("a img", $(this)).remove();
        $(this).html(function(idx, oldHtml) {
            var replaced = oldHtml.replace(/&nbsp;/g, "", "g");
            return replaced;
        });
    });
});
