/**
 * timbre/timeout
 */
"use strict";

var timbre = require("../timbre");
// __BEGIN__

/**
 * Timeout: 0.1.0
 * Calls a bang() after specified delay
 * [kr-only]
 */
var Timeout = (function() {
    var Timeout = function() {
        initialize.apply(this, arguments);
    }, $this = Timeout.prototype;
    
    timbre.fn.setPrototypeOf.call($this, "kr-only");
    timbre.fn.setPrototypeOf.call($this, "timer");
    
    Object.defineProperty($this, "timeout", {
        set: function(value) {
            if (typeof value === "number" && value > 0) {
                this._.timeout = value;
                this._.timeout_samples = (timbre.samplerate * (value / 1000))|0;
            }
        },
        get: function() { return this._.timeout; }
    });
    Object.defineProperty($this, "currentTime", {
        get: function() { return this._.currentTime; }
    });
    
    var initialize = function(_args) {
        var i, _;

        this._ = _ = {};
        
        i = 0;
        if (typeof _args[i] === "number") {
            this.timeout = _args[i++];
        } else {
            this.timeout = 1000;
        }
        this.args = timbre.fn.valist.call(this, _args.slice(i));
        
        _.ison = false;
        _.samples = 0;
        _.currentTime = 0;
    };
    
    $this.clone = function(deep) {
        return timbre("timeout", this._.timeout);
    };

    $this._.on = function() {
        this._.samples = this._.timeout_samples;
    };
    
    $this.bang = function() {
        var _ = this._;
        
        _.samples = _.timeout_samples;
        _.currentTime = 0;
        timbre.fn.do_event(this, "bang");
        
        return this;
    };
    
    $this.seq = function(seq_id) {
        var _ = this._;
        var args, i, imax;
        if (seq_id !== this.seq_id) {
            this.seq_id = seq_id;
            _.samples -= timbre.cellsize;
            if (_.samples <= 0) {
                _.samples = 0;
                args = this.args.slice(0);
                for (i = 0, imax = args.length; i < imax; ++i) {
                    args[i].bang();
                }
                if (_.samples <= 0) this.off();
            }
            _.currentTime += timbre.cellsize * 1000 / timbre.samplerate;
        }
        return this.cell;
    };
    
    return Timeout;
}());
timbre.fn.register("timeout", Timeout);

// __END__

describe("timeout", function() {
    object_test(Timeout, "timeout");
});
