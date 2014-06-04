Hello! I'm glad you're interested in contributing to Doony.

## The current build pipeline

If you'd like to edit Javascript, edit the file in `src/theme.js`. You then
want to run `make install watch`, which will concatenate this file with
ProgressCircle, and minify it.

If you'd like to edit the CSS, edit the file at `src/doony.scss`. This gets
compiled to `doony.css` and `doony.min.css`.

A brief picture:

```
src/theme.js ---> concatenated w/ vendor libs -----> doony.js
                                              |
                                              -----> minified --> doony.min.js

src/doony.scss ---> compiled -----> doony.css
                                    |
                                    -----> minified --> doony.min.js
```

I'm in the process of making this more user friendly and apologize for the
complexity. If it's confusing, just submit your changes and I'll update the
right files.

### Add yourself!

If you submit a pull request, please add yourself to the AUTHORS file. It's
easy: just add a commit, run `make authors` in the project root, and commit the
resulting changes to source code.
