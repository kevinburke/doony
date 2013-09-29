jQuery(function($) {

    var colors = [
        '#C02942', // a red
        '#4ecdc4', // a bright green blue
        '#d95b43', // orange
        '#556270', // a slate color
        '#542437', // purple
        '#8fbe00', // lime yellow
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

    /**
     * This is a little tricky because it needs to match either the homepage or
     * a page with configuration. The configuration check is for an equals sign
     * in the 3rd part of the URL
     */
    var isJobHomepage = function(path) {
        return path.match(/^\/job\/.*?\/(.*?=.*?\/)?$/) !== null;
    }

    var isRootHomepage = function(path) {
        return path.match(/^\/job\/.*?\/$/) !== null;
    };

    var getRootJobUrl = function(path) {
        return path.match(/^\/job\/.*?\//)[0];
    }

    // note: this function assumes you're already on a job page
    var getJobUrl = function(path) {
        return path.match(/^\/job\/.*?\/(.*?=.*?\/)?/)[0];
    };

    var redirectForUrl = function(jobUrl, buildNumber) {
        $.getJSON(jobUrl + 'api/json?tree=builds[number]', function(data) {
            for (var i = 0; i < data.builds.length; i++) {
                var build = data.builds[i];
                if (build.number === buildNumber) {
                    window.location.href = jobUrl + buildNumber + '/consoleFull';
                }
            }
            // gone all the way through and it's not there, sleep for a minute
            // and try again.
            setTimeout(function() {
                redirectForUrl(jobUrl, buildNumber);
            }, 1000);
        });
    }

    var redirectToNewJobConsole = function(jobUrl, buildNumber) {
        if (isRootHomepage(jobUrl)) {
            $.getJSON(jobUrl + 'api/json?tree=activeConfigurations[name]', function(data) {
                if (data !== "{}" && 'activeConfigurations' in data) {
                    // If its a multi configuration, just pick the first one.
                    // This works for us, might have to make this configurable
                    // somehow.
                    var downstreamUrl = jobUrl + data.activeConfigurations[0].name + '/';
                    return redirectForUrl(downstreamUrl, buildNumber);
                } else {
                    return redirectForUrl(jobUrl, buildNumber);
                }
            });
        } else {
            return redirectForUrl(jobUrl, buildNumber);
        }
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

    // build a callout
    var getCallout = function(message, href) {
        return "<div class='doony-callout doony-callout-info'><a " +
            (href === null ? "" : "href='" + href + "'") + ">" + message +
            "</a></div>"
    }

    // xxx combine this with the getCallout below
    var updateConfiguration = function(jobUrl, name) {
        $.getJSON(jobUrl + name + 'api/json?tree=lastBuild[number]', function(data) {
            if (data.lastBuild !== null && 'number' in data.lastBuild) {
                $("#matrix .model-link").each(function(idx, item) {
                    if (item.getAttribute('href') === name) {
                        var href = jobUrl + name + data.lastBuild.number + '/consoleFull';
                        var message = "View console output for the latest test";
                        $(item).next(".doony-callout").children("a").attr('href', href);
                    }
                });
            }
        });
    };

    if ($("#matrix").length) {
        // for some stupid reason jenkins fetches this with ajax so we need to
        // setinterval here to continue to retrieve it all the time
        setInterval(function() {
            var jobUrl = getJobUrl(window.location.pathname);
            if ($("#matrix .doony-downstream-link").length) {
                // already updated this matrix div
                return;
            }
            $("#matrix .model-link").wrap("<div class='doony-downstream-link'>");
            // Create the div, even though we don't have the HREF yet, so the
            // UI looks consistent
            $("#matrix .model-link").each(function(idx, item) {
                var message = "View console output for the latest test";
                $(item).after(getCallout(message, null));
            });
            $.getJSON(jobUrl + 'api/json?tree=activeConfigurations[name]', function(data) {
                for (var i = 0; i < data.activeConfigurations.length; i++) {
                    var config = data.activeConfigurations[i];
                    updateConfiguration(jobUrl, config.name + '/');
                }
            });
        }, 50);
    }

    if (isJobHomepage(window.location.pathname)) {
        var jobUrl = getJobUrl(window.location.pathname);
        $.getJSON(jobUrl + 'api/json?tree=lastBuild[number]', function(data) {
            var message = "View console output for the latest test";
            var href = jobUrl + data.lastBuild.number + '/consoleFull';
            var h2 = $("h2:contains('Permalinks')");
            h2.after(getCallout(message, href));
        });
    }

    if (isJobPage(window.location.pathname)) {
        var button = document.createElement('button');
        button.className = "btn btn-primary doony-build";
        button.innerHTML = "Build Now";
        $(button).click(function() {
            var jobUrl = getRootJobUrl(window.location.pathname);
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
                    redirectToNewJobConsole(getJobUrl(window.location.pathname),
                        data.nextBuildNumber);
                });
            });
        });

        $(document).on('click', '#doony-clear-build', function(e) {
            e.preventDefault();
            var jobUrl = getRootJobUrl(window.location.pathname);
            $.getJSON(jobUrl + 'api/json?tree=lastBuild[number]', function(data) {
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
