/*
    Add your own costs, which you don't share with anyone to track your spended money!
 */

 define([
     'app/DefaultApp',
     'app/Amount',
     'app/Person',
     'app/PersonStorage',
     'app/Statusbox',
     'app/dateUtility'
 ], function (DefaultApp, Amount, Person, PersonStorage,  StatusBox, dateUtility) {
     "use strict";
    var app = new DefaultApp();

    var init = function (config) {
        app.personStorage = new PersonStorage();
        app.personStorage.db_persons = db_persons;
        app.personStorage.db_categories = db_categories;
        app.personStorage.id_category = db_categories[0].id_category;
        app.personStorage.addPerson(app.personStorage.db_persons[0]['vorname']);
        app.dom.appContainer = document.getElementById(config.id);
        app.personStorage.result = new StatusBox();
        app.personStorage.dbResult = new StatusBox();
        if (!app.dom.appContainer) {
            console.warn("Can't find the id in config.id");
            return;
        }
        // Setup dateUtility
        if (config.displayPastMonths) {
            dateUtility.displayPastMonths = config.displayPastMonths;
        }
        app.personStorage.lastMonths = dateUtility.getLastMonths();
        // Gets the template and renders the view
        app.getTemplate(config.templatePath);
        console.log(app.personStorage);
    };

    app.cacheDOM = function () {
        app.dom.selfcostForm        = app.dom.appContainer.querySelector   ("#selfcost_form");
        app.dom.addAmountButton     = app.dom.appContainer.querySelector   (".add_button");
        app.dom.removeAmountButtons = app.dom.appContainer.querySelectorAll(".amount_remove");
        app.dom.amountsContainers   = app.dom.appContainer.querySelectorAll(".amounts_container");
        app.dom.sumResult           = app.dom.appContainer.querySelector   ("#sum_result");
        app.dom.calcButton          = app.dom.appContainer.querySelector   ("#sum_calc");
        app.dom.selectPerson        = app.dom.appContainer.querySelector   ("#select_dbperson");
        app.dom.selectcategory      = app.dom.appContainer.querySelector   ("#select_category");
        app.dom.dbForm              = app.dom.appContainer.querySelector   ("#selfcost_db_form");
        app.dom.saveDbButton        = app.dom.appContainer.querySelector   ("#selfcost_save_button");
        app.dom.dbSum               = app.dom.appContainer.querySelector   ("#db_sum");

    };

    app.addEvents = function () {
        app.dom.addAmountButton.addEventListener("click", addAmountInputAction);
        Array.prototype.forEach.call(app.dom.removeAmountButtons, function (el) {
            el.addEventListener("click", removeAmountInputAction);
        });
        app.dom.calcButton.addEventListener("click", calculateSumAction);
        app.dom.selectPerson.addEventListener("change", selectPersonAction);
        app.dom.selectcategory.addEventListener("change", selectCategoryAction);
        app.dom.saveDbButton.addEventListener("click", saveAction);
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

     var calculateSumAction = function (e) {
         e.preventDefault();
         app.fetchValues();
         app.personStorage.result.text = 'Die Summe Beträgt: ' + app.personStorage.persons[0].getSum() + ' Euro.';
         app.personStorage.result.class = 'visible';
         app.render();
     };

     var selectPersonAction = function (e) {
       var index = Number(e.explicitOriginalTarget.value) - 1;
       app.personStorage.db_persons.forEach(function (el) {
          el["selected"] = "";
       });
       app.personStorage.persons[0].name = app.personStorage.db_persons[index].vorname;
       app.personStorage.persons[0].personId = app.personStorage.db_persons[index].id_person;
       app.personStorage.db_persons[index]["selected"] = "selected";
       app.render();
     };

     var selectCategoryAction = function (e) {
         var index = Number(e.explicitOriginalTarget.value) - 1;
         app.personStorage.db_categories.forEach(function (el) {
             el["selected"] = "";
         });
         app.personStorage.db_categories[index]["selected"] = "selected";
         app.personStorage.id_category = app.personStorage.db_categories[index].id_category;
         app.render();
     };

     var saveAction = function (e) {
         e.preventDefault();
         var xhttp = new XMLHttpRequest();
         xhttp.onreadystatechange = function () {
             if (this.readyState === 4 && this.status === 200) {
                 app.personStorage.reset();
                 app.personStorage.dbResult.text = this.responseText;
                 app.personStorage.dbResult.class = "visible";
                 app.personStorage.result.class = "hidden";
                 app.render();
             }
         };
         xhttp.open("POST", "Php/db.php", true);
         xhttp.send(new FormData(app.dom.dbForm));
     };

     return {
        init: init,
    }

 });