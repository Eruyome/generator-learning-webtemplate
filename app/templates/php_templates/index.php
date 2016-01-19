<!doctype html>
<html class="no-js">
    <head>
        <meta charset="utf-8">
        <title><%= appname %></title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <!-- Place favicon.ico and apple-touch-icon.png in the root directory -->

        <!-- build:css styles/vendor.css -->
        <!-- bower:css -->
        <!-- endbower -->
        <!-- endbuild -->

       <!-- build:css({.tmp,app}) styles/css/application.css -->
        <link rel="stylesheet" href="styles/css/application.css">
        <!-- endbuild -->
        <% if (includeModernizr) { %>
        <!-- build:js scripts/vendor/modernizr.js -->
        <script src="bower_components/modernizr/modernizr.js"></script>
        <!-- endbuild --><% } %>
    </head>
    <body>
        <!--[if lt IE 10]>
            <p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
        <![endif]-->
        <% if (includeBootstrap) { %>
        <div class="container">
            <div class="header">
                <ul class="nav nav-pills pull-right">
                    <li class="active"><a href="#">Home</a></li>
                    <li><a href="#">About</a></li>
                    <li><a href="#">Contact</a></li>
                </ul>
                <h3 class="text-muted"><%= appname %></h3>
            </div>

            <div class="jumbotron">
                <h1>'Allo, 'Allo!</h1>
                <p class="lead">Always a pleasure scaffolding your apps.</p>
                <p><a class="btn btn-lg btn-success" href="#">Splendid!</a></p>
            </div>

            <div class="row marketing">
                <div class="col-lg-6">
                    <h4>HTML5 Boilerplate</h4>
                    <p>HTML5 Boilerplate is a professional front-end template for building fast, robust, and adaptable web apps or sites.</p>
                    <h4>Sass (libsass)</h4>
                    <p>Sass is the most mature, stable, and powerful professional grade CSS extension language in the world.<br>
                    At the core we're using Libsass which is an implemention of Sass written in C. Gulp-sass utilises node-sass which in turn utilises Libsass.</p>
                    <h4>Bootstrap</h4>
                    <p>Sleek, intuitive, and powerful mobile first front-end framework for faster and easier web development.</p><% if (includeModernizr) { %>
                    <h4>Modernizr</h4>
                    <p>Modernizr is an open-source JavaScript library that helps you build the next generation of HTML5 and CSS3-powered websites.</p>
                    <% } %>
                </div>
            </div>

            <div class="footer">
                <p>♥ from the Yeoman team</p>
            </div>
        </div>
        <% } else { %>
        <div class="hero-unit">
            <h1>'Allo, 'Allo!</h1>
            <p>You now have</p>
            <ul>
                <li>HTML5 Boilerplate</li><% if (includeModernizr) { %>
                <li>Modernizr</li><% } %>
            </ul>
        </div>
        <% } %>
        
        <!-- inject:analytics -->
		<!-- endinject -->

        <!-- build:js scripts/vendor.js -->
        <!-- bower:js -->
        <!-- endbower -->
        <!-- endbuild -->
    </body>
</html>
