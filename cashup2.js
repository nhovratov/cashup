/*
Cashup2, The second version of the tool for calculating the owe value between 2 persons,
who share the costs in a household

Nikita Hovratov
github.com/nhovratov
*/

var cashup2 = (function() {
	// The global app
	var cashup = new Cashup();
	// Dom objects
	var amountsContainers = []; // Holds the amounts of the persons
	var addAmountButtons = [];
	var calcButton;

	// Data Structures / Models
	// The app containing the persons
	function Cashup() {
		this.persons = [];
	}

	Cashup.prototype.addPerson = function(name) {
		if (this.persons.length === 2) {
			console.error("Only 2 persons are allowed!");
			return;
		}
		this.persons.push(new Person(name));
	}

	Cashup.prototype.cashup = function(onlyDue = false) {
		if (cashup.persons.length !== 2) {
			console.error("Cashup only possible with 2 persons");
			return;
		}
		var p1 = cashup.persons[0];
		var p2 = cashup.persons[1];
		var sum1 = p1.getSum();
		var sum2 = p2.getSum();
		var diff = Math.abs(sum1 - sum2);
		var due = diff / 2;

		if (onlyDue) {
			return due;
		}

		if (sum1 > sum2) {
			return p2.name + " schuldet " + p1.name + " " + due + " Euro.";
		} else {
			return p1.name + " schuldet " + p2.name + " " + due + " Euro.";
		}

	}

	// Person
	function Person(name) {
		this.name = name;
		this.amounts = [];
	}

	Person.prototype.addAmount = function(amount = null) {
		this.amounts.push(new Amount(amount));
	}

	Person.prototype.removeAmount = function(index) {
		this.amounts.splice(index, 1);
	}

	Person.prototype.getSum = function() {
		var sum = this.amounts.reduce(function(res, element) {
			res = res.value || res;
			if ([res, element.value].indexOf(null) !== -1) {
				return res;
			} else {
				return res + element.value;
			}
		});
		return sum;
	}

	// Amount
	function Amount(value = null) {
		this.setValue(value);
	}

	Amount.prototype.setValue = function(val) {
		if (val !== '' && val !== null) {
			this.value = parseFloat(val);
		} else {
			this.value = null;
		}
	}

	// Holds the config for new input fields for amounts
	var AmountInput = function(index) {
		this.config.name = (index + 1) + "_amount[]";
	}

	AmountInput.prototype.config = {
		className: "amount_input",
		required: "required",
		type: "number",
		step: "0.01",
	}

	// Initialise app with passed config
	var init = function(config) {
		var appContainer = document.getElementById(config.id);
		if (!appContainer) {
			console.warn("Can't find the id in config.id");
			return;
		}
		if (config.names.length !== 2) {
			console.warn("Please provide 2 names in config.names");
			return;
		}
		// Add persons
		cashup.addPerson(config.names[0]);
		cashup.addPerson(config.names[1]);
		// Initial app render
		appContainer.appendChild(App());
		// Add events
		addAmountButtons[0].addEventListener("click", addAmountInput);
		addAmountButtons[1].addEventListener("click", addAmountInput);
	}

	// Factory functions for static app structure
	var App = function() {
		var form = document.createElement("form");
		var fieldset = document.createElement("fieldset");
		var legend = document.createElement("legend");
		calcButton = document.createElement("button");

		form.id = "cashup_form";
		legend.innerHTML = "Kassensturz";
		calcButton.id = "calc_cashup";
		calcButton.type = "submit";
		calcButton.innerHTML = "Berechnen!";

		fieldset.appendChild(legend);
		fieldset.appendChild(PersonContainer(0));
		fieldset.appendChild(PersonContainer(1));
		fieldset.appendChild(calcButton);
		form.appendChild(fieldset);

		return form;
	}

	var PersonContainer = function(index) {
		var name = cashup.persons[index].name;
		var num = index + 1;
		var personContainer = document.createElement("div");
		var headerName = document.createElement("p");
		var amountsContainer = document.createElement("div");
		var addAmountButton = document.createElement("button");

		personContainer.className = "amounts_wrapper";
		headerName.innerHTML = name;
		amountsContainer.id = num + "_amounts";
		amountsContainer.className = "amounts_container";
		addAmountButton.id = num + "_add_button";
		addAmountButton.className = "add_button";
		addAmountButton.innerHTML = "+";

		amountsContainers.push(amountsContainer);
		addAmountButtons.push(addAmountButton);

		personContainer.appendChild(headerName);
		personContainer.appendChild(amountsContainer);
		personContainer.appendChild(addAmountButton);

		return personContainer;
	}

	var AmountContainer = function(index, num, value) {
		var div = document.createElement("div");
		var amountInput = document.createElement("input");
		var numSpan = document.createElement("span");
		var removeButton = document.createElement("button");
		var config = (new AmountInput(index).config);

		div.className = "amount";
		numSpan.innerHTML = Number(num) + 1;
		removeButton.innerHTML = "X";

		// Set the default attributes for input field
		for (var conf in config) {
			amountInput[conf] = config[conf];
		}

		if (value !== null) {
			amountInput.value = value;
		}

		removeButton.addEventListener("click", removeAmountInput);
		div.appendChild(numSpan);
		div.appendChild(amountInput);
		div.appendChild(removeButton);
		return div;
	}

	// Event functions
	var addAmountInput = function(e) {
		e.preventDefault();
		var index = parseInt(e.target.id) - 1;
		fetchValues(index);
		cashup.persons[index].addAmount();
		render(index);
	}

	var removeAmountInput = function(e) {
		e.preventDefault();
		var target = e.target;
		var child = target.parentElement;
		var parent = child.parentElement;
		var personIndex = parseInt(parent.id) - 1;
		var index = Array.prototype.indexOf.call(parent.children, child);
		fetchValues(personIndex);
		cashup.persons[personIndex].removeAmount(index);
		render(personIndex);
	}

	// Update Data Structure, when buttons are pressed
	var fetchValues = function(index) {
		var amounts = cashup.persons[index].amounts;
		var len = amounts.length;
		for (var i = 0, amount, val; i < len; i++) {
			amount = amountsContainers[index]["children"][i];
			val = amount.querySelector("." + AmountInput.prototype.config.className).value;
			amounts[i].setValue(val);
		}
	}

	// Render Objects to html
	var render = function(index) {
		var amounts = cashup.persons[index].amounts;
		var len = amounts.length;
		clearContainer(amountsContainers[index]);
		for (var i = 0; i < len; i++) {
			amountsContainers[index].appendChild(AmountContainer(index, i, amounts[i].value));
		}
	}

	// Helper functions
	var clearContainer = function(container) {
		while (container.firstChild) {
			container.removeChild(container.firstChild);
		}
	}

	return {
		init: init,
		api: cashup,
		constructors: {
			Cashup: Cashup,
			Person: Person,
			Amount: Amount,
		},
	}
}());
