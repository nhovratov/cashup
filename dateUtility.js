var cashup2 = cashup2 || {};
// CashupDate Singleton
cashup2.dateUtility = (function(){
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
  //TODO Maybe remove this, since its not being called anymore from cashuo object
  // Bind the context to the cashup object
  dateUtility.getMonth = dateUtility.getMonth.bind(dateUtility);
  dateUtility.getLastMonths = dateUtility.getLastMonths.bind(dateUtility);

  return dateUtility;
}());
