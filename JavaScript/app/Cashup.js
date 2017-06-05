
define(['app/PersonStorage'], function (PersonStorage) {
    "use strict";
    function Cashup() {
        this.persons = [];
    }

    // Inheritance
    Cashup.prototype = new PersonStorage();
    Cashup.prototype.constructor = Cashup;

    /**
     * @param status @type {Status}
     * @return {boolean}
     */
    Cashup.prototype.validateAmounts = function (status) {
        var p1 = this.persons[0];
        var p2 = this.persons[1];
        var sum1 = Number(p1.getSum());
        var sum2 = Number(p2.getSum());

        if (sum1 < 0 || sum2 < 0) {
            status.text = "Negative Kosten sind dafür da, um Eigenkosten rauszufiltern. Bitte geben Sie einen" +
                "positiven Grundbetrag an. Um pure Eigenausgaben einzutragen, benutzen Sie das Formular für eigene Ausgaben.";
            return false;
        }

        return true;
    };

    /**
     * @param status @type {Status}
     * @return {boolean|string}
     */
    Cashup.prototype.cashup = function (status) {
        if (this.persons.length !== 2) {
            console.error("Cashup only possible with 2 persons");
            return false;
        }
        var p1 = this.persons[0];
        var p2 = this.persons[1];
        var sum1 = Number(p1.getSum());
        var sum2 = Number(p2.getSum());
        var diff = Math.abs(sum1 - sum2);
        var due = (diff / 2).toFixed(2);

        if (!status) {
            return due;
        }

        if (sum1 > sum2) {
            status.text = p2.name + " schuldet " + p1.name + " " + due + "€";
        } else if (sum2 > sum1) {
            status.text = p1.name + " schuldet " + p2.name + " " + due + "€";
        } else {
            status.text = "Die Beträge sind ausgeglichen.";
        }

        return due;

    };

    /**
     * The real sum consists of half the full sum plus the own costs that are indicated as negative amounts
     */
    Cashup.prototype.setRealSumOfPersons = function () {
        var fullSum = this.getFullSum();
        this.persons.forEach(function (el) {
            el.realSum = ((Number(fullSum) / 2) + Number(el.getSumOfNegativeAmounts())).toFixed(2);
        });
    };

    return Cashup;

});
