
require.config({baseUrl: '../JavaScript'});
require(
    [
        'app/Amount',
        'app/Person',
        'app/PersonStorage',
        'app/Cashup'
    ], function(Amount, Person, PersonStorage, Cashup) {
    var assert = chai.assert;
    mocha.setup('bdd');

    describe("Amount", function () {
            describe("setValue", function () {
                it("should set a value of the Amount", function () {
                    var amount = new Amount();
                    amount.setValue(1.11);
                    assert(typeof amount.value === "number", "Amount is not a number");
                });
            });
        });
    describe("Person", function () {
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
    describe("PersonStorage", function () {
        describe("addPerson", function () {
            it("should add a Person to the persons array", function () {
                var personStorage = new PersonStorage();
                personStorage.addPerson("Nikita");
                assert(personStorage.persons.length === 1, "No person was added.");
            });
        });
        describe("getFullSum", function () {
            it("should return the complete sum of all amounts of all persons", function () {
                var personStorage = new PersonStorage();
                personStorage.addPerson("Nikita");
                personStorage.addPerson("Lisa");
                personStorage.persons[0].addAmount(15);
                personStorage.persons[0].addAmount(25);
                personStorage.persons[0].addAmount(30);
                personStorage.persons[1].addAmount(5);
                personStorage.persons[1].addAmount(15);
                personStorage.persons[1].addAmount(20.5);
                var sum = personStorage.getFullSum();
                assert(sum === "110.50", "The sum is not 110.50");
            });
            it("should take negative (own costs) in account", function () {
                var personStorage = new PersonStorage();
                personStorage.addPerson("Nikita");
                personStorage.addPerson("Lisa");
                personStorage.persons[0].addAmount(15);
                personStorage.persons[0].addAmount(25);
                personStorage.persons[0].addAmount(30);
                personStorage.persons[1].addAmount(5);
                personStorage.persons[1].addAmount(15);
                personStorage.persons[1].addAmount(20.5);
                personStorage.persons[1].addAmount(-10.5);
                var sum = personStorage.getFullSum();
                assert(sum === "100.00", "The sum is not 100.00");
            });
        });
        describe("reset", function () {
            it("should remove all amounts of all persons", function () {
                var personStorage = new PersonStorage();
                personStorage.addPerson("Nikita");
                personStorage.addPerson("Lisa");
                personStorage.persons[0].addAmount(15);
                personStorage.persons[0].addAmount(25);
                personStorage.persons[1].addAmount(20.5);
                personStorage.persons[1].addAmount(-10.5);
                personStorage.reset();
                var len = personStorage.persons[0].amounts.length + personStorage.persons[1].amounts.length;
                assert.strictEqual(len, 0, "There are still items in the array.");
            })
        })
    });
    describe("Cashup", function () {
        describe("cashup", function () {
            it("should only work, when 2 people are in the persons array", function () {
                var cashup = new Cashup();
                cashup.addPerson("Nikita");
                var res = cashup.cashup();
                assert.isFalse(res, "function is running, although there arent 2 people.");
            });
            it("should return the right due.", function () {
                var cashup = new Cashup();
                var result;
                cashup.addPerson("Nikita");
                cashup.addPerson("Lisa");
                cashup.persons[0].addAmount(15);
                cashup.persons[0].addAmount(25);
                cashup.persons[0].addAmount(30);
                cashup.persons[1].addAmount(5);
                cashup.persons[1].addAmount(15);
                cashup.persons[1].addAmount(20.5);
                result = cashup.cashup();
                assert(result === "14.75", "Wrong value returned, expected 15");
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
    mocha.run();
});
