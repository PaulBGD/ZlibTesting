var async = require('async');
var zlib = require('zlib');
var rawdeflate = require('./rawdeflate');

var smallest = '';
var medium = '';
var large = '';

for (var i = 0; i < 100000; i++) { // 100,000
    if (i < 500) {
        smallest += String.fromCharCode(Math.ceil(Math.random() * 26) + 97);
    }
    if (i < 50000) { // 50,000
        medium += String.fromCharCode(Math.ceil(Math.random() * 26) + 97);
    }
    large += String.fromCharCode(Math.ceil(Math.random() * 26) + 97);
}

var smallBuffer = new Buffer(smallest);
var mediumBuffer = new Buffer(medium);
var largeBuffer = new Buffer(large);

function time(func, callback) {
    var time = Date.now();
    var iterations = 0;
    function next() {
        if (iterations++ == 1000) {
            console.log('Took ' + (Date.now() - time) + 'ms');
            callback();
        } else {
            func(next);
        }
    }
    func(next);
}

async.series([
    function (callback) {
        console.log('Deflating smallest string using zlib..');
        time(function zlibSmallest(next) {
            zlib.deflate(smallBuffer, function() {
                next();
            });
        }, callback);
    },
    function (callback) {
        console.log('Deflating medium string using zlib..');
        time(function zlibMedium(next) {
            zlib.deflate(mediumBuffer, function() {
                next();
            });
        }, callback);
    },
    function (callback) {
        console.log('Deflating largest string using zlib..');
        time(function zlibLargest(next) {
            zlib.deflate(largeBuffer, function() {
                next();
            });
        }, callback);
    },
    function (callback) {
        console.log('Deflating smallest string using javascript..');
        time(function jsSmallest(next) {
            rawdeflate(smallest);
            next();
        }, callback);
    },
    function (callback) {
        console.log('Deflating medium string using javascript..');
        time(function jsMedium(next) {
            rawdeflate(medium);
            next();
        }, callback);
    },
    function (callback) {
        console.log('Deflating largest string using javascript..');
        time(function jsLargest(next) {
            rawdeflate(large);
            next();
        }, callback);
    }
]);
