# Contributing

If you came here, I presume that you be a developer like me. Please, read this guideline and follow it. Contributions are always welcome. If you don't know how you can help, you can check issues or ask @viniciusknob.

## Pull Request

Please, follow the instructions in the "Forked Public Project" section in ["5.2 Distributed Git - Contributing to a Project"](https://git-scm.com/book/pt-br/v2/Distributed-Git-Contributing-to-a-Project).

## Browser Support

Any contributed code must work in Google Chrome and Mozilla Firefox, as well as
in your extensions to UserScript, Greasemonkey and Tampermonkey.

## Version Control

`gulp` generates a development version by adding a number to the end of the version. The number indicates the date and time without signals. Use this feature as many times as you need during the development.

`gulp release` normalizes the version to x.x.x, preparing the code to be commited.

Before using this commands, you must change the version in Settings.VERSION in the [gulpfile.js](gulpfile.js):
* **1**.x.x : Drastic change. It may be in the structure or presentation form.
* x.**1**.x : Change related to new feature or plugin.
* x.x.**1** : Bug fix, refactoring and small change that do not represent a risk.
