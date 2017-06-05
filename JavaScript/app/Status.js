
define(function () {
    function Status(visibility) {
        visibility = visibility || 'hidden';
        this.text = '';
        this.class = visibility;
    }

    Status.prototype.show = function () {
        this.class = 'visible';
    };

    Status.prototype.hide = function () {
        this.class = 'hidden';
    };

    return Status;
});
