var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'LicksDB',
    types: ['major', 'minor', 'dominant'],
    keys: ['C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F', 'F#/Gb', 'G', 'G#/Ab', 'A', 'A#/Bb', 'B'],
    meters: ['4/4', '3/4', '3/8']});
});

router.post('/select_parameters', function(req, res) {
    var type = req.body.selected_type;
    var key = req.body.selected_key;
    var meter = req.body.selected_meter;
    var db = req.db;
    var licks = db.get('licks');
    licks.find({'type': type, 'key': key, 'meter': meter},{},function(e,docs){
        res.render('results', {
            "results" : docs,
            title: 'Results',
            type: type,
            key: key,
            meter: meter
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
    licktext = licktext.split("\n").join("\\n"); //replace all /n with //n's
    licktext = licktext.split("\r").join("\\r"); //replace all /n with //n's
    licktext = licktext.split("\'").join("\\'"); //escape quotes
    
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
