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
	var Person = function(name) {
		this.name = name;
		this.amounts = [];
	}

	Person.prototype.addItem = function(amount) {
		if (Object.getPrototypeOf(amount).constructor !== Amount) {
			console.error("Amount must be of type amount");
			return;
		}
		this.amounts.push(amount);
	}

	var Amount = function(index) {
		this.value = '';
		this.config.name = "amount_" + (index + 1) + "[]";
	}

	Amount.prototype.config = {
		className: "amount_input",
		required: "required",
		type: "number",
		step: "0.01",
	}

	Amount.prototype.setValue = function(val) {
		if (val !== '') {
			this.value = parseFloat(val);
		}
		this.value = val;
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
		addAmountButtons[0].addEventListener("click", addAmount);
		addAmountButtons[1].addEventListener("click", addAmount);
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

	// Event functions
	var addAmount = function(e) {
		e.preventDefault();
		var index = parseInt(e.target.id) - 1;
		fetchAllValues(index);
		persons[index].addItem((new Amount(index)));
		render(index);
	}

	// Update Data Structure, when buttons are pressed
	var fetchAllValues = function(index) {
		var items = persons[index].amounts;
		var len = items.length;
		var amount;
		var val;
		for (var item = 0; item < len; item++) {
			amount = amountsContainers[index]["children"][item];
			val = amount.querySelector("." + Amount.prototype.config.className).value;
			items[item].setValue(val);
		}
	}

	// Render function
	var render = function(index) {
		var items = persons[index].amounts;
		clearContainer(amountsContainers[index]);
		for (var item in items) {
			var amount = document.createElement("div");
			var input = document.createElement("input");
			var numeration = document.createElement("span");
			var config = items[item].config;
			numeration.innerHTML = Number(item) + 1;
			amount.className = "amount_Item";
			for (var conf in config) {
				input[conf] = config[conf];
			}
			if (items[item].value !== '') {
				input.value = items[item].value;
			}
			amount.appendChild(numeration);
			amount.appendChild(input);
			amountsContainers[index].appendChild(amount);
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
		persons: persons,
	}
}());