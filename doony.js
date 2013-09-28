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

    // note: this function assumes you're already on a job page
    var getJobUrl = function(path) {
        return path.match(/^\/job\/.*?\//)[0];
    };

    var redirectToNewJobConsole = function(jobUrl, buildNumber) {
        $.get(jobUrl + 'api/json?tree=builds[number]', function(data) {
            for (var i = 0; i < data.builds.length; i++) {
                var build = data.builds[i];
                if (build.number === buildNumber) {
                    window.location.href = jobUrl + buildNumber + '/consoleFull';
                }
            }
            // gone all the way through and it's not there, sleep for a minute
            // and try again.
            setTimeout(function() {
                redirectToNewJobConsole(jobUrl, buildNumber);
            }, 1000);
        });
    };

    var showButterBar = function(message) {
        var div = document.createElement('div');
        div.className = 'alert alert-warning doony-alert';
        div.innerHTML = message;
        $("#main-panel").prepend(div);
    };

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
        var button = document.createElement('button');
        button.className = "btn btn-primary doony-build";
        button.innerHTML = "Build Now";
        $(button).click(function() {
            var jobUrl = getJobUrl(window.location.pathname);
            // The build post endpoint doesn't tell you the number of the next
            // build, so get it before we create a build.
            $.getJSON(jobUrl + 'api/json?depth=1&tree=nextBuildNumber,lastBuild[building]', function(data) {
                $.post(jobUrl + 'build', function() {
                    // in case there's an immediate redirect, don't show the
                    // bar.
                    var message = "Build #" + data.nextBuildNumber + " created, you will be redirected when it is ready.";
                    if (data.lastBuild.building) {
                        message += " <a href='#' id='doony-clear-build'>Cancel the current build</a>";
                    }
                    showButterBar(message);
                    redirectToNewJobConsole(jobUrl, data.nextBuildNumber);
                });
            });
        });

        $(document).on('click', '#doony-clear-build', function(e) {
            e.preventDefault();
            var jobUrl = getJobUrl(window.location.pathname);
            $.get(jobUrl + 'api/json?depth=1&tree=lastBuild[number]', function(data) {
                $.post(jobUrl + data.lastBuild.number + '/stop');
            });
        });

        var title = $("#main-panel h1").first();
        if (title.children("div").length) {
            title.append(button);
        } else {
            title.css('display', 'inline-block');
            title.after(button);
        }
    }
});
