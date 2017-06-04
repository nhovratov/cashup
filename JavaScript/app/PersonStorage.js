
define(['app/Person'], function (Person) {
    "use strict";
    function PersonStorage() {
        this.persons = [];
    }

    PersonStorage.prototype.addPerson = function (name) {
        var index = this.persons.push(new Person(name));
        this.persons[this.persons.length - 1].personId = index;
    };

    PersonStorage.prototype.getFullSum = function () {
        var sum = 0;
        this.persons.forEach(function (person) {
            sum += Number(person.getSum());
        });
        return sum.toFixed(2);
    };

    PersonStorage.prototype.reset = function () {
        this.persons.forEach(function (person) {
            person.amounts = [];
        });
    };

    return PersonStorage;

});
