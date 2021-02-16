let EventTarget = (function() {
    this._listeners = {};

    this.bind = function(type, listener, ctx, priority) {
        if (typeof priority === "undefined") {
            priority = 0;
        }

        if (typeof listener !== "undefined" && listener !== null) {
            let obj = {callback: listener, context: ctx, priority: priority};
            let exists = false;
            let events;

            if (this._listeners[type] === undefined) {
                this._listeners[type] = [];
            }

            events = this._listeners[type];

            for (let i = 0; i < events.length; i++) {
                if (events[i].callback === listener && events[i].context === ctx) {
                    exists = true;
                    break;
                }
            }

            if (exists === false) {
                this._listeners[type].push(obj);
                this._listeners[type].sort(_sortByPriorityDesc);
            }
        }
    };

    let _sortByPriorityDesc = function(a, b) {
        return (b.priority - a.priority);
    };

    this.trigger = function(type, params, extra) {
        let events = this._listeners[type];
        if (typeof events !== "undefined") {
            for (let i = 0; i < events.length; i++) {
                let event = events[i];
                event.callback.call(event.context, {type: type, params: params || {}, extra: extra || {}});
            }
        }
    };

    this.unbind = function(type, listener, ctx) {
        let index = -1;
        let events = this._listeners[type];

        if (typeof listener !== "undefined") {
            if (typeof events !== "undefined") {
                for (let i = 0; i < events.length; i++) {
                    if (events[i].callback === listener && events[i].context === ctx) {
                        index = i;
                        break;
                    }
                }

                if (index !== -1) {
                    this._listeners[type].splice(index, 1);
                }
            }
        }

        else {
            this._listeners[type] = [];
        }
    };
});
