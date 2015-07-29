var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');
// var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(partials());

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// Eliminar extended permite usar notación pseudo-JSON para pasar objetos en formularios con POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser('Quiz 2015')); // Se añade semilla 'Quiz 2015' para cifrar cookie
app.use(session()); // Instala el middleware session
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));


// Helpers dinámicos para el manejo de sesiones
app.use(function(req, res, next){
    // guardar path en session.redir para después de login
    if(!req.path.match(/\/login|\/logout/)){
        req.session.redir = req.path;
    }
    // hacer visible req.session en las vistas
    res.locals.session = req.session;
    next();
});

// Mecanismo de autologout
app.use(function(req, res, next){
    if(req.session.user){
        var ahora = new Date();
        if(req.session.lastreq){
            var antes = new Date(req.session.lastreq);
            if( (ahora.getTime() - req.session.lastreq) > (1000*60*2) ) {
                delete req.session.user;
                delete req.session.lastreq;
                res.redirect('/login');
            } else {
                req.session.lastreq = ahora.getTime();
                next();
            }
        } else {
            req.session.lastreq = ahora.getTime();
            next();
        }
    } else {
        next();
    }
});

app.use('/', routes);
// app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});


module.exports = app;
