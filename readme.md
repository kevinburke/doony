# Doony

Doony is custom CSS and yavascript for jenkins

### Before

<img src="https://api.monosnap.com/image/download?id=tyH5frYrtWOizYJLkxWstROHM" />

### After

<img src="https://api.monosnap.com/image/download?id=aoqX9gzkqqEPa8IbKvEknmdug" />

## Changes

- There's a "Build Now" button on every build page. The button will redirect
  you to the console output of the new build. You can also easily cancel the
  current build.
- The fonts are bigger. Way bigger.
- "Jenkins" logo replaced with a custom color and the domain of your build server
- More spacing in between list items.
- Removes a lot of the useless icons
- Replaces Courier New with Consolas
- Hover menus have a pointer cursor, indicating clickability
- Text inputs are friendlier, bigger
- Builds are zebra-striped, have more padding

## Installation

1. Install the [JQuery Plugin][jquery]

2. Install the ["Simple Theme" Plugin][simple]

3. In Jenkins, click "Manage Jenkins", then "Configure System", then specify
   the CSS and Javascript URL's for this theme. You should find a place to host
   these, on a static server inside your cluster.

    In development, you can use these URL's:

        - https://rawgithub.com/kevinburke/doony/master/doony.js
        - https://rawgithub.com/kevinburke/doony/master/doony.css

    You should not use those URL's for production, however.

    Here's a screenshot of the settings page:

    <img src="https://api.monosnap.com/image/download?id=qtiCAUev2R3yS46He5LHwQXUS" />

[jquery]: https://wiki.jenkins-ci.org/display/JENKINS/jQuery+Plugin
[simple]: https://wiki.jenkins-ci.org/display/JENKINS/Simple+Theme+Plugin

4. Click "Save". Enjoy!

## Compatibility

This will "work" against the latest version of Jenkins, currently 1.532. It may
work with older versions but this is not guaranteed.
