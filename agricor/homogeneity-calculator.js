(function() {
  var $ = window.$ || jQuery;
  var CBD = 'cbd';
  var THC = 'thc';
  var passed = '#339966';
  var failed = '#ff0000';

  function initElements() {
    return {
      $labelClaim: null,
      $testResults: [],
      $enterButton: null,
      calculatorResults: {
        $mean: null,
        $stdDev: null,
        $relStdDev: null,
        $testResults: [],
        $testResult: null,
      },
    };
  }

  function initResults() {
    return {
      mean: undefined,
      percentVariance: undefined,
      relStdDev: undefined,
      stdDev: undefined,
    };
  }

  function isValueNumeric($el) {
    return !!($el.val() && !isNaN(Number($el.val())));
  }

  function HomogeneityCalculator() {
    this.elements = {};
    this.elements[CBD] = initElements();
    this.elements[THC] = initElements();

    this.results = {};
    this.results[CBD] = initResults();
    this.results[THC] = initResults();
  }

  HomogeneityCalculator.prototype.init = function() {
    this.getElements();
    this.applyBehavior();
  };

  HomogeneityCalculator.prototype.getElements = function() {
    var columns = [
      { id: '#thc-column', columnName: THC },
      { id: '#cbd-column', columnName: CBD },
    ];

    columns.forEach(function(element) {
      var $column = $(element.id);
      var column = this.elements[element.columnName];

      column.$labelClaim = $column.find('.label-claim');

      for (var i = 0; i < 4; i++) {
        column.$testResults[i] = $column.find('.input-test-results .test-result-' + i);
      }

      column.$enterButton = $column.find('.enter-button');

      var $calculatorResults = $column.find('.calculator-results-table');

      column.calculatorResults.$mean = $calculatorResults.find('.mean');
      column.calculatorResults.$stdDev = $calculatorResults.find('.std-dev');
      column.calculatorResults.$relStdDev = $calculatorResults.find('.rel-std-dev');

      for (var i = 0; i < 4; i++) {
        column.calculatorResults.$testResults[i] = $calculatorResults.find('.test-result-' + i);
      }

      column.calculatorResults.$testResult = $column.find('.test-result');
    }.bind(this));
  };

  HomogeneityCalculator.prototype.applyBehavior = function() {
    var handleChange = function(testType) {
      this.calculate(testType);
      this.displayCalculatorResults(testType);
    }.bind(this);

    [CBD, THC].forEach(function(testType) {
      this.elements[testType].$labelClaim.on('change', function() { handleChange(testType); });
      this.elements[testType].$testResults.forEach(function($testResult) {
        $testResult.on('change', function() { handleChange(testType); });
      });
    }.bind(this));
  };

  HomogeneityCalculator.prototype.calculate = function(testType) {
    var labelClaim = isValueNumeric(this.elements[testType].$labelClaim) ?
      Number(this.elements[testType].$labelClaim.val()) : undefined;

    // Ignore test result inputs with non-numeric values (for now?)
    var $validTestResults = this.elements[testType].$testResults.filter(isValueNumeric);

    var numbers = $validTestResults.map(function($validTestResult) {
      return Number($validTestResult.val());
    });

    var mean = numbers.reduce(function(acc, number) {
      return acc + number;
    }, 0) / numbers.length;

    var meanOfSquaredDifferences = numbers.reduce(function(acc, number) {
      return acc + Math.pow(number - mean, 2);
    }, 0) / numbers.length;

    this.results[testType].mean = mean.toFixed(2);
    this.results[testType].stdDev = Math.sqrt(meanOfSquaredDifferences).toFixed(2);
    this.results[testType].relStdDev = ((this.results[testType].stdDev * 100) / mean).toFixed(2);

    if (labelClaim !== undefined) {
      this.results[testType].percentVariance = ((labelClaim - mean) / labelClaim * 100).toFixed(2);
    } else {
      this.results[testType].percentVariance = undefined;
    }
  };

  HomogeneityCalculator.prototype.displayCalculatorResults = function(testType) {
    var labelClaim = isValueNumeric(this.elements[testType].$labelClaim) ?
      Number(this.elements[testType].$labelClaim.val()) : undefined;

    var calculatorResults = this.elements[testType].calculatorResults;

    // Calculate the percent variance for each valid test result and display in test results table
    this.elements[testType].$testResults.forEach(function($testResult, index) {
      if (isValueNumeric($testResult) && labelClaim !== undefined) {
        var testResult = Number($testResult.val());
        var percentVariance = (((testResult - labelClaim) / labelClaim) * 100).toFixed(2);

        calculatorResults.$testResults[index].text(percentVariance + '%');

        if (Math.abs(percentVariance) >= 15) {
          calculatorResults.$testResults[index].css('color', failed);
        } else {
          calculatorResults.$testResults[index].css('color', '');
        }
      }
    });

    // Display mean, relative standard deviation, and standard deviation in test results table
    if (!isNaN(this.results[testType].mean)) {
      calculatorResults.$mean.text(this.results[testType].mean);
    }

    if (!isNaN(this.results[testType].relStdDev)) {
      calculatorResults.$relStdDev.text(this.results[testType].relStdDev + '%');
    }

    if (this.results[testType].relStdDev >= 10) {
      calculatorResults.$relStdDev.css('color', failed);
    } else {
      calculatorResults.$relStdDev.css('color', '');
    }

    if (!isNaN(this.results[testType].stdDev)) {
      calculatorResults.$stdDev.text(this.results[testType].stdDev);
    }
  };

  $(document).ready(function() {
    if (window.location.href.match('homogeneity-calculator')) {
      window.HomogeneityCalculator = window.HomogeneityCalculator || new HomogeneityCalculator();
      window.HomogeneityCalculator.init();
    }
  });
})();
