# Web app generator 

Warning: This project was started to learn about yeoman, grunt, and gulp. It is not maintained and may not work anymore.

[Yeoman](http://yeoman.io) generator that scaffolds out a front-end web app using [Gulp](http://gulpjs.com/) for the build process.

## Features

* Built-in preview server with BrowserSync / default: disabled
* CSS Autoprefixing 
* Automagically compile Sass (via compass) 
* Automagically lint your scripts
* Awesome Image Optimization (via OptiPNG, pngquant, jpegtran and gifsicle)
* Automagically wire-up dependencies installed with [Bower](http://bower.io) (when `gulp watch` or `gulp wiredep`)

## Getting Started

- Install: `npm install -g generator-learning-webtemplate`
- Run: `yo learning-webtemplate`
- Run `gulp` for building and `gulp watch` for preview


#### Third-Party Dependencies

*(HTML/CSS/JS/Images/etc)*

To install dependencies, run `bower install depName --save` to get the files, then add a `script` or `style` tag to your `index.html` or an other appropriate place.

## Options

* `--skip-install`

  Skips the automatic execution of `bower` and `npm` after scaffolding has finished.

* `--test-framework=<framework>`

  Defaults to `mocha`. Can be switched for another supported testing framework like `jasmine`.


## License

[BSD license](http://opensource.org/licenses/bsd-license.php)
