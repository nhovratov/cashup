define(['app/Amount'], function (Amount) {

    function Person(name) {
        this.name = name;
        this.amounts = [];
        this.personId = null;
        this.realSum = null;
    }

    Person.prototype.addAmount = function (amount) {
        amount = amount || null;
        var index = this.amounts.push(new Amount(amount));
        this.amounts[this.amounts.length - 1].index = index;
    };

    Person.prototype.removeAmount = function (index) {
        this.amounts.splice(index, 1);
    };

    Person.prototype.getSum = function () {
        var sum = 0.00;
        this.amounts.forEach(function (el) {
            sum += el.getValue();
        });
        return sum.toFixed(2);
    };

    Person.prototype.renumberAmounts = function () {
        this.amounts.forEach(function (el, index) {
            el.index = index + 1;
        });
    };

    Person.prototype.getSumOfNegativeAmounts = function () {
        var negativeSum = 0;
        this.amounts.forEach(function (el) {
            if (el.getValue() < 0) {
                negativeSum += el.getValue();
            }
        });
        return Math.abs(negativeSum).toFixed(2);
    };

    return Person;
});
