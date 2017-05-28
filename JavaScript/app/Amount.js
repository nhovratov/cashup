define(function () {
    "use strict";
    function Amount(value) {
        value = value || null;
        this.setValue(value);
        this.index = null;
    }

    Amount.prototype.setValue = function (val) {
        if (val !== '' && val !== null) {
            this.value = parseFloat(val);
        } else {
            this.value = null;
        }
    };

    Amount.prototype.getValue = function () {
        return this.value || 0;
    };

    return Amount;
});
