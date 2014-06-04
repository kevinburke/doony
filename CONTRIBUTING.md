Hello! I'm glad you're interested in contributing to Doony.

## Installing dependencies

In the top level of the project, run `make install`. Doony depends on node.js
to perform Javascript syntax checking and minification of the source code.
Doony also depends on Python to provide a server for testing changes locally.
These files will all be installed in subdirectories of the `doony` project.

## The current build pipeline

If you'd like to edit Javascript, edit the file in `src/theme.js`. You then
want to run `make js`, which will concatenate this file with ProgressCircle,
and minify it.

If you'd like to edit the CSS, edit the file at `src/doony.scss`. You then
want to run `make css`, which will compile the file to `doony.css` and
`doony.min.css`.

A brief picture:

```
src/theme.js ---> concatenated w/ vendor libs -----> doony.js
                                              |
                                              -----> minified --> doony.min.js

src/doony.scss ---> compiled -----> doony.css
                                    |
                                    -----> minified --> doony.min.js
```

If it's too confusing, or you're on Windows, just submit your changes and I'll
update the right files.

### Add yourself!

If you submit a pull request, please add yourself to the AUTHORS file. It's
easy: just add a commit, run `make authors` in the project root, and commit the
resulting changes to source code.
