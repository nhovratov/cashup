var assert = chai.assert;
var api = cashup2.api;
var Person = api.Person;
var Amount = api.Amount;

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
      var amount = new Amount();
      person.addAmount(amount);
      assert(person.amounts.length === 1, "No Amount added to the list");
    });
  });
  describe("removeAmount", function() {
    it("should remove an Amount from the list", function() {
      var person = new Person("Nikita");
      person.addAmount(new Amount());
      person.addAmount(new Amount());
      person.addAmount(new Amount());
      person.removeAmount(1,1);
      assert(person.amounts.length === 2, "No Amount removed from the list");
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
