(function() {
  var $ = window.$ || jQuery;

  function initElements() {
    return {
      labelClaim: null,
      testResults: [],
      enterButton: null,
      calculatorResults: {
        mean: null,
        stdDev: null,
        relStdDev: null,
        testResults: [],
        testResult: null,
      },
    };
  }

  function HomogeneityCalculator() {
    this.elements = {
      cbd: initElements(),
      thc: initElements(),
    };
  }

  HomogeneityCalculator.prototype.init = function() {
    if (window.location.href.match('homogeneity-calculato')) {
      this.getElements();
    }
  };

  HomogeneityCalculator.prototype.getElements = function() {
    var self = this;

    var columns = [
      { id: '#thc-column', columnName: 'thc' },
      { id: '#cbd-column', columnName: 'cbd' },
    ];

    columns.forEach(function(element) {
      var $column = $(element.id);
      var column = self.elements[element.columnName];

      column.labelClaim = $column.find('.label-claim');

      for (var i = 0; i < 4; i++) {
        column.testResults[i] = $column.find('.input-test-results .test-result-' + i);
      }

      column.enterButton = $column.find('.enter-button');

      var $calculatorResults = $column.find('.calculator-results-table');

      column.calculatorResults.mean = $calculatorResults.find('.mean');
      column.calculatorResults.stdDev = $calculatorResults.find('.std-dev');
      column.calculatorResults.relStdDev = $calculatorResults.find('.rel-std-dev');

      for (var i = 0; i < 4; i++) {
        column.calculatorResults.testResults[i] = $calculatorResults.find('.test-result-' + i);
      }

      column.calculatorResults.testResult = $column.find('.test-result');
    });
  };

  $(document).ready(function() {
    window.HomogeneityCalculator = window.HomogeneityCalculator || new HomogeneityCalculator();
    window.HomogeneityCalculator.init();
  });
})();
