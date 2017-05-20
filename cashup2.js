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
	var template = '';
	var view = '';
	// Dom objects
	var dom = {};
	// Data Structures / Models
	// The app containing the persons
	function Cashup() {
		this.persons = [];
		this.result = '';
	}

	Cashup.prototype.addPerson = function(name) {
		var index;
		if (this.persons.length === 2) {
			console.error("Only 2 persons are allowed!");
			return;
		}
		index = this.persons.push(new Person(name));
		this.persons[this.persons.length - 1].personId = index;
	}

	Cashup.prototype.cashup = function(onlyDue = false) {
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
			this.result = due;
			return;
		}

		if (sum1 > sum2) {
			this.result =  p2.name + " schuldet " + p1.name + " " + due + "€";
		} else if (sum2 > sum1) {
			this.result =  p1.name + " schuldet " + p2.name + " " + due + "€";
		} else {
			this.result =  "Die Beträge sind ausgeglichen.";
		}

	}

	// Person
	function Person(name) {
		this.name = name;
		this.amounts = [];
		this.personId;
	}

	Person.prototype.addAmount = function(amount = null) {
		var index = this.amounts.push(new Amount(amount));
		this.amounts[this.amounts.length - 1].index = index;
	}

	Person.prototype.removeAmount = function(index) {
		this.amounts.splice(index, 1);
	}

	Person.prototype.getSum = function() {
		var sum = 0.00;
		this.amounts.forEach(function(el) {
			sum += el.getValue();
		});
		return sum.toFixed(2);
	}

	Person.prototype.renumberAmounts = function() {
		this.amounts.forEach(function(el, index){
			el.index = index + 1;
		});
	}

	Person.prototype.getSumOfNegativeAmounts = function() {
		var negativeSum = 0;
		this.amounts.forEach(function(el) {
			if (el.getValue() < 0) {
				negativeSum += el.getValue();
			}
		});
		return negativeSum.toFixed(2);
	}

	// Amount
	function Amount(value = null) {
		this.setValue(value);
		this.index;
	}

	Amount.prototype.setValue = function(val) {
		if (val !== '' && val !== null) {
			this.value = parseFloat(val);
		} else {
			this.value = null;
		}
	}

	Amount.prototype.getValue = function() {
		return this.value || 0;
	}

	// Initialise app with passed config
	var init = function(config) {
		dom.appContainer = document.getElementById(config.id);
		if (!dom.appContainer) {
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
		getTemplate(config.templatePath, render);
	}

	var cacheDOM = function() {
		dom.addAmountButtons = dom.appContainer.querySelectorAll(".add_button");
		dom.calcButton = dom.appContainer.querySelector("#cashup_calc");
		dom.amountsContainers = dom.appContainer.querySelectorAll(".amounts_container");
		dom.removeAmountButtons = dom.appContainer.querySelectorAll(".amount_remove");
		dom.cashupResult = dom.appContainer.querySelector("#cashup_result");
		dom.inputFields = dom.appContainer.querySelectorAll(".amount_input");
	}

	var addEvents = function() {
		dom.addAmountButtons[0].addEventListener("click", addAmountInputAction);
		dom.addAmountButtons[1].addEventListener("click", addAmountInputAction);
		dom.calcButton.addEventListener("click", cashupAction);
		Array.prototype.forEach.call(dom.removeAmountButtons, function(el) {
			el.addEventListener("click", removeAmountInputAction);
		});
		Array.prototype.forEach.call(dom.inputFields, function(el) {
			el.addEventListener("keypress", addAmountInputAction);
		});
	}

	var getTemplate = function(path, callback) {
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
		  if (this.readyState == 4 && this.status == 200) {
		    template = this.responseText;
				Mustache.parse(template);
				callback();
		  }
		};
		xhttp.open("GET", path, true);
		xhttp.send();
	}

	// Event functions
	var addAmountInputAction = function(e) {
		if (e.constructor.name === "KeyboardEvent") {
			if (e.keyCode !== 13) {
				return;
			}
		}
		e.preventDefault();
		var parent = findParentByClassName(e.target, "amounts_wrapper");
		var index = parseInt(parent.id) - 1;
		fetchValues();
		cashup.persons[index].addAmount();
		render();
		focusLastAddedInput(index);
	}

	var removeAmountInputAction = function(e) {
		e.preventDefault();
		var child = findParentByClassName(e.target, "amount");
		var parent = findParentByClassName(e.target, "amounts_container");
		var personIndex = parseInt(parent.id) - 1;
		var index = Array.prototype.indexOf.call(parent.children, child);
		fetchValues();
		cashup.persons[personIndex].removeAmount(index);
		cashup.persons[personIndex].renumberAmounts();
		render();
	}

	var cashupAction = function(e) {
		e.preventDefault();
		fetchValues();
		cashup.cashup();
		render();
		dom.cashupResult.classList.remove("hidden");
	}

	var focusLastAddedInput = function(index) {
		var amountContainer = dom.amountsContainers[index];
		var amounts = cashup.persons[index].amounts;
		var lastIndex = amounts.length - 1;
		var lastInput = amountContainer.children[lastIndex].querySelector(".amount_input");
		lastInput.focus();
	}

	var findParentByClassName = function(element, className) {
		while(!element.classList.contains(className)) {
			element = element.parentElement;
		}
		return element;
	}

	// Update Data Structure, when buttons are pressed
	var fetchValues = function() {
		for (var i = 0; i < 2; i++) {
			var amounts = cashup.persons[i].amounts;
			var len = amounts.length;
			for (var k = 0, amount, val; k < len; k++) {
				amount = dom.amountsContainers[i]["children"][k];
				val = amount.querySelector(".amount_input").value;
				amounts[k].setValue(val);
			}
		}
	}

	// Render Objects to html
	var render = function() {
		view = Mustache.render(template, cashup);
		dom.appContainer.innerHTML = view;
		cacheDOM();
		addEvents();
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
