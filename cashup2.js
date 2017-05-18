/*
Cashup2, The second version of the tool for calculating the owe value between 2 persons,
who share the costs in a household

Nikita Hovratov
github.com/nhovratov
*/

var cashup2 = (function() {
	// The global app
	var cashup = new Cashup();
	// Mustache template
	var template;
	var view;
	// Dom objects
	var appContainer;
	var amountsContainers; // Holds the amounts of the persons
	var addAmountButtons;
	var calcButton;
	var outputDiv;

	// Data Structures / Models
	// The app containing the persons
	function Cashup() {
		this.persons = [];
	}

	Cashup.prototype.addPerson = function(name) {
		var index;
		if (this.persons.length === 2) {
			console.error("Only 2 persons are allowed!");
			return;
		}
		index = this.persons.push(new Person(name));
		this.persons[this.persons.length - 1].index = index;
	}

	Cashup.prototype.cashup = function(onlyDue = false) {
		if (this.persons.length !== 2) {
			console.error("Cashup only possible with 2 persons");
			return false;
		}
		var p1 = this.persons[0];
		var p2 = this.persons[1];
		var sum1 = p1.getSum();
		var sum2 = p2.getSum();
		var diff = Math.abs(sum1 - sum2);
		var due = Number((diff / 2).toFixed(2));

		if (onlyDue) {
			return due;
		}

		if (sum1 > sum2) {
			return p2.name + " schuldet " + p1.name + " " + due + " Euro.";
		} else if (sum2 > sum1) {
			return p1.name + " schuldet " + p2.name + " " + due + " Euro.";
		} else {
			return "Die Beträge sind ausgeglichen";
		}

	}

	// Person
	function Person(name) {
		this.name = name;
		this.amounts = [];
		this.index;
	}

	Person.prototype.addAmount = function(amount = null) {
		this.amounts.push(new Amount(amount));
	}

	Person.prototype.removeAmount = function(index) {
		this.amounts.splice(index, 1);
	}

	Person.prototype.getSum = function() {
		if (this.amounts.length === 1) {
			return this.amounts[0].value;
		}
		var sum = this.amounts.reduce(function(res, element) {
			res = res.value || res;
			return Number(res) + Number(element.value);
		}, 0);
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
		appContainer = document.getElementById(config.id);
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
		// Gets the template and renders the view
		getTemplate(function() {
			// Cache Dom
			addAmountButtons = appContainer.querySelectorAll(".add_button");
			calcButton = appContainer.querySelector("#cashup_calc");
			amountsContainers = appContainer.querySelectorAll(".amounts_container");
			// Add events
			addAmountButtons[0].addEventListener("click", addAmountInputAction);
			addAmountButtons[1].addEventListener("click", addAmountInputAction);
			calcButton.addEventListener("click", cashupAction);
		});
	}

	var getTemplate = function(callback) {
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
		  if (this.readyState == 4 && this.status == 200) {
		    template = this.responseText;
				Mustache.parse(template);
				view = Mustache.render(template, cashup);
				appContainer.innerHTML = view;
				callback();
		  }
		};
		xhttp.open("GET", "template.mst", true);
		xhttp.send();
	}

	// Event functions
	var addAmountInputAction = function(e) {
		e.preventDefault();
		var index = parseInt(e.target.id) - 1;
		fetchValues(index);
		cashup.persons[index].addAmount();
		render();
	}

	var removeAmountInputAction = function(e) {
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

	var cashupAction = function(e) {
		e.preventDefault();
		fetchValues(0);
		fetchValues(1);
		var result = cashup.cashup();
		renderResult(result);
	}

	// Update Data Structure, when buttons are pressed
	var fetchValues = function(index) {
		var amounts = cashup.persons[index].amounts;
		var len = amounts.length;
		for (var i = 0, amount, val; i < len; i++) {
			amount = amountsContainers[index]["children"][i];
			val = amount.querySelector(".amount_input").value;
			amounts[i].setValue(val);
		}
	}

	// Render Objects to html
	var render = function() {
		Mustache.render(template, cashup);
	}

	var renderResult = function(result) {
		var para = document.createElement("p");
		para.innerHTML = result;
		clearContainer(outputDiv);
		outputDiv.appendChild(para);
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
