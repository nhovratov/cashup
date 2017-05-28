var assert = chai.assert;
var Cashup = cashup2.Cashup;
var Person = cashup2.Person;
var Amount = cashup2.Amount;

describe("Cashup", function () {
    describe("constructor", function () {
        it("should have the constructor Cashup", function () {
            var cashup = new Cashup();
            var proto = Object.getPrototypeOf(cashup);
            assert(proto.constructor === Cashup, "Cashup is not the constructor");
        });
    });
    describe("addPerson", function () {
        it("should add a Person to the persons array", function () {
            var cashup = new Cashup();
            cashup.addPerson("Nikita");
            assert(cashup.persons.length === 1, "No person was added.");
        });
        it("shouldn't add more than 2 Persons", function () {
            var cashup = new Cashup();
            cashup.addPerson("Nikita");
            cashup.addPerson("Nikita");
            cashup.addPerson("Nikita");
            assert(cashup.persons.length === 2, "There are more than 2 persons in the array.");
        });
    });
    describe("cashup", function () {
        it("should only work, when 2 people are in the persons array", function () {
            var cashup = new Cashup();
            cashup.addPerson("Nikita");
            var res = cashup.cashup();
            assert.isFalse(res, "function is running, although there arent 2 people.")
        });
        it("should return the right due.", function () {
            var cashup = new Cashup();
            cashup.addPerson("Nikita");
            cashup.addPerson("Lisa");
            cashup.persons[0].addAmount(15);
            cashup.persons[0].addAmount(25);
            cashup.persons[0].addAmount(30);
            cashup.persons[1].addAmount(5);
            cashup.persons[1].addAmount(15);
            cashup.persons[1].addAmount(20.5);
            cashup.cashup(true);
            assert(cashup.result.text === "14.75", "Wrong value returned, expected 15");
        });
    });
    describe("getFullSum", function () {
        it("should return the complete sum of all amounts of all persons", function () {
            var cashup = new Cashup();
            cashup.addPerson("Nikita");
            cashup.addPerson("Lisa");
            cashup.persons[0].addAmount(15);
            cashup.persons[0].addAmount(25);
            cashup.persons[0].addAmount(30);
            cashup.persons[1].addAmount(5);
            cashup.persons[1].addAmount(15);
            cashup.persons[1].addAmount(20.5);
            var sum = cashup.getFullSum();
            assert(sum === "110.50", "The sum is not 110.50");
        });
        it("should take negative (own costs) in account", function () {
            var cashup = new Cashup();
            cashup.addPerson("Nikita");
            cashup.addPerson("Lisa");
            cashup.persons[0].addAmount(15);
            cashup.persons[0].addAmount(25);
            cashup.persons[0].addAmount(30);
            cashup.persons[1].addAmount(5);
            cashup.persons[1].addAmount(15);
            cashup.persons[1].addAmount(20.5);
            cashup.persons[1].addAmount(-10.5);
            var sum = cashup.getFullSum();
            assert(sum === "100.00", "The sum is not 100.00");
        });
    });
    describe("setRealSumOfPersons", function () {
        it("should set the half of the realSum plus own costs as realSum for every person", function () {
            var cashup = new Cashup();
            cashup.addPerson("Nikita");
            cashup.addPerson("Lisa");
            cashup.persons[0].addAmount(15);
            cashup.persons[0].addAmount(25);
            cashup.persons[0].addAmount(30);
            cashup.persons[1].addAmount(5);
            cashup.persons[1].addAmount(15);
            cashup.persons[1].addAmount(20.5);
            cashup.persons[1].addAmount(-10.5);
            cashup.setRealSumOfPersons();
            var sum = cashup.persons[0].realSum;
            assert(sum === "50.00", "The sum is not 50.00");
        });
        it("should add own costs", function () {
            var cashup = new Cashup();
            cashup.addPerson("Nikita");
            cashup.addPerson("Lisa");
            cashup.persons[0].addAmount(15);
            cashup.persons[0].addAmount(25);
            cashup.persons[0].addAmount(30);
            cashup.persons[1].addAmount(5);
            cashup.persons[1].addAmount(15);
            cashup.persons[1].addAmount(20.5);
            cashup.persons[1].addAmount(-10.5);
            cashup.setRealSumOfPersons();
            var sum = cashup.persons[1].realSum;
            assert(sum === "60.50", "The sum is not 50.00");
        });
    });
});

describe("Person", function () {
    describe("constructor", function () {
        it("should have the constructor Person", function () {
            var person = new Person("Nikita");
            var proto = Object.getPrototypeOf(person);
            assert(proto.constructor === Person, "Person is not the constructor");
        });
    });
    describe("addAmount", function () {
        it("should add an Amount to the list", function () {
            var person = new Person("Nikita");
            person.addAmount();
            assert(person.amounts.length === 1, "No Amount added to the list");
        });
    });
    describe("removeAmount", function () {
        it("should remove an Amount from the list", function () {
            var person = new Person("Nikita");
            person.addAmount();
            person.addAmount();
            person.addAmount();
            person.removeAmount(1);
            assert(person.amounts.length === 2, "No Amount removed from the list");
        });
    });
    describe("getSum", function () {
        it("should return 0, as the array is empty", function () {
            var person = new Person("Nikita");
            var sum = person.getSum();
            assert(sum === "0.00", "The sum is not 0.00");
        });
        it("should return the sum of the Amounts array[1].", function () {
            var person = new Person("Nikita");
            person.addAmount(1.10);
            var sum = person.getSum();
            assert(sum === "1.10", "The sum is not 1.1");
        });
        it("should return the sum of the Amounts array[2]", function () {
            var person = new Person("Nikita");
            person.addAmount(1);
            person.addAmount(2);
            var sum = person.getSum();
            assert(sum === "3.00", "The sum is not 3.3");
        });
        it("should return the sum of the Amounts array[3]", function () {
            var person = new Person("Nikita");
            person.addAmount(1.1);
            person.addAmount(2.2);
            person.addAmount(3.3);
            var sum = person.getSum();
            assert(sum === "6.60", "The sum is not 6.6");
        });
    });
    describe("getPersonId", function () {
        it("should return the index of the person", function () {
            var cashup = new Cashup();
            cashup.addPerson("Nikita");
            cashup.addPerson("Lisa");
            var index = cashup.persons[1].personId;
            assert(index === 2, "The index of the second person is not 2");
        });
    });
    describe("getSumOfNegativeAmounts", function () {
        it("should return the sum of all negative amounts", function () {
            var cashup = new Cashup();
            cashup.addPerson("Nikita");
            cashup.persons[0].addAmount(12.23);
            cashup.persons[0].addAmount(1.11);
            var negativeAmount = cashup.persons[0].getSumOfNegativeAmounts();
            assert(negativeAmount === "0.00", "The sum of all negative amounts is not 0.00");
        });
        it("should return the sum of all negative amounts", function () {
            var cashup = new Cashup();
            cashup.addPerson("Nikita");
            cashup.persons[0].addAmount(12.23);
            cashup.persons[0].addAmount(-1.19);
            cashup.persons[0].addAmount(1.11);
            var negativeAmount = cashup.persons[0].getSumOfNegativeAmounts();
            assert(negativeAmount === "1.19", "The sum of all negative amounts is not -1.19");
        });
        it("should return the sum of all negative amounts", function () {
            var cashup = new Cashup();
            cashup.addPerson("Nikita");
            cashup.persons[0].addAmount(12.23);
            cashup.persons[0].addAmount(-1.19);
            cashup.persons[0].addAmount(-1.11);
            var negativeAmount = cashup.persons[0].getSumOfNegativeAmounts();
            assert(negativeAmount === "2.30", "The sum of all negative amounts is not -2.30");
        });
        it("should return the sum of all negative amounts", function () {
            var cashup = new Cashup();
            cashup.addPerson("Nikita");
            cashup.persons[0].addAmount(12.23);
            cashup.persons[0].addAmount(-33.33);
            cashup.persons[0].addAmount(-1.19);
            cashup.persons[0].addAmount(-1.11);
            var negativeAmount = cashup.persons[0].getSumOfNegativeAmounts();
            assert(negativeAmount === "35.63", "The sum of all negative amounts is not -35.63");
        });
    });
});

describe("Amount", function () {
    describe("constructor", function () {
        it("should have the constructor Amount", function () {
            var amount = new Amount();
            var proto = Object.getPrototypeOf(amount);
            assert(proto.constructor === Amount, "Amount is not the constructor");
        });
    });
    describe("setValue", function () {
        it("should set a value of the Amount", function () {
            var amount = new Amount();
            amount.setValue(1.11);
            assert(typeof amount.value === "number", "Amount is not a number");
        });
    });
});
