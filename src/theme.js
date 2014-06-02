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
        if (/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(domain)) {
            // Looks like an IP address, so return as-is.
            return domain;
        }
        var parts = domain.split(".");
        if (parts.length <= 2) {
            return parts.join(".");
        } else {
            return parts.slice(0, -2).join(".");
        }
    };

    var hashCode = function(string) {
        var hash = 0, i, char;
        if (string.length === 0) return hash;
        for (i = 0, l = string.length; i < l; i++) {
            char  = string.charCodeAt(i);
            hash  = ((hash<<5)-hash)+char;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    };

    var isJobPage = function(path) {
        return path.match(/^\/job\/.*?\//) !== null;
    };

    /**
     * This is a little tricky because it needs to match either the homepage or
     * a page with configuration. The configuration check is for an equals sign
     * in the 3rd part of the URL
     */
    var isJobHomepage = function(path) {
        return path.match(/^\/job\/.*?\/(.*?=.*?\/)?$/) !== null;
    };

    var isRootHomepage = function(path) {
        return path.match(/^\/job\/.*?\/$/) !== null;
    };

    var getRootJobUrl = function(path) {
        return path.match(/^\/job\/.*?\//)[0];
    };

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
    };

    var redirectToNewJobConsole = function(jobUrl, buildNumber) {
        if (isRootHomepage(jobUrl)) {
            $.getJSON(jobUrl + 'api/json?tree=activeConfigurations[name]', function(data) {
                if (JSON.stringify(data) !== "{}" && 'activeConfigurations' in data) {
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
            "</a></div>";
    };

    // xxx combine this with the getCallout below
    var updateConfiguration = function(jobUrl, name) {
        $.getJSON(jobUrl + name + 'api/json?tree=lastBuild[number]', function(data) {
            if (data.lastBuild !== null && 'number' in data.lastBuild) {
                $("#matrix .model-link").each(function(idx, item) {
                    if (item.getAttribute('href') === name) {
                        var href = jobUrl + name + data.lastBuild.number + '/consoleFull';
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
                var message = "View console output for the latest build";
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

    // Replace the floaty ball with a better icon
    // XXX make the icon really good
    var replaceFloatyBall = function(selector, type) {
        $(selector).each(function() {
            var wrapper = document.createElement('div');
            wrapper.className = 'doony-circle doony-circle-' + type;
            wrapper.style.display = 'inline-block';
            var dimension;
            if (this.getAttribute('width') === "48" || this.getAttribute('width') === "24") {
                // an overly large ball is scary
                dimension = this.getAttribute('width') * 0.5 + 8;
                wrapper.style.marginRight = "15px";
                wrapper.style.verticalAlign = "middle";
            // XXX hack, this is for the main page job list
            } else if (this.classList.contains("icon32x32")) {
                dimension = 24;
                wrapper.style.marginTop = "4px";
                wrapper.style.marginLeft = "4px";
            } else {
                dimension = this.getAttribute('width') || 12;
            }
            $(wrapper).css('width', dimension);
            $(wrapper).css('height', dimension);

            $(this).after(wrapper).remove();
        });
    };

    var replaceBouncingFloatyBall = function(selector, color) {
        $(selector).each(function() {

            if ($(this).next(".doony-canvas").length) {
                return;
            }
            var canvas = document.createElement('canvas');
            canvas.className = 'doony-canvas';

            // 48 -> dimension 32.
            // radius should be 12, plus 4 width
            // 16 -> dimension 16, radius 4
            var dimension;
            if (this.getAttribute('width') === "48" || this.getAttribute('width') === "24") {
                // an overly large ball is scary
                dimension = this.getAttribute('width') * 0.5 + 8;
                canvas.style.marginRight = "15px";
                canvas.style.verticalAlign = "middle";
            // XXX hack, this is for the main page job list
            } else if (this.classList.contains("icon32x32")) {
                dimension = 24;
                canvas.style.marginTop = "4px";
                canvas.style.marginLeft = "4px";
            } else {
                dimension = this.getAttribute('width') || 12;
            }
            canvas.setAttribute('width', dimension);
            canvas.setAttribute('height', dimension);

            var circle = new ProgressCircle({
                canvas: canvas,
                minRadius: dimension * 3 / 8 - 2,
                arcWidth: dimension / 8 + 1
            });

            var x = 0;
            circle.addEntry({
                fillColor: color,
                progressListener: function() {
                    if (x >= 1) { x = 0; }
                    x = x + 0.005;
                    return x; // between 0 and 1
                },
            });
            // jenkins does ajax every 5 seconds, this should time it perfectly
            circle.start(24);
            $(this).after(canvas).css('display', 'none');
        });
    };

    var green = '#4f9f4f';
    setInterval(function() {
        replaceBouncingFloatyBall("img[src*='red_anime.gif']", '#d9534f');
        replaceBouncingFloatyBall("img[src*='blue_anime.gif']", green);
        replaceBouncingFloatyBall("img[src*='grey_anime.gif']", '#999');
        replaceBouncingFloatyBall("img[src*='yellow_anime.gif']", '#f0ad4e');
    }, 10);
    setInterval(function() {
        replaceFloatyBall("img[src*='/grey.png']", "aborted");
        replaceFloatyBall("img[src*='/blue.png']", "success");
        replaceFloatyBall("img[src*='/red.png']", "failure");
        replaceFloatyBall("img[src*='/yellow.png']", "warning");
    }, 10);

    if (isJobHomepage(window.location.pathname)) {
        var jobUrl = getJobUrl(window.location.pathname);
        $.getJSON(jobUrl + 'api/json?tree=lastBuild[number]', function(data) {
            if (!('lastBuild' in data) || data.lastBuild === null || !('number' in data.lastBuild)) {
                return;
            }
            var message = "View console output for the latest build";
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
                    if (JSON.stringify(data) !== "{}" &&
                        'lastBuild' in data &&
                        data.lastBuild !== null &&
                        data.lastBuild.building
                    ) {
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

    $("#l10n-footer").after("<span class='doony-theme'>Browsing Jenkins with " +
        "the <a target='_blank' href='https://github.com/kevinburke/doony'>" +
        "Doony theme</a></span>");
});
