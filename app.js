/**
 * @ngdoc directive
 * @name rfx.directive:rAutogrow
 * @element textarea
 * @function
 *
 * @description
 * Resize textarea automatically to the size of its text content.
 *
 * **Note:** ie<9 needs pollyfill for window.getComputedStyle
 *
 * @example
 <example module="rfx">
 <file name="index.html">
 <textarea ng-model="text" r-autogrow class="input-block-level"></textarea>
 <pre>{{text}}</pre>
 </file>
 </example>
 */

var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');


var userdb = require('./models/userdb');

var facebook = require('./routes/facebook');
var google = require('./routes/google');
var kakao = require('./routes/kakao');
var tumblr = require('./routes/tumblr');
var twitter = require('./routes/twitter');
var Wordpress = require('./routes/wordpress');
var tistory = require('./routes/tistory');
var blogRoutes = require('./routes/blogRoutes');

var app = express();

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/facebook', facebook);
app.use('/google', google);
app.use('/kakao', kakao);
app.use('/tumblr', tumblr);
app.use('/twitter', twitter);
app.use('/Wordpress', Wordpress);
app.use('/tistory', tistory);
app.use('/blog', blogRoutes);

app.use('/user', function (req, res) {
   if (!req.user) {
        res.write('NAU');
   }
   else {
       console.log('user ' + JSON.stringify(req.user));
       res.write(JSON.stringify(req.user));
   }
   res.end();
});

app.use('/logout', function (req, res) {
    req.logout();
    res.redirect("/#");
});

var childm = require('./routes/childmanager');

app.route('/child_port')
    .get(function (req, res) {
        console.log('get child_port of user');

        if (req.user) {
            var port = childm.get_child_port(req.user);
            console.log('route: child_port='+port);
            res.send({'child_port':port});
        }
        else {
            var errorMsg = 'You have to login first!';
            console.log(errorMsg);
            res.send(errorMsg);
            res.redirect("/#/signin");
        }
    });


/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
