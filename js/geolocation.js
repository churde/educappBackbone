app.geolocation = {
    getCurrentLocation: function(_args) {
        // onError Callback receives a PositionError object
        //
        function onError(error) {
            alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
        }

        navigator.geolocation.getCurrentPosition(_args.success, onError);

    },
    watchPosition: function(_args) {

        var positionWatchId = navigator.geolocation.watchPosition(_args.success, _args.error, _args.options);
    },
    watchHeading: function(_args) {
        

        var headingWatchId = navigator.compass.watchHeading(_args.success, _args.error, _args.options);
    },
    calculateDistance: function(_args) {

        var lat1 = _args.lat1, long1 = _args.long1, lat2 = _args.lat2, long2 = _args.long2;

        var R = 6371; // Radius of the earth in km
        var dLat = (lat2 - lat1).toRad();  // Javascript functions in radians
        var dLon = (long2 - long1).toRad();
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km

        return Math.floor(d * 1000);


    },
    calculateAngle: function(_args) {
        var lat1 = _args.lat1, long1 = _args.long1, lat2 = _args.lat2, long2 = _args.long2;

        var dLat = (lat2 - lat1).toRad();  // Javascript functions in radians
        var dLon = (long2 - long1).toRad();

        var angle = Math.atan2(-dLon, dLat);

        if (angle < 0) {
            angle += 2 * Math.PI;
        }

        angle = angle * 180 / Math.PI;

        return angle;

    }
}



/** Converts numeric degrees to radians */
if (typeof(Number.prototype.toRad) === "undefined") {
    Number.prototype.toRad = function() {
        return this * Math.PI / 180;
    }
}
if (typeof(String.prototype.toRad) === "undefined") {
    String.prototype.toRad = function() {
        return this * Math.PI / 180;
    }
}