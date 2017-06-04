/*
 cashup2, The second version of the tool for calculating the owe value between 2 persons,
 who share the costs in a household

 Nikita Hovratov
 github.com/nhovratov
 */

define(
    [
        'app/DefaultApp',
        'app/dateUtility',
        'app/Amount',
        'app/Person',
        'app/Cashup'
    ],
    function (DefaultApp, dateUtility, Amount, Person, Cashup) {
        "use strict";
        // The global app
        /** @type {DefaultApp} */
        var app = new DefaultApp();
        /** @type {Cashup} */
        app.personStorage = new Cashup();

    // Initialise app with passed config
    var init = function (config) {
        app.dom.appContainer = document.getElementById(config.id);
        if (!app.dom.appContainer) {
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
        app.personStorage.lastMonths = dateUtility.getLastMonths();

        // Add persons
        app.personStorage.addPerson(config.names[0]);
        app.personStorage.addPerson(config.names[1]);
        // Gets the template and renders the view
        app.getTemplate(config.templatePath);
    };

    // Interfaces to implement
    app.cacheDOM = function () {
        app.dom.addAmountButtons    = app.dom.appContainer.querySelectorAll  (".add_button");
        app.dom.calcButton          = app.dom.appContainer.querySelector     ("#cashup_calc");
        app.dom.amountsContainers   = app.dom.appContainer.querySelectorAll  (".amounts_container");
        app.dom.removeAmountButtons = app.dom.appContainer.querySelectorAll  (".amount_remove");
        app.dom.cashupResult        = app.dom.appContainer.querySelector     ("#cashup_result");
        app.dom.inputFields         = app.dom.appContainer.querySelectorAll  (".amount_input");
        app.dom.dbForm              = app.dom.appContainer.querySelector     ("#cashup_db");
        app.dom.dbSums              = app.dom.appContainer.querySelectorAll  (".db_sum");
        app.dom.dbOwn               = app.dom.appContainer.querySelectorAll  (".db_own_amount");
        app.dom.dbSave              = app.dom.appContainer.querySelector     ("#db_save");
        app.dom.dbResult            = app.dom.appContainer.querySelector     ("#db_result");
    };

    app.addEvents = function () {
        app.dom.addAmountButtons[0].addEventListener("click", addAmountInputAction);
        app.dom.addAmountButtons[1].addEventListener("click", addAmountInputAction);
        app.dom.calcButton.addEventListener("click", cashupAction);
        Array.prototype.forEach.call(app.dom.removeAmountButtons, function (el) {
            el.addEventListener("click", removeAmountInputAction);
        });
        Array.prototype.forEach.call(app.dom.inputFields, function (el) {
            el.addEventListener("keypress", addAmountInputAction);
        });
        app.dom.dbSave.addEventListener("click", saveAction);
    };

    // Event functions
    var addAmountInputAction = function (e) {
        if (e.constructor.name === "KeyboardEvent") {
            if (e.keyCode !== 13) {
                return;
            }
        }
        e.preventDefault();
        var parent = app.findParentByClassName(e.target, "amounts_wrapper");
        var index = parseInt(parent.id) - 1;
        app.fetchValues();
        app.personStorage.persons[index].addAmount();
        app.render();
        app.focusLastAddedInput(index);
    };


    var removeAmountInputAction = function (e) {
        e.preventDefault();
        var child = app.findParentByClassName(e.target, "amount");
        var parent = app.findParentByClassName(e.target, "amounts_container");
        var personIndex = parseInt(parent.id) - 1;
        var index = Array.prototype.indexOf.call(parent.children, child);
        app.fetchValues();
        app.personStorage.persons[personIndex].removeAmount(index);
        app.personStorage.persons[personIndex].renumberAmounts();
        app.render();
    };

    var cashupAction = function (e) {
        e.preventDefault();
        app.fetchValues();
        if (!app.personStorage.validateAmounts()) {
            app.render();
            app.dom.cashupResult.classList.remove("hidden");
            return false;
        }
        app.personStorage.cashup();
        app.personStorage.setRealSumOfPersons();
        app.render();
        app.dom.cashupResult.classList.remove("hidden");
        app.dom.dbForm.classList.remove("hidden");
    };

    var saveAction = function (e) {
        e.preventDefault();
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                app.personStorage.reset();
                app.personStorage.dbResult.text = this.responseText;
                app.personStorage.dbResult.class = "visible";
                app.dom.dbForm.classList.add("hidden");
                app.dom.cashupResult.classList.add("hidden");
                app.render();
            }
        };
        xhttp.open("POST", "Php/db.php", true);
        xhttp.send(new FormData(app.dom.dbForm));
    };

    return {
        init: init
    }
});
