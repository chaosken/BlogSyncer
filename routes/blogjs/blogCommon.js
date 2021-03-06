var userdb      = require('../../models/userdb');
var request     = require('request');

var API_WORDPRESS_COM = "https://public-api.wordpress.com/rest/v1";

getUserId = function (req) {
    var userid = 0;

    if (req.user) {
        userid = req.user.id;
    }
    else if (req.query.userid)
    {
        //this request form child process;
        userid = req.query.userid;
    }

    return userid;
};

function getWPPosts(req, res) {
    var user_id = getUserId(req);
    console.log(user_id);
    if (user_id == 0) {
        var errorMsg = 'You have to login first!';
        console.log(errorMsg);
        res.send(errorMsg);
        res.redirect("/#/signin");
        return;
    }

    //var p = userdb.findProviderId(user_id, req.query.providerid);
    var p = userdb.findProvider(user_id, "Wordpress");
    console.log(p);
    var blog_id = p.providerId;
    console.log(blog_id);
    var api_url = API_WORDPRESS_COM+"/sites/"+blog_id+"/posts";

    console.log(api_url);

    request.get(api_url, {
        json: true,
        headers: {
            "authorization": "Bearer " + p.accessToken
        }
    }, function (err, response, data) {
        console.log("[blogCommon-getWPPosts]" + data);
        res.send(data);
    });
}

function getWPComments(req, res) {
    var user_id = getUserId(req);
    if (user_id == 0) {
        var errorMsg = 'You have to login first!';
        console.log(errorMsg);
        res.send(errorMsg);
        res.redirect("/#/signin");
        return;
    }

    var p = userdb.findProvider(user_id, "Wordpress");
    var blog_id = p.providerId;
    var posts_id = req.params.postsID;
    var api_url = API_WORDPRESS_COM+"/sites/"+blog_id+"/posts/"+posts_id+"/replies";
    //var api_url = API_WORDPRESS_COM+"/sites/"+blog_id+"/comments";

    //console.log(req);

    request.get(api_url, {
        json: true,
        headers: {
            "authorization": "Bearer " + p.accessToken
        }
    }, function (err, response, data) {
        console.log(data);
        res.send(data);
    });
}

exports.API_WORDPRESS_COM   = API_WORDPRESS_COM;

exports.getWPPosts          = getWPPosts;
exports.getWPComments       = getWPComments;
