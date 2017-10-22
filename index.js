var admin = require("firebase-admin");

var sourceAccount = require("./legcount-prod.json");
var destinationAccount = require("./legcount-dev.json");

admin.initializeApp({
    credential: admin.credential.cert(sourceAccount),
    databaseURL: "https://roll-call-cb84e.firebaseio.com/"
});

var destination = admin.initializeApp({
    credential: admin.credential.cert(destinationAccount),
    databaseURL: "https://leg-count-dev.firebaseio.com/"
}, "destination");

exports.handler = function(event, context, callback) {
    var db = admin.database().ref();
    var dbDestination = destination.database().ref();

    db.once("value", function(snap) {
        dbDestination.set(snap.val(), function(error) {
            if (error) {
                console.log("Data could not be saved." + error);
                context.fail(error);
            } else {
                console.log("Data saved properly.");
                var syncTime = destination.database().ref("sync");
                syncTime.set({ time: getDateTime() }, function(error) {
                    if (error) {
                        console.log("Sync time could not be updated:" + error);
                        context.fail(error);
                    } else {
                        console.log("Sync time updated.");
                        context.succeed("Success");
                    }
                });
            }
        });
    });

    function getDateTime() {

        var date = new Date();

        var hour = date.getHours();
        hour = (hour < 10 ? "0" : "") + hour;

        var min  = date.getMinutes();
        min = (min < 10 ? "0" : "") + min;

        var sec  = date.getSeconds();
        sec = (sec < 10 ? "0" : "") + sec;

        var year = date.getFullYear();

        var month = date.getMonth() + 1;
        month = (month < 10 ? "0" : "") + month;

        var day  = date.getDate();
        day = (day < 10 ? "0" : "") + day;

        return hour + ":" + min + ":" + sec  + " - " + month + "/" + day + "/" + year
    }
};
