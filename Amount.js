var cashup2 = cashup2 || {};

cashup2.Amount = (function(){
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

  return Amount;
}());
