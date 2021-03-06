var assert = chai.assert;
var api = cashup2.constructors;
var Cashup = api.Cashup;
var Person = api.Person;
var Amount = api.Amount;

describe("Cashup", function() {
  describe("constructor", function() {
    it("should have the constructor Cashup", function() {
      var cashup = new Cashup();
      var proto = Object.getPrototypeOf(cashup);
      assert(proto.constructor === Cashup, "Cashup is not the constructor");
    });
  });
  describe("addPerson", function() {
    it("should add a Person to the persons array", function() {
        var cashup = new Cashup();
        cashup.addPerson("Nikita");
        assert(cashup.persons.length === 1, "No person was added.");
    });
    it("shouldn't add more than 2 Persons", function() {
      var cashup = new Cashup();
      cashup.addPerson("Nikita");
      cashup.addPerson("Nikita");
      cashup.addPerson("Nikita");
      assert(cashup.persons.length === 2, "There are more than 2 persons in the array.");
    });
  });
  describe("cashup", function() {
    it("should only work, when 2 people are in the persons array", function() {
      var cashup = new Cashup();
      cashup.addPerson("Nikita");
      var res = cashup.cashup();
      assert.isFalse(res, "function is running, although there arent 2 people.")
    });
    it("should return the right due.", function() {
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
      assert(cashup.result === "14.75", "Wrong value returned, expected 15");
    });
  });
});

describe("Person", function() {
  describe("constructor", function() {
    it("should have the constructor Person", function() {
      var person = new Person("Nikita");
      var proto = Object.getPrototypeOf(person);
      assert(proto.constructor === Person, "Person is not the constructor");
    });
  });
  describe("addAmount", function() {
    it("should add an Amount to the list", function() {
      var person = new Person("Nikita");
      person.addAmount();
      assert(person.amounts.length === 1, "No Amount added to the list");
    });
  });
  describe("removeAmount", function() {
    it("should remove an Amount from the list", function() {
      var person = new Person("Nikita");
      person.addAmount();
      person.addAmount();
      person.addAmount();
      person.removeAmount(1);
      assert(person.amounts.length === 2, "No Amount removed from the list");
    });
  });
  describe("getSum 1", function() {
    it("should return 0, as the array is empty", function() {
      var person = new Person("Nikita");
      var sum = person.getSum();
      assert(sum === "0.00", "The sum is not 0.00");
    });
  });
  describe("getSum 2", function() {
    it("should return the sum of the Amounts array.", function() {
      var person = new Person("Nikita");
      person.addAmount(1.10);
      var sum = person.getSum();

      assert(sum === "1.10", "The sum is not 1.1");
    });
  });
  describe("getSum 3", function() {
    it("should return the sum of the Amounts array.", function() {
      var person = new Person("Nikita");
      person.addAmount(1);
      person.addAmount(2);
      var sum = person.getSum();

      assert(sum === "3.00", "The sum is not 3.3");
    });
  });
  describe("getSum 4", function() {
    it("should return the sum of the Amounts array.", function() {
      var person = new Person("Nikita");
      person.addAmount(1.1);
      person.addAmount(2.2);
      person.addAmount(3.3);
      var sum = person.getSum();
      assert(sum === "6.60", "The sum is not 6.6");
    });
  });
  describe("getPersonId", function() {
    it("should return the index of the person", function() {
      var cashup = new Cashup();
      cashup.addPerson("Nikita");
      cashup.addPerson("Lisa");
      var index = cashup.persons[1].personId;
      assert(index === 2, "The index of the second person is not 2");
    });
  });
});

describe("Amount", function() {
  describe("constructor", function() {
    it("should have the constructor Amount", function() {
      var amount = new Amount();
      var proto = Object.getPrototypeOf(amount);
      assert(proto.constructor === Amount, "Amount is not the constructor");
    });
  });
  describe("setValue", function() {
    it("should set a value to the Amount", function() {
      var amount = new Amount();
      amount.setValue(1.11);
      assert(typeof amount.value === "number", "Amount is not a number");
    });
  });
});
