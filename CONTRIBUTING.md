# Contributing

If you came here, I presume that you be a developer like me. Please, read
this guideline and follow it. I reserve myself the right to refuse a contribution
that does not follow the minimum requirements.

## Pull Request

1. Fork it
2. Create your branch (`git checkout -b <relevant-branch-name>`)
3. Install Gulp CLI (`npm rm --global gulp | npm install --global gulp-cli`)
4. Install dependences (`npm install`)
5. Increment the version in gulpfile.js, Settings.VERSION
6. Make your changes
7. Run `gulp dev`
8. Test the resulting code in a Browser
9. Run `gulp release`
10. Commit your changes
11. Push to the branch (`git push origin <relevant-branch-name>`)
12. Create new Pull Request

## Browser Support

Any contributed code must work in Google Chrome and Mozilla Firefox, as well as
in your extensions to UserScript, Greasemonkey and Tampermonkey.

## Version Control

`gulp dev` generates a development version by adding a number to the end of the version. The number indicates the date and time without signals. Use this feature as many times as you need during the development.

`gulp release` normalizes the version to x.x.x, preparing the code to be commited.

Before using this commands, you must change the version in Settings.VERSION in the [gulpfile.js](../master/gulpfile.js):
* **1**.x.x : Drastic change. It may be in the structure or presentation form.
* x.**1**.x : Change related to new feature or plugin.
* x.x.**1** : Bug fix, refactoring and small change that do not represent a risk.
