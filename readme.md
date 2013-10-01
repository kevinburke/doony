# Doony

Doony is a series of UI improvements on top of Jenkins. Install this to make
your Jenkins user experience much better.

## Who's Using It

Doony is in use at Twilio and Panic, Inc. Ping me to add your company name
here.

### Before

<img src="https://api.monosnap.com/image/download?id=tyH5frYrtWOizYJLkxWstROHM" />

### After

<img src="https://api.monosnap.com/image/download?id=aoqX9gzkqqEPa8IbKvEknmdug" />

<img src="https://api.monosnap.com/image/download?id=12w3g9i5oU8uEBQSqV8okgwXJ" />

<img src="https://api.monosnap.com/image/download?id=YDWD8TzKBUhBk8j3MwmsXy7Mn" />

## Changes

- There's a "Build Now" button on every build page. The button will redirect
  you to the console output of the new build. You can also easily cancel the
  current build.
- The orbs are gone! Replaced with shiny circles and circular in-progress bars.
- Click targets in the left hand menu are much bigger (they expand to fill the
  available UI)
- The fonts are bigger. Way bigger.
- "Jenkins" logo replaced with a custom color and the domain of your build server
- More spacing in between list items.
- Removes a lot of the useless icons
- "Console Output" looks more like a console.
- Replaces Courier New with Consolas.
- Hover menus have a pointer cursor, indicating clickability
- Text inputs are friendlier, bigger
- Builds are zebra-striped, have more padding
- Homepage has an option for "view console output of latest test"

### Chrome Extension

If you don't control your Jenkins environment, you can run this as a Chrome
extension.

1. Clone this repo locally.

2. Edit the `matches` value of the `manifest.json` file to contain the server
names of your Jenkins servers (see [Match Patterns][patterns]).

2. Run `git update-index --skip-worktree manifest.json` so you don't
   accidentally commit your `manifest.json` change.

3. Open [chrome://extensions](chrome://extensions). Check "Developer mode" if it's not already. Click "Load unpacked extension".

4. Navigate to this repo and click "Open"

[patterns]: http://developer.chrome.com/extensions/match_patterns.html

## Installation in Jenkins

If you do install your Jenkins environment it's probably best to embed it in
the default Jenkins styles.

1. Install the [JQuery Plugin][jquery]

2. Install the ["Simple Theme" Plugin][simple]

3. In Jenkins, click "Manage Jenkins", then "Configure System", then specify
   the CSS and Javascript URL's for this theme. You should find a place to host
   these, on a static server inside your cluster.

    In development, you can use these URL's:

        - https://rawgithub.com/kevinburke/doony/master/doony.js
        - https://rawgithub.com/kevinburke/doony/master/doony.css

    However, [don't use those URL's for production](http://rawgithub.com/#can-i-use-rawgithub-in-production).

    Alternatively you can let Jenkins self host these files by putting them in `~/.jenkins/userContent`
    With the default Jenkins settings the files you use will then be:

        - http://localhost:8080/userContent/doony.css
        - http://localhost:8080/userContent/doony.js

    Here's a screenshot of the settings page:

    <img src="https://api.monosnap.com/image/download?id=qtiCAUev2R3yS46He5LHwQXUS" />

[jquery]: https://wiki.jenkins-ci.org/display/JENKINS/jQuery+Plugin
[simple]: https://wiki.jenkins-ci.org/display/JENKINS/Simple+Theme+Plugin

4. Click "Save". Enjoy!

## Compatibility

This will "work" against the latest version of Jenkins, currently 1.532. It may
work with older versions but this is not guaranteed.

## Notes

- This is very much a work in progress, feel free to file bugs/issues and I'll
make improvements as I can.

- There's [a pull request against the Jenkins project][jenkins-pull] that
should make skinning Jenkins much less brittle. Hopefully it will get merged
into the mainline soon, then I can update this library.

[jenkins-pull]: https://github.com/jenkinsci/jenkins/pull/960

- This project is in no way intended to slam Jenkins developers. Jenkins is
awesome, and unlike Travis you never get a blank screen. They are working
within a series of vastly different constraints than I am. Consider:

    - they have to support every browser/platform/language
    - any change they make will make part of the userbase angry
    - every change has to be completely open-source friendly in every way

