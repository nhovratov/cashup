
define(function () {
    "use strict";
    return {
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

        getMonth: function (index) {
            return this.months[index];
        },

        getLastMonths: function () {
            var dates = [];
            var date;
            for (var i = 0; i < this.displayPastMonths; i++) {
                date = this.getPastDate(i);
                dates.push({
                        displayString: this.getMonth(date.getMonth()) + " " + date.getFullYear(),
                        value: this.getDateString(date)
                    }
                );
            }
            return dates;
        },

        getDateString: function (date) {
            if (Object.getPrototypeOf(date).constructor !== Date) {
                console.warn("date parameter must be of type Date!");
                return;
            }
            return date.toISOString().substr(0, 10);
        },

        getPastDate: function (months) {
            var date = new Date();
            date.setUTCMonth(date.getMonth() - months);
            date.setUTCDate(1);
            date.setUTCHours(0,0,0,0);
            return date;
        }
    }
});

