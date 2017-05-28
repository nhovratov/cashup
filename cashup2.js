/*
Cashup2, The second version of the tool for calculating the owe value between 2 persons,
who share the costs in a household

Nikita Hovratov
github.com/nhovratov
*/
var cashup2 = cashup2 || {};

cashup2.cashup = (function() {
	// The global app
	var cashup = new Cashup();
	// Mustache template
	var template = '';
	var view = '';
	// Dom objects
	var dom = {};

	// Dependencies
	var Amount = cashup2.Amount;
	var Person = cashup2.Person;

	// Data Structures / Models
	// The app containing the persons
	function Cashup() {
		this.persons = [];
		this.result = new StatusBox();
		this.dbResult = new StatusBox();
		this.date;
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

	Cashup.prototype.validateAmounts = function() {
		var p1 = this.persons[0];
		var p2 = this.persons[1];
		var sum1 = Number(p1.getSum());
		var sum2 = Number(p2.getSum());

		if (sum1 < 0 || sum2 < 0) {
			this.result.text = "Negative Kosten sind dafür da, um Eigenkosten rauszufiltern. Bitte geben Sie einen positiven Grundbetrag an. " +
			"Um pure Eigenausgaben einzutragen, benutzen Sie das Formular für eigene Ausgaben."
			return false;
		}

		return true;
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
			this.result.text = due;
			return;
		}

		if (sum1 > sum2) {
			this.result.text =  p2.name + " schuldet " + p1.name + " " + due + "€";
		} else if (sum2 > sum1) {
			this.result.text =  p1.name + " schuldet " + p2.name + " " + due + "€";
		} else {
			this.result.text =  "Die Beträge sind ausgeglichen.";
		}

	}

	Cashup.prototype.getFullSum = function() {
		if (this.persons.length !== 2) {
			console.error("Only possible with 2 persons");
			return false;
		}
		var p1 = this.persons[0];
		var p2 = this.persons[1];
		var sum1 = Number(p1.getSum());
		var sum2 = Number(p2.getSum());
		var posSum = sum1 + sum2;
		return posSum.toFixed(2);
	}

	Cashup.prototype.setRealSumOfPersons = function() {
		var fullSum = this.getFullSum();
		this.persons.forEach(function(el) {
			el.realSum = ((Number(fullSum) / 2) + Number(el.getSumOfNegativeAmounts())).toFixed(2);
		});
	}

	Cashup.prototype.reset = function() {
		this.persons.forEach(function(person) {
			person.amounts = [];
		});
	}

	function StatusBox() {
		this.text = '';
		this.class = 'hidden';
	}

	// CashupDate Singleton
	var dateUtility = {
		displayPastMonths: 2,
		months: [
			"Januar",
			"Februar",
			"März",
			"April",
			"Mai",
			"Juni",
			"Juli",
			"August",
			"September",
			"Oktober",
			"November",
			"Dezember"
		],

		getMonth: function(index) {
			return this.months[index];
		},

		getLastMonths: function() {
			var dates = [];
			var date;
			for (var i = 0; i < this.displayPastMonths; i++) {
				date = this.getPastDate(i);
				dates.push(
					{
						displayString: this.getMonth(date.getMonth()) + " " + date.getFullYear(),
						value: this.getDateString(date)
					}
				);
			}
			return dates;
		},

		getDateString: function(date) {
			if (Object.getPrototypeOf(date).constructor !== Date) {
				console.warn("date parameter must be of type Date!");
				return;
			}
			return date.toISOString().substr(0, 10);
		},

		getPastDate: function(months) {
			var date = new Date();
			date.setMonth(date.getMonth() - months);
			date.setDate(1);
			return date;
		}
	}

	// Bind the context to the cashup object
	dateUtility.getMonth = dateUtility.getMonth.bind(dateUtility);
	dateUtility.getLastMonths = dateUtility.getLastMonths.bind(dateUtility);

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
		// Setup dateUtility
		if (config.displayPastMonths) {
			dateUtility.displayPastMonths = config.displayPastMonths;
		}
		// Get the current date
		cashup.date = dateUtility;
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
		dom.dbForm = dom.appContainer.querySelector("#cashup_db");
		dom.dbSums = dom.appContainer.querySelectorAll(".db_sum");
		dom.dbOwn = dom.appContainer.querySelectorAll(".db_own_amount");
		dom.dbSave = dom.appContainer.querySelector("#db_save");
		dom.dbResult = dom.appContainer.querySelector("#db_result");
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
		dom.dbSave.addEventListener("click", saveAction);
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
		if(!cashup.validateAmounts()) {
			render();
			dom.cashupResult.classList.remove("hidden");
			return false;
		}
		cashup.cashup();
		cashup.setRealSumOfPersons();
		render();
		dom.cashupResult.classList.remove("hidden");
		dom.dbForm.classList.remove("hidden");
	}

	var saveAction = function(e) {
		e.preventDefault();
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
		  if (this.readyState == 4 && this.status == 200) {
		  	cashup.reset();
		  	cashup.dbResult.text = this.responseText;
		  	cashup.dbResult.class = "visible";
		    dom.dbForm.classList.add("hidden");
		    dom.cashupResult.classList.add("hidden");
			render();
		  }
		};
		xhttp.open("POST", "db.php", true);
		xhttp.send(new FormData(dom.dbForm));
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
			Cashup: Cashup
		},
	}
}());
