'use strict';

var fs = require('fs');
var util = require('util');
var path = require('path');
var spawn = require('child_process').spawn;
var yeoman = require('yeoman-generator');
var updateNotifier = require('update-notifier');
//var pkg = require('package.json');
var chalk = require('chalk');
var wiredep = require('wiredep');
var nconf = require('nconf');
var fileExt = '.html';
var fileTemplate = 'html_templates/';
var gulp = require('gulp');
var stylus = require('gulp-stylus');

//updateNotifier({pkg: pkg}).notify();

var AppGenerator = module.exports = function Appgenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  // setup the test-framework property, gulpfile template will need this
  this.testFramework = options['test-framework'] || 'mocha';

  // for hooks to resolve on mocha by default
  options['test-framework'] = this.testFramework;

  // resolved to mocha by default (could be switched to jasmine for instance)
  this.hookFor('test-framework', {
    as: 'app',
    options: {
      options: {
        'skip-install': options['skip-install-message'],
        'skip-message': options['skip-install']
      }
    }
  });

  this.options = options;
  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(AppGenerator, yeoman.generators.Base);

AppGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // welcome message
  if (!this.options['skip-welcome-message']) {
	var s1 = chalk.yellow('jQuery');
	var s2 = chalk.yellow('Compass');
	var s3 = chalk.yellow('Toadstool-Stipe');
	var s4 = chalk.yellow('normalize.css');
	var s5 = chalk.yellow('gulpfile.js');
	var comma = chalk.green(', ');
	
	console.log('');
	console.log(chalk.white.bgBlue.bold('          _________    __        '));
	console.log(chalk.white.bgBlue.bold('         / ____/   |  / /        '));
	console.log(chalk.white.bgBlue.bold('        / / __/ /| | / /         '));
	console.log(chalk.white.bgBlue.bold('       / /_/ / ___ |/ /___       '));
	console.log(chalk.white.bgBlue.bold('      |_____/_/  |_/_____/       '));
	console.log(chalk.white.bgBlue.bold('                                 '));
	console.log('');
	console.log(chalk.green(' <<< GAL Web Project Template >>>'));
	console.log(chalk.green(' <<< Out of the box I include ')+ s1 + comma + s2 + comma + s3 + comma + s4 + chalk.green(' and a ') + s5 + chalk.green(' to build your app. >>>'));
	console.log('');
	console.log(' ('+chalk.yellow('Notice')+': the distribution folder is listed in the .gitignore by default, you may change that if desired.)');
	console.log('');
  }

  var prompts = [{
    type: 'checkbox',
    name: 'features',
    message: 'What more would you like to include/change?' + chalk.grey('  (List is scrolling in  an endless loop)'),
    choices: [{
      name: chalk.yellow('PHP Project instead of HTML'),
      value: 'includePHP',
      checked: false
    }, {
      name: chalk.yellow('Gzipped JS/CSS'),
      value: 'includeGzip',
      checked: false
    }, {
      name: chalk.yellow('Add Google Analytics'),
      value: 'includeAnalytics',
      checked: false
    }, {
      name: chalk.yellow('MomentJS'),
      value: 'includeMomentJS',
      checked: false
    },{
      name: chalk.yellow('UnderscoreJS'),
      value: 'includeUnderscoreJS',
      checked: true
    }, {
      name: chalk.yellow('jQueryUI'),
      value: 'includeJQueryUI',
      checked: false
    }, {
      name: chalk.yellow('bxSlider'),
      value: 'includeBxSlider',
      checked: false
    }, {
      name: chalk.yellow('VideoJS'),
      value: 'includeVideoJS',
      checked: false
    }, {
      name: chalk.yellow('Flowplayer'),
      value: 'includeFlowplayer',
      checked: false
    }, {
      name: chalk.yellow('Modernizr'),
      value: 'includeModernizr',
      checked: false
    }, {
      name: chalk.yellow('Magnific-Popup (light and responsive lightbox)'),
      value: 'includeMagnific',
      checked: false
    }, {
      name: chalk.yellow('Bootstrap'),
      value: 'includeBootstrap',
      checked: false
    }, {
      name: chalk.grey('--------------------- END ---------------------'),
      value: '',
      checked: false
    }]
  }];

  this.prompt(prompts, function (answers) {
    var features = answers.features;

    var hasFeature = function (feat) {
      return features.indexOf(feat) !== -1;
    };

    // manually deal with the response, get back and store the results.
    // we change a bit this way of doing to automatically do this in the self.prompt() method.
    this.includeBootstrap = hasFeature('includeBootstrap');
    this.includeModernizr = hasFeature('includeModernizr');
	this.includeMomentJS = hasFeature('includeMomentJS');
	this.includeBxSlider = hasFeature('includeBxSlider');
	this.includeJQueryUI = hasFeature('includeJQueryUI');
	this.includePHP = hasFeature('includePHP');
	this.includeGzip = hasFeature('includeGzip');
	this.includeAnalytics = hasFeature('includeAnalytics');
	this.includeUnderscoreJS = hasFeature('includeUnderscoreJS');
	this.includeMagnific = hasFeature('includeMagnific');
	this.includeVideoJS = hasFeature('includeVideoJS');
	this.includeFlowplayer = hasFeature('includeFlowplayer');
	
    cb();
  }.bind(this));
};

AppGenerator.prototype.gulpfile = function () {
  nconf.argv().env();

  nconf.use('file', { file: './config.json' });
  nconf.load();
  nconf.set('fileExt', '.html');
  nconf.set('Gzip', false);
  nconf.set('Analytics:include', false);
  
  if (this.includePHP) {
	fileTemplate = 'php_templates/';	
	nconf.set('fileExt', '.php');
  }
  if (this.includeGzip) {
	nconf.set('Gzip', true);
  }
  if (this.includeAnalytics) {
	nconf.set('Analytics:include', true);
  }
  this.copy('gulpfile.js', 'gulpfile.js');	

	nconf.save(function (err) {
		if (err) {
		  console.error(err.message);
		  return;
		}
	});
};

AppGenerator.prototype.packageJSON = function () {
  this.template('_package.json', 'package.json');
};

AppGenerator.prototype.git = function () {
  this.copy('gitignore', '.gitignore');
  this.copy('gitattributes', '.gitattributes');
};

AppGenerator.prototype.bower = function () {
  this.copy('bowerrc', '.bowerrc');
  this.copy('bower.json', 'bower.json');
};

AppGenerator.prototype.bundler = function () {
  this.copy('gemfile', 'gemfile');
  this.copy('gemfile.lock', 'gemfile.lock');
  this.copy('config.rb', 'config.rb');
};

AppGenerator.prototype.jshint = function () {
  this.copy('jshintrc', '.jshintrc');
};

AppGenerator.prototype.editorConfig = function () {
  this.copy('editorconfig', '.editorconfig');
};

AppGenerator.prototype.h5bp = function () {
  if (this.includePHP) {
	fileExt = '.php';
	fileTemplate = 'php_templates/';
  }
  this.copy('favicon.ico', 'app/favicon.ico');
  this.copy(fileTemplate+'404'+fileExt, 'app/404'+fileExt);
  this.copy(fileTemplate+'htaccess', 'app/.htaccess');
};

AppGenerator.prototype.mainStylesheet = function () {
 // var css = 'application.scss';
 // this.copy(css, 'app/styles/scss/' + css);
};

AppGenerator.prototype.writeIndex = function () {
  if (this.includePHP) {
	fileExt = '.php';
	fileTemplate = 'php_templates/';
  }
  
  this.indexFile = this.readFileAsString(path.join(this.sourceRoot(), fileTemplate+'index'+fileExt));
  this.indexFile = this.engine(this.indexFile, this);

  // wire Bootstrap plugins
  if (this.includeBootstrap) {
    var bs = 'bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/';
    this.indexFile = this.appendScripts(this.indexFile, 'scripts/plugins.js', [
      bs + 'affix.js',
      bs + 'alert.js',
      bs + 'dropdown.js',
      bs + 'tooltip.js',
      bs + 'modal.js',
      bs + 'transition.js',
      bs + 'button.js',
      bs + 'popover.js',
      bs + 'carousel.js',
      bs + 'scrollspy.js',
      bs + 'collapse.js',
      bs + 'tab.js'
    ]);
  }

  this.indexFile = this.appendFiles({
    html: this.indexFile,
    fileType: 'js',
    optimizedPath: 'scripts/main.js',
    sourceFileList: ['scripts/main.js']
  });
};

AppGenerator.prototype.app = function () {  
  this.mkdir('app');
  this.mkdir('app/scripts');
  this.mkdir('app/styles');
  this.mkdir('app/styles/scss');
  this.mkdir('app/styles/css');
  this.mkdir('app/images');
  this.mkdir('app/images/layout');
  this.mkdir('app/images/layout/desktop');
  this.mkdir('app/images/layout/mobile');
  this.mkdir('app/images/sprites'); 
  this.mkdir('app/images/sprites/desktop');
  this.mkdir('app/images/sprites/mobile');
  this.write('app/index'+fileExt, this.indexFile);  
  this.copy('main.js', 'app/scripts/main.js');
  this.directory('templates', 'app/templates');
  this.directory('styles', 'app/styles');
};

gulp.task('renderStylus', function () {
  gulp.src('app/bower_components/flowplayer/skin/styl/*.styl')
    .pipe(stylus())
    .pipe(gulp.dest('app/bower_components/flowplayer/skin'));
});

AppGenerator.prototype.install = function () {
  var howToInstall =
    '\nAfter running `npm install & bower install`, inject your front end dependencies into' +
    '\nyour HTML by running:' +
    '\n' +
    chalk.yellow.bold('\n  gulp wiredep');

  if (this.options['skip-install']) {
    console.log(howToInstall);
    return;
  }

  var done = this.async();
  this.installDependencies({
    skipMessage: this.options['skip-install-message'],
    skipInstall: this.options['skip-install'],
    callback: function () {
      var bowerJson = JSON.parse(fs.readFileSync('./bower.json'));
	  
	  //gulp.task('default', ['renderStylus']);
      // wire Bower packages to .html
      wiredep({
        bowerJson: bowerJson,
        directory: 'app/bower_components',
        exclude: ['bootstrap-sass', 'sass-css-importer', 'stipe', 'jquery.bxslider.min.js'],
        src: 'app/index'+fileExt		
      });

      // wire Bower packages to .scss
      wiredep({
        bowerJson: bowerJson,
        directory: 'app/bower_components',
		exclude: [ 'sass-css-importer', 'stipe'],
        src: 'app/styles/scss/*.scss'
      });

      done();
    }.bind(this)
  });
};
