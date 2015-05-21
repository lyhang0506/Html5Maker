this.Util = this.Util || {};

(function () {

    var HashMap = function () {
        this.map = new Object();
    };

    var hm = HashMap.prototype;

    hm.map = null;

    hm.put = function(key, value) {
        this.map[key] = value;
    };

    hm.get = function (key) {
        return this.map[key];
    };

    hm.containsKey = function (key) {
        return this.get(key) == null ? false : true;
    };

    hm.remove = function (key) {
        delete this.map[key];
    };

    Util.HashMap = HashMap;

}());