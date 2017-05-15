/*
Cashup2, The second version of the tool for calculating the owe value between 2 persons,
who share the costs in a household

Nikita Hovratov
github.com/nhovratov
*/

var cashup2 = (function() {
	// Contains the person structures
	var persons = [];
	// Dom objects
	var amountsContainers = []; // Holds the amounts of the persons
	var addAmountButtons = [];
	var calcButton;

	// Data Structures / Models
	// Person
	var Person = function(name) {
		this.name = name;
		this.amounts = [];
	}

	Person.prototype.addAmount = function(amount) {
		if (Object.getPrototypeOf(amount).constructor !== Amount) {
			console.error("Amount must be of type amount");
			return;
		}
		this.amounts.push(amount);
	}

	// Amount
	var Amount = function() {
		this.value = '';
	}

	Amount.prototype.setValue = function(val) {
		if (val !== '') {
			this.value = parseFloat(val);
		}
		this.value = val;
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

	AmountInput.prototype.getConfig = function() {
		return this.config;
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
		persons.push((new Person(config.names[0])));
		persons.push((new Person(config.names[1])));
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
		var name = persons[index].name;
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
		var config = (new AmountInput(index).getConfig());

		div.className = "amount";
		numSpan.innerHTML = Number(num) + 1;

		// Set the default attributes for input field
		for (var conf in config) {
			amountInput[conf] = config[conf];
		}

		if (value !== null) {
			amountInput.value = value;
		}

		div.appendChild(numSpan);
		div.appendChild(amountInput);
		return div; 
	}

	// Event functions
	var addAmountInput = function(e) {
		e.preventDefault();
		var index = parseInt(e.target.id) - 1;
		fetchValues(index);
		persons[index].addAmount((new Amount()));
		render(index);
	}

	// Update Data Structure, when buttons are pressed
	var fetchValues = function(index) {
		var amounts = persons[index].amounts;
		var len = amounts.length;
		for (var i = 0, amount, val; i < len; i++) {
			amount = amountsContainers[index]["children"][i];
			val = amount.querySelector("." + AmountInput.prototype.config.className).value;
			amounts[i].setValue(val);
		}
	}

	// Render Objects to html
	var render = function(index) {
		var amounts = persons[index].amounts;
		var len = amounts.length;
		var value;
		clearContainer(amountsContainers[index]);
		for (var i = 0; i < len; i++) {
			value = null;
			if (amounts[i].value !== '') {
				value = amounts[i].value;
			}
			amountsContainers[index].appendChild(AmountContainer(index, i, value));
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
		api: {
			Person: Person,
			Amount: Amount,
		},
	}
}());