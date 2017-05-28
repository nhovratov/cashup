/*
    Add your own costs, which you don't share with anyone to track your spended money!
 */

 define([
     'app/DefaultApp',
     'app/Amount',
     'app/Person',
     'app/Cashup',
     'app/Statusbox'
 ], function (DefaultApp, Amount, Person, Cashup,  StatusBox) {
     "use strict";
    var app = new DefaultApp();

    var init = function (config) {
        app.cashup = new Cashup();
        app.cashup.db_persons = db_persons;
        app.cashup.addPerson(app.cashup.db_persons[0]['vorname']);
        app.dom.appContainer = document.getElementById(config.id);
        app.cashup.dbResult = new StatusBox();
        if (!app.dom.appContainer) {
            console.warn("Can't find the id in config.id");
            return;
        }
        // Gets the template and renders the view
        app.getTemplate(config.templatePath);
    };

    app.cacheDOM = function () {
        app.dom.selfcostForm = app.dom.appContainer.querySelector("#selfcost_form");
        app.dom.addAmountButton = app.dom.appContainer.querySelector(".add_button");
        app.dom.removeAmountButtons = app.dom.appContainer.querySelectorAll(".amount_remove");
        app.dom.amountsContainers   = app.dom.appContainer.querySelectorAll(".amounts_container");
        app.dom.sumResult = app.dom.appContainer.querySelector("#sum_result");
        app.dom.calcButton          = app.dom.appContainer.querySelector("#sum_calc");
        app.dom.selectPerson = app.dom.appContainer.querySelector("#select_dbperson");
    };

    app.addEvents = function () {
        app.dom.addAmountButton.addEventListener("click", addAmountInputAction);
        Array.prototype.forEach.call(app.dom.removeAmountButtons, function (el) {
            el.addEventListener("click", removeAmountInputAction);
        });
        app.dom.calcButton.addEventListener("click", calculateSumAction);
        app.dom.selectPerson.addEventListener("change", selectPersonAction);
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
         app.cashup.persons[index].addAmount();
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
         app.cashup.persons[personIndex].removeAmount(index);
         app.cashup.persons[personIndex].renumberAmounts();
         app.render();
     };

     var calculateSumAction = function (e) {
         e.preventDefault();
         app.fetchValues();
         app.cashup.result.text = 'Die Summe Beträgt: ' + app.cashup.persons[0].getSum() + ' Euro.';
         app.cashup.result.class = 'visible';
         app.render();
     };

     var selectPersonAction = function (e) {
       var index = Number(e.explicitOriginalTarget.value) - 1;
       app.cashup.db_persons.forEach(function (el) {
          el["selected"] = "";
       });
       app.cashup.persons[0].name = app.cashup.db_persons[index].vorname;
       app.cashup.db_persons[index]["selected"] = "selected";
       app.render();
     };

    return {
        init: init,
    }

 });