var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'LicksDB', types: ['major', 'minor', 'dominant'] });
});

/* hello world page. */
router.get('/helloworld', function(req, res) {
  res.render('helloworld', { title: 'Hello, World!' });
});

/* GET Userlist page. */
router.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('usercollection');
    collection.find({},{},function(e,docs){
        res.render('userlist', {
            "userlist" : docs
        });
    });
});

/* GET New User page. */
router.get('/newuser', function(req, res) {
    res.render('newuser', { title: 'Add New User' });
});


/* POST to Add User Service */
router.post('/adduser', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var userName = req.body.username;
    var userEmail = req.body.useremail;

    // Set our collection
    var collection = db.get('usercollection');

    // Submit to the DB
    collection.insert({
        "username" : userName,
        "email" : userEmail
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // If it worked, set the header so the address bar doesn't still say /adduser
            res.location("userlist");
            // And forward to success page
            res.redirect("userlist");
        }
    });
});

router.post('/select_type', function(req, res) {
    var type = req.body.selected_type;
    // var key = req.body.selected_key;
    // var meter = req.body.selected_meter;
    var db = req.db;
    var licks = db.get('licks');
    licks.find({"type": type},{},function(e,docs){
        res.render('results', {
            "results" : docs,
            title: 'Results',
            type: type
        });
    });
});

// new lick page
router.get('/newlick', function(req, res) {
    res.render('newlick', {title: 'Add New Lick'});
});

//POST to new lick submit
router.post('/licksubmit', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var type = req.body.type;
    var key = req.body.key;
    var meter = req.body.meter;
    var licktext = req.body.licktext;
    // console.log(key);
    // console.log(meter);
    // console.log(licktext);
    console.log("before:\n");
    console.log(licktext);
    console.log("after:\n");
    licktext = licktext.split("\n").join("\\n"); //replace all /n with //n's
    licktext = licktext.split("\r").join("\\r"); //replace all /n with //n's
    //licktext = licktext.replace("\n", "\\n");
    console.log(licktext);
    // Set our collection
    var collection = db.get('licks');

    // Submit to the DB
    collection.insert({
        "type" : type,
        "key" : key,
        "meter" : meter,
        "lick" : licktext
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // If it worked, set the header so the address bar doesn't still say /adduser
            res.location("/");
            // And forward to success page
            res.redirect("/");
        }
    });
});

module.exports = router;
