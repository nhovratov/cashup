define(['app/Person'], function (Person) {
    "use strict";
    function Cashup() {
        this.persons = [];
        this.result = new StatusBox();
        this.dbResult = new StatusBox();
        this.lastMonths = [];
    }

    Cashup.prototype.addPerson = function (name) {
        var index;
        if (this.persons.length === 2) {
            console.error("Only 2 persons are allowed!");
            return;
        }
        index = this.persons.push(new Person(name));
        this.persons[this.persons.length - 1].personId = index;
    };

    Cashup.prototype.validateAmounts = function () {
        var p1 = this.persons[0];
        var p2 = this.persons[1];
        var sum1 = Number(p1.getSum());
        var sum2 = Number(p2.getSum());

        if (sum1 < 0 || sum2 < 0) {
            this.result.text = "Negative Kosten sind dafür da, um Eigenkosten rauszufiltern. Bitte geben Sie einen" +
                "positiven Grundbetrag an. Um pure Eigenausgaben einzutragen, benutzen Sie das Formular für eigene Ausgaben.";
            return false;
        }

        return true;
    };

    Cashup.prototype.cashup = function (onlyDue) {
        onlyDue = onlyDue || false;
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

        if (onlyDue) {
            this.result.text = due;
            return;
        }

        if (sum1 > sum2) {
            this.result.text = p2.name + " schuldet " + p1.name + " " + due + "€";
        } else if (sum2 > sum1) {
            this.result.text = p1.name + " schuldet " + p2.name + " " + due + "€";
        } else {
            this.result.text = "Die Beträge sind ausgeglichen.";
        }

    };

    Cashup.prototype.getFullSum = function () {
        if (this.persons.length !== 2) {
            console.error("Only possible with 2 persons");
            return false;
        }
        var p1 = this.persons[0];
        var p2 = this.persons[1];
        var sum1 = Number(p1.getSum());
        var sum2 = Number(p2.getSum());
        var posSum = sum1 + sum2;
        return posSum.toFixed(2);
    };

    Cashup.prototype.setRealSumOfPersons = function () {
        var fullSum = this.getFullSum();
        this.persons.forEach(function (el) {
            el.realSum = ((Number(fullSum) / 2) + Number(el.getSumOfNegativeAmounts())).toFixed(2);
        });
    };

    Cashup.prototype.reset = function () {
        this.persons.forEach(function (person) {
            person.amounts = [];
        });
    };

    function StatusBox() {
        this.text = '';
        this.class = 'hidden';
    }

    return Cashup;

});