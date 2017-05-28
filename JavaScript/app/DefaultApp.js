define(['lib/mustache'], function (Mustache) {

    function DefaultApp() {
        this.cashup = {};
        this.template = '';
        this.dom = {};
        this.dom.appContainer = {};
        this.dom.amountsContainers = {};
        // Interfaces
        this.init = function () {
        };
        this.cacheDOM = function () {
        };
        this.addEvents = function () {
        };
    }

    DefaultApp.prototype.getTemplate = function (path) {
        var xhttp = new XMLHttpRequest();
        var app = this;
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                app.template = this.responseText;
                Mustache.parse(this.template);
                app.render();
            }
        };
        xhttp.open("GET", path, true);
        xhttp.send();
    };

    // Render Objects to html
    DefaultApp.prototype.render = function () {
        this.dom.appContainer.innerHTML = Mustache.render(this.template, this.cashup);
        this.cacheDOM();
        this.addEvents();
    };

    // Update Data Structure, when buttons are pressed
    DefaultApp.prototype.fetchValues = function () {
        for (var i = 0; i < this.cashup.persons.length; i++) {
            var amounts = this.cashup.persons[i].amounts;
            var len = amounts.length;
            for (var k = 0, amount, val; k < len; k++) {
                amount = this.dom.amountsContainers[i]["children"][k];
                val = amount.querySelector(".amount_input").value;
                amounts[k].setValue(val);
            }
        }
    };

    DefaultApp.prototype.focusLastAddedInput = function (index) {
        var amountContainer = this.dom.amountsContainers[index];
        var amounts = this.cashup.persons[index].amounts;
        var lastIndex = amounts.length - 1;
        var lastInput = amountContainer.children[lastIndex].querySelector(".amount_input");
        lastInput.focus();
    };

    DefaultApp.prototype.findParentByClassName = function (element, className) {
        while (!element.classList.contains(className)) {
            element = element.parentElement;
        }
        return element;
    };

    return DefaultApp;
});
